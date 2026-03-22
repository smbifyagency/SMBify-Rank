import { Button } from "@/components/ui/button";
import { Plug, CheckCircle, ExternalLink } from "lucide-react";

const integrations = [
    { name: "Google Analytics", desc: "Track website traffic and user behavior", connected: true, icon: "📊" },
    { name: "Google Search Console", desc: "Monitor search performance and indexing", connected: true, icon: "🔍" },
    { name: "Netlify", desc: "One-click website deployment", connected: true, icon: "🚀" },
    { name: "Slack", desc: "Get notifications in your Slack workspace", connected: false, icon: "💬" },
    { name: "Zapier", desc: "Connect to 5,000+ apps via automation", connected: false, icon: "⚡" },
    { name: "Mailchimp", desc: "Sync contacts and lead forms", connected: false, icon: "✉️" },
    { name: "HubSpot", desc: "CRM integration for lead tracking", connected: false, icon: "🎯" },
    { name: "WordPress", desc: "Import/export content to WordPress", connected: false, icon: "📝" },
];

export default function SettingsIntegrations() {
    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Plug className="h-8 w-8 text-emerald-400" /> Integrations
                </h1>
                <p className="text-gray-400 mb-6">Connect third-party services to enhance your workflow.</p>

                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 mb-8 text-blue-200 text-sm flex gap-3">
                    <Plug className="h-5 w-5 flex-shrink-0" />
                    <p>Integrations are currently in development. You can configure your Netlify API key in the Setup pages.</p>
                </div>

                <div className="space-y-3 opacity-50 pointer-events-none">
                    {integrations.map((int) => (
                        <div key={int.name} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-2xl">{int.icon}</span>
                                <div>
                                    <p className="text-white font-medium">{int.name}</p>
                                    <p className="text-xs text-gray-500">{int.desc}</p>
                                </div>
                            </div>
                            {int.connected ? (
                                <span className="flex items-center gap-1 text-sm text-emerald-400"><CheckCircle className="h-4 w-4" /> Connected</span>
                            ) : (
                                <Button size="sm" variant="outline" className="border-white/20 text-gray-300 hover:bg-white/5 bg-transparent">Connect</Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
