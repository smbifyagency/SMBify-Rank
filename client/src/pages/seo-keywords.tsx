import { Search, TrendingUp, TrendingDown, Minus, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const keywords = [
    { keyword: "plumber austin tx", position: 3, change: 2, volume: 1200, pages: 2, difficulty: "Medium" },
    { keyword: "emergency plumbing austin", position: 5, change: -1, volume: 880, pages: 1, difficulty: "High" },
    { keyword: "drain cleaning austin", position: 8, change: 3, volume: 590, pages: 1, difficulty: "Medium" },
    { keyword: "water heater repair austin", position: 12, change: 0, volume: 450, pages: 1, difficulty: "Low" },
    { keyword: "24 hour plumber near me", position: 15, change: 5, volume: 3200, pages: 1, difficulty: "High" },
    { keyword: "pipe repair service", position: 7, change: 1, volume: 320, pages: 2, difficulty: "Low" },
    { keyword: "bathroom remodel austin", position: 18, change: -2, volume: 720, pages: 1, difficulty: "High" },
];

export default function SeoKeywords() {
    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-2">
                    <Link href="/dashboard/seo" className="text-gray-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></Link>
                    <h1 className="text-3xl font-bold text-white">Keyword Tracker</h1>
                </div>
                <p className="text-gray-400 mb-8 ml-8">Track keyword coverage and ranking positions across your pages.</p>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white/5">
                                    <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase">Keyword</th>
                                    <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Position</th>
                                    <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Change</th>
                                    <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Volume</th>
                                    <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Pages</th>
                                    <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase">Difficulty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {keywords.map((kw) => (
                                    <tr key={kw.keyword} className="border-t border-white/5 hover:bg-white/[0.02]">
                                        <td className="p-4 text-sm text-white font-medium flex items-center gap-2">
                                            <Search className="h-3.5 w-3.5 text-gray-500" /> {kw.keyword}
                                        </td>
                                        <td className="p-4 text-sm text-center text-white font-bold">#{kw.position}</td>
                                        <td className="p-4 text-sm text-center">
                                            <span className={`inline-flex items-center gap-1 ${kw.change > 0 ? "text-emerald-400" : kw.change < 0 ? "text-red-400" : "text-gray-500"}`}>
                                                {kw.change > 0 ? <TrendingUp className="h-3 w-3" /> : kw.change < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                                                {kw.change > 0 ? `+${kw.change}` : kw.change}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-center text-gray-400">{kw.volume.toLocaleString()}</td>
                                        <td className="p-4 text-sm text-center text-gray-400">{kw.pages}</td>
                                        <td className="p-4 text-sm text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${kw.difficulty === "Low" ? "bg-emerald-500/10 text-emerald-400" :
                                                    kw.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400" :
                                                        "bg-red-500/10 text-red-400"
                                                }`}>{kw.difficulty}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
