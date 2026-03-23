import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Globe, Plus, Eye, Edit, Trash2, Search, ExternalLink, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Website } from "@shared/schema";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DashboardWebsites() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [isCreating, setIsCreating] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { data: websites = [], isLoading, refetch } = useQuery<Website[]>({
        queryKey: ["/api/websites"]
    });

    const handleCreateWebsite = () => setLocation("/dashboard/new-website");

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/websites/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            toast({ title: "Deleted", description: `"${name}" has been removed.` });
            refetch();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">All Websites</h1>
                        <p className="text-gray-400 mt-1">{websites.length} websites created</p>
                    </div>
                    <Button
                        onClick={handleCreateWebsite}
                        disabled={isCreating}
                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
                    >
                        {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                        New Website
                    </Button>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        type="text" placeholder="Search websites..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                </div>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoading ? (
                        <div className="text-gray-400 py-10 col-span-2 lg:col-span-3 text-center w-full">Loading websites...</div>
                    ) : websites.length === 0 ? (
                        <div className="text-gray-400 py-10 col-span-2 lg:col-span-3 text-center w-full">You haven't created any websites yet. Click "New Website" to get started!</div>
                    ) : (() => {
                        // Find URLs that appear more than once (duplicate deployments)
                        const urlCounts = new Map<string, number>();
                        websites.forEach((w: any) => { if (w.netlifyUrl && w.netlifyUrl !== "pending") urlCounts.set(w.netlifyUrl, (urlCounts.get(w.netlifyUrl) || 0) + 1); });
                        return websites.map((site: any) => {
                        const businessData = site.businessData as any;
                        const pageCount = Array.isArray(businessData?.pages) ? businessData.pages.length : 0;
                        const createdDate = site.createdAt ? format(new Date(site.createdAt), "MMM d, yyyy · h:mm a") : "Recently";
                        const isPublished = site.netlifyUrl && site.netlifyUrl !== "pending";
                        const siteUrl = site.netlifyUrl && site.netlifyUrl !== "pending" ? site.netlifyUrl : "—";
                        const isDuplicateUrl = siteUrl !== "—" && (urlCounts.get(site.netlifyUrl) || 0) > 1;

                        const domain = siteUrl;

                        return (
                            <div key={site.id} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:-translate-y-1 transition-all group flex flex-col">
                                {/* Preview */}
                                <div className="h-36 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center relative flex-shrink-0">
                                    <Globe className="h-12 w-12 text-indigo-400/30" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <Link href={`/dashboard/websites/${site.id}`}>
                                            <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
                                                <Edit className="mr-1 h-3 w-3" /> Edit
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                {/* Info */}
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-white truncate max-w-[150px]">{businessData?.businessName || site.title || "Untitled"}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${isPublished ? "bg-emerald-500/10 text-emerald-400" : "bg-gray-500/10 text-gray-400"
                                                }`}>{isPublished ? "Published" : "Draft"}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-3">{businessData?.businessType || "Business"} · {pageCount || 5} pages</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                                            <span className="flex items-center gap-1"><Eye className="h-3 w-3" />— views</span>
                                            <span>{createdDate}</span>
                                        </div>
                                        {domain !== "—" && (
                                            <a href={domain.startsWith('http') ? domain : `https://${domain}`} target="_blank" rel="noreferrer"
                                                className="mt-3 flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 truncate">
                                                <ExternalLink className="h-3 w-3 flex-shrink-0" /> <span className="truncate">{domain.replace(/^https?:\/\//, '')}</span>
                                            </a>
                                        )}
                                        {isDuplicateUrl && (
                                            <p className="mt-1 text-xs text-yellow-500/80">⚠ Same URL used by another site — only the last deploy wins.</p>
                                        )}
                                        <div className="flex items-center gap-2 mt-3">
                                            <Link href={`/dashboard/wd-editor/${site.id}`} className="flex-1">
                                                <button className="w-full flex items-center justify-center gap-1 text-xs py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all">
                                                    <Edit className="h-3 w-3" /> Edit
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(String(site.id), businessData?.businessName || site.title || "Untitled")}
                                                disabled={deletingId === String(site.id)}
                                                className="flex items-center justify-center gap-1 text-xs py-1.5 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all disabled:opacity-50"
                                            >
                                                {deletingId === String(site.id) ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    });})()}

                    {/* Add New Card */}
                    <button
                        onClick={handleCreateWebsite}
                        disabled={isCreating}
                        className="rounded-2xl border-2 border-dashed border-white/10 bg-transparent min-h-[280px] flex flex-col items-center justify-center gap-3 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all w-full relative"
                    >
                        {isCreating ? (
                            <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
                        ) : (
                            <Plus className="h-10 w-10 text-gray-500" />
                        )}
                        <span className="text-gray-400 font-medium">Create New Website</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
