import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Check, X, Sparkles, Zap, Building2, HelpCircle } from "lucide-react";
import { useState } from "react";

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Perfect for trying out SMBify with your own API keys.",
        icon: Sparkles,
        color: "gray",
        cta: "Start Free",
        features: [
            { name: "1 website", included: true },
            { name: "AI content generation", included: true },
            { name: "5 blog posts per site", included: true },
            { name: "Basic SEO tools", included: true },
            { name: "Download as ZIP", included: true },
            { name: "Community support", included: true },
            { name: "Custom domains", included: false },
            { name: "White-label branding", included: false },
            { name: "Priority support", included: false },
            { name: "Team collaboration", included: false },
        ],
    },
    {
        name: "Pro",
        price: "$29",
        period: "/month",
        description: "For agencies and freelancers managing multiple client sites.",
        icon: Zap,
        color: "indigo",
        cta: "Start Pro Trial",
        popular: true,
        features: [
            { name: "10 websites", included: true },
            { name: "AI content generation", included: true },
            { name: "30 blog posts per site", included: true },
            { name: "Advanced SEO suite", included: true },
            { name: "Download + Netlify deploy", included: true },
            { name: "Email support", included: true },
            { name: "Custom domains", included: true },
            { name: "Schema markup manager", included: true },
            { name: "White-label branding", included: false },
            { name: "Team collaboration", included: false },
        ],
    },
    {
        name: "Agency",
        price: "$79",
        period: "/month",
        description: "Unlimited power for agencies scaling local SEO services.",
        icon: Building2,
        color: "violet",
        cta: "Contact Sales",
        features: [
            { name: "Unlimited websites", included: true },
            { name: "AI content generation", included: true },
            { name: "Unlimited blog posts", included: true },
            { name: "Full SEO suite + reports", included: true },
            { name: "All deployment options", included: true },
            { name: "Priority support", included: true },
            { name: "Custom domains", included: true },
            { name: "Schema markup manager", included: true },
            { name: "White-label branding", included: true },
            { name: "Team collaboration", included: true },
        ],
    },
];

const faqs = [
    {
        question: "Do I need my own API keys?",
        answer: "Yes! SMBify uses a BYOK (Bring Your Own Key) model. You provide your OpenAI, Google Gemini, or OpenRouter API keys, and you only pay for the tokens you use. This keeps our platform fees low while giving you full control.",
    },
    {
        question: "Can I cancel anytime?",
        answer: "Absolutely. All paid plans are month-to-month with no long-term contracts. Cancel anytime from your billing settings — your sites remain accessible until the end of your billing period.",
    },
    {
        question: "What happens to my sites if I downgrade?",
        answer: "Your existing sites remain live and functional. However, you won't be able to create new sites beyond your plan's limit until you upgrade again or remove unused projects.",
    },
    {
        question: "Is there a free trial for paid plans?",
        answer: "Yes! Pro and Agency plans come with a 14-day free trial. No credit card required to start — just upgrade when you're ready.",
    },
    {
        question: "Do you offer custom enterprise plans?",
        answer: "Yes, we offer custom enterprise plans for large agencies with 50+ client sites. Contact our sales team for volume pricing and dedicated support options.",
    },
    {
        question: "What's included in white-label branding?",
        answer: "White-label lets you remove all SMBify branding from generated websites and the client portal. You can add your own logo, colors, and custom domain for a fully branded experience.",
    },
];

export default function PricingPage() {
    const [, setLocation] = useLocation();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                </div>
                <div className="relative max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                        Simple, Transparent{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                            Pricing
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        No hidden fees. No per-site charges. Choose the plan that fits your needs
                        and scale as you grow.
                    </p>
                </div>
            </section>

            {/* Plans */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
                    {plans.map((plan) => {
                        const Icon = plan.icon;
                        return (
                            <div
                                key={plan.name}
                                className={`relative rounded-2xl border p-8 transition-all hover:-translate-y-1 ${plan.popular
                                        ? "border-indigo-500/50 bg-gradient-to-b from-indigo-500/10 to-transparent shadow-lg shadow-indigo-500/10"
                                        : "border-white/10 bg-white/[0.02]"
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                                        Most Popular
                                    </div>
                                )}
                                <div className="mb-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${plan.color === "indigo" ? "bg-indigo-500/10 text-indigo-400"
                                            : plan.color === "violet" ? "bg-violet-500/10 text-violet-400"
                                                : "bg-gray-500/10 text-gray-400"
                                        }`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                                    <p className="text-sm text-gray-400 mt-1">{plan.description}</p>
                                </div>
                                <div className="mb-6">
                                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                                    <span className="text-gray-400 ml-1">{plan.period}</span>
                                </div>
                                <Button
                                    onClick={() => setLocation(plan.name === "Agency" ? "/contact" : "/signup")}
                                    className={`w-full mb-8 py-6 text-base font-semibold rounded-xl ${plan.popular
                                            ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25"
                                            : "bg-white/10 hover:bg-white/15 text-white"
                                        }`}
                                >
                                    {plan.cta}
                                </Button>
                                <div className="space-y-3">
                                    {plan.features.map((feature) => (
                                        <div key={feature.name} className="flex items-center gap-3 text-sm">
                                            {feature.included ? (
                                                <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                                            ) : (
                                                <X className="h-4 w-4 text-gray-600 flex-shrink-0" />
                                            )}
                                            <span className={feature.included ? "text-gray-300" : "text-gray-600"}>
                                                {feature.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-400">Everything you need to know about our pricing and plans.</p>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 text-left"
                                >
                                    <span className="font-medium text-white">{faq.question}</span>
                                    <HelpCircle className={`h-5 w-5 text-gray-400 transition-transform ${openFaq === i ? "rotate-45" : ""}`} />
                                </button>
                                {openFaq === i && (
                                    <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center rounded-2xl border border-white/10 bg-white/[0.02] p-12">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        Start building professional websites for your clients today. No credit card required.
                    </p>
                    <Button
                        size="lg"
                        onClick={() => setLocation("/signup")}
                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-base px-10 py-6 rounded-xl shadow-lg shadow-indigo-500/25"
                    >
                        Start Building Free
                    </Button>
                </div>
            </section>
        </>
    );
}
