import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Eye, FileText, Tag, Image, Search, Wand2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { RichTextEditor } from '@/components/rich-text-editor';
import { AIBlogEditor } from '@/components/ai-blog-editor';
import { BlogPreview } from '@/components/blog-preview';
import { formatMarkdownToHtml } from '@/lib/blog-formatter';
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
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface ManualBlogManagerProps {
  businessData: BusinessData;
  onChange: (data: Partial<BusinessData>) => void;
}

export function ManualBlogManager({ businessData, onChange }: ManualBlogManagerProps) {
  const [activeTab, setActiveTab] = useState("posts");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [previewingPost, setPreviewingPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const posts = businessData.blogPosts || [];
  const categories = businessData.blogCategories || [];

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || post.category === filterCategory;
    const matchesStatus = filterStatus === "all" || post.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreatePost = () => {
    const newPost: BlogPost = {
      id: nanoid(),
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      featuredImageAlt: '',
      metaTitle: '',
      metaDescription: '',
      category: businessData.category || categories[0]?.name || '',
      tags: [],
      status: 'published',
      authorName: businessData.businessName || 'Admin',
      isAiGenerated: false,
    };
    setEditingPost(newPost);
  };

  const handleSavePost = (post: BlogPost) => {
    const updatedPosts = editingPost?.id && posts.find(p => p.id === editingPost.id)
      ? posts.map(p => p.id === post.id ? post : p)
      : [...posts, post];
    
    onChange({ blogPosts: updatedPosts });
    setEditingPost(null);
  };

  const handleDeletePost = (postId: string) => {
    const updatedPosts = posts.filter(p => p.id !== postId);
    onChange({ blogPosts: updatedPosts });
  };

  const handleCreateCategory = () => {
    const newCategory: BlogCategory = {
      id: nanoid(),
      name: '',
      slug: '',
      description: '',
    };
    setEditingCategory(newCategory);
  };

  const handleSaveCategory = (category: BlogCategory) => {
    const updatedCategories = editingCategory?.id && categories.find(c => c.id === editingCategory.id)
      ? categories.map(c => c.id === category.id ? category : c)
      : [...categories, category];
    
    onChange({ blogCategories: updatedCategories });
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter(c => c.id !== categoryId);
    onChange({ blogCategories: updatedCategories });
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3">
          <FileText className="h-6 w-6" />
          Manual Blog Management
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {posts.length}/100 Posts
          </Badge>
        </CardTitle>
        <CardDescription className="text-white/90">
          Create and manage up to 100 blog posts with full WordPress-like functionality
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Blog Posts ({posts.length})
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Categories ({categories.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            {/* Posts Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-1 gap-2 items-center">
                <div className="relative flex-1 max-w-sm">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreatePost} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Post
              </Button>
            </div>

            {/* Posts List */}
            <div className="space-y-3">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {posts.length === 0 ? "No blog posts yet. Create your first post!" : "No posts match your filters."}
                </div>
              ) : (
                filteredPosts.map(post => (
                  <Card key={post.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{post.title || 'Untitled Post'}</h4>
                          <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                            {post.status}
                          </Badge>
                          {post.isAiGenerated && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                              <Wand2 className="h-3 w-3 mr-1" />
                              AI
                            </Badge>
                          )}
                          {post.category && (
                            <Badge variant="outline">{post.category}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{post.excerpt}</p>
                        {post.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {post.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewingPost(post)}
                          title="Preview post"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingPost(post)}
                          title={post.isAiGenerated ? "Edit AI-generated post" : "Edit post"}
                        >
                          {post.isAiGenerated ? <Wand2 className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Blog Categories</h3>
              <Button onClick={handleCreateCategory} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Category
              </Button>
            </div>

            <div className="space-y-3">
              {categories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No categories yet. Create your first category!
                </div>
              ) : (
                categories.map(category => (
                  <Card key={category.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{category.name}</h4>
                        <p className="text-sm text-gray-600">{category.description}</p>
                        <p className="text-xs text-gray-400">Slug: {category.slug}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Post Editor Dialog */}
        {editingPost && (
          editingPost.isAiGenerated ? (
            <AIBlogEditor
              post={editingPost}
              categories={categories}
              onSave={handleSavePost}
              onCancel={() => setEditingPost(null)}
              onRegenerate={(field) => {
                // TODO: Implement AI regeneration for specific fields
                console.log(`Regenerating ${field} for post:`, editingPost.id);
              }}
            />
          ) : (
            <PostEditorDialog
              post={editingPost}
              categories={categories}
              onSave={handleSavePost}
              onCancel={() => setEditingPost(null)}
            />
          )
        )}

        {/* Category Editor Dialog */}
        {editingCategory && (
          <CategoryEditorDialog
            category={editingCategory}
            onSave={handleSaveCategory}
            onCancel={() => setEditingCategory(null)}
          />
        )}

        {/* Blog Preview */}
        {previewingPost && (
          <BlogPreview
            post={previewingPost}
            onClose={() => setPreviewingPost(null)}
          />
        )}
      </CardContent>
    </Card>
  );
}

// Post Editor Dialog Component
function PostEditorDialog({ 
  post, 
  categories, 
  onSave, 
  onCancel 
}: {
  post: BlogPost;
  categories: BlogCategory[];
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(post);
  const [activeTab, setActiveTab] = useState("content");

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSave = () => {
    if (!formData.title || !formData.excerpt || !formData.content) {
      alert('Please fill in title, excerpt, and content fields.');
      return;
    }

    const slug = formData.slug || generateSlug(formData.title);
    onSave({ ...formData, slug });
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {post.id && formData.title ? `Edit: ${formData.title}` : 'Create New Blog Post'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="meta">SEO & Meta</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter post title..."
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Auto-generated from title"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief description of the post..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Write your post content using the visual editor or Markdown..."
                  className="mt-2"
                />
                <div className="text-sm text-gray-500 mt-2">
                  Use the toolbar above for formatting, or write in Markdown. Switch between Edit and Preview modes.
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="meta" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="featuredImageUrl">Featured Image URL</Label>
                <Input
                  id="featuredImageUrl"
                  value={formData.featuredImageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, featuredImageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... (external image URL)"
                />
              </div>

              <div>
                <Label htmlFor="featuredImageAlt">Featured Image Alt Text</Label>
                <Input
                  id="featuredImageAlt"
                  value={formData.featuredImageAlt || ''}
                  onChange={(e) => setFormData({ ...formData, featuredImageAlt: e.target.value })}
                  placeholder="Describe the image for accessibility..."
                />
              </div>

              <div>
                <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle || ''}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="SEO title for search engines..."
                />
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription || ''}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="SEO description for search engines..."
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category || ''}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                  })}
                  placeholder="tag1, tag2, tag3..."
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'draft' | 'published') => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="author">Author Name</Label>
                <Input
                  id="author"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  placeholder="Author name..."
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Category Editor Dialog Component
function CategoryEditorDialog({ 
  category, 
  onSave, 
  onCancel 
}: {
  category: BlogCategory;
  onSave: (category: BlogCategory) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(category);

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSave = () => {
    if (!formData.name) {
      alert('Please enter a category name.');
      return;
    }

    const slug = formData.slug || generateSlug(formData.name);
    onSave({ ...formData, slug });
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category.id && formData.name ? `Edit: ${formData.name}` : 'Create New Category'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter category name..."
            />
          </div>

          <div>
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="Auto-generated from name"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional category description..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Category
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}