import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowUpCircle, Check, Sparkles, Zap, Building2 } from "lucide-react";

export default function UpgradePage() {
    const [, setLocation] = useLocation();
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
            <div className="text-center max-w-lg">
                <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
                    <ArrowUpCircle className="h-10 w-10 text-indigo-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">Upgrade Required</h1>
                <p className="text-gray-400 mb-8">You've reached the limit of your current plan. Upgrade to unlock more features and capacity.</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                        <Zap className="h-6 w-6 text-indigo-400 mx-auto mb-3" />
                        <h3 className="font-semibold text-white mb-2">Pro — $29/mo</h3>
                        <div className="space-y-2 text-sm text-gray-400">
                            {["10 websites", "30 blog posts/site", "Custom domains"].map((f) => (
                                <div key={f} className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-400" />{f}</div>
                            ))}
                        </div>
                        <Button onClick={() => setLocation("/pricing")} className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-violet-600">
                            Upgrade to Pro
                        </Button>
                    </div>
                    <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-6">
                        <Building2 className="h-6 w-6 text-violet-400 mx-auto mb-3" />
                        <h3 className="font-semibold text-white mb-2">Agency — $79/mo</h3>
                        <div className="space-y-2 text-sm text-gray-400">
                            {["Unlimited websites", "White-label branding", "Priority support"].map((f) => (
                                <div key={f} className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-400" />{f}</div>
                            ))}
                        </div>
                        <Button onClick={() => setLocation("/pricing")} className="w-full mt-4 bg-gradient-to-r from-violet-600 to-purple-600">
                            Upgrade to Agency
                        </Button>
                    </div>
                </div>

                <button onClick={() => setLocation("/dashboard")} className="text-sm text-gray-500 hover:text-white underline">
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
}
