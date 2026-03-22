import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Edit3, 
  Trash2, 
  Eye, 
  Save, 
  Plus, 
  Wand2, 
  Clock, 
  Tag, 
  User,
  Calendar,
  FileText,
  Image,
  Settings,
  ExternalLink,
  RotateCcw,
  Check,
  X,
  Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  metaTitle?: string;
  metaDescription?: string;
  category?: string;
  tags: string[];
  status: 'draft' | 'published';
  authorName?: string;
  isAiGenerated: boolean;
  keywords?: string;
  publishedAt?: string;
  readingTime?: number;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface EnhancedBlogManagerProps {
  posts: BlogPost[];
  categories: BlogCategory[];
  onSave: (post: BlogPost) => void;
  onDelete: (postId: string) => void;
  onAddNew: () => void;
  onRegenerate?: (postId: string, field: string) => Promise<void>;
  isVisible: boolean;
  onClose: () => void;
}

export function EnhancedBlogManager({
  posts,
  categories,
  onSave,
  onDelete,
  onAddNew,
  onRegenerate,
  isVisible,
  onClose
}: EnhancedBlogManagerProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [activeTab, setActiveTab] = useState("content");
  const [previewMode, setPreviewMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);

  const { toast } = useToast();

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean'],
      ['blockquote', 'code-block']
    ],
  };

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'align', 'color', 'background',
    'script', 'code-block'
  ];

  // Filter posts based on search and filters
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === "all" || post.category === filterCategory;
    const matchesStatus = filterStatus === "all" || post.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const calculateReadingTime = (content: string): number => {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / 200); // Average reading speed
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost({ ...post });
    setSelectedPost(post);
    setActiveTab("content");
  };

  const handleSavePost = () => {
    if (!editingPost) return;

    if (!editingPost.title || !editingPost.content || !editingPost.excerpt) {
      toast({
        title: "Validation Error",
        description: "Please fill in title, excerpt, and content fields.",
        variant: "destructive"
      });
      return;
    }

    const slug = editingPost.slug || generateSlug(editingPost.title);
    const readingTime = calculateReadingTime(editingPost.content);
    
    const updatedPost: BlogPost = {
      ...editingPost,
      slug,
      readingTime
    };

    onSave(updatedPost);
    setEditingPost(null);
    setSelectedPost(updatedPost);
    
    toast({
      title: "Success",
      description: "Blog post saved successfully!"
    });
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDelete(postId);
      if (selectedPost?.id === postId) {
        setSelectedPost(null);
        setEditingPost(null);
      }
      
      toast({
        title: "Deleted",
        description: "Blog post deleted successfully."
      });
    }
  };

  const handleRegenerate = async (field: string) => {
    if (!selectedPost || !onRegenerate) return;
    
    setIsRegenerating(field);
    try {
      await onRegenerate(selectedPost.id, field);
      toast({
        title: "Regenerated",
        description: `${field} has been regenerated successfully.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to regenerate ${field}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsRegenerating(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard."
    });
  };

  if (!isVisible) return null;

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Blog Post Manager
            <Badge variant="outline" className="ml-2">
              {filteredPosts.length} posts
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-[80vh] gap-4">
          {/* Left Panel - Post List */}
          <div className="w-1/3 flex flex-col">
            {/* Search and Filters */}
            <div className="space-y-3 p-4 border-b">
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              
              <div className="flex gap-2">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={onAddNew} className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add New Post
              </Button>
            </div>

            {/* Post List */}
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-2">
                {filteredPosts.map((post) => (
                  <Card 
                    key={post.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedPost?.id === post.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedPost(post)}
                  >
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm line-clamp-2">{post.title}</h4>
                        <p className="text-xs text-gray-600 line-clamp-2">{post.excerpt}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                              {post.status}
                            </Badge>
                            {post.isAiGenerated && (
                              <Badge variant="outline" className="text-xs">
                                <Wand2 className="h-3 w-3 mr-1" />
                                AI
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditPost(post);
                              }}
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePost(post.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {post.readingTime && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {post.readingTime} min read
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredPosts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No posts found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Post Editor/Viewer */}
          <div className="w-2/3 flex flex-col">
            {selectedPost ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                  <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex gap-2">
                    {editingPost ? (
                      <>
                        <Button variant="outline" onClick={() => setEditingPost(null)}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button onClick={handleSavePost}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => handleEditPost(selectedPost)}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Post
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-hidden">
                  <TabsContent value="content" className="h-full p-4 space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        {editingPost ? (
                          <Input
                            id="title"
                            value={editingPost.title}
                            onChange={(e) => setEditingPost({
                              ...editingPost,
                              title: e.target.value
                            })}
                            className="font-medium"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold">{selectedPost.title}</h2>
                            {onRegenerate && selectedPost.isAiGenerated && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRegenerate('title')}
                                disabled={isRegenerating === 'title'}
                              >
                                <RotateCcw className={`h-4 w-4 ${isRegenerating === 'title' ? 'animate-spin' : ''}`} />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="excerpt">Excerpt</Label>
                        {editingPost ? (
                          <Textarea
                            id="excerpt"
                            value={editingPost.excerpt}
                            onChange={(e) => setEditingPost({
                              ...editingPost,
                              excerpt: e.target.value
                            })}
                            rows={3}
                          />
                        ) : (
                          <div className="flex items-start gap-2">
                            <p className="text-gray-600">{selectedPost.excerpt}</p>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(selectedPost.excerpt)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <Label>Content</Label>
                        {editingPost ? (
                          <div className="border rounded-md">
                            <ReactQuill
                              theme="snow"
                              value={editingPost.content}
                              onChange={(content) => setEditingPost({
                                ...editingPost,
                                content
                              })}
                              modules={quillModules}
                              formats={quillFormats}
                              style={{ height: '400px' }}
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Badge variant="outline">
                                {calculateReadingTime(selectedPost.content)} min read
                              </Badge>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(selectedPost.content)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                {onRegenerate && selectedPost.isAiGenerated && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRegenerate('content')}
                                    disabled={isRegenerating === 'content'}
                                  >
                                    <RotateCcw className={`h-4 w-4 ${isRegenerating === 'content' ? 'animate-spin' : ''}`} />
                                  </Button>
                                )}
                              </div>
                            </div>
                            <ScrollArea className="h-[400px] border rounded-md p-4">
                              <div 
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                              />
                            </ScrollArea>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="seo" className="h-full p-4 space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="metaTitle">Meta Title</Label>
                        {editingPost ? (
                          <Input
                            id="metaTitle"
                            value={editingPost.metaTitle || ''}
                            onChange={(e) => setEditingPost({
                              ...editingPost,
                              metaTitle: e.target.value
                            })}
                            placeholder="SEO title for search engines"
                          />
                        ) : (
                          <p className="text-gray-600">{selectedPost.metaTitle || 'Not set'}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="metaDescription">Meta Description</Label>
                        {editingPost ? (
                          <Textarea
                            id="metaDescription"
                            value={editingPost.metaDescription || ''}
                            onChange={(e) => setEditingPost({
                              ...editingPost,
                              metaDescription: e.target.value
                            })}
                            placeholder="SEO description for search engines"
                            rows={3}
                          />
                        ) : (
                          <p className="text-gray-600">{selectedPost.metaDescription || 'Not set'}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="slug">URL Slug</Label>
                        {editingPost ? (
                          <Input
                            id="slug"
                            value={editingPost.slug}
                            onChange={(e) => setEditingPost({
                              ...editingPost,
                              slug: e.target.value
                            })}
                            placeholder="url-friendly-slug"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                              /blog/{selectedPost.slug}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(selectedPost.slug)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label>Featured Image</Label>
                        {editingPost ? (
                          <div className="space-y-2">
                            <Input
                              value={editingPost.featuredImage || ''}
                              onChange={(e) => setEditingPost({
                                ...editingPost,
                                featuredImage: e.target.value
                              })}
                              placeholder="Image URL"
                            />
                            <Input
                              value={editingPost.featuredImageAlt || ''}
                              onChange={(e) => setEditingPost({
                                ...editingPost,
                                featuredImageAlt: e.target.value
                              })}
                              placeholder="Alt text for accessibility"
                            />
                          </div>
                        ) : (
                          <div>
                            {selectedPost.featuredImage ? (
                              <div className="space-y-2">
                                <img 
                                  src={selectedPost.featuredImage} 
                                  alt={selectedPost.featuredImageAlt || selectedPost.title}
                                  className="w-full h-48 object-cover rounded border"
                                />
                                <p className="text-sm text-gray-600">
                                  {selectedPost.featuredImageAlt || 'No alt text'}
                                </p>
                              </div>
                            ) : (
                              <p className="text-gray-600">No featured image</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="h-full p-4 space-y-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">Category</Label>
                          {editingPost ? (
                            <Select
                              value={editingPost.category || ''}
                              onValueChange={(value) => setEditingPost({
                                ...editingPost,
                                category: value
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map(category => (
                                  <SelectItem key={category.id} value={category.name}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge variant="outline">{selectedPost.category || 'Uncategorized'}</Badge>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="status">Status</Label>
                          {editingPost ? (
                            <Select
                              value={editingPost.status}
                              onValueChange={(value: 'draft' | 'published') => setEditingPost({
                                ...editingPost,
                                status: value
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge variant={selectedPost.status === 'published' ? 'default' : 'secondary'}>
                              {selectedPost.status}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="author">Author</Label>
                        {editingPost ? (
                          <Input
                            id="author"
                            value={editingPost.authorName || ''}
                            onChange={(e) => setEditingPost({
                              ...editingPost,
                              authorName: e.target.value
                            })}
                            placeholder="Author name"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{selectedPost.authorName || 'Unknown Author'}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label>Tags</Label>
                        {editingPost ? (
                          <Input
                            value={editingPost.tags.join(', ')}
                            onChange={(e) => setEditingPost({
                              ...editingPost,
                              tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                            })}
                            placeholder="tag1, tag2, tag3"
                          />
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {selectedPost.tags.length > 0 ? (
                              selectedPost.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-gray-600">No tags</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label>Keywords</Label>
                        <p className="text-sm text-gray-600">
                          {selectedPost.keywords || 'No keywords specified'}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {selectedPost.publishedAt ? 
                              new Date(selectedPost.publishedAt).toLocaleDateString() : 
                              'Not published'
                            }
                          </span>
                        </div>
                        
                        {selectedPost.isAiGenerated && (
                          <Badge variant="outline" className="text-xs">
                            <Wand2 className="h-3 w-3 mr-1" />
                            AI Generated
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="preview" className="h-full p-4">
                    <ScrollArea className="h-full">
                      <article className="prose max-w-none">
                        <header className="mb-8">
                          <h1 className="text-3xl font-bold mb-4">{selectedPost.title}</h1>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {selectedPost.authorName || 'Unknown Author'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {selectedPost.publishedAt ? 
                                new Date(selectedPost.publishedAt).toLocaleDateString() : 
                                'Not published'
                              }
                            </div>
                            {selectedPost.readingTime && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {selectedPost.readingTime} min read
                              </div>
                            )}
                          </div>

                          {selectedPost.featuredImage && (
                            <img 
                              src={selectedPost.featuredImage} 
                              alt={selectedPost.featuredImageAlt || selectedPost.title}
                              className="w-full h-64 object-cover rounded-lg mb-6"
                            />
                          )}

                          <p className="text-lg text-gray-600 leading-relaxed">
                            {selectedPost.excerpt}
                          </p>
                        </header>

                        <div 
                          className="prose-content"
                          dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                        />

                        {selectedPost.tags.length > 0 && (
                          <footer className="mt-8 pt-4 border-t">
                            <div className="flex flex-wrap gap-2">
                              {selectedPost.tags.map((tag, index) => (
                                <Badge key={index} variant="outline">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </footer>
                        )}
                      </article>
                    </ScrollArea>
                  </TabsContent>
                </div>
              </Tabs>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Post Selected</h3>
                  <p>Select a post from the list to view or edit it</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}