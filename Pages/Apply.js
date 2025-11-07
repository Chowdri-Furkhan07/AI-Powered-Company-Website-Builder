import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, CheckCircle, Sparkles, FileText,
  User, Mail, Phone, Briefcase, Link as LinkIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Apply() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('job');

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    linkedin_url: "",
    portfolio_url: "",
    experience_years: "",
    education: "",
    cover_letter: "",
    skills: ""
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: job } = useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const jobs = await base44.entities.JobPosting.list();
      return jobs.find(j => j.id === jobId);
    },
    enabled: !!jobId
  });

  const applyMutation = useMutation({
    mutationFn: async (data) => {
      setIsProcessing(true);

      let resumeUrl = null;
      let extractedData = null;
      let aiScore = null;
      let aiSummary = null;

      // Upload resume
      if (resumeFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: resumeFile });
        resumeUrl = file_url;

        // Extract data from resume using AI
        const extractionResult = await base44.integrations.Core.ExtractDataFromUploadedFile({
          file_url: resumeUrl,
          json_schema: {
            type: "object",
            properties: {
              name: { type: "string" },
              email: { type: "string" },
              phone: { type: "string" },
              skills: { type: "array", items: { type: "string" } },
              experience: { type: "string" },
              education: { type: "string" },
              certifications: { type: "array", items: { type: "string" } }
            }
          }
        });

        if (extractionResult.status === "success") {
          extractedData = extractionResult.output;
        }

        // Generate AI analysis
        const analysis = await base44.integrations.Core.InvokeLLM({
          prompt: `Analyze this candidate's application for the position of ${job.title}:
          
Job Requirements:
- Skills: ${job.skills?.join(', ')}
- Experience: ${job.experience_required}
- Requirements: ${job.requirements?.join(', ')}

Candidate Profile:
- Name: ${data.full_name}
- Experience: ${data.experience_years} years
- Skills: ${data.skills}
- Education: ${data.education}
- Cover Letter: ${data.cover_letter}

Provide:
1. A match score (0-100) based on how well the candidate fits the role
2. A brief summary (2-3 sentences) highlighting key strengths and any gaps`,
          response_json_schema: {
            type: "object",
            properties: {
              score: { type: "number" },
              summary: { type: "string" }
            }
          }
        });

        aiScore = analysis.score;
        aiSummary = analysis.summary;
      }

      // Parse skills
      const skillsArray = data.skills.split(',').map(s => s.trim()).filter(Boolean);

      // Create application
      const application = await base44.entities.Application.create({
        job_id: jobId,
        job_title: job.title,
        ...data,
        skills: skillsArray,
        resume_url: resumeUrl,
        ai_extracted_data: extractedData,
        ai_score: aiScore,
        ai_summary: aiSummary
      });

      // Send confirmation email
      const emailResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a professional and warm email confirmation for ${data.full_name} who just applied for the ${job.title} position at Mastersolis Infotech.
        
The email should:
- Thank them for their application
- Confirm we received their application
- Mention that our team will review their application carefully
- State that we'll contact them within 5-7 business days if they're selected for an interview
- Be encouraging and professional
- Sign off as "Mastersolis Recruitment Team"

Keep it concise (3-4 paragraphs).`
      });

      await base44.integrations.Core.SendEmail({
        from_name: "Mastersolis Careers",
        to: data.email,
        subject: `Application Received - ${job.title} at Mastersolis Infotech`,
        body: emailResponse
      });

      setIsProcessing(false);
      return application;
    },
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => {
        navigate(createPageUrl("Careers"));
      }, 3000);
    },
    onError: () => {
      setIsProcessing(false);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resumeFile) {
      alert('Please upload your resume');
      return;
    }
    applyMutation.mutate(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-lavender-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Job Info */}
        <Card className="mb-8 border-lavender-200 shadow-lg">
          <CardContent className="p-8">
            <Badge className="mb-4 bg-lavender-600 text-white">
              <Briefcase className="w-3 h-3 mr-1" />
              Applying For
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <p className="text-gray-600">{job.department} • {job.location} • {job.employment_type}</p>
          </CardContent>
        </Card>

        {showSuccess ? (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
              <p className="text-gray-600 mb-2">
                Thank you for applying to Mastersolis Infotech. We've received your application and sent a confirmation to your email.
              </p>
              <p className="text-gray-600">
                Redirecting you back to careers page...
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-lavender-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-lavender-600" />
                Application Form
              </CardTitle>
              <p className="text-gray-600">Fill out all required fields to submit your application</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <User className="w-5 h-5 mr-2 text-lavender-600" />
                    Personal Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        required
                        value={formData.full_name}
                        onChange={(e) => handleChange('full_name', e.target.value)}
                        placeholder="John Doe"
                        className="border-lavender-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="john@example.com"
                        className="border-lavender-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        required
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="border-lavender-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience *
                      </label>
                      <Input
                        required
                        type="number"
                        min="0"
                        value={formData.experience_years}
                        onChange={(e) => handleChange('experience_years', e.target.value)}
                        placeholder="5"
                        className="border-lavender-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Resume * (PDF, DOC, DOCX)
                  </label>
                  <div className="border-2 border-dashed border-lavender-300 rounded-lg p-6 text-center hover:border-lavender-400 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                      required
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      {resumeFile ? (
                        <div className="flex items-center justify-center text-lavender-600">
                          <FileText className="w-6 h-6 mr-2" />
                          <span className="font-medium">{resumeFile.name}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-lavender-500 mx-auto mb-2" />
                          <p className="text-gray-600">Click to upload your resume</p>
                          <p className="text-sm text-gray-500 mt-1">AI will analyze your resume automatically</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Professional Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-lavender-600" />
                    Professional Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills * (comma-separated)
                    </label>
                    <Input
                      required
                      value={formData.skills}
                      onChange={(e) => handleChange('skills', e.target.value)}
                      placeholder="React, Node.js, Python, AWS"
                      className="border-lavender-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education *
                    </label>
                    <Input
                      required
                      value={formData.education}
                      onChange={(e) => handleChange('education', e.target.value)}
                      placeholder="Bachelor's in Computer Science"
                      className="border-lavender-200"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn Profile
                      </label>
                      <Input
                        value={formData.linkedin_url}
                        onChange={(e) => handleChange('linkedin_url', e.target.value)}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="border-lavender-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portfolio URL
                      </label>
                      <Input
                        value={formData.portfolio_url}
                        onChange={(e) => handleChange('portfolio_url', e.target.value)}
                        placeholder="https://yourportfolio.com"
                        className="border-lavender-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter *
                    </label>
                    <Textarea
                      required
                      value={formData.cover_letter}
                      onChange={(e) => handleChange('cover_letter', e.target.value)}
                      placeholder="Tell us why you're a great fit for this role..."
                      rows={6}
                      className="border-lavender-200"
                    />
                  </div>
                </div>

                <Alert className="border-lavender-200 bg-lavender-50">
                  <Sparkles className="h-4 w-4 text-lavender-600" />
                  <AlertDescription className="text-gray-700">
                    Our AI will analyze your resume and match your skills with the job requirements. 
                    You'll receive an email confirmation once submitted.
                  </AlertDescription>
                </Alert>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-lavender-500 to-lavender-700 hover:from-lavender-600 hover:to-lavender-800 text-white"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Application with AI...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}