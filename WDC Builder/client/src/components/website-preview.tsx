import React, { useState } from "react";
import { BusinessData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { templates } from "@/lib/templates";

interface WebsitePreviewProps {
  businessData: Partial<BusinessData>;
  template: string;
  isGenerating: boolean;
}

export function WebsitePreview({ businessData, template, isGenerating }: WebsitePreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const selectedTemplate = templates.find(t => t.id === template) || templates[0];
  
  const getPreviewTitle = () => {
    if (businessData.businessName) return businessData.businessName;
    if (businessData.heroService) return `Elite ${businessData.heroService}`;
    return "Your Business Name";
  };

  const getPreviewSubtitle = () => {
    const service = businessData.heroService || "Professional Service";
    const location = businessData.heroLocation || "Your City";
    return `${service} in ${location}`;
  };

  const getPreviewServices = () => {
    return businessData.services || "Professional services available";
  };

  const getFeatures = () => {
    const headlines = businessData.featureHeadlines?.split(',').map(h => h.trim()) || [];
    return headlines.slice(0, 3);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Live Preview</h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setViewMode('desktop')}
              className={`p-2 transition-colors ${viewMode === 'desktop' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700'} rounded`}
            >
              <i className="fas fa-desktop text-sm"></i>
            </button>
            <button 
              onClick={() => setViewMode('mobile')}
              className={`p-2 transition-colors ${viewMode === 'mobile' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700'} rounded`}
            >
              <i className="fas fa-mobile-alt text-sm"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="bg-gray-100 rounded-lg overflow-hidden flex justify-center" style={{ height: "400px" }}>
          <div 
            className={`bg-white h-full overflow-y-auto transition-all duration-300 ${
              viewMode === 'mobile' ? 'w-80 mx-2' : 'w-full'
            }`}
            style={{ 
              maxWidth: viewMode === 'mobile' ? '320px' : '100%',
              minWidth: viewMode === 'mobile' ? '320px' : 'auto'
            }}
          >
            {/* Preview Header */}
            <div className={`${selectedTemplate.gradient} text-white p-4`}>
              <div className="h-24 bg-black bg-opacity-20 rounded-lg mb-4 flex items-center justify-center">
                <i className="fas fa-tools text-3xl opacity-50"></i>
              </div>
              <h1 className="text-lg font-bold">{getPreviewTitle()}</h1>
              <p className="text-sm opacity-90">{getPreviewSubtitle()}</p>
            </div>

            {/* Preview Content */}
            <div className="p-4 space-y-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="font-semibold text-sm text-gray-900">About</h3>
                <p className="text-xs text-gray-600 mt-1">
                  {businessData.aboutDescription?.substring(0, 100) || "Tell your story and what makes your business special..."}
                  {businessData.aboutDescription && businessData.aboutDescription.length > 100 && "..."}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="font-semibold text-sm text-gray-900">Services</h3>
                <p className="text-xs text-gray-600 mt-1">{getPreviewServices()}</p>
              </div>

              {/* SEO Content Preview */}
              {(businessData.seoHeading1 || businessData.seoHeading2 || businessData.seoHeading3) && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="font-semibold text-sm text-gray-900">SEO Content</h3>
                  <div className="space-y-2 mt-2">
                    {businessData.seoHeading1 && (
                      <div>
                        <h4 className="font-medium text-xs text-gray-800">{businessData.seoHeading1}</h4>
                        <p className="text-xs text-gray-600">
                          {businessData.seoContent1?.substring(0, 80)}
                          {businessData.seoContent1 && businessData.seoContent1.length > 80 && "..."}
                        </p>
                      </div>
                    )}
                    {businessData.seoHeading2 && (
                      <div>
                        <h4 className="font-medium text-xs text-gray-800">{businessData.seoHeading2}</h4>
                        <p className="text-xs text-gray-600">
                          {businessData.seoContent2?.substring(0, 80)}
                          {businessData.seoContent2 && businessData.seoContent2.length > 80 && "..."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="font-semibold text-sm text-gray-900">Contact</h3>
                <p className="text-xs text-gray-600">{businessData.phone || "(555) 123-4567"}</p>
                <p className="text-xs text-gray-600">{businessData.email || "info@yourbusiness.com"}</p>
              </div>

              {getFeatures().length > 0 && (
                <div className={`${selectedTemplate.lightBg} rounded-lg p-3`}>
                  <h3 className={`font-semibold text-sm ${selectedTemplate.darkText}`}>Key Features</h3>
                  <div className={`text-xs ${selectedTemplate.mediumText} mt-1`}>
                    {getFeatures().map((feature, index) => (
                      <div key={index} className="flex items-center mb-1">
                        <i className="fas fa-check-circle mr-1"></i>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            <i className="fas fa-external-link-alt mr-1"></i>Open Full Preview
          </button>
        </div>
      </div>

      {/* Generation Status */}
      {isGenerating && (
        <div className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-xl p-4 mt-6 border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-spinner fa-spin text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Generating Website...</h4>
              <p className="text-sm text-blue-700">Creating your professional local business website</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
