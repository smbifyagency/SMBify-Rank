import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BlogPromptSelector } from "@/components/blog-prompt-selector";
import { ManualBlogManager } from "@/components/manual-blog-manager";
import { 
  FileText, 
  Wand2, 
  Settings, 
  Info, 
  CheckCircle,
  XCircle,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";
import type { BusinessData, ApiSetting } from "@shared/schema";

interface BlogGeneratorSectionProps {
  businessData: BusinessData;
  onChange: (data: Partial<BusinessData>) => void;
}

export function BlogGeneratorSection({ businessData, onChange }: BlogGeneratorSectionProps) {
  const [previewKeywords, setPreviewKeywords] = useState<string[]>([]);

  // Check API settings
  const { data: apiSettings } = useQuery<ApiSetting[]>({
    queryKey: ['/api/settings'],
  });

  const openaiSetting = apiSettings?.find(s => s.name === 'openai' && s.isActive && s.apiKey);
  const geminiSetting = apiSettings?.find(s => s.name === 'gemini' && s.isActive && s.apiKey);
  const openrouterSetting = apiSettings?.find(s => s.name === 'openrouter' && s.isActive && s.apiKey);
  const hasValidAI = openaiSetting || geminiSetting || openrouterSetting;

  // Auto-select best available AI provider and set defaults
  const getOptimalAIProvider = () => {
    if (openaiSetting) return 'openai';
    if (geminiSetting) return 'gemini';
    if (openrouterSetting) return 'openrouter';
    return 'openai';
  };

  // Set default AI provider and prompt when blog generation is enabled
  if (businessData.generateBlog && !businessData.blogAiProvider) {
    onChange({ 
      blogAiProvider: getOptimalAIProvider() as any,
      blogPromptId: 'professional'
    });
  }

  const generateExampleKeywords = () => {
    const category = businessData.category;
    const location = businessData.heroLocation;
    const service = businessData.heroService;
    
    const examples = [
      `${service} guide for homeowners`,
      `${category} maintenance tips`,
      `Emergency ${service} ${location}`,
      `Best ${category} practices`,
      `${service} cost in ${location}`,
      `When to call ${category} professional`,
      `${service} troubleshooting`,
      `${category} safety tips`
    ];
    
    const keywordsString = examples.join('\n');
    setPreviewKeywords(examples);
    onChange({ blogKeywords: keywordsString });
  };

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3">
          <FileText className="h-6 w-6" />
          AI Blog Generation
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            Optional
          </Badge>
        </CardTitle>
        <p className="text-purple-100 text-sm">
          Generate SEO-optimized blog posts for your website using AI
        </p>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* API Settings Check */}
        {!hasValidAI && (
          <Alert className="border-amber-200 bg-amber-50">
            <Settings className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>AI service configuration required for blog generation.</span>
              <Link href="/api-settings">
                <Button variant="outline" size="sm" className="ml-2">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Setup API Keys
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {hasValidAI && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              AI services configured and ready for blog generation.
              {openaiSetting && <span className="block text-sm">• OpenAI available</span>}
              {geminiSetting && <span className="block text-sm">• Gemini available</span>}
              {openrouterSetting && <span className="block text-sm">• OpenRouter available</span>}
            </AlertDescription>
          </Alert>
        )}

        {/* Enable/Disable Blog Generation */}
        <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border">
          <Switch
            id="generate-blog"
            checked={businessData.generateBlog || false}
            onCheckedChange={(checked) => onChange({ generateBlog: checked })}
            disabled={!hasValidAI}
          />
          <div className="flex-1">
            <Label htmlFor="generate-blog" className="text-base font-medium cursor-pointer">
              Enable Blog Generation
            </Label>
            <p className="text-sm text-muted-foreground">
              Generate AI-powered blog posts integrated into your website
            </p>
          </div>
        </div>

        {businessData.generateBlog && (
          <div className="space-y-6 border-t pt-6">
            {/* Hidden AI Provider Selection - Auto-configured */}
            <div className="hidden">
              <input type="hidden" value={getOptimalAIProvider()} />
              <input type="hidden" value="professional" />
            </div>

            {/* Simplified Keywords Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Keywords for Blog Posts</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateExampleKeywords}
                  className="text-xs"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  Generate Examples
                </Button>
              </div>
              <Textarea
                placeholder={`Enter keywords for blog posts, one per line (maximum 20 posts):
${businessData.category} maintenance tips
Emergency ${businessData.heroService}
Common ${businessData.category} problems
When to call professional ${businessData.heroService}
Cost of ${businessData.heroService} in ${businessData.heroLocation}`}
                value={businessData.blogKeywords || ""}
                onChange={(e) => {
                  const keywords = e.target.value.split('\n').filter(k => k.trim());
                  if (keywords.length <= 20) {
                    setPreviewKeywords(keywords);
                    onChange({ blogKeywords: e.target.value });
                  }
                }}
                rows={6}
                className="resize-none text-sm"
              />
              <div className="text-xs text-muted-foreground space-y-1">
                <div>
                  <Info className="h-3 w-3 inline mr-1" />
                  Each keyword creates one professional blog article. Maximum 20 articles allowed.
                </div>
                <div className="text-xs">
                  Current count: {(businessData.blogKeywords || '').split('\n').filter(k => k.trim()).length}/20 articles
                </div>
              </div>
              
              {/* Word Count Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Words per Blog Post</Label>
                <Select
                  value={businessData.blogWordCount?.toString() || "1500"}
                  onValueChange={(value) => onChange({ blogWordCount: parseInt(value) })}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="1500" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1000">1000 words</SelectItem>
                    <SelectItem value="1250">1250 words</SelectItem>
                    <SelectItem value="1500">1500 words</SelectItem>
                    <SelectItem value="1750">1750 words</SelectItem>
                    <SelectItem value="2000">2000 words</SelectItem>
                    <SelectItem value="2250">2250 words</SelectItem>
                    <SelectItem value="2500">2500 words</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Longer posts tend to rank better in search engines
                </p>
              </div>
              
              {/* Keywords Preview */}
              {previewKeywords.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Blog Posts Preview:</Label>
                  <div className="space-y-1">
                    {previewKeywords.map((keyword, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs bg-secondary/50 rounded p-2">
                        <span className="font-medium text-primary">#{index + 1}</span>
                        <span className="flex-1">{keyword}</span>
                        <Badge variant="outline" className="text-xs">
                          {businessData.blogWordCount || 1500} words
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Auto image
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    ✓ Category-relevant images automatically added<br/>
                    ✓ Professional SEO-optimized content<br/>
                    ✓ Industry-specific writing style
                  </p>
                </div>
              )}
            </div>

            {/* Blog Options */}
            <div className="grid grid-cols-1 gap-4">
              {/* Use Images */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Switch
                  id="blog-images"
                  checked={businessData.blogUseImages !== false}
                  onCheckedChange={(checked) => onChange({ blogUseImages: checked })}
                />
                <div className="flex-1">
                  <Label htmlFor="blog-images" className="text-sm font-medium cursor-pointer">
                    Include Featured Images
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Add relevant images to blog posts for better engagement
                  </p>
                </div>
              </div>

              {/* Output Option */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Blog Integration</Label>
                <Select
                  value={businessData.blogOutputOption || "blog_integrated"}
                  onValueChange={(value: "direct_download" | "blog_integrated") => 
                    onChange({ blogOutputOption: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog_integrated">
                      <div>
                        <div className="font-medium">Integrated Blog</div>
                        <div className="text-xs text-muted-foreground">
                          Blog posts included in website with navigation
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="direct_download">
                      <div>
                        <div className="font-medium">Standalone Blog Files</div>
                        <div className="text-xs text-muted-foreground">
                          Blog posts as separate HTML files
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Generated Blog Posts Manager */}
            {businessData.blogPosts && businessData.blogPosts.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Generated Blog Posts ({businessData.blogPosts.length})</Label>
                  <Badge variant="secondary">{businessData.blogPosts.filter(p => p.isAiGenerated).length} AI • {businessData.blogPosts.filter(p => !p.isAiGenerated).length} Manual</Badge>
                </div>
                <ManualBlogManager 
                  businessData={businessData} 
                  onChange={onChange}
                />
              </div>
            )}

            {/* Info Box */}
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>How it works:</strong> When you generate your website, AI will create professional blog posts 
                based on your keywords and business information. Each post will be SEO-optimized with proper meta tags, 
                headings, and structured content tailored to your industry. After generation, you can edit and manage all posts.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}