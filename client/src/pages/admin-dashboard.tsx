import { Link } from "wouter";
import { LayoutDashboard, Users, CreditCard, FileText, Activity, Settings, ArrowRight, TrendingUp, Globe, Bot } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface AdminMetrics {
    totalUsers: number;
    activeSubscriptions: number;
    sitesGenerated: number;
    aiRequestsToday: number;
    monthlyRevenue: number;
    annualRunRate: number;
    avgRevenuePerUser: number;
    churnRate: string;
}

export default function AdminDashboard() {
    const { data: metrics, isLoading } = useQuery<AdminMetrics>({
        queryKey: ["/api/admin/metrics"]
    });

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <LayoutDashboard className="h-8 w-8 text-rose-400" /> Admin Dashboard
                </h1>
                <p className="text-gray-400 mb-8">Platform-wide metrics and management.</p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Total Users", value: isLoading ? "..." : metrics?.totalUsers || 0, icon: Users, color: "indigo" },
                        { label: "Active Subs", value: isLoading ? "..." : metrics?.activeSubscriptions || 0, icon: CreditCard, color: "emerald" },
                        { label: "Sites Generated", value: isLoading ? "..." : metrics?.sitesGenerated || 0, icon: Globe, color: "violet" },
                        { label: "AI Requests Today", value: isLoading ? "..." : (metrics?.aiRequestsToday || 0), icon: Bot, color: "amber" },
                    ].map((s) => {
                        const Icon = s.icon;
                        return (
                            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                                <Icon className={`h-5 w-5 text-${s.color}-400 mb-3`} />
                                <p className="text-2xl font-bold text-white">{s.value}</p>
                                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Quick Access</h2>
                        <div className="space-y-2">
                            {[
                                { label: "User Management", href: "/admin/users", icon: Users },
                                { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
                                { label: "Prompt Manager", href: "/admin/prompts", icon: FileText },
                                { label: "Generation Logs", href: "/admin/logs", icon: Activity },
                                { label: "System Settings", href: "/admin/settings", icon: Settings },
                            ].map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link key={item.label} href={item.href}>
                                        <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 hover:border-white/15 hover:bg-white/[0.02] transition-all cursor-pointer">
                                            <span className="flex items-center gap-3 text-sm text-gray-300"><Icon className="h-4 w-4 text-[#AADD00]" />{item.label}</span>
                                            <ArrowRight className="h-3.5 w-3.5 text-gray-500" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Revenue Overview</h2>
                        <div className="space-y-4">
                            {[
                                { label: "Monthly Revenue", value: isLoading ? "..." : `$${metrics?.monthlyRevenue || 0}`, change: "+0%" },
                                { label: "Annual Run Rate", value: isLoading ? "..." : `$${metrics?.annualRunRate || 0}`, change: "+0%" },
                                { label: "Avg Revenue/User", value: isLoading ? "..." : `$${metrics?.avgRevenuePerUser || 0}`, change: "+0%" },
                                { label: "Churn Rate", value: isLoading ? "..." : metrics?.churnRate || "0%", change: "0%" },
                            ].map((m) => (
                                <div key={m.label} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                                    <span className="text-sm text-gray-300">{m.label}</span>
                                    <div className="text-right">
                                        <span className="text-white font-semibold text-sm">{m.value}</span>
                                        <span className={`text-xs ml-2 ${m.change.startsWith("+") || m.change.startsWith("-0") || m.change === "0%" ? "text-emerald-400" : "text-red-400"}`}>{m.change}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
