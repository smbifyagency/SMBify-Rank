import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/rich-text-editor';
import { Edit, Save, X, Wand2, RefreshCw } from 'lucide-react';
import { nanoid } from 'nanoid';
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

interface AIBlogEditorProps {
  post: BlogPost;
  categories: BlogCategory[];
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
  onRegenerate?: (field: string) => void;
}

export function AIBlogEditor({ post, categories, onSave, onCancel, onRegenerate }: AIBlogEditorProps) {
  const [formData, setFormData] = useState(post);
  const [activeTab, setActiveTab] = useState("content");
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);

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

  const handleRegenerate = async (field: string) => {
    if (!onRegenerate) return;
    
    setIsRegenerating(field);
    try {
      await onRegenerate(field);
    } catch (error) {
      console.error('Regeneration failed:', error);
    } finally {
      setIsRegenerating(null);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-purple-600" />
            {post.id && formData.title ? `Edit AI Post: ${formData.title}` : 'Edit AI-Generated Blog Post'}
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              AI Generated
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="meta">SEO & Meta</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter post title..."
                  />
                </div>
                {onRegenerate && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRegenerate('title')}
                    disabled={isRegenerating === 'title'}
                    className="mt-6"
                  >
                    {isRegenerating === 'title' ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4" />
                    )}
                  </Button>
                )}
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

              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief description of the post..."
                    rows={3}
                  />
                </div>
                {onRegenerate && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRegenerate('excerpt')}
                    disabled={isRegenerating === 'excerpt'}
                    className="mt-6"
                  >
                    {isRegenerating === 'excerpt' ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>

              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <Label htmlFor="content">Content *</Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    placeholder="AI-generated content - edit as needed..."
                    className="mt-2"
                  />
                  <div className="text-sm text-gray-500 mt-2">
                    This content was generated by AI. You can edit it using the visual editor or Markdown syntax.
                  </div>
                </div>
                {onRegenerate && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRegenerate('content')}
                    disabled={isRegenerating === 'content'}
                    className="mt-6"
                  >
                    {isRegenerating === 'content' ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="meta" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor="featuredImageUrl">Featured Image URL</Label>
                  <Input
                    id="featuredImageUrl"
                    value={formData.featuredImageUrl || ''}
                    onChange={(e) => setFormData({ ...formData, featuredImageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... (external image URL)"
                  />
                </div>
                {onRegenerate && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRegenerate('image')}
                    disabled={isRegenerating === 'image'}
                    className="mt-6"
                  >
                    {isRegenerating === 'image' ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4" />
                    )}
                  </Button>
                )}
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

              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle || ''}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="SEO title for search engines..."
                  />
                </div>
                {onRegenerate && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRegenerate('metaTitle')}
                    disabled={isRegenerating === 'metaTitle'}
                    className="mt-6"
                  >
                    {isRegenerating === 'metaTitle' ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>

              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription || ''}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="SEO description for search engines..."
                    rows={3}
                  />
                </div>
                {onRegenerate && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRegenerate('metaDescription')}
                    disabled={isRegenerating === 'metaDescription'}
                    className="mt-6"
                  >
                    {isRegenerating === 'metaDescription' ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>

              {formData.keywords && formData.keywords.length > 0 && (
                <div>
                  <Label>Keywords</Label>
                  <div className="flex gap-1 flex-wrap mt-2">
                    {formData.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
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
                  value={formData.authorName || ''}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  placeholder="Author name..."
                />
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wand2 className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-900">AI Generation Info</span>
                </div>
                <p className="text-sm text-purple-700">
                  This post was generated using AI. You can regenerate individual sections using the magic wand buttons,
                  or edit the content manually using the rich text editor.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
            <Save className="h-4 w-4 mr-2" />
            Save Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}