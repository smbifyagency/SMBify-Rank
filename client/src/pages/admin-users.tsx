import { Button } from "@/components/ui/button";
import { Users, Search, MoreVertical, Shield } from "lucide-react";

const users = [
    { name: "John Doe", email: "john@agency.com", plan: "Pro", sites: 8, joined: "Jan 15, 2026", status: "Active" },
    { name: "Jane Smith", email: "jane@seo.co", plan: "Agency", sites: 24, joined: "Feb 1, 2026", status: "Active" },
    { name: "Bob Wilson", email: "bob@mail.com", plan: "Free", sites: 1, joined: "Feb 20, 2026", status: "Active" },
    { name: "Alice Chen", email: "alice@studio.io", plan: "Pro", sites: 5, joined: "Mar 1, 2026", status: "Active" },
    { name: "Tom Brown", email: "tom@web.dev", plan: "Free", sites: 1, joined: "Mar 3, 2026", status: "Suspended" },
];

export default function AdminUsers() {
    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Users className="h-8 w-8 text-indigo-400" /> User Management
                </h1>
                <p className="text-gray-400 mb-8">Manage platform users and their accounts.</p>

                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input type="text" placeholder="Search users..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500" />
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                    <table className="w-full">
                        <thead><tr className="bg-white/5">
                            <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">User</th>
                            <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Plan</th>
                            <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Sites</th>
                            <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Joined</th>
                            <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                            <th className="p-4"></th>
                        </tr></thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.email} className="border-t border-white/5 hover:bg-white/[0.02]">
                                    <td className="p-4"><p className="text-sm text-white font-medium">{u.name}</p><p className="text-xs text-gray-500">{u.email}</p></td>
                                    <td className="p-4 text-center"><span className={`px-2 py-0.5 rounded-full text-xs ${u.plan === "Agency" ? "bg-violet-500/10 text-violet-400" : u.plan === "Pro" ? "bg-indigo-500/10 text-indigo-400" : "bg-gray-500/10 text-gray-400"}`}>{u.plan}</span></td>
                                    <td className="p-4 text-center text-sm text-gray-400">{u.sites}</td>
                                    <td className="p-4 text-center text-sm text-gray-400">{u.joined}</td>
                                    <td className="p-4 text-center"><span className={`px-2 py-0.5 rounded-full text-xs ${u.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>{u.status}</span></td>
                                    <td className="p-4 text-center"><button className="text-gray-500 hover:text-white"><MoreVertical className="h-4 w-4" /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
