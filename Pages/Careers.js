import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, MapPin, Clock, DollarSign, 
  ArrowRight, Sparkles, Users, TrendingUp,
  Heart, Award
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState(null);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => base44.entities.JobPosting.filter({ status: "Active" }, '-posted_date'),
    initialData: [],
  });

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Continuous learning and development opportunities"
    },
    {
      icon: Users,
      title: "Great Team",
      description: "Work with talented and passionate professionals"
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Competitive compensation and performance bonuses"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lavender-600 to-lavender-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Join Our Team
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Build Your Career With Us
            </h1>
            <p className="text-xl text-lavender-100">
              Join a team of innovators and help shape the future of technology
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Work at <span className="text-gradient">Mastersolis</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We offer more than just a job - we offer a career where you can grow and thrive
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-lavender-200 hover:shadow-lg transition-all text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-lavender-100 to-lavender-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-lavender-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-20 bg-gradient-to-br from-lavender-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Open <span className="text-gradient">Positions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect role for your skills and ambitions
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-6">
              {jobs.map((job) => (
                <Card key={job.id} className="group hover:shadow-xl transition-all duration-300 border-lavender-200 hover:border-lavender-400 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-lavender-500 to-lavender-700"></div>
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-lavender-100 to-lavender-200 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-7 h-7 text-lavender-600" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-lavender-600 transition-colors">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1 text-lavender-500" />
                                {job.location}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1 text-lavender-500" />
                                {job.employment_type}
                              </span>
                              <span className="flex items-center">
                                <Briefcase className="w-4 h-4 mr-1 text-lavender-500" />
                                {job.department}
                              </span>
                              {job.salary_range && (
                                <span className="flex items-center">
                                  <DollarSign className="w-4 h-4 mr-1 text-lavender-500" />
                                  {job.salary_range}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {job.description}
                        </p>

                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {job.skills.slice(0, 5).map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-lavender-100 text-lavender-700">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="lg:pl-8 border-t lg:border-t-0 lg:border-l border-lavender-200 pt-6 lg:pt-0">
                        <Link to={`${createPageUrl("Apply")}?job=${job.id}`}>
                          <Button className="w-full lg:w-auto bg-gradient-to-r from-lavender-500 to-lavender-700 hover:from-lavender-600 hover:to-lavender-800 text-white">
                            Apply Now
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-lavender-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-lavender-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Open Positions</h3>
              <p className="text-gray-600 mb-6">
                We don't have any open positions at the moment, but we're always looking for talented individuals.
              </p>
              <p className="text-gray-600">
                Feel free to send us your resume at <a href="mailto:careers@mastersolis.com" className="text-lavender-600 hover:text-lavender-700 font-semibold">careers@mastersolis.com</a>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-lavender-600 to-lavender-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Don't See the Right Role?
          </h2>
          <p className="text-xl mb-8 text-lavender-100">
            We're always interested in connecting with talented professionals. Send us your resume!
          </p>
          <a href="mailto:careers@mastersolis.com">
            <Button size="lg" className="bg-white text-lavender-700 hover:bg-lavender-50">
              Email Your Resume
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}