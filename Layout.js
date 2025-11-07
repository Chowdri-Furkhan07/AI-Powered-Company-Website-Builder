import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { 
  Menu, X, ChevronDown, Home, Briefcase, Code, 
  FolderOpen, Mail, Users, MessageSquare, LogOut, LayoutDashboard,
  Award, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AIChatbot from "@/components/AIChatbot";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    };
    checkAuth();
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const publicNavItems = [
    { name: "Home", path: createPageUrl("Home"), icon: Home },
    { name: "About", path: createPageUrl("About"), icon: Users },
    { name: "Services", path: createPageUrl("Services"), icon: Code },
    { name: "Projects", path: createPageUrl("Projects"), icon: FolderOpen },
    { name: "Case Studies", path: createPageUrl("CaseStudies"), icon: Award },
    { name: "Careers", path: createPageUrl("Careers"), icon: Briefcase },
    { name: "Blog", path: createPageUrl("Blog"), icon: MessageSquare },
    { name: "Contact", path: createPageUrl("Contact"), icon: Mail },
  ];

  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F3F0FF]">
      <style>{`
        :root {
          --lavender-50: #FAF8FF;
          --lavender-100: #F3F0FF;
          --lavender-200: #E6E6FA;
          --lavender-300: #C9C5E8;
          --lavender-400: #B19CD9;
          --lavender-500: #967BB6;
          --lavender-600: #7C5FB8;
          --lavender-700: #6B4FA3;
          --lavender-800: #563E85;
          --lavender-900: #42316B;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(150, 123, 182, 0.15);
        }

        .glass-effect-dark {
          background: rgba(75, 50, 120, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .glow-lavender {
          box-shadow: 0 0 30px rgba(150, 123, 182, 0.5);
        }

        .text-gradient {
          background: linear-gradient(135deg, var(--lavender-600), var(--lavender-800));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(150, 123, 182, 0.3), transparent);
          transition: left 0.5s;
        }

        .nav-button:hover::before {
          left: 100%;
        }

        .nav-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(150, 123, 182, 0.3);
        }

        .nav-button.active {
          background: linear-gradient(135deg, #967BB6, #7C5FB8);
          color: white;
          box-shadow: 0 4px 15px rgba(150, 123, 182, 0.4);
        }

        .nav-button.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 3px;
          background: linear-gradient(90deg, transparent, white, transparent);
          border-radius: 2px;
        }

        .mobile-menu-enter {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .logo-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(150, 123, 182, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(150, 123, 182, 0.8);
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-effect shadow-2xl' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center space-x-3 group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-lavender-500 to-pink-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 logo-glow shadow-xl">
                <span className="text-white font-bold text-2xl">M</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Mastersolis
                </h1>
                <p className="text-xs text-gray-500 font-medium">Infotech Solutions</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {publicNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`nav-button px-4 py-2.5 rounded-xl text-sm font-semibold ${
                    location.pathname === item.path
                      ? 'active'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-lavender-100 hover:to-purple-100 hover:text-purple-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link to={createPageUrl("ResumeBuilder")}>
                <Button variant="outline" className="border-2 border-purple-300 hover:bg-purple-50 rounded-xl shadow-md">
                  <FileText className="w-4 h-4 mr-2" />
                  Build Resume
                </Button>
              </Link>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-2 border-purple-300 hover:bg-purple-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center mr-2 shadow-md">
                        <span className="text-white text-sm font-bold">
                          {user.full_name?.[0] || user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <span className="mr-2 font-semibold">{user.full_name || user.email}</span>
                      <ChevronDown className="w-4 h-4 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 glass-effect border-purple-200 shadow-xl">
                    {isAdmin && (
                      <DropdownMenuItem asChild className="cursor-pointer hover:bg-purple-50 rounded-lg transition-colors">
                        <Link to={createPageUrl("AdminDashboard")} className="flex items-center">
                          <LayoutDashboard className="w-4 h-4 mr-3 text-purple-600" />
                          <span className="font-medium">Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer hover:bg-red-50 rounded-lg transition-colors font-medium">
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={() => base44.auth.redirectToLogin()} 
                  className="bg-gradient-to-r from-purple-500 via-lavender-500 to-pink-500 hover:from-purple-600 hover:via-lavender-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
                >
                  Login
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2.5 rounded-xl hover:bg-purple-100 transition-all duration-300 shadow-md hover:shadow-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-purple-700" />
              ) : (
                <Menu className="w-6 h-6 text-purple-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-effect border-t border-purple-200 shadow-2xl mobile-menu-enter">
            <div className="px-4 py-6 space-y-3">
              {publicNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-5 py-4 rounded-xl transition-all duration-300 font-semibold ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}

              <Link
                to={createPageUrl("ResumeBuilder")}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-5 py-4 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all font-semibold border-2 border-purple-200"
              >
                <FileText className="w-5 h-5" />
                <span>Build Resume</span>
              </Link>
              
              <div className="pt-6 border-t border-purple-200">
                {user ? (
                  <>
                    <div className="px-5 py-3 text-sm text-gray-600 font-medium bg-purple-50 rounded-lg mb-3">
                      {user.full_name || user.email}
                    </div>
                    {isAdmin && (
                      <Link
                        to={createPageUrl("AdminDashboard")}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-5 py-4 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all font-semibold"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-5 py-4 rounded-xl text-red-600 hover:bg-red-50 w-full transition-all font-semibold"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      base44.auth.redirectToLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl py-4 shadow-lg font-semibold"
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* AI Chatbot */}
      <AIChatbot />

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-purple-900 via-lavender-900 to-pink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-2xl">M</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Mastersolis Infotech</h3>
                  <p className="text-lavender-200 text-sm font-medium">Innovative Tech Solutions</p>
                </div>
              </div>
              <p className="text-lavender-200 mb-6 text-lg leading-relaxed">
                Empowering businesses with cutting-edge technology solutions and exceptional service.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to={createPageUrl("About")} className="text-lavender-200 hover:text-white transition-colors hover:translate-x-2 inline-block duration-300">About Us</Link></li>
                <li><Link to={createPageUrl("Services")} className="text-lavender-200 hover:text-white transition-colors hover:translate-x-2 inline-block duration-300">Services</Link></li>
                <li><Link to={createPageUrl("Projects")} className="text-lavender-200 hover:text-white transition-colors hover:translate-x-2 inline-block duration-300">Projects</Link></li>
                <li><Link to={createPageUrl("Careers")} className="text-lavender-200 hover:text-white transition-colors hover:translate-x-2 inline-block duration-300">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Contact</h4>
              <ul className="space-y-3 text-lavender-200">
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  info@mastersolis.com
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📞</span>
                  +1 (555) 123-4567
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📍</span>
                  <span>123 Tech Street<br/>City, State 12345</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-lavender-200 text-lg">&copy; 2025 Mastersolis Infotech. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}