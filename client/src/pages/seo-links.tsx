import { Link2, ArrowLeft, ExternalLink, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "wouter";

const linkData = [
    { from: "Home", to: "Services", type: "Internal", status: "ok" },
    { from: "Home", to: "About", type: "Internal", status: "ok" },
    { from: "Home", to: "Contact", type: "Internal", status: "ok" },
    { from: "Services", to: "Home", type: "Internal", status: "ok" },
    { from: "About", to: "Contact", type: "Internal", status: "ok" },
    { from: "Blog Post 1", to: "Services", type: "Internal", status: "ok" },
    { from: "Blog Post 2", to: "Blog Post 3", type: "Internal", status: "warn" },
    { from: "Gallery", to: "—", type: "Orphan", status: "error" },
    { from: "FAQ", to: "Home", type: "Internal", status: "ok" },
];

export default function SeoLinks() {
    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-2">
                    <Link href="/dashboard/seo" className="text-gray-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></Link>
                    <h1 className="text-3xl font-bold text-white">Internal Links Map</h1>
                </div>
                <p className="text-gray-400 mb-8 ml-8">Visualize internal link structure and identify issues.</p>

                <div className="grid lg:grid-cols-3 gap-4 mb-8">
                    {[
                        { label: "Total Links", value: "47", color: "indigo" },
                        { label: "Orphan Pages", value: "1", color: "red" },
                        { label: "Avg Links/Page", value: "5.9", color: "emerald" },
                    ].map((s) => (
                        <div key={s.label} className={`rounded-2xl border border-white/10 bg-white/[0.02] p-5`}>
                            <p className={`text-2xl font-bold text-${s.color}-400`}>{s.value}</p>
                            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">From</th>
                                <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">→</th>
                                <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">To</th>
                                <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Type</th>
                                <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {linkData.map((link, i) => (
                                <tr key={i} className="border-t border-white/5 hover:bg-white/[0.02]">
                                    <td className="p-4 text-sm text-white">{link.from}</td>
                                    <td className="p-4 text-center"><Link2 className="h-3.5 w-3.5 text-gray-500 mx-auto" /></td>
                                    <td className="p-4 text-sm text-gray-300">{link.to}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${link.type === "Orphan" ? "bg-red-500/10 text-red-400" : "bg-[#AADD00]/10 text-[#AADD00]"}`}>{link.type}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        {link.status === "ok" ? <CheckCircle className="h-4 w-4 text-emerald-400 mx-auto" /> :
                                            link.status === "warn" ? <AlertTriangle className="h-4 w-4 text-amber-400 mx-auto" /> :
                                                <AlertTriangle className="h-4 w-4 text-red-400 mx-auto" />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
