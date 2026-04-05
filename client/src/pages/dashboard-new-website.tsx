import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { useState, useRef } from "react";
import {
  ArrowRight, ArrowLeft, Loader2, CheckCircle2,
  Phone, MapPin, Wrench, Palette, ChevronRight, Upload, X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES } from "@/lib/local-service-categories";

const COLOR_PALETTES = [
  { name: "Ocean Blue",   primary: "#1e3a5f", secondary: "#0ea5e9" },
  { name: "Forest Green", primary: "#14532d", secondary: "#22c55e" },
  { name: "Sunset Fire",  primary: "#7c2d12", secondary: "#f97316" },
  { name: "Royal Purple", primary: "#3b0764", secondary: "#a855f7" },
  { name: "Navy Elite",   primary: "#172554", secondary: "#3b82f6" },
  { name: "Cherry Red",   primary: "#7f1d1d", secondary: "#ef4444" },
  { name: "Teal Modern",  primary: "#134e4a", secondary: "#14b8a6" },
  { name: "Golden Pro",   primary: "#713f12", secondary: "#eab308" },
  { name: "Rose Pink",    primary: "#881337", secondary: "#f43f5e" },
  { name: "Emerald",      primary: "#064e3b", secondary: "#059669" },
  { name: "Slate Gray",   primary: "#1e293b", secondary: "#64748b" },
  { name: "Copper",       primary: "#431407", secondary: "#c2410c" },
  { name: "Indigo",       primary: "#1e1b4b", secondary: "#6366f1" },
  { name: "Cyan Fresh",   primary: "#083344", secondary: "#06b6d4" },
  { name: "Midnight",     primary: "#0f172a", secondary: "#475569" },
  { name: "Charcoal",     primary: "#111827", secondary: "#9ca3af" },
] as const;

const STEPS = ["Category", "Business Info", "Services & Areas", "Brand & Colors", "Review & Create"];

export default function DashboardNewWebsite() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    businessName: "",
    logoUrl: "",
    countryCode: "+1",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    primaryKeyword: "",
    targetKeywords: "",
    services: [] as string[],
    serviceAreas: "",
    urlSlug: "",
    primaryColor: "#1e3a5f",
    secondaryColor: "#0ea5e9",
    accentColor: "#dc2626",
    openaiApiKey: "",
    geminiApiKey: "",
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  // When user picks a category, pre-fill keyword + services + palette
  const pickCategory = (id: string) => {
    const cat = CATEGORIES.find(c => c.id === id);
    if (!cat) return;
    setCategoryId(id);
    setForm(f => ({
      ...f,
      primaryKeyword: cat.defaultPrimaryKeyword,
      primaryColor: cat.defaultPalette.primary,
      secondaryColor: cat.defaultPalette.secondary,
      services: cat.defaultServices.slice(0, 10) as any,
    }));
    setStep(1);
  };

  const toggleService = (s: string) =>
    set("services", form.services.includes(s)
      ? form.services.filter(x => x !== s)
      : [...form.services, s]);

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => set("logoUrl", e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const canNext = () => {
    if (step === 0) return !!categoryId;
    if (step === 1) return form.businessName.trim() && form.phone.trim() && form.city.trim() && form.state.trim();
    if (step === 2) return form.services.length > 0 && form.serviceAreas.trim();
    return true;
  };

  const selectedCategory = CATEGORIES.find(c => c.id === categoryId);

  const fillSampleData = () => {
    const cat = selectedCategory;
    if (!cat) return;
    const bizName = `Austin ${cat.name}`;
    const slug = bizName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setForm(f => ({
      ...f,
      businessName: bizName,
      phone: '(512) 555-0182',
      email: `info@${slug}.com`,
      address: '4821 Oak Hollow Drive',
      city: 'Austin',
      state: 'TX',
      primaryKeyword: cat.defaultPrimaryKeyword,
      targetKeywords: cat.defaultServices.slice(0, 4).join(', '),
      services: cat.defaultServices.slice(0, 8),
      serviceAreas: 'Austin, TX\nRound Rock, TX\nCedar Park, TX\nGeorgetown, TX\nPflugerville, TX',
      urlSlug: slug,
      primaryColor: cat.defaultPalette.primary,
      secondaryColor: cat.defaultPalette.secondary,
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const servicesList = form.services;
      const areasList = form.serviceAreas.split(/[\n;]+/).map(s => s.trim()).filter(Boolean);

      const invalidAreas = areasList.filter(a => !a.includes(','));
      if (invalidAreas.length > 0) {
        toast({ title: "State Required", description: `Include state for all cities (e.g. "Austin, TX"). Invalid: ${invalidAreas.join(', ')}`, variant: "destructive" });
        setIsGenerating(false);
        return;
      }

      const slug = form.urlSlug || form.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

      const createRes = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.businessName,
          template: categoryId || "water-damage",
          businessData: { ...form, urlSlug: slug, services: servicesList, serviceAreas: areasList, categoryId }
        })
      });
      const created = await createRes.json();
      if (!createRes.ok) throw new Error(created.message || "Failed to create");

      if (form.openaiApiKey) {
        fetch("/api/settings/openai", { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ apiKey: form.openaiApiKey, isActive: true }) }).catch(() => {});
      }
      if (form.geminiApiKey) {
        fetch("/api/settings/gemini", { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ apiKey: form.geminiApiKey, isActive: true }) }).catch(() => {});
      }

      toast({ title: "Website Created!", description: "Opening the editor..." });
      setLocation(`/dashboard/wd-editor/${created.id}`);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => step > 0 ? setStep(s => s - 1) : setLocation("/dashboard")}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">
              {step === 0 ? "Create New Website" : `${selectedCategory?.name || "Local Service"} Website`}
            </h1>
            <p className="text-sm text-gray-400">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-1.5 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? "bg-[#7C3AED]" : "bg-white/10"}`} />
          ))}
        </div>

        {/* ── Step 0: Category Picker ────────────────────────────────── */}
        {step === 0 && (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">Choose the type of local service business. Each category comes with pre-built services, SEO content, and a cost calculator.</p>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => pickCategory(cat.id)}
                  className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/5 transition-all text-left group">
                  <span className="text-2xl flex-shrink-0">{cat.icon}</span>
                  <div>
                    <p className="text-white font-semibold text-sm group-hover:text-[#7C3AED] transition-colors">{cat.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{cat.tagline}</p>
                    {cat.isEmergency && (
                      <span className="inline-block mt-1.5 text-[9px] px-1.5 py-0.5 rounded bg-red-900/40 text-red-400 border border-red-800/40">24/7 Emergency</span>
                    )}
                  </div>
                </button>
              ))}
              {/* Coming soon placeholder */}
              <div className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.01] text-left opacity-40 cursor-not-allowed">
                <span className="text-2xl">🔜</span>
                <div>
                  <p className="text-gray-400 font-semibold text-sm">More Coming Soon</p>
                  <p className="text-gray-600 text-xs mt-0.5">HVAC, Roofing, Electrical…</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 1: Business Info + Logo ─────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5">
            {/* Sample data button for quick testing */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={fillSampleData}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10 transition-colors"
              >
                Fill sample data
              </button>
            </div>

            {/* Logo upload */}
            <div>
              <Label className="text-gray-300 text-sm mb-2 block">Business Logo (optional)</Label>
              <div className="flex items-center gap-4">
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/5 flex items-center justify-center cursor-pointer transition-all flex-shrink-0 overflow-hidden"
                >
                  {form.logoUrl
                    ? <img src={form.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                    : <Upload className="h-6 w-6 text-gray-500" />
                  }
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">Upload your logo (PNG, SVG, JPG)</p>
                  <p className="text-xs text-gray-600 mt-0.5">Appears in the header and footer of every page</p>
                  {form.logoUrl && (
                    <button onClick={() => set("logoUrl", "")} className="mt-1.5 text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                      <X className="h-3 w-3" /> Remove logo
                    </button>
                  )}
                </div>
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { if (e.target.files?.[0]) handleLogoUpload(e.target.files[0]); e.target.value = ''; }} />
              </div>
            </div>

            <div>
              <Label className="text-gray-300 text-sm mb-1.5 block">Business Name *</Label>
              <Input value={form.businessName} onChange={e => set("businessName", e.target.value)}
                placeholder={`e.g., ${selectedCategory?.name === "Plumbing Services" ? "City Pro Plumbing" : "Rapid Dry Restoration"}`}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#7C3AED]/50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> Phone *
                </Label>
                <div className="flex gap-2">
                  <select value={form.countryCode} onChange={e => set("countryCode", e.target.value)}
                    className="w-[100px] h-[40px] px-2 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:border-[#7C3AED]/50 outline-none">
                    <option value="+1" className="bg-gray-900">🇺🇸/🇨🇦 +1</option>
                    <option value="+44" className="bg-gray-900">🇬🇧 +44</option>
                    <option value="+61" className="bg-gray-900">🇦🇺 +61</option>
                    <option value="+64" className="bg-gray-900">🇳🇿 +64</option>
                    <option value="+27" className="bg-gray-900">🇿🇦 +27</option>
                    <option value="+91" className="bg-gray-900">🇮🇳 +91</option>
                  </select>
                  <Input value={form.phone} onChange={e => set("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#7C3AED]/50" />
                </div>
              </div>
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">Email</Label>
                <Input value={form.email} onChange={e => set("email", e.target.value)}
                  placeholder="info@business.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#7C3AED]/50" />
              </div>
            </div>

            <div>
              <Label className="text-gray-300 text-sm mb-1.5 block flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Street Address
              </Label>
              <Input value={form.address} onChange={e => set("address", e.target.value)}
                placeholder="123 Main St"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#7C3AED]/50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">City *</Label>
                <Input value={form.city} onChange={e => set("city", e.target.value)}
                  placeholder="Austin"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#7C3AED]/50" />
              </div>
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">State *</Label>
                <Input value={form.state} onChange={e => set("state", e.target.value)}
                  placeholder="TX"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#7C3AED]/50" />
              </div>
            </div>

            <div>
              <Label className="text-gray-300 text-sm mb-1.5 block">Primary Keyword *</Label>
              <Input value={form.primaryKeyword} onChange={e => set("primaryKeyword", e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#7C3AED]/50" />
              <p className="text-xs text-gray-500 mt-1">Auto-filled from your category — change if needed</p>
            </div>

            <div>
              <Label className="text-gray-300 text-sm mb-1.5 block">Additional Target Keywords</Label>
              <Input value={form.targetKeywords} onChange={e => set("targetKeywords", e.target.value)}
                placeholder="e.g., drain cleaning, burst pipe repair, emergency plumber"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#7C3AED]/50" />
              <p className="text-xs text-gray-500 mt-1">Comma-separated. Used for SEO meta tags and content variation.</p>
            </div>
          </div>
        )}

        {/* ── Step 2: Services & Areas ──────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label className="text-gray-300 text-sm mb-3 flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5 text-[#7C3AED]" /> Select Services * ({form.services.length} selected)
              </Label>
              <div className="flex flex-wrap gap-2">
                {(selectedCategory?.defaultServices ?? []).map(s => (
                  <button key={s} onClick={() => toggleService(s)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all border ${
                      form.services.includes(s)
                        ? "bg-[#7C3AED]/15 text-[#7C3AED] border-[#7C3AED]/40"
                        : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
                    }`}>
                    {form.services.includes(s) && <CheckCircle2 className="inline h-3.5 w-3.5 mr-1" />}
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-gray-300 text-sm mb-1.5 block flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#7C3AED]" /> Service Areas * (one per line)
              </Label>
              <Textarea value={form.serviceAreas} onChange={e => set("serviceAreas", e.target.value)}
                placeholder={"Austin, TX\nRound Rock, TX\nCedar Park, TX\nGeorgetown, TX"}
                rows={5}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#7C3AED]/50 resize-none" />
              <p className="text-xs text-gray-500 mt-1">Each city gets its own SEO location page. <strong className="text-[#7C3AED]">Format: City, State</strong></p>
            </div>
          </div>
        )}

        {/* ── Step 3: Brand & Colors ────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20">
              <Palette className="h-5 w-5 text-[#7C3AED] shrink-0" />
              <p className="text-sm text-gray-300">Pick your color theme. You can change this anytime in the editor.</p>
            </div>

            <div>
              <Label className="text-gray-300 text-sm mb-3 flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-[#7C3AED]" /> Color Theme
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_PALETTES.map(palette => {
                  const isActive = form.primaryColor === palette.primary && form.secondaryColor === palette.secondary;
                  return (
                    <button key={palette.name} type="button"
                      onClick={() => { set("primaryColor", palette.primary); set("secondaryColor", palette.secondary); }}
                      className={`rounded-lg overflow-hidden text-left transition-transform hover:scale-105 focus:outline-none ${
                        isActive ? "ring-2 ring-[#7C3AED] ring-offset-1 ring-offset-gray-900 shadow-lg" : "ring-1 ring-white/10"
                      }`}>
                      <div className="flex h-8">
                        <div className="w-3/5" style={{ backgroundColor: palette.primary }} />
                        <div className="w-2/5" style={{ backgroundColor: palette.secondary }} />
                      </div>
                      <div className="bg-gray-800 px-1.5 py-1">
                        <span className="text-[10px] text-gray-300 leading-none block truncate">{palette.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label className="text-gray-300 text-sm mb-1.5 block">Site URL Slug</Label>
              <Input value={form.urlSlug} onChange={e => set("urlSlug", e.target.value)}
                placeholder="my-plumbing-company"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#7C3AED]/50" />
              <p className="text-xs text-gray-500 mt-1">Your Netlify URL will be: yourslug.netlify.app (auto-generated if left blank)</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center">
              <p className="text-sm text-gray-400">✓ AI keys, social links — all configurable in the editor after creation</p>
            </div>
          </div>
        )}

        {/* ── Step 4: Review & Generate ─────────────────────────────── */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
              <h3 className="text-white font-semibold">Review Your Website</h3>
              {[
                { label: "Category", value: selectedCategory?.name ?? "—" },
                { label: "Business", value: form.businessName },
                { label: "Location", value: `${form.city}, ${form.state}` },
                { label: "Phone", value: form.phone },
                { label: "Primary Keyword", value: form.primaryKeyword },
                { label: "Services", value: `${form.services.length} services selected` },
                { label: "Areas", value: `${form.serviceAreas.split("\n").filter(Boolean).length} location pages` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-white font-medium">{value}</span>
                </div>
              ))}
            </div>

            {form.logoUrl && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <img src={form.logoUrl} alt="Logo" className="h-10 w-10 object-contain rounded" />
                <p className="text-sm text-gray-300">Logo uploaded ✓</p>
              </div>
            )}

            <div className="p-4 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20">
              <p className="text-sm text-[#7C3AED] font-medium mb-1">What gets generated:</p>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>✓ Homepage + About, Contact, FAQ, Calculator, Gallery pages</li>
                <li>✓ {form.services.length} Service pages (one per service)</li>
                <li>✓ {form.serviceAreas.split("\n").filter(Boolean).length} Location pages (one per city)</li>
                <li>✓ Sitemap, robots.txt, schema markup</li>
              </ul>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 gap-4">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(s => s - 1)}
              className="border-white/20 text-gray-300 bg-transparent hover:bg-white/5 flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            step > 0 && (
              <Button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                className="flex-1 bg-[#7C3AED] hover:bg-[#9333EA] text-black font-semibold disabled:opacity-40">
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )
          ) : (
            <Button onClick={handleGenerate} disabled={isGenerating || !canNext()}
              className="flex-1 bg-[#7C3AED] hover:bg-[#9333EA] text-black font-bold py-3">
              {isGenerating
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Website...</>
                : <>Create Website <ArrowRight className="ml-1 h-4 w-4" /></>
              }
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
