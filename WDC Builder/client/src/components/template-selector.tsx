import { templates, getTemplatesForCategory, getRecommendedTemplate } from "@/lib/templates";

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
  businessCategory?: string;
}

export function TemplateSelector({ selectedTemplate, onTemplateChange, businessCategory }: TemplateSelectorProps) {
  const templatesForCategory = businessCategory ? getTemplatesForCategory(businessCategory) : templates;
  const recommendedTemplate = businessCategory ? getRecommendedTemplate(businessCategory) : null;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Choose Template</h3>
        <p className="text-sm text-gray-600 mt-1">
          {businessCategory 
            ? `Templates optimized for ${businessCategory} • ${templatesForCategory.length} themes available`
            : `${templates.length} professional themes available`
          }
        </p>
        {recommendedTemplate && (
          <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 font-medium">
              ✨ Recommended theme - Perfect for your business category
            </p>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="grid grid-cols-6 gap-1.5">
          {templatesForCategory.map((template, index) => (
            <div 
              key={template.id}
              className={`group cursor-pointer relative ${selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => onTemplateChange(template.id)}
            >
              {/* Recommended Badge */}
              {index === 0 && recommendedTemplate?.id === template.id && (
                <div className="absolute -top-1 -right-1 z-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-1 py-0.5 rounded-full shadow-lg">
                  ⭐
                </div>
              )}
              
              <div 
                className={`${template.gradient} rounded-md p-1.5 text-white text-center transition-transform group-hover:scale-105 relative overflow-hidden`}
              >
                <div className="mt-1">
                  <i className={`${template.icon} text-xs mb-1`}></i>
                  <div className="w-4 h-1 bg-white/30 rounded mx-auto"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
