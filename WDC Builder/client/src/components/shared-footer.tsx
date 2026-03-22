import { Link } from "wouter";
import { Globe, ArrowRight } from "lucide-react";

export function SharedFooter() {
    return (
        <footer className="relative bg-gray-950 text-white overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-transparent to-violet-950/30" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-16 border-b border-white/10">
                    {/* Brand */}
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                                <Globe className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">SMBify</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed max-w-sm text-sm mb-6">
                            The AI-powered website builder designed for local businesses. Create professional,
                            SEO-optimized websites in minutes — no coding required.
                        </p>
                        <Link href="/signup">
                            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all">
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
                        © {new Date().getFullYear()} SMBify. All rights reserved.
                    </p>
                    <p className="text-gray-600 text-xs">
                        Built with AI · Powered by React
                    </p>
                </div>
            </div>
        </footer>
    );
}
