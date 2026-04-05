import { Link } from "wouter";
import { Search, TrendingUp, Link2, Code2, FileText, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";

export default function SeoOverview() {
    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Search className="h-8 w-8 text-emerald-400" /> SEO Overview
                </h1>
                <p className="text-gray-400 mb-8">Monitor your website's SEO health and find opportunities.</p>

                {/* Score Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Overall Score", value: "92/100", color: "emerald", icon: TrendingUp },
                        { label: "Keywords Tracked", value: "24", color: "indigo", icon: Search },
                        { label: "Internal Links", value: "47", color: "violet", icon: Link2 },
                        { label: "Schema Items", value: "12", color: "amber", icon: Code2 },
                    ].map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                                <Icon className={`h-5 w-5 text-${stat.color}-400 mb-3`} />
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Issues & Quick Links */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">SEO Health Check</h2>
                        <div className="space-y-3">
                            {[
                                { status: "pass", label: "All pages have unique meta titles" },
                                { status: "pass", label: "Schema markup detected on all pages" },
                                { status: "pass", label: "Mobile-responsive layout confirmed" },
                                { status: "warn", label: "2 pages missing meta descriptions" },
                                { status: "warn", label: "Blog posts need internal links" },
                                { status: "pass", label: "Image alt tags present on all images" },
                                { status: "pass", label: "sitemap.xml is accessible" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.01]">
                                    {item.status === "pass" ? (
                                        <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                                    ) : (
                                        <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />
                                    )}
                                    <span className="text-sm text-gray-300">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">SEO Tools</h2>
                        <div className="space-y-3">
                            {[
                                { label: "Keyword Tracker", desc: "Track keyword coverage across pages", href: "/dashboard/seo/keywords", icon: Search },
                                { label: "Internal Links Map", desc: "Visualize link structure", href: "/dashboard/seo/links", icon: Link2 },
                                { label: "Schema Manager", desc: "Manage structured data", href: "/dashboard/seo/schema", icon: Code2 },
                                { label: "Sitemap & Robots", desc: "Configure sitemap and robots.txt", href: "/dashboard/seo/sitemap", icon: FileText },
                            ].map((tool) => {
                                const Icon = tool.icon;
                                return (
                                    <Link key={tool.label} href={tool.href}>
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-white/15 hover:bg-white/[0.02] transition-all cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <Icon className="h-5 w-5 text-[#7C3AED]" />
                                                <div>
                                                    <p className="text-sm font-medium text-white">{tool.label}</p>
                                                    <p className="text-xs text-gray-500">{tool.desc}</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-gray-500" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
