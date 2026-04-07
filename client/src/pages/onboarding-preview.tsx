import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useBusinessData } from "@/contexts/business-data-context";
import WaterDamageTemplatePreview from "@/components/water-damage-template-preview";
import {
    Eye, Rocket, CheckCircle, ArrowRight, ArrowLeft, LayoutTemplate, Palette, MapPin
} from "lucide-react";

const colorSchemes: Record<string, { primary: string; secondary: string; label: string }> = {
    indigo: { primary: "#4f46e5", secondary: "#7c3aed", label: "Indigo" },
    emerald: { primary: "#059669", secondary: "#10b981", label: "Emerald" },
    rose: { primary: "#e11d48", secondary: "#f43f5e", label: "Rose" },
    amber: { primary: "#d97706", secondary: "#f59e0b", label: "Amber" },
    violet: { primary: "#7c3aed", secondary: "#8b5cf6", label: "Violet" },
    cyan: { primary: "#0891b2", secondary: "#06b6d4", label: "Cyan" },
};

function buildPreviewData(businessData: any) {
    const palette = colorSchemes[businessData?.colorScheme || "indigo"] || colorSchemes.indigo;
    const services = Array.isArray(businessData?.services) ? businessData.services : [];
    const locations = Array.isArray(businessData?.locations)
        ? businessData.locations
            .map((location: any) => {
                if (typeof location === "string") return location;
                return [location?.city, location?.state].filter(Boolean).join(", ");
            })
            .filter(Boolean)
        : [];

    const businessName = businessData?.businessName || "Your Business";
    const category = businessData?.category || "Local Service";
    const city = businessData?.city || locations[0]?.split(",")[0] || "your city";

    return {
        businessName,
        phone: [businessData?.countryCode, businessData?.phone].filter(Boolean).join(" ") || "(555) 123-4567",
        email: businessData?.email || "",
        address: [businessData?.address, businessData?.city, businessData?.state, businessData?.zip].filter(Boolean).join(", "),
        templateVariant: businessData?.selectedTemplate || "modern",
        primaryColor: palette.primary,
        secondaryColor: palette.secondary,
        heroHeadline: `Trusted ${category} in ${city}`,
        heroSubheadline: `This is the raw template preview for ${businessName}. AI-written page content will only be created after you click Generate Website.`,
        aboutText: `${businessName} can use this layout as a launch-ready base. Once you generate the website, SMBify Rank will build AI copy, service pages, and location pages using the details you already entered in the wizard.`,
        youtubeUrl: businessData?.youtubeUrl || "",
        services,
        locations,
    };
}

export default function OnboardingPreview() {
    const [, setLocation] = useLocation();
    const { businessData } = useBusinessData();

    const previewData = buildPreviewData(businessData as any);
    const locationCount = Array.isArray((businessData as any).locations) ? (businessData as any).locations.length : 0;
    const serviceCount = Array.isArray((businessData as any).services) ? (businessData as any).services.length : 0;
    const selectedTemplate = (businessData as any).selectedTemplate || "modern";
    const selectedColor = colorSchemes[(businessData as any).colorScheme || "indigo"] || colorSchemes.indigo;

    return (
        <div className="min-h-[80vh] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    {["Business", "Services", "Locations", "Brand", "API", "Generate", "Preview"].map((step, i) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-r bg-[#7C3AED] text-white`}>{i + 1}</div>
                            {i < 6 && <div className="w-4 sm:w-8 h-px bg-[#7C3AED]/20 mx-1" />}
                        </div>
                    ))}
                </div>

                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-4 py-2 mb-4">
                        <Eye className="h-4 w-4 text-sky-400" />
                        <span className="text-sm text-sky-300">Template Preview Only</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Preview Your Template</h1>
                    <p className="text-gray-400">This shows the raw layout only. AI content and full page generation start after you click Generate Website.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-4 mb-8">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Template</p>
                        <div className="mt-3 flex items-center gap-2 text-white">
                            <LayoutTemplate className="h-4 w-4 text-[#A855F7]" />
                            <span className="text-sm font-semibold capitalize">{selectedTemplate}</span>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Color</p>
                        <div className="mt-3 flex items-center gap-2 text-white">
                            <Palette className="h-4 w-4 text-[#A855F7]" />
                            <span className="text-sm font-semibold">{selectedColor.label}</span>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Services</p>
                        <p className="mt-3 text-2xl font-semibold text-white">{serviceCount}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Locations</p>
                        <div className="mt-3 flex items-center gap-2 text-white">
                            <MapPin className="h-4 w-4 text-[#A855F7]" />
                            <span className="text-sm font-semibold">{locationCount}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                    <Button
                        variant="outline"
                        onClick={() => setLocation("/onboarding/generating")}
                        className="border-white/15 bg-transparent text-gray-300 hover:bg-white/5"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                        onClick={() => setLocation("/onboarding/generating?mode=generate")}
                        className="bg-[#7C3AED] hover:bg-[#9333EA] text-black font-bold px-8"
                    >
                        Generate Website <Rocket className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-3 shadow-2xl shadow-black/30">
                    <WaterDamageTemplatePreview data={previewData} />
                </div>

                <div className="text-center mt-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
                        <CheckCircle className="h-4 w-4" />
                        This preview does not create a website yet.
                    </div>
                    <div className="mt-4">
                        <Button
                            size="lg"
                            onClick={() => setLocation("/onboarding/generating?mode=generate")}
                            className="bg-[#7C3AED] hover:bg-[#9333EA] text-black font-bold text-base px-10 py-6 rounded-xl shadow-lg shadow-[#7C3AED]/25"
                        >
                            Generate Full Website <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
