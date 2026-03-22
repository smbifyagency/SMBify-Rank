/**
 * Water Damage Site Editor
 * Post-generation editor: edit content, replace placeholder images, deploy to Netlify.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useRoute, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, Save, Rocket, Image as ImageIcon, RefreshCw,
  Loader2, ExternalLink, CheckCircle2, ChevronDown, ChevronUp,
  Globe, Phone, MapPin, FileText, Layers
} from "lucide-react";

interface WDSiteData {
  id?: string;
  businessName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  primaryKeyword: string;
  services: string[];
  serviceAreas: string[];
  urlSlug: string;
  primaryColor: string;
  secondaryColor: string;
  contactFormEmbed?: string;
  // AI Content
  homepageContent?: any;
  serviceContent?: Record<string, any>;
  locationContent?: Record<string, any>;
  // Deployment
  netlifyUrl?: string;
  netlifyApiKey?: string;
  deploymentStatus?: string;
}

interface ImageEntry {
  placeholder: string;   // data-placeholder attribute value
  currentSrc: string;
  newFile?: File;
  newSrc?: string;
  altText: string;
  label: string;
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function WDSiteEditor() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/dashboard/wd-editor/:id");
  const websiteId = match ? params?.id : null;
  const { toast } = useToast();

  const [siteData, setSiteData] = useState<WDSiteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("business");
  const [previewPage, setPreviewPage] = useState("index.html");
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string>>({});
  const [netlifyToken, setNetlifyToken] = useState("");
  const [deployedUrl, setDeployedUrl] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Images that need replacing
  const [images, setImages] = useState<ImageEntry[]>([
    { placeholder: "main-image", currentSrc: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80", altText: "", label: "Main Team/Work Photo" },
  ]);

  // ── Load website data ─────────────────────────────────────────────────

  useEffect(() => {
    if (!websiteId) {
      setIsLoading(false);
      return;
    }
    loadWebsite();
  }, [websiteId]);

  async function loadWebsite() {
    try {
      const res = await fetch(`/api/websites/${websiteId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load website");
      const data = await res.json();

      const bd = data.businessData || {};
      setSiteData({
        id: data.id,
        businessName: bd.businessName || data.title || "",
        phone: bd.phone || "",
        email: bd.email || "",
        address: bd.address || "",
        city: bd.city || "",
        state: bd.state || "",
        primaryKeyword: bd.primaryKeyword || "Water Damage Restoration",
        services: bd.services || [],
        serviceAreas: bd.serviceAreas || [],
        urlSlug: bd.urlSlug || "",
        primaryColor: bd.primaryColor || "#1e3a5f",
        secondaryColor: bd.secondaryColor || "#0ea5e9",
        contactFormEmbed: bd.contactFormEmbed || "",
        homepageContent: bd.homepageContent,
        serviceContent: bd.serviceContent,
        locationContent: bd.locationContent,
        netlifyUrl: data.netlifyUrl,
        deploymentStatus: data.netlifyDeploymentStatus,
      });
      if (data.netlifyUrl) setDeployedUrl(data.netlifyUrl);

      // Try to load pre-generated files
      if (data.generatedFiles) {
        setGeneratedFiles(data.generatedFiles);
      }
    } catch (err) {
      toast({ title: "Error", description: "Could not load website data.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  // ── Regenerate website files ──────────────────────────────────────────

  async function regenerateFiles() {
    if (!siteData) return;
    setIsRegenerating(true);
    try {
      const res = await fetch("/api/generate-wd-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...siteData,
          websiteId: websiteId,
          returnFiles: true,  // ask server to return JSON files, not ZIP
        }),
      });
      if (!res.ok) throw new Error("Generation failed");
      // Check if response is JSON (files) or ZIP
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("json")) {
        const data = await res.json();
        setGeneratedFiles(data.files || {});
        toast({ title: "Regenerated", description: "Website content updated." });
      } else {
        // ZIP fallback - prompt download
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `${siteData.urlSlug}-website.zip`; a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Downloaded", description: "Website ZIP downloaded." });
      }
    } catch (err) {
      toast({ title: "Error", description: String(err), variant: "destructive" });
    } finally {
      setIsRegenerating(false);
    }
  }

  // ── Save changes to DB ────────────────────────────────────────────────

  async function saveChanges() {
    if (!siteData || !websiteId) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/websites/${websiteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ businessData: siteData }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast({ title: "Saved", description: "Changes saved successfully." });
    } catch (err) {
      toast({ title: "Error", description: String(err), variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  // ── Deploy to Netlify ─────────────────────────────────────────────────

  async function deployToNetlify() {
    if (!siteData) return;
    if (!netlifyToken) {
      toast({ title: "Netlify Token Required", description: "Enter your Netlify API token to deploy.", variant: "destructive" });
      return;
    }
    setIsDeploying(true);
    try {
      const res = await fetch(`/api/websites/${websiteId}/redeploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          netlifyApiKey: netlifyToken,
          siteName: siteData.urlSlug,
          businessData: siteData,
        }),
      });
      if (!res.ok) throw new Error("Deploy failed");
      const data = await res.json();
      const url = data.url || data.deployUrl || `https://${siteData.urlSlug}.netlify.app`;
      setDeployedUrl(url);
      toast({ title: "🚀 Deployed!", description: `Live at ${url}` });
    } catch (err) {
      toast({ title: "Deploy Error", description: String(err), variant: "destructive" });
    } finally {
      setIsDeploying(false);
    }
  }

  // ── Image upload ──────────────────────────────────────────────────────

  function handleImageFileSelect(idx: number, file: File) {
    const reader = new FileReader();
    reader.onload = e => {
      setImages(prev => {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], newFile: file, newSrc: e.target?.result as string };
        return updated;
      });
    };
    reader.readAsDataURL(file);
  }

  // ── Update site data fields ───────────────────────────────────────────

  function updateField(path: string, value: any) {
    setSiteData(prev => {
      if (!prev) return prev;
      const copy = { ...prev };
      const parts = path.split(".");
      let obj: any = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!obj[parts[i]]) obj[parts[i]] = {};
        obj = obj[parts[i]];
      }
      obj[parts[parts.length - 1]] = value;
      return copy;
    });
  }

  // ── Preview URL for iframe ────────────────────────────────────────────

  const previewSrc = Object.keys(generatedFiles).length > 0
    ? `data:text/html;charset=utf-8,${encodeURIComponent(generatedFiles[previewPage] || generatedFiles['index.html'] || '')}`
    : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1 bg-gray-950">
        <Loader2 className="w-8 h-8 animate-spin text-[#AADD00]" />
      </div>
    );
  }

  if (!siteData) {
    return (
      <div className="flex items-center justify-center flex-1 bg-gray-950 text-white">
        <div className="text-center">
          <p className="text-lg mb-4">Website not found.</p>
          <Button onClick={() => setLocation("/dashboard/websites")}>Back to Websites</Button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1 bg-gray-950 text-white overflow-hidden">

      {/* ── Top Bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard/websites")} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div>
            <h1 className="font-bold text-white text-sm">{siteData.businessName}</h1>
            <p className="text-xs text-gray-400">{siteData.city}, {siteData.state} • Water Damage Template</p>
          </div>
          {siteData.deploymentStatus === "deployed" && (
            <Badge variant="outline" className="text-green-400 border-green-400">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Live
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={regenerateFiles} disabled={isRegenerating} className="border-gray-700 text-gray-300 hover:text-white">
            {isRegenerating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <RefreshCw className="w-4 h-4 mr-1" />}
            Regenerate
          </Button>
          <Button variant="outline" size="sm" onClick={saveChanges} disabled={isSaving} className="border-gray-700 text-gray-300 hover:text-white">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
            Save
          </Button>
          {deployedUrl && (
            <a href={deployedUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="border-green-700 text-green-400 hover:text-green-300">
                <ExternalLink className="w-4 h-4 mr-1" /> View Live
              </Button>
            </a>
          )}
          <Button size="sm" onClick={deployToNetlify} disabled={isDeploying} className="bg-blue-600 hover:bg-blue-700">
            {isDeploying ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Rocket className="w-4 h-4 mr-1" />}
            {isDeploying ? "Deploying..." : "Publish to Netlify"}
          </Button>
        </div>
      </div>

      {/* ── Main Layout ───────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Sidebar: Editor */}
        <div className="w-96 flex-shrink-0 bg-gray-900 border-r border-gray-800 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full rounded-none border-b border-gray-800 bg-gray-900 p-0 h-auto flex-wrap">
              <TabsTrigger value="business" className="flex-1 rounded-none text-xs py-3 data-[state=active]:bg-gray-800">
                <Phone className="w-3 h-3 mr-1" />Business
              </TabsTrigger>
              <TabsTrigger value="content" className="flex-1 rounded-none text-xs py-3 data-[state=active]:bg-gray-800">
                <FileText className="w-3 h-3 mr-1" />Content
              </TabsTrigger>
              <TabsTrigger value="images" className="flex-1 rounded-none text-xs py-3 data-[state=active]:bg-gray-800">
                <ImageIcon className="w-3 h-3 mr-1" />Images
              </TabsTrigger>
              <TabsTrigger value="deploy" className="flex-1 rounded-none text-xs py-3 data-[state=active]:bg-gray-800">
                <Rocket className="w-3 h-3 mr-1" />Deploy
              </TabsTrigger>
            </TabsList>

            {/* ── Business Info Tab ───────────────────────────────────── */}
            <TabsContent value="business" className="p-4 space-y-4 mt-0">
              <h3 className="font-semibold text-sm text-gray-300">Business Information</h3>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-400">Business Name</Label>
                  <Input value={siteData.businessName} onChange={e => updateField("businessName", e.target.value)} className="bg-gray-800 border-gray-700 text-white mt-1 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Phone (24/7 Emergency)</Label>
                  <Input value={siteData.phone} onChange={e => updateField("phone", e.target.value)} className="bg-gray-800 border-gray-700 text-white mt-1 text-sm" placeholder="(555) 000-0000" />
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Email</Label>
                  <Input value={siteData.email || ""} onChange={e => updateField("email", e.target.value)} className="bg-gray-800 border-gray-700 text-white mt-1 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Business Address</Label>
                  <Input value={siteData.address} onChange={e => updateField("address", e.target.value)} className="bg-gray-800 border-gray-700 text-white mt-1 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-400">City</Label>
                    <Input value={siteData.city} onChange={e => updateField("city", e.target.value)} className="bg-gray-800 border-gray-700 text-white mt-1 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400">State</Label>
                    <Input value={siteData.state} onChange={e => updateField("state", e.target.value)} className="bg-gray-800 border-gray-700 text-white mt-1 text-sm" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Primary Keyword</Label>
                  <Input value={siteData.primaryKeyword} onChange={e => updateField("primaryKeyword", e.target.value)} className="bg-gray-800 border-gray-700 text-white mt-1 text-sm" />
                </div>

                <div>
                  <Label className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                    <Layers className="w-3 h-3" /> Services (one per line)
                  </Label>
                  <Textarea
                    value={siteData.services.join("\n")}
                    onChange={e => updateField("services", e.target.value.split("\n").filter(Boolean))}
                    className="bg-gray-800 border-gray-700 text-white text-sm font-mono"
                    rows={5}
                    placeholder="Water Extraction&#10;Mold Remediation&#10;Flood Cleanup"
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3" /> Service Areas (one per line)
                  </Label>
                  <Textarea
                    value={siteData.serviceAreas.join("\n")}
                    onChange={e => updateField("serviceAreas", e.target.value.split("\n").filter(Boolean))}
                    className="bg-gray-800 border-gray-700 text-white text-sm font-mono"
                    rows={5}
                    placeholder="Austin&#10;Round Rock&#10;Cedar Park"
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-400">Contact Form Embed Code (optional)</Label>
                  <Textarea
                    value={siteData.contactFormEmbed || ""}
                    onChange={e => updateField("contactFormEmbed", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white text-sm font-mono"
                    rows={4}
                    placeholder="Paste JotForm, Typeform, or other embed code..."
                  />
                </div>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-400">Primary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <input type="color" value={siteData.primaryColor} onChange={e => updateField("primaryColor", e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                    <Input value={siteData.primaryColor} onChange={e => updateField("primaryColor", e.target.value)} className="bg-gray-800 border-gray-700 text-white text-sm h-8" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Secondary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <input type="color" value={siteData.secondaryColor} onChange={e => updateField("secondaryColor", e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                    <Input value={siteData.secondaryColor} onChange={e => updateField("secondaryColor", e.target.value)} className="bg-gray-800 border-gray-700 text-white text-sm h-8" />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ── Content Tab ─────────────────────────────────────────── */}
            <TabsContent value="content" className="p-4 space-y-5 mt-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-300">Page Content</h3>
                <Button variant="outline" size="sm" onClick={regenerateFiles} disabled={isRegenerating} className="border-gray-700 text-xs text-gray-400">
                  {isRegenerating ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <RefreshCw className="w-3 h-3 mr-1" />}
                  Re-generate
                </Button>
              </div>

              {/* Homepage Hero */}
              {siteData.homepageContent?.hero && (
                <ContentSection title="Homepage Hero">
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs text-gray-500">H1 Headline</Label>
                      <Input
                        value={siteData.homepageContent.hero.h1 || ""}
                        onChange={e => updateField("homepageContent.hero.h1", e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Subheadline</Label>
                      <Textarea
                        value={siteData.homepageContent.hero.subheadline || ""}
                        onChange={e => updateField("homepageContent.hero.subheadline", e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white mt-1 text-sm"
                        rows={2}
                      />
                    </div>
                  </div>
                </ContentSection>
              )}

              {/* Homepage Intro */}
              {siteData.homepageContent?.intro && (
                <ContentSection title="Homepage Intro Section">
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs text-gray-500">H2 Heading</Label>
                      <Input
                        value={siteData.homepageContent.intro.h2 || ""}
                        onChange={e => updateField("homepageContent.intro.h2", e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white mt-1 text-sm"
                      />
                    </div>
                    {(siteData.homepageContent.intro.paragraphs || []).map((para: string, idx: number) => (
                      <div key={idx}>
                        <Label className="text-xs text-gray-500">Paragraph {idx + 1}</Label>
                        <Textarea
                          value={para}
                          onChange={e => {
                            const updated = [...siteData.homepageContent.intro.paragraphs];
                            updated[idx] = e.target.value;
                            updateField("homepageContent.intro.paragraphs", updated);
                          }}
                          className="bg-gray-800 border-gray-700 text-white mt-1 text-sm"
                          rows={3}
                        />
                      </div>
                    ))}
                  </div>
                </ContentSection>
              )}

              {/* FAQ Preview */}
              {siteData.homepageContent?.faqSection && (
                <ContentSection title={`FAQ (${siteData.homepageContent.faqSection.faqs?.length || 0} questions)`}>
                  <p className="text-xs text-gray-500 italic">FAQ content is AI-generated. Use "Re-generate" to refresh, or edit the JSON directly in your website files.</p>
                  <div className="text-xs text-gray-400 mt-2">
                    {(siteData.homepageContent.faqSection.faqs || []).slice(0, 3).map((faq: any, i: number) => (
                      <p key={i} className="truncate py-1 border-b border-gray-800">Q: {faq.question}</p>
                    ))}
                    {(siteData.homepageContent.faqSection.faqs?.length || 0) > 3 && (
                      <p className="text-gray-600 py-1">+ {(siteData.homepageContent.faqSection.faqs.length - 3)} more questions</p>
                    )}
                  </div>
                </ContentSection>
              )}

              {!siteData.homepageContent && (
                <div className="rounded-lg border border-dashed border-gray-700 p-6 text-center">
                  <RefreshCw className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No AI content generated yet.</p>
                  <p className="text-xs text-gray-600 mt-1">Click "Re-generate" to create AI content for all pages.</p>
                </div>
              )}
            </TabsContent>

            {/* ── Images Tab ──────────────────────────────────────────── */}
            <TabsContent value="images" className="p-4 space-y-4 mt-0">
              <div>
                <h3 className="font-semibold text-sm text-gray-300 mb-1">Replace Placeholder Images</h3>
                <p className="text-xs text-gray-500">Upload real photos from your jobs or team. Add descriptive alt text for SEO.</p>
              </div>

              {images.map((img, idx) => (
                <div key={idx} className="rounded-lg border border-gray-700 overflow-hidden">
                  {/* Current image preview */}
                  <div className="relative bg-gray-800">
                    <img
                      src={img.newSrc || img.currentSrc}
                      alt={img.altText || "Placeholder"}
                      className="w-full h-40 object-cover"
                    />
                    {!img.newSrc && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-xs text-white font-medium px-2 py-1 bg-yellow-600 rounded">
                          📷 Placeholder — Replace Me
                        </span>
                      </div>
                    )}
                    {img.newSrc && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-600 text-xs">✓ Updated</Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-3 space-y-2">
                    <p className="text-xs font-medium text-gray-300">{img.label}</p>

                    <label className="block">
                      <span className="sr-only">Upload image</span>
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer flex-1">
                          <div className="flex items-center justify-center gap-2 border border-dashed border-gray-600 rounded-md py-2 px-3 text-xs text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors">
                            <ImageIcon className="w-4 h-4" />
                            {img.newFile ? img.newFile.name : "Choose photo..."}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => { if (e.target.files?.[0]) handleImageFileSelect(idx, e.target.files[0]); }}
                          />
                        </label>
                      </div>
                    </label>

                    <div>
                      <Label className="text-xs text-gray-500">Alt Text (required for SEO)</Label>
                      <Input
                        value={img.altText}
                        onChange={e => setImages(prev => { const u = [...prev]; u[idx] = { ...u[idx], altText: e.target.value }; return u; })}
                        className="bg-gray-800 border-gray-700 text-white mt-1 text-xs"
                        placeholder="e.g., Water damage restoration team in Austin"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <p className="text-xs text-gray-600 italic">
                Additional placeholder images are embedded in service and location pages. After deploying, you can update those by re-uploading specific pages.
              </p>
            </TabsContent>

            {/* ── Deploy Tab ──────────────────────────────────────────── */}
            <TabsContent value="deploy" className="p-4 space-y-4 mt-0">
              <h3 className="font-semibold text-sm text-gray-300">Deploy to Netlify</h3>

              {deployedUrl && (
                <div className="rounded-lg bg-green-900/30 border border-green-800 p-3">
                  <div className="flex items-center gap-2 text-green-400 text-sm font-medium mb-1">
                    <CheckCircle2 className="w-4 h-4" /> Currently Live
                  </div>
                  <a href={deployedUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-green-300 underline break-all">
                    {deployedUrl}
                  </a>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-400">Netlify API Token</Label>
                  <Input
                    type="password"
                    value={netlifyToken}
                    onChange={e => setNetlifyToken(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white mt-1 text-sm"
                    placeholder="nfp_xxxxxxxxxxxxxxxxxx"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Get your token from Netlify → User Settings → Personal Access Tokens
                  </p>
                </div>

                <div>
                  <Label className="text-xs text-gray-400">Site URL Slug</Label>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500 bg-gray-800 border border-r-0 border-gray-700 px-2 py-2 rounded-l-md">https://</span>
                    <Input
                      value={siteData.urlSlug}
                      onChange={e => updateField("urlSlug", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white text-sm rounded-l-none"
                    />
                    <span className="text-xs text-gray-500 bg-gray-800 border border-l-0 border-gray-700 px-2 py-2 rounded-r-md">.netlify.app</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={deployToNetlify}
                disabled={isDeploying || !netlifyToken}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isDeploying ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Deploying...</>
                ) : (
                  <><Rocket className="w-4 h-4 mr-2" /> Publish Website to Netlify</>
                )}
              </Button>

              <div className="rounded-lg bg-gray-800 border border-gray-700 p-3">
                <p className="text-xs font-medium text-gray-300 mb-2">📋 Pre-Deploy Checklist</p>
                <ul className="space-y-1">
                  {[
                    "Business name and phone number correct",
                    "All placeholder images replaced with real photos",
                    "Alt text added to all images",
                    "Services list is accurate",
                    "Service areas are correct",
                    "Contact form embed code added (if using one)",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="text-gray-600 mt-0.5">□</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <p className="text-xs text-gray-500 font-medium mb-2">What gets deployed:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>✓ index.html (Homepage)</li>
                  {siteData.services.map(s => <li key={s}>✓ services/{s.toLowerCase().replace(/\s+/g, '-')}.html</li>)}
                  {siteData.serviceAreas.slice(0, 3).map(l => <li key={l}>✓ locations/{l.toLowerCase().replace(/\s+/g, '-')}.html</li>)}
                  {siteData.serviceAreas.length > 3 && <li>✓ + {siteData.serviceAreas.length - 3} more location pages</li>}
                  <li>✓ sitemap.xml</li>
                  <li>✓ robots.txt</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Preview */}
        <div className="flex-1 flex flex-col bg-gray-950 overflow-hidden">
          {/* Preview toolbar */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800 flex-shrink-0">
            <Globe className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">Preview:</span>

            {/* Page selector */}
            <select
              value={previewPage}
              onChange={e => setPreviewPage(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded px-2 py-1"
            >
              <option value="index.html">Homepage</option>
              {siteData.services.map(s => {
                const slug = `services/${s.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${siteData.city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
                return <option key={s} value={slug}>{s} (Service)</option>;
              })}
              {siteData.serviceAreas.map(l => {
                const slug = `locations/${l.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
                return <option key={l} value={slug}>{l} (Location)</option>;
              })}
            </select>

            {deployedUrl && (
              <span className="ml-auto text-xs text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Live: {deployedUrl}
              </span>
            )}
          </div>

          {/* Preview iframe or placeholder */}
          <div className="flex-1 overflow-hidden bg-white">
            {previewSrc ? (
              <iframe
                ref={iframeRef}
                src={previewSrc}
                className="w-full h-full border-0"
                title="Website Preview"
                sandbox="allow-same-origin allow-scripts"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gray-950 text-gray-500">
                <Globe className="w-16 h-16 mb-4 text-gray-700" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">No Preview Yet</h3>
                <p className="text-sm text-center max-w-sm mb-6">
                  Your website has been generated. Click "Regenerate" to build the preview, or go straight to "Publish to Netlify".
                </p>
                <Button onClick={regenerateFiles} disabled={isRegenerating} className="bg-blue-600 hover:bg-blue-700">
                  {isRegenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Generate Preview
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helper: Collapsible Section ───────────────────────────────────────────

function ContentSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 text-left text-xs font-medium text-gray-300 hover:bg-gray-750 transition-colors"
      >
        {title}
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && <div className="p-3 bg-gray-900 space-y-2">{children}</div>}
    </div>
  );
}
