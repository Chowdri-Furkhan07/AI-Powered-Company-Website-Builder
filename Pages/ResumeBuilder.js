import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, Trash2, Download, Send, Sparkles, 
  FileText, Wand2, Save, Eye
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ResumeBuilder() {
  const [template, setTemplate] = useState("modern");
  const [resumeData, setResumeData] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    summary: "",
    experience: [],
    education: [],
    skills: [],
    certifications: []
  });
  const [showPreview, setShowPreview] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: jobs = [] } = useQuery({
    queryKey: ['active-jobs'],
    queryFn: () => base44.entities.JobPosting.filter({ status: "Active" }, '-posted_date'),
    initialData: [],
  });

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, {
        title: "",
        company: "",
        location: "",
        start_date: "",
        end_date: "",
        current: false,
        description: ""
      }]
    });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, {
        degree: "",
        institution: "",
        location: "",
        graduation_year: "",
        gpa: ""
      }]
    });
  };

  const generateAISuggestions = async () => {
    setIsGenerating(true);
    const suggestions = await base44.integrations.Core.InvokeLLM({
      prompt: `Based on this resume information:
Name: ${resumeData.full_name}
Current Role: ${resumeData.experience[0]?.title || "N/A"}
Skills: ${resumeData.skills.join(", ") || "N/A"}

Provide professional suggestions for:
1. A compelling professional summary (2-3 sentences)
2. 5 additional relevant skills to consider adding
3. 3 power words to enhance job descriptions

Format as JSON.`,
      response_json_schema: {
        type: "object",
        properties: {
          summary: { type: "string" },
          skills: { type: "array", items: { type: "string" } },
          power_words: { type: "array", items: { type: "string" } }
        }
      }
    });
    setAiSuggestions(suggestions);
    setIsGenerating(false);
  };

  const downloadResume = () => {
    const resumeHTML = generateResumeHTML();
    const blob = new Blob([resumeHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumeData.full_name.replace(/\s+/g, '_')}_Resume.html`;
    link.click();
  };

  const generateResumeHTML = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #333; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #967BB6; padding-bottom: 20px; }
    .header h1 { margin: 0; color: #967BB6; font-size: 32px; }
    .contact { margin: 10px 0; font-size: 14px; }
    .section { margin: 25px 0; }
    .section-title { color: #967BB6; font-size: 20px; font-weight: bold; border-bottom: 2px solid #E6E6FA; padding-bottom: 5px; margin-bottom: 15px; }
    .experience-item, .education-item { margin-bottom: 20px; }
    .item-title { font-weight: bold; font-size: 16px; }
    .item-subtitle { color: #666; font-style: italic; margin: 5px 0; }
    .skills { display: flex; flex-wrap: wrap; gap: 10px; }
    .skill-badge { background: #E6E6FA; color: #967BB6; padding: 5px 15px; border-radius: 15px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${resumeData.full_name}</h1>
    <div class="contact">
      ${resumeData.email} | ${resumeData.phone} | ${resumeData.location}
      ${resumeData.linkedin ? `| LinkedIn: ${resumeData.linkedin}` : ''}
      ${resumeData.portfolio ? `| Portfolio: ${resumeData.portfolio}` : ''}
    </div>
  </div>

  ${resumeData.summary ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <p>${resumeData.summary}</p>
  </div>` : ''}

  ${resumeData.experience.length > 0 ? `
  <div class="section">
    <div class="section-title">Experience</div>
    ${resumeData.experience.map(exp => `
      <div class="experience-item">
        <div class="item-title">${exp.title}</div>
        <div class="item-subtitle">${exp.company} | ${exp.location} | ${exp.start_date} - ${exp.current ? 'Present' : exp.end_date}</div>
        <p>${exp.description}</p>
      </div>
    `).join('')}
  </div>` : ''}

  ${resumeData.education.length > 0 ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${resumeData.education.map(edu => `
      <div class="education-item">
        <div class="item-title">${edu.degree}</div>
        <div class="item-subtitle">${edu.institution} | ${edu.location} | ${edu.graduation_year}</div>
        ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${resumeData.skills.length > 0 ? `
  <div class="section">
    <div class="section-title">Skills</div>
    <div class="skills">
      ${resumeData.skills.map(skill => `<span class="skill-badge">${skill}</span>`).join('')}
    </div>
  </div>` : ''}

  ${resumeData.certifications.length > 0 ? `
  <div class="section">
    <div class="section-title">Certifications</div>
    <ul>
      ${resumeData.certifications.map(cert => `<li>${cert}</li>`).join('')}
    </ul>
  </div>` : ''}
</body>
</html>`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-lavender-50 to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg px-6 py-2">
            <Sparkles className="w-5 h-5 mr-2" />
            AI-Powered Resume Builder
          </Badge>
          <h1 className="text-5xl font-bold mb-4">
            Create Your <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Professional Resume</span>
          </h1>
          <p className="text-xl text-gray-600">Build an ATS-friendly resume with AI assistance in minutes</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Resume Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Selection */}
            <Card className="border-2 border-purple-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-purple-600" />
                  Choose Template
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger className="border-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern Professional</SelectItem>
                    <SelectItem value="classic">Classic Traditional</SelectItem>
                    <SelectItem value="creative">Creative Designer</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="border-2 border-purple-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name *"
                    value={resumeData.full_name}
                    onChange={(e) => setResumeData({...resumeData, full_name: e.target.value})}
                    className="border-purple-200"
                  />
                  <Input
                    placeholder="Email *"
                    type="email"
                    value={resumeData.email}
                    onChange={(e) => setResumeData({...resumeData, email: e.target.value})}
                    className="border-purple-200"
                  />
                  <Input
                    placeholder="Phone *"
                    value={resumeData.phone}
                    onChange={(e) => setResumeData({...resumeData, phone: e.target.value})}
                    className="border-purple-200"
                  />
                  <Input
                    placeholder="Location"
                    value={resumeData.location}
                    onChange={(e) => setResumeData({...resumeData, location: e.target.value})}
                    className="border-purple-200"
                  />
                  <Input
                    placeholder="LinkedIn URL"
                    value={resumeData.linkedin}
                    onChange={(e) => setResumeData({...resumeData, linkedin: e.target.value})}
                    className="border-purple-200"
                  />
                  <Input
                    placeholder="Portfolio URL"
                    value={resumeData.portfolio}
                    onChange={(e) => setResumeData({...resumeData, portfolio: e.target.value})}
                    className="border-purple-200"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Professional Summary</label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={generateAISuggestions}
                      disabled={isGenerating}
                      className="border-purple-300"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      {isGenerating ? "Generating..." : "AI Suggest"}
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Brief professional summary..."
                    value={resumeData.summary}
                    onChange={(e) => setResumeData({...resumeData, summary: e.target.value})}
                    rows={4}
                    className="border-purple-200"
                  />
                  {aiSuggestions?.summary && (
                    <Alert className="mt-2 border-purple-200 bg-purple-50">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <AlertDescription>
                        <strong>AI Suggestion:</strong> {aiSuggestions.summary}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setResumeData({...resumeData, summary: aiSuggestions.summary})}
                          className="ml-2"
                        >
                          Use This
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="border-2 border-purple-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex justify-between items-center">
                  <CardTitle>Work Experience</CardTitle>
                  <Button onClick={addExperience} size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="p-4 border-2 border-purple-100 rounded-lg bg-purple-50/50">
                    <div className="flex justify-between mb-4">
                      <h4 className="font-semibold text-purple-700">Experience #{index + 1}</h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const newExp = resumeData.experience.filter((_, i) => i !== index);
                          setResumeData({...resumeData, experience: newExp});
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Job Title *"
                        value={exp.title}
                        onChange={(e) => {
                          const newExp = [...resumeData.experience];
                          newExp[index].title = e.target.value;
                          setResumeData({...resumeData, experience: newExp});
                        }}
                        className="border-purple-200"
                      />
                      <Input
                        placeholder="Company *"
                        value={exp.company}
                        onChange={(e) => {
                          const newExp = [...resumeData.experience];
                          newExp[index].company = e.target.value;
                          setResumeData({...resumeData, experience: newExp});
                        }}
                        className="border-purple-200"
                      />
                      <Input
                        placeholder="Location"
                        value={exp.location}
                        onChange={(e) => {
                          const newExp = [...resumeData.experience];
                          newExp[index].location = e.target.value;
                          setResumeData({...resumeData, experience: newExp});
                        }}
                        className="border-purple-200"
                      />
                      <Input
                        placeholder="Start Date"
                        type="month"
                        value={exp.start_date}
                        onChange={(e) => {
                          const newExp = [...resumeData.experience];
                          newExp[index].start_date = e.target.value;
                          setResumeData({...resumeData, experience: newExp});
                        }}
                        className="border-purple-200"
                      />
                      <Input
                        placeholder="End Date"
                        type="month"
                        value={exp.end_date}
                        onChange={(e) => {
                          const newExp = [...resumeData.experience];
                          newExp[index].end_date = e.target.value;
                          setResumeData({...resumeData, experience: newExp});
                        }}
                        disabled={exp.current}
                        className="border-purple-200"
                      />
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => {
                            const newExp = [...resumeData.experience];
                            newExp[index].current = e.target.checked;
                            setResumeData({...resumeData, experience: newExp});
                          }}
                          className="w-4 h-4 text-purple-600"
                        />
                        <span className="text-sm">Currently working here</span>
                      </label>
                    </div>
                    <Textarea
                      placeholder="Description of responsibilities and achievements..."
                      value={exp.description}
                      onChange={(e) => {
                        const newExp = [...resumeData.experience];
                        newExp[index].description = e.target.value;
                        setResumeData({...resumeData, experience: newExp});
                      }}
                      rows={3}
                      className="mt-4 border-purple-200"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="border-2 border-purple-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex justify-between items-center">
                  <CardTitle>Education</CardTitle>
                  <Button onClick={addEducation} size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="p-4 border-2 border-purple-100 rounded-lg bg-purple-50/50">
                    <div className="flex justify-between mb-4">
                      <h4 className="font-semibold text-purple-700">Education #{index + 1}</h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const newEdu = resumeData.education.filter((_, i) => i !== index);
                          setResumeData({...resumeData, education: newEdu});
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Degree *"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEdu = [...resumeData.education];
                          newEdu[index].degree = e.target.value;
                          setResumeData({...resumeData, education: newEdu});
                        }}
                        className="border-purple-200"
                      />
                      <Input
                        placeholder="Institution *"
                        value={edu.institution}
                        onChange={(e) => {
                          const newEdu = [...resumeData.education];
                          newEdu[index].institution = e.target.value;
                          setResumeData({...resumeData, education: newEdu});
                        }}
                        className="border-purple-200"
                      />
                      <Input
                        placeholder="Location"
                        value={edu.location}
                        onChange={(e) => {
                          const newEdu = [...resumeData.education];
                          newEdu[index].location = e.target.value;
                          setResumeData({...resumeData, education: newEdu});
                        }}
                        className="border-purple-200"
                      />
                      <Input
                        placeholder="Graduation Year"
                        value={edu.graduation_year}
                        onChange={(e) => {
                          const newEdu = [...resumeData.education];
                          newEdu[index].graduation_year = e.target.value;
                          setResumeData({...resumeData, education: newEdu});
                        }}
                        className="border-purple-200"
                      />
                      <Input
                        placeholder="GPA (Optional)"
                        value={edu.gpa}
                        onChange={(e) => {
                          const newEdu = [...resumeData.education];
                          newEdu[index].gpa = e.target.value;
                          setResumeData({...resumeData, education: newEdu});
                        }}
                        className="border-purple-200"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-2 border-purple-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Input
                  placeholder="Add skills separated by commas (e.g., React, Node.js, Python)"
                  value={resumeData.skills.join(", ")}
                  onChange={(e) => setResumeData({...resumeData, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                  className="border-purple-200 mb-4"
                />
                {aiSuggestions?.skills && (
                  <Alert className="border-purple-200 bg-purple-50">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <AlertDescription>
                      <strong>AI Suggested Skills:</strong>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {aiSuggestions.skills.map((skill, idx) => (
                          <Badge
                            key={idx}
                            className="bg-purple-100 text-purple-700 cursor-pointer hover:bg-purple-200"
                            onClick={() => {
                              if (!resumeData.skills.includes(skill)) {
                                setResumeData({...resumeData, skills: [...resumeData.skills, skill]});
                              }
                            }}
                          >
                            + {skill}
                          </Badge>
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                <div className="flex flex-wrap gap-2 mt-4">
                  {resumeData.skills.map((skill, idx) => (
                    <Badge key={idx} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            <Card className="border-2 border-purple-200 shadow-xl sticky top-24">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Button
                  onClick={() => setShowPreview(!showPreview)}
                  variant="outline"
                  className="w-full border-purple-300 hover:bg-purple-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showPreview ? "Hide" : "Show"} Preview
                </Button>

                <Button
                  onClick={downloadResume}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>

                {jobs.length > 0 && (
                  <div className="pt-4 border-t border-purple-200">
                    <label className="text-sm font-medium mb-2 block">Apply to Job</label>
                    <Select>
                      <SelectTrigger className="border-purple-200 mb-2">
                        <SelectValue placeholder="Select a job" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobs.map(job => (
                          <SelectItem key={job.id} value={job.id}>
                            {job.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Application
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {aiSuggestions?.power_words && (
              <Card className="border-2 border-amber-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <CardTitle className="flex items-center text-amber-700">
                    <Wand2 className="w-5 h-5 mr-2" />
                    Power Words
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 mb-3">Use these in your descriptions:</p>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.power_words.map((word, idx) => (
                      <Badge key={idx} className="bg-amber-100 text-amber-700">
                        {word}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <div className="flex justify-between items-center">
                  <CardTitle>Resume Preview</CardTitle>
                  <Button variant="ghost" onClick={() => setShowPreview(false)} className="text-white">
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div dangerouslySetInnerHTML={{ __html: generateResumeHTML() }} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}