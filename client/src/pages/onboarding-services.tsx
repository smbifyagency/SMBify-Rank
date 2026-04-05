import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useState } from "react";
import { Wrench, ArrowRight, ArrowLeft, Plus, X } from "lucide-react";
import { useBusinessData } from "@/contexts/business-data-context";

const suggestedServices: Record<string, string[]> = {
    default: [
      "Water Damage Restoration", "Residential Water Damage Restoration", "Commercial Water Damage Restoration",
      "Emergency Water Extraction", "Flood Cleanup & Flood Damage Repair", "Commercial Flood Extraction",
      "Basement Flooding Cleanup", "Burst Pipe Repair & Cleanup", "Appliance Leak Water Damage",
      "Roof Leak Water Damage Repair", "Ceiling & Wall Water Damage Repair", "Hardwood Floor Water Damage Repair",
      "Drywall Water Damage Repair", "Carpet Water Damage & Drying", "Mold Remediation & Mold Removal",
      "Sewage Backup Cleanup", "Biohazard & Trauma Cleanup", "Storm Damage Restoration",
      "Structural Drying & Dehumidification", "Fire & Smoke Damage Restoration", "Crawl Space Water Damage",
      "Document Drying & Recovery", "HVAC Water Damage & Cleaning", "24/7 Emergency Response",
      "Insurance Claim Assistance", "Odor Removal & Deodorization", "Content Pack-Out & Storage"
    ],
};

export default function OnboardingServices() {
    const [, setLocation] = useLocation();
    const { businessData, updateBusinessData } = useBusinessData();
    const [services, setServices] = useState<string[]>((businessData as any).services || []);
    const [customService, setCustomService] = useState("");

    const toggleService = (service: string) => {
        setServices((prev) =>
            prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
        );
    };

    const addCustom = () => {
        if (customService.trim() && !services.includes(customService.trim())) {
            setServices([...services, customService.trim()]);
            setCustomService("");
        }
    };

    const handleNext = () => {
        updateBusinessData({ services } as any);
        setLocation("/onboarding/locations");
    };

    return (
        <div className="min-h-[80vh] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Progress */}
                <div className="flex items-center justify-between mb-8">
                    {["Business", "Services", "Locations", "Brand", "API", "Generate", "Preview"].map((step, i) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= 1 ? "bg-gradient-to-r bg-[#7C3AED] text-white" : "bg-white/5 text-gray-500 border border-white/10"
                                }`}>
                                {i + 1}
                            </div>
                            {i < 6 && <div className="w-4 sm:w-8 h-px bg-white/10 mx-1" />}
                        </div>
                    ))}
                </div>

                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-[#7C3AED]/8 flex items-center justify-center mx-auto mb-4">
                        <Wrench className="h-8 w-8 text-[#7C3AED]" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Your Services</h1>
                    <p className="text-gray-400">Select or add the services your business offers. These will be used to generate content.</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 space-y-6">
                    {/* Suggested */}
                    <div>
                        <p className="text-sm text-gray-400 mb-3">Suggested services</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedServices.default.map((service) => (
                                <button
                                    key={service}
                                    onClick={() => toggleService(service)}
                                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${services.includes(service)
                                            ? "bg-[#7C3AED]/15 text-[#9333EA] border border-[#7C3AED]/40"
                                            : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                                        }`}
                                >
                                    {service}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom */}
                    <div>
                        <p className="text-sm text-gray-400 mb-3">Add custom service</p>
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g., Custom Kitchen Work"
                                value={customService}
                                onChange={(e) => setCustomService(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addCustom()}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                            />
                            <Button onClick={addCustom} variant="outline" className="border-white/20 text-gray-300 hover:bg-white/5 bg-transparent">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Selected */}
                    {services.length > 0 && (
                        <div>
                            <p className="text-sm text-gray-400 mb-3">Selected ({services.length})</p>
                            <div className="flex flex-wrap gap-2">
                                {services.map((service) => (
                                    <span key={service} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-[#7C3AED]/15 text-[#9333EA] border border-[#7C3AED]/40">
                                        {service}
                                        <button onClick={() => toggleService(service)}>
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setLocation("/onboarding/business")}
                            className="border-white/20 text-gray-400 hover:bg-white/5 bg-transparent"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button
                            onClick={handleNext}
                            className="bg-[#7C3AED] hover:bg-[#9333EA] text-black font-bold px-8"
                        >
                            Next: Locations <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
