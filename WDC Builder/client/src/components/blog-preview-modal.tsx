import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, Download, AlertCircle, CheckCircle, Wand2, Edit3, Image as ImageIcon, Info } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BusinessData } from "@shared/schema";

interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  category: string;
  keywords: string;
  featuredImage?: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
}

interface BlogPreviewModalProps {
  businessData: BusinessData;
  isEnabled?: boolean;
}

export function BlogPreviewModal({ businessData, isEnabled = true }: BlogPreviewModalProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const { toast } = useToast();

  // Check if user is AI user for conditional rendering
  const isAIUser = !!(user as any)?.role || (user as any)?.id === "admin";
  const isManualMode = businessData.blogMode === "manual";

  const generatePreviewMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/preview-blog-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessData,
          blogAiProvider: businessData.blogAiProvider || "openai",
          blogPromptId: businessData.blogPromptId,
          blogKeywords: businessData.blogKeywords || "",
          blogTitles: businessData.blogTitles || "",
          blogWordCount: businessData.blogWordCount || 1500
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate blog preview");
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.blogPosts) {
        setGeneratedPosts(data.blogPosts);
        toast({
          title: "Blog Posts Generated",
          description: `Successfully generated ${data.blogPosts.length} blog posts`,
        });
      } else {
        throw new Error(data.message || "Failed to generate blog posts");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const downloadWithBlogMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/generate-website-with-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessData,
          blogPosts: generatedPosts,
          blogSettings: {
            aiProvider: businessData.blogAiProvider,
            useImages: businessData.blogUseImages,
            outputOption: businessData.blogOutputOption
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate website");
      }

      return response.blob();
    },
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${businessData.businessName.replace(/[^a-zA-Z0-9]/g, "-")}-website-with-blog.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Your website with blog posts is being downloaded",
      });
      setIsOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Download Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEditPost = (index: number, field: keyof BlogPost, value: string) => {
    setGeneratedPosts(prev => prev.map((post, i) =>
      i === index ? { ...post, [field]: value } : post
    ));
  };

  const canGenerate = businessData.generateBlog &&
    businessData.blogPromptId &&
    (businessData.blogKeywords || businessData.blogTitles);

  console.log("Blog Preview Modal - Business Data:", {
    generateBlog: businessData.generateBlog,
    blogPromptId: businessData.blogPromptId,
    blogKeywords: businessData.blogKeywords,
    blogAiProvider: businessData.blogAiProvider
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={!isEnabled || (!canGenerate && !isManualMode)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          {isManualMode ? "Preview Blog System" : "Preview Blog Posts"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            {isManualMode ? "Blog System Preview" : "AI Blog Generation Preview"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isManualMode ? (
            <div className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Manual blog mode selected. Your website will include a complete blog system ready for your content.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Blog Features Included</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Professional blog layout
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Individual post pages
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Blog archive page
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Category organization
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        SEO-optimized structure
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Mobile-responsive design
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How It Works</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-semibold">1</div>
                        <div>Your website will include a complete blog system</div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-semibold">2</div>
                        <div>Add your own blog posts using any CMS or direct HTML editing</div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-semibold">3</div>
                        <div>Posts will automatically appear in the blog archive and navigation</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center py-4 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  Your website will be generated with the blog system ready for content
                </p>
              </div>
            </div>
          ) : (
            <>
              {!canGenerate && !isAIUser && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Blog preview is only available for AI users. Manual users can use the blog system after website generation.
                  </AlertDescription>
                </Alert>
              )}

              {!canGenerate && isAIUser && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    To preview blog posts, please enable blog generation, select an AI writing style, and add blog post titles.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {canGenerate && generatedPosts.length === 0 && (
            <div className="text-center py-8">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Ready to generate {businessData.blogTitles?.split('\n').filter(t => t.trim()).length || 0} blog posts
                </p>
                <Button
                  onClick={() => generatePreviewMutation.mutate()}
                  disabled={generatePreviewMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {generatePreviewMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  Generate Blog Posts
                </Button>
              </div>
            </div>
          )}

          {generatePreviewMutation.isPending && (
            <div className="text-center py-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="text-muted-foreground">
                Generating blog posts with AI... This may take a few minutes.
              </p>
            </div>
          )}

          {generatedPosts.length > 0 && (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Successfully generated {generatedPosts.length} blog posts. Review them below and download your complete website.
                </AlertDescription>
              </Alert>

              <Tabs defaultValue="list" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="list">Post List</TabsTrigger>
                  <TabsTrigger value="preview">Full Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="space-y-4">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {generatedPosts.map((post, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg">{post.title}</CardTitle>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {post.tags.map((tag, tagIndex) => (
                                    <Badge key={tagIndex} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingPost(editingPost === index ? null : index)}
                                className="shrink-0"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {editingPost === index ? (
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor={`title-${index}`} className="text-sm font-medium">Title</Label>
                                  <Input
                                    id={`title-${index}`}
                                    value={post.title}
                                    onChange={(e) => handleEditPost(index, 'title', e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`excerpt-${index}`} className="text-sm font-medium">Excerpt</Label>
                                  <Textarea
                                    id={`excerpt-${index}`}
                                    value={post.excerpt}
                                    onChange={(e) => handleEditPost(index, 'excerpt', e.target.value)}
                                    rows={2}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`featured-image-${index}`} className="text-sm font-medium flex items-center gap-1">
                                    <ImageIcon className="h-4 w-4" />
                                    Featured Image URL
                                  </Label>
                                  <Input
                                    id={`featured-image-${index}`}
                                    value={post.featuredImageUrl || ''}
                                    onChange={(e) => handleEditPost(index, 'featuredImageUrl', e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`image-alt-${index}`} className="text-sm font-medium">Image Alt Text</Label>
                                  <Input
                                    id={`image-alt-${index}`}
                                    value={post.featuredImageAlt || ''}
                                    onChange={(e) => handleEditPost(index, 'featuredImageAlt', e.target.value)}
                                    placeholder="Describe the image for accessibility"
                                    className="mt-1"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor={`category-${index}`} className="text-sm font-medium">Category</Label>
                                    <Input
                                      id={`category-${index}`}
                                      value={post.category}
                                      onChange={(e) => handleEditPost(index, 'category', e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`keywords-${index}`} className="text-sm font-medium">Keywords</Label>
                                    <Input
                                      id={`keywords-${index}`}
                                      value={post.keywords}
                                      onChange={(e) => handleEditPost(index, 'keywords', e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm text-muted-foreground mb-2">{post.excerpt}</p>
                                {post.featuredImageUrl && (
                                  <div className="mb-2">
                                    <img
                                      src={post.featuredImageUrl}
                                      alt={post.featuredImageAlt || post.title}
                                      className="w-full h-32 object-cover rounded-md"
                                    />
                                  </div>
                                )}
                                <div className="text-xs text-muted-foreground">
                                  <p><strong>Meta Title:</strong> {post.metaTitle}</p>
                                  <p><strong>Keywords:</strong> {post.keywords}</p>
                                </div>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="preview">
                  <ScrollArea className="h-[400px]">
                    {generatedPosts.map((post, index) => (
                      <div key={index} className="mb-8 p-4 border rounded-lg">
                        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                        {post.featuredImageUrl && (
                          <div className="mb-4">
                            <img
                              src={post.featuredImageUrl}
                              alt={post.featuredImageAlt || post.title}
                              className="w-full h-48 object-cover rounded-md"
                            />
                          </div>
                        )}
                        <div
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                      </div>
                    ))}
                  </ScrollArea>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => setGeneratedPosts([])}
                  variant="outline"
                >
                  Regenerate Posts
                </Button>
                <Button
                  onClick={() => downloadWithBlogMutation.mutate()}
                  disabled={downloadWithBlogMutation.isPending}
                  className="flex items-center gap-2 flex-1"
                >
                  {downloadWithBlogMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Download Complete Website with Blog
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}