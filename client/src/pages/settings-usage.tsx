import { BarChart3, Globe, FileText, Bot, HardDrive } from "lucide-react";

export default function SettingsUsage() {
    const usageData = [
        { label: "Websites Created", used: 3, limit: 10, icon: Globe, color: "indigo" },
        { label: "Blog Posts Generated", used: 42, limit: 300, icon: FileText, color: "violet" },
        { label: "AI Tokens Used", used: 124500, limit: 500000, icon: Bot, color: "emerald" },
        { label: "Storage Used", used: 12, limit: 50, icon: HardDrive, color: "amber", unit: "MB" },
    ];

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-[#AADD00]" /> Usage & Limits
                </h1>
                <p className="text-gray-400 mb-6">Track your resource usage and plan limits.</p>

                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 mb-8 text-blue-200 text-sm flex gap-3">
                    <Globe className="h-5 w-5 flex-shrink-0" />
                    <p>Usage tracking is currently disabled for Beta testers. You have unlimited access. The data below is sample data.</p>
                </div>

                <div className="space-y-4">
                    {usageData.map((item) => {
                        const Icon = item.icon;
                        const pct = Math.round((item.used / item.limit) * 100);
                        const unit = item.unit || "";
                        return (
                            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <Icon className={`h-5 w-5 text-${item.color}-400`} />
                                        <span className="font-medium text-white">{item.label}</span>
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        {item.used.toLocaleString()}{unit} / {item.limit.toLocaleString()}{unit}
                                    </span>
                                </div>
                                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full bg-gradient-to-r ${pct > 80 ? "from-red-500 to-red-600" : pct > 50 ? "from-amber-500 to-amber-600" : `from-${item.color}-500 to-${item.color}-600`
                                            }`}
                                        style={{ width: `${Math.min(pct, 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">{pct}% used</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
