import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, Phone, MapPin, Send, CheckCircle, 
  Sparkles, Clock, MessageSquare 
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    service_interest: "",
    budget_range: ""
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      // Create contact submission
      const submission = await base44.entities.ContactSubmission.create(data);
      
      // Generate AI response
      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a professional and warm email response for a contact form submission from ${data.name} (${data.email}). 
        They wrote: "${data.message}". 
        The email should:
        - Thank them for reaching out to Mastersolis Infotech
        - Acknowledge their inquiry
        - Mention that our team will review their message and get back to them within 24 hours
        - Be friendly, professional, and encouraging
        - Sign off as "The Mastersolis Team"
        Keep it concise (3-4 paragraphs).`
      });

      // Send automated email response
      await base44.integrations.Core.SendEmail({
        from_name: "Mastersolis Infotech",
        to: data.email,
        subject: `Thank you for contacting Mastersolis - We've received your message`,
        body: aiResponse
      });

      return submission;
    },
    onSuccess: () => {
      setShowSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
        service_interest: "",
        budget_range: ""
      });
      setTimeout(() => setShowSuccess(false), 5000);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lavender-600 to-lavender-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Get In Touch
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Let's Build Something Great Together
            </h1>
            <p className="text-xl text-lavender-100">
              We'd love to hear about your project. Reach out and let's start the conversation.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-lavender-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="border-lavender-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-lavender-100 to-lavender-200 rounded-xl flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-lavender-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
                  <p className="text-gray-600">info@mastersolis.com</p>
                  <p className="text-gray-600">support@mastersolis.com</p>
                </CardContent>
              </Card>

              <Card className="border-lavender-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-lavender-100 to-lavender-200 rounded-xl flex items-center justify-center mb-4">
                    <Phone className="w-6 h-6 text-lavender-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Call Us</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-gray-600">Mon-Fri: 9AM - 6PM EST</p>
                </CardContent>
              </Card>

              <Card className="border-lavender-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-lavender-100 to-lavender-200 rounded-xl flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-lavender-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Visit Us</h3>
                  <p className="text-gray-600">123 Tech Street</p>
                  <p className="text-gray-600">San Francisco, CA 94105</p>
                  <p className="text-gray-600">United States</p>
                </CardContent>
              </Card>

              <Card className="border-lavender-200 bg-gradient-to-br from-lavender-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <Clock className="w-5 h-5 text-lavender-600 mr-2" />
                    <h3 className="font-bold text-gray-900">Response Time</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    We typically respond to all inquiries within 24 hours during business days.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-lavender-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <MessageSquare className="w-6 h-6 mr-2 text-lavender-600" />
                    Send Us a Message
                  </CardTitle>
                  <p className="text-gray-600">Fill out the form below and we'll get back to you soon</p>
                </CardHeader>
                <CardContent>
                  {showSuccess && (
                    <Alert className="mb-6 border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Thank you! Your message has been sent successfully. Check your email for confirmation.
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
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
                          Phone Number
                        </label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          className="border-lavender-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <Input
                          value={formData.company}
                          onChange={(e) => handleChange('company', e.target.value)}
                          placeholder="Your Company"
                          className="border-lavender-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <Input
                        required
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        placeholder="How can we help you?"
                        className="border-lavender-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <Textarea
                        required
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        placeholder="Tell us more about your project..."
                        rows={6}
                        className="border-lavender-200"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service Interest
                        </label>
                        <Input
                          value={formData.service_interest}
                          onChange={(e) => handleChange('service_interest', e.target.value)}
                          placeholder="e.g., Web Development"
                          className="border-lavender-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Budget Range
                        </label>
                        <Input
                          value={formData.budget_range}
                          onChange={(e) => handleChange('budget_range', e.target.value)}
                          placeholder="e.g., $10,000 - $50,000"
                          className="border-lavender-200"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={submitMutation.isPending}
                      className="w-full bg-gradient-to-r from-lavender-500 to-lavender-700 hover:from-lavender-600 hover:to-lavender-800 text-white"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}