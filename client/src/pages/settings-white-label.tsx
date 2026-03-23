import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paintbrush, Save, Upload, Globe, Palette } from "lucide-react";

export default function SettingsWhiteLabel() {
    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Paintbrush className="h-8 w-8 text-rose-400" /> White Label Settings
                </h1>
                <p className="text-gray-400 mb-6">Customize branding for your client portal.</p>

                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 mb-8 text-blue-200 text-sm flex gap-3">
                    <Paintbrush className="h-5 w-5 flex-shrink-0" />
                    <p>White labeling is a premium feature currently in development. UI below is for preview purposes.</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 space-y-6 opacity-50 pointer-events-none">
                    <div>
                        <Label className="text-gray-300 text-sm">Brand Name</Label>
                        <Input defaultValue="My Agency" className="mt-1.5 bg-white/5 border-white/10 text-white" />
                    </div>

                    <div>
                        <Label className="text-gray-300 text-sm">Logo</Label>
                        <div className="mt-2 flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center">
                                <Upload className="h-6 w-6 text-gray-500" />
                            </div>
                            <Button size="sm" variant="outline" className="border-white/20 text-gray-300 hover:bg-white/5 bg-transparent">Upload Logo</Button>
                        </div>
                    </div>

                    <div>
                        <Label className="text-gray-300 text-sm flex items-center gap-2"><Palette className="h-4 w-4" /> Brand Color</Label>
                        <div className="mt-2 flex gap-3">
                            {["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#10b981", "#06b6d4"].map((color) => (
                                <button key={color} className="w-8 h-8 rounded-full border-2 border-transparent hover:border-white/50 transition-all"
                                    style={{ backgroundColor: color }} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <Label className="text-gray-300 text-sm flex items-center gap-2"><Globe className="h-4 w-4" /> Custom Portal Domain</Label>
                        <Input placeholder="portal.youragency.com" className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                    </div>

                    <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-4">
                        <p className="text-sm text-rose-300/80">
                            <strong>Agency plan required.</strong> White-label features are available on the Agency plan ($79/mo).
                        </p>
                    </div>

                    <Button className="bg-gradient-to-r from-[#AADD00] to-[#7ec800]"><Save className="mr-2 h-4 w-4" /> Save White Label Settings</Button>
                </div>
            </div>
        </div>
    );
}
