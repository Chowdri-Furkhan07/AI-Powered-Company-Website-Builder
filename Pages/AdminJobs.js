import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, ArrowLeft, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AdminJobs() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    employment_type: "Full-time",
    experience_required: "",
    description: "",
    responsibilities: "",
    requirements: "",
    skills: "",
    salary_range: "",
    status: "Active",
    posted_date: new Date().toISOString().split('T')[0]
  });

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['admin-jobs-manage'],
    queryFn: () => base44.entities.JobPosting.list('-posted_date'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.JobPosting.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs-manage'] });
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.JobPosting.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs-manage'] });
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.JobPosting.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs-manage'] });
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      department: "",
      location: "",
      employment_type: "Full-time",
      experience_required: "",
      description: "",
      responsibilities: "",
      requirements: "",
      skills: "",
      salary_range: "",
      status: "Active",
      posted_date: new Date().toISOString().split('T')[0]
    });
    setEditingJob(null);
    setShowDialog(false);
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title || "",
      department: job.department || "",
      location: job.location || "",
      employment_type: job.employment_type || "Full-time",
      experience_required: job.experience_required || "",
      description: job.description || "",
      responsibilities: job.responsibilities?.join('\n') || "",
      requirements: job.requirements?.join('\n') || "",
      skills: job.skills?.join(', ') || "",
      salary_range: job.salary_range || "",
      status: job.status || "Active",
      posted_date: job.posted_date || new Date().toISOString().split('T')[0]
    });
    setShowDialog(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      responsibilities: formData.responsibilities.split('\n').filter(Boolean),
      requirements: formData.requirements.split('\n').filter(Boolean),
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
    };

    if (editingJob) {
      updateMutation.mutate({ id: editingJob.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("AdminDashboard")}>
              <Button variant="ghost" className="hover:bg-lavender-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-gradient">Job Postings</h1>
          </div>
          <Button onClick={() => setShowDialog(true)} className="bg-gradient-to-r from-lavender-500 to-lavender-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Job
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="border-lavender-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-lavender-100 to-lavender-200 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-lavender-600" />
                  </div>
                  <Badge variant={job.status === "Active" ? "default" : "secondary"}>
                    {job.status}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {job.department} • {job.location} • {job.employment_type}
                </p>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(job)} className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => deleteMutation.mutate(job.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={showDialog} onOpenChange={(open) => !open && resetForm()}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingJob ? 'Edit' : 'Add'} Job Posting</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Job Title *</label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Senior Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Department *</label>
                  <Input
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="Engineering"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <Input
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="San Francisco, CA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Employment Type *</label>
                  <Select value={formData.employment_type} onValueChange={(value) => setFormData({...formData, employment_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Experience Required</label>
                  <Input
                    value={formData.experience_required}
                    onChange={(e) => setFormData({...formData, experience_required: e.target.value})}
                    placeholder="3-5 years"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Salary Range</label>
                  <Input
                    value={formData.salary_range}
                    onChange={(e) => setFormData({...formData, salary_range: e.target.value})}
                    placeholder="$100,000 - $150,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Posted Date</label>
                  <Input
                    type="date"
                    value={formData.posted_date}
                    onChange={(e) => setFormData({...formData, posted_date: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <Textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed job description..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Responsibilities (one per line)</label>
                <Textarea
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({...formData, responsibilities: e.target.value})}
                  placeholder="Design and implement features&#10;Write clean code&#10;Collaborate with team"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Requirements (one per line)</label>
                <Textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  placeholder="Bachelor's degree in CS&#10;5+ years experience&#10;Strong communication skills"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Skills (comma-separated)</label>
                <Input
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  placeholder="React, Node.js, TypeScript, AWS"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-lavender-500 to-lavender-700 text-white"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Job'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}