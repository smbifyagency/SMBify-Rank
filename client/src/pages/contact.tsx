import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageSquare, HelpCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#AADD00]/8 to-[#AADD00]/3 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#AADD00] to-[#7ec800]">Us</span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            We're here to help with any questions or concerns.
            Have questions about SMBify? Need technical support or have feedback? We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/[0.02] border-white/10 hover:border-[#AADD00]/25 transition-all hover:-translate-y-1">
            <CardContent className="pt-8 pb-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-[#AADD00]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#AADD00]/20 text-[#AADD00]">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Email Support</h3>
              <p className="text-gray-400 mb-6 text-sm">For general inquiries and support</p>
              <a
                href="mailto:info@smbifylocal.com"
                className="text-[#AADD00] hover:text-[#bef000] transition-colors font-medium hover:underline mt-auto"
              >
                info@smbifylocal.com
              </a>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.02] border-white/10 hover:border-violet-500/30 transition-all hover:-translate-y-1">
            <CardContent className="pt-8 pb-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-[#AADD00]/8 rounded-2xl flex items-center justify-center mb-6 border border-[#AADD00]/15 text-[#AADD00]">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Technical Support</h3>
              <p className="text-gray-400 mb-6 text-sm">Help with technical issues</p>
              <a
                href="mailto:info@smbifylocal.com?subject=Technical Support"
                className="text-[#AADD00] hover:text-[#bef000] transition-colors font-medium hover:underline mt-auto"
              >
                info@smbifylocal.com
              </a>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.02] border-white/10 hover:border-emerald-500/30 transition-all hover:-translate-y-1">
            <CardContent className="pt-8 pb-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 text-emerald-400">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Feedback</h3>
              <p className="text-gray-400 mb-6 text-sm">Share your suggestions</p>
              <a
                href="mailto:info@smbifylocal.com?subject=Feedback"
                className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium hover:underline mt-auto"
              >
                info@smbifylocal.com
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-20">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 sm:p-12">
          <h3 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Frequently Asked Questions</h3>
          <div className="space-y-8">
            <div>
              <h4 className="font-semibold text-[#AADD00] mb-2">How do I get started?</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Simply visit the homepage, enter your API keys (OpenAI or Gemini), fill in your business details,
                and our AI will generate a professional website for you in minutes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#AADD00] mb-2">Are my API keys safe?</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Yes! Your API keys are stored only in your session and automatically expire after one hour.
                We never store them in permanent databases.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#AADD00] mb-2">Can I edit the generated website?</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Absolutely! You can download the generated website as a ZIP file and edit all HTML, CSS, and content
                to your liking before deploying it.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center bg-white/[0.02] rounded-2xl border border-white/10 p-8">
          <h3 className="text-xl font-semibold text-white mb-3">Business Hours</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Monday - Friday: 9:00 AM - 6:00 PM EST<br />
            Saturday - Sunday: Closed
          </p>
          <p className="text-xs text-[#AADD00] mt-4 px-4 py-2 inline-block bg-[#AADD00]/10 rounded-full border border-[#AADD00]/20">
            Emergency support requests will be addressed as soon as possible
          </p>
        </div>
      </section>
    </>
  );
}
