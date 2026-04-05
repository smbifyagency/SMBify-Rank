import { Link } from "wouter";
import { Globe, ArrowRight } from "lucide-react";

export function SharedFooter() {
    return (
        <footer className="relative bg-gray-950 text-white overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-amber-400/3" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-16 border-b border-white/10">
                    {/* Brand */}
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 border border-purple-500/30 flex items-center justify-center shadow-lg">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8M12 17v4M7 4h10l-1 9H8L7 4z" /><path d="M12 4c0-1.5-1-2-2-2s-2 .5-2 2" opacity="0.7" /></svg>
                            </div>
                            <span className="text-xl font-bold tracking-tight">
                                <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">Site</span><span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">Genie</span>
                            </span>
                        </div>
                        <p className="text-gray-400 leading-relaxed max-w-sm text-sm mb-6">
                            The AI-powered website builder designed for local businesses. Create professional,
                            SEO-optimized websites in minutes — no coding required.
                        </p>
                        <Link href="/signup">
                            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-sm font-semibold text-white shadow-lg shadow-purple-600/25 transition-all">
                                Get Started Free <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        </Link>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Product</h4>
                        <ul className="space-y-3">
                            {[
                                { href: "/features", label: "Features" },
                                { href: "/pricing", label: "Pricing" },
                                { href: "/demo", label: "Demo" },
                                { href: "/blog", label: "Blog" },
                                { href: "/dashboard/websites", label: "Website Builder" },
                                { href: "/affiliates", label: "Affiliates" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 group">
                                        {link.label}
                                        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Company</h4>
                        <ul className="space-y-3">
                            {[
                                { href: "/about", label: "About Us" },
                                { href: "/contact", label: "Contact" },
                                { href: "/login", label: "Login" },
                                { href: "/signup", label: "Sign Up" },
                                { href: "/dashboard", label: "Dashboard" },
                                { href: "/sitemap", label: "Sitemap" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 group">
                                        {link.label}
                                        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {[
                                { href: "/terms", label: "Terms of Service" },
                                { href: "/privacy", label: "Privacy Policy" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 group">
                                        {link.label}
                                        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} SiteGenie. All rights reserved.
                    </p>
                    <p className="text-gray-600 text-xs">
                        Built with AI · Powered by React
                    </p>
                </div>
            </div>
        </footer>
    );
}
