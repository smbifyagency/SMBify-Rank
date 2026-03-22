export interface SaasPage {
  id: string;
  name: string;
  section: string;
  description: string;
  routePath: string;
  href: string;
}

export interface SaasSection {
  id: string;
  label: string;
  pages: SaasPage[];
}

const page = (
  id: string,
  name: string,
  section: string,
  description: string,
  routePath: string,
  href?: string,
): SaasPage => ({
  id,
  name,
  section,
  description,
  routePath,
  href: href || routePath,
});

export const saasSections: SaasSection[] = [
  {
    id: "public",
    label: "Public Pages",
    pages: [
      page("landing", "Landing Page", "Public Pages", "Main marketing homepage", "/"),
      page("pricing", "Pricing", "Public Pages", "Plans, FAQ, and billing CTA", "/pricing"),
      page("features", "Features", "Public Pages", "Deep-dive product features", "/features"),
      page("blog", "Blog", "Public Pages", "SEO blog listing", "/blog"),
      page(
        "blog-detail",
        "Blog Article",
        "Public Pages",
        "Individual blog article page",
        "/blog/:slug",
        "/blog/sample-seo-article",
      ),
      page("demo", "Demo", "Public Pages", "Live preview demo", "/demo"),
      page("about", "About", "Public Pages", "Company story and mission", "/about"),
      page("contact", "Contact", "Public Pages", "Contact and support form", "/contact"),
      page("affiliates", "Affiliate Program", "Public Pages", "Referral partner page", "/affiliates"),
    ],
  },
  {
    id: "auth",
    label: "Auth Pages",
    pages: [
      page("signup", "Signup", "Auth Pages", "Create an account", "/signup"),
      page("login", "Login", "Auth Pages", "Sign in page", "/login"),
      page("forgot-password", "Forgot Password", "Auth Pages", "Password reset request", "/forgot-password"),
      page(
        "reset-password",
        "Reset Password",
        "Auth Pages",
        "Reset password form",
        "/reset-password/:token",
        "/reset-password/demo-token",
      ),
      page(
        "verify-email",
        "Verify Email",
        "Auth Pages",
        "Email verification page",
        "/verify-email/:token",
        "/verify-email/demo-token",
      ),
      page(
        "accept-invite",
        "Accept Invite",
        "Auth Pages",
        "Team invite acceptance page",
        "/invite/:token",
        "/invite/demo-token",
      ),
    ],
  },

  {
    id: "dashboard",
    label: "Main Dashboard",
    pages: [
      page("dashboard-home", "Dashboard Home", "Main Dashboard", "Overview and quick actions", "/dashboard"),
      page("dashboard-websites", "All Websites", "Main Dashboard", "List all generated websites", "/dashboard/websites"),
      page(
        "dashboard-website-detail",
        "Website Editor",
        "Main Dashboard",
        "Edit one website project",
        "/dashboard/websites/:id",
        "/dashboard/websites/demo-site",
      ),
      page(
        "dashboard-page-editor",
        "Page Content Editor",
        "Main Dashboard",
        "Edit a single website page",
        "/dashboard/websites/:id/pages/:pageId",
        "/dashboard/websites/demo-site/pages/home",
      ),
    ],
  },
  {
    id: "seo",
    label: "SEO Tools",
    pages: [
      page("seo-overview", "SEO Overview", "SEO Tools", "SEO health and opportunities", "/dashboard/seo"),
      page("seo-keywords", "Keyword Tracker", "SEO Tools", "Keyword coverage tracker", "/dashboard/seo/keywords"),
      page("seo-links", "Internal Links Map", "SEO Tools", "Internal link graph and issues", "/dashboard/seo/links"),
      page("seo-schema", "Schema Manager", "SEO Tools", "Structured data manager", "/dashboard/seo/schema"),
      page("seo-sitemap", "Sitemap & Robots", "SEO Tools", "Sitemap and robots tools", "/dashboard/seo/sitemap"),
    ],
  },
  {
    id: "publish",
    label: "Publish & Export",
    pages: [
      page(
        "publish-settings",
        "Publish Settings",
        "Publish & Export",
        "Deploy and publish controls",
        "/dashboard/websites/:id/publish",
        "/dashboard/websites/demo-site/publish",
      ),
      page("domain-manager", "Domain Manager", "Publish & Export", "Custom domain management", "/dashboard/domains"),
      page("export-history", "Export History", "Publish & Export", "Past exports and downloads", "/dashboard/exports"),
    ],
  },
  {
    id: "account",
    label: "Account & Settings",
    pages: [
      page("settings-profile", "Profile", "Account & Settings", "Profile management", "/dashboard/settings/profile"),
      page("settings-api-keys", "API Keys Setup", "Account & Settings", "API and integration keys", "/dashboard/settings/api-keys"),
      page("settings-billing", "Billing & Subscription", "Account & Settings", "Billing and plan management", "/dashboard/settings/billing"),
      page("settings-usage", "Usage & Limits", "Account & Settings", "Usage and limit tracking", "/dashboard/settings/usage"),
      page("settings-team", "Team Members", "Account & Settings", "Team invites and roles", "/dashboard/settings/team"),
      page("settings-notifications", "Notifications", "Account & Settings", "Notification preferences", "/dashboard/settings/notifications"),
      page("settings-integrations", "Integrations", "Account & Settings", "Third-party integrations", "/dashboard/settings/integrations"),
      page(
        "settings-white-label",
        "White Label Settings",
        "Account & Settings",
        "Branding and client portal settings",
        "/dashboard/settings/white-label",
      ),
    ],
  },
  {
    id: "admin",
    label: "Admin Panel",
    pages: [
      page("admin-home", "Admin Dashboard", "Admin Panel", "Platform-wide metrics", "/admin"),
      page("admin-users", "User Management", "Admin Panel", "Manage platform users", "/admin/users"),
      page("admin-subscriptions", "Subscription Management", "Admin Panel", "Plan and subscription control", "/admin/subscriptions"),
      page("admin-prompts", "Prompt Manager", "Admin Panel", "Manage AI prompt templates", "/admin/prompts"),
      page("admin-logs", "Generation Logs", "Admin Panel", "AI generation logs", "/admin/logs"),
      page("admin-settings", "System Settings", "Admin Panel", "Global platform settings", "/admin/settings"),
    ],
  },
  {
    id: "system",
    label: "System Pages",
    pages: [
      page("system-404", "404 Not Found", "System Pages", "Not found page", "/404"),
      page("system-500", "500 Server Error", "System Pages", "Server error page", "/500"),
      page("system-maintenance", "Maintenance", "System Pages", "Maintenance mode page", "/maintenance"),
      page("system-upgrade", "Upgrade Required", "System Pages", "Plan upgrade prompt", "/upgrade"),
    ],
  },
];

export const allSaasPages: SaasPage[] = saasSections.flatMap((section) => section.pages);

const routesHandledElsewhere = new Set<string>([
  "/",
  "/dashboard/websites",
  "/login",
  "/site-settings",
  "/api-setup",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/sitemap",
]);

export const saasScaffoldPages: SaasPage[] = allSaasPages
  .filter((pageDef) => !routesHandledElsewhere.has(pageDef.routePath))
  .sort((a, b) => {
    const aDynamicCount = (a.routePath.match(/:/g) || []).length;
    const bDynamicCount = (b.routePath.match(/:/g) || []).length;

    if (aDynamicCount !== bDynamicCount) {
      return aDynamicCount - bDynamicCount;
    }

    return b.routePath.length - a.routePath.length;
  });
