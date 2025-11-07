import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, Award, TrendingUp, Target, 
  CheckCircle, Sparkles, ArrowRight
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CaseStudies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudy, setSelectedStudy] = useState(null);

  const { data: caseStudies = [], isLoading } = useQuery({
    queryKey: ['case-studies'],
    queryFn: () => base44.entities.CaseStudy.list('-created_date'),
    initialData: [],
  });

  const filteredStudies = caseStudies.filter(study => 
    study.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-lavender-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 text-lg px-6 py-2">
              <Award className="w-5 h-5 mr-2" />
              Success Stories
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Client Case Studies
            </h1>
            <p className="text-xl text-lavender-100">
              Real results from real clients - see how we've helped businesses transform
            </p>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 bg-white border-b border-lavender-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search case studies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 border-purple-200 h-12"
            />
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 bg-gradient-to-br from-lavender-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredStudies.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredStudies.map((study, index) => (
                <Card 
                  key={study.id} 
                  className="group hover:shadow-2xl transition-all duration-500 border-2 border-purple-200 hover:border-purple-400 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedStudy(study)}
                >
                  <div className="relative h-64 bg-gradient-to-br from-purple-200 to-pink-200 overflow-hidden">
                    {study.image_url ? (
                      <img 
                        src={study.image_url} 
                        alt={study.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Award className="w-24 h-24 text-purple-600" />
                      </div>
                    )}
                    {study.featured && (
                      <Badge className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {study.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-purple-100 text-purple-700">
                        {study.client_name}
                      </Badge>
                      {study.industry && (
                        <Badge variant="outline" className="border-purple-300">
                          {study.industry}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {study.ai_summary || study.challenge}
                    </p>

                    {study.metrics && study.metrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {study.metrics.slice(0, 2).map((metric, idx) => (
                          <div key={idx} className="bg-purple-50 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{metric.value}</div>
                            <div className="text-sm text-gray-600">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {study.technologies && study.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {study.technologies.slice(0, 4).map((tech, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-lavender-100 text-lavender-700 text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Button variant="ghost" className="w-full text-purple-600 hover:bg-purple-50 group-hover:translate-x-2 transition-transform">
                      Read Full Case Study <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Case Studies Found</h3>
              <p className="text-gray-600">
                {searchTerm ? "Try adjusting your search" : "Case studies will be added soon"}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Case Study Detail Modal */}
      {selectedStudy && (
        <Dialog open={!!selectedStudy} onOpenChange={() => setSelectedStudy(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-3xl">{selectedStudy.title}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {selectedStudy.image_url && (
                <img 
                  src={selectedStudy.image_url} 
                  alt={selectedStudy.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}

              <div className="flex flex-wrap gap-2">
                <Badge className="bg-purple-600 text-white">{selectedStudy.client_name}</Badge>
                {selectedStudy.industry && (
                  <Badge variant="outline" className="border-purple-300">{selectedStudy.industry}</Badge>
                )}
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  The Challenge
                </h3>
                <p className="text-gray-700">{selectedStudy.challenge}</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                  Our Solution
                </h3>
                <p className="text-gray-700">{selectedStudy.solution}</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  The Results
                </h3>
                <p className="text-gray-700">{selectedStudy.results}</p>
              </div>

              {selectedStudy.metrics && selectedStudy.metrics.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-4">Key Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedStudy.metrics.map((metric, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-purple-600">{metric.value}</div>
                        <div className="text-sm text-gray-600">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedStudy.technologies && selectedStudy.technologies.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-4">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudy.technologies.map((tech, idx) => (
                      <Badge key={idx} className="bg-lavender-600 text-white">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
