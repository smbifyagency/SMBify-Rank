import { Link } from "wouter";
import { ExternalLink, Layers, MapPinned } from "lucide-react";
import { allSaasPages, saasSections, type SaasPage } from "@/lib/saas-pages";

interface SaasScaffoldPageProps {
  page: SaasPage;
}

export default function SaasScaffoldPage({ page }: SaasScaffoldPageProps) {
  const siblingPages = allSaasPages.filter(
    (candidate) => candidate.section === page.section && candidate.id !== page.id,
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {page.section}
              </p>
              <h1 className="text-3xl font-bold text-white mt-1">{page.name}</h1>
              <p className="text-gray-400 mt-2">{page.description}</p>
              <p className="mt-3 inline-flex items-center rounded-md bg-white/5 border border-white/10 px-3 py-1 text-sm font-mono text-gray-300">
                {page.routePath}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/websites" className="inline-flex items-center rounded-md bg-[#7C3AED] hover:bg-[#9333EA] text-black font-bold px-4 py-2 text-sm font-semibold text-white">
                Builder
              </Link>
              <Link href="/sitemap" className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white">
                In-App Sitemap
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section className="xl:col-span-1 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="h-4 w-4 text-[#7C3AED]" />
              <h2 className="text-lg font-semibold text-white">Related Pages</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Pages from the same section:
            </p>
            <div className="space-y-2">
              {siblingPages.length === 0 && (
                <p className="text-sm text-gray-500">No sibling pages available.</p>
              )}
              {siblingPages.map((sibling) => (
                <Link
                  key={sibling.id}
                  href={sibling.href}
                  className="block rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 hover:border-[#7C3AED]/40 hover:bg-indigo-500/5 transition-colors hover:text-white"
                >
                  <div className="font-medium text-white">{sibling.name}</div>
                  <div className="text-xs font-mono text-gray-500 mt-1">{sibling.href}</div>
                </Link>
              ))}
            </div>
          </section>

          <section className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MapPinned className="h-4 w-4 text-[#7C3AED]" />
              <h2 className="text-lg font-semibold text-white">All SaaS Pages</h2>
            </div>
            <p className="text-sm text-gray-400 mb-5">
              Every scaffold page links here, so all pages stay connected.
            </p>

            <div className="space-y-6">
              {saasSections.map((section) => (
                <div key={section.id}>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">
                    {section.label}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {section.pages.map((sectionPage) => (
                      <Link
                        key={sectionPage.id}
                        href={sectionPage.href}
                        className={`rounded-lg border px-3 py-2 text-sm transition-colors ${sectionPage.id === page.id
                            ? "border-[#7C3AED]/40 bg-[#7C3AED]/10 text-[#9333EA]"
                            : "border-white/10 text-gray-300 hover:border-[#7C3AED]/40 hover:bg-indigo-500/5 hover:text-white"
                          }`}
                      >
                        <div className="font-medium text-white">{sectionPage.name}</div>
                        <div className="mt-1 text-xs font-mono text-gray-500">{sectionPage.href}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
