import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Eye, EyeOff, Plus, Trash2, Shield } from "lucide-react";
import { useState } from "react";

const savedKeys = [
    { provider: "Google Gemini", masked: "AIza••••••••3kf", added: "Mar 1, 2026", status: "Active" },
    { provider: "OpenAI", masked: "sk-••••••••7x2", added: "Feb 28, 2026", status: "Expired" },
];

export default function SettingsApiKeys() {
    const [showKey, setShowKey] = useState(false);
    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Key className="h-8 w-8 text-amber-400" /> API Keys
                </h1>
                <p className="text-gray-400 mb-8">Manage your AI provider API keys.</p>

                <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 mb-6 flex gap-3">
                    <Shield className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <p className="text-sm text-emerald-300/80">Keys are encrypted and stored in your session only. They auto-expire and are never stored permanently.</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 mb-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Add New Key</h2>
                    <div className="flex gap-2">
                        <Input type={showKey ? "text" : "password"} placeholder="Enter API key..." className="bg-white/5 border-white/10 text-white font-mono placeholder:text-gray-500" />
                        <button onClick={() => setShowKey(!showKey)} className="text-gray-400 hover:text-white px-2">
                            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <Button className="bg-gradient-to-r from-[#7C3AED] to-[#F59E0B]"><Plus className="mr-1 h-4 w-4" /> Add</Button>
                    </div>
                </div>

                <div className="space-y-3">
                    {savedKeys.map((key) => (
                        <div key={key.provider} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">{key.provider}</p>
                                <p className="text-sm text-gray-500 font-mono">{key.masked}</p>
                                <p className="text-xs text-gray-600 mt-1">Added {key.added}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs ${key.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-gray-500/10 text-gray-400"}`}>{key.status}</span>
                                <button className="text-gray-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
