import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
    Eye, Rocket, Download, Edit, CheckCircle, Globe,
    Phone, MapPin, Star, ArrowRight, Sparkles
} from "lucide-react";

export default function OnboardingPreview() {
    const [, setLocation] = useLocation();

    return (
        <div className="min-h-[80vh] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    {["Business", "Services", "Locations", "Brand", "API", "Generate", "Preview"].map((step, i) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-r bg-[#AADD00] text-white`}>{i + 1}</div>
                            {i < 6 && <div className="w-4 sm:w-8 h-px bg-[#AADD00]/20 mx-1" />}
                        </div>
                    ))}
                </div>

                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-4">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm text-emerald-300">Website Generated Successfully!</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Your Website Preview</h1>
                    <p className="text-gray-400">Review your AI-generated website and take it live.</p>
                </div>

                {/* Action Cards */}
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    <button onClick={() => setLocation("/dashboard/websites")} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center hover:-translate-y-1 transition-all group">
                        <Edit className="h-8 w-8 text-[#AADD00] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="font-semibold text-white mb-1">Edit Content</h3>
                        <p className="text-sm text-gray-400">Customize text, images, and layout</p>
                    </button>
                    <button onClick={() => setLocation("/dashboard/websites")} className="rounded-2xl border border-[#AADD00]/25 bg-indigo-500/5 p-6 text-center hover:-translate-y-1 transition-all group">
                        <Rocket className="h-8 w-8 text-[#AADD00] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="font-semibold text-white mb-1">Deploy Now</h3>
                        <p className="text-sm text-gray-400">Go live on Netlify in seconds</p>
                    </button>
                    <button className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center hover:-translate-y-1 transition-all group">
                        <Download className="h-8 w-8 text-[#AADD00] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="font-semibold text-white mb-1">Download ZIP</h3>
                        <p className="text-sm text-gray-400">Get the full source code</p>
                    </button>
                </div>

                {/* Preview */}
                <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/30">
                    <div className="bg-gray-800 px-4 py-3 flex items-center gap-3">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="flex-1 bg-gray-700 rounded-lg px-4 py-1.5 text-xs text-gray-400 font-mono flex items-center gap-2">
                            <Globe className="h-3 w-3" /> your-business.smbify.site
                        </div>
                        <button className="text-gray-400 hover:text-white">
                            <Eye className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="bg-white text-gray-900">
                        {/* Mock Nav */}
                        <div className="bg-gradient-to-r from-[#AADD00] to-[#7ec800] text-white px-6 py-4 flex items-center justify-between">
                            <span className="font-bold text-lg">Your Business Name</span>
                            <div className="hidden sm:flex gap-6 text-sm opacity-80">
                                <span>Home</span><span>Services</span><span>About</span><span>Blog</span><span>Contact</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4" /> (555) 123-4567
                            </div>
                        </div>

                        {/* Hero */}
                        <div className="bg-gradient-to-br from-[#AADD00] to-[#7ec800] text-white text-center px-8 py-16">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                Professional Services You Can Trust
                            </h2>
                            <div className="flex items-center justify-center gap-2 mb-6 text-sm opacity-80">
                                <MapPin className="h-4 w-4" /> Serving Your City & Surrounding Areas
                            </div>
                            <div className="flex gap-3 justify-center mb-6">
                                <button className="bg-white text-gray-900 px-6 py-2.5 rounded-lg font-semibold text-sm">Get Free Quote</button>
                                <button className="border border-white/30 px-6 py-2.5 rounded-lg text-sm">Learn More</button>
                            </div>
                            <div className="flex items-center justify-center gap-1">
                                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                                <span className="text-sm ml-2 opacity-80">5.0 rating</span>
                            </div>
                        </div>

                        {/* Services */}
                        <div className="px-8 py-12">
                            <h3 className="text-2xl font-bold text-center mb-6">Our Services</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {["Service 1", "Service 2", "Service 3", "Service 4"].map((s) => (
                                    <div key={s} className="text-center p-4 rounded-xl bg-gray-50 border">
                                        <p className="text-sm font-medium text-gray-700">{s}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-50 px-8 py-6 text-center text-sm text-gray-500 border-t">
                            <Sparkles className="h-4 w-4 inline mr-1" /> Generated by SMBify AI
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-10">
                    <Button
                        size="lg"
                        onClick={() => setLocation("/dashboard/websites")}
                        className="bg-[#AADD00] hover:bg-[#bef000] text-black font-bold text-base px-10 py-6 rounded-xl shadow-lg shadow-[#AADD00]/25"
                    >
                        Go to My Websites <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
