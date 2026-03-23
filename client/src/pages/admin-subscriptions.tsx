import { CreditCard, TrendingUp, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export default function AdminSubscriptions() {
    // Fetch metrics to get total active subs, MRR, etc.
    const { data: metrics, isLoading: metricsLoading } = useQuery<any>({
        queryKey: ["/api/admin/metrics"]
    });

    // Fetch users for the table
    const { data: users, isLoading: usersLoading } = useQuery<any[]>({
        queryKey: ["/api/users"]
    });

    const activeSubs = users?.filter((u: any) => u.role === "paid" || u.role === "admin") || [];
    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-emerald-400" /> Subscription Management
                </h1>
                <p className="text-gray-400 mb-8">Monitor and manage user subscriptions.</p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { label: "Active Subscriptions", value: metricsLoading ? "..." : (metrics?.activeSubscriptions || 0), icon: Users },
                        { label: "Monthly Revenue", value: metricsLoading ? "..." : `$${metrics?.monthlyRevenue || 0}`, icon: TrendingUp },
                        { label: "Avg Revenue/User", value: metricsLoading ? "..." : `$${metrics?.avgRevenuePerUser || 0}`, icon: CreditCard },
                    ].map((s) => {
                        const Icon = s.icon;
                        return (
                            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                                <Icon className="h-5 w-5 text-emerald-400 mb-3" />
                                <p className="text-2xl font-bold text-white">{s.value}</p>
                                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                    <table className="w-full">
                        <thead><tr className="bg-white/5">
                            <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">User</th>
                            <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Plan</th>
                            <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Amount</th>
                            <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Started</th>
                            <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                        </tr></thead>
                        <tbody>
                            {usersLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-400">Loading subscriptions...</td>
                                </tr>
                            ) : activeSubs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-400">No active subscriptions found.</td>
                                </tr>
                            ) : (
                                activeSubs.map((s: any) => (
                                    <tr key={s.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                                        <td className="p-4 text-sm text-white">{s.email}</td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-0.5 rounded-full text-xs bg-[#AADD00]/10 text-[#AADD00]">
                                                Unlimited ({s.role === 'admin' ? 'Admin' : 'Paid'})
                                            </span>
                                        </td>
                                        <td className="p-4 text-center text-sm text-gray-300">-</td>
                                        <td className="p-4 text-center text-sm text-gray-400">
                                            {s.createdAt ? format(new Date(s.createdAt), "MMM d, yyyy") : "N/A"}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${s.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                                                {s.isActive ? "Active" : "Suspended"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
