import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, User, Tag, Eye, ArrowLeft, 
  Sparkles, Share2, ChevronDown
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ReactMarkdown from 'react-markdown';

export default function BlogPost() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');
  const [showSummary, setShowSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', postId],
    queryFn: async () => {
      const posts = await base44.entities.BlogPost.list();
      const foundPost = posts.find(p => p.id === postId);
      
      // Increment view count
      if (foundPost) {
        await base44.entities.BlogPost.update(postId, {
          views: (foundPost.views || 0) + 1
        });
      }
      
      return foundPost;
    },
    enabled: !!postId
  });

  const generateSummary = async () => {
    if (post.ai_summary) {
      setAiSummary(post.ai_summary);
      setShowSummary(true);
      return;
    }

    setLoadingSummary(true);
    const summary = await base44.integrations.Core.InvokeLLM({
      prompt: `Summarize this blog post in 3-4 concise bullet points that capture the key takeaways:\n\n${post.content}`
    });
    
    setAiSummary(summary);
    setShowSummary(true);
    setLoadingSummary(false);

    // Save summary for future use
    await base44.entities.BlogPost.update(postId, {
      ai_summary: summary
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lavender-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 to-white">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link to={createPageUrl("Blog")}>
          <Button variant="ghost" className="mb-8 hover:bg-lavender-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative h-96 rounded-2xl overflow-hidden mb-8 shadow-lg">
            <img 
              src={post.featured_image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          {post.category && (
            <Badge className="mb-4 bg-lavender-600 text-white">
              {post.category}
            </Badge>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-gray-600">
            {post.author && (
              <span className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-xs font-bold">{post.author[0]}</span>
                </div>
                {post.author}
              </span>
            )}
            {post.publish_date && (
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-lavender-500" />
                {formatDate(post.publish_date)}
              </span>
            )}
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-2 text-lavender-500" />
              {post.views || 0} views
            </span>
          </div>
        </header>

        {/* AI Summary Button */}
        <Card className="mb-8 border-lavender-200 bg-gradient-to-br from-white to-lavender-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Sparkles className="w-5 h-5 text-lavender-600 mr-2" />
                <h3 className="font-semibold text-gray-900">AI Quick Summary</h3>
              </div>
              <Button
                onClick={generateSummary}
                variant="outline"
                size="sm"
                disabled={loadingSummary}
                className="border-lavender-300 hover:bg-lavender-50"
              >
                {loadingSummary ? 'Generating...' : showSummary ? 'Hide Summary' : 'Show Summary'}
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showSummary ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            {showSummary && aiSummary && (
              <div className="text-gray-700 bg-white rounded-lg p-4 border border-lavender-200">
                <ReactMarkdown>{aiSummary}</ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content */}
        <Card className="mb-8 border-lavender-200 shadow-lg">
          <CardContent className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2 text-lavender-600" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="bg-lavender-100 text-lavender-700">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Share */}
        <Card className="border-lavender-200 bg-gradient-to-br from-lavender-600 to-lavender-800 text-white">
          <CardContent className="p-8 text-center">
            <Share2 className="w-8 h-8 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Found this helpful?</h3>
            <p className="mb-6 text-lavender-100">Share this article with your network</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Share on LinkedIn
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Share on Twitter
              </Button>
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  );
}