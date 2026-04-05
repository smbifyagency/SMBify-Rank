import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  Sparkles, Globe, Zap, Shield, Clock, ArrowRight,
  CheckCircle, Layers, Search, Rocket, Code2, Star,
  FileText, MapPin, Palette, Lock, Users, BarChart3,
  PenTool, Image, Monitor, Key, Database, Bot, Check, X, AlertTriangle,
  Building2, Briefcase, TrendingUp, Laptop, Wrench, Handshake, Home, Cpu
} from "lucide-react";

const C = "#7C3AED"; // brand purple

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-50/50 via-white to-white">
      {/* ═══════ HERO ═══════ */}
      <section className="relative pt-32 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7C3AED]/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#7C3AED]/5 to-[#F59E0B]/3 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-purple-700" />
                <span className="text-sm text-gray-600">AI-Powered Website Builder</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
                Build. Rank.
                <span className="block bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] bg-clip-text text-transparent">
                  Dominate.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-xl mb-10 leading-relaxed mx-auto lg:mx-0">
                Create fully SEO-optimized, mobile-responsive, professional websites in
                <strong className="text-gray-900"> minutes — not weeks.</strong> No coding. No design skills. No SEO expertise needed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={() => setLocation("/dashboard/websites")}
                  className="bg-[#7C3AED] hover:bg-[#9333EA] text-white font-bold text-base px-8 py-6 rounded-xl shadow-lg shadow-[#7C3AED]/25 transition-all hover:shadow-[#7C3AED]/40 hover:-translate-y-0.5"
                  data-testid="button-hero-cta"
                >
                  Start Building Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-base px-8 py-6 rounded-xl border-gray-300 text-gray-900 hover:bg-gray-100 bg-transparent"
                >
                  See How It Works
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-12 text-sm text-gray-500">
                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-purple-700" />No coding required</div>
                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-purple-700" />270+ business categories</div>
                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-purple-700" />One-click deployment</div>
              </div>
            </div>

            {/* Right — browser mockup */}
            <div className="flex-1 w-full max-w-xl">
              <div className="rounded-2xl border border-white/60 bg-white/50 backdrop-blur-xl overflow-hidden shadow-2xl shadow-purple-200/30 ring-1 ring-white/50">
                <div className="flex items-center gap-2 px-4 py-3 bg-white/60 border-b border-gray-100/50">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-3 flex-1 px-3 py-1.5 rounded-md bg-gray-100 text-xs text-gray-500">https://your-business.netlify.app</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="h-3 rounded-full bg-[#7C3AED]/20 w-3/4" />
                  <div className="h-3 rounded-full bg-gray-200 w-full" />
                  <div className="h-3 rounded-full bg-gray-200 w-5/6" />
                  <div className="grid grid-cols-2 gap-3 my-5">
                    <div className="h-20 rounded-xl bg-gray-100 border border-gray-100" />
                    <div className="h-20 rounded-xl bg-gray-100 border border-gray-100" />
                    <div className="h-20 rounded-xl bg-gray-100 border border-gray-100" />
                    <div className="h-20 rounded-xl bg-gray-100 border border-gray-100" />
                  </div>
                  <div className="h-3 rounded-full bg-gray-200 w-2/3" />
                  <div className="inline-block px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] text-white text-xs font-bold mt-2">
                    Deploy to Netlify →
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-white/60 bg-white/50 backdrop-blur-xl shadow-lg shadow-purple-100/20 ring-1 ring-white/50 p-8 sm:p-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: "15+", label: "Pro Templates" },
                  { value: "270+", label: "Business Categories" },
                  { value: "2000+", label: "Words / Page" },
                  { value: "$0", label: "Platform Fees" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] bg-clip-text text-transparent mb-1">{s.value}</div>
                    <div className="text-gray-500 text-sm">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ PAIN POINTS ═══════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-700 font-semibold text-sm uppercase tracking-wider mb-3">The Problem</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Tired of Websites That Don't <span className="bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] bg-clip-text text-transparent">Perform?</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Most business owners face the same frustrating challenges when trying to get online.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: "💸", title: "$2,000–$5,000 Per Website", desc: "Agencies charge thousands for a single website that may not even rank. Your budget disappears before results appear." },
              { icon: "⏳", title: "Weeks of Waiting", desc: "Developers take weeks (sometimes months) to deliver. Meanwhile, your competitors are capturing all the local leads." },
              { icon: "📉", title: "Zero SEO Results", desc: "Beautiful websites that never show up on Google. No schema markup, no meta optimization — just a pretty digital brochure." },
            ].map((p) => (
              <div key={p.title} className="rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md shadow-lg shadow-purple-100/20 ring-1 ring-white/50 p-8 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-purple-200">
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7C3AED]/5 to-transparent" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-700 font-semibold text-sm uppercase tracking-wider mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">3 Steps to a <span className="bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] bg-clip-text text-transparent">Ranking Website</span></h2>
            <p className="text-gray-600 max-w-xl mx-auto">From zero to a fully deployed, SEO-optimized website in minutes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Enter Business Info", desc: "Add your business name, services, locations, and contact details. Pick from 270+ business categories." },
              { step: "02", title: "AI Generates Everything", desc: "Homepage, service pages, location pages, blog posts, FAQs, testimonials — 2000+ words of SEO-optimized content per page." },
              { step: "03", title: "Deploy & Rank", desc: "One-click deploy to Netlify with free SSL, global CDN, and custom domain support. Your site goes live instantly." },
            ].map((item, i) => (
              <div key={item.step} className="relative">
                {i < 2 && <div className="hidden md:block absolute top-12 left-[calc(100%_-_1rem)] w-[calc(100%_-_2rem)] h-px bg-gradient-to-r from-[#7C3AED]/30 to-transparent z-10" />}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[#7C3AED] text-white text-xl font-bold mb-6 shadow-lg shadow-[#7C3AED]/30">{item.step}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES — 6 CARDS ═══════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-700 font-semibold text-sm uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need to <span className="bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] bg-clip-text text-transparent">Build & Rank</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">A complete platform with AI content, SEO, blog, deployment, and admin tools — all in one.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* AI Content */}
            <div className="group rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md shadow-lg shadow-purple-100/20 ring-1 ring-white/50 p-7 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-200/30 hover:border-purple-200">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5 bg-purple-100"><Bot className="h-6 w-6 text-purple-700" /></div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI Content Generation</h3>
              <p className="text-gray-600 text-sm mb-4">2000+ words per page, humanized and SEO-optimized.</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {["Homepage content (2000+ words)","Service pages (2000-2500 words each)","Location / city pages (local SEO)","30+ AI-generated FAQs","AI testimonials with star ratings","Privacy Policy & Terms of Service"].map(t=>(
                  <li key={t} className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-700 mt-0.5 shrink-0" />{t}</li>
                ))}
              </ul>
            </div>

            {/* Blog System */}
            <div className="group rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md shadow-lg shadow-purple-100/20 ring-1 ring-white/50 p-7 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-200/30 hover:border-purple-200">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5 bg-purple-100"><PenTool className="h-6 w-6 text-purple-700" /></div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Full Blog System</h3>
              <p className="text-gray-600 text-sm mb-4">AI blog engine with bulk generation and rich editing.</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {["AI blog posts (1500-1800 words)","Bulk generation (multiple at once)","Humanized writing style","SEO titles, meta & heading structure","Featured images with click-to-upload","Categories, tags & reading time","Rich text editor","10+ blog prompt templates"].map(t=>(
                  <li key={t} className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-700 mt-0.5 shrink-0" />{t}</li>
                ))}
              </ul>
            </div>

            {/* Visual Editor */}
            <div className="group rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md shadow-lg shadow-purple-100/20 ring-1 ring-white/50 p-7 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-200/30 hover:border-purple-200">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5 bg-purple-100"><Palette className="h-6 w-6 text-purple-700" /></div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Visual Customization</h3>
              <p className="text-gray-600 text-sm mb-4">Drag-and-drop editor with full branding control.</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {["Drag-and-drop visual editor","Custom colors, fonts & branding","Logo & favicon upload","Unsplash stock photo integration","Custom CSS & HTML injection","Layout control (columns, spacing)","Desktop & mobile live preview","Social media links"].map(t=>(
                  <li key={t} className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-700 mt-0.5 shrink-0" />{t}</li>
                ))}
              </ul>
            </div>

            {/* Deployment */}
            <div className="group rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md shadow-lg shadow-purple-100/20 ring-1 ring-white/50 p-7 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-200/30 hover:border-purple-200">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5 bg-purple-100"><Rocket className="h-6 w-6 text-purple-700" /></div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">One-Click Deployment</h3>
              <p className="text-gray-600 text-sm mb-4">Deploy to Netlify instantly with free SSL & CDN.</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {["One-click deploy to Netlify","Free SSL/HTTPS certificate","Global CDN for speed","Custom domain support","Instant redeploy for updates","Change site URL anytime","Download as ZIP","Site name availability checker"].map(t=>(
                  <li key={t} className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-700 mt-0.5 shrink-0" />{t}</li>
                ))}
              </ul>
            </div>

            {/* Admin Dashboard */}
            <div className="group rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md shadow-lg shadow-purple-100/20 ring-1 ring-white/50 p-7 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-200/30 hover:border-purple-200">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5 bg-purple-100"><BarChart3 className="h-6 w-6 text-purple-700" /></div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Admin Dashboard</h3>
              <p className="text-gray-600 text-sm mb-4">Full control panel for agencies and teams.</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {["User management (create, edit, delete)","Role-based access (Admin, AI, Manual)","Website limits per user","Account expiry dates","Revenue tracking & metrics","AI request logging","Prompt management system","Analytics & tracking integration"].map(t=>(
                  <li key={t} className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-700 mt-0.5 shrink-0" />{t}</li>
                ))}
              </ul>
            </div>

            {/* Security & API Keys */}
            <div className="group rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md shadow-lg shadow-purple-100/20 ring-1 ring-white/50 p-7 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-200/30 hover:border-purple-200">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5 bg-purple-100"><Lock className="h-6 w-6 text-purple-700" /></div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Security & API Keys</h3>
              <p className="text-gray-600 text-sm mb-4">Bring your own API keys with encrypted storage.</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {["Email/password & Google OAuth","Bring your OWN API keys","OpenAI, Gemini, OpenRouter support","AES encrypted key storage","One-click API key testing","Password reset / forgot password","Netlify personal token support","Zero platform fees"].map(t=>(
                  <li key={t} className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-700 mt-0.5 shrink-0" />{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ TEMPLATES GRID ═══════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative" id="templates">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7C3AED]/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-700 font-semibold text-sm uppercase tracking-wider mb-3">Templates</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">15+ Professional <span className="bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] bg-clip-text text-transparent">Industry Templates</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Beautiful, conversion-focused designs for every business type. Each generates 10+ SEO-optimized pages.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { emoji: "📈", name: "SEO Agency", color: "from-blue-500/15" },
              { emoji: "⚖️", name: "Legal Pro", color: "from-blue-900/15" },
              { emoji: "🏠", name: "Real Estate", color: "from-yellow-500/15" },
              { emoji: "🍽️", name: "Restaurant", color: "from-red-500/15" },
              { emoji: "💪", name: "Fitness & Gym", color: "from-green-500/15" },
              { emoji: "💅", name: "Beauty & Spa", color: "from-purple-500/15" },
              { emoji: "🏥", name: "Medical Care", color: "from-teal-500/15" },
              { emoji: "🏗️", name: "Construction", color: "from-orange-500/15" },
              { emoji: "🚗", name: "Auto Pro", color: "from-red-500/15" },
              { emoji: "💻", name: "Tech Hub", color: "from-cyan-500/15" },
              { emoji: "🎓", name: "Education", color: "from-indigo-500/15" },
              { emoji: "🎨", name: "Creative Studio", color: "from-pink-500/15" },
              { emoji: "💰", name: "Finance", color: "from-green-500/15" },
              { emoji: "🔧", name: "Water Damage", color: "from-blue-500/15" },
              { emoji: "➕", name: "More Coming", color: "from-gray-500/15" },
            ].map((t) => (
              <div key={t.name} className={`rounded-2xl border border-white/60 bg-white/50 backdrop-blur-sm shadow-md shadow-purple-100/10 ring-1 ring-white/50 p-5 text-center transition-all hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg`}>
                <div className="text-3xl mb-3">{t.emoji}</div>
                <h4 className="text-sm font-bold text-gray-900">{t.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SEO ENGINE ═══════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" id="seo">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-700 font-semibold text-sm uppercase tracking-wider mb-3">SEO Engine</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built-In SEO That <span className="bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] bg-clip-text text-transparent">Actually Works</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Every website comes loaded with advanced SEO features that most agencies charge thousands extra for.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Schema Markup", desc: "LocalBusiness, Organization, Service, FAQ, Breadcrumbs — auto JSON-LD" },
              { title: "Meta Optimization", desc: "Auto-optimized meta titles (60 char) & descriptions (160 char)" },
              { title: "Open Graph & Twitter Cards", desc: "Perfect social sharing previews on Facebook, Twitter & LinkedIn" },
              { title: "Sitemap & Robots.txt", desc: "Auto-generated sitemap.xml and robots.txt for instant indexing" },
              { title: "Local SEO Pages", desc: "Separate page per service area/city with location-specific schema" },
              { title: "Service × Location Matrix", desc: "2000+ page combinations — dominate every local search query" },
              { title: "Geo-Targeting Tags", desc: "Location meta tags and Google Maps embedding for local dominance" },
              { title: "Heading Hierarchy", desc: "Proper H1 → H2 → H3 structure with keyword-optimized headings" },
              { title: "Keyword Optimization", desc: "1-2% density with LSI/semantic keywords naturally integrated" },
              { title: "6 SEO Content Sections", desc: "Customizable long-form content blocks per page for max ranking" },
              { title: "Image Alt Text", desc: "SEO-optimized alt text auto-generated for every image" },
              { title: "Canonical URLs", desc: "Prevent duplicate content issues with auto canonical tags" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 rounded-xl border border-white/60 bg-white/50 backdrop-blur-sm shadow-md shadow-purple-100/10 ring-1 ring-white/50 p-5 transition-all hover:border-purple-200 hover:shadow-lg">
                <div className="flex items-center justify-center min-w-[32px] h-8 rounded-lg bg-[#7C3AED]/15">
                  <Check className="h-4 w-4 text-purple-700" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ AI MODELS ═══════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative" id="ai-models">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7C3AED]/5 to-transparent" />
        <div className="relative max-w-5xl mx-auto text-center">
          <p className="text-purple-700 font-semibold text-sm uppercase tracking-wider mb-3">AI Engine</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powered by the World's <span className="bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] bg-clip-text text-transparent">Best AI Models</span></h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-12">Choose your preferred model or let the system auto-select. Bring your own API keys or use ours.</p>

          <div className="flex flex-wrap gap-5 justify-center mb-10">
            {[
              { icon: "🟢", name: "OpenAI GPT-4.1", desc: "Most powerful AI model" },
              { icon: "🟢", name: "GPT-4.1 Mini", desc: "Fast & cost-effective" },
              { icon: "🔵", name: "Google Gemini 2.5", desc: "Google's latest AI" },
              { icon: "🟣", name: "OpenRouter", desc: "100+ models via one key" },
            ].map((m) => (
              <div key={m.name} className="flex items-center gap-4 px-6 py-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-sm shadow-md shadow-purple-100/10 ring-1 ring-white/50 transition-all hover:border-purple-200 hover:shadow-lg">
                <span className="text-2xl">{m.icon}</span>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-sm">{m.name}</div>
                  <div className="text-xs text-gray-500">{m.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {["Humanized Writing","Grade 8-9 Reading Level","Story-Driven Content","Active Voice","1-2% Keyword Density","LSI Keywords","2000+ Words/Page","Auto Fallback","Bring Your Own Key"].map(t=>(
              <span key={t} className="px-4 py-2 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-xs font-medium text-purple-700">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PAGES GENERATED ═══════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-700 font-semibold text-sm uppercase tracking-wider mb-3">What Gets Generated</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">A Complete Website with <span className="bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] bg-clip-text text-transparent">10+ Pages</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Every website comes with all essential pages, fully written and SEO-optimized. No placeholders — real content.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md shadow-lg shadow-purple-100/20 ring-1 ring-white/50 p-7">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5 bg-blue-500/10"><FileText className="h-6 w-6 text-blue-400" /></div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Core Pages</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {["Homepage (2000+ words)","About Us page","Contact page with Google Maps","FAQ page (30+ questions)","Privacy Policy","Terms of Service"].map(t=>(
                  <li key={t} className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-700 mt-0.5 shrink-0" />{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md shadow-lg shadow-purple-100/20 ring-1 ring-white/50 p-7">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5 bg-green-500/10"><MapPin className="h-6 w-6 text-green-400" /></div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Dynamic Pages</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {["Service pages (one per service)","Location pages (one per city)","Service × Location combos","Gallery / Portfolio pages","Blog archive page","Individual blog posts"].map(t=>(
                  <li key={t} className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-700 mt-0.5 shrink-0" />{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md shadow-lg shadow-purple-100/20 ring-1 ring-white/50 p-7">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5 bg-purple-500/10"><Database className="h-6 w-6 text-purple-400" /></div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Technical Files</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {["sitemap.xml (auto-generated)","robots.txt (auto-generated)","Schema markup (JSON-LD)","Open Graph meta tags","Twitter Card meta tags","Canonical URLs"].map(t=>(
                  <li key={t} className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-700 mt-0.5 shrink-0" />{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ COMPARISON TABLE ═══════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative" id="compare">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7C3AED]/5 to-transparent" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-700 font-semibold text-sm uppercase tracking-wider mb-3">Comparison</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why SiteGenie <span className="bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] bg-clip-text text-transparent">Wins</span></h2>
            <p className="text-gray-600 max-w-xl mx-auto">See how we stack up against Wix, Squarespace, and WordPress.</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md shadow-lg shadow-purple-100/20 ring-1 ring-white/50">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-5 py-4 text-gray-600 font-semibold">Feature</th>
                  <th className="px-5 py-4 text-purple-700 font-bold bg-[#7C3AED]/10">SiteGenie</th>
                  <th className="px-5 py-4 text-gray-600 font-semibold">Wix / Squarespace</th>
                  <th className="px-5 py-4 text-gray-600 font-semibold">WordPress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ["AI Content (2000+ words/page)", "✅ Built-in", "❌ No", "❌ No"],
                  ["Auto Schema Markup", "✅ All types", "❌ No", "⚠️ Plugin needed"],
                  ["Local SEO Pages", "✅ Auto-generated", "❌ Manual", "⚠️ Manual"],
                  ["AI Blog Posts (Bulk)", "✅ Bulk generate", "❌ No", "❌ No"],
                  ["One-Click Deploy", "✅ Netlify", "⚠️ Platform-only", "❌ Manual"],
                  ["270+ Categories", "✅ Yes", "❌ No", "❌ No"],
                  ["Multi-AI Model", "✅ GPT-4.1, Gemini 2.5", "❌ No", "❌ No"],
                  ["Static HTML (Fast)", "✅ Pure HTML/CSS", "❌ Dynamic", "❌ PHP"],
                  ["Admin Dashboard", "✅ Full suite", "❌ No", "⚠️ Limited"],
                  ["Bring Your Own API Key", "✅ Yes", "❌ No", "❌ No"],
                  ["User Management & Roles", "✅ Roles + Limits", "❌ No", "⚠️ Plugin needed"],
                  ["Service × Location Matrix", "✅ 2000+ combos", "❌ No", "❌ No"],
                ].map(([feature, smb, wix, wp]) => (
                  <tr key={feature} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5 text-gray-900 font-medium">{feature}</td>
                    <td className="px-5 py-3.5 text-center bg-[#7C3AED]/5 text-purple-700 font-semibold">{smb}</td>
                    <td className="px-5 py-3.5 text-center text-gray-500">{wix}</td>
                    <td className="px-5 py-3.5 text-center text-gray-500">{wp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════ WHO IT'S FOR ═══════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" id="audience">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-700 font-semibold text-sm uppercase tracking-wider mb-3">Who It's For</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built for <span className="bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] bg-clip-text text-transparent">Growth-Minded</span> Businesses</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Whether you're a solo freelancer or a full agency, SiteGenie scales with you.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building2, title: "Marketing Agencies", desc: "Build client websites in minutes. Manage multiple clients from one dashboard. White-label ready." },
              { icon: Briefcase, title: "Local Business Owners", desc: "Plumbers, lawyers, dentists, restaurants — get a website that RANKS on Google without an expensive agency." },
              { icon: TrendingUp, title: "SEO Freelancers", desc: "Create SEO-optimized websites at scale. 270+ categories with automated local SEO and content." },
              { icon: Laptop, title: "Web Designers", desc: "Stop building from scratch. Generate with AI, customize with visual editor, deploy in minutes." },
              { icon: Rocket, title: "Startup Founders", desc: "Launch your business website TODAY. No developer needed. Professional and SEO-ready." },
              { icon: Handshake, title: "White-Label Partners", desc: "Full admin dashboard with user management, roles, limits, and subscriptions. Build your own brand." },
              { icon: Home, title: "Real Estate Agents", desc: "Professional templates with location pages for every neighborhood you serve." },
              { icon: Wrench, title: "Restoration Companies", desc: "Specialized template with cost calculators, before/after galleries, and emergency CTAs." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md shadow-md shadow-purple-100/10 ring-1 ring-white/50 p-6 transition-all hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg">
                  <Icon className="h-8 w-8 text-purple-700 mb-4" />
                  <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ EVERYTHING INCLUDED ═══════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7C3AED]/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-purple-700 font-semibold text-sm uppercase tracking-wider mb-3">Summary</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-10">Everything Included <span className="bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] bg-clip-text text-transparent">Out of the Box</span></h2>

          <div className="flex flex-wrap gap-3 justify-center">
            {[
              "Mobile-Responsive Design","2000+ Words / Page","Auto sitemap.xml","Auto robots.txt","Full Schema Markup",
              "AI Blog System","One-Click Netlify Deploy","Free SSL Certificate","Custom Domain","Drag-&-Drop Editor",
              "Admin Dashboard","30+ AI FAQs","Open Graph Tags","Twitter Cards","Geo-Targeting",
              "Service × Location Pages","Google Maps Embed","Social Media Links","Revenue Tracking","User Role Management",
              "Personal API Keys","Multi-AI Model","270+ Categories","Download as ZIP","Google Analytics",
              "Facebook Pixel","Custom Head Code","Unsplash Images",
            ].map(t=>(
              <span key={t} className="px-4 py-2 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-xs sm:text-sm font-medium text-purple-700">📌 {t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-[#7C3AED] to-[#F59E0B] p-12 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-white text-white" />
                ))}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Build a Website That<br className="hidden sm:block" />Actually Ranks on Google?
              </h2>
              <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
                Stop paying thousands for websites that don't perform. Start building websites that dominate — in minutes.
              </p>
              <Button
                size="lg"
                onClick={() => setLocation("/dashboard/websites")}
                className="bg-white hover:bg-white/90 text-purple-700 font-bold text-base px-10 py-6 rounded-xl shadow-xl transition-all hover:-translate-y-0.5"
                data-testid="button-final-cta"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Building — It's Free
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
