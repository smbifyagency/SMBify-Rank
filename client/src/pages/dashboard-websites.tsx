import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Globe, Plus, Eye, Edit, Trash2, Search, ExternalLink, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Website } from "@shared/schema";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardWebsites() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const [isCreating, setIsCreating] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { data: websites = [], isLoading, refetch } = useQuery<Website[]>({
        queryKey: ["/api/websites"]
    });

    const handleCreateWebsite = () => setLocation("/dashboard/new-website");

    const handleDelete = async (id: string, name: string, isPublished: boolean, netlifyDomain?: string) => {
        let msg: string;
        if (isPublished) {
            msg = `⚠️ DELETE PUBLISHED SITE "${name}"?\n\n` +
                `• This website slot will NOT be freed — it still counts toward your limit.\n` +
                `• You will need to create a new website if you want to replace it.\n` +
                `• The live Netlify site will NOT be removed automatically.\n`;
            if (netlifyDomain) {
                msg += `• Go to netlify.com → Sites → ${netlifyDomain} → Site Settings → Delete site to fully remove it.\n`;
            }
            msg += `\nAre you sure you want to proceed?`;
        } else {
            msg = `Delete "${name}"?\n\nThis site has not been published yet. Once deleted it cannot be recovered.`;
        }
        if (!confirm(msg)) return;
        setDeletingId(id);
        try {
            const url = `/api/websites/${id}?force=true`;
            const res = await fetch(url, { method: "DELETE", credentials: "include" });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || "Failed to delete");
            }
            toast({ title: "Deleted", description: `"${name}" has been removed.` });
            if (isPublished) {
                toast({
                    title: "Netlify Site Still Live",
                    description: netlifyDomain
                        ? `Go to netlify.com and manually delete "${netlifyDomain}" to take the site offline.`
                        : "The Netlify deployment may still be live. Remove it manually from your Netlify dashboard.",
                });
            }
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
                        className="bg-[#7C3AED] hover:bg-[#9333EA] text-black font-bold"
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
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#7C3AED]"
                    />
                </div>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col animate-pulse">
                                <div className="h-36 bg-white/5 flex-shrink-0" />
                                <div className="p-5 flex-1 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="h-4 w-32 bg-white/10 rounded" />
                                        <div className="h-5 w-16 bg-white/10 rounded-full" />
                                    </div>
                                    <div className="h-3 w-24 bg-white/10 rounded" />
                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="h-3 w-16 bg-white/10 rounded" />
                                        <div className="h-3 w-28 bg-white/10 rounded" />
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        <div className="h-7 flex-1 bg-white/10 rounded-lg" />
                                        <div className="h-7 w-10 bg-white/10 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        ))
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
                                <div className="h-36 bg-gradient-to-br from-[#7C3AED]/12 to-[#7C3AED]/5 flex items-center justify-center relative flex-shrink-0">
                                    <Globe className="h-12 w-12 text-[#7C3AED]/30" />
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
                                                className="mt-3 flex items-center gap-1 text-xs text-[#7C3AED] hover:text-[#9333EA] truncate">
                                                <ExternalLink className="h-3 w-3 flex-shrink-0" /> <span className="truncate">{domain.replace(/^https?:\/\//, '')}</span>
                                            </a>
                                        )}
                                        {isDuplicateUrl && (
                                            <p className="mt-1 text-xs text-red-400/90">⚠ Duplicate URL — both sites share the same Netlify domain. The last deploy overwrites the other. Change one site's URL in Deploy tab.</p>
                                        )}
                                        <div className="flex items-center gap-2 mt-3">
                                            <Link href={`/dashboard/wd-editor/${site.id}`} className="flex-1">
                                                <button className="w-full flex items-center justify-center gap-1 text-xs py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all">
                                                    <Edit className="h-3 w-3" /> Edit
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(String(site.id), businessData?.businessName || site.title || "Untitled", !!isPublished, domain?.replace(/^https?:\/\//, ''))}
                                                disabled={deletingId === String(site.id)}
                                                title={isPublished ? "Delete site (Netlify must be removed manually)" : "Delete site"}
                                                className={`flex items-center justify-center gap-1 text-xs py-1.5 px-3 rounded-lg transition-all disabled:opacity-50 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300`}
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
                        className="rounded-2xl border-2 border-dashed border-white/10 bg-transparent min-h-[280px] flex flex-col items-center justify-center gap-3 hover:border-[#7C3AED]/40 hover:bg-indigo-500/5 transition-all w-full relative"
                    >
                        {isCreating ? (
                            <Loader2 className="h-10 w-10 text-[#7C3AED] animate-spin" />
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
