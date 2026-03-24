/**
 * Water Damage Site Editor
 * Post-generation editor: edit content, replace placeholder images, deploy to Netlify.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
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
import { generateWaterDamageWebsite } from "../lib/water-damage-generator";

interface WDSiteData {
  id?: string;
  businessName: string;
  countryCode?: string;
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
  // AI Keys (stored per-website so they survive deployments)
  openaiApiKey?: string;
  geminiApiKey?: string;
  // Custom images: placeholder key → data URL or hosted URL
  customImages?: Record<string, string>;
  // Social media
  facebookUrl?: string;
  instagramUrl?: string;
  googleUrl?: string;
  yelpUrl?: string;
  twitterUrl?: string;
  // Floating CTA
  floatingCTA?: 'call' | 'whatsapp' | 'none';
  whatsappNumber?: string;
  // Gallery images: before/after pairs + normal gallery photos
  galleryImages?: Array<{src: string; alt: string; type: 'before' | 'after' | 'normal'; pairId?: string; caption?: string}>;
  // Deployment
  netlifyUrl?: string;
  netlifyApiKey?: string;
  deploymentStatus?: string;
}

// All placeholder image slots in the WD template
const WD_IMAGE_SLOTS = [
  { key: "hero-bg",        label: "Hero Background",          page: "Homepage",         defaultSrc: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80", hint: "Wide banner photo — water damage scene, flooded room, or your team at work" },
  { key: "main-image",     label: "Team / Work Photo",        page: "Homepage",         defaultSrc: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80", hint: "Your team, truck, or a restoration job in progress" },
  { key: "about-image",    label: "About Us Photo",           page: "About",            defaultSrc: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80", hint: "Team photo, owner headshot, or your office/vehicles" },
  { key: "service-image",  label: "Service Page Photo",       page: "Service Pages",    defaultSrc: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80", hint: "Water damage work, equipment, or drying process" },
  { key: "location-image", label: "Location Page Photo",      page: "Location Pages",   defaultSrc: "https://images.unsplash.com/photo-1601760562234-9814eea6663a?w=800&q=80", hint: "Your truck or team in the local area" },
  { key: "gallery-1",      label: "Gallery — Before Photo",   page: "Gallery",          defaultSrc: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80", hint: "Before photo from an actual restoration job" },
];

// Script injected into every preview page so images become click-to-upload
const PREVIEW_CLICK_SCRIPT = `
<style>
.wd-img-wrap{position:relative;display:inline-block;}
.wd-img-wrap img{display:block;width:100%;}
.wd-img-overlay{position:absolute;inset:0;background:rgba(0,0,0,.48);color:#fff;font-size:13px;font-weight:700;font-family:sans-serif;display:flex;align-items:center;justify-content:center;gap:6px;opacity:0;transition:opacity .18s;cursor:pointer;border-radius:4px;}
.wd-img-wrap:hover .wd-img-overlay{opacity:1;}
.wd-hero-btn{position:absolute;top:12px;left:12px;z-index:200;background:rgba(255,255,255,.92);color:#1e3a5f;border:none;padding:7px 14px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.25);}
.wd-hero-btn:hover{background:#fff;}
</style>
<script>
(function(){
  document.querySelectorAll('img[data-placeholder]').forEach(function(img){
    var key=img.getAttribute('data-placeholder');
    var parent=img.parentElement;
    var wrap=document.createElement('div');
    wrap.className='wd-img-wrap';
    parent.insertBefore(wrap,img);
    wrap.appendChild(img);
    var ov=document.createElement('div');
    ov.className='wd-img-overlay';
    ov.innerHTML='<span>📷</span><span>Click to replace</span>';
    ov.onclick=function(){window.parent.postMessage({type:'wd-img-click',key:key},'*');};
    wrap.appendChild(ov);
  });
  var hero=document.querySelector('.hero');
  if(hero){
    var btn=document.createElement('button');
    btn.className='wd-hero-btn';
    btn.textContent='📷 Change Background';
    btn.onclick=function(){window.parent.postMessage({type:'wd-img-click',key:'hero-bg'},'*');};
    hero.style.position='relative';
    hero.appendChild(btn);
  }
})();
</script>`;

// Convert WDSiteData → the shape generateWaterDamageWebsite expects
function siteDataToWDData(data: WDSiteData): Parameters<typeof generateWaterDamageWebsite>[0] {
  return {
    businessName: data.businessName,
    countryCode: data.countryCode,
    phone: data.phone,
    email: data.email,
    address: data.address,
    city: data.city,
    state: data.state,
    primaryKeyword: data.primaryKeyword,
    services: data.services,
    serviceAreas: data.serviceAreas,
    urlSlug: data.urlSlug || data.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    primaryColor: data.primaryColor,
    secondaryColor: data.secondaryColor,
    customImages: data.customImages,
    facebookUrl: data.facebookUrl,
    instagramUrl: data.instagramUrl,
    googleUrl: data.googleUrl,
    yelpUrl: data.yelpUrl,
    twitterUrl: data.twitterUrl,
    floatingCTA: data.floatingCTA,
    whatsappNumber: data.whatsappNumber,
    homepageContent: data.homepageContent,
    serviceContent: data.serviceContent,
    locationContent: data.locationContent,
    galleryImages: data.galleryImages,
  } as any;
}

/** Strip deployment-only fields before storing businessData — these live in
 *  their own DB columns (deployed_url, status) and must not pollute businessData. */
function stripDeploymentFields(data: WDSiteData) {
  const { netlifyUrl: _a, deploymentStatus: _b, netlifyApiKey: _c, ...rest } = data as any;
  return rest;
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function WDSiteEditor() {
  const [location, setLocation] = useLocation();
  const websiteId = location.split("/dashboard/wd-editor/")[1]?.split("/")[0] || null;
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
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);
  const [desiredSlug, setDesiredSlug] = useState("");
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [apiStatus, setApiStatus] = useState<"checking" | "ready" | "none">("checking");
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstLoadRef = useRef(true);
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);
  const pendingUploadKeyRef = useRef<string | null>(null);
  const siteDataRef = useRef<WDSiteData | null>(null);

  // ── Auto-save when siteData changes ──────────────────────────────────

  useEffect(() => {
    // Skip auto-save on initial load
    if (isFirstLoadRef.current) {
      if (siteData !== null) isFirstLoadRef.current = false;
      return;
    }
    if (!siteData || !websiteId) return;

    // Debounce: save 3 seconds after last change
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    setAutoSaveStatus("saving");
    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/websites/${websiteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ businessData: stripDeploymentFields(siteData) }),
        });
        if (res.ok) {
          setAutoSaveStatus("saved");
          setTimeout(() => setAutoSaveStatus("idle"), 2000);
        }
      } catch {
        setAutoSaveStatus("idle");
      }
    }, 3000);
  }, [siteData]);

  // Keep a ref of siteData so callbacks (postMessage handler) get the latest value
  useEffect(() => { siteDataRef.current = siteData; }, [siteData]);

  // ── Click-to-upload: listen for postMessage from preview iframe ───────

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type !== 'wd-img-click' || !e.data.key) return;
      pendingUploadKeyRef.current = e.data.key;
      hiddenFileInputRef.current?.click();
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

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
        services: Array.isArray(bd.services) ? bd.services : bd.services ? String(bd.services).split(/[\n;]/).map((s: string) => s.trim()).filter(Boolean) : [],
        serviceAreas: Array.isArray(bd.serviceAreas) ? bd.serviceAreas : bd.serviceAreas ? String(bd.serviceAreas).split(/[\n;]/).map((s: string) => s.trim()).filter(Boolean) : [],
        urlSlug: bd.urlSlug || "",
        primaryColor: bd.primaryColor || "#1e3a5f",
        secondaryColor: bd.secondaryColor || "#0ea5e9",
        contactFormEmbed: bd.contactFormEmbed || "",
        openaiApiKey: bd.openaiApiKey || "",
        geminiApiKey: bd.geminiApiKey || "",
        homepageContent: bd.homepageContent,
        serviceContent: bd.serviceContent,
        locationContent: bd.locationContent,
        customImages: bd.customImages || {},
        facebookUrl: bd.facebookUrl || "",
        instagramUrl: bd.instagramUrl || "",
        googleUrl: bd.googleUrl || "",
        yelpUrl: bd.yelpUrl || "",
        twitterUrl: bd.twitterUrl || "",
        floatingCTA: bd.floatingCTA || "call",
        whatsappNumber: bd.whatsappNumber || "",
        galleryImages: Array.isArray(bd.galleryImages) ? bd.galleryImages : [],
        netlifyUrl: data.netlifyUrl,
        deploymentStatus: data.netlifyDeploymentStatus,
      });
      if (data.netlifyUrl) setDeployedUrl(data.netlifyUrl);

      // Load saved Netlify token if available — mark as connected immediately
      // (token was already verified when saved, no need to re-verify on every load)
      fetch("/api/settings/netlify", { credentials: "include" })
        .then(r => r.ok ? r.json() : null)
        .then(s => {
          // API returns masked "•••••••••••" when token exists — that's fine,
          // server resolves the real token during deploy. Just mark as connected.
          if (s?.apiKey) {
            setNetlifyToken(s.apiKey);
            setTokenValid(true);
          }
        })
        .catch(() => {});

      // Check if any AI API key is configured (for status indicator)
      Promise.all([
        fetch("/api/settings/openai", { credentials: "include" }).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch("/api/settings/gemini", { credentials: "include" }).then(r => r.ok ? r.json() : null).catch(() => null),
      ]).then(([openai, gemini]) => {
        const hasKey = (openai?.apiKey) || (gemini?.apiKey) || bd.openaiApiKey || bd.geminiApiKey;
        setApiStatus(hasKey ? "ready" : "none");
      });

      // Try to load pre-generated files (stored as customFiles in DB)
      if (data.customFiles && typeof data.customFiles === "object") {
        setGeneratedFiles(data.customFiles);
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
          ...stripDeploymentFields(siteData),
          websiteId: websiteId,
          returnFiles: true,  // ask server to return JSON files, not ZIP
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${res.status}`);
      }
      // Check if response is JSON (files) or ZIP
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("json")) {
        const data = await res.json();
        const files = data.files || {};
        setGeneratedFiles(files);
        setApiStatus("ready");
        // Files + businessData are already persisted by the server in the same request.
        // No extra PUT needed here.

        toast({ title: "Regenerated", description: "Website saved and ready to preview." });
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
        body: JSON.stringify({ businessData: stripDeploymentFields(siteData) }),
      });
      if (!res.ok) throw new Error("Save failed");
      if (siteData.openaiApiKey || siteData.geminiApiKey) setApiStatus("ready");
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
      toast({ title: "Netlify Token Required", description: "Verify your Netlify token in the Deploy tab first.", variant: "destructive" });
      return;
    }
    setIsDeploying(true);
    try {
      const slug = (desiredSlug || siteData.urlSlug || "").trim();
      const res = await fetch(`/api/websites/${websiteId}/deploy-wd`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          netlifyApiKey: netlifyToken,
          siteName: slug,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${res.status}`);
      }
      const data = await res.json();
      const url = data.url || `https://${slug}.netlify.app`;
      setDeployedUrl(url);
      toast({ title: "🚀 Deploying!", description: `Your site will be live at ${url} in ~30 seconds.` });
    } catch (err) {
      toast({ title: "Deploy Error", description: String(err), variant: "destructive" });
    } finally {
      setIsDeploying(false);
    }
  }

  // ── Verify Netlify token ──────────────────────────────────────────────
  async function verifyNetlifyToken() {
    if (!netlifyToken.trim()) return;
    setIsVerifyingToken(true);
    setTokenValid(null);
    try {
      const res = await fetch("https://api.netlify.com/api/v1/user", {
        headers: { Authorization: `Bearer ${netlifyToken}` }
      });
      setTokenValid(res.ok);
      if (res.ok) {
        const userData = await res.json();
        // Persist token globally so it survives page reloads
        fetch("/api/settings/netlify", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ apiKey: netlifyToken, isActive: true })
        }).catch(() => {});
        toast({ title: "Token Valid", description: `Connected as ${userData.email || userData.slug || "Netlify user"}` });
      } else {
        toast({ title: "Invalid Token", description: "Check your Netlify personal access token.", variant: "destructive" });
      }
    } catch {
      setTokenValid(false);
      toast({ title: "Error", description: "Could not connect to Netlify.", variant: "destructive" });
    } finally {
      setIsVerifyingToken(false);
    }
  }

  // ── Check domain availability ─────────────────────────────────────────
  async function checkSlugAvailability() {
    if (!netlifyToken.trim() || !desiredSlug.trim()) return;
    setIsCheckingSlug(true);
    setSlugAvailable(null);
    try {
      const res = await fetch(`https://api.netlify.com/api/v1/sites?filter=all&name=${desiredSlug}`, {
        headers: { Authorization: `Bearer ${netlifyToken}` }
      });
      if (!res.ok) throw new Error("API error");
      const sites = await res.json();
      const taken = Array.isArray(sites) && sites.some((s: any) => s.name === desiredSlug);
      setSlugAvailable(!taken);
    } catch {
      toast({ title: "Check failed", description: "Could not verify availability.", variant: "destructive" });
    } finally {
      setIsCheckingSlug(false);
    }
  }

  // ── Image upload ──────────────────────────────────────────────────────

  // Rebuild the preview files client-side (pure template, no AI, instant)
  function rebuildPreview(data: WDSiteData) {
    if (Object.keys(generatedFiles).length === 0) return; // no preview yet
    try {
      const domain = data.urlSlug || data.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newFiles = generateWaterDamageWebsite(siteDataToWDData(data), domain);
      setGeneratedFiles(newFiles);
    } catch (e) {
      console.error('Preview rebuild failed:', e);
    }
  }

  function handleCustomImageUpload(key: string, file: File) {
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target?.result as string;
      const current = siteDataRef.current || siteData;
      const updatedImages = { ...(current?.customImages || {}), [key]: dataUrl };
      setSiteData(prev => prev ? { ...prev, customImages: updatedImages } : prev);
      if (current) rebuildPreview({ ...current, customImages: updatedImages });
      toast({ title: "Image updated", description: "Preview refreshed. Will be saved automatically." });
    };
    reader.readAsDataURL(file);
  }

  function removeCustomImage(key: string) {
    setSiteData(prev => {
      if (!prev?.customImages) return prev;
      const updated = { ...prev.customImages };
      delete updated[key];
      const next = { ...prev, customImages: updated };
      rebuildPreview(next);
      return next;
    });
  }

  // ── Gallery management ────────────────────────────────────────────────

  function getGalleryPairs(data: WDSiteData) {
    const images = data.galleryImages || [];
    const pairIds = Array.from(new Set(images.filter(i => i.pairId).map(i => i.pairId!)));
    return pairIds.map(id => ({
      id,
      before: images.find(i => i.pairId === id && i.type === 'before'),
      after:  images.find(i => i.pairId === id && i.type === 'after'),
    }));
  }

  function getGalleryNormal(data: WDSiteData) {
    return (data.galleryImages || []).filter(i => i.type === 'normal');
  }

  function addBeforeAfterPair() {
    const current = siteDataRef.current || siteData;
    if (!current) return;
    const pairs = getGalleryPairs(current);
    if (pairs.length >= 20) { toast({ title: "Max 20 pairs reached" }); return; }
    const pairId = `pair-${Date.now()}`;
    const next = {
      ...current,
      galleryImages: [
        ...(current.galleryImages || []),
        { src: '', alt: 'Before photo', type: 'before' as const, pairId, caption: '' },
        { src: '', alt: 'After photo',  type: 'after'  as const, pairId, caption: '' },
      ],
    };
    setSiteData(next);
  }

  function removeBeforeAfterPair(pairId: string) {
    setSiteData(prev => {
      if (!prev) return prev;
      const next = { ...prev, galleryImages: (prev.galleryImages || []).filter(i => i.pairId !== pairId) };
      rebuildPreview(next);
      return next;
    });
  }

  function uploadPairImage(pairId: string, type: 'before' | 'after', file: File) {
    const reader = new FileReader();
    reader.onload = e => {
      const src = e.target?.result as string;
      const current = siteDataRef.current || siteData;
      if (!current) return;
      const next = {
        ...current,
        galleryImages: (current.galleryImages || []).map(img =>
          img.pairId === pairId && img.type === type ? { ...img, src } : img
        ),
      };
      setSiteData(next);
      rebuildPreview(next);
      toast({ title: `${type === 'before' ? 'Before' : 'After'} image updated` });
    };
    reader.readAsDataURL(file);
  }

  function addGalleryPhoto() {
    const current = siteDataRef.current || siteData;
    if (!current) return;
    const normal = getGalleryNormal(current);
    if (normal.length >= 50) { toast({ title: "Max 50 gallery photos reached" }); return; }
    const next = {
      ...current,
      galleryImages: [
        ...(current.galleryImages || []),
        { src: '', alt: 'Gallery photo', type: 'normal' as const },
      ],
    };
    setSiteData(next);
  }

  function removeGalleryPhoto(index: number) {
    setSiteData(prev => {
      if (!prev) return prev;
      const normals = (prev.galleryImages || []).filter(i => i.type === 'normal');
      const toRemove = normals[index];
      if (!toRemove) return prev;
      const next = { ...prev, galleryImages: (prev.galleryImages || []).filter(i => i !== toRemove) };
      rebuildPreview(next);
      return next;
    });
  }

  function uploadGalleryPhoto(index: number, file: File) {
    const reader = new FileReader();
    reader.onload = e => {
      const src = e.target?.result as string;
      const current = siteDataRef.current || siteData;
      if (!current) return;
      const normals = (current.galleryImages || []).filter(i => i.type === 'normal');
      const target = normals[index];
      if (!target) return;
      const next = {
        ...current,
        galleryImages: (current.galleryImages || []).map(img =>
          img === target ? { ...img, src } : img
        ),
      };
      setSiteData(next);
      rebuildPreview(next);
      toast({ title: "Gallery photo updated" });
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

  // ── Preview blob URL for iframe (blob avoids data: URL size limits with large images) ──

  useEffect(() => {
    if (Object.keys(generatedFiles).length === 0) {
      setPreviewBlobUrl(null);
      return;
    }
    const html = generatedFiles[previewPage] || generatedFiles['index.html'] || '';
    const withScript = html.replace('</body>', PREVIEW_CLICK_SCRIPT + '</body>');
    const blob = new Blob([withScript], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setPreviewBlobUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [generatedFiles, previewPage]);

  if (isLoading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030712' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#AADD00' }} />
      </div>
    );
  }

  if (!siteData) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030712', color: 'white' }}>
        <div className="text-center">
          <p className="text-lg mb-4">Website not found.</p>
          <Button onClick={() => setLocation("/dashboard/websites")}>Back to Websites</Button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, background: '#030712', color: 'white', overflow: 'hidden' }}>

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
          {/* API Status Badge */}
          {apiStatus === "none" && (
            <button onClick={() => setActiveTab("business")}
              className="text-xs px-2 py-1 rounded-md bg-yellow-900/40 border border-yellow-700/50 text-yellow-400 hover:bg-yellow-900/60 transition-colors whitespace-nowrap">
              ⚠ No AI Key — click to add
            </button>
          )}
          {apiStatus === "ready" && (
            <span className="text-xs px-2 py-1 rounded-md bg-green-900/30 border border-green-700/40 text-green-400 whitespace-nowrap">
              ✓ AI Ready
            </span>
          )}
          <Button variant="outline" size="sm" onClick={regenerateFiles} disabled={isRegenerating} className="border-gray-700 text-gray-300 hover:text-white">
            {isRegenerating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <RefreshCw className="w-4 h-4 mr-1" />}
            Regenerate
          </Button>
          {autoSaveStatus === "saving" && (
            <span className="text-xs text-gray-500 whitespace-nowrap">Saving...</span>
          )}
          {autoSaveStatus === "saved" && (
            <span className="text-xs text-green-500 whitespace-nowrap">✓ Saved</span>
          )}
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
            {isDeploying ? "Deploying..." : deployedUrl ? "Update to Netlify" : "Publish to Netlify"}
          </Button>
        </div>
      </div>

      {/* ── Main Layout ───────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

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
                  <div className="flex gap-2 mt-1">
                    <select
                      value={siteData.countryCode || "+1"}
                      onChange={e => updateField("countryCode", e.target.value)}
                      className="w-[100px] h-[36px] px-2 py-1 rounded-md bg-gray-800 border border-gray-700 text-white text-sm focus:border-[#AADD00]/50 outline-none"
                    >
                      <option value="+1" className="bg-gray-900">🇺🇸/🇨🇦 +1</option>
                      <option value="+44" className="bg-gray-900">🇬🇧 +44</option>
                      <option value="+61" className="bg-gray-900">🇦🇺 +61</option>
                      <option value="+64" className="bg-gray-900">🇳🇿 +64</option>
                      <option value="+27" className="bg-gray-900">🇿🇦 +27</option>
                      <option value="+91" className="bg-gray-900">🇮🇳 +91</option>
                    </select>
                    <Input value={siteData.phone} onChange={e => updateField("phone", e.target.value)} className="flex-1 bg-gray-800 border-gray-700 text-white h-[36px] text-sm" placeholder="(555) 000-0000" />
                  </div>
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
                    value={(Array.isArray(siteData.services) ? siteData.services : []).join("\n")}
                    onChange={e => updateField("services", e.target.value.split("\n").filter(Boolean))}
                    className="bg-gray-800 border-gray-700 text-white text-sm font-mono"
                    rows={5}
                    placeholder="Water Extraction&#10;Mold Remediation&#10;Flood Cleanup"
                  />
                </div>

                <div>
                  <Label className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3" /> Service Areas — each line = 1 page
                  </Label>
                  <Textarea
                    value={(Array.isArray(siteData.serviceAreas) ? siteData.serviceAreas : []).join("\n")}
                    onChange={e => updateField("serviceAreas", e.target.value.split("\n").filter(Boolean))}
                    className="bg-gray-800 border-gray-700 text-white text-sm font-mono"
                    rows={5}
                    placeholder="Austin&#10;Round Rock&#10;Cedar Park"
                  />
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">Each city = separate SEO location page</p>
                    <span className="text-xs text-[#AADD00] font-mono">
                      {(Array.isArray(siteData.serviceAreas) ? siteData.serviceAreas : []).length} pages
                    </span>
                  </div>
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

              {/* AI API Keys — saved per-website, survive deployments */}
              <div className="rounded-lg border border-dashed border-gray-700 p-3 space-y-2">
                <p className="text-xs font-medium text-gray-400">AI Content Generation Keys</p>
                <div>
                  <Label className="text-xs text-gray-500">OpenAI API Key</Label>
                  <Input
                    type="password"
                    value={siteData.openaiApiKey || ""}
                    onChange={e => updateField("openaiApiKey", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white mt-1 text-sm"
                    placeholder="sk-..."
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Gemini API Key</Label>
                  <Input
                    type="password"
                    value={siteData.geminiApiKey || ""}
                    onChange={e => updateField("geminiApiKey", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white mt-1 text-sm"
                    placeholder="AIza..."
                  />
                </div>
                <p className="text-xs text-gray-600">Keys saved here are used for all future generations. Click <strong>Save</strong> after entering.</p>
                {(siteData.openaiApiKey || siteData.geminiApiKey) && (
                  <p className="text-xs text-green-400">✓ Key entered — click Save to apply</p>
                )}
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

              {/* Social Media */}
              <div className="rounded-lg border border-dashed border-gray-700 p-3 space-y-2">
                <p className="text-xs font-medium text-gray-400">Social Media Links (optional)</p>
                {[
                  { field: "facebookUrl", label: "Facebook", placeholder: "https://facebook.com/yourbusiness" },
                  { field: "instagramUrl", label: "Instagram", placeholder: "https://instagram.com/yourbusiness" },
                  { field: "googleUrl", label: "Google Business", placeholder: "https://g.page/yourbusiness" },
                  { field: "yelpUrl", label: "Yelp", placeholder: "https://yelp.com/biz/yourbusiness" },
                  { field: "twitterUrl", label: "X / Twitter", placeholder: "https://x.com/yourbusiness" },
                ].map(({ field, label, placeholder }) => (
                  <div key={field}>
                    <Label className="text-xs text-gray-500">{label}</Label>
                    <Input
                      value={(siteData as any)[field] || ""}
                      onChange={e => updateField(field, e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white mt-1 text-sm"
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>

              {/* Floating CTA */}
              <div className="rounded-lg border border-dashed border-gray-700 p-3 space-y-2">
                <p className="text-xs font-medium text-gray-400">Floating Call Button</p>
                <p className="text-xs text-gray-600">A sticky button shown on all pages to drive calls/leads.</p>
                <div className="flex gap-2">
                  {[
                    { value: "call", label: "📞 Call Button" },
                    { value: "whatsapp", label: "💬 WhatsApp" },
                    { value: "none", label: "None" },
                  ].map(opt => (
                    <button key={opt.value}
                      onClick={() => updateField("floatingCTA", opt.value)}
                      className={`flex-1 py-1.5 text-xs rounded-md border transition-colors ${
                        (siteData.floatingCTA || "call") === opt.value
                          ? "bg-blue-900/40 border-blue-600 text-blue-300"
                          : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                {(siteData.floatingCTA || "call") === "whatsapp" && (
                  <div>
                    <Label className="text-xs text-gray-500">WhatsApp Number (with country code)</Label>
                    <Input
                      value={siteData.whatsappNumber || ""}
                      onChange={e => updateField("whatsappNumber", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white mt-1 text-sm"
                      placeholder="+15125558900"
                    />
                  </div>
                )}
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
                <h3 className="font-semibold text-sm text-gray-300 mb-1">Page Images</h3>
                <p className="text-xs text-gray-500">Upload real photos for each section. Click Save after uploading, then Regenerate to apply.</p>
              </div>

              {WD_IMAGE_SLOTS.map(slot => {
                const customSrc = siteData?.customImages?.[slot.key];
                const displaySrc = customSrc || slot.defaultSrc;
                const isCustom = !!customSrc;
                return (
                  <div key={slot.key} className="rounded-lg border border-gray-700 overflow-hidden">
                    <div className="relative bg-gray-800">
                      <img src={displaySrc} alt={slot.label} className="w-full h-32 object-cover" />
                      <div className="absolute top-2 left-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-black/60 text-gray-300">{slot.page}</span>
                      </div>
                      {isCustom ? (
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Badge className="bg-green-700 text-xs">✓ Custom</Badge>
                          <button onClick={() => removeCustomImage(slot.key)}
                            className="text-xs px-1.5 py-0.5 rounded bg-red-900/80 text-red-300 hover:bg-red-800">✕</button>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-end justify-start p-2">
                          <span className="text-xs bg-yellow-700/80 text-yellow-200 px-2 py-0.5 rounded">📷 Placeholder</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 space-y-1.5">
                      <p className="text-xs font-medium text-white">{slot.label}</p>
                      <p className="text-xs text-gray-500">{slot.hint}</p>
                      <label className="cursor-pointer block">
                        <div className="flex items-center justify-center gap-2 border border-dashed border-gray-600 rounded-md py-2 px-3 text-xs text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors">
                          <ImageIcon className="w-3 h-3" />
                          {isCustom ? "Replace photo..." : "Upload photo..."}
                        </div>
                        <input type="file" accept="image/*" className="hidden"
                          onChange={e => { if (e.target.files?.[0]) handleCustomImageUpload(slot.key, e.target.files[0]); }} />
                      </label>
                    </div>
                  </div>
                );
              })}

              <p className="text-xs text-gray-500 italic">
                Tip: You can also click any image directly in the preview on the right to replace it instantly.
              </p>

              {/* ── Before/After Gallery Pairs ─────────────────────────── */}
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-300">Before/After Comparisons</h3>
                    <p className="text-xs text-gray-500">Drag the slider in the preview to compare. Up to 20 pairs.</p>
                  </div>
                  <button
                    onClick={addBeforeAfterPair}
                    disabled={(getGalleryPairs(siteData).length) >= 20}
                    className="text-xs px-2 py-1 rounded bg-blue-800 text-blue-200 hover:bg-blue-700 disabled:opacity-40"
                  >+ Add Pair</button>
                </div>

                {getGalleryPairs(siteData).length === 0 && (
                  <p className="text-xs text-gray-600 italic text-center py-3 border border-dashed border-gray-700 rounded-lg">
                    No custom pairs yet — placeholder images will be used. Add a pair to replace them.
                  </p>
                )}

                {getGalleryPairs(siteData).map((pair, idx) => (
                  <div key={pair.id} className="rounded-lg border border-gray-700 p-3 mb-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-400">Pair {idx + 1}</span>
                      <button onClick={() => removeBeforeAfterPair(pair.id)} className="text-xs text-red-400 hover:text-red-300">✕ Remove</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Before */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">BEFORE</p>
                        <div className="relative bg-gray-800 rounded aspect-video overflow-hidden">
                          {pair.before?.src
                            ? <img src={pair.before.src} alt="Before" className="w-full h-full object-cover" />
                            : <div className="flex items-center justify-center h-full text-gray-600 text-xs">No image</div>
                          }
                        </div>
                        <label className="cursor-pointer block mt-1">
                          <div className="flex items-center justify-center gap-1 border border-dashed border-gray-600 rounded py-1.5 text-xs text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors">
                            <ImageIcon className="w-3 h-3" />{pair.before?.src ? "Replace" : "Upload"}
                          </div>
                          <input type="file" accept="image/*" className="hidden"
                            onChange={e => { if (e.target.files?.[0]) uploadPairImage(pair.id, 'before', e.target.files[0]); e.target.value = ''; }} />
                        </label>
                      </div>
                      {/* After */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">AFTER</p>
                        <div className="relative bg-gray-800 rounded aspect-video overflow-hidden">
                          {pair.after?.src
                            ? <img src={pair.after.src} alt="After" className="w-full h-full object-cover" />
                            : <div className="flex items-center justify-center h-full text-gray-600 text-xs">No image</div>
                          }
                        </div>
                        <label className="cursor-pointer block mt-1">
                          <div className="flex items-center justify-center gap-1 border border-dashed border-gray-600 rounded py-1.5 text-xs text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors">
                            <ImageIcon className="w-3 h-3" />{pair.after?.src ? "Replace" : "Upload"}
                          </div>
                          <input type="file" accept="image/*" className="hidden"
                            onChange={e => { if (e.target.files?.[0]) uploadPairImage(pair.id, 'after', e.target.files[0]); e.target.value = ''; }} />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Gallery Photos ────────────────────────────────────────── */}
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-300">Gallery Photos</h3>
                    <p className="text-xs text-gray-500">General project photos shown in gallery grid. Up to 50 images.</p>
                  </div>
                  <button
                    onClick={addGalleryPhoto}
                    disabled={getGalleryNormal(siteData).length >= 50}
                    className="text-xs px-2 py-1 rounded bg-blue-800 text-blue-200 hover:bg-blue-700 disabled:opacity-40"
                  >+ Add Photo</button>
                </div>

                {getGalleryNormal(siteData).length === 0 && (
                  <p className="text-xs text-gray-600 italic text-center py-3 border border-dashed border-gray-700 rounded-lg">
                    No custom photos yet — placeholder images will be used.
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {getGalleryNormal(siteData).map((photo, idx) => (
                    <div key={idx} className="rounded border border-gray-700 overflow-hidden">
                      <div className="relative bg-gray-800 aspect-video">
                        {photo.src
                          ? <img src={photo.src} alt={`Gallery ${idx+1}`} className="w-full h-full object-cover" />
                          : <div className="flex items-center justify-center h-full text-gray-600 text-xs">No image</div>
                        }
                        <button onClick={() => removeGalleryPhoto(idx)}
                          className="absolute top-1 right-1 text-xs px-1.5 py-0.5 rounded bg-red-900/80 text-red-300 hover:bg-red-800">✕</button>
                      </div>
                      <label className="cursor-pointer block">
                        <div className="flex items-center justify-center gap-1 py-1.5 text-xs text-gray-400 hover:text-blue-400 transition-colors">
                          <ImageIcon className="w-3 h-3" />{photo.src ? "Replace" : "Upload"}
                        </div>
                        <input type="file" accept="image/*" className="hidden"
                          onChange={e => { if (e.target.files?.[0]) uploadGalleryPhoto(idx, e.target.files[0]); e.target.value = ''; }} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* ── Deploy Tab ──────────────────────────────────────────── */}
            <TabsContent value="deploy" className="p-4 space-y-4 mt-0">
              <h3 className="font-semibold text-sm text-gray-300">{deployedUrl ? "Update on Netlify" : "Publish to Netlify"}</h3>
              <p className="text-xs text-gray-500">{deployedUrl ? "Push your latest changes to the live site." : "Complete your website first (Business + Content tabs), then publish here."}</p>

              {deployedUrl && (
                <div className="rounded-lg bg-green-900/30 border border-green-800 p-3">
                  <div className="flex items-center gap-2 text-green-400 text-sm font-medium mb-1">
                    <CheckCircle2 className="w-4 h-4" /> Live Site
                  </div>
                  <a href={deployedUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-green-300 underline break-all">
                    {deployedUrl}
                  </a>
                </div>
              )}

              {/* Netlify API Token */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-400">Netlify API Token</Label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value={netlifyToken}
                    onChange={e => { setNetlifyToken(e.target.value); setTokenValid(null); }}
                    className="bg-gray-800 border-gray-700 text-white text-sm flex-1"
                    placeholder="nfp_xxxxxxxxxxxxxxxxxx"
                  />
                  <Button size="sm" variant="outline" onClick={verifyNetlifyToken} disabled={isVerifyingToken || !netlifyToken}
                    className={`border-gray-700 text-xs whitespace-nowrap ${tokenValid === true ? 'border-green-600 text-green-400' : tokenValid === false ? 'border-red-600 text-red-400' : 'text-gray-300'}`}>
                    {isVerifyingToken ? <Loader2 className="w-3 h-3 animate-spin" /> : tokenValid === true ? <><CheckCircle2 className="w-3 h-3 mr-1" /> Connected</> : tokenValid === false ? "✗ Invalid" : "Connect"}
                  </Button>
                </div>
                <p className="text-xs text-gray-600">Get yours: Netlify → Avatar → User Settings → Personal access tokens</p>
              </div>

              {/* Site Name + Domain Check (shown after token verified) */}
              {tokenValid && (
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Site Name (your domain on Netlify)</Label>
                  <div className="flex items-center gap-0">
                    <Input
                      value={desiredSlug || siteData.urlSlug}
                      onChange={e => { setDesiredSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")); setSlugAvailable(null); }}
                      className="bg-gray-800 border-gray-700 text-white text-sm rounded-r-none border-r-0 flex-1"
                      placeholder={siteData.urlSlug || "rapid-dry-restoration"}
                    />
                    <span className="text-xs text-gray-400 bg-gray-800 border border-gray-700 px-2 py-2 h-9 flex items-center">.netlify.app</span>
                    <Button size="sm" variant="outline" onClick={checkSlugAvailability} disabled={isCheckingSlug || !netlifyToken}
                      className={`rounded-l-none border-l-0 text-xs h-9 whitespace-nowrap ${slugAvailable === true ? 'border-green-600 text-green-400' : slugAvailable === false ? 'border-red-600 text-red-400' : 'border-gray-700 text-gray-300'}`}>
                      {isCheckingSlug ? <Loader2 className="w-3 h-3 animate-spin" /> : slugAvailable === true ? "✓ Free" : slugAvailable === false ? "✗ Taken" : "Check"}
                    </Button>
                  </div>
                  {slugAvailable === false && <p className="text-xs text-red-400">That name is taken — try a variation like adding your city.</p>}
                  {slugAvailable === true && <p className="text-xs text-green-400">✓ Available! Click Publish below.</p>}
                </div>
              )}

              {/* Publish Button */}
              <Button
                onClick={() => {
                  if (desiredSlug) updateField("urlSlug", desiredSlug);
                  deployToNetlify();
                }}
                disabled={isDeploying || !netlifyToken || !tokenValid || slugAvailable === false}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isDeploying ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Deploying...</>
                ) : (
                  <><Rocket className="w-4 h-4 mr-2" /> {deployedUrl ? "Update to Netlify" : "Publish to Netlify"}</>
                )}
              </Button>
              {!netlifyToken && <p className="text-xs text-center text-gray-600">Enter and verify your Netlify token to publish</p>}
              {netlifyToken && tokenValid && slugAvailable === null && <p className="text-xs text-center text-yellow-500">Check domain availability before publishing</p>}

              <div className="rounded-lg bg-gray-800/50 border border-gray-700/50 p-3">
                <p className="text-xs font-medium text-gray-400 mb-2">✅ Pre-Publish Checklist</p>
                <ul className="space-y-1">
                  {[
                    "Business name and phone are correct",
                    "Services list is accurate",
                    "Service areas listed correctly",
                    "AI content generated (click Regenerate)",
                    "Placeholder images replaced with real photos",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                      <span className="mt-0.5">□</span> {item}
                    </li>
                  ))}
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
              <optgroup label="Core Pages">
                <option value="index.html">Homepage</option>
                <option value="about.html">About Us</option>
                <option value="contact.html">Contact</option>
                <option value="faq.html">FAQ</option>
                <option value="gallery.html">Gallery</option>
                <option value="blog.html">Blog</option>
                <option value="calculator.html">Calculators</option>
              </optgroup>
              {(Array.isArray(siteData.services) && siteData.services.length > 0) && (
                <optgroup label="Service Pages">
                  {siteData.services.map(s => {
                    const slug = `services/${s.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${(siteData.city || "").toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
                    return <option key={s} value={slug}>{s}</option>;
                  })}
                </optgroup>
              )}
              {(Array.isArray(siteData.serviceAreas) && siteData.serviceAreas.length > 0) && (
                <optgroup label="Location Pages">
                  {siteData.serviceAreas.map(l => {
                    const slug = `locations/${l.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
                    return <option key={l} value={slug}>{l}</option>;
                  })}
                </optgroup>
              )}
            </select>

            {deployedUrl && (
              <span className="ml-auto text-xs text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Live: {deployedUrl}
              </span>
            )}
          </div>

          {/* Hidden file input for click-to-upload */}
          <input
            type="file"
            ref={hiddenFileInputRef}
            accept="image/*"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              const key = pendingUploadKeyRef.current;
              if (file && key) handleCustomImageUpload(key, file);
              e.target.value = '';
              pendingUploadKeyRef.current = null;
            }}
          />

          {/* Preview iframe or placeholder */}
          <div className="flex-1 overflow-hidden bg-white">
            {previewBlobUrl ? (
              <iframe
                ref={iframeRef}
                src={previewBlobUrl}
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
