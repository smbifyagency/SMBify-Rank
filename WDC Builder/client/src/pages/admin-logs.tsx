import { Activity, CheckCircle, XCircle, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

export default function AdminLogs() {
    const { data: logs, isLoading } = useQuery<any[]>({
        queryKey: ["/api/admin/logs"]
    });
    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Activity className="h-8 w-8 text-cyan-400" /> Generation Logs
                </h1>
                <p className="text-gray-400 mb-8">AI generation request logs and performance tracking.</p>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                    <table className="w-full">
                        <thead><tr className="bg-white/5">
                            <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">ID</th>
                            <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">User</th>
                            <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Type</th>
                            <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Model</th>
                            <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Tokens</th>
                            <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Duration</th>
                            <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                            <th className="text-right p-4 text-xs font-semibold text-gray-400 uppercase">Time</th>
                        </tr></thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-400">Loading logs...</td>
                                </tr>
                            ) : !logs || logs.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-400">No generation logs found.</td>
                                </tr>
                            ) : (
                                logs.map((l: any) => (
                                    <tr key={l.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                                        <td className="p-4 text-sm text-gray-400 font-mono">{l.id}</td>
                                        <td className="p-4 text-sm text-white">{l.user}</td>
                                        <td className="p-4 text-center text-sm text-gray-300">{l.type}</td>
                                        <td className="p-4 text-center text-sm text-gray-400">{l.model}</td>
                                        <td className="p-4 text-center text-sm text-gray-400">{l.tokens.toLocaleString()}</td>
                                        <td className="p-4 text-center text-sm text-gray-400">{l.duration}</td>
                                        <td className="p-4 text-center">
                                            {l.status === "Success" ? <CheckCircle className="h-4 w-4 text-emerald-400 mx-auto" /> : <XCircle className="h-4 w-4 text-red-400 mx-auto" />}
                                        </td>
                                        <td className="p-4 text-right text-xs text-gray-500 flex items-center justify-end gap-1"><Clock className="h-3 w-3" />
                                            {l.time ? formatDistanceToNow(new Date(l.time), { addSuffix: true }) : "Unknown"}
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
