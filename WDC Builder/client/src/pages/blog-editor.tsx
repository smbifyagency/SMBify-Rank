import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Save, Eye, Upload, Plus, X, Calendar, Clock, User, Tag, FolderOpen, Code, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  category?: string;
  status: "draft" | "published" | "scheduled";
  authorName: string;
  authorEmail?: string;
  scheduledAt?: string;
  readingTime?: number;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export default function BlogEditor() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/blog-editor/:id?");
  const isEditing = !!params?.id;

  const [post, setPost] = useState<BlogPost>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "draft",
    authorName: "Admin",
    tags: [],
  });

  const [newTag, setNewTag] = useState("");
  const [showSEOFields, setShowSEOFields] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [editorMode, setEditorMode] = useState<'visual' | 'source'>('visual');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch existing post if editing
  const { data: existingPost, isLoading: isLoadingPost } = useQuery({
    queryKey: ["/api/admin/blog-posts", params?.id],
    queryFn: async () => {
      const response = await fetch(`/api/admin/blog-posts/${params?.id}`);
      if (!response.ok) throw new Error("Failed to fetch post");
      return response.json();
    },
    enabled: isEditing,
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<BlogCategory[]>({
    queryKey: ["/api/admin/blog-categories"],
  });

  // Fetch tags
  const { data: availableTags = [] } = useQuery<BlogTag[]>({
    queryKey: ["/api/admin/blog-tags"],
  });

  // Set post data when editing
  useEffect(() => {
    if (existingPost && isEditing) {
      setPost(existingPost);
    }
  }, [existingPost, isEditing]);

  // Auto-generate slug from title
  useEffect(() => {
    if (post.title && !isEditing) {
      const slug = post.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setPost(prev => ({ ...prev, slug }));
    }
  }, [post.title, isEditing]);

  // Calculate reading time
  useEffect(() => {
    if (post.content) {
      const words = post.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
      const readingTime = Math.ceil(words / 200); // Average reading speed
      setPost(prev => ({ ...prev, readingTime }));
    }
  }, [post.content]);

  // Auto-generate excerpt if not provided
  useEffect(() => {
    if (post.content && !post.excerpt) {
      const textContent = post.content.replace(/<[^>]*>/g, "");
      const excerpt = textContent.substring(0, 160) + (textContent.length > 160 ? "..." : "");
      setPost(prev => ({ ...prev, excerpt }));
    }
  }, [post.content, post.excerpt]);

  // Save post mutation
  const saveMutation = useMutation({
    mutationFn: async (postData: BlogPost) => {
      const url = isEditing ? `/api/admin/blog-posts/${params?.id}` : "/api/admin/blog-posts";
      const method = isEditing ? "PUT" : "POST";

      const response = await apiRequest(method, url, postData);
      return response.json();
    },
    onSuccess: (savedPost) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      toast({ title: isEditing ? "Post updated successfully" : "Post created successfully" });

      if (!isEditing && savedPost?.id) {
        navigate(`/blog-editor/${savedPost.id}`);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save post",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const handleSave = (status: "draft" | "published" = post.status as "draft" | "published") => {
    const postToSave = { ...post, status };
    saveMutation.mutate(postToSave);
  };

  const handleAddTag = () => {
    if (newTag && !post.tags?.includes(newTag)) {
      setPost(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove)
    }));
  };

  // Rich text editor configuration
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    },
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: true
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'align',
    'list', 'bullet', 'indent',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  if (isLoadingPost && isEditing) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/blog-dashboard")} className="text-gray-400 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {isEditing ? "Edit Post" : "Create New Post"}
              </h1>
              <p className="text-gray-400">
                {post.readingTime && `~${post.readingTime} min read`}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? "Edit" : "Preview"}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave("draft")}
              disabled={saveMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave("published")}
              disabled={saveMutation.isPending}
            >
              Publish
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-gray-300">Title *</Label>
                    <Input
                      id="title"
                      value={post.title}
                      onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter post title"
                      className="text-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={post.slug}
                      onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="post-url-slug"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      URL: /blog/{post.slug}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={post.excerpt}
                      onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief description of the post"
                      rows={2}
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {!previewMode ? (
                  <div className="space-y-4">
                    {/* Editor Mode Toggle */}
                    <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/30">
                      <Button
                        type="button"
                        variant={editorMode === 'visual' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setEditorMode('visual')}
                        data-testid="button-visual-editor"
                      >
                        <Type className="h-4 w-4 mr-1" />
                        Visual
                      </Button>
                      <Button
                        type="button"
                        variant={editorMode === 'source' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setEditorMode('source')}
                        data-testid="button-source-editor"
                      >
                        <Code className="h-4 w-4 mr-1" />
                        Source
                      </Button>
                    </div>

                    <div>
                      <Label htmlFor="content-editor">Content *</Label>
                      {editorMode === 'visual' ? (
                        <div className="border rounded-lg overflow-hidden">
                          <ReactQuill
                            theme="snow"
                            value={post.content}
                            onChange={(content) => setPost(prev => ({ ...prev, content }))}
                            modules={modules}
                            formats={formats}
                            placeholder="Write your post content here. Use the rich text editor for formatting..."
                            style={{ minHeight: '400px' }}
                          />
                        </div>
                      ) : (
                        <Textarea
                          id="content-editor"
                          value={post.content}
                          onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Edit the HTML source directly..."
                          rows={20}
                          className="font-mono text-sm"
                          data-testid="textarea-source-editor"
                        />
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        {editorMode === 'visual'
                          ? 'Use the rich text editor above for visual formatting. Switch to Source mode to edit HTML directly.'
                          : 'Edit HTML source code directly. Switch to Visual mode for rich text editing.'
                        }
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-slate max-w-none">
                    <h1>{post.title}</h1>
                    {post.excerpt && <p className="lead">{post.excerpt}</p>}
                    <div
                      dangerouslySetInnerHTML={{ __html: post.content }}
                      className="ql-editor"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Settings */}
            <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Publish Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={post.status}
                    onValueChange={(value: "draft" | "published" | "scheduled") =>
                      setPost(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={post.authorName}
                    onChange={(e) => setPost(prev => ({ ...prev, authorName: e.target.value }))}
                  />
                </div>

                {post.status === "scheduled" && (
                  <div>
                    <Label htmlFor="scheduled-at">Scheduled Date</Label>
                    <Input
                      id="scheduled-at"
                      type="datetime-local"
                      value={post.scheduledAt}
                      onChange={(e) => setPost(prev => ({ ...prev, scheduledAt: e.target.value }))}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={post.category || ""}
                  onValueChange={(value) => setPost(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Uncategorized</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="featured-image">Image URL</Label>
                  <Input
                    id="featured-image"
                    value={post.featuredImage || ""}
                    onChange={(e) => setPost(prev => ({ ...prev, featuredImage: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="featured-image-alt">Alt Text</Label>
                  <Input
                    id="featured-image-alt"
                    value={post.featuredImageAlt || ""}
                    onChange={(e) => setPost(prev => ({ ...prev, featuredImageAlt: e.target.value }))}
                    placeholder="Describe the image"
                  />
                </div>
                {post.featuredImage && (
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.featuredImageAlt || "Featured image"}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle
                  className="cursor-pointer flex items-center justify-between"
                  onClick={() => setShowSEOFields(!showSEOFields)}
                >
                  SEO Settings
                  <Button variant="ghost" size="sm">
                    {showSEOFields ? "Hide" : "Show"}
                  </Button>
                </CardTitle>
              </CardHeader>
              {showSEOFields && (
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="meta-title">Meta Title</Label>
                    <Input
                      id="meta-title"
                      value={post.metaTitle || ""}
                      onChange={(e) => setPost(prev => ({ ...prev, metaTitle: e.target.value }))}
                      placeholder={post.title || "Enter meta title"}
                    />
                    <p className="text-sm text-muted-foreground">
                      {(post.metaTitle || post.title || "").length}/60 characters
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="meta-description">Meta Description</Label>
                    <Textarea
                      id="meta-description"
                      value={post.metaDescription || ""}
                      onChange={(e) => setPost(prev => ({ ...prev, metaDescription: e.target.value }))}
                      placeholder={post.excerpt || "Enter meta description"}
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground">
                      {(post.metaDescription || post.excerpt || "").length}/160 characters
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}