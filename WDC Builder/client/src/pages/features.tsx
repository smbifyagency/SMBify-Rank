import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
    Sparkles, Globe, Search, Rocket, Code2, Shield, Layers, FileText,
    Palette, Gauge, Link2, BarChart3, Bot, Database, Lock, Users,
    ArrowRight, CheckCircle, Zap
} from "lucide-react";

const featureGroups = [
    {
        title: "AI Content Engine",
        subtitle: "Generate professional content in seconds",
        color: "indigo",
        features: [
            {
                icon: Bot,
                title: "Multi-Model AI Support",
                description: "Choose between OpenAI GPT-4, Google Gemini, or OpenRouter. Bring your own keys — zero platform markup.",
            },
            {
                icon: FileText,
                title: "Smart Page Generation",
                description: "Auto-generate homepage copy, service descriptions, about pages, testimonials, and FAQs tailored to your business category.",
            },
            {
                icon: Code2,
                title: "AI Blog Engine",
                description: "Generate up to 30 SEO-optimized blog posts in one click. Auto-generates titles, meta descriptions, featured images, and categories.",
            },
        ],
    },
    {
        title: "Local SEO Suite",
        subtitle: "Rank higher in local search results",
        color: "emerald",
        features: [
            {
                icon: Search,
                title: "Schema Markup Manager",
                description: "Auto-generate LocalBusiness, Service, FAQ, and BreadcrumbList structured data. Validates against Google's rich results.",
            },
            {
                icon: Link2,
                title: "Internal Links Map",
                description: "Visualize your internal link graph, identify orphan pages, and optimize link equity distribution automatically.",
            },
            {
                icon: BarChart3,
                title: "Keyword Tracker",
                description: "Track your target keywords across generated pages. Monitor coverage and identify content gaps for better rankings.",
            },
        ],
    },
    {
        title: "Design & Templates",
        subtitle: "Professional designs for every industry",
        color: "violet",
        features: [
            {
                icon: Layers,
                title: "10+ Pro Templates",
                description: "Industry-specific templates for plumbers, dentists, restaurants, law firms, and more. All fully responsive.",
            },
            {
                icon: Palette,
                title: "Smart Color Matching",
                description: "AI analyzes your brand and suggests optimal color palettes. One-click theme switching with live preview.",
            },
            {
                icon: Globe,
                title: "Multi-Page Websites",
                description: "Generate complete multi-page sites with homepage, services, locations, about, contact, and blog sections.",
            },
        ],
    },
    {
        title: "Deploy & Scale",
        subtitle: "Go live in seconds, scale effortlessly",
        color: "amber",
        features: [
            {
                icon: Rocket,
                title: "One-Click Deploy",
                description: "Deploy directly to Netlify with automatic SSL, CDN, and custom domain support. Your site goes live in under 60 seconds.",
            },
            {
                icon: Database,
                title: "Export Options",
                description: "Download as ZIP for manual hosting, or deploy to Netlify, Vercel, or any static hosting provider.",
            },
            {
                icon: Gauge,
                title: "Performance First",
                description: "All generated sites score 95+ on Google PageSpeed. Optimized HTML, lazy-loaded images, and minimal CSS.",
            },
        ],
    },
    {
        title: "Agency Features",
        subtitle: "Built for scaling agencies",
        color: "rose",
        features: [
            {
                icon: Users,
                title: "Team Collaboration",
                description: "Invite team members with role-based access. Assign projects, review changes, and manage clients from one dashboard.",
            },
            {
                icon: Shield,
                title: "White-Label Branding",
                description: "Remove SMBify branding completely. Use your own logo, colors, and custom domain for the client portal.",
            },
            {
                icon: Lock,
                title: "API Key Security",
                description: "Session-based key storage with auto-expiry. Keys are never stored permanently — full BYOK privacy.",
            },
        ],
    },
];

const colorMap: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
    indigo: {
        bg: "from-indigo-500/10 to-indigo-500/5",
        text: "text-indigo-400",
        border: "border-indigo-500/20",
        iconBg: "bg-indigo-500/10",
    },
    emerald: {
        bg: "from-emerald-500/10 to-emerald-500/5",
        text: "text-emerald-400",
        border: "border-emerald-500/20",
        iconBg: "bg-emerald-500/10",
    },
    violet: {
        bg: "from-violet-500/10 to-violet-500/5",
        text: "text-violet-400",
        border: "border-violet-500/20",
        iconBg: "bg-violet-500/10",
    },
    amber: {
        bg: "from-amber-500/10 to-amber-500/5",
        text: "text-amber-400",
        border: "border-amber-500/20",
        iconBg: "bg-amber-500/10",
    },
    rose: {
        bg: "from-rose-500/10 to-rose-500/5",
        text: "text-rose-400",
        border: "border-rose-500/20",
        iconBg: "bg-rose-500/10",
    },
};

export default function FeaturesPage() {
    const [, setLocation] = useLocation();

    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                </div>
                <div className="relative max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
                        <Zap className="h-4 w-4 text-indigo-400" />
                        <span className="text-sm text-gray-300">Everything you need to build & rank</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                        Powerful Features for{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                            Local SEO
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
                        From AI content generation to one-click deployment — every tool your
                        local business website needs, built right in.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            onClick={() => setLocation("/dashboard/websites")}
                            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-base px-8 py-6 rounded-xl shadow-lg shadow-indigo-500/25"
                        >
                            Try It Free <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => setLocation("/pricing")}
                            className="text-base px-8 py-6 rounded-xl border-white/20 text-white hover:bg-white/5 bg-transparent"
                        >
                            View Pricing
                        </Button>
                    </div>
                </div>
            </section>

            {/* Feature Groups */}
            {featureGroups.map((group, groupIdx) => {
                const colors = colorMap[group.color];
                return (
                    <section key={group.title} className={`py-20 px-4 sm:px-6 lg:px-8 ${groupIdx % 2 === 0 ? "" : "bg-white/[0.01]"}`}>
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-14">
                                <p className={`${colors.text} font-semibold text-sm uppercase tracking-wider mb-3`}>
                                    {group.subtitle}
                                </p>
                                <h2 className="text-3xl sm:text-4xl font-bold">{group.title}</h2>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                {group.features.map((feature) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div
                                            key={feature.title}
                                            className={`rounded-2xl border bg-gradient-to-b p-6 transition-all hover:-translate-y-1 hover:shadow-lg ${colors.bg} ${colors.border}`}
                                        >
                                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${colors.iconBg} ${colors.text}`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                            <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                );
            })}

            {/* Comparison */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold mb-4">Why SMBify vs. Traditional Web Dev?</h2>
                        <p className="text-gray-400">See how we compare to hiring a developer or using WordPress.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 overflow-hidden">
                        <div className="grid grid-cols-3 bg-white/5">
                            <div className="p-4 font-semibold text-gray-400 text-sm"></div>
                            <div className="p-4 text-center font-semibold text-indigo-400 text-sm">SMBify</div>
                            <div className="p-4 text-center font-semibold text-gray-400 text-sm">Traditional</div>
                        </div>
                        {[
                            ["Time to launch", "5 minutes", "2-8 weeks"],
                            ["Cost", "$0 – $79/mo", "$2,000 – $10,000"],
                            ["SEO optimization", "Built-in", "Extra cost"],
                            ["Content creation", "AI-powered", "Manual"],
                            ["Schema markup", "Automatic", "Manual coding"],
                            ["Blog engine", "Included", "Plugin setup"],
                            ["Maintenance", "Zero", "Ongoing"],
                        ].map(([label, smbify, traditional], i) => (
                            <div key={label} className={`grid grid-cols-3 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}>
                                <div className="p-4 text-sm text-gray-300 font-medium">{label}</div>
                                <div className="p-4 text-center text-sm text-emerald-400 flex items-center justify-center gap-1">
                                    <CheckCircle className="h-3.5 w-3.5" /> {smbify}
                                </div>
                                <div className="p-4 text-center text-sm text-gray-500">{traditional}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 mb-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Build?</h2>
                    <p className="text-gray-400 max-w-xl mx-auto mb-8">
                        Start creating SEO-optimized websites in minutes. Completely free to start.
                    </p>
                    <Button
                        size="lg"
                        onClick={() => setLocation("/dashboard/websites")}
                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-base px-10 py-6 rounded-xl shadow-lg shadow-indigo-500/25"
                    >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Start Building — It's Free
                    </Button>
                </div>
            </section>
        </>
    );
}
