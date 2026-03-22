import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useState } from "react";
import { Plus, ArrowRight, Sparkles, Globe, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categories = [
    "Plumber", "Electrician", "HVAC", "Roofer", "Dentist", "Chiropractor",
    "Restaurant", "Auto Repair", "Law Firm", "Real Estate", "Cleaning Service", "Landscaping",
];

export default function DashboardNewWebsite() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const handleQuickCreate = async () => {
        if (!name.trim()) {
            toast({ title: "Business Name Required", description: "Please enter a business name before creating.", variant: "destructive" });
            return;
        }
        setIsCreating(true);
        try {
            const res = await fetch("/api/websites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: name.trim(),
                    description: `${category || "Business"} website`,
                    template: "template1",
                    theme: "light",
                    businessData: {
                        businessName: name.trim(),
                        category: category || "Business",
                    }
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create website");
            toast({ title: "Website Created", description: "Redirecting to the editor..." });
            setLocation(`/dashboard/websites/${data.id}`);
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            setIsCreating(false);
        }
    };

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                        <Plus className="h-8 w-8 text-indigo-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create New Website</h1>
                    <p className="text-gray-400">Start building a new website for your client or business.</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 space-y-6">
                    <div>
                        <Label className="text-gray-300 text-sm">Business Name *</Label>
                        <Input placeholder="e.g., Smith & Sons Plumbing" value={name} onChange={(e) => setName(e.target.value)}
                            className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                    </div>
                    <div>
                        <Label className="text-gray-300 text-sm">Category *</Label>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button key={cat} onClick={() => setCategory(cat)}
                                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${category === cat
                                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/50"
                                        : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" onClick={() => setLocation("/onboarding/business")}
                            className="border-white/20 text-gray-300 hover:bg-white/5 bg-transparent py-6">
                            <Sparkles className="mr-2 h-4 w-4" /> Use AI Wizard
                        </Button>
                        <Button onClick={handleQuickCreate} disabled={isCreating}
                            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 py-6">
                            {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Globe className="mr-2 h-4 w-4" />}
                            Quick Create <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
