import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BusinessData } from '@shared/schema';
import { useAuth } from '@/hooks/useAuth';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StepSeoFaqProps {
  form: UseFormReturn<BusinessData>;
}

export function StepSeoFaq({ form }: StepSeoFaqProps) {
  const { user } = useAuth();
  const [isGeneratingFAQ, setIsGeneratingFAQ] = useState(false);
  const [isGeneratingTestimonials, setIsGeneratingTestimonials] = useState(false);

  // Check if user is AI user for conditional rendering
  const isAIUser = !!(user as any)?.role || (user as any)?.id === "admin";

  const generateFAQContent = async () => {
    setIsGeneratingFAQ(true);
    // FAQ generation logic here
    setIsGeneratingFAQ(false);
  };

  const generateTestimonials = async () => {
    setIsGeneratingTestimonials(true);
    // Testimonial generation logic here
    setIsGeneratingTestimonials(false);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="seo" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="seo">SEO Content</TabsTrigger>
          <TabsTrigger value="faq">FAQ Section</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-search mr-3 text-green-500"></i>
                SEO Content
              </CardTitle>
              <CardDescription>
                Additional content sections for better search engine visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((num) => (
                <div key={num} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                  <FormField
                    control={form.control}
                    name={`seoHeading${num}` as keyof BusinessData}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Heading {num}</FormLabel>
                        <FormControl>
                          <Input placeholder={`SEO Section ${num} Title`} {...field} value={(field.value as string) || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`seoContent${num}` as keyof BusinessData}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Content {num}</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            placeholder={`Content for section ${num}...`}
                            {...field}
                            value={(field.value as string) || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-question-circle mr-3 text-purple-500"></i>
                  FAQ Section
                </div>
                {isAIUser && (
                  <Button
                    type="button"
                    onClick={generateFAQContent}
                    disabled={isGeneratingFAQ}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isGeneratingFAQ ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Generating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-magic mr-2"></i>
                        Generate with AI
                      </>
                    )}
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                Common questions your customers might ask
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <div key={num} className="p-3 border rounded-lg space-y-2">
                    <div className="text-sm font-medium text-gray-700">FAQ {num}</div>
                    <FormField
                      control={form.control}
                      name={`faqQuestion${num}` as keyof BusinessData}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder={`Question ${num}...`}
                              className="text-sm"
                              {...field}
                              value={String(field.value || "")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`faqAnswer${num}` as keyof BusinessData}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              rows={2}
                              placeholder={`Answer ${num}...`}
                              className="text-sm"
                              {...field}
                              value={String(field.value || "")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-star mr-3 text-yellow-500"></i>
                  Customer Testimonials
                </div>
                {isAIUser && (
                  <Button
                    type="button"
                    onClick={generateTestimonials}
                    disabled={isGeneratingTestimonials}
                    size="sm"
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    {isGeneratingTestimonials ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Generating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-magic mr-2"></i>
                        Generate with AI
                      </>
                    )}
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                Customer reviews to build trust and credibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="p-4 border rounded-lg space-y-3">
                    <div className="text-sm font-medium text-gray-700">Testimonial {num}</div>
                    <FormField
                      control={form.control}
                      name={`testimonial${num}Name` as keyof BusinessData}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Customer name"
                              {...field}
                              value={field.value?.toString() || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`testimonial${num}Rating` as keyof BusinessData}
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Rating" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="5">⭐⭐⭐⭐⭐ (5)</SelectItem>
                              <SelectItem value="4">⭐⭐⭐⭐ (4)</SelectItem>
                              <SelectItem value="3">⭐⭐⭐ (3)</SelectItem>
                              <SelectItem value="2">⭐⭐ (2)</SelectItem>
                              <SelectItem value="1">⭐ (1)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`testimonial${num}Text` as keyof BusinessData}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              rows={3}
                              placeholder="Review text..."
                              {...field}
                              value={field.value?.toString() || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}