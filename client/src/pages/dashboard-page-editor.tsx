import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useRoute } from "wouter";
import { useState } from "react";
import { ArrowLeft, Save, Sparkles, Eye, Code } from "lucide-react";

export default function DashboardPageEditor() {
    const [matchPage, paramsPage] = useRoute("/dashboard/websites/:id/pages/:pageId");
    const websiteId = matchPage ? paramsPage?.id : null;

    const [title, setTitle] = useState("Welcome to Austin Plumbing Co.");
    const [metaTitle, setMetaTitle] = useState("Austin Plumbing Co. | 24/7 Emergency Plumbing Services");
    const [metaDesc, setMetaDesc] = useState("Professional plumbing services in Austin, TX. Available 24/7 for emergencies.");
    const [content, setContent] = useState(`<h2>Austin's Most Trusted Plumbing Company</h2>\n<p>With over 15 years of experience, Austin Plumbing Co. delivers reliable, professional plumbing services to homes and businesses across the greater Austin area.</p>\n\n<h3>Our Services</h3>\n<ul>\n<li>Emergency Plumbing Repairs</li>\n<li>Drain Cleaning & Unclogging</li>\n<li>Water Heater Installation</li>\n<li>Pipe Repair & Replacement</li>\n<li>Bathroom Remodeling</li>\n</ul>\n\n<h3>Why Choose Us?</h3>\n<p>Licensed, insured, and committed to excellence. We offer same-day service, transparent pricing, and a 100% satisfaction guarantee on all work.</p>`);

    const backHref = websiteId ? `/dashboard/websites/${websiteId}` : "/dashboard/websites";

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Link href={backHref} className="text-gray-400 hover:text-white">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-white">Edit Page: Home</h1>
                        <p className="text-sm text-gray-400">Austin Plumbing Co.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/5 bg-transparent">
                            <Eye className="mr-2 h-4 w-4" /> Preview
                        </Button>
                        <Button className="bg-[#7C3AED] hover:bg-[#9333EA] text-black font-bold">
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Editor */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-white">Page Content</h2>
                                <Button size="sm" variant="outline" className="border-white/20 text-gray-300 hover:bg-white/5 bg-transparent">
                                    <Sparkles className="mr-1 h-3 w-3" /> AI Rewrite
                                </Button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-gray-300 text-sm">Page Title</Label>
                                    <Input value={title} onChange={(e) => setTitle(e.target.value)}
                                        className="mt-1.5 bg-white/5 border-white/10 text-white" />
                                </div>
                                <div>
                                    <Label className="text-gray-300 text-sm flex items-center gap-2">
                                        <Code className="h-3.5 w-3.5" /> Content (HTML)
                                    </Label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows={16}
                                        className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white text-sm font-mono resize-y focus:outline-none focus:border-[#7C3AED]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SEO Sidebar */}
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                            <h3 className="text-sm font-semibold text-white mb-4">SEO Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-gray-300 text-xs">Meta Title</Label>
                                    <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
                                        className="mt-1 bg-white/5 border-white/10 text-white text-sm" />
                                    <p className="text-xs text-gray-500 mt-1">{metaTitle.length}/60 characters</p>
                                </div>
                                <div>
                                    <Label className="text-gray-300 text-xs">Meta Description</Label>
                                    <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)}
                                        rows={3}
                                        className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm resize-y focus:outline-none focus:border-[#7C3AED]" />
                                    <p className="text-xs text-gray-500 mt-1">{metaDesc.length}/160 characters</p>
                                </div>
                            </div>
                        </div>

                        {/* Google Preview */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                            <h3 className="text-sm font-semibold text-white mb-4">Google Preview</h3>
                            <div className="rounded-lg bg-white p-4 text-left">
                                <p className="text-blue-700 text-base font-medium leading-tight truncate">{metaTitle || "Page Title"}</p>
                                <p className="text-green-700 text-xs mt-1">austin-plumbing.SiteGenie.site</p>
                                <p className="text-gray-600 text-xs mt-1 line-clamp-2">{metaDesc || "Meta description..."}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
