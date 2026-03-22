import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BusinessData } from '@shared/schema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StepBlogProps {
  form: UseFormReturn<BusinessData>;
}

export function StepBlog({ form }: StepBlogProps) {
  const generateBlog = form.watch("generateBlog");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-blog mr-3 text-indigo-500"></i>
            Blog Configuration
          </CardTitle>
          <CardDescription>
            Add a professional blog to your website for better SEO and customer engagement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="generateBlog"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Include Blog Section
                  </FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Add AI-generated blog posts to improve SEO and provide valuable content
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {generateBlog && (
            <div className="space-y-4 border-t pt-4">
              <FormField
                control={form.control}
                name="blogMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blog Content Mode</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blog mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ai">AI Generated Content</SelectItem>
                        <SelectItem value="manual">Manual Content Entry</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("blogMode") === "ai" && (
                <>
                  <FormField
                    control={form.control}
                    name="blogKeywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blog Keywords</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., plumbing tips, maintenance, repairs"
                            {...field} 
                          />
                        </FormControl>
                        <div className="text-sm text-muted-foreground">
                          Keywords to focus the AI-generated content around
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="blogTitles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blog Topics/Titles</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={3}
                            placeholder="Enter blog topics or titles, one per line..."
                            {...field} 
                          />
                        </FormControl>
                        <div className="text-sm text-muted-foreground">
                          Specific topics you want blog posts about
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="blogWordCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Word Count per Post</FormLabel>
                          <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select word count" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="300">Short (300 words)</SelectItem>
                              <SelectItem value="500">Medium (500 words)</SelectItem>
                              <SelectItem value="800">Long (800 words)</SelectItem>
                              <SelectItem value="1200">Extended (1200 words)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="blogAiProvider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>AI Provider</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select AI provider" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="openai">OpenAI</SelectItem>
                              <SelectItem value="openrouter">OpenRouter</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="blogUseImages"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">
                            Include Images
                          </FormLabel>
                          <div className="text-xs text-muted-foreground">
                            Add relevant images to blog posts
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}

              {form.watch("blogMode") === "manual" && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">
                      Manual Blog Content
                    </h4>
                    <p className="text-sm text-yellow-700">
                      With manual mode, you can add your own blog posts after generating the website. 
                      The blog system will be included in your website, ready for your content.
                    </p>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Your website will include:
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• A professional blog layout</li>
                    <li>• Individual post pages</li>
                    <li>• Blog archive page</li>
                    <li>• Category and tag organization</li>
                    <li>• SEO-optimized blog structure</li>
                  </ul>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  <i className="fas fa-lightbulb mr-2"></i>
                  Blog Benefits
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Improves search engine rankings (SEO)</li>
                  <li>• Establishes your business as an expert</li>
                  <li>• Provides value to potential customers</li>
                  <li>• Increases website engagement and time on site</li>
                  <li>• Generates more leads and conversions</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
