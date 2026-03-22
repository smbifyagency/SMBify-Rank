import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Website } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import {
    LayoutDashboard, Globe, Plus, Settings,
    ArrowRight, Eye, Zap, FileText, Sparkles, Crown, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface WebsiteLimitData {
    canCreate: boolean;
    remaining: number;
    limit: number;
}

export default function DashboardHome() {
    const [, setLocation] = useLocation();
    const { user } = useAuth();
    const { toast } = useToast();

    const { data: websites = [], isLoading } = useQuery<Website[]>({
        queryKey: ["/api/websites"]
    });

    const [isCreating, setIsCreating] = useState(false);

    const handleCreateWebsite = async () => {
        setIsCreating(true);
        try {
            const res = await fetch("/api/websites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: "Untitled Project",
                    description: "Blank template website ready for configuration.",
                    template: "template1",
                    theme: "light",
                    businessData: {}
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create site");

            toast({ title: "Site Initialized", description: "Redirecting to configurator..." });
            setLocation(`/dashboard/websites/${data.id}`);
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            setIsCreating(false);
        }
    };

    const { data: limitData } = useQuery<WebsiteLimitData>({
        queryKey: ["/api/user/website-limits"],
        retry: false,
    });

    const publishedWebsites = websites.filter(site => site.netlifyUrl && site.netlifyUrl !== "pending").length;
    const draftWebsites = websites.length - publishedWebsites;

    const isPaid = (user as any)?.role === "paid" || (user as any)?.role === "admin" || (user as any)?.id === "admin";
    const websiteLimit = limitData?.limit || 3;
    const remaining = limitData?.remaining ?? websiteLimit;

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <LayoutDashboard className="h-8 w-8 text-indigo-400" />
                            Dashboard
                        </h1>
                        <p className="text-gray-400 mt-1">Welcome back! Here's an overview of your projects.</p>
                    </div>
                    <Button
                        onClick={() => {
                            if (!isPaid && limitData && !limitData.canCreate) {
                                toast({
                                    title: "Limit Reached",
                                    description: "You've reached your free website limit. Please delete a website or upgrade to Pro to create more.",
                                    variant: "destructive",
                                });
                            } else {
                                handleCreateWebsite();
                            }
                        }}
                        disabled={isCreating}
                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25"
                    >
                        {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} New Website
                    </Button>
                </div>

                {/* Plan & Limit Banner */}
                <div className={`mb-8 rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isPaid
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-indigo-500/20 bg-indigo-500/5"
                    }`}>
                    <div className="flex items-center gap-3">
                        {isPaid ? (
                            <Crown className="h-5 w-5 text-emerald-400" />
                        ) : (
                            <Sparkles className="h-5 w-5 text-indigo-400" />
                        )}
                        <div>
                            <p className={`font-semibold ${isPaid ? "text-emerald-300" : "text-indigo-300"}`}>
                                {isPaid ? "Pro Plan" : "Free Plan"}
                            </p>
                            <p className="text-sm text-gray-400">
                                {isPaid
                                    ? "Unlimited website creation"
                                    : `${remaining} of ${websiteLimit} websites remaining`
                                }
                            </p>
                        </div>
                    </div>
                    {!isPaid && (
                        <Link href="/pricing">
                            <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white">
                                <Sparkles className="mr-1 h-3 w-3" /> Upgrade to Pro — $29/mo
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Total Websites", value: isLoading ? "-" : websites.length.toString(), icon: Globe, color: "indigo" },
                        { label: "Published Sites", value: isLoading ? "-" : publishedWebsites.toString(), icon: Eye, color: "violet" },
                        { label: "Draft Sites", value: isLoading ? "-" : draftWebsites.toString(), icon: FileText, color: "amber" },
                        { label: "Sites Remaining", value: isLoading ? "-" : (isPaid ? "∞" : remaining.toString()), icon: Sparkles, color: "emerald" },
                    ].map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <Icon className={`h-5 w-5 text-${stat.color}-400`} />
                                    <span className="text-xs text-gray-500">{stat.label}</span>
                                </div>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Recent Websites */}
                    <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-semibold text-white">Recent Websites</h2>
                            <Link href="/dashboard/websites" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                View All <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {isLoading ? (
                                <div className="p-4 text-center text-gray-500 text-sm">Loading websites...</div>
                            ) : websites.length === 0 ? (
                                <div className="p-8 text-center border border-dashed border-white/10 rounded-xl">
                                    <Globe className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-400 mb-1">No websites created yet</p>
                                    <p className="text-sm text-gray-500 mb-4">Get started by creating your first website</p>
                                    <Button onClick={() => {
                                        if (!isPaid && limitData && !limitData.canCreate) {
                                            toast({
                                                title: "Limit Reached",
                                                description: "You've reached your free website limit. Please delete a website or upgrade to Pro to create more.",
                                                variant: "destructive",
                                            });
                                        } else {
                                            handleCreateWebsite();
                                        }
                                    }} size="sm" disabled={isCreating} className="bg-gradient-to-r from-indigo-600 to-violet-600">
                                        {isCreating ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Plus className="mr-1 h-3 w-3" />} Create Website
                                    </Button>
                                </div>
                            ) : websites.slice(0, 4).map((site) => {
                                const businessData = site.businessData as any;
                                const pageCount = Array.isArray(businessData?.pages) ? businessData.pages.length : 0;
                                const isPublished = site.netlifyUrl && site.netlifyUrl !== "pending";
                                const statusLabel = isPublished ? "Published" : "Draft";
                                const lastEdit = site.updatedAt ? formatDistanceToNow(new Date(site.updatedAt), { addSuffix: true }) : "recently";

                                return (
                                    <div key={site.id} onClick={() => setLocation(`/dashboard/websites/${site.id}`)}>
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-white/15 hover:bg-white/[0.02] transition-all cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center flex-shrink-0">
                                                    <Globe className="h-5 w-5 text-indigo-400" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-medium text-white truncate">{businessData?.businessName || site.title || "Untitled"}</p>
                                                    <p className="text-xs text-gray-500 truncate">{pageCount || 5} pages · Edited {lastEdit}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isPublished ? "bg-emerald-500/10 text-emerald-400" : "bg-gray-500/10 text-gray-400"
                                                    }`}>
                                                    {statusLabel}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                        <h2 className="text-lg font-semibold text-white mb-5">Quick Actions</h2>
                        <div className="space-y-2">
                            {[
                                { label: "Create New Website", icon: Plus, action: true, color: "indigo" },
                                { label: "My Websites", icon: Globe, href: "/dashboard/websites", color: "violet" },
                                { label: "API Settings", icon: Settings, href: "/dashboard/settings/api-keys", color: "amber" },
                                { label: "My Profile", icon: Zap, href: "/dashboard/settings/profile", color: "cyan" },
                            ].map((actionItem) => {
                                const Icon = actionItem.icon;
                                return (
                                    <div key={actionItem.label}>
                                        {actionItem.action ? (
                                            <button
                                                onClick={() => {
                                                    if (!isPaid && limitData && !limitData.canCreate) {
                                                        toast({
                                                            title: "Limit Reached",
                                                            description: "You've reached your free website limit. Please delete a website or upgrade to Pro to create more.",
                                                            variant: "destructive",
                                                        });
                                                    } else {
                                                        handleCreateWebsite();
                                                    }
                                                }}
                                                disabled={isCreating}
                                                className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-white/15 hover:bg-white/[0.02] transition-all text-left"
                                            >
                                                {isCreating && actionItem.label === "Create New Website" ? (
                                                    <Loader2 className={`h-4 w-4 text-${actionItem.color}-400 animate-spin`} />
                                                ) : (
                                                    <Icon className={`h-4 w-4 text-${actionItem.color}-400`} />
                                                )}
                                                <span className="text-sm text-gray-300">{actionItem.label}</span>
                                            </button>
                                        ) : (
                                            <Link href={actionItem.href || "#"}>
                                                <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-white/15 hover:bg-white/[0.02] transition-all text-left">
                                                    <Icon className={`h-4 w-4 text-${actionItem.color}-400`} />
                                                    <span className="text-sm text-gray-300">{actionItem.label}</span>
                                                </button>
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
