import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { BlogPreview } from '@/components/blog-preview';
import { AIBlogEditor } from '@/components/ai-blog-editor';
import { Eye, Edit, Trash2, Search, FileText, Calendar, User, Tag } from 'lucide-react';
import type { BusinessData } from '@shared/schema';

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

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface BlogPostsManagerProps {
  businessData: BusinessData;
  onChange: (data: Partial<BusinessData>) => void;
}

export function BlogPostsManager({ businessData, onChange }: BlogPostsManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [previewingPost, setPreviewingPost] = useState<BlogPost | null>(null);

  const typedBlogPosts = (businessData.blogPosts || []) as unknown as BlogPost[];
  const blogCategories = businessData.blogCategories || [];

  // Filter posts based on search and category
  const filteredPosts = typedBlogPosts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.keywords?.some((keyword: string | Record<string, any>) =>
        typeof keyword === 'string' && keyword.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
  };

  const handleSavePost = (updatedPost: BlogPost) => {
    const updatedPosts = typedBlogPosts.map(post =>
      post.id === updatedPost.id ? updatedPost : post
    );
    onChange({ blogPosts: updatedPosts as any });
    setEditingPost(null);
  };

  const handleDeletePost = (postId: string) => {
    const updatedPosts = typedBlogPosts.filter(post => post.id !== postId);
    onChange({ blogPosts: updatedPosts as any });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUniqueCategories = () => {
    const categories = new Set(typedBlogPosts.map(post => post.category).filter(Boolean));
    return Array.from(categories);
  };

  if (typedBlogPosts.length === 0) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-blue-900 mb-2">No Blog Posts Generated Yet</h3>
          <p className="text-blue-700 mb-4">
            Generate blog posts using AI to see them appear here. You'll be able to view, edit, and manage all your content.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6" />
            Generated Blog Posts ({typedBlogPosts.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-blog-search"
                />
              </div>
            </div>

            {getUniqueCategories().length > 1 && (
              <div className="sm:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  data-testid="select-blog-category"
                >
                  <option value="all">All Categories</option>
                  {getUniqueCategories().map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Blog Posts Grid */}
          <ScrollArea className="h-96">
            <div className="grid gap-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="border-gray-200 hover:border-green-300 transition-colors" data-testid={`card-blog-post-${post.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900 truncate" data-testid={`text-blog-title-${post.id}`}>
                            {post.title}
                          </h3>
                          {post.isAiGenerated && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                              AI Generated
                            </Badge>
                          )}
                          <Badge variant="outline">
                            {post.status}
                          </Badge>
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2" data-testid={`text-blog-excerpt-${post.id}`}>
                          {post.excerpt}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          {post.category && (
                            <div className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              <span>{post.category}</span>
                            </div>
                          )}
                          {post.authorName && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{post.authorName}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Today</span>
                          </div>
                        </div>

                        {post.keywords && post.keywords.length > 0 && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {post.keywords.slice(0, 3).map((keyword, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {typeof keyword === 'string' ? keyword : String(keyword)}
                                </Badge>
                              ))}
                              {post.keywords.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{post.keywords.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewingPost(post)}
                          data-testid={`button-preview-${post.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPost(post)}
                          data-testid={`button-edit-${post.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              data-testid={`button-delete-${post.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{post.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePost(post.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {filteredPosts.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <p className="text-gray-500">No blog posts found matching "{searchTerm}"</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {previewingPost && (
        <BlogPreview
          post={previewingPost}
          onClose={() => setPreviewingPost(null)}
        />
      )}

      {/* Edit Modal */}
      {editingPost && (
        <AIBlogEditor
          post={editingPost}
          categories={blogCategories}
          onSave={handleSavePost}
          onCancel={() => setEditingPost(null)}
        />
      )}
    </>
  );
}