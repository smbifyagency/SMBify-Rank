import { Button } from "@/components/ui/button";
import { Bell, Mail, Globe, Zap, Save } from "lucide-react";
import { useState } from "react";

const notifications = [
    { id: "deploy", label: "Deployment notifications", desc: "Get notified when a site is deployed or fails", enabled: true },
    { id: "seo", label: "SEO alerts", desc: "Weekly SEO health report", enabled: true },
    { id: "billing", label: "Billing reminders", desc: "Payment due, failed, or plan changes", enabled: true },
    { id: "blog", label: "Blog generation complete", desc: "When AI finishes generating blog posts", enabled: false },
    { id: "team", label: "Team activity", desc: "When team members make changes", enabled: false },
    { id: "marketing", label: "Product updates", desc: "New features and announcements", enabled: true },
];

export default function SettingsNotifications() {
    const [prefs, setPrefs] = useState(notifications);

    const toggle = (id: string) => {
        setPrefs(prefs.map((p) => p.id === id ? { ...p, enabled: !p.enabled } : p));
    };

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Bell className="h-8 w-8 text-amber-400" /> Notifications
                </h1>
                <p className="text-gray-400 mb-6">Choose what notifications you want to receive.</p>

                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 mb-8 text-blue-200 text-sm flex gap-3">
                    <Bell className="h-5 w-5 flex-shrink-0" />
                    <p>Notification preferences will be enabled in a future update. All notifications are currently routed to your account email.</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4 opacity-50 pointer-events-none">
                    {prefs.map((pref) => (
                        <div key={pref.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <div>
                                <p className="text-white font-medium text-sm">{pref.label}</p>
                                <p className="text-xs text-gray-500">{pref.desc}</p>
                            </div>
                            <button
                                onClick={() => toggle(pref.id)}
                                className={`w-11 h-6 rounded-full transition-all relative ${pref.enabled ? "bg-indigo-500" : "bg-white/10"}`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${pref.enabled ? "left-[22px]" : "left-0.5"}`} />
                            </button>
                        </div>
                    ))}
                    <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 mt-4"><Save className="mr-2 h-4 w-4" /> Save Preferences</Button>
                </div>
            </div>
        </div>
    );
}
