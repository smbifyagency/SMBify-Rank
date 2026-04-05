import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  LogOut,
  Globe,
  ChevronDown,
  LayoutDashboard,
  Globe2,
  Search,
  Settings,
  User,
  CreditCard,
  Key,
  Users,
  BarChart3,
  Plug,
  Paintbrush,
  Bell,
  Shield,
  FileText,
  Activity,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

export function Navigation() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = (user as any)?.role === "admin" || (user as any)?.id === "admin";
  const isOnDashboard = location.startsWith("/dashboard") || location.startsWith("/admin");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/");
    } catch (error) {
      console.error("Logout error:", error);
      setLocation("/");
    }
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const navLink = (href: string, label: string, onClick?: () => void) => (
    <Link href={href}>
      <button
        onClick={() => {
          setActiveDropdown(null);
          setMobileMenuOpen(false);
          onClick?.();
        }}
        className={`text-sm px-3 py-2 rounded-lg transition-colors ${location === href
          ? "text-white bg-white/10"
          : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
      >
        {label}
      </button>
    </Link>
  );

  // ===== PUBLIC NAVIGATION (for non-dashboard pages) =====
  const renderPublicNav = () => (
    <>
      {navLink("/features", "Features")}
      {navLink("/pricing", "Pricing")}
      {navLink("/demo", "Demo")}
      {navLink("/blog", "Blog")}
      {navLink("/about", "About")}
      {navLink("/contact", "Contact")}
    </>
  );

  // ===== DASHBOARD NAVIGATION (for logged-in users on dashboard) =====
  const renderDashboardNav = () => (
    <>
      {navLink("/dashboard", "Dashboard")}
      {navLink("/dashboard/websites", "Websites")}

      {/* Settings Dropdown */}
      <div className="relative">
        <button
          onClick={() => toggleDropdown("settings")}
          className={`text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-1 ${location.startsWith("/dashboard/settings")
            ? "text-white bg-white/10"
            : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
        >
          Settings <ChevronDown className={`h-3 w-3 transition-transform ${activeDropdown === "settings" ? "rotate-180" : ""}`} />
        </button>
        {activeDropdown === "settings" && (
          <div className="absolute top-full right-0 mt-2 w-52 bg-gray-900 border border-white/10 rounded-xl shadow-xl shadow-black/30 p-2 z-50">
            {[
              { href: "/dashboard/settings/profile", label: "Profile", icon: User },
              { href: "/dashboard/settings/api-keys", label: "API Keys", icon: Key },
              { href: "/dashboard/settings/billing", label: "Billing", icon: CreditCard },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    onClick={() => { setActiveDropdown(null); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${location === item.href ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    <Icon className="h-4 w-4" /> {item.label}
                  </button>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Admin Dropdown (only for admin users) */}
      {isAdmin && (
        <div className="relative">
          <button
            onClick={() => toggleDropdown("admin")}
            className={`text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-1 ${location.startsWith("/admin")
              ? "text-white bg-white/10"
              : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
          >
            Admin <ChevronDown className={`h-3 w-3 transition-transform ${activeDropdown === "admin" ? "rotate-180" : ""}`} />
          </button>
          {activeDropdown === "admin" && (
            <div className="absolute top-full right-0 mt-2 w-52 bg-gray-900 border border-white/10 rounded-xl shadow-xl shadow-black/30 p-2 z-50">
              {[
                { href: "/admin", label: "Admin Dashboard", icon: LayoutDashboard },
                { href: "/admin/users", label: "Users", icon: Users },
                { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
                { href: "/admin/prompts", label: "Prompts", icon: FileText },
                { href: "/admin/logs", label: "Gen Logs", icon: Activity },
                { href: "/admin/settings", label: "System Settings", icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <button
                      onClick={() => { setActiveDropdown(null); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${location === item.href ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      <Icon className="h-4 w-4" /> {item.label}
                    </button>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );

  // ===== MOBILE MENU ITEMS =====
  const mobilePublicItems = [
    { path: "/", label: "Home" },
    { path: "/features", label: "Features" },
    { path: "/pricing", label: "Pricing" },
    { path: "/demo", label: "Demo" },
    { path: "/blog", label: "Blog" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
    { path: "/affiliates", label: "Affiliates" },
  ];

  const mobileDashboardItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/dashboard/websites", label: "Websites" },
    { path: "/dashboard/exports", label: "Exports" },
    { path: "/dashboard/settings/profile", label: "Profile" },
    { path: "/dashboard/settings/api-keys", label: "API Keys" },
    { path: "/dashboard/settings/billing", label: "Billing" },
    { path: "/dashboard/settings/team", label: "Team" },
    { path: "/dashboard/settings/notifications", label: "Notifications" },
  ];

  const mobileAdminItems = [
    { path: "/admin", label: "Admin Dashboard" },
    { path: "/admin/users", label: "Users" },
    { path: "/admin/subscriptions", label: "Subscriptions" },
    { path: "/admin/prompts", label: "Prompts" },
    { path: "/admin/logs", label: "Gen Logs" },
    { path: "/admin/settings", label: "System Settings" },
  ];

  const mobileItems = isOnDashboard
    ? [...mobileDashboardItems, ...(isAdmin ? mobileAdminItems : [])]
    : mobilePublicItems;

  return (
    <nav className="bg-gray-950/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/home">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 border border-purple-500/30 flex items-center justify-center shadow-lg group-hover:border-amber-400/40 transition-all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8M12 17v4M7 4h10l-1 9H8L7 4z" /><path d="M12 4c0-1.5-1-2-2-2s-2 .5-2 2" opacity="0.7" /></svg>
                </div>
                <h1 className="text-lg font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">Site</span><span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">Genie</span>
                </h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {isOnDashboard && isAuthenticated ? renderDashboardNav() : renderPublicNav()}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {!isOnDashboard && (
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/5">
                      <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                    </Button>
                  </Link>
                )}
                {isOnDashboard && (
                  <Link href="/home">
                    <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/5">
                      <Globe className="h-4 w-4 mr-2" /> Home
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  data-testid="button-logout-desktop"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/5">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-[#7C3AED] hover:bg-[#9333EA] text-black font-semibold shadow-lg shadow-[#7C3AED]/25">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-white/5"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-6 space-y-1 border-t border-white/10">
              {mobileItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <button
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${location === item.path
                      ? "bg-[#7C3AED]/10 text-[#7C3AED]"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </button>
                </Link>
              ))}

              <div className="h-px bg-white/10 my-3" />

              {isAuthenticated ? (
                <>
                  {!isOnDashboard && (
                    <Link href="/dashboard">
                      <button onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-[#7C3AED] hover:bg-[#7C3AED]/10">
                        <LayoutDashboard className="h-4 w-4 inline mr-2" /> Dashboard
                      </button>
                    </Link>
                  )}
                  {isOnDashboard && (
                    <Link href="/home">
                      <button onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5">
                        <Globe className="h-4 w-4 inline mr-2" /> Home
                      </button>
                    </Link>
                  )}
                  <button
                    className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 inline mr-2" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <button onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5">
                      Login
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center mt-2 px-4 py-3 rounded-xl text-sm font-semibold bg-[#7C3AED] hover:bg-[#9333EA] text-black">
                      Get Started Free
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
