import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Rocket, Globe, CheckCircle, ExternalLink, Copy } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function PublishSettings() {
    const [matchPublish, paramsPublish] = useRoute("/dashboard/websites/:id/publish");
    const websiteId = matchPublish ? paramsPublish?.id : null;
    const backHref = websiteId ? `/dashboard/websites/${websiteId}` : "/dashboard/websites";

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-2">
                    <Link href={backHref} className="text-gray-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></Link>
                    <h1 className="text-3xl font-bold text-white">Publish Settings</h1>
                </div>
                <p className="text-gray-400 mb-8 ml-8">Deploy your website and manage hosting settings.</p>

                {/* Current Status */}
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 mb-6 flex items-center gap-4">
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                    <div>
                        <p className="text-white font-semibold">Website is Live</p>
                        <a href="#" className="text-sm text-emerald-400 flex items-center gap-1">austin-plumbing.smbify.site <ExternalLink className="h-3 w-3" /></a>
                    </div>
                </div>

                {/* Deploy Options */}
                <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Rocket className="h-5 w-5 text-indigo-400" /> Netlify Deploy</h2>
                        <p className="text-sm text-gray-400 mb-4">One-click deploy to Netlify with automatic SSL and CDN.</p>
                        <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500">
                            <Rocket className="mr-2 h-4 w-4" /> Deploy to Netlify
                        </Button>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Globe className="h-5 w-5 text-violet-400" /> Custom Domain</h2>
                        <p className="text-sm text-gray-400 mb-4">Connect a custom domain to your website.</p>
                        <div className="flex gap-2">
                            <Input placeholder="yourdomain.com" className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                            <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/5 bg-transparent">Connect</Button>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Embed Code</h2>
                        <p className="text-sm text-gray-400 mb-4">Copy the embed code to add custom tracking scripts.</p>
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-gray-300 flex items-center justify-between">
                            <span>&lt;script src="https://analytics.smbify.site/track.js"&gt;&lt;/script&gt;</span>
                            <button className="text-gray-400 hover:text-white ml-2"><Copy className="h-4 w-4" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
