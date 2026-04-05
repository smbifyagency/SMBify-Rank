import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Mail, Trash2, Shield } from "lucide-react";

const members = [
    { name: "John Doe", email: "john@agency.com", role: "Owner", avatar: "JD", status: "Active" },
    { name: "Jane Smith", email: "jane@agency.com", role: "Editor", avatar: "JS", status: "Active" },
    { name: "mike@agency.com", email: "mike@agency.com", role: "Viewer", avatar: "M", status: "Pending" },
];

export default function SettingsTeam() {
    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Users className="h-8 w-8 text-cyan-400" /> Team Members
                </h1>
                <p className="text-gray-400 mb-6">Invite and manage team members.</p>

                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 mb-8 text-blue-200 text-sm flex gap-3">
                    <Shield className="h-5 w-5 flex-shrink-0" />
                    <p>Team management is currently in development. Right now, only account owners can access the workspaces. The data below is sample data to demonstrate the UI.</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 mb-6 opacity-50 pointer-events-none">
                    <h2 className="text-lg font-semibold text-white mb-4">Invite Team Member</h2>
                    <div className="flex gap-2">
                        <Input placeholder="email@example.com" className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                        <select className="bg-white/5 border border-white/10 rounded-lg px-3 text-sm text-gray-300">
                            <option>Editor</option><option>Viewer</option>
                        </select>
                        <Button className="bg-gradient-to-r from-[#7C3AED] to-[#F59E0B]">
                            <Mail className="mr-1 h-4 w-4" /> Invite
                        </Button>
                    </div>
                </div>

                <div className="space-y-3">
                    {members.map((m) => (
                        <div key={m.email} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br bg-[#7C3AED] flex items-center justify-center text-white text-sm font-bold">{m.avatar}</div>
                                <div>
                                    <p className="text-white font-medium">{m.name}</p>
                                    <p className="text-xs text-gray-500">{m.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs ${m.role === "Owner" ? "bg-amber-500/10 text-amber-400" : "bg-[#7C3AED]/10 text-[#7C3AED]"}`}>
                                    <Shield className="h-3 w-3 inline mr-1" />{m.role}
                                </span>
                                <span className={`text-xs ${m.status === "Active" ? "text-emerald-400" : "text-amber-400"}`}>{m.status}</span>
                                {m.role !== "Owner" && <button className="text-gray-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
