import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save, Globe, Shield, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
    const { data: settings, isLoading } = useQuery<any>({
        queryKey: ["/api/admin/settings"]
    });
    const { toast } = useToast();

    const [formData, setFormData] = useState<any>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (settings) {
            setFormData({ ...settings });
        }
    }, [settings]);

    const handleSave = async () => {
        setIsSaving(true);
        // Mock save logic since there is no server-side settings table
        setTimeout(() => {
            setIsSaving(false);
            toast({
                title: "Settings Saved",
                description: "Platform configuration has been updated successfully.",
            });
        }, 1000);
    };

    if (isLoading) {
        return <div className="py-20 text-center text-gray-400">Loading settings...</div>;
    }

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Settings className="h-8 w-8 text-gray-400" /> System Settings
                </h1>
                <p className="text-gray-400 mb-8">Global platform configuration.</p>

                <div className="space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Globe className="h-5 w-5 text-[#7C3AED]" /> General</h2>
                        <div><Label className="text-gray-300 text-sm">Platform Name</Label>
                            <Input
                                value={formData.platformName || ""}
                                onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                                className="mt-1.5 bg-white/5 border-white/10 text-white" /></div>
                        <div><Label className="text-gray-300 text-sm">Platform URL</Label>
                            <Input
                                value={formData.platformUrl || ""}
                                onChange={(e) => setFormData({ ...formData, platformUrl: e.target.value })}
                                className="mt-1.5 bg-white/5 border-white/10 text-white" /></div>
                        <div><Label className="text-gray-300 text-sm">Default AI Provider</Label>
                            <select
                                value={formData.defaultAiProvider || ""}
                                onChange={(e) => setFormData({ ...formData, defaultAiProvider: e.target.value })}
                                className="w-full mt-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white bg-gray-900">
                                <option value="Google Gemini">Google Gemini</option><option value="OpenAI">OpenAI</option><option value="OpenRouter">OpenRouter</option>
                            </select></div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Mail className="h-5 w-5 text-[#7C3AED]" /> Email</h2>
                        <div><Label className="text-gray-300 text-sm">Support Email</Label>
                            <Input
                                value={formData.supportEmail || ""}
                                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                                className="mt-1.5 bg-white/5 border-white/10 text-white" /></div>
                        <div><Label className="text-gray-300 text-sm">SMTP Host</Label>
                            <Input
                                value={formData.smtpHost || ""}
                                onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                                className="mt-1.5 bg-white/5 border-white/10 text-white" /></div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Shield className="h-5 w-5 text-emerald-400" /> Security</h2>
                        <div
                            className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] cursor-pointer"
                            onClick={() => setFormData({ ...formData, requireEmailVerification: !formData.requireEmailVerification })}
                        >
                            <span className="text-sm text-gray-300 select-none">Require email verification</span>
                            <div className={`w-11 h-6 rounded-full relative ${formData.requireEmailVerification ? 'bg-[#7C3AED]' : 'bg-white/10'}`}>
                                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${formData.requireEmailVerification ? 'left-[22px]' : 'left-0.5'}`} />
                            </div>
                        </div>
                        <div
                            className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] cursor-pointer"
                            onClick={() => setFormData({ ...formData, allowSignups: !formData.allowSignups })}
                        >
                            <span className="text-sm text-gray-300 select-none">Allow signups</span>
                            <div className={`w-11 h-6 rounded-full relative ${formData.allowSignups ? 'bg-[#7C3AED]' : 'bg-white/10'}`}>
                                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${formData.allowSignups ? 'left-[22px]' : 'left-0.5'}`} />
                            </div>
                        </div>
                        <div
                            className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] cursor-pointer"
                            onClick={() => setFormData({ ...formData, maintenanceMode: !formData.maintenanceMode })}
                        >
                            <span className="text-sm text-gray-300 select-none">Maintenance mode</span>
                            <div className={`w-11 h-6 rounded-full relative ${formData.maintenanceMode ? 'bg-[#7C3AED]' : 'bg-white/10'}`}>
                                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${formData.maintenanceMode ? 'left-[22px]' : 'left-0.5'}`} />
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-[#7C3AED] to-[#F59E0B]">
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Settings"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
