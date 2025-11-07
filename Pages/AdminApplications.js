import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Users, Search, Filter, Download, 
  ExternalLink, Star, FileText, ArrowLeft 
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AdminApplications() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState(null);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['admin-applications-full'],
    queryFn: () => base44.entities.Application.list('-created_date'),
    initialData: [],
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Application.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-applications-full'] });
    }
  });

  // Filter applications
  const filteredApps = applications.filter(app => {
    const matchesSearch = app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.job_title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesScore = scoreFilter === "all" || 
      (scoreFilter === "high" && app.ai_score >= 70) ||
      (scoreFilter === "medium" && app.ai_score >= 40 && app.ai_score < 70) ||
      (scoreFilter === "low" && app.ai_score < 40);
    return matchesSearch && matchesStatus && matchesScore;
  });

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Job Title", "Experience", "AI Score", "Status", "Applied Date"];
    const rows = filteredApps.map(app => [
      app.full_name,
      app.email,
      app.phone,
      app.job_title,
      `${app.experience_years} years`,
      app.ai_score || "N/A",
      app.status,
      new Date(app.created_date).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `applications_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getScoreBadge = (score) => {
    if (!score) return null;
    if (score >= 70) return <Badge className="bg-green-100 text-green-700">High Match: {score}%</Badge>;
    if (score >= 40) return <Badge className="bg-yellow-100 text-yellow-700">Medium Match: {score}%</Badge>;
    return <Badge className="bg-red-100 text-red-700">Low Match: {score}%</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("AdminDashboard")}>
              <Button variant="ghost" className="hover:bg-lavender-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                <span className="text-gradient">Applications</span>
              </h1>
              <p className="text-gray-600">Manage and review job applications</p>
            </div>
          </div>
          <Button onClick={exportToCSV} variant="outline" className="border-lavender-300">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-lavender-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by name, email, or job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-lavender-200"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="md:w-48 border-lavender-200">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Reviewing">Reviewing</SelectItem>
                  <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Hired">Hired</SelectItem>
                </SelectContent>
              </Select>

              <Select value={scoreFilter} onValueChange={setScoreFilter}>
                <SelectTrigger className="md:w-48 border-lavender-200">
                  <Star className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="AI Score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scores</SelectItem>
                  <SelectItem value="high">High Match (70%+)</SelectItem>
                  <SelectItem value="medium">Medium Match (40-69%)</SelectItem>
                  <SelectItem value="low">Low Match (&lt;40%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredApps.length} of {applications.length} applications
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))
          ) : filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <Card key={app.id} className="border-lavender-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{app.full_name[0]}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{app.full_name}</h3>
                          <p className="text-gray-600">{app.email}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary" className="bg-lavender-100 text-lavender-700">
                          {app.job_title}
                        </Badge>
                        <Badge variant="outline">
                          {app.experience_years} years exp
                        </Badge>
                        {getScoreBadge(app.ai_score)}
                        <Badge variant={app.status === "New" ? "default" : "secondary"}>
                          {app.status}
                        </Badge>
                      </div>

                      {app.ai_summary && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {app.ai_summary}
                        </p>
                      )}

                      <div className="text-sm text-gray-500">
                        Applied: {new Date(app.created_date).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 lg:w-48">
                      <Select
                        value={app.status}
                        onValueChange={(status) => updateStatusMutation.mutate({ id: app.id, status })}
                      >
                        <SelectTrigger className="border-lavender-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Reviewing">Reviewing</SelectItem>
                          <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                          <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                          <SelectItem value="Hired">Hired</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-lavender-300"
                          onClick={() => setSelectedApp(app)}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                        {app.resume_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-lavender-300"
                            onClick={() => window.open(app.resume_url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-lavender-200">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Application Details Dialog */}
      {selectedApp && (
        <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Application Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-lg font-semibold">{selectedApp.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-lg">{selectedApp.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-lg">{selectedApp.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Experience</label>
                  <p className="text-lg">{selectedApp.experience_years} years</p>
                </div>
              </div>

              {selectedApp.skills && selectedApp.skills.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.skills.map((skill, idx) => (
                      <Badge key={idx} className="bg-lavender-100 text-lavender-700">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedApp.education && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Education</label>
                  <p className="text-lg">{selectedApp.education}</p>
                </div>
              )}

              {selectedApp.ai_summary && (
                <div className="bg-lavender-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600 block mb-2">AI Analysis</label>
                  <p className="text-gray-700">{selectedApp.ai_summary}</p>
                </div>
              )}

              {selectedApp.cover_letter && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Cover Letter</label>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedApp.cover_letter}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                {selectedApp.linkedin_url && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedApp.linkedin_url, '_blank')}
                    className="flex-1"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                )}
                {selectedApp.portfolio_url && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedApp.portfolio_url, '_blank')}
                    className="flex-1"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Portfolio
                  </Button>
                )}
                {selectedApp.resume_url && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedApp.resume_url, '_blank')}
                    className="flex-1"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Resume
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}