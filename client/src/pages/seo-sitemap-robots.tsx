import { ArrowLeft, FileText, CheckCircle, RefreshCw, Download } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function SeoSitemap() {
    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-2">
                    <Link href="/dashboard/seo" className="text-gray-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></Link>
                    <h1 className="text-3xl font-bold text-white">Sitemap & Robots</h1>
                </div>
                <p className="text-gray-400 mb-8 ml-8">Manage your XML sitemap and robots.txt configuration.</p>

                {/* Sitemap */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-[#AADD00]" />
                            <h2 className="text-lg font-semibold text-white">XML Sitemap</h2>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-white/20 text-gray-300 hover:bg-white/5 bg-transparent">
                                <RefreshCw className="mr-1 h-3 w-3" /> Regenerate
                            </Button>
                            <Button size="sm" variant="outline" className="border-white/20 text-gray-300 hover:bg-white/5 bg-transparent">
                                <Download className="mr-1 h-3 w-3" /> Download
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {[
                            { url: "/", priority: "1.0", freq: "daily" },
                            { url: "/services", priority: "0.9", freq: "weekly" },
                            { url: "/about", priority: "0.7", freq: "monthly" },
                            { url: "/contact", priority: "0.7", freq: "monthly" },
                            { url: "/blog", priority: "0.8", freq: "daily" },
                            { url: "/faq", priority: "0.6", freq: "monthly" },
                        ].map((page) => (
                            <div key={page.url} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] text-sm">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                                    <span className="text-gray-300 font-mono">{page.url}</span>
                                </div>
                                <div className="flex gap-4 text-gray-500">
                                    <span>Priority: {page.priority}</span>
                                    <span>Freq: {page.freq}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Robots.txt */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">robots.txt</h2>
                    <pre className="bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-gray-300 font-mono overflow-x-auto">
                        {`User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /admin/
Disallow: /api/

Sitemap: https://austin-plumbing.smbify.site/sitemap.xml`}
                    </pre>
                    <Button size="sm" className="mt-4 bg-gradient-to-r from-[#AADD00] to-[#7ec800]">Save Changes</Button>
                </div>
            </div>
        </div>
    );
}
