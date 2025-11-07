import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target, Eye, Heart, Users, Award, 
  Lightbulb, Rocket, Shield, Sparkles 
} from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We constantly push boundaries and embrace cutting-edge technologies to deliver future-ready solutions.",
      gradient: "from-purple-500 to-lavender-600"
    },
    {
      icon: Shield,
      title: "Integrity",
      description: "We build trust through transparency, honesty, and ethical practices in everything we do.",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: Heart,
      title: "Excellence",
      description: "We're committed to delivering exceptional quality and exceeding client expectations every time.",
      gradient: "from-pink-500 to-rose-600"
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe in the power of teamwork and work closely with clients to achieve shared success.",
      gradient: "from-amber-500 to-orange-600"
    },
    {
      icon: Rocket,
      title: "Agility",
      description: "We adapt quickly to changing requirements and market dynamics to deliver optimal results.",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: Award,
      title: "Impact",
      description: "We focus on creating meaningful solutions that drive real business value and growth.",
      gradient: "from-indigo-500 to-purple-600"
    }
  ];

  const milestones = [
    { year: "2015", event: "Company Founded", description: "Started our journey with a vision to transform businesses through technology" },
    { year: "2017", event: "First Major Client", description: "Delivered our first enterprise-scale project successfully" },
    { year: "2019", event: "100+ Projects", description: "Crossed the milestone of 100 successful project deliveries" },
    { year: "2021", event: "Global Expansion", description: "Expanded operations to serve clients across multiple continents" },
    { year: "2023", event: "AI Integration", description: "Integrated AI and ML capabilities into our core service offerings" },
    { year: "2025", event: "Industry Leader", description: "Recognized as a leading innovator in enterprise technology solutions" }
  ];

  const team = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      bio: "Visionary leader with 15+ years of experience in technology and business strategy.",
      expertise: ["Strategy", "Innovation", "Leadership"],
      gradient: "from-purple-400 to-lavender-600"
    },
    {
      name: "Sarah Chen",
      role: "Chief Technology Officer",
      bio: "Technology expert passionate about building scalable and innovative solutions.",
      expertise: ["Architecture", "AI/ML", "Cloud"],
      gradient: "from-pink-400 to-rose-600"
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Engineering",
      bio: "Engineering leader focused on building high-performing teams and quality products.",
      expertise: ["Development", "DevOps", "Quality"],
      gradient: "from-blue-400 to-cyan-600"
    },
    {
      name: "Emily Williams",
      role: "Head of Design",
      bio: "Creative director crafting beautiful and user-centric digital experiences.",
      expertise: ["UX/UI", "Branding", "Research"],
      gradient: "from-amber-400 to-orange-600"
    }
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
              About Us
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Innovating for a Digital Future
            </h1>
            <p className="text-xl text-lavender-100 leading-relaxed">
              We're a team of passionate technologists, designers, and strategists dedicated to transforming businesses through innovative technology solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-br from-lavender-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-lavender-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-lavender-600 bg-clip-text text-transparent mb-4">Our Mission</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To empower businesses worldwide with innovative technology solutions that drive growth, efficiency, and digital transformation. We strive to be the trusted partner for organizations seeking to leverage technology for competitive advantage.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-pink-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Eye className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">Our Vision</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To be the global leader in enterprise technology solutions, recognized for our innovation, excellence, and commitment to client success. We envision a future where technology seamlessly integrates with business to create unprecedented value.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg px-6 py-2">
              <Heart className="w-5 h-5 mr-2" />
              Our Values
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Core <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Principles</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide our work and define our culture
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-400 overflow-hidden hover:-translate-y-2">
                <div className={`h-2 bg-gradient-to-r ${value.gradient}`}></div>
                <CardContent className="p-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gradient-to-br from-lavender-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-lavender-500 to-purple-500 text-white text-lg px-6 py-2">
              <Award className="w-5 h-5 mr-2" />
              Our Journey
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Key <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Milestones</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A journey of growth and innovation
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-300 via-lavender-500 to-pink-500"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <Card className="border-2 border-purple-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                      <CardContent className="p-6">
                        <Badge className="mb-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg px-4 py-1">
                          {milestone.year}
                        </Badge>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{milestone.event}</h3>
                        <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="absolute left-8 md:left-1/2 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transform -translate-x-2.5 md:-translate-x-3 border-4 border-white shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-lavender-500 to-purple-500 text-white text-lg px-6 py-2">
              <Users className="w-5 h-5 mr-2" />
              Leadership
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Meet Our <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experienced leaders driving innovation and excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-2 border-purple-200 hover:shadow-2xl transition-all duration-300 text-center hover:-translate-y-2">
                <CardContent className="p-6">
                  <div className={`w-28 h-28 bg-gradient-to-br ${member.gradient} rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl`}>
                    <span className="text-white font-bold text-4xl">{member.name[0]}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-purple-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.bio}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((skill, idx) => (
                      <Badge key={idx} className="bg-purple-100 text-purple-700 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}