import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Loader2, 
  CheckCircle, 
  FileText, 
  Download,
  Wand2,
  Clock,
  Eye,
  Edit3,
  Image as ImageIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { BusinessData } from '../../../shared/schema';

interface BlogGenerationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  inProgress: boolean;
  estimatedTime: string;
}

interface GeneratedBlogPost {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
}

interface AIBlogGenerationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessData: BusinessData;
}

export function AIBlogGenerationModal({ 
  open, 
  onOpenChange, 
  businessData 
}: AIBlogGenerationModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedBlogPost[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [generationSteps, setGenerationSteps] = useState<BlogGenerationStep[]>([
    {
      id: 'analyzing',
      title: 'Analyzing Business Information',
      description: 'Processing your business details and blog requirements',
      completed: false,
      inProgress: false,
      estimatedTime: '30s'
    },
    {
      id: 'blog-content',
      title: 'Writing Blog Posts',
      description: 'Creating engaging blog content with AI',
      completed: false,
      inProgress: false,
      estimatedTime: '2-3 min'
    },
    {
      id: 'seo-optimization',
      title: 'SEO Optimization',
      description: 'Optimizing content for search engines',
      completed: false,
      inProgress: false,
      estimatedTime: '1 min'
    },
    {
      id: 'website-integration',
      title: 'Website Integration',
      description: 'Integrating blog with your main website',
      completed: false,
      inProgress: false,
      estimatedTime: '1 min'
    },
    {
      id: 'final-package',
      title: 'Creating Download Package',
      description: 'Preparing complete website with blog for download',
      completed: false,
      inProgress: false,
      estimatedTime: '30s'
    }
  ]);

  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      // Reset state when modal closes
      setIsGenerating(false);
      setIsComplete(false);
      setProgress(0);
      setCurrentStep('');
      setDownloadUrl(null);
      setGeneratedPosts([]);
      setShowPreview(false);
      setEditingPost(null);
      setGenerationSteps(prev => prev.map(step => ({
        ...step,
        completed: false,
        inProgress: false
      })));
    }
  }, [open]);

  const updateStepProgress = (stepId: string, status: 'inProgress' | 'completed') => {
    setGenerationSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          inProgress: status === 'inProgress',
          completed: status === 'completed'
        };
      }
      // Mark previous steps as completed
      const stepIndex = prev.findIndex(s => s.id === stepId);
      const currentStepIndex = prev.findIndex(s => s.id === step.id);
      if (currentStepIndex < stepIndex && status === 'inProgress') {
        return { ...step, completed: true, inProgress: false };
      }
      return step;
    }));
  };

  const generateBlogAndWebsite = async () => {
    if (!businessData.generateBlog || !businessData.blogPromptId) {
      toast({
        title: "Blog Configuration Missing",
        description: "Please configure blog settings before generating.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Step 1: Analyzing
      updateStepProgress('analyzing', 'inProgress');
      setCurrentStep('Analyzing your business information...');
      setProgress(10);
      
      // Remove artificial delay for faster processing

      // Step 2: Blog Content Generation
      updateStepProgress('analyzing', 'completed');
      updateStepProgress('blog-content', 'inProgress');
      setCurrentStep('Writing engaging blog posts...');
      setProgress(25);

      // Parse blog titles
      const blogTitles = businessData.blogTitles 
        ? businessData.blogTitles.split('\n').filter(title => title.trim())
        : [];

      let newGeneratedPosts: GeneratedBlogPost[] = [];
      
      // Generate each blog post
      for (let i = 0; i < blogTitles.length; i++) {
        const title = blogTitles[i];
        setCurrentStep(`Writing blog post ${i + 1} of ${blogTitles.length}: "${title.substring(0, 50)}..."`);
        setProgress(25 + (i / blogTitles.length) * 40);

        let retryCount = 0;
        const maxRetries = 2;
        
        while (retryCount <= maxRetries) {
          try {
            const response = await fetch('/api/ai/blog-post', {
              method: 'POST',
              body: JSON.stringify({
                businessName: businessData.businessName,
                category: businessData.category,
                location: businessData.heroLocation,
                title: title,
                promptId: businessData.blogPromptId,
                keywords: businessData.blogKeywords || '',
                wordCount: businessData.blogWordCount || 1000,
                useImages: businessData.blogUseImages || true,
                aiProvider: businessData.blogAiProvider || 'openai'
              }),
              headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
              const errorData = await response.text();
              throw new Error(`Server error: ${response.status} - ${errorData}`);
            }

            const result = await response.json();

            if (result.success && result.content) {
              const newPost: GeneratedBlogPost = {
                title: title,
                content: result.content,
                excerpt: result.excerpt || result.content.substring(0, 150) + '...',
                slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                publishedAt: new Date().toISOString(),
                author: businessData.businessName || 'Admin',
                category: businessData.category || 'Business',
                tags: businessData.blogKeywords ? businessData.blogKeywords.split(',').map((k: string) => k.trim()) : [],
                featured: i === 0
              };
              newGeneratedPosts.push(newPost);
              break; // Success, exit retry loop
            } else {
              throw new Error(result.message || 'Failed to generate content');
            }
          } catch (error) {
            retryCount++;
            console.error(`Error generating blog post ${i + 1}, attempt ${retryCount}:`, error);
            
            if (retryCount > maxRetries) {
              console.error(`Failed to generate blog post "${title}" after ${maxRetries} retries`);
              // Continue with other posts instead of crashing
              break;
            } else {
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            }
          }
        }

        // No artificial delay - let AI generation proceed at natural speed
      }

      // Step 3: SEO Optimization
      updateStepProgress('blog-content', 'completed');
      updateStepProgress('seo-optimization', 'inProgress');
      setCurrentStep('Optimizing content for search engines...');
      setProgress(75);
      
      // Remove artificial delay

      // Step 4: Website Integration
      updateStepProgress('seo-optimization', 'completed');
      updateStepProgress('website-integration', 'inProgress');
      setCurrentStep('Integrating blog with your website...');
      setProgress(85);

      // Store generated posts for preview and editing
      setGeneratedPosts(newGeneratedPosts);
      
      // Step 5: Show Preview
      updateStepProgress('website-integration', 'completed');
      setCurrentStep('Blog posts generated successfully! Review before downloading.');
      setProgress(100);
      setIsComplete(true);
      setShowPreview(true);

      toast({
        title: "Blog Generation Complete!",
        description: `Successfully generated ${newGeneratedPosts.length} blog posts. Review them before downloading.`
      });

      // Remove artificial delay - preview step handles completion

    } catch (error) {
      console.error('Blog generation error:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your blog posts. Please check your API settings and try again.",
        variant: "destructive"
      });
      
      // Reset progress on error instead of crashing
      setProgress(0);
      setCurrentStep('Generation failed. Please try again.');
      setIsComplete(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const createFinalWebsite = async () => {
    setIsGenerating(true);
    setCurrentStep('Creating your complete website package...');
    setProgress(95);
    
    try {
      // Update business data with edited blog posts
      const updatedBusinessData = {
        ...businessData,
        blogPosts: generatedPosts
      };

      // Generate and download the complete website
      const websiteResponse = await fetch('/api/generate-website', {
        method: 'POST',
        body: JSON.stringify({
          businessData: updatedBusinessData,
          template: 'template1' // Add default template
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!websiteResponse.ok) {
        const errorData = await websiteResponse.json();
        console.error('Server response:', errorData);
        throw new Error(errorData.message || 'Failed to generate website');
      }

      // Create a blob URL for download
      const blob = await websiteResponse.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      setProgress(100);
      setCurrentStep('Complete! Your website is ready for download.');
      
      // Set download URL
      setDownloadUrl(downloadUrl);
      setShowPreview(false);
      
      toast({
        title: "Website Package Ready!",
        description: `Your website with ${generatedPosts.length} blog posts is ready for download.`
      });
      
    } catch (error) {
      console.error('Website generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to create website package. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditPost = (index: number, field: keyof GeneratedBlogPost, value: string) => {
    setGeneratedPosts(prev => prev.map((post, i) => 
      i === index ? { ...post, [field]: value } : post
    ));
  };

  const handleDownload = () => {
    if (downloadUrl) {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${businessData.businessName || 'website'}-with-blog.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your complete website package is being downloaded."
      });
      
      // Clean up the blob URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
      }, 1000);
    }
  };

  const blogPostCount = businessData.blogTitles 
    ? businessData.blogTitles.split('\n').filter((title: string) => title.trim()).length 
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={showPreview ? "sm:max-w-4xl max-h-[90vh] overflow-y-auto" : "sm:max-w-md max-h-[90vh] overflow-y-auto"}>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-blue-500" />
            AI Blog Generation & Website Creation
          </DialogTitle>
          <DialogDescription>
            Generate {blogPostCount} blog posts and create a complete website package with integrated blog functionality.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isGenerating && !isComplete && (
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2 text-sm">What will be generated:</h4>
                <ul className="text-xs text-blue-800 space-y-0.5">
                  <li>• {blogPostCount} AI-written blog posts</li>
                  <li>• SEO-optimized blog content</li>
                  <li>• Blog navigation & archive pages</li>
                  <li>• Complete website with blog integration</li>
                  <li>• Mobile-responsive blog design</li>
                  <li>• Search engine optimized structure</li>
                </ul>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <Clock className="h-4 w-4 text-amber-600 mr-1" />
                  <span className="text-sm font-medium text-amber-900">Estimated Time</span>
                </div>
                <p className="text-xs text-amber-800">
                  5-7 minutes for {blogPostCount} blog posts and complete website generation
                </p>
              </div>
            </div>
          )}

          {(isGenerating || isComplete) && (
            <div className="space-y-4">
              <div className="text-center">
                {!isComplete ? (
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-500" />
                ) : (
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                )}
                <p className="text-sm text-muted-foreground">
                  {isComplete ? 'Generation Complete!' : 'Generating your blog and website...'}
                </p>
                <p className="text-xs font-medium mt-1">{currentStep}</p>
              </div>

              <Progress value={progress} className="w-full" />

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {generationSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-3 p-2 rounded border">
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : step.inProgress ? (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h5 className={`text-sm font-medium ${
                        step.completed ? "text-green-700" : 
                        step.inProgress ? "text-blue-700" : "text-gray-600"
                      }`}>
                        {step.title}
                      </h5>
                      <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                      {!step.completed && !step.inProgress && (
                        <p className="text-xs text-gray-400 mt-0.5">Est. {step.estimatedTime}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Blog Posts Preview Section */}
        {showPreview && generatedPosts.length > 0 && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <Eye className="mr-2 h-5 w-5 text-blue-500" />
                Review Generated Blog Posts
              </h3>
              <span className="text-sm text-gray-500">
                {generatedPosts.length} posts generated
              </span>
            </div>
            
            <ScrollArea className="h-96 w-full rounded-md border p-4">
              <div className="space-y-6">
                {generatedPosts.map((post, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="space-y-2">
                          <Label htmlFor={`title-${index}`} className="text-sm font-medium">
                            Title
                          </Label>
                          {editingPost === index ? (
                            <Input
                              id={`title-${index}`}
                              value={post.title}
                              onChange={(e) => handleEditPost(index, 'title', e.target.value)}
                              className="font-medium"
                            />
                          ) : (
                            <h4 className="font-medium text-lg">{post.title}</h4>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingPost(editingPost === index ? null : index)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Category</Label>
                        {editingPost === index ? (
                          <Input
                            value={post.category}
                            onChange={(e) => handleEditPost(index, 'category', e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-sm text-gray-600 mt-1">{post.category}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Author</Label>
                        {editingPost === index ? (
                          <Input
                            value={post.author}
                            onChange={(e) => handleEditPost(index, 'author', e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-sm text-gray-600 mt-1">{post.author}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Excerpt</Label>
                      {editingPost === index ? (
                        <Textarea
                          value={post.excerpt}
                          onChange={(e) => handleEditPost(index, 'excerpt', e.target.value)}
                          rows={2}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-gray-600 mt-1">{post.excerpt}</p>
                      )}
                    </div>

                    {/* Featured Image Section */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-1">
                        <ImageIcon className="h-4 w-4" />
                        Featured Image
                      </Label>
                      {editingPost === index ? (
                        <div className="space-y-2">
                          <Input
                            placeholder="https://example.com/image.jpg"
                            value={post.featuredImageUrl || ''}
                            onChange={(e) => handleEditPost(index, 'featuredImageUrl', e.target.value)}
                          />
                          <Input
                            placeholder="Image description for accessibility"
                            value={post.featuredImageAlt || ''}
                            onChange={(e) => handleEditPost(index, 'featuredImageAlt', e.target.value)}
                          />
                        </div>
                      ) : (
                        <div>
                          {post.featuredImageUrl ? (
                            <div className="space-y-1">
                              <img 
                                src={post.featuredImageUrl} 
                                alt={post.featuredImageAlt || post.title}
                                className="w-full h-32 object-cover rounded border"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              <p className="text-xs text-gray-500">{post.featuredImageAlt || 'No alt text'}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic">No featured image</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Content</Label>
                      {editingPost === index ? (
                        <Textarea
                          value={post.content}
                          onChange={(e) => handleEditPost(index, 'content', e.target.value)}
                          rows={6}
                          className="mt-1 font-mono text-sm"
                        />
                      ) : (
                        <div className="mt-1 p-3 bg-gray-50 rounded border text-sm max-h-32 overflow-y-auto">
                          {post.content.substring(0, 300)}...
                        </div>
                      )}
                    </div>

                    {post.tags.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Tags</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {post.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {index < generatedPosts.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="flex justify-center">
              <Button 
                onClick={createFinalWebsite}
                disabled={isGenerating}
                className="bg-green-600 hover:bg-green-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Website...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Create & Download Website
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            {isComplete ? 'Close' : 'Cancel'}
          </Button>
          
          {!isGenerating && !isComplete && (
            <Button 
              onClick={generateBlogAndWebsite}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Blog & Website
            </Button>
          )}

          {isComplete && downloadUrl && (
            <Button 
              onClick={handleDownload}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Complete Website
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}