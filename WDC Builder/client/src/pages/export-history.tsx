import { Download, FileText, Calendar, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";

const exports = [
    { name: "Austin Plumbing Co.", format: "ZIP", size: "4.2 MB", date: "Mar 4, 2026", pages: 8 },
    { name: "Morrison Law Firm", format: "ZIP", size: "3.8 MB", date: "Mar 2, 2026", pages: 7 },
    { name: "Austin Plumbing Co.", format: "ZIP", size: "3.9 MB", date: "Feb 28, 2026", pages: 7 },
    { name: "Bright Smile Dental", format: "ZIP", size: "3.1 MB", date: "Feb 25, 2026", pages: 6 },
];

export default function ExportHistory() {
    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Download className="h-8 w-8 text-amber-400" /> Export History
                </h1>
                <p className="text-gray-400 mb-8">View and re-download your past website exports.</p>

                <div className="space-y-3">
                    {exports.map((exp, i) => (
                        <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <FileText className="h-5 w-5 text-indigo-400" />
                                <div>
                                    <p className="text-white font-medium">{exp.name}</p>
                                    <div className="flex gap-3 text-xs text-gray-500 mt-1">
                                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{exp.date}</span>
                                        <span className="flex items-center gap-1"><HardDrive className="h-3 w-3" />{exp.size}</span>
                                        <span>{exp.pages} pages</span>
                                    </div>
                                </div>
                            </div>
                            <Button size="sm" variant="outline" className="border-white/20 text-gray-300 hover:bg-white/5 bg-transparent">
                                <Download className="mr-1 h-3 w-3" /> Download
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
