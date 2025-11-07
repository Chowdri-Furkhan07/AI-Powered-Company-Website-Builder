import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard, Briefcase, FileText, MessageSquare,
  Users, Code, FolderOpen, Mail, Star, Award,
  Plus, TrendingUp, Eye
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const currentUser = await base44.auth.me();
      if (currentUser.role !== 'admin') {
        navigate(createPageUrl("Home"));
        return;
      }
      setUser(currentUser);
    };
    checkAdmin();
  }, [navigate]);

  const { data: jobs = [] } = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: () => base44.entities.JobPosting.list(),
    initialData: [],
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['admin-applications'],
    queryFn: () => base44.entities.Application.list('-created_date'),
    initialData: [],
  });

  const { data: blogPosts = [] } = useQuery({
    queryKey: ['admin-blog'],
    queryFn: () => base44.entities.BlogPost.list('-created_date'),
    initialData: [],
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: () => base44.entities.ContactSubmission.list('-created_date'),
    initialData: [],
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => base44.entities.Project.list(),
    initialData: [],
  });

  const { data: services = [] } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => base44.entities.ServiceItem.list(),
    initialData: [],
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => base44.entities.Testimonial.list(),
    initialData: [],
  });

  const { data: caseStudies = [] } = useQuery({
    queryKey: ['admin-case-studies'],
    queryFn: () => base44.entities.CaseStudy.list(),
    initialData: [],
  });

  const stats = [
    { icon: Briefcase, label: "Job Postings", value: jobs.length, color: "lavender", link: "AdminJobs" },
    { icon: Users, label: "Applications", value: applications.length, color: "blue", link: "AdminApplications" },
    { icon: FileText, label: "Blog Posts", value: blogPosts.length, color: "green", link: "AdminBlog" },
    { icon: Mail, label: "Contact Forms", value: contacts.filter(c => c.status === "New").length, color: "orange", link: "AdminContacts" },
    { icon: FolderOpen, label: "Projects", value: projects.length, color: "purple", link: "AdminProjects" },
    { icon: Code, label: "Services", value: services.length, color: "pink", link: "AdminServices" },
    { icon: Star, label: "Testimonials", value: testimonials.length, color: "yellow", link: "AdminTestimonials" },
    { icon: Award, label: "Case Studies", value: caseStudies.length, color: "indigo", link: "AdminCaseStudies" },
  ];

  const recentApplications = applications.slice(0, 5);
  const recentContacts = contacts.slice(0, 5);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lavender-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-gray-600">Welcome back, {user.full_name || user.email}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Link key={index} to={createPageUrl(stat.link)}>
              <Card className="hover:shadow-lg transition-all border-lavender-200 hover:border-lavender-400 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <Card className="border-lavender-200 shadow-lg">
            <CardHeader className="border-b border-lavender-200">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-lavender-600" />
                  Recent Applications
                </CardTitle>
                <Link to={createPageUrl("AdminApplications")}>
                  <Button variant="ghost" size="sm" className="text-lavender-600">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {recentApplications.length > 0 ? (
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-lavender-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{app.full_name}</div>
                        <div className="text-sm text-gray-600">{app.job_title}</div>
                        {app.ai_score && (
                          <Badge className="mt-1 bg-lavender-100 text-lavender-700">
                            Match: {app.ai_score}%
                          </Badge>
                        )}
                      </div>
                      <Badge variant={app.status === "New" ? "default" : "secondary"}>
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No applications yet</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Contact Forms */}
          <Card className="border-lavender-200 shadow-lg">
            <CardHeader className="border-b border-lavender-200">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-lavender-600" />
                  Recent Contact Forms
                </CardTitle>
                <Link to={createPageUrl("AdminContacts")}>
                  <Button variant="ghost" size="sm" className="text-lavender-600">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {recentContacts.length > 0 ? (
                <div className="space-y-4">
                  {recentContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 bg-lavender-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{contact.name}</div>
                        <div className="text-sm text-gray-600 line-clamp-1">{contact.subject}</div>
                      </div>
                      <Badge variant={contact.status === "New" ? "default" : "secondary"}>
                        {contact.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No contact forms yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 border-lavender-200 shadow-lg bg-gradient-to-br from-white to-lavender-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2 text-lavender-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Link to={createPageUrl("AdminJobs")}>
                <Button className="w-full bg-gradient-to-r from-lavender-500 to-lavender-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Job
                </Button>
              </Link>
              <Link to={createPageUrl("AdminBlog")}>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Blog Post
                </Button>
              </Link>
              <Link to={createPageUrl("AdminProjects")}>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </Link>
              <Link to={createPageUrl("AdminServices")}>
                <Button className="w-full bg-gradient-to-r from-pink-500 to-pink-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}