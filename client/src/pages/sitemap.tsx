import { Link } from "wouter";
import { ExternalLink, ListTree } from "lucide-react";
import { saasSections } from "@/lib/saas-pages";

export default function SitemapPage() {
  const totalPages = saasSections.reduce((count, section) => count + section.pages.length, 0);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md shadow-lg shadow-purple-100/20 ring-1 ring-white/50 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/25 bg-[#7C3AED]/10 px-3 py-1 text-xs font-semibold text-[#9333EA]">
                <ListTree className="h-3.5 w-3.5" />
                {totalPages} pages
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mt-3">SaaS Sitemap</h1>
              <p className="text-gray-500 mt-2">
                Use this page to verify all SaaS routes. Every link below points to a live route in the app.
              </p>
            </div>

            <div className="flex gap-2">
              <Link href="/dashboard/websites" className="inline-flex items-center rounded-md bg-[#7C3AED] hover:bg-[#9333EA] font-bold px-4 py-2 text-sm font-semibold text-white">
                Open Builder
              </Link>
              <a
                href="/saas-sitemap.html"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                HTML Sitemap
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {saasSections.map((section) => (
            <section key={section.id} className="rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md shadow-lg shadow-purple-100/20 ring-1 ring-white/50 p-6">
              <h2 className="text-lg font-semibold text-gray-900">{section.label}</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {section.pages.map((page) => (
                  <Link
                    key={page.id}
                    href={page.href}
                    className="rounded-lg border border-gray-200 px-3 py-3 text-sm text-gray-600 hover:border-[#7C3AED]/40 hover:bg-purple-50/50 hover:text-gray-900 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{page.name}</div>
                    <div className="mt-1 text-xs font-mono text-gray-400">{page.href}</div>
                    <div className="mt-1 text-xs text-gray-500">{page.description}</div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
