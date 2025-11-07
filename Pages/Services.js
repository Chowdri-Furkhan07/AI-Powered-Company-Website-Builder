import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Code, Database, Cloud, Smartphone, Globe, 
  Shield, ArrowRight, CheckCircle, Sparkles, Zap 
} from "lucide-react";

export default function Services() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.ServiceItem.list('-display_order'),
    initialData: [],
  });

  const iconMap = {
    Code, Database, Cloud, Smartphone, Globe, Shield
  };

  const gradients = [
    "from-purple-500 to-lavender-600",
    "from-pink-500 to-rose-600",
    "from-blue-500 to-cyan-600",
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-teal-600",
    "from-indigo-500 to-purple-600"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-lavender-600 to-pink-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 text-lg px-6 py-2 backdrop-blur-md">
              <Sparkles className="w-5 h-5 mr-2" />
              Our Services
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Comprehensive Technology Solutions
            </h1>
            <p className="text-xl text-lavender-100 leading-relaxed">
              From concept to deployment, we deliver end-to-end solutions that drive business success
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gradient-to-br from-lavender-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const IconComponent = iconMap[service.icon] || Code;
                const gradient = gradients[index % gradients.length];
                
                return (
                  <Card key={service.id} className="group hover:shadow-2xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-400 overflow-hidden hover:-translate-y-2">
                    <div className={`h-3 bg-gradient-to-r ${gradient}`}></div>
                    <CardHeader>
                      <div className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      <CardTitle className="text-2xl mb-2 group-hover:text-purple-600 transition-colors">{service.name}</CardTitle>
                      {service.tagline && (
                        <p className="text-purple-600 font-semibold">{service.tagline}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        {service.ai_description || service.description}
                      </p>

                      {service.features && service.features.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold mb-3 text-gray-900">Key Features:</h4>
                          <ul className="space-y-2">
                            {service.features.slice(0, 4).map((feature, idx) => (
                              <li key={idx} className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {service.technologies && service.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {service.technologies.map((tech, idx) => (
                            <Badge key={idx} className="bg-purple-100 text-purple-700">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <Link to={createPageUrl("Contact")}>
                        <Button className="w-full bg-gradient-to-r from-purple-500 via-lavender-500 to-pink-500 hover:from-purple-600 hover:via-lavender-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-base py-6">
                          Get Started <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Code className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Services Yet</h3>
              <p className="text-gray-600 mb-6">Services will be added soon by our admin team.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-lavender-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-white"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Zap className="w-16 h-16 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Need a Custom Solution?
          </h2>
          <p className="text-xl text-lavender-100 mb-8 leading-relaxed">
            We specialize in creating tailored solutions for unique business challenges
          </p>
          <Link to={createPageUrl("Contact")}>
            <Button size="lg" className="bg-white text-purple-700 hover:bg-lavender-50 text-xl px-10 py-7 rounded-xl shadow-2xl hover:shadow-white/50 transform hover:scale-105 transition-all duration-300 font-semibold">
              Contact Us <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}