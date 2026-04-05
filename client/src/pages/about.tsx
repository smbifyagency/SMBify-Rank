import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Shield, Sparkles, Globe, Users, TrendingUp } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7C3AED]/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-gray-900">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#F59E0B]">SiteGenie</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Empowering local businesses with AI-powered websites. We democratize professional web presence,
            making it accessible, fast, and highly effective for small and medium-sized businesses.
          </p>
        </div>
      </section>

      {/* Core Mission */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8 sm:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                SiteGenie was created to democratize professional web presence for small and medium-sized businesses.
                We believe that every local business deserves a high-quality, SEO-optimized website without the complexity or high costs
                traditionally associated with web development.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our platform combines cutting-edge AI technology with proven web design principles to create professional websites
                tailored specifically for local businesses.
              </p>
            </div>
            <div className="relative h-64 rounded-xl rounded-2xl overflow-hidden bg-gradient-to-br from-[#7C3AED]/15 to-[#F59E0B]/10 flex items-center justify-center border border-[#7C3AED]/20 shadow-lg">
              <Sparkles className="h-16 w-16 text-[#7C3AED]/50" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Why Choose Us?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">The features that make SiteGenie the best choice for your local business website.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Sparkles,
              title: "AI-Powered Content",
              desc: "Generate professional website content, blog posts, and SEO-optimized descriptions using advanced AI models like OpenAI and Google Gemini.",
              color: "indigo"
            },
            {
              icon: Globe,
              title: "270+ Categories",
              desc: "Choose from professionally designed, mobile-responsive templates specifically crafted for local businesses across 270+ categories.",
              color: "violet"
            },
            {
              icon: TrendingUp,
              title: "SEO Optimized",
              desc: "Every website includes advanced schema markup, optimized meta tags, and local SEO features to help you rank higher.",
              color: "emerald"
            },
            {
              icon: Shield,
              title: "Privacy First",
              desc: "Your API keys are session-based and auto-expire. We never store your keys permanently, ensuring maximum security.",
              color: "amber"
            },
            {
              icon: Zap,
              title: "Instant Deployment",
              desc: "Deploy your website to Netlify with one click, complete with custom domain support and automatic SSL certificates.",
              color: "rose"
            },
            {
              icon: Users,
              title: "No Coding Required",
              desc: "Simple, intuitive interface designed for non-technical users. Create professional websites without writing a single line of code.",
              color: "cyan"
            }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            const iconBgClass = "bg-[#7C3AED]/10 text-[#7C3AED]";

            return (
              <Card key={idx} className="bg-white border-gray-200 shadow-sm hover:border-purple-200 hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${iconBgClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section >

      {/* Process Steps */}
      < section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-20" >
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">How It Works</h2>
        <div className="space-y-6">
          {[
            { step: 1, title: "Provide Your API Keys", desc: "Enter your own API keys for OpenAI or Google Gemini (free option). Your keys are securely stored for your session only." },
            { step: 2, title: "Fill in Business Details", desc: "Enter your business information, select your category, choose a template, and let our AI generate compelling content." },
            { step: 3, title: "Preview & Customize", desc: "Preview your website in real-time, edit content, add blog posts, and make it perfect for your business." },
            { step: 4, title: "Download or Deploy", desc: "Download your website as a ZIP file or deploy it directly to Netlify with custom domain support." }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-6 items-start p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 bg-[#7C3AED]/15 text-[#7C3AED] rounded-full flex items-center justify-center font-bold border border-[#7C3AED]/25">
                {item.step}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section >
    </div>
  );
}
