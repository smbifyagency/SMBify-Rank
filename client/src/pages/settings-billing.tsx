import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CreditCard, Check, Zap, Globe, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsBilling() {
    const { user } = useAuth();

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-rose-400" /> Billing & Subscription
                </h1>
                <p className="text-gray-400 mb-8">Your plan and subscription details.</p>

                <div className="rounded-2xl border border-[#AADD00]/25 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 p-8 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#bef000] text-sm font-medium">Your Plan</p>
                            <h2 className="text-3xl font-bold text-white flex items-center gap-3 mt-2">
                                <Sparkles className="h-7 w-7 text-amber-400" /> SMBify Pro
                            </h2>
                            <p className="text-gray-300 text-sm mt-2">All features included. One plan for everyone.</p>
                        </div>
                        <div className="text-right">
                            <span className="px-3 py-1 rounded-full text-sm bg-emerald-500/20 text-emerald-400 font-medium">Active</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">What's Included</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            "Unlimited Websites",
                            "AI Content Generation",
                            "Blog Post Generation",
                            "Netlify Auto-Deploy",
                            "Custom Domains",
                            "SEO Tools & Schema",
                            "Download as ZIP",
                            "Priority Support",
                        ].map((f) => (
                            <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                                <Check className="h-3.5 w-3.5 text-emerald-400" /> {f}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
