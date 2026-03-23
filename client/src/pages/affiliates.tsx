import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
    DollarSign, Users, BarChart3, Gift, ArrowRight,
    CheckCircle, Sparkles, TrendingUp, Share2, Banknote
} from "lucide-react";

export default function AffiliatesPage() {
    const [, setLocation] = useLocation();

    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#AADD00]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                </div>
                <div className="relative max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-8">
                        <DollarSign className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm text-emerald-300">Earn 30% recurring commission</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                        Partner With{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
                            SMBify
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
                        Refer agencies and freelancers to SMBify and earn 30% recurring commission
                        on every paid subscription. No caps. No limits.
                    </p>
                    <Button
                        size="lg"
                        onClick={() => setLocation("/signup")}
                        className="bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-base px-8 py-6 rounded-xl shadow-lg shadow-emerald-500/25"
                    >
                        Join Affiliate Program <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { value: "30%", label: "Commission Rate" },
                                { value: "$0", label: "Minimum Payout" },
                                { value: "90 day", label: "Cookie Duration" },
                                { value: "Monthly", label: "Payouts" },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-500 text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Three simple steps to start earning passive income.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                icon: Share2,
                                title: "Sign Up & Share",
                                description: "Create your free affiliate account and get your unique referral link. Share it on your website, social media, or with your network.",
                                gradient: "from-emerald-500 to-emerald-600",
                            },
                            {
                                step: "02",
                                icon: Users,
                                title: "Referrals Subscribe",
                                description: "When someone clicks your link and signs up for a paid plan, they're tracked to your account with a 90-day cookie window.",
                                gradient: "from-[#AADD00] to-[#7ec800]",
                            },
                            {
                                step: "03",
                                icon: Banknote,
                                title: "Get Paid Monthly",
                                description: "Earn 30% of every subscription payment, recurring as long as they stay subscribed. Payouts via PayPal or Stripe.",
                                gradient: "from-[#AADD00] to-[#7ec800]",
                            },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.step} className="text-center">
                                    <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br ${item.gradient} text-white mb-6 shadow-lg`}>
                                        <Icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/[0.01]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold mb-4">Why Partner With Us?</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: TrendingUp, title: "Recurring Revenue", desc: "Earn commission every month, not just once. Build a growing passive income stream." },
                            { icon: Gift, title: "Free to Join", desc: "No cost to become an affiliate. No minimum sales. Start earning immediately." },
                            { icon: BarChart3, title: "Real-Time Dashboard", desc: "Track clicks, conversions, and earnings in real-time from your affiliate dashboard." },
                            { icon: DollarSign, title: "No Earning Caps", desc: "There's no limit on how much you can earn. The more referrals, the more you make." },
                            { icon: Sparkles, title: "Marketing Materials", desc: "We provide banners, email templates, and landing pages to help you convert." },
                            { icon: CheckCircle, title: "Dedicated Support", desc: "Get a dedicated affiliate manager to help you optimize your campaigns." },
                        ].map((benefit) => {
                            const Icon = benefit.icon;
                            return (
                                <div key={benefit.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:-translate-y-1 transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{benefit.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Earnings Calculator */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Earning Potential</h2>
                    <p className="text-gray-400 mb-12">See how much you could earn with just a few referrals.</p>
                    <div className="rounded-2xl border border-white/10 overflow-hidden">
                        <div className="grid grid-cols-3 bg-white/5">
                            <div className="p-4 text-sm font-semibold text-gray-400">Referrals</div>
                            <div className="p-4 text-sm font-semibold text-gray-400 text-center">Monthly Earnings</div>
                            <div className="p-4 text-sm font-semibold text-gray-400 text-right">Annual Earnings</div>
                        </div>
                        {[
                            { refs: "5 Pro", monthly: "$43.50", annual: "$522" },
                            { refs: "10 Pro", monthly: "$87", annual: "$1,044" },
                            { refs: "5 Agency", monthly: "$118.50", annual: "$1,422" },
                            { refs: "20 Pro", monthly: "$174", annual: "$2,088" },
                            { refs: "10 Agency", monthly: "$237", annual: "$2,844" },
                            { refs: "50 Mixed", monthly: "$650+", annual: "$7,800+" },
                        ].map((row, i) => (
                            <div key={row.refs} className={`grid grid-cols-3 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}>
                                <div className="p-4 text-sm text-gray-300">{row.refs}</div>
                                <div className="p-4 text-sm text-emerald-400 text-center font-semibold">{row.monthly}</div>
                                <div className="p-4 text-sm text-emerald-400 text-right font-semibold">{row.annual}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 mb-10">
                <div className="max-w-4xl mx-auto text-center rounded-2xl border border-white/10 bg-white/[0.02] p-12">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        Join our affiliate program today and start building recurring revenue.
                    </p>
                    <Button
                        size="lg"
                        onClick={() => setLocation("/signup")}
                        className="bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-base px-10 py-6 rounded-xl shadow-lg shadow-emerald-500/25"
                    >
                        <DollarSign className="mr-2 h-5 w-5" />
                        Join Affiliate Program
                    </Button>
                </div>
            </section>
        </>
    );
}
