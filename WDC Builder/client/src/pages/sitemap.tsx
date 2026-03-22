import { Link } from "wouter";
import { ExternalLink, ListTree } from "lucide-react";
import { saasSections } from "@/lib/saas-pages";

export default function SitemapPage() {
  const totalPages = saasSections.reduce((count, section) => count + section.pages.length, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                <ListTree className="h-3.5 w-3.5" />
                {totalPages} pages
              </div>
              <h1 className="text-3xl font-bold text-white mt-3">SaaS Sitemap</h1>
              <p className="text-gray-400 mt-2">
                Use this page to verify all SaaS routes. Every link below points to a live route in the app.
              </p>
            </div>

            <div className="flex gap-2">
              <Link href="/dashboard/websites" className="inline-flex items-center rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-4 py-2 text-sm font-semibold text-white">
                Open Builder
              </Link>
              <a
                href="/saas-sitemap.html"
                className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white"
              >
                HTML Sitemap
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {saasSections.map((section) => (
            <section key={section.id} className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-white">{section.label}</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {section.pages.map((page) => (
                  <Link
                    key={page.id}
                    href={page.href}
                    className="rounded-lg border border-white/10 px-3 py-3 text-sm text-gray-300 hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:text-white transition-colors"
                  >
                    <div className="font-medium text-white">{page.name}</div>
                    <div className="mt-1 text-xs font-mono text-gray-500">{page.href}</div>
                    <div className="mt-1 text-xs text-gray-400">{page.description}</div>
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
