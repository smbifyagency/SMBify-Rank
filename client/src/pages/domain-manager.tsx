import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Plus, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

interface Website {
    id: string;
    businessName?: string;
    deployedUrl?: string;
    netlifyDomain?: string;
    selectedTemplate?: string;
    createdAt?: string;
}

export default function DomainManager() {
    const { user } = useAuth();

    const { data: websites = [], isLoading } = useQuery<Website[]>({
        queryKey: ["/api/websites"],
        queryFn: async () => {
            const res = await fetch("/api/websites", { credentials: "include" });
            if (!res.ok) return [];
            return res.json();
        },
        enabled: !!user,
    });

    const deployedSites = websites.filter((w: Website) => w.deployedUrl || w.netlifyDomain);

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Globe className="h-8 w-8 text-[#7C3AED]" /> Domain Manager
                </h1>
                <p className="text-gray-400 mb-6">View and manage domains for your deployed websites.</p>

                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 mb-8 text-blue-200 text-sm flex gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p>Custom domain mapping is coming soon. Currently, your deployed websites use Netlify subdomains. You can change the URL from each website's publish settings.</p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="h-8 w-8 animate-spin text-[#7C3AED]" />
                    </div>
                ) : deployedSites.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
                        <Globe className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No deployed websites yet</h3>
                        <p className="text-gray-400 text-sm mb-4">Deploy a website from your dashboard to see its domain here.</p>
                        <Button
                            onClick={() => window.location.href = "/dashboard/websites"}
                            className="bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] border-0"
                        >
                            Go to Websites
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {deployedSites.map((site: Website) => {
                            const domain = site.deployedUrl || site.netlifyDomain || "";
                            const cleanDomain = domain.replace(/^https?:\/\//, "");
                            return (
                                <div key={site.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Globe className="h-5 w-5 text-[#7C3AED]" />
                                        <div>
                                            <p className="text-white font-medium">{site.businessName || "Untitled Website"}</p>
                                            <p className="text-xs text-gray-500 font-mono">{cleanDomain}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400">
                                            Active
                                        </span>
                                        <span className="text-xs text-emerald-400">SSL ✓</span>
                                        <a
                                            href={domain.startsWith("http") ? domain : `https://${domain}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
