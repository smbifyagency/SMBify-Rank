import { ArrowLeft, Code2, CheckCircle, Plus } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const schemas = [
    { type: "LocalBusiness", page: "All Pages", status: "Active", fields: 12 },
    { type: "Service", page: "Services", status: "Active", fields: 8 },
    { type: "FAQPage", page: "FAQ", status: "Active", fields: 6 },
    { type: "BreadcrumbList", page: "All Pages", status: "Active", fields: 4 },
    { type: "Article", page: "Blog Posts", status: "Active", fields: 10 },
    { type: "Review", page: "Testimonials", status: "Draft", fields: 5 },
];

export default function SeoSchema() {
    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-2">
                    <Link href="/dashboard/seo" className="text-gray-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></Link>
                    <h1 className="text-3xl font-bold text-white">Schema Manager</h1>
                </div>
                <p className="text-gray-400 mb-8 ml-8">Manage structured data markup for rich search results.</p>

                <div className="flex justify-end mb-4">
                    <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-violet-600">
                        <Plus className="mr-1 h-3 w-3" /> Add Schema
                    </Button>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                    <table className="w-full">
                        <thead><tr className="bg-white/5">
                            <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Schema Type</th>
                            <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Applied To</th>
                            <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Fields</th>
                            <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                        </tr></thead>
                        <tbody>
                            {schemas.map((s) => (
                                <tr key={s.type} className="border-t border-white/5 hover:bg-white/[0.02] cursor-pointer">
                                    <td className="p-4 text-sm text-white font-medium flex items-center gap-2">
                                        <Code2 className="h-4 w-4 text-indigo-400" /> {s.type}
                                    </td>
                                    <td className="p-4 text-sm text-gray-400">{s.page}</td>
                                    <td className="p-4 text-sm text-center text-gray-400">{s.fields}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${s.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-gray-500/10 text-gray-400"}`}>{s.status}</span>
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
