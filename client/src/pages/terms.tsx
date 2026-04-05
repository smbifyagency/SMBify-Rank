export default function TermsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center border-b border-white/10 pb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#F59E0B]">Conditions</span>
          </h1>
          <p className="text-gray-400 uppercase tracking-wider text-sm font-semibold">
            Last updated: November 12, 2025
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-20">
        <div className="prose prose-invert prose-indigo max-w-none">
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Agreement to Terms</h2>
              <p className="text-gray-400 leading-relaxed">
                By accessing and using SiteGenie AI Static Website Builder ("the Service"), you agree to be bound by these Terms and Conditions.
                If you do not agree to these terms, please do not use the Service.
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">2. Use of Service</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                SiteGenie AI Static Website Builder is a public platform that allows users to create websites by providing their own API keys.
                The Service includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[#9333EA]Marker marker:text-indigo-500">
                <li><span className="text-gray-400">Website generation using AI-powered content creation</span></li>
                <li><span className="text-gray-400">Template selection and customization</span></li>
                <li><span className="text-gray-400">Blog content generation and management</span></li>
                <li><span className="text-gray-400">SEO optimization tools</span></li>
                <li><span className="text-gray-400">Optional Netlify deployment integration</span></li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. User API Keys</h2>
              <p className="text-gray-400 leading-relaxed">
                You are responsible for providing and maintaining your own API keys for third-party services (OpenAI, Gemini, Netlify, Unsplash).
                API keys are stored securely per session and automatically expire after one hour. You are solely responsible for any charges
                incurred through your API usage.
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">4. User Responsibilities</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                As a user of the Service, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[#9333EA]Marker marker:text-indigo-500">
                <li><span className="text-gray-400">Provide accurate business information when creating websites</span></li>
                <li><span className="text-gray-400">Not use the Service for illegal or unauthorized purposes</span></li>
                <li><span className="text-gray-400">Not attempt to interfere with or compromise the Service's security</span></li>
                <li><span className="text-gray-400">Comply with all applicable laws and regulations</span></li>
                <li><span className="text-gray-400">Respect intellectual property rights of others</span></li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">5. AI-Generated Content</h2>
              <p className="text-gray-400 leading-relaxed bg-[#7C3AED]/10 border border-[#7C3AED]/20 p-6 rounded-xl">
                The Service uses AI to generate website content. While we strive for accuracy and quality, AI-generated content may contain
                errors or inaccuracies. You are responsible for reviewing and editing all generated content before publication. We do not
                guarantee the accuracy, completeness, or suitability of AI-generated content for any particular purpose.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">6. Intellectual Property</h2>
              <p className="text-gray-400 leading-relaxed">
                You retain ownership of the business information and content you provide. The websites you generate using the Service are
                your property. However, the Service itself, including its code, design, and features, remains our intellectual property.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">7. Limitation of Liability</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  The Service is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use
                  of the Service, including but not limited to API costs, lost data, or business interruption.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">8. Termination</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  We reserve the right to terminate or suspend access to the Service at any time, without prior notice, for conduct that
                  we believe violates these Terms or is harmful to other users or the Service.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">9. Changes to Terms</h2>
              <p className="text-gray-400 leading-relaxed">
                We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.
                We will make reasonable efforts to notify users of material changes.
              </p>
            </div>

            <div className="border-t border-white/10 pt-8 mt-12 text-center">
              <h2 className="text-xl font-semibold mb-4 text-white">10. Contact Information</h2>
              <p className="text-gray-400">
                For questions about these Terms and Conditions, please contact us at{" "}
                <a href="mailto:info@sitegenie.app" className="text-[#7C3AED] hover:text-[#9333EA] transition-colors font-medium">
                  info@sitegenie.app
                </a>
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
