import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle, Sparkles, FileText, Search, Code2, Image, AlertCircle } from "lucide-react";
import { useBusinessData } from "@/contexts/business-data-context";
import { useToast } from "@/hooks/use-toast";

const steps = [
    { icon: FileText, label: "Preparing business information...", duration: 1000 },
    { icon: Sparkles, label: "Writing service descriptions...", duration: 1500 },
    { icon: Search, label: "Creating SEO meta tags...", duration: 1200 },
    { icon: Code2, label: "Building schema markup...", duration: 1000 },
    { icon: Image, label: "Finalizing website structure...", duration: 800 },
];

export default function OnboardingGenerating() {
    const [, setLocation] = useLocation();
    const { businessData, clearBusinessData } = useBusinessData();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [createdWebsiteId, setCreatedWebsiteId] = useState<string | null>(null);
    const [retryKey, setRetryKey] = useState(0);

    // Animate progress bar
    useEffect(() => {
        if (isComplete || hasError) return;
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95) {
                    clearInterval(timer);
                    return 95;
                }
                return prev + 1;
            });
        }, 60);
        return () => clearInterval(timer);
    }, [isComplete, hasError]);

    // Advance step labels
    useEffect(() => {
        if (isComplete || hasError) return;
        if (currentStep < steps.length - 1) {
            const timer = setTimeout(() => setCurrentStep((prev) => prev + 1), steps[currentStep].duration);
            return () => clearTimeout(timer);
        }
    }, [currentStep, isComplete, hasError]);

    // Create the website via the API
    useEffect(() => {
        let cancelled = false;

        const createWebsite = async () => {
            try {
                const bd = businessData as any;
                const businessName = bd.businessName || "My Business";
                const category = bd.category || "Business";

                // Build locations string from the locations array
                const locationsArr = Array.isArray(bd.locations) ? bd.locations : [];
                const locationString = locationsArr
                    .map((l: any) => (typeof l === "string" ? l : `${l.city || ""}${l.state ? ", " + l.state : ""}`).trim())
                    .filter(Boolean)
                    .join(", ");

                // Build services string
                const servicesArr = Array.isArray(bd.services) ? bd.services : [];
                const servicesString = servicesArr.join(", ");

                const payload = {
                    title: businessName,
                    description: `${category} website for ${businessName}`,
                    template: bd.selectedTemplate || "template1",
                    theme: "light",
                    businessData: {
                        businessName,
                        category,
                        phone: bd.phone || "",
                        email: bd.email || "",
                        address: [bd.address, bd.city, bd.state, bd.zip].filter(Boolean).join(", "),
                        website: bd.website || "",
                        services: servicesString,
                        additionalServices: servicesString,
                        serviceAreas: locationString,
                        additionalLocations: locationString,
                        locations: locationsArr,
                        selectedTemplate: bd.selectedTemplate || "modern",
                        colorScheme: bd.colorScheme || "indigo",
                        aiProvider: bd.aiProvider || "gemini",
                    }
                };

                const res = await fetch("/api/websites", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (cancelled) return;

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to create website");

                setCreatedWebsiteId(data.id);
                setProgress(100);
                setIsComplete(true);
                clearBusinessData();
            } catch (error: any) {
                if (cancelled) return;
                setHasError(true);
                setErrorMessage(error.message || "An unexpected error occurred.");
                toast({ title: "Creation Failed", description: error.message, variant: "destructive" });
            }
        };

        createWebsite();
        return () => { cancelled = true; };
    }, [retryKey]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="min-h-[80vh] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    {["Business", "Services", "Locations", "Brand", "API", "Generate", "Preview"].map((step, i) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= 5 ? "bg-gradient-to-r bg-[#AADD00] text-white" : "bg-white/5 text-gray-500 border border-white/10"
                                }`}>{i + 1}</div>
                            {i < 6 && <div className="w-4 sm:w-8 h-px bg-white/10 mx-1" />}
                        </div>
                    ))}
                </div>

                <div className="text-center mb-10">
                    <div className="w-20 h-20 rounded-2xl bg-[#AADD00]/10 flex items-center justify-center mx-auto mb-6">
                        {hasError ? (
                            <AlertCircle className="h-10 w-10 text-red-400" />
                        ) : isComplete ? (
                            <CheckCircle className="h-10 w-10 text-emerald-400" />
                        ) : (
                            <Sparkles className="h-10 w-10 text-[#AADD00] animate-pulse" />
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {hasError ? "Creation Failed" : isComplete ? "Website Created!" : "Creating Your Website"}
                    </h1>
                    <p className="text-gray-400">
                        {hasError
                            ? errorMessage
                            : isComplete
                            ? "Your website has been created and is ready to edit."
                            : "Setting up your website with your business information."}
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 space-y-6">
                    {/* Progress Bar */}
                    {!hasError && (
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Progress</span>
                                <span className="text-[#AADD00] font-mono">{progress}%</span>
                            </div>
                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r bg-[#AADD00] rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Steps */}
                    {!hasError && (
                        <div className="space-y-3">
                            {steps.map((step, i) => {
                                const Icon = step.icon;
                                const isDone = i < currentStep || isComplete;
                                const isCurrent = i === currentStep && !isComplete;
                                return (
                                    <div
                                        key={step.label}
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isDone ? "bg-emerald-500/5 border border-emerald-500/20" :
                                                isCurrent ? "bg-indigo-500/5 border border-[#AADD00]/20" :
                                                    "bg-white/[0.01] border border-white/5"
                                            }`}
                                    >
                                        {isDone ? (
                                            <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                                        ) : isCurrent ? (
                                            <Loader2 className="h-5 w-5 text-[#AADD00] animate-spin flex-shrink-0" />
                                        ) : (
                                            <Icon className="h-5 w-5 text-gray-600 flex-shrink-0" />
                                        )}
                                        <span className={`text-sm ${isDone ? "text-emerald-300" : isCurrent ? "text-[#bef000]" : "text-gray-500"}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {isComplete && createdWebsiteId && (
                        <Button
                            onClick={() => setLocation(`/dashboard/websites/${createdWebsiteId}`)}
                            className="w-full bg-[#AADD00] hover:bg-[#bef000] text-black font-bold py-6 text-base font-semibold rounded-xl shadow-lg shadow-[#AADD00]/25"
                        >
                            <Sparkles className="mr-2 h-5 w-5" />
                            Open Website Editor
                        </Button>
                    )}

                    {hasError && (
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setLocation("/onboarding/business")}
                                className="flex-1 border-white/20 text-gray-300 hover:bg-white/5 bg-transparent"
                            >
                                Start Over
                            </Button>
                            <Button
                                onClick={() => {
                                    setHasError(false);
                                    setErrorMessage("");
                                    setProgress(0);
                                    setCurrentStep(0);
                                    setIsComplete(false);
                                    setRetryKey((k) => k + 1);
                                }}
                                className="flex-1 bg-[#AADD00] hover:bg-[#bef000] text-black"
                            >
                                Try Again
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
