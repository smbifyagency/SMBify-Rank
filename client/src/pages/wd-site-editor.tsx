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
  Globe, Phone, MapPin, FileText, Layers, Edit3, Sparkles, Wand2, Trash2
} from "lucide-react";
import { generateLocalServiceWebsite } from "../lib/local-service-engine";
import { getCategoryConfig } from "../lib/local-service-categories";
import { VisualEditor } from "@/components/visual-editor";

type AIProvider = "openai" | "gemini" | "openrouter";

const isAIProvider = (value: unknown): value is AIProvider =>
  value === "openai" || value === "gemini" || value === "openrouter";

// ── Premade color palettes for non-tech users ─────────────────────────────
const COLOR_PALETTES = [
  { name: "Ocean Blue",    primary: "#1e3a5f", secondary: "#0ea5e9" },
  { name: "Forest Green",  primary: "#14532d", secondary: "#22c55e" },
  { name: "Sunset Fire",   primary: "#7c2d12", secondary: "#f97316" },
  { name: "Royal Purple",  primary: "#3b0764", secondary: "#a855f7" },
  { name: "Navy Elite",    primary: "#172554", secondary: "#3b82f6" },
  { name: "Cherry Red",    primary: "#7f1d1d", secondary: "#ef4444" },
  { name: "Teal Modern",   primary: "#134e4a", secondary: "#14b8a6" },
  { name: "Golden Pro",    primary: "#713f12", secondary: "#eab308" },
  { name: "Rose Pink",     primary: "#881337", secondary: "#f43f5e" },
  { name: "Emerald",       primary: "#064e3b", secondary: "#059669" },
  { name: "Slate Gray",    primary: "#1e293b", secondary: "#64748b" },
  { name: "Copper",        primary: "#431407", secondary: "#c2410c" },
  { name: "Indigo",        primary: "#1e1b4b", secondary: "#6366f1" },
  { name: "Cyan Fresh",    primary: "#083344", secondary: "#06b6d4" },
  { name: "Midnight",      primary: "#0f172a", secondary: "#475569" },
  { name: "Charcoal",      primary: "#111827", secondary: "#9ca3af" },
] as const;

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
  contentAiProvider?: AIProvider;
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
  // Blog posts
  blogPosts?: Array<{id: string; title: string; slug: string; excerpt: string; content: string; featuredImage?: string; featuredImageAlt?: string; metaTitle?: string; metaDescription?: string; category?: string; tags?: string[]; keywords?: string; isAiGenerated?: boolean}>;
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

// Sample data for each category — used only by the "Fill sample" button during testing.
// Never persisted automatically; AI still generates all actual content.
function getSampleData(catId: string): Partial<WDSiteData> {
  const config = getCategoryConfig(catId);
  const bizName = `Austin ${config.name}`;
  const slug = bizName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return {
    businessName: bizName,
    phone: '(512) 555-0182',
    email: `info@${slug}.com`,
    address: '4821 Oak Hollow Drive',
    city: 'Austin',
    state: 'TX',
    primaryKeyword: config.defaultPrimaryKeyword,
    services: config.defaultServices.slice(0, 8),
    serviceAreas: ['Austin', 'Round Rock', 'Cedar Park', 'Georgetown', 'Pflugerville'],
    urlSlug: slug,
    primaryColor: config.defaultPalette.primary,
    secondaryColor: config.defaultPalette.secondary,
  };
}

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

// Convert WDSiteData → the shape the generator expects
function siteDataToWDData(data: WDSiteData): Record<string, any> {
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
    logoUrl: (data as any).logoUrl,
    faviconUrl: (data as any).faviconUrl,
    customHeadCode: (data as any).customHeadCode,
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
    contentAiProvider: data.contentAiProvider,
    galleryImages: data.galleryImages,
    _aiIntroParas: (data as any)._aiIntroParas,
    _aiFaqs: (data as any)._aiFaqs,
    _aiSeoBody: (data as any)._aiSeoBody,
    _aiProcessSteps: (data as any)._aiProcessSteps,
    blogPosts: data.blogPosts || [],
    generateBlog: (data.blogPosts && data.blogPosts.length > 0) ? true : false,
  } as any;
}

/** Strip deployment-only fields before storing businessData — these live in
 *  their own DB columns (deployed_url, status) and must not pollute businessData. */
function stripDeploymentFields(data: WDSiteData) {
  const { netlifyUrl: _a, deploymentStatus: _b, netlifyApiKey: _c, ...rest } = data as any;
  return rest;
}

// ─── Blog Writer Section ────────────────────────────────────────────────────

interface BlogWriterSectionProps {
  siteData: WDSiteData;
  onPostsChange: (posts: WDSiteData['blogPosts']) => void;
}

function BlogWriterSection({ siteData, onPostsChange }: BlogWriterSectionProps) {
  const [keywords, setKeywords] = useState('');
  const [wordCount, setWordCount] = useState(1500);
  const [aiProvider, setAiProvider] = useState<AIProvider>(siteData.contentAiProvider || 'openai');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [errors, setErrors] = useState<string[]>([]);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const { toast } = useToast();

  const posts = siteData.blogPosts || [];
  const keywordLines = keywords.split('\n').map(k => k.trim()).filter(k => k.length > 0);

  async function generateBlogs() {
    if (keywordLines.length === 0) {
      toast({ title: "No keywords", description: "Add at least one keyword (one per line).", variant: "destructive" });
      return;
    }
    if (keywordLines.length > 30) {
      toast({ title: "Too many keywords", description: "Maximum 30 keywords allowed at a time.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    setErrors([]);
    setProgress({ current: 0, total: keywordLines.length });

    const newPosts: NonNullable<WDSiteData['blogPosts']> = [...posts];

    for (let i = 0; i < keywordLines.length; i++) {
      const keyword = keywordLines[i];
      setCurrentKeyword(keyword);
      setProgress({ current: i + 1, total: keywordLines.length });

      try {
        const res = await fetch('/api/ai/blog-post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            businessName: siteData.businessName,
            category: siteData.primaryKeyword,
            location: `${siteData.city}, ${siteData.state}`,
            services: siteData.services?.join(', ') || '',
            serviceAreas: siteData.serviceAreas?.join(', ') || '',
            keyword,
            wordCount,
            useImages: true,
            aiProvider,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          if (res.status === 504) {
            throw new Error('Timeout — try Gemini or OpenRouter (faster)');
          }
          throw new Error(errData.message || `HTTP ${res.status}`);
        }

        const data = await res.json();
        if (data.success && data.blogPost) {
          newPosts.push({
            ...data.blogPost,
            id: data.blogPost.id || `blog-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            isAiGenerated: true,
            date: new Date().toISOString().split('T')[0],
          });
          // Update in real-time so user sees progress
          onPostsChange([...newPosts]);
        } else {
          throw new Error(data.message || 'Unknown error');
        }
      } catch (err) {
        const msg = `"${keyword}": ${err instanceof Error ? err.message : String(err)}`;
        setErrors(prev => [...prev, msg]);
      }
    }

    setIsGenerating(false);
    setCurrentKeyword('');
    setKeywords(''); // Clear input after generation
    toast({
      title: "Blog generation complete",
      description: `Generated ${newPosts.length - posts.length} of ${keywordLines.length} posts.`,
    });
  }

  function removePost(id: string) {
    onPostsChange(posts.filter(p => p.id !== id));
  }

  function removeAllPosts() {
    onPostsChange([]);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-gray-300">Blog Writer</h3>
        {posts.length > 0 && (
          <span className="text-xs bg-[#AADD00]/20 text-[#AADD00] px-2 py-0.5 rounded-full font-medium">
            {posts.length} post{posts.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Enter keywords line by line. Each keyword generates a separate blog post with its own AI call (no token limit issues).
      </p>

      {/* Keyword Input */}
      <div className="space-y-2">
        <Label className="text-xs text-gray-400">Keywords (one per line)</Label>
        <textarea
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-500 focus:border-[#AADD00] focus:ring-1 focus:ring-[#AADD00] transition resize-none"
          rows={6}
          placeholder={`water damage restoration tips\nmold prevention guide\nflood cleanup process\nemergency water removal\nhow to dry water damage`}
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
          disabled={isGenerating}
        />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{keywordLines.length} keyword{keywordLines.length !== 1 ? 's' : ''} entered</span>
          <span>Max 30 per batch</span>
        </div>
      </div>

      {/* Settings Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-gray-400">Word Count</Label>
          <select
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm text-gray-200"
            value={wordCount}
            onChange={e => setWordCount(Number(e.target.value))}
            disabled={isGenerating}
          >
            <option value={500}>Short (500w)</option>
            <option value={800}>Medium (800w)</option>
            <option value={1200}>Long (1200w)</option>
            <option value={1500}>Extended (1500w)</option>
            <option value={2000}>Full (2000w)</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-gray-400">AI Provider</Label>
          <select
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm text-gray-200"
            value={aiProvider}
            onChange={e => setAiProvider(e.target.value as AIProvider)}
            disabled={isGenerating}
          >
            <option value="openai">OpenAI</option>
            <option value="gemini">Gemini</option>
            <option value="openrouter">OpenRouter</option>
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={generateBlogs}
        disabled={isGenerating || keywordLines.length === 0}
        className="w-full bg-[#AADD00] hover:bg-[#99CC00] text-gray-900 font-semibold"
      >
        {isGenerating ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Writing post {progress.current}/{progress.total}...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            Generate {keywordLines.length || ''} Blog Post{keywordLines.length !== 1 ? 's' : ''}
          </span>
        )}
      </Button>

      {/* Progress */}
      {isGenerating && (
        <div className="space-y-2">
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-[#AADD00] h-2 rounded-full transition-all duration-500"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            Writing: "{currentKeyword}"
          </p>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 space-y-1">
          <p className="text-xs font-medium text-red-400">Failed ({errors.length}):</p>
          {errors.map((err, i) => (
            <p key={i} className="text-xs text-red-300">{err}</p>
          ))}
        </div>
      )}

      {/* Generated Posts List */}
      {posts.length > 0 && (
        <div className="space-y-2 border-t border-gray-800 pt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Generated Posts</h4>
            <button
              onClick={removeAllPosts}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
              disabled={isGenerating}
            >
              Remove All
            </button>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {posts.map((post, idx) => (
              <div key={post.id} className="bg-gray-800/70 border border-gray-700 rounded-lg overflow-hidden">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-800 transition-colors"
                  onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                >
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="text-sm text-gray-200 font-medium truncate">{post.title}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{post.keywords || post.category}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-500">#{idx + 1}</span>
                    <button
                      onClick={e => { e.stopPropagation(); removePost(post.id); }}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1"
                      title="Remove post"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    {expandedPost === post.id ? <ChevronUp className="w-3 h-3 text-gray-500" /> : <ChevronDown className="w-3 h-3 text-gray-500" />}
                  </div>
                </div>
                {expandedPost === post.id && (
                  <div className="border-t border-gray-700 p-3 space-y-2">
                    {post.featuredImage && (
                      <img src={post.featuredImage} alt={post.featuredImageAlt || ''} className="w-full h-32 object-cover rounded-md" />
                    )}
                    <p className="text-xs text-gray-400">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {post.tags?.map((tag, ti) => (
                        <span key={ti} className="text-[10px] bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">{tag}</span>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-600 mt-1">{post.content?.length || 0} chars • {post.metaTitle}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Note */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 mt-4">
        <p className="text-xs text-gray-500 leading-relaxed">
          <Sparkles className="w-3 h-3 inline mr-1 text-[#AADD00]" />
          Each keyword triggers a separate AI API call with full 1500-2000 word generation. This avoids token limit errors.
          After generating, click <strong className="text-gray-400">Regenerate</strong> to rebuild the website with your blog posts included.
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function WDSiteEditor() {
  const [location, setLocation] = useLocation();
  const websiteId = location.split("/dashboard/wd-editor/")[1]?.split("/")[0] || null;
  const { toast } = useToast();

  const [siteData, setSiteData] = useState<WDSiteData | null>(null);
  const [categoryId, setCategoryId] = useState("water-damage");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
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
  const [showVisualEditor, setShowVisualEditor] = useState(false);
  const [visualEditorOverrides, setVisualEditorOverrides] = useState<Record<string, string>>({});
  const [aiProvider, setAiProvider] = useState<AIProvider>("gemini");
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
      const loadedSiteData: WDSiteData = {
        id: data.id,
        businessName: bd.businessName || data.title || "",
        phone: bd.phone || "",
        email: bd.email || "",
        address: bd.address || "",
        city: bd.city || "",
        state: bd.state || "",
        primaryKeyword: bd.primaryKeyword || bd.categoryId && getCategoryConfig(bd.categoryId).defaultPrimaryKeyword || "Water Damage Restoration",
        services: Array.isArray(bd.services) ? bd.services : bd.services ? String(bd.services).split(/[\n;]/).map((s: string) => s.trim()).filter(Boolean) : [],
        serviceAreas: Array.isArray(bd.serviceAreas) ? bd.serviceAreas : bd.serviceAreas ? String(bd.serviceAreas).split(/[\n;]/).map((s: string) => s.trim()).filter(Boolean) : [],
        urlSlug: bd.urlSlug || "",
        primaryColor: bd.primaryColor || "#1e3a5f",
        secondaryColor: bd.secondaryColor || "#0ea5e9",
        contactFormEmbed: bd.contactFormEmbed || "",
        openaiApiKey: bd.openaiApiKey || "",
        geminiApiKey: bd.geminiApiKey || "",
        contentAiProvider: isAIProvider(bd.contentAiProvider)
          ? bd.contentAiProvider
          : bd.geminiApiKey
            ? "gemini"
            : bd.openaiApiKey
              ? "openai"
              : "gemini",
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
        blogPosts: Array.isArray(bd.blogPosts) ? bd.blogPosts : [],
        logoUrl: bd.logoUrl,
        faviconUrl: bd.faviconUrl,
        customHeadCode: bd.customHeadCode || "",
        _aiIntroParas: bd._aiIntroParas,
        _aiFaqs: bd._aiFaqs,
        _aiSeoBody: bd._aiSeoBody,
        _aiProcessSteps: bd._aiProcessSteps,
        netlifyUrl: data.netlifyUrl,
        deploymentStatus: data.netlifyDeploymentStatus,
      } as any;
      setSiteData(loadedSiteData);
      if (loadedSiteData.contentAiProvider) setAiProvider(loadedSiteData.contentAiProvider as AIProvider);
      if (data.netlifyUrl) setDeployedUrl(data.netlifyUrl);
      if (data.template) setCategoryId(data.template);

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
        fetch("/api/settings/openrouter", { credentials: "include" }).then(r => r.ok ? r.json() : null).catch(() => null),
      ]).then(([openai, gemini, openrouter]) => {
        const hasKey = (openai?.apiKey) || (gemini?.apiKey) || (openrouter?.apiKey) || bd.openaiApiKey || bd.geminiApiKey;
        setApiStatus(hasKey ? "ready" : "none");
      });

      // Try to load pre-generated files (stored as customFiles in DB)
      if (data.customFiles && typeof data.customFiles === "object" && Object.keys(data.customFiles).length > 0) {
        setGeneratedFiles(data.customFiles);
        // Do NOT set visualEditorOverrides from customFiles — generatedFiles already contains
        // them and overrides should only be set during live Visual Editor edits this session.
        // Setting overrides here would prevent image uploads from refreshing the preview.
      } else {
        // No saved files — auto-generate client-side so preview & Visual Editor work immediately
        try {
          const domain = (loadedSiteData as any).urlSlug || ((loadedSiteData.businessName || 'my-site').toLowerCase().replace(/[^a-z0-9]+/g, '-'));
          const catId = (data.template as string) || 'water-damage';
          const autoFiles = generateLocalServiceWebsite(catId, siteDataToWDData(loadedSiteData as any), domain);
          setGeneratedFiles(autoFiles);
        } catch (e) {
          console.error('Auto-generate preview failed:', e);
        }
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
        setVisualEditorOverrides({});
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

  // ── AI Content Generation ─────────────────────────────────────────────

  async function generateAIContent() {
    if (!websiteId || !siteData) return;
    setIsGeneratingAI(true);
    try {
      const res = await fetch(`/api/websites/${websiteId}/generate-local-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ aiProvider }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 402) {
          toast({ title: "No AI API key", description: "Add or save an OpenAI, Gemini, or OpenRouter key first.", variant: "destructive" });
        } else {
          throw new Error(errData.error || `Server error ${res.status}`);
        }
        return;
      }
      const data = await res.json();
      const content = data.content || {};
      // Merge AI fields into siteData and rebuild preview
      const next = {
        ...siteData,
        _aiIntroParas: content.introParas,
        _aiFaqs: content.faqs,
        _aiSeoBody: content.seoBody,
        _aiProcessSteps: content.processSteps,
      } as any;
      setSiteData(next);
      rebuildPreview(next);
      toast({ title: "AI content generated!", description: "Preview updated with unique content." });
    } catch (err) {
      toast({ title: "Generation failed", description: String(err), variant: "destructive" });
    } finally {
      setIsGeneratingAI(false);
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

    // Show animation immediately so user knows the button was clicked
    setIsDeploying(true);

    const slug = (desiredSlug || siteData.urlSlug || "").trim();

    // Guard: check if another website in this account already uses the same slug
    try {
      const dbRes = await fetch("/api/websites", { credentials: "include" });
      if (dbRes.ok) {
        const allSites = await dbRes.json();
        const conflict = allSites.find((s: any) => {
          if (String(s.id) === String(websiteId)) return false;
          const siteUrl: string = s.netlifyUrl || s.businessData?.urlSlug || "";
          return siteUrl.toLowerCase().includes(slug.toLowerCase());
        });
        if (conflict) {
          const conflictName = (conflict.businessData as any)?.businessName || conflict.title || "Another site";
          const proceed = window.confirm(
            `⚠️ WARNING: "${conflictName}" is already deployed to a URL that contains "${slug}".\n\nDeploying will OVERWRITE that site's content on Netlify.\n\nAre you sure you want to continue?`
          );
          if (!proceed) {
            setIsDeploying(false);
            return;
          }
        }
      }
    } catch { /* non-blocking — let deploy proceed if the check fails */ }

    try {
      // Save latest changes (including logo) to DB before reading on server
      await fetch(`/api/websites/${websiteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ businessData: stripDeploymentFields(siteData) }),
      });

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

  // ── Unpublish site ────────────────────────────────────────────────────
  async function unpublishSite() {
    if (!websiteId) return;
    const confirmed = window.confirm(
      "Unpublish this site?\n\nThe live Netlify URL will stop working and you'll be able to delete this website. This cannot be undone from here."
    );
    if (!confirmed) return;
    setIsUnpublishing(true);
    try {
      const res = await fetch(`/api/websites/${websiteId}/unpublish`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to unpublish");
      setDeployedUrl("");
      toast({ title: "Unpublished", description: "The site has been unpublished. You can now delete it if needed." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsUnpublishing(false);
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
      // 1. Check if another website in THIS account already uses this slug
      const dbRes = await fetch("/api/websites", { credentials: "include" });
      if (dbRes.ok) {
        const allSites = await dbRes.json();
        const conflict = allSites.find((s: any) => {
          if (String(s.id) === String(websiteId)) return false; // skip current site
          const siteUrl: string = s.netlifyUrl || s.businessData?.urlSlug || "";
          const slug = desiredSlug.toLowerCase();
          return siteUrl.toLowerCase().includes(slug);
        });
        if (conflict) {
          const conflictName = (conflict.businessData as any)?.businessName || conflict.title || "Another site";
          toast({
            title: "URL Conflict",
            description: `"${conflictName}" already uses this URL. Deploying here will overwrite that site. Choose a different name.`,
            variant: "destructive",
          });
          setSlugAvailable(false);
          return;
        }
      }

      // 2. Check Netlify API — is this slug free on Netlify?
      const res = await fetch(`https://api.netlify.com/api/v1/sites?filter=all&name=${desiredSlug}`, {
        headers: { Authorization: `Bearer ${netlifyToken}` }
      });
      if (!res.ok) throw new Error("API error");
      const sites = await res.json();
      // If taken but it IS our own previously deployed site (same id in DB), allow it
      const netTaken = Array.isArray(sites) && sites.some((s: any) => s.name === desiredSlug);
      setSlugAvailable(!netTaken);
    } catch {
      toast({ title: "Check failed", description: "Could not verify availability.", variant: "destructive" });
    } finally {
      setIsCheckingSlug(false);
    }
  }

  // ── Image upload ──────────────────────────────────────────────────────

  // Rebuild the preview files client-side (pure template, no AI, instant)
  function rebuildPreview(data: WDSiteData) {
    try {
      const domain = data.urlSlug || data.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newFiles = generateLocalServiceWebsite(categoryId, siteDataToWDData(data), domain);
      setGeneratedFiles(newFiles);
      // Clear visual editor overrides so the freshly generated HTML (with new images) is shown
      setVisualEditorOverrides({});
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
    const html = visualEditorOverrides[previewPage] || generatedFiles[previewPage] || generatedFiles['index.html'] || '';
    const withScript = html.replace('</body>', PREVIEW_CLICK_SCRIPT + '</body>');
    const blob = new Blob([withScript], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setPreviewBlobUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [generatedFiles, previewPage, visualEditorOverrides]);

  // ── Visual Editor helpers ─────────────────────────────────────────────

  function mergeBodyIntoDocument(baseHtml: string, bodyHtml: string): string {
    if (!bodyHtml?.trim()) return baseHtml;
    const bodyTagMatch = baseHtml.match(/<body[^>]*>/i);
    if (!bodyTagMatch) return bodyHtml;
    const bodyOpenTag = bodyTagMatch[0];
    return baseHtml.replace(/<body[^>]*>[\s\S]*<\/body>/i, `${bodyOpenTag}\n${bodyHtml}\n</body>`);
  }

  function getCurrentPageHtml(): string {
    return visualEditorOverrides[previewPage] || generatedFiles[previewPage] || generatedFiles['index.html'] || '';
  }

  async function handleVisualEditorSave(bodyHtml: string, _css: string) {
    const baseHtml = generatedFiles[previewPage] || generatedFiles['index.html'] || '';
    const mergedHtml = mergeBodyIntoDocument(baseHtml, bodyHtml);
    const newOverrides = { ...visualEditorOverrides, [previewPage]: mergedHtml };
    setVisualEditorOverrides(newOverrides);
    setShowVisualEditor(false);

    if (websiteId) {
      try {
        await fetch(`/api/websites/${websiteId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ customFiles: newOverrides }),
        });
      } catch { /* silent */ }
    }
    toast({ title: "Visual edits saved", description: "Changes applied to preview." });
  }

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
            <p className="text-xs text-gray-400">{siteData.city}, {siteData.state} • {getCategoryConfig(categoryId).name}</p>
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
          <Button variant="outline" size="sm" onClick={regenerateFiles} disabled={isRegenerating} className="border-amber-600 bg-amber-600/10 text-amber-400 hover:bg-amber-600/20 hover:text-amber-300 font-medium">
            {isRegenerating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <RefreshCw className="w-4 h-4 mr-1" />}
            Regenerate
          </Button>
          {autoSaveStatus === "saving" && (
            <span className="text-xs text-gray-500 whitespace-nowrap">Saving...</span>
          )}
          {autoSaveStatus === "saved" && (
            <span className="text-xs text-green-500 whitespace-nowrap">✓ Saved</span>
          )}
          <Button variant="outline" size="sm" onClick={saveChanges} disabled={isSaving} className="border-blue-600 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 hover:text-blue-300 font-medium">
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
          <Button size="sm" onClick={deployToNetlify} disabled={isDeploying} className="bg-[#AADD00] hover:bg-[#bef000] text-black font-bold shadow-md">
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
              <TabsTrigger value="ai" className="flex-1 rounded-none text-xs py-3 data-[state=active]:bg-gray-800">
                <Sparkles className="w-3 h-3 mr-1" />AI
              </TabsTrigger>
              <TabsTrigger value="images" className="flex-1 rounded-none text-xs py-3 data-[state=active]:bg-gray-800">
                <ImageIcon className="w-3 h-3 mr-1" />Images
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex-1 rounded-none text-xs py-3 data-[state=active]:bg-gray-800">
                <Edit3 className="w-3 h-3 mr-1" />Blog
              </TabsTrigger>
              <TabsTrigger value="deploy" className="flex-1 rounded-none text-xs py-3 data-[state=active]:bg-gray-800">
                <Rocket className="w-3 h-3 mr-1" />Deploy
              </TabsTrigger>
            </TabsList>

            {/* ── Business Info Tab ───────────────────────────────────── */}
            <TabsContent value="business" className="p-4 space-y-4 mt-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-300">Business Information</h3>
                <button
                  type="button"
                  title="Fill form with sample data for testing"
                  onClick={() => {
                    const sample = getSampleData(categoryId);
                    const next = { ...siteData, ...sample } as WDSiteData;
                    setSiteData(next);
                    rebuildPreview(next);
                  }}
                  className="text-[10px] px-2 py-1 rounded bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white transition-colors"
                >
                  Fill sample data
                </button>
              </div>

              <div className="space-y-3">
                {/* Color Theme — shown first so it's easy to find */}
                <div>
                  <Label className="text-xs text-gray-400">Color Theme</Label>
                  <div className="grid grid-cols-4 gap-1.5 mt-2">
                    {COLOR_PALETTES.map(palette => {
                      const isActive =
                        siteData.primaryColor === palette.primary &&
                        siteData.secondaryColor === palette.secondary;
                      return (
                        <button
                          key={palette.name}
                          title={palette.name}
                          onClick={() => {
                            const next = { ...siteData, primaryColor: palette.primary, secondaryColor: palette.secondary };
                            setSiteData(next as any);
                            rebuildPreview(next as any);
                          }}
                          className={`rounded overflow-hidden text-left transition-transform hover:scale-105 focus:outline-none ${
                            isActive ? "ring-2 ring-[#AADD00] ring-offset-1 ring-offset-gray-900" : "ring-1 ring-white/10"
                          }`}
                        >
                          <div className="flex h-6">
                            <div className="w-3/5" style={{ backgroundColor: palette.primary }} />
                            <div className="w-2/5" style={{ backgroundColor: palette.secondary }} />
                          </div>
                          <div className="bg-gray-800 px-1 py-0.5">
                            <span className="text-[9px] text-gray-300 leading-none block truncate">{palette.name}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

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
                  <Label className="text-xs text-gray-500">Preferred AI Provider</Label>
                  <select
                    value={aiProvider}
                    onChange={e => { setAiProvider(e.target.value as AIProvider); updateField("contentAiProvider", e.target.value); }}
                    className="mt-1 w-full h-10 px-3 rounded-md bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-[#AADD00]"
                  >
                    <option value="gemini">Google Gemini</option>
                    <option value="openai">OpenAI</option>
                    <option value="openrouter">OpenRouter</option>
                  </select>
                </div>
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
                <p className="text-xs text-gray-600">Provider + keys saved here are used for future AI generation. Click <strong>Save</strong> after changing them.</p>
                {(siteData.openaiApiKey || siteData.geminiApiKey) && (
                  <p className="text-xs text-green-400">✓ Key entered — click Save to apply</p>
                )}
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
                <Button variant="outline" size="sm" onClick={regenerateFiles} disabled={isRegenerating} className="border-amber-600 bg-amber-600/10 text-amber-400 hover:bg-amber-600/20 text-xs font-medium">
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

              {/* Local-service AI content summary */}
              {!siteData.homepageContent && ((siteData as any)._aiIntroParas || (siteData as any)._aiFaqs || (siteData as any)._aiSeoBody || (siteData as any)._aiProcessSteps) && (
                <div className="rounded-lg border border-green-800 bg-green-950/40 p-4 space-y-2">
                  <p className="text-xs font-semibold text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> AI content generated
                  </p>
                  {(siteData as any)._aiIntroParas && (
                    <div className="text-xs text-gray-400 space-y-1">
                      <p className="text-gray-500 font-medium">Intro paragraphs:</p>
                      {((siteData as any)._aiIntroParas as string[]).map((p: string, i: number) => (
                        <p key={i} className="line-clamp-2 text-gray-400">{p}</p>
                      ))}
                    </div>
                  )}
                  {(siteData as any)._aiFaqs && (
                    <div className="text-xs text-gray-400 space-y-1 border-t border-gray-700 pt-2">
                      <p className="text-gray-500 font-medium">FAQs ({((siteData as any)._aiFaqs as any[]).length}):</p>
                      {((siteData as any)._aiFaqs as any[]).slice(0, 3).map((faq: any, i: number) => (
                        <p key={i} className="truncate">Q: {faq.question}</p>
                      ))}
                      {((siteData as any)._aiFaqs as any[]).length > 3 && (
                        <p className="text-gray-600">+ {((siteData as any)._aiFaqs as any[]).length - 3} more</p>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-gray-600 pt-1">Go to the <button onClick={() => setActiveTab("ai")} className="text-[#AADD00] underline">AI tab</button> to regenerate.</p>
                </div>
              )}

              {!siteData.homepageContent && !(siteData as any)._aiIntroParas && (
                <div className="rounded-lg border border-dashed border-gray-700 p-6 text-center">
                  <Sparkles className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No AI content generated yet.</p>
                  <p className="text-xs text-gray-600 mt-1">Go to the <button onClick={() => setActiveTab("ai")} className="text-[#AADD00] underline">AI tab</button> to generate unique content.</p>
                </div>
              )}
            </TabsContent>

            {/* ── AI Content Tab ──────────────────────────────────────── */}
            <TabsContent value="ai" className="p-4 space-y-4 mt-0">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-gray-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#AADD00]" />
                  AI Content Generator
                </h3>
                <p className="text-xs text-gray-500">
                  Generate unique, SEO-optimized content for your website — intro paragraphs, FAQs, process steps, and an SEO body. Requires an AI API key in Settings.
                </p>
              </div>

              {/* AI Provider selector */}
              <div className="space-y-1">
                <Label className="text-xs text-gray-400">AI Provider</Label>
                <select
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                  value={aiProvider}
                  onChange={e => setAiProvider(e.target.value as AIProvider)}
                >
                  <option value="openai">OpenAI</option>
                  <option value="gemini">Gemini</option>
                  <option value="openrouter">OpenRouter</option>
                </select>
              </div>

              {/* Status badges */}
              {((siteData as any)._aiIntroParas || (siteData as any)._aiFaqs || (siteData as any)._aiSeoBody || (siteData as any)._aiProcessSteps) && (
                <div className="rounded-lg border border-green-800 bg-green-950/40 p-3 space-y-1.5">
                  <p className="text-xs font-semibold text-green-400 mb-2">Generated content active:</p>
                  {(siteData as any)._aiIntroParas && (
                    <div className="flex items-center gap-2 text-xs text-green-300">
                      <CheckCircle2 className="w-3 h-3" /> Intro paragraphs ({((siteData as any)._aiIntroParas as string[]).length})
                    </div>
                  )}
                  {(siteData as any)._aiProcessSteps && (
                    <div className="flex items-center gap-2 text-xs text-green-300">
                      <CheckCircle2 className="w-3 h-3" /> Process steps ({((siteData as any)._aiProcessSteps as any[]).length})
                    </div>
                  )}
                  {(siteData as any)._aiFaqs && (
                    <div className="flex items-center gap-2 text-xs text-green-300">
                      <CheckCircle2 className="w-3 h-3" /> FAQs ({((siteData as any)._aiFaqs as any[]).length})
                    </div>
                  )}
                  {(siteData as any)._aiSeoBody && (
                    <div className="flex items-center gap-2 text-xs text-green-300">
                      <CheckCircle2 className="w-3 h-3" /> SEO body text
                    </div>
                  )}
                </div>
              )}

              {/* Generate button */}
              <Button
                onClick={generateAIContent}
                disabled={isGeneratingAI || apiStatus === "none"}
                className="w-full bg-[#AADD00] hover:bg-[#bef000] text-black font-bold"
              >
                {isGeneratingAI ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" />Generating with AI...</>
                ) : (siteData as any)._aiIntroParas ? (
                  <><Wand2 className="w-4 h-4 mr-2" />Regenerate AI Content</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" />Generate Content with AI</>
                )}
              </Button>

              {apiStatus === "none" && (
                <div className="rounded-lg border border-yellow-800 bg-yellow-950/40 p-3 text-xs text-yellow-400">
                  No AI API key configured. Go to <strong>Settings → API Keys</strong> to add your OpenAI, Gemini, or OpenRouter key.
                </div>
              )}

              {!(siteData as any)._aiIntroParas && apiStatus !== "none" && (
                <div className="rounded-lg border border-dashed border-gray-700 p-5 text-center">
                  <Sparkles className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No AI content yet.</p>
                  <p className="text-xs text-gray-600 mt-1">Click the button above to generate unique content for this business.</p>
                </div>
              )}
            </TabsContent>

            {/* ── Images Tab ──────────────────────────────────────────── */}
            <TabsContent value="images" className="p-4 space-y-4 mt-0">

              {/* ── Logo & Favicon ─────────────────────────────────────── */}
              <div className="rounded-lg border border-gray-700 p-3 space-y-3">
                <h3 className="font-semibold text-sm text-gray-300">Logo &amp; Favicon</h3>

                {/* Logo */}
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Site Logo</Label>
                  <div className="flex items-center gap-3">
                    {(siteData as any).logoUrl ? (
                      <div className="relative w-20 h-12 bg-gray-800 rounded flex items-center justify-center overflow-hidden border border-gray-700">
                        <img src={(siteData as any).logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                        <button
                          onClick={() => {
                            setSiteData(prev => prev ? { ...prev, logoUrl: undefined } as any : prev);
                          }}
                          className="absolute top-0.5 right-0.5 bg-red-800 text-white rounded text-[10px] w-4 h-4 flex items-center justify-center leading-none"
                          title="Remove logo"
                        >✕</button>
                      </div>
                    ) : (
                      <div className="w-20 h-12 bg-gray-800 rounded flex items-center justify-center border border-dashed border-gray-600 text-gray-500 text-xs">
                        No logo
                      </div>
                    )}
                    <label className="cursor-pointer flex-1">
                      <div className="flex items-center justify-center gap-2 border border-dashed border-gray-600 rounded-md py-2 px-3 text-xs text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors">
                        <ImageIcon className="w-3 h-3" />
                        {(siteData as any).logoUrl ? "Replace logo..." : "Upload logo (PNG/SVG)..."}
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = ev => {
                          const url = ev.target?.result as string;
                          setSiteData(prev => prev ? { ...prev, logoUrl: url } as any : prev);
                          toast({ title: "Logo updated", description: "Save to apply." });
                        };
                        reader.readAsDataURL(file);
                        e.target.value = "";
                      }} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-600">Appears in the site header and footer. PNG or SVG recommended. Will be embedded in the generated site.</p>
                </div>

                {/* Favicon */}
                <div className="space-y-2 border-t border-gray-700 pt-3">
                  <Label className="text-xs text-gray-400">Favicon (Browser Tab Icon)</Label>
                  <div className="flex items-center gap-3">
                    {(siteData as any).faviconUrl ? (
                      <div className="relative w-10 h-10 bg-gray-800 rounded flex items-center justify-center overflow-hidden border border-gray-700">
                        <img src={(siteData as any).faviconUrl} alt="Favicon" className="max-w-full max-h-full object-contain" />
                        <button
                          onClick={() => {
                            setSiteData(prev => prev ? { ...prev, faviconUrl: undefined } as any : prev);
                          }}
                          className="absolute -top-0.5 -right-0.5 bg-red-800 text-white rounded text-[10px] w-4 h-4 flex items-center justify-center leading-none"
                          title="Remove favicon"
                        >✕</button>
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center border border-dashed border-gray-600 text-gray-500 text-[10px] text-center leading-tight">
                        No icon
                      </div>
                    )}
                    <label className="cursor-pointer flex-1">
                      <div className="flex items-center justify-center gap-2 border border-dashed border-gray-600 rounded-md py-2 px-3 text-xs text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors">
                        <ImageIcon className="w-3 h-3" />
                        {(siteData as any).faviconUrl ? "Replace favicon..." : "Upload favicon (ICO/PNG/SVG)..."}
                      </div>
                      <input type="file" accept="image/*,.ico" className="hidden" onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = ev => {
                          const url = ev.target?.result as string;
                          setSiteData(prev => prev ? { ...prev, faviconUrl: url } as any : prev);
                          toast({ title: "Favicon updated", description: "Save to apply." });
                        };
                        reader.readAsDataURL(file);
                        e.target.value = "";
                      }} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-600">Shows in the browser tab. 32×32 or 64×64 PNG/ICO/SVG recommended.</p>
                </div>
              </div>

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

            {/* ── Blog Writer Tab ─────────────────────────────────────── */}
            <TabsContent value="blog" className="p-4 space-y-4 mt-0">
              <BlogWriterSection
                siteData={siteData!}
                onPostsChange={(posts) => setSiteData(prev => prev ? { ...prev, blogPosts: posts } : prev)}
              />
            </TabsContent>

            {/* ── Deploy Tab ──────────────────────────────────────────── */}
            <TabsContent value="deploy" className="p-4 space-y-4 mt-0">
              <h3 className="font-semibold text-sm text-gray-300">{deployedUrl ? "Update on Netlify" : "Publish to Netlify"}</h3>
              <p className="text-xs text-gray-500">{deployedUrl ? "Push your latest changes to the live site." : "Complete your website first (Business + Content tabs), then publish here."}</p>

              {deployedUrl && (
                <div className="rounded-lg bg-green-900/30 border border-green-800 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Live Site
                    </div>
                    <button
                      onClick={unpublishSite}
                      disabled={isUnpublishing}
                      className="text-xs px-2 py-1 rounded bg-red-900/40 border border-red-800/60 text-red-400 hover:bg-red-900/70 hover:text-red-300 transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {isUnpublishing ? "Unpublishing..." : "Unpublish"}
                    </button>
                  </div>
                  <a href={deployedUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-green-300 underline break-all">
                    {deployedUrl}
                  </a>
                  <p className="text-xs text-gray-500 mt-1.5">Unpublish to remove this site from Netlify and enable deletion.</p>
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

              {/* Google Analytics */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-400">Google Analytics 4 ID <span className="text-gray-600">(optional)</span></Label>
                <Input
                  value={(siteData as any).googleAnalyticsId || ""}
                  onChange={e => updateField("googleAnalyticsId", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white text-sm"
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="text-xs text-gray-600">Google Analytics → Admin → Data Streams → your stream → Measurement ID (starts with G-)</p>
              </div>

              {/* Google Search Console Verification */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-400">Google Search Console Verification <span className="text-gray-600">(optional but recommended)</span></Label>
                <Input
                  value={(siteData as any).googleVerificationCode || ""}
                  onChange={e => updateField("googleVerificationCode", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white text-sm"
                  placeholder="e.g. abc123xyz..."
                />
                <p className="text-xs text-gray-600">Google Search Console → Add Property → HTML tag → copy only the content= value. Phir redeploy karo aur GSC me sitemap submit karo: yoursite.netlify.app/sitemap.xml</p>
              </div>

              {/* Custom Head Code */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-400">
                  Custom Head Code <span className="text-gray-600">(optional)</span>
                </Label>
                <Textarea
                  value={(siteData as any).customHeadCode || ""}
                  onChange={e => updateField("customHeadCode", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white text-xs font-mono min-h-[90px] resize-y"
                  placeholder={`<!-- Paste any <meta>, <script>, or <link> tags here -->\n<!-- Examples: Bing Webmaster, Pinterest, Facebook Pixel, custom fonts -->\n<meta name="msvalidate.01" content="...">\n<meta name="p:domain_verify" content="...">`}
                  spellCheck={false}
                />
                <p className="text-xs text-gray-600">Yahan koi bhi tag paste kar sakte hain jo website ki har page ki &lt;head&gt; mein inject ho jaaye — Bing, Pinterest, Facebook Pixel, ya koi bhi third-party verification ya script.</p>
              </div>

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
              <optgroup label="Calculator Pages">
                <option value="calculators/cost-estimator.html">Cost Estimator</option>
                <option value="calculators/drying-time.html">Drying Time</option>
                <option value="calculators/mold-risk.html">Mold Risk</option>
                <option value="calculators/insurance-estimator.html">Insurance Estimator</option>
                <option value="calculators/dehumidifier-sizing.html">Dehumidifier Sizing</option>
                <option value="calculators/restore-vs-replace.html">Restore vs Replace</option>
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

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVisualEditor(true)}
              disabled={Object.keys(generatedFiles).length === 0}
              className="ml-auto border-[#AADD00]/60 bg-[#AADD00]/10 text-[#AADD00] hover:bg-[#AADD00]/20 font-medium text-xs h-7 px-2"
            >
              <Edit3 className="w-3 h-3 mr-1" /> Visual Editor
            </Button>

            {deployedUrl && (
              <span className="text-xs text-green-400 flex items-center gap-1">
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

      {/* Visual Editor Modal */}
      <VisualEditor
        initialHtml={getCurrentPageHtml()}
        globalCss={''}
        isOpen={showVisualEditor}
        onClose={() => setShowVisualEditor(false)}
        onSave={handleVisualEditorSave}
      />
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
