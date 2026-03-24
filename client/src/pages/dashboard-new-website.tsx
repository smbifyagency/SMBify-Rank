import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { useState } from "react";
import {
  ArrowRight, ArrowLeft, Droplets, Loader2, CheckCircle2,
  Phone, MapPin, Wrench, Globe, Palette, ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STEPS = ["Business Info", "Services & Areas", "Brand & Domain", "Generate"];

const DEFAULT_SERVICES = [
  "Water Damage Restoration",
  "Residential Water Damage Restoration",
  "Commercial Water Damage Restoration",
  "Emergency Water Extraction",
  "Flood Cleanup & Flood Damage Repair",
  "Commercial Flood Extraction",
  "Basement Flooding Cleanup",
  "Burst Pipe Repair & Cleanup",
  "Appliance Leak Water Damage",
  "Roof Leak Water Damage Repair",
  "Ceiling & Wall Water Damage Repair",
  "Hardwood Floor Water Damage Repair",
  "Drywall Water Damage Repair",
  "Carpet Water Damage & Drying",
  "Mold Remediation & Mold Removal",
  "Sewage Backup Cleanup",
  "Biohazard & Trauma Cleanup",
  "Storm Damage Restoration",
  "Structural Drying & Dehumidification",
  "Fire & Smoke Damage Restoration",
  "Crawl Space Water Damage",
  "Document Drying & Recovery",
  "HVAC Water Damage & Cleaning",
  "24/7 Emergency Response",
  "Insurance Claim Assistance",
  "Odor Removal & Deodorization",
  "Content Pack-Out & Storage",
];

export default function DashboardNewWebsite() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const [form, setForm] = useState({
    businessName: "",
    countryCode: "+1",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    primaryKeyword: "Water Damage Restoration",
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

  const fillSampleData = () => {
    setForm({
      businessName: "Rapid Dry Restoration",
      countryCode: "+1",
      phone: "(512) 555-8900",
      email: "info@rapiddryrestoration.com",
      address: "1234 Flood Relief Dr",
      city: "Austin",
      state: "TX",
      primaryKeyword: "Water Damage Restoration Austin TX",
      targetKeywords: "flood cleanup austin, mold remediation austin, burst pipe repair austin, emergency water removal",
      services: [
        "Water Damage Restoration",
        "Residential Water Damage Restoration",
        "Emergency Water Extraction",
        "Flood Cleanup & Flood Damage Repair",
        "Mold Remediation & Mold Removal",
        "Structural Drying & Dehumidification",
        "Sewage Backup Cleanup",
        "24/7 Emergency Response",
        "Insurance Claim Assistance",
      ],
      serviceAreas: "Austin, TX\nRound Rock, TX\nCedar Park, TX\nGeorgetown, TX\nPflugerville, TX\nKyle, TX\nBuda, TX",
      urlSlug: "rapid-dry-restoration",
      primaryColor: "#1e3a5f",
      secondaryColor: "#0ea5e9",
      accentColor: "#dc2626",
      openaiApiKey: "",
      geminiApiKey: "",
    });
    setStep(0);
  };

  const toggleService = (s: string) => {
    set("services", form.services.includes(s)
      ? form.services.filter(x => x !== s)
      : [...form.services, s]);
  };

  const autoSlug = () => {
    if (!form.urlSlug && form.businessName) {
      set("urlSlug", form.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  };

  const canNext = () => {
    if (step === 0) return form.businessName.trim() && form.phone.trim() && form.city.trim() && form.state.trim();
    if (step === 1) return form.services.length > 0 && form.serviceAreas.trim();
    if (step === 2) return true; // urlSlug is optional, auto-generated on submit
    return true;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const servicesList = form.services;
      const areasList = form.serviceAreas.split(/[\n;]+/).map(s => s.trim()).filter(Boolean);

      const invalidAreas = areasList.filter(a => !a.includes(','));
      if (invalidAreas.length > 0) {
        toast({ title: "State Required", description: `Please include the state abbreviation for all cities (e.g., "Austin, TX"). Invalid entries: ${invalidAreas.join(', ')}`, variant: "destructive" });
        setIsGenerating(false);
        return;
      }

      const slug = form.urlSlug || form.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

      // First create a DB record
      const createRes = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.businessName,
          template: "water-damage",
          businessData: { ...form, urlSlug: slug, services: servicesList, serviceAreas: areasList }
        })
      });
      const created = await createRes.json();
      if (!createRes.ok) throw new Error(created.message || "Failed to create");

      // Save API keys globally so they persist across sessions
      if (form.openaiApiKey) {
        fetch("/api/settings/openai", {
          method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
          body: JSON.stringify({ apiKey: form.openaiApiKey, isActive: true })
        }).catch(() => {});
      }
      if (form.geminiApiKey) {
        fetch("/api/settings/gemini", {
          method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
          body: JSON.stringify({ apiKey: form.geminiApiKey, isActive: true })
        }).catch(() => {});
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
            <h1 className="text-2xl font-bold text-white">Create Water Damage Website</h1>
            <p className="text-sm text-gray-400">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
          </div>
          <button onClick={fillSampleData}
            className="text-xs px-3 py-1.5 rounded-lg border border-[#AADD00]/30 text-[#AADD00] bg-[#AADD00]/5 hover:bg-[#AADD00]/15 transition-all whitespace-nowrap">
            ⚡ Fill Sample Data
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-1.5 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? "bg-[#AADD00]" : "bg-white/10"}`} />
          ))}
        </div>

        {/* Step 0 — Business Info */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#AADD00]/10 border border-[#AADD00]/20 mb-6">
              <Droplets className="h-5 w-5 text-[#AADD00] shrink-0" />
              <p className="text-sm text-gray-300">
                This creates a <span className="text-[#AADD00] font-medium">Water Damage Restoration</span> website — fully SEO-optimized with service pages, location pages, FAQ, calculator, and more.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">Business Name *</Label>
                <Input value={form.businessName} onChange={e => set("businessName", e.target.value)}
                  placeholder="e.g., Rapid Dry Water Restoration"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#AADD00]/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> Phone *
                  </Label>
                  <div className="flex gap-2">
                    <select
                      value={form.countryCode || "+1"}
                      onChange={e => set("countryCode", e.target.value)}
                      className="w-[100px] h-[40px] px-2 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:border-[#AADD00]/50 outline-none"
                    >
                      <option value="+1" className="bg-gray-900 text-white">🇺🇸/🇨🇦 +1</option>
                      <option value="+44" className="bg-gray-900 text-white">🇬🇧 +44</option>
                      <option value="+61" className="bg-gray-900 text-white">🇦🇺 +61</option>
                      <option value="+64" className="bg-gray-900 text-white">🇳🇿 +64</option>
                      <option value="+27" className="bg-gray-900 text-white">🇿🇦 +27</option>
                      <option value="+91" className="bg-gray-900 text-white">🇮🇳 +91</option>
                    </select>
                    <Input value={form.phone} onChange={e => set("phone", e.target.value)}
                      placeholder="(555) 123-4567"
                      className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#AADD00]/50" />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">Email</Label>
                  <Input value={form.email} onChange={e => set("email", e.target.value)}
                    placeholder="info@business.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#AADD00]/50" />
                </div>
              </div>
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Street Address
                </Label>
                <Input value={form.address} onChange={e => set("address", e.target.value)}
                  placeholder="123 Main St"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#AADD00]/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">City *</Label>
                  <Input value={form.city} onChange={e => set("city", e.target.value)}
                    placeholder="Austin"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#AADD00]/50" />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm mb-1.5 block">State *</Label>
                  <Input value={form.state} onChange={e => set("state", e.target.value)}
                    placeholder="TX"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#AADD00]/50" />
                </div>
              </div>
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">Primary Keyword *</Label>
                <Input value={form.primaryKeyword} onChange={e => set("primaryKeyword", e.target.value)}
                  placeholder="Water Damage Restoration"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#AADD00]/50" />
                <p className="text-xs text-gray-500 mt-1">Main keyword all content will be optimized around</p>
              </div>
              <div>
                <Label className="text-gray-300 text-sm mb-1.5 block">Additional Target Keywords</Label>
                <Input value={form.targetKeywords} onChange={e => set("targetKeywords", e.target.value)}
                  placeholder="flood cleanup, mold remediation, burst pipe repair"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#AADD00]/50" />
                <p className="text-xs text-gray-500 mt-1">Comma-separated. Used for SEO meta tags and content variation</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 1 — Services & Areas */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label className="text-gray-300 text-sm mb-3 flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5 text-[#AADD00]" /> Select Services * ({form.services.length} selected)
              </Label>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_SERVICES.map(s => (
                  <button key={s} onClick={() => toggleService(s)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all border ${
                      form.services.includes(s)
                        ? "bg-[#AADD00]/15 text-[#AADD00] border-[#AADD00]/40"
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
                <MapPin className="h-3.5 w-3.5 text-[#AADD00]" /> Service Areas * (one per line)
              </Label>
              <Textarea value={form.serviceAreas} onChange={e => set("serviceAreas", e.target.value)}
                placeholder={"Austin, TX\nRound Rock, TX\nCedar Park, TX\nGeorgetown, TX\nPflugerville, TX"}
                rows={5}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#AADD00]/50 resize-none" />
              <p className="text-xs text-gray-500 mt-1">Each city gets its own SEO-optimized location page. <strong className="text-[#AADD00]">Format: City, State (e.g., Austin, TX)</strong></p>
            </div>
          </div>
        )}

        {/* Step 2 — Brand Colors */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#AADD00]/10 border border-[#AADD00]/20">
              <Palette className="h-5 w-5 text-[#AADD00] shrink-0" />
              <p className="text-sm text-gray-300">Pick your brand colors. You can always change these later in the editor.</p>
            </div>

            <div>
              <Label className="text-gray-300 text-sm mb-3 flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-[#AADD00]" /> Brand Colors
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Primary", key: "primaryColor", hint: "Header, buttons, headings" },
                  { label: "Secondary", key: "secondaryColor", hint: "Links & accents" },
                  { label: "Accent", key: "accentColor", hint: "Emergency CTA" },
                ].map(({ label, key, hint }) => (
                  <div key={key} className="flex flex-col items-center gap-2">
                    <div className="relative w-full h-14 rounded-lg border border-white/10 overflow-hidden cursor-pointer"
                      style={{ backgroundColor: (form as any)[key] }}>
                      <input type="color" value={(form as any)[key]}
                        onChange={e => set(key, e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-300 font-medium">{label}</p>
                      <p className="text-xs text-gray-600">{hint}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center">
              <p className="text-sm text-gray-400">✓ AI keys, domain name, social links — all configurable in the editor after creation</p>
            </div>
          </div>
        )}

        {/* Step 3 — Review & Generate */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
              <h3 className="text-white font-semibold">Review Your Website</h3>
              {[
                { label: "Business", value: form.businessName },
                { label: "Location", value: `${form.city}, ${form.state}` },
                { label: "Phone", value: form.phone },
                { label: "Primary Keyword", value: form.primaryKeyword },
                { label: "Services", value: `${form.services.length} services selected` },
                { label: "Areas", value: `${form.serviceAreas.split("\n").filter(Boolean).length} cities (= location pages)` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-white font-medium">{value}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-[#AADD00]/10 border border-[#AADD00]/20">
              <p className="text-sm text-[#AADD00] font-medium mb-1">What gets generated:</p>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>✓ Homepage + About, Contact, FAQ, Calculator, Gallery pages</li>
                <li>✓ {form.services.length} Service pages</li>
                <li>✓ {form.serviceAreas.split("\n").filter(Boolean).length} Location pages</li>
                <li>✓ Sitemap, robots.txt, _headers</li>
              </ul>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 gap-4">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(s => s - 1)}
              className="border-white/20 text-gray-300 bg-transparent hover:bg-white/5 flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
              className="flex-1 bg-[#AADD00] hover:bg-[#bef000] text-black font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleGenerate} disabled={isGenerating || !canNext()}
              className="flex-1 bg-[#AADD00] hover:bg-[#bef000] text-black font-bold py-3">
              {isGenerating
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Website...</>
                : <><Droplets className="mr-2 h-4 w-4" /> Create Website <ArrowRight className="ml-1 h-4 w-4" /></>
              }
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
