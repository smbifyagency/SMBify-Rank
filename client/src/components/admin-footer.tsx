import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  Hammer,
  BarChart3,
  Settings,
  Users,
  Globe,
  Shield
} from "lucide-react";

export function AdminFooter() {
  const { user } = useAuth();

  // Only show for admin users
  const isAdmin = (user as any)?.id === "admin" || (user as any)?.role === "admin";

  if (!isAdmin) {
    return null;
  }

  const adminLinks = [
    { path: "/", label: "Homepage", icon: Home },
    { path: "/dashboard/websites", label: "Website Builder", icon: Hammer },
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/api-setup", label: "API Setup", icon: Settings },
    { path: "/users", label: "User Management", icon: Users },
    { path: "/site-settings", label: "Site Settings", icon: Globe },
  ];

  return (
    <footer className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white border-t-4 border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Badge */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-full font-bold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Control Panel
          </div>
        </div>

        {/* Quick Access Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.path} href={link.path}>
                <div
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center transition-all hover:scale-105 cursor-pointer group"
                  data-testid={`admin-footer-link-${link.path.replace('/', '') || 'home'}`}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2 group-hover:text-yellow-400 transition-colors" />
                  <p className="text-sm font-medium">{link.label}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="border-t border-white/20 pt-6 text-center">
          <p className="text-white/80 text-sm">
            Admin access to all pages and settings • Logged in as: <span className="text-yellow-400 font-semibold">{(user as any)?.email || 'Administrator'}</span>
          </p>
          <p className="text-white/60 text-xs mt-2">
            SiteGenie AI Static Website Builder - Manage users, configure site settings, and monitor all websites
          </p>
        </div>
      </div>
    </footer>
  );
}
