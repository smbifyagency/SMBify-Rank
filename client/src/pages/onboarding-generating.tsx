import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { Loader2, CheckCircle, Sparkles, FileText, Search, Code2, Image, AlertCircle, Eye, ArrowLeft, Rocket } from "lucide-react";
import { useBusinessData } from "@/contexts/business-data-context";
import { useToast } from "@/hooks/use-toast";

const steps = [
    { icon: FileText, label: "Preparing business information...", duration: 1000 },
    { icon: Sparkles, label: "Writing service descriptions...", duration: 1500 },
    { icon: Search, label: "Creating SEO meta tags...", duration: 1200 },
    { icon: Code2, label: "Building schema markup...", duration: 1000 },
    { icon: Image, label: "Finalizing website structure...", duration: 800 },
];

const GENERATE_QUERY_KEY = "mode";
const GENERATE_QUERY_VALUE = "generate";

function buildCreateWebsitePayload(businessData: any) {
    const bd = businessData as any;
    const businessName = bd.businessName || "My Business";
    const category = bd.category || "Business";

    const locationsArr = Array.isArray(bd.locations) ? bd.locations : [];
    const locationString = locationsArr
        .map((location: any) => (
            typeof location === "string"
                ? location
                : `${location.city || ""}${location.state ? `, ${location.state}` : ""}`
        ).trim())
        .filter(Boolean)
        .join("\n");

    const servicesArr = Array.isArray(bd.services) ? bd.services : [];
    const servicesString = servicesArr.join("\n");

    return {
        title: businessName,
        description: `${category} website for ${businessName}`,
        template: bd.selectedTemplate || "template1",
        theme: "light",
        businessData: {
            businessName,
            category,
            countryCode: bd.countryCode || "+1",
            phone: bd.phone || "",
            email: bd.email || "",
            address: [bd.address, bd.city, bd.state, bd.zip].filter(Boolean).join(", "),
            city: bd.city || "",
            state: bd.state || "",
            zip: bd.zip || "",
            website: bd.website || "",
            services: servicesString,
            additionalServices: servicesString,
            serviceAreas: locationString,
            additionalLocations: locationString,
            locations: locationsArr,
            selectedTemplate: bd.selectedTemplate || "modern",
            colorScheme: bd.colorScheme || "indigo",
            aiProvider: bd.aiProvider || "gemini",
        },
    };
}

export default function OnboardingGenerating() {
    const [, setLocation] = useLocation();
    const { businessData, clearBusinessData } = useBusinessData();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [mode, setMode] = useState<"choice" | "generating" | "complete" | "error">("choice");
    const [errorMessage, setErrorMessage] = useState("");
    const [createdWebsiteId, setCreatedWebsiteId] = useState<string | null>(null);
    const [generationAttempt, setGenerationAttempt] = useState(0);
    const autoStartRef = useRef(false);

    const isGenerating = mode === "generating";
    const isComplete = mode === "complete";
    const hasError = mode === "error";

    const locations = Array.isArray((businessData as any).locations) ? (businessData as any).locations : [];
    const services = Array.isArray((businessData as any).services) ? (businessData as any).services : [];

    const startGeneration = () => {
        if (isGenerating) return;
        setCurrentStep(0);
        setProgress(0);
        setErrorMessage("");
        setCreatedWebsiteId(null);
        setMode("generating");
        setGenerationAttempt((attempt) => attempt + 1);
    };

    useEffect(() => {
        if (autoStartRef.current || mode !== "choice") return;

        const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
        if (params?.get(GENERATE_QUERY_KEY) === GENERATE_QUERY_VALUE) {
            autoStartRef.current = true;
            startGeneration();
        }
    }, [mode]);

    // Animate progress bar
    useEffect(() => {
        if (!isGenerating) return;

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
    }, [isGenerating]);

    // Advance step labels
    useEffect(() => {
        if (!isGenerating) return;

        if (currentStep < steps.length - 1) {
            const timer = setTimeout(() => setCurrentStep((prev) => prev + 1), steps[currentStep].duration);
            return () => clearTimeout(timer);
        }
    }, [currentStep, isGenerating]);

    // Create the website only after the user explicitly clicks Generate Website
    useEffect(() => {
        if (!isGenerating || generationAttempt === 0) return;

        let cancelled = false;

        const createWebsite = async () => {
            try {
                const payload = buildCreateWebsitePayload(businessData);
                const res = await fetch("/api/websites", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (cancelled) return;

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to create website");

                setCreatedWebsiteId(data.id);
                setCurrentStep(steps.length - 1);
                setProgress(100);
                setMode("complete");
                clearBusinessData();
            } catch (error: any) {
                if (cancelled) return;
                setMode("error");
                setErrorMessage(error.message || "An unexpected error occurred.");
                toast({ title: "Creation Failed", description: error.message, variant: "destructive" });
            }
        };

        createWebsite();
        return () => { cancelled = true; };
    }, [businessData, clearBusinessData, generationAttempt, isGenerating, toast]);

    return (
        <div className="min-h-[80vh] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    {["Business", "Services", "Locations", "Brand", "API", "Generate", "Preview"].map((step, i) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= 5 ? "bg-gradient-to-r bg-[#7C3AED] text-white" : "bg-white/5 text-gray-500 border border-white/10"
                                }`}>{i + 1}</div>
                            {i < 6 && <div className="w-4 sm:w-8 h-px bg-white/10 mx-1" />}
                        </div>
                    ))}
                </div>

                <div className="text-center mb-10">
                    <div className="w-20 h-20 rounded-2xl bg-[#7C3AED]/10 flex items-center justify-center mx-auto mb-6">
                        {hasError ? (
                            <AlertCircle className="h-10 w-10 text-red-400" />
                        ) : isComplete ? (
                            <CheckCircle className="h-10 w-10 text-emerald-400" />
                        ) : (
                            <Sparkles className="h-10 w-10 text-[#7C3AED] animate-pulse" />
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {hasError ? "Creation Failed" : isComplete ? "Website Created!" : isGenerating ? "Creating Your Website" : "Choose Your Next Step"}
                    </h1>
                    <p className="text-gray-400">
                        {hasError
                            ? errorMessage
                            : isComplete
                            ? "Your website has been created and is ready to edit."
                            : isGenerating
                            ? "Setting up your website with your business information."
                            : "Preview the raw template first, or generate the full AI website when you're ready."}
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 space-y-6">
                    {mode === "choice" && (
                        <>
                            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Business</p>
                                        <p className="mt-2 text-sm font-semibold text-white">{(businessData as any).businessName || "Your business"}</p>
                                        <p className="mt-1 text-xs text-gray-500">{(businessData as any).category || "Category not selected yet"}</p>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Services</p>
                                        <p className="mt-2 text-2xl font-semibold text-white">{services.length}</p>
                                        <p className="mt-1 text-xs text-gray-500">Ready to turn into individual pages</p>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Locations</p>
                                        <p className="mt-2 text-2xl font-semibold text-white">{locations.filter((location: any) => (location?.city || "").trim()).length}</p>
                                        <p className="mt-1 text-xs text-gray-500">Local SEO pages queued</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <button
                                    onClick={() => setLocation("/onboarding/preview")}
                                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-left transition-all hover:-translate-y-1 hover:border-white/20"
                                >
                                    <div className="mb-4 inline-flex rounded-xl bg-white/5 p-3 text-gray-300">
                                        <Eye className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-white">Preview Template</h2>
                                    <p className="mt-2 text-sm text-gray-400">
                                        Open the base template instantly. This keeps the experience lightweight and does not generate the AI website yet.
                                    </p>
                                </button>

                                <button
                                    onClick={startGeneration}
                                    className="rounded-2xl border border-[#7C3AED]/30 bg-[#7C3AED]/10 p-5 text-left transition-all hover:-translate-y-1 hover:bg-[#7C3AED]/15"
                                >
                                    <div className="mb-4 inline-flex rounded-xl bg-[#7C3AED]/15 p-3 text-[#A855F7]">
                                        <Rocket className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-white">Generate Website</h2>
                                    <p className="mt-2 text-sm text-gray-300">
                                        Create the full AI-powered website with content, page structure, and an editor-ready build.
                                    </p>
                                </button>
                            </div>

                            <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                                <p className="text-sm text-amber-200/80">
                                    Preview shows the raw layout only. Generation starts only when you click <span className="font-semibold text-amber-100">Generate Website</span>.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => setLocation("/onboarding/api-setup")}
                                    className="border-white/15 bg-transparent text-gray-300 hover:bg-white/5"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Progress Bar */}
                    {(isGenerating || isComplete) && (
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Progress</span>
                                <span className="text-[#7C3AED] font-mono">{progress}%</span>
                            </div>
                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r bg-[#7C3AED] rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Steps */}
                    {(isGenerating || isComplete) && (
                        <div className="space-y-3">
                            {steps.map((step, i) => {
                                const Icon = step.icon;
                                const isDone = i < currentStep || isComplete;
                                const isCurrent = i === currentStep && !isComplete;
                                return (
                                    <div
                                        key={step.label}
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isDone ? "bg-emerald-500/5 border border-emerald-500/20" :
                                                isCurrent ? "bg-indigo-500/5 border border-[#7C3AED]/20" :
                                                    "bg-white/[0.01] border border-white/5"
                                            }`}
                                    >
                                        {isDone ? (
                                            <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                                        ) : isCurrent ? (
                                            <Loader2 className="h-5 w-5 text-[#7C3AED] animate-spin flex-shrink-0" />
                                        ) : (
                                            <Icon className="h-5 w-5 text-gray-600 flex-shrink-0" />
                                        )}
                                        <span className={`text-sm ${isDone ? "text-emerald-300" : isCurrent ? "text-[#9333EA]" : "text-gray-500"}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {isComplete && createdWebsiteId && (
                        <Button
                            onClick={() => setLocation(`/dashboard/wd-editor/${createdWebsiteId}`)}
                            className="w-full bg-[#7C3AED] hover:bg-[#9333EA] text-black font-bold py-6 text-base font-semibold rounded-xl shadow-lg shadow-[#7C3AED]/25"
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
                                    setErrorMessage("");
                                    startGeneration();
                                }}
                                className="flex-1 bg-[#7C3AED] hover:bg-[#9333EA] text-black"
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
