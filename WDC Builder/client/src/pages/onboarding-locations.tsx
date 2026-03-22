import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useState } from "react";
import { MapPin, ArrowRight, ArrowLeft, Plus, X, Navigation } from "lucide-react";
import { useBusinessData } from "@/contexts/business-data-context";

export default function OnboardingLocations() {
    const [, setLocation] = useLocation();
    const { businessData, updateBusinessData } = useBusinessData();
    const storedLocations = (businessData as any).locations;
    const [locations, setLocations] = useState<{ city: string; state: string }[]>(
        Array.isArray(storedLocations) && storedLocations.length > 0
            ? storedLocations
            : [{ city: "", state: "" }]
    );

    const addLocation = () => setLocations([...locations, { city: "", state: "" }]);
    const removeLocation = (i: number) => setLocations(locations.filter((_, idx) => idx !== i));
    const updateLocation = (i: number, field: "city" | "state", value: string) => {
        const updated = [...locations];
        updated[i][field] = value;
        setLocations(updated);
    };

    const handleNext = () => {
        updateBusinessData({ locations } as any);
        setLocation("/onboarding/brand");
    };

    return (
        <div className="min-h-[80vh] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    {["Business", "Services", "Locations", "Brand", "API", "Generate", "Preview"].map((step, i) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= 2 ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white" : "bg-white/5 text-gray-500 border border-white/10"
                                }`}>{i + 1}</div>
                            {i < 6 && <div className="w-4 sm:w-8 h-px bg-white/10 mx-1" />}
                        </div>
                    ))}
                </div>

                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                        <MapPin className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Service Locations</h1>
                    <p className="text-gray-400">Add the cities/areas your business serves. We'll create location-specific pages for local SEO.</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 space-y-6">
                    <div className="space-y-3">
                        {locations.map((loc, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Navigation className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                                <Input placeholder="City" value={loc.city} onChange={(e) => updateLocation(i, "city", e.target.value)}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                                <Input placeholder="State" value={loc.state} onChange={(e) => updateLocation(i, "state", e.target.value)}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 w-28" />
                                {locations.length > 1 && (
                                    <button onClick={() => removeLocation(i)} className="text-gray-500 hover:text-red-400">
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <Button onClick={addLocation} variant="outline" className="w-full border-dashed border-white/20 text-gray-400 hover:bg-white/5 bg-transparent">
                        <Plus className="mr-2 h-4 w-4" /> Add Another Location
                    </Button>

                    <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4">
                        <p className="text-sm text-emerald-300/80">
                            <strong>💡 Pro tip:</strong> Adding multiple locations helps create targeted landing pages that rank for "{`[service] in [city]`}" searches.
                        </p>
                    </div>

                    <div className="flex justify-between pt-4">
                        <Button variant="outline" onClick={() => setLocation("/onboarding/services")}
                            className="border-white/20 text-gray-400 hover:bg-white/5 bg-transparent">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button onClick={handleNext}
                            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-8">
                            Next: Brand <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
