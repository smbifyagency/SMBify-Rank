import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BusinessData } from '@shared/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StepApiSettingsProps {
  form: UseFormReturn<BusinessData>;
}

export function StepApiSettings({ form }: StepApiSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-key mr-3 text-blue-500"></i>
            API Configuration
          </CardTitle>
          <CardDescription>
            Setup API keys for enhanced features (optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">
              <i className="fas fa-robot mr-2"></i>
              AI Features Available
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• AI-generated blog content</li>
              <li>• Automatic FAQ generation</li>
              <li>• Smart testimonial creation</li>
              <li>• Content optimization</li>
            </ul>
            <p className="text-xs text-blue-600 mt-3">
              API keys will be requested when you use AI features in later steps.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}