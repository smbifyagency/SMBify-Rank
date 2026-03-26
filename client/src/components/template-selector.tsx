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
          {templatesForCategory.map((template, index) => {
            const isSelected = selectedTemplate === template.id;
            const isRecommended = index === 0 && recommendedTemplate?.id === template.id;
            return (
              <div
                key={template.id}
                title={template.name}
                onClick={() => onTemplateChange(template.id)}
                className={`group cursor-pointer relative rounded-md overflow-hidden transition-transform hover:scale-105 hover:shadow-md ${
                  isSelected ? 'ring-2 ring-blue-500 ring-offset-1 shadow-md' : 'ring-1 ring-gray-200'
                }`}
              >
                {/* Recommended star badge */}
                {isRecommended && (
                  <div className="absolute -top-1 -right-1 z-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                    ⭐
                  </div>
                )}

                {/* Palette swatch: primary (top 60%) + bottom row of secondary / accent / bg */}
                <div className="flex flex-col h-10">
                  {/* Primary bar */}
                  <div
                    className="flex-1"
                    style={{ backgroundColor: template.colors.primary }}
                  />
                  {/* Bottom strip: secondary | accent | background */}
                  <div className="flex h-3">
                    <div className="flex-1" style={{ backgroundColor: template.colors.secondary }} />
                    <div className="flex-1" style={{ backgroundColor: template.colors.accent }} />
                    <div className="flex-1 border-l border-gray-200/40" style={{ backgroundColor: template.colors.background }} />
                  </div>
                </div>

                {/* Selected tick */}
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full w-5 h-5 flex items-center justify-center shadow">
                      <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 12 12">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected template name */}
        {selectedTemplate && (() => {
          const t = templatesForCategory.find(t => t.id === selectedTemplate);
          return t ? (
            <p className="mt-2 text-xs text-gray-500 text-center">
              Selected: <span className="font-medium text-gray-700">{t.name}</span>
            </p>
          ) : null;
        })()}
      </div>
    </div>
  );
}
