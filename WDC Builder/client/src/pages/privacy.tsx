export default function PrivacyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center border-b border-white/10 pb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Policy</span>
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
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
              <p className="text-gray-400 leading-relaxed">
                At SMBify AI Static Website Builder ("we," "our," or "us"), we respect your privacy and are committed to protecting your
                personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Service.
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">2. Information We Collect</h2>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">2.1 Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-2 text-indigo-300Marker marker:text-indigo-500">
                  <li><span className="text-gray-400">Business information (name, address, phone, email, services)</span></li>
                  <li><span className="text-gray-400">Website content and preferences</span></li>
                  <li><span className="text-gray-400">API keys (stored temporarily and securely per session)</span></li>
                  <li><span className="text-gray-400">User account information (email, password for admin accounts)</span></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">2.2 Automatically Collected Information</h3>
                <ul className="list-disc pl-6 space-y-2 text-indigo-300Marker marker:text-indigo-500">
                  <li><span className="text-gray-400">Browser type and version</span></li>
                  <li><span className="text-gray-400">Device information</span></li>
                  <li><span className="text-gray-400">IP address</span></li>
                  <li><span className="text-gray-400">Usage patterns and analytics data</span></li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. How We Use Your Information</h2>
              <p className="text-gray-400 leading-relaxed mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 text-indigo-300Marker marker:text-indigo-500">
                <li><span className="text-gray-400">Generate websites based on your business information</span></li>
                <li><span className="text-gray-400">Create AI-powered content using your provided API keys</span></li>
                <li><span className="text-gray-400">Provide customer support and respond to inquiries</span></li>
                <li><span className="text-gray-400">Improve and optimize our Service</span></li>
                <li><span className="text-gray-400">Send service-related notifications</span></li>
                <li><span className="text-gray-400">Monitor and analyze usage patterns</span></li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">4. API Key Security</h2>
              <p className="text-gray-300 leading-relaxed font-medium mb-4">
                Your API keys are critically important to us. We implement the following security measures:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-indigo-300Marker marker:text-indigo-500">
                <li><span className="text-gray-400"><strong className="text-white font-semibold">Session-Based Storage:</strong> API keys are stored only in your session and never in persistent databases</span></li>
                <li><span className="text-gray-400"><strong className="text-white font-semibold">Automatic Expiration:</strong> All API keys automatically expire after one hour</span></li>
                <li><span className="text-gray-400"><strong className="text-white font-semibold">Session Isolation:</strong> Each user's API keys are completely isolated from others</span></li>
                <li><span className="text-gray-400"><strong className="text-white font-semibold">No Server-Side Persistence:</strong> We do not permanently store your API keys</span></li>
                <li><span className="text-gray-400"><strong className="text-white font-semibold">Encrypted Transmission:</strong> All data is transmitted over secure HTTPS connections</span></li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">5. Data Sharing and Disclosure</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-indigo-300Marker marker:text-indigo-500">
                <li><span className="text-gray-400"><strong className="text-white">Third-Party APIs:</strong> Your API keys are used to make requests to OpenAI, Gemini, Netlify, and Unsplash on your behalf</span></li>
                <li><span className="text-gray-400"><strong className="text-white">Legal Requirements:</strong> When required by law or to protect our rights</span></li>
                <li><span className="text-gray-400"><strong className="text-white">Service Providers:</strong> With trusted service providers who assist in operating our Service (under strict confidentiality agreements)</span></li>
              </ul>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="bg-white/[0.02] border border-white/10 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-white">6. Data Retention</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  We retain your information only as long as necessary to provide the Service. Session data, including API keys, is automatically
                  deleted after one hour. Generated website data is stored until you delete it or your account is closed.
                </p>
              </div>
              <div className="bg-white/[0.02] border border-white/10 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-white">7. Your Rights</h2>
                <ul className="list-disc pl-5 space-y-1 text-gray-400 text-sm">
                  <li>Access personal information</li>
                  <li>Request correction to data</li>
                  <li>Request deletion of info</li>
                  <li>Object to processing</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-white">8. Cookies and Tracking</h2>
              <p className="text-gray-400 leading-relaxed">
                We use session cookies to maintain your login state and preferences. We also use analytics tools (Google Analytics, if configured)
                to understand how users interact with our Service. You can control cookies through your browser settings.
              </p>
            </div>

            <div className="border-t border-white/10 pt-8 mt-12 text-center">
              <h2 className="text-xl font-semibold mb-4 text-white">12. Contact Us</h2>
              <p className="text-gray-400">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us at{" "}
                <a href="mailto:info@smbifylocal.com" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                  info@smbifylocal.com
                </a>
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
