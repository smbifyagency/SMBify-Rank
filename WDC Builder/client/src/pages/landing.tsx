import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  Sparkles, Globe, Zap, Shield, Clock, ArrowRight,
  CheckCircle, Layers, Search, Rocket, Code2, Star
} from "lucide-react";
export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="text-sm text-gray-300">AI-Powered Website Builder for Local Businesses</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Build Websites That
              <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Rank & Convert
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Create SEO-optimized, professional websites for local businesses in minutes.
              AI generates your content, blog posts, and schema markup automatically.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setLocation("/dashboard/websites")}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-base px-8 py-6 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:-translate-y-0.5"
                data-testid="button-hero-cta"
              >
                Start Building Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-base px-8 py-6 rounded-xl border-white/20 text-white hover:bg-white/5 bg-transparent"
              >
                See How It Works
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                No coding required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                270+ business categories
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Instant deployment
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-400 font-semibold text-sm uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to Go Live
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From AI content generation to one-click deployment — we've built every tool
              your local business website needs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: "AI Content Generation",
                description: "Generate professional copy, FAQs, testimonials, and SEO content using OpenAI, Gemini, or OpenRouter.",
                color: "indigo",
              },
              {
                icon: Search,
                title: "Local SEO Built-In",
                description: "Schema markup, optimized meta tags, location pages, and service pages — all auto-generated for Google rankings.",
                color: "violet",
              },
              {
                icon: Rocket,
                title: "One-Click Deploy",
                description: "Deploy directly to Netlify with custom domains and automatic SSL. Your site goes live in seconds.",
                color: "emerald",
              },
              {
                icon: Layers,
                title: "10+ Pro Templates",
                description: "Industry-specific templates with smart color matching. Each one mobile-responsive and conversion-optimized.",
                color: "amber",
              },
              {
                icon: Code2,
                title: "AI Blog Engine",
                description: "Auto-generate SEO blog posts with featured images, categories, and proper formatting. Up to 30 articles at once.",
                color: "rose",
              },
              {
                icon: Shield,
                title: "Your Keys, Your Cost",
                description: "Bring your own API keys. Zero platform fees. You only pay for the AI tokens you actually use.",
                color: "cyan",
              },
            ].map((feature) => {
              const colorMap: Record<string, string> = {
                indigo: "from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 text-indigo-400",
                violet: "from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-400",
                emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400",
                amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400",
                rose: "from-rose-500/20 to-rose-500/5 border-rose-500/20 text-rose-400",
                cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400",
              };
              const iconColorMap: Record<string, string> = {
                indigo: "bg-indigo-500/10 text-indigo-400",
                violet: "bg-violet-500/10 text-violet-400",
                emerald: "bg-emerald-500/10 text-emerald-400",
                amber: "bg-amber-500/10 text-amber-400",
                rose: "bg-rose-500/10 text-rose-400",
                cyan: "bg-cyan-500/10 text-cyan-400",
              };
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`group relative rounded-2xl border bg-gradient-to-b p-6 transition-all hover:-translate-y-1 hover:shadow-lg ${colorMap[feature.color]}`}
                >
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${iconColorMap[feature.color]}`}>
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

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-400 font-semibold text-sm uppercase tracking-wider mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Live in 3 Simple Steps
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              No technical skills needed. Just fill in your details and let our AI do the heavy lifting.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Enter Business Details",
                description: "Fill in your business name, services, location, and category. Our smart form adapts to your industry.",
                gradient: "from-indigo-500 to-indigo-600",
              },
              {
                step: "02",
                title: "AI Generates Content",
                description: "Our AI creates compelling SEO copy, blog posts, FAQs, testimonials, and structured data automatically.",
                gradient: "from-violet-500 to-violet-600",
              },
              {
                step: "03",
                title: "Deploy & Go Live",
                description: "Preview your site, download as ZIP, or deploy to Netlify with one click. Custom domains supported.",
                gradient: "from-purple-500 to-purple-600",
              },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-[calc(100%_-_1rem)] w-[calc(100%_-_2rem)] h-px bg-gradient-to-r from-white/20 to-transparent z-10" />
                )}
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br ${item.gradient} text-white text-xl font-bold mb-6 shadow-lg`}>
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "270+", label: "Business Categories" },
                { value: "10+", label: "Pro Templates" },
                { value: "30", label: "Blog Posts / Build" },
                { value: "$0", label: "Platform Fees" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Build Your Website?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Join hundreds of local businesses already using SMBify to create their online presence.
            Start building — it's completely free.
          </p>
          <Button
            size="lg"
            onClick={() => setLocation("/dashboard/websites")}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-base px-10 py-6 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            data-testid="button-final-cta"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Start Building — It's Free
          </Button>
        </div>
      </section>
    </>
  );
}