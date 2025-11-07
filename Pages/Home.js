import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  ArrowRight, Code, Users, Award, TrendingUp, 
  Star, Quote, ChevronRight, Sparkles, Zap, Target,
  CheckCircle, Rocket, Shield, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [heroText, setHeroText] = useState("");
  const fullText = "Transforming Ideas into Digital Excellence";
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setHeroText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const { data: services = [] } = useQuery({
    queryKey: ['services-home'],
    queryFn: () => base44.entities.ServiceItem.filter({ featured: true }, '-display_order', 3),
    initialData: [],
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials-home'],
    queryFn: () => base44.entities.Testimonial.filter({ featured: true }, '-created_date', 3),
    initialData: [],
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects-home'],
    queryFn: () => base44.entities.Project.filter({ featured: true }, '-created_date', 3),
    initialData: [],
  });

  const stats = [
    { icon: Code, value: "500+", label: "Projects Delivered", color: "from-purple-500 to-lavender-600" },
    { icon: Users, value: "200+", label: "Happy Clients", color: "from-pink-500 to-rose-600" },
    { icon: Award, value: "50+", label: "Industry Awards", color: "from-amber-500 to-orange-600" },
    { icon: TrendingUp, value: "98%", label: "Client Satisfaction", color: "from-emerald-500 to-teal-600" },
  ];

  const features = [
    {
      icon: Rocket,
      title: "Fast Delivery",
      description: "Quick turnaround without compromising quality",
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security and 99.9% uptime",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Serving clients across 30+ countries",
      gradient: "from-pink-500 to-rose-600"
    },
    {
      icon: Zap,
      title: "AI-Powered",
      description: "Leveraging cutting-edge AI technology",
      gradient: "from-yellow-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(167, 139, 250, 0.4); }
          50% { box-shadow: 0 0 40px rgba(167, 139, 250, 0.8); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .gradient-animate {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(167, 139, 250, 0.3);
        }
      `}</style>

      {/* Enhanced Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-lavender-800 to-pink-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-lavender-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
          
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-md text-lg px-6 py-2 animate-pulse-glow">
            <Sparkles className="w-5 h-5 mr-2" />
            AI-Powered Solutions
          </Badge>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 text-white">
            <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-lavender-200 bg-clip-text text-transparent">
              {heroText}
            </span>
            <span className="animate-pulse text-lavender-300">|</span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-lavender-100 mb-12 max-w-4xl mx-auto font-light leading-relaxed">
            We build innovative software solutions that drive business growth and digital transformation
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link to={createPageUrl("Contact")}>
              <Button size="lg" className="bg-gradient-to-r from-purple-500 via-lavender-500 to-pink-500 hover:from-purple-600 hover:via-lavender-600 hover:to-pink-600 text-white text-xl px-10 py-7 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 font-semibold gradient-animate">
                Get Started <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
            <Link to={createPageUrl("Projects")}>
              <Button size="lg" variant="outline" className="border-2 border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white text-xl px-10 py-7 rounded-2xl shadow-2xl font-semibold transform hover:scale-105 transition-all duration-300">
                View Our Work <ChevronRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
          </div>

          {/* Quick Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover-lift">
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1 text-sm">{feature.title}</h3>
                <p className="text-lavender-200 text-xs">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 bg-gradient-to-br from-white to-lavender-50 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="group text-center hover-lift">
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${stat.color} rounded-3xl mb-6 shadow-xl group-hover:shadow-2xl transform group-hover:rotate-6 transition-all duration-300`}>
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-semibold text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Services Preview */}
      <section className="py-24 bg-gradient-to-br from-lavender-50 via-purple-50 to-pink-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300 rounded-full filter blur-3xl opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-lg px-6 py-2 shadow-lg">
              <Zap className="w-5 h-5 mr-2" />
              Our Services
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              What We <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Offer</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive technology solutions tailored to your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {services.length > 0 ? services.map((service, index) => (
              <Card key={service.id} className="group hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden hover-lift bg-white">
                <div className={`h-3 bg-gradient-to-r ${
                  index === 0 ? 'from-purple-500 to-indigo-500' : 
                  index === 1 ? 'from-pink-500 to-rose-500' : 
                  'from-amber-500 to-orange-500'
                }`}></div>
                <CardContent className="p-8">
                  <div className={`w-20 h-20 bg-gradient-to-br ${
                    index === 0 ? 'from-purple-100 to-indigo-200' : 
                    index === 1 ? 'from-pink-100 to-rose-200' : 
                    'from-amber-100 to-orange-200'
                  } rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    <Target className={`w-10 h-10 ${
                      index === 0 ? 'text-purple-600' : 
                      index === 1 ? 'text-pink-600' : 
                      'text-amber-600'
                    }`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-purple-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3 text-lg leading-relaxed">
                    {service.description}
                  </p>
                  <Link to={createPageUrl("Services")} className="text-purple-600 hover:text-pink-600 font-bold inline-flex items-center text-lg group-hover:translate-x-2 transition-transform">
                    Learn More <ChevronRight className="w-5 h-5 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-3 text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Code className="w-12 h-12 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Services Coming Soon</h3>
                <p className="text-gray-600 text-lg">Our admin team is preparing amazing services for you.</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link to={createPageUrl("Services")}>
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                View All Services <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-24 bg-gradient-to-br from-white to-lavender-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-lg px-6 py-2 shadow-lg">
              <Star className="w-5 h-5 mr-2" />
              Testimonials
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              What Our <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Clients Say</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.length > 0 ? testimonials.map((testimonial, index) => (
              <Card key={testimonial.id} className="relative hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden hover-lift bg-gradient-to-br from-white to-lavender-50">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${
                  index === 0 ? 'from-purple-300 to-pink-300' :
                  index === 1 ? 'from-blue-300 to-cyan-300' :
                  'from-amber-300 to-orange-300'
                } rounded-full filter blur-3xl opacity-30 -mr-16 -mt-16`}></div>
                
                <CardContent className="p-8 relative z-10">
                  <Quote className="w-16 h-16 text-purple-300 mb-6" />
                  <p className="text-gray-700 mb-8 italic text-lg leading-relaxed line-clamp-4">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${
                      index === 0 ? 'from-purple-400 to-pink-600' :
                      index === 1 ? 'from-blue-400 to-cyan-600' :
                      'from-amber-400 to-orange-600'
                    } rounded-full flex items-center justify-center mr-4 shadow-lg`}>
                      <span className="text-white font-bold text-2xl">
                        {testimonial.client_name[0]}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{testimonial.client_name}</div>
                      <div className="text-sm text-gray-600">{testimonial.position}</div>
                      {testimonial.company && (
                        <div className="text-sm font-semibold text-purple-600">{testimonial.company}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex mt-6">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-3 text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-12 h-12 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Testimonials Coming Soon</h3>
                <p className="text-gray-600 text-lg">Share your experience with us!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-900 via-lavender-800 to-pink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-lavender-200 animate-pulse" />
          <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
            Ready to Transform Your Business?
          </h2>
          <p className="text-2xl mb-12 text-lavender-100 max-w-3xl mx-auto">
            Let's discuss how we can help you achieve your digital goals and drive innovation
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to={createPageUrl("Contact")}>
              <Button size="lg" className="bg-white text-purple-700 hover:bg-lavender-50 text-xl px-10 py-7 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold">
                Contact Us Today <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
            <Link to={createPageUrl("Careers")}>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/20 text-xl px-10 py-7 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold backdrop-blur-md">
                Join Our Team <ChevronRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}