import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, Calendar, User, Tag, Eye, 
  ArrowRight, Sparkles, BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => base44.entities.BlogPost.filter({ published: true }, '-publish_date'),
    initialData: [],
  });

  // Extract unique categories
  const categories = ["all", ...new Set(posts.map(p => p.category).filter(Boolean))];

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lavender-600 to-lavender-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Blog & News
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Insights & Updates
            </h1>
            <p className="text-xl text-lavender-100">
              Stay updated with the latest trends, insights, and news from Mastersolis
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-white border-b border-lavender-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-lavender-200"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat 
                    ? "bg-gradient-to-r from-lavender-500 to-lavender-700 text-white" 
                    : "border-lavender-300 hover:bg-lavender-50"}
                >
                  {cat === "all" ? "All" : cat}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 bg-gradient-to-br from-lavender-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-2xl transition-all duration-300 border-lavender-200 hover:border-lavender-400 overflow-hidden">
                  <div className="relative h-48 bg-gradient-to-br from-lavender-200 to-lavender-300 overflow-hidden">
                    {post.featured_image ? (
                      <img 
                        src={post.featured_image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-lavender-600" />
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    {post.category && (
                      <Badge className="w-fit mb-2 bg-lavender-100 text-lavender-700">
                        {post.category}
                      </Badge>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-lavender-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt || post.content?.substring(0, 150) + '...'}
                    </p>

                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                      {post.author && (
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1 text-lavender-500" />
                          {post.author}
                        </span>
                      )}
                      {post.publish_date && (
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-lavender-500" />
                          {formatDate(post.publish_date)}
                        </span>
                      )}
                      {post.views > 0 && (
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1 text-lavender-500" />
                          {post.views} views
                        </span>
                      )}
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-lavender-300">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Link to={`${createPageUrl("BlogPost")}?id=${post.id}`}>
                      <Button variant="ghost" className="w-full text-lavender-600 hover:bg-lavender-50">
                        Read More <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-lavender-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-lavender-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {searchTerm || selectedCategory !== "all" ? "No Posts Found" : "No Blog Posts Yet"}
              </h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search or filters"
                  : "Check back soon for insights and updates"}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}