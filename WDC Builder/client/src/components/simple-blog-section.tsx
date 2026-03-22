import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Info } from 'lucide-react';
import type { BusinessData } from '@shared/schema';

interface SimpleBlogSectionProps {
  businessData: BusinessData;
  onChange: (data: Partial<BusinessData>) => void;
}

export function SimpleBlogSection({ businessData, onChange }: SimpleBlogSectionProps) {
  const blogEnabled = businessData.generateBlog || false;

  return (
    <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3">
          <FileText className="h-6 w-6" />
          Blog Setup
        </CardTitle>
        <CardDescription className="text-white/90">
          Add blog posts to your website for better SEO and customer engagement
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Simple Blog Checkbox */}
        <div className="flex items-center space-x-3">
          <Checkbox
            id="enable-blog"
            checked={blogEnabled}
            onCheckedChange={(checked) => {
              onChange({
                generateBlog: checked === true,
                blogMode: 'ai',
                blogPromptId: 'conversational',
                blogTitles: 'Top 10 Tips for Your Business'
              });
            }}
          />
          <div className="space-y-1">
            <Label htmlFor="enable-blog" className="text-lg font-semibold cursor-pointer">
              Include Blog Posts in Website
            </Label>
            <p className="text-sm text-gray-600">
              Add AI-generated blog posts to improve SEO and provide valuable content to your customers
            </p>
          </div>
        </div>

        {/* Blog Info */}
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>How it works:</strong> When enabled, your website will include:
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>Professional blog pages with AI-generated content</li>
              <li>SEO-optimized blog posts related to your business</li>
              <li>Blog navigation integrated into your website</li>
              <li>Mobile-responsive blog design matching your template</li>
              <li>Complete offline functionality in downloaded package</li>
            </ul>
          </AlertDescription>
        </Alert>

        {blogEnabled && (
          <Alert className="border-green-200 bg-green-50">
            <FileText className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Blog Enabled!</strong> Your website will include AI-generated blog posts that match your business type and location for better search engine visibility.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}