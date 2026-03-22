import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useState } from "react";
import { Building2, ArrowRight, MapPin, Phone, Globe2, Briefcase } from "lucide-react";
import { useBusinessData } from "@/contexts/business-data-context";

const categories = [
    "Plumber", "Electrician", "HVAC", "Roofer", "Dentist", "Chiropractor",
    "Restaurant", "Auto Repair", "Law Firm", "Real Estate", "Landscaping",
    "Pest Control", "Cleaning Service", "Dog Grooming", "Gym / Fitness",
    "Salon / Barber", "Accounting", "Photography", "Florist", "Bakery",
];

export default function OnboardingBusiness() {
    const [, setLocation] = useLocation();
    const { businessData, updateBusinessData } = useBusinessData();
    const [formData, setFormData] = useState({
        businessName: (businessData as any).businessName || "",
        category: (businessData as any).category || "",
        phone: (businessData as any).phone || "",
        address: (businessData as any).address || "",
        city: (businessData as any).city || "",
        state: (businessData as any).state || "",
        zip: (businessData as any).zip || "",
        website: (businessData as any).website || "",
    });

    const handleNext = () => {
        updateBusinessData(formData as any);
        setLocation("/onboarding/services");
    };

    return (
        <div className="min-h-[80vh] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Progress */}
                <div className="flex items-center justify-between mb-8">
                    {["Business", "Services", "Locations", "Brand", "API", "Generate", "Preview"].map((step, i) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white" : "bg-white/5 text-gray-500 border border-white/10"
                                }`}>
                                {i + 1}
                            </div>
                            {i < 6 && <div className="w-4 sm:w-8 h-px bg-white/10 mx-1" />}
                        </div>
                    ))}
                </div>

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                        <Building2 className="h-8 w-8 text-indigo-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Business Details</h1>
                    <p className="text-gray-400">Tell us about your business so our AI can generate the perfect content.</p>
                </div>

                {/* Form */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 space-y-6">
                    <div>
                        <Label className="text-gray-300 text-sm flex items-center gap-2">
                            <Building2 className="h-4 w-4" /> Business Name *
                        </Label>
                        <Input
                            placeholder="e.g., Smith & Sons Plumbing"
                            value={formData.businessName}
                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                            className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                    </div>

                    <div>
                        <Label className="text-gray-300 text-sm flex items-center gap-2">
                            <Briefcase className="h-4 w-4" /> Business Category *
                        </Label>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFormData({ ...formData, category: cat })}
                                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${formData.category === cat
                                            ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/50"
                                            : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-gray-300 text-sm flex items-center gap-2">
                                <Phone className="h-4 w-4" /> Phone
                            </Label>
                            <Input
                                placeholder="(555) 123-4567"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                            />
                        </div>
                        <div>
                            <Label className="text-gray-300 text-sm flex items-center gap-2">
                                <Globe2 className="h-4 w-4" /> Website (optional)
                            </Label>
                            <Input
                                placeholder="www.example.com"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="text-gray-300 text-sm flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Business Address
                        </Label>
                        <Input
                            placeholder="123 Main Street"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                        <div className="grid grid-cols-3 gap-3 mt-3">
                            <Input placeholder="City" value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                            <Input placeholder="State" value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                            <Input placeholder="ZIP" value={formData.zip}
                                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                        </div>
                    </div>

                    <div className="flex justify-between pt-4">
                        <Button variant="outline" onClick={() => setLocation("/dashboard/websites")} className="border-white/20 text-gray-400 hover:bg-white/5 bg-transparent">
                            Back
                        </Button>
                        <Button
                            onClick={handleNext}
                            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-8"
                        >
                            Next: Services <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
