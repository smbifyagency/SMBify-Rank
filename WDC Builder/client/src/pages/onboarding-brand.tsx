import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState } from "react";
import { Palette, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useBusinessData } from "@/contexts/business-data-context";

const templates = [
    { id: "modern", name: "Modern Clean", preview: "bg-gradient-to-br from-slate-900 to-slate-800" },
    { id: "bold", name: "Bold Impact", preview: "bg-gradient-to-br from-indigo-900 to-purple-900" },
    { id: "classic", name: "Classic Pro", preview: "bg-gradient-to-br from-gray-800 to-gray-900" },
    { id: "warm", name: "Warm Trust", preview: "bg-gradient-to-br from-amber-900 to-orange-900" },
    { id: "fresh", name: "Fresh Green", preview: "bg-gradient-to-br from-emerald-900 to-teal-900" },
    { id: "ocean", name: "Ocean Blue", preview: "bg-gradient-to-br from-blue-900 to-cyan-900" },
];

const colorSchemes = [
    { id: "indigo", colors: ["#6366f1", "#818cf8", "#a5b4fc"], label: "Indigo" },
    { id: "emerald", colors: ["#10b981", "#34d399", "#6ee7b7"], label: "Emerald" },
    { id: "rose", colors: ["#f43f5e", "#fb7185", "#fda4af"], label: "Rose" },
    { id: "amber", colors: ["#f59e0b", "#fbbf24", "#fcd34d"], label: "Amber" },
    { id: "violet", colors: ["#8b5cf6", "#a78bfa", "#c4b5fd"], label: "Violet" },
    { id: "cyan", colors: ["#06b6d4", "#22d3ee", "#67e8f9"], label: "Cyan" },
];

export default function OnboardingBrand() {
    const [, setLocation] = useLocation();
    const { businessData, updateBusinessData } = useBusinessData();
    const [selectedTemplate, setSelectedTemplate] = useState((businessData as any).selectedTemplate || "modern");
    const [selectedColor, setSelectedColor] = useState((businessData as any).colorScheme || "indigo");

    const handleNext = () => {
        updateBusinessData({ selectedTemplate, colorScheme: selectedColor } as any);
        setLocation("/onboarding/api-setup");
    };

    return (
        <div className="min-h-[80vh] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    {["Business", "Services", "Locations", "Brand", "API", "Generate", "Preview"].map((step, i) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= 3 ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white" : "bg-white/5 text-gray-500 border border-white/10"
                                }`}>{i + 1}</div>
                            {i < 6 && <div className="w-4 sm:w-8 h-px bg-white/10 mx-1" />}
                        </div>
                    ))}
                </div>

                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                        <Palette className="h-8 w-8 text-rose-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Brand & Design</h1>
                    <p className="text-gray-400">Choose a template and color scheme that fits your brand.</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 space-y-8">
                    {/* Templates */}
                    <div>
                        <p className="text-sm text-gray-300 font-medium mb-3">Template</p>
                        <div className="grid grid-cols-3 gap-3">
                            {templates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(template.id)}
                                    className={`relative rounded-xl overflow-hidden border-2 transition-all ${selectedTemplate === template.id ? "border-indigo-500 ring-2 ring-indigo-500/30" : "border-white/10 hover:border-white/20"
                                        }`}
                                >
                                    <div className={`${template.preview} h-24 flex items-center justify-center`}>
                                        <div className="w-12 h-1 bg-white/30 rounded-full mb-1" />
                                    </div>
                                    <div className="bg-gray-900 px-2 py-2 text-xs text-gray-300 text-center">{template.name}</div>
                                    {selectedTemplate === template.id && (
                                        <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                                            <Check className="h-3 w-3 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Colors */}
                    <div>
                        <p className="text-sm text-gray-300 font-medium mb-3">Color Scheme</p>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                            {colorSchemes.map((scheme) => (
                                <button
                                    key={scheme.id}
                                    onClick={() => setSelectedColor(scheme.id)}
                                    className={`rounded-xl p-3 border-2 transition-all ${selectedColor === scheme.id ? "border-white/50 ring-2 ring-white/20" : "border-white/10 hover:border-white/20"
                                        }`}
                                >
                                    <div className="flex gap-1 mb-2 justify-center">
                                        {scheme.colors.map((color) => (
                                            <div key={color} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400 text-center">{scheme.label}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between pt-4">
                        <Button variant="outline" onClick={() => setLocation("/onboarding/locations")}
                            className="border-white/20 text-gray-400 hover:bg-white/5 bg-transparent">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button onClick={handleNext}
                            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-8">
                            Next: API Setup <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
