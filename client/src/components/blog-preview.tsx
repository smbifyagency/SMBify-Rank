import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatMarkdownToHtml } from '@/lib/blog-formatter';
import { Eye, ExternalLink, Calendar, User, Tag } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  metaTitle?: string;
  metaDescription?: string;
  category?: string;
  tags: string[];
  status: 'draft' | 'published';
  authorName?: string;
  isAiGenerated: boolean;
  keywords?: string[];
}

interface BlogPreviewProps {
  post: BlogPost;
  onClose: () => void;
}

export function BlogPreview({ post, onClose }: BlogPreviewProps) {
  const formattedContent = formatMarkdownToHtml(post.content);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <CardTitle>Blog Post Preview</CardTitle>
              {post.isAiGenerated && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  AI Generated
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="#" className="flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  View on Website
                </a>
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
            {/* Blog Post Preview */}
            <article className="max-w-none">
              {/* Header */}
              <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                  <div className="flex items-center gap-6 text-blue-100">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{post.authorName || 'Author'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Today</span>
                    </div>
                    {post.category && (
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        <span>{post.category}</span>
                      </div>
                    )}
                  </div>
                  {post.excerpt && (
                    <p className="mt-4 text-lg leading-relaxed text-blue-50">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </header>

              {/* Featured Image */}
              {post.featuredImageUrl && (
                <div className="relative h-64 bg-gray-100">
                  <img
                    src={post.featuredImageUrl}
                    alt={post.featuredImageAlt || post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="max-w-4xl mx-auto p-8">
                <div 
                  className="prose prose-lg prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: `<p class="mb-4 leading-relaxed text-gray-700">${formattedContent}</p>` 
                  }}
                />

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-3">Tags</h3>
                    <div className="flex gap-2 flex-wrap">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keywords (for AI posts) */}
                {post.keywords && post.keywords.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Keywords</h3>
                    <div className="flex gap-2 flex-wrap">
                      {post.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* SEO Meta (if different from main content) */}
                {(post.metaTitle && post.metaTitle !== post.title) || 
                 (post.metaDescription && post.metaDescription !== post.excerpt) ? (
                  <div className="mt-8 pt-6 border-t bg-gray-50 -mx-8 px-8 py-6">
                    <h3 className="text-lg font-semibold mb-3">SEO Information</h3>
                    {post.metaTitle && post.metaTitle !== post.title && (
                      <div className="mb-3">
                        <label className="text-sm font-medium text-gray-600">Meta Title:</label>
                        <p className="text-sm">{post.metaTitle}</p>
                      </div>
                    )}
                    {post.metaDescription && post.metaDescription !== post.excerpt && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Meta Description:</label>
                        <p className="text-sm">{post.metaDescription}</p>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </article>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}