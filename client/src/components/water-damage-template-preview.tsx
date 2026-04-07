import { Button } from "@/components/ui/button";
import { Phone, MapPin, CheckCircle, Clock } from "lucide-react";

type TemplateVariant = "modern" | "bold" | "classic" | "warm" | "fresh" | "ocean";

interface TemplateData {
    businessName: string;
    phone: string;
    email: string;
    address: string;
    templateVariant?: TemplateVariant;
    primaryColor: string;
    secondaryColor: string;
    heroHeadline: string;
    heroSubheadline: string;
    aboutText: string;
    youtubeUrl: string;
    services: string[];
    locations: string[];
}

const TEMPLATE_VARIANTS: Record<TemplateVariant, {
    shellClassName: string;
    headerClassName: string;
    brandClassName: string;
    logoClassName: string;
    navClassName: string;
    heroClassName: string;
    heroPanelClassName: string;
    heroContentClassName: string;
    badgeClassName: string;
    headingClassName: string;
    textClassName: string;
    secondaryButtonClassName: string;
    trustSignalsClassName: string;
    servicesSectionClassName: string;
    sectionHeadingClassName: string;
    sectionSubheadingClassName: string;
    serviceCardClassName: string;
    serviceIconClassName: string;
    serviceTextClassName: string;
    aboutSectionClassName: string;
    aboutPanelClassName: string;
    locationsSectionClassName: string;
    locationChipClassName: string;
    footerClassName: string;
    footerHeadingClassName: string;
}> = {
    modern: {
        shellClassName: "bg-slate-50 text-slate-900 border-slate-900",
        headerClassName: "bg-white/95 border-slate-200 shadow-sm backdrop-blur",
        brandClassName: "font-extrabold tracking-tight",
        logoClassName: "rounded-full",
        navClassName: "text-slate-600",
        heroClassName: "bg-slate-950 text-white",
        heroPanelClassName: "",
        heroContentClassName: "text-center",
        badgeClassName: "bg-white/10 text-white/90",
        headingClassName: "font-extrabold tracking-tight text-white",
        textClassName: "text-slate-300",
        secondaryButtonClassName: "border-white/30 text-white hover:bg-white/10 bg-transparent",
        trustSignalsClassName: "border-white/10 text-slate-300",
        servicesSectionClassName: "bg-white",
        sectionHeadingClassName: "font-bold tracking-tight text-slate-900",
        sectionSubheadingClassName: "text-slate-600",
        serviceCardClassName: "bg-slate-50 border border-slate-100 rounded-2xl hover:shadow-xl",
        serviceIconClassName: "bg-white border border-slate-100 rounded-xl shadow-sm",
        serviceTextClassName: "text-slate-600",
        aboutSectionClassName: "bg-slate-50",
        aboutPanelClassName: "",
        locationsSectionClassName: "bg-white border-t border-slate-100",
        locationChipClassName: "bg-slate-50 border border-slate-200 rounded-full text-slate-700 hover:border-slate-300 hover:shadow-sm",
        footerClassName: "bg-slate-950 text-slate-400 border-t border-white/10",
        footerHeadingClassName: "text-white",
    },
    bold: {
        shellClassName: "bg-black text-white border-fuchsia-500",
        headerClassName: "bg-slate-950 border-slate-800 shadow-lg",
        brandClassName: "font-black uppercase tracking-[0.16em]",
        logoClassName: "rounded-2xl",
        navClassName: "text-slate-300",
        heroClassName: "text-white",
        heroPanelClassName: "rounded-[2rem] border border-white/10 bg-black/20 shadow-2xl",
        heroContentClassName: "text-left",
        badgeClassName: "bg-black/20 text-white border border-white/10",
        headingClassName: "font-black uppercase tracking-[0.08em] text-white",
        textClassName: "text-slate-200",
        secondaryButtonClassName: "border-white/30 text-white hover:bg-white/10 bg-transparent",
        trustSignalsClassName: "border-white/10 text-slate-200",
        servicesSectionClassName: "bg-slate-950 text-white",
        sectionHeadingClassName: "font-black uppercase tracking-[0.08em] text-white",
        sectionSubheadingClassName: "text-slate-300",
        serviceCardClassName: "bg-slate-900 border border-slate-800 rounded-3xl hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]",
        serviceIconClassName: "bg-black/30 border border-white/10 rounded-2xl",
        serviceTextClassName: "text-slate-300",
        aboutSectionClassName: "bg-slate-900 text-white",
        aboutPanelClassName: "rounded-[2rem] border border-white/10 bg-black/10 p-8",
        locationsSectionClassName: "bg-black border-t border-slate-800",
        locationChipClassName: "bg-slate-900 border border-slate-700 rounded-2xl text-slate-100 hover:border-slate-500 hover:shadow-lg",
        footerClassName: "bg-black text-slate-400 border-t border-slate-800",
        footerHeadingClassName: "text-white",
    },
    classic: {
        shellClassName: "bg-stone-100 text-stone-900 border-stone-400",
        headerClassName: "bg-stone-50 border-stone-300 shadow-sm",
        brandClassName: "font-serif text-[1.25rem] tracking-[0.06em]",
        logoClassName: "rounded-md",
        navClassName: "text-stone-600",
        heroClassName: "text-stone-900",
        heroPanelClassName: "rounded-[2rem] border border-stone-300 bg-white/90 shadow-xl",
        heroContentClassName: "text-left",
        badgeClassName: "bg-stone-200/80 text-stone-700 border border-stone-300",
        headingClassName: "font-serif font-bold tracking-tight text-stone-900",
        textClassName: "text-stone-600",
        secondaryButtonClassName: "border-stone-400 text-stone-800 hover:bg-stone-100 bg-transparent",
        trustSignalsClassName: "border-stone-200 text-stone-600",
        servicesSectionClassName: "bg-stone-50",
        sectionHeadingClassName: "font-serif font-bold tracking-tight text-stone-900",
        sectionSubheadingClassName: "text-stone-600",
        serviceCardClassName: "bg-white border border-stone-200 rounded-lg hover:shadow-lg",
        serviceIconClassName: "bg-stone-50 border border-stone-200 rounded-lg",
        serviceTextClassName: "text-stone-600",
        aboutSectionClassName: "bg-white",
        aboutPanelClassName: "rounded-[1.5rem] border border-stone-200 bg-stone-50 p-8",
        locationsSectionClassName: "bg-stone-50 border-t border-stone-200",
        locationChipClassName: "bg-white border border-stone-300 rounded-full text-stone-700 hover:border-stone-400 hover:shadow-sm",
        footerClassName: "bg-stone-900 text-stone-300 border-t border-stone-700",
        footerHeadingClassName: "text-white font-serif",
    },
    warm: {
        shellClassName: "bg-amber-50 text-stone-900 border-orange-300",
        headerClassName: "bg-white/90 border-amber-200 shadow-sm backdrop-blur",
        brandClassName: "font-bold tracking-tight",
        logoClassName: "rounded-2xl",
        navClassName: "text-stone-600",
        heroClassName: "text-white",
        heroPanelClassName: "rounded-[2rem] border border-white/20 bg-white/10 shadow-2xl",
        heroContentClassName: "text-left",
        badgeClassName: "bg-white/15 text-amber-50 border border-white/10",
        headingClassName: "font-extrabold tracking-tight text-white",
        textClassName: "text-amber-50/90",
        secondaryButtonClassName: "border-white/30 text-white hover:bg-white/10 bg-transparent",
        trustSignalsClassName: "border-white/10 text-amber-50/85",
        servicesSectionClassName: "bg-amber-50",
        sectionHeadingClassName: "font-bold tracking-tight text-stone-900",
        sectionSubheadingClassName: "text-stone-600",
        serviceCardClassName: "bg-white border border-amber-100 rounded-3xl hover:shadow-xl",
        serviceIconClassName: "bg-amber-50 border border-amber-100 rounded-2xl",
        serviceTextClassName: "text-stone-600",
        aboutSectionClassName: "bg-orange-50",
        aboutPanelClassName: "rounded-[2rem] border border-amber-100 bg-white/80 p-8",
        locationsSectionClassName: "bg-amber-50 border-t border-amber-100",
        locationChipClassName: "bg-white border border-amber-200 rounded-full text-stone-700 hover:border-orange-300 hover:shadow-sm",
        footerClassName: "bg-stone-900 text-amber-100/70 border-t border-stone-700",
        footerHeadingClassName: "text-white",
    },
    fresh: {
        shellClassName: "bg-emerald-50 text-slate-900 border-emerald-300",
        headerClassName: "bg-white/90 border-emerald-100 shadow-sm backdrop-blur",
        brandClassName: "font-bold tracking-tight",
        logoClassName: "rounded-[1.25rem]",
        navClassName: "text-emerald-900/70",
        heroClassName: "text-slate-900",
        heroPanelClassName: "rounded-[2rem] border border-emerald-100 bg-white/85 shadow-xl",
        heroContentClassName: "text-left",
        badgeClassName: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        headingClassName: "font-extrabold tracking-tight text-slate-900",
        textClassName: "text-slate-600",
        secondaryButtonClassName: "border-emerald-300 text-emerald-900 hover:bg-emerald-50 bg-transparent",
        trustSignalsClassName: "border-emerald-100 text-slate-600",
        servicesSectionClassName: "bg-white",
        sectionHeadingClassName: "font-bold tracking-tight text-slate-900",
        sectionSubheadingClassName: "text-slate-600",
        serviceCardClassName: "bg-emerald-50/60 border border-emerald-100 rounded-[2rem] hover:shadow-xl",
        serviceIconClassName: "bg-white border border-emerald-100 rounded-[1.5rem]",
        serviceTextClassName: "text-slate-600",
        aboutSectionClassName: "bg-emerald-50",
        aboutPanelClassName: "rounded-[2rem] border border-emerald-100 bg-white/80 p-8",
        locationsSectionClassName: "bg-white border-t border-emerald-100",
        locationChipClassName: "bg-emerald-50 border border-emerald-200 rounded-full text-slate-700 hover:border-emerald-300 hover:shadow-sm",
        footerClassName: "bg-emerald-950 text-emerald-100/70 border-t border-emerald-900",
        footerHeadingClassName: "text-white",
    },
    ocean: {
        shellClassName: "bg-slate-950 text-white border-cyan-400",
        headerClassName: "bg-slate-950/85 border-cyan-900 shadow-lg backdrop-blur",
        brandClassName: "font-extrabold tracking-[0.04em]",
        logoClassName: "rounded-full ring-2 ring-cyan-400/30",
        navClassName: "text-cyan-100/80",
        heroClassName: "text-white",
        heroPanelClassName: "rounded-[2rem] border border-cyan-300/15 bg-slate-950/30 shadow-2xl backdrop-blur-sm",
        heroContentClassName: "text-left",
        badgeClassName: "bg-cyan-400/10 text-cyan-100 border border-cyan-300/20",
        headingClassName: "font-extrabold tracking-tight text-white",
        textClassName: "text-cyan-50/80",
        secondaryButtonClassName: "border-cyan-200/30 text-white hover:bg-cyan-100/10 bg-transparent",
        trustSignalsClassName: "border-cyan-200/10 text-cyan-50/80",
        servicesSectionClassName: "bg-slate-950 text-white",
        sectionHeadingClassName: "font-bold tracking-tight text-white",
        sectionSubheadingClassName: "text-cyan-50/70",
        serviceCardClassName: "bg-slate-900/90 border border-cyan-400/10 rounded-3xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]",
        serviceIconClassName: "bg-slate-950 border border-cyan-300/15 rounded-2xl",
        serviceTextClassName: "text-cyan-50/75",
        aboutSectionClassName: "bg-slate-900 text-white",
        aboutPanelClassName: "rounded-[2rem] border border-cyan-300/10 bg-slate-950/20 p-8",
        locationsSectionClassName: "bg-slate-950 border-t border-cyan-300/10",
        locationChipClassName: "bg-slate-900 border border-cyan-300/15 rounded-full text-cyan-50 hover:border-cyan-300/30 hover:shadow-lg",
        footerClassName: "bg-black text-cyan-100/60 border-t border-cyan-300/10",
        footerHeadingClassName: "text-white",
    },
};

function toEmbedUrl(url: string): string {
    if (!url) return "";
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/")) return url.replace("youtu.be/", "www.youtube.com/embed/");
    return url;
}

function getHeroStyle(data: TemplateData, variantKey: TemplateVariant) {
    switch (variantKey) {
        case "bold":
            return { background: `linear-gradient(135deg, ${data.primaryColor} 0%, ${data.secondaryColor} 100%)` };
        case "classic":
            return { background: "linear-gradient(180deg, #f8f5ef 0%, #ece5d8 100%)" };
        case "warm":
            return { background: `linear-gradient(135deg, ${data.secondaryColor} 0%, ${data.primaryColor} 100%)` };
        case "fresh":
            return { background: "linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)" };
        case "ocean":
            return { background: `radial-gradient(circle at top, ${data.secondaryColor}55 0%, transparent 38%), linear-gradient(135deg, #082f49 0%, #0f172a 100%)` };
        default:
            return { background: "linear-gradient(135deg, #0f172a 0%, #111827 100%)" };
    }
}

function getHeroImageClassName(variantKey: TemplateVariant) {
    switch (variantKey) {
        case "classic":
            return "h-full w-full object-cover opacity-10 sepia";
        case "fresh":
            return "h-full w-full object-cover opacity-15 saturate-50";
        case "ocean":
            return "h-full w-full object-cover opacity-15 hue-rotate-15";
        case "bold":
            return "h-full w-full object-cover opacity-25 mix-blend-overlay";
        default:
            return "h-full w-full object-cover opacity-20";
    }
}

export default function WaterDamageTemplatePreview({ data }: { data: TemplateData }) {
    const variantKey = data.templateVariant || "modern";
    const variant = TEMPLATE_VARIANTS[variantKey];
    const formattedServices = data.services || [];
    const formattedLocations = data.locations || [];
    const embedUrl = toEmbedUrl(data.youtubeUrl || "");
    const isLightHero = variantKey === "classic" || variantKey === "fresh";
    const callHref = `tel:${data.phone.replace(/[^0-9]/g, "")}`;

    return (
        <div
            className={`w-full mx-auto overflow-y-auto max-h-[800px] shadow-2xl rounded-lg border-x-4 ${variant.shellClassName}`}
            style={{ borderColor: data.primaryColor }}
        >
            <div className={`sticky top-0 z-50 border-b ${variant.headerClassName}`} style={{ borderBottomColor: `${data.primaryColor}33` }}>
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div
                            className={`w-10 h-10 flex items-center justify-center font-bold text-white text-xl shrink-0 ${variant.logoClassName}`}
                            style={{ backgroundColor: data.secondaryColor }}
                        >
                            {data.businessName ? data.businessName.charAt(0).toUpperCase() : "W"}
                        </div>
                        <span className={`text-xl truncate ${variant.brandClassName}`} style={{ color: variantKey === "classic" ? data.primaryColor : data.secondaryColor }}>
                            {data.businessName || "Business Name"}
                        </span>
                    </div>

                    <div className={`hidden md:flex gap-6 font-medium text-sm ${variant.navClassName}`}>
                        <a href="#services" className="hover:text-current transition-colors">Services</a>
                        <a href="#about" className="hover:text-current transition-colors">About</a>
                        <a href="#locations" className="hover:text-current transition-colors">Locations</a>
                    </div>

                    <a href={callHref}>
                        <Button className="font-bold text-white shadow-lg hover:opacity-90" style={{ backgroundColor: data.primaryColor }}>
                            <Phone className="mr-2 w-4 h-4" /> 24/7 EMERGENCY: {data.phone || "555-0100"}
                        </Button>
                    </a>
                </div>
            </div>

            <div className={`relative overflow-hidden py-24 sm:py-32 ${variant.heroClassName}`} style={getHeroStyle(data, variantKey)}>
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80"
                        alt="Water damage restoration background"
                        className={getHeroImageClassName(variantKey)}
                    />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-4">
                    <div className={variant.heroPanelClassName ? `${variant.heroPanelClassName} p-8 sm:p-12` : ""}>
                        <div className={variant.heroContentClassName}>
                            <span
                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-6 shadow-sm ${variant.badgeClassName}`}
                                style={{ color: isLightHero ? data.primaryColor : undefined }}
                            >
                                <Clock className="w-4 h-4" /> 60-Minute Response Time Guaranteed
                            </span>
                            <h1 className={`text-4xl md:text-6xl mb-6 ${variant.headingClassName}`}>{data.heroHeadline || "Emergency Water Restoration"}</h1>
                            <p className={`mt-6 text-lg md:text-xl max-w-2xl leading-relaxed ${variant.textClassName} ${variant.heroContentClassName === "text-center" ? "mx-auto" : ""}`}>
                                {data.heroSubheadline || "Add your subheadline to build trust."}
                            </p>

                            <div className={`mt-10 flex flex-col sm:flex-row gap-4 ${variant.heroContentClassName === "text-center" ? "justify-center" : "justify-start"}`}>
                                <a href={callHref}>
                                    <Button size="lg" className="w-full sm:w-auto text-lg font-bold text-white shadow-xl hover:opacity-90" style={{ backgroundColor: data.primaryColor }}>
                                        Call for Immediate Dispatch
                                    </Button>
                                </a>
                                <a href="#about">
                                    <Button size="lg" variant="outline" className={`w-full sm:w-auto text-lg ${variant.secondaryButtonClassName}`}>
                                        Watch Our Process
                                    </Button>
                                </a>
                            </div>

                            <div className={`mt-12 pt-8 border-t flex flex-wrap gap-8 text-sm font-medium ${variant.trustSignalsClassName} ${variant.heroContentClassName === "text-center" ? "justify-center" : "justify-start"}`}>
                                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" style={{ color: data.primaryColor }} /> IICRC Certified</div>
                                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" style={{ color: data.primaryColor }} /> Fully Licensed & Insured</div>
                                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" style={{ color: data.primaryColor }} /> Direct Insurance Billing</div>
                                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" style={{ color: data.primaryColor }} /> 5-Star Rated</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="services" className={`py-24 ${variant.servicesSectionClassName}`}>
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className={`text-3xl sm:text-4xl ${variant.sectionHeadingClassName}`}>Expert Restoration Services</h2>
                        <p className={`mt-4 text-lg ${variant.sectionSubheadingClassName}`}>Raw template layout using your service list, before any AI-generated page content is created.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {formattedServices.length === 0 ? (
                            <div className="col-span-4 text-center text-gray-400 py-10 border-2 border-dashed border-gray-200 rounded-xl">
                                Add services in the wizard to see the raw template populate here.
                            </div>
                        ) : (
                            formattedServices.map((service, index) => (
                                <div key={index} className={`p-8 transition-all text-center group cursor-pointer ${variant.serviceCardClassName}`}>
                                    <div className={`w-16 h-16 mx-auto flex items-center justify-center text-3xl mb-6 relative overflow-hidden ${variant.serviceIconClassName}`}>
                                        💧
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: data.primaryColor }}></div>
                                    </div>
                                    <h3 className={`text-xl font-bold mb-3 ${variantKey === "bold" || variantKey === "ocean" ? "text-white" : "text-slate-900"}`}>{service}</h3>
                                    <p className={`text-sm mb-6 ${variant.serviceTextClassName}`}>Professional, rapid {service.toLowerCase()} with a raw layout preview of the sections that will be filled once generation runs.</p>
                                    <span style={{ color: data.secondaryColor }} className="font-semibold cursor-pointer hover:underline">
                                        Learn More →
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div id="about" className={`py-24 ${variant.aboutSectionClassName}`}>
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className={variant.aboutPanelClassName}>
                            <h2 className={`text-3xl mb-6 ${variant.sectionHeadingClassName}`}>Why Choose {data.businessName}?</h2>
                            <p className={`text-lg leading-relaxed mb-8 whitespace-pre-line ${variant.sectionSubheadingClassName}`}>
                                {data.aboutText || "Add your about text in the wizard to explain your process."}
                            </p>
                            <ul className="space-y-4">
                                {["We handle the insurance paperwork.", "Industrial water extractors and dehumidifiers.", "Prevent secondary mold and structural rot."].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 shrink-0 mt-0.5" style={{ color: data.primaryColor }} />
                                        <span className={variantKey === "bold" || variantKey === "ocean" ? "text-slate-100 font-medium" : "text-slate-700 font-medium"}>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-10">
                                <Button size="lg" className="font-bold text-white shadow-md hover:opacity-90" style={{ backgroundColor: data.secondaryColor }}>
                                    Request Free Estimate
                                </Button>
                            </div>
                        </div>

                        <div className={`relative overflow-hidden aspect-video ring-1 shadow-2xl ${variantKey === "classic" ? "rounded-[1.5rem] bg-stone-900 ring-stone-300/30" : "rounded-[2rem] bg-slate-900 ring-slate-900/10"}`}>
                            {embedUrl ? (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={embedUrl}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute inset-0 w-full h-full"
                                ></iframe>
                            ) : (
                                <div className="absolute inset-0 w-full h-full flex items-center justify-center text-gray-500 font-medium border-2 border-dashed border-gray-700/50 m-4 rounded-xl">
                                    <div className="text-center">
                                        <div className="mx-auto w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center mb-3">▶</div>
                                        Paste a YouTube URL to preview the raw media section.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div id="locations" className={`py-24 ${variant.locationsSectionClassName}`}>
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className={`text-3xl mb-12 ${variant.sectionHeadingClassName}`}>Service Areas</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {formattedLocations.length === 0 ? (
                            <div className="text-center text-gray-400 py-4 w-full border-2 border-dashed border-gray-200 rounded-xl">
                                Add service areas in the wizard to see the raw location layout here.
                            </div>
                        ) : (
                            formattedLocations.map((loc, index) => (
                                <div key={index} className={`flex items-center gap-2 px-6 py-3 transition-all cursor-pointer ${variant.locationChipClassName}`}>
                                    <MapPin className="w-4 h-4" style={{ color: data.primaryColor }} /> {loc}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className={`py-12 ${variant.footerClassName}`}>
                <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-sm">
                    <div>
                        <span className={`text-xl tracking-tight block mb-4 ${variant.footerHeadingClassName} ${variant.brandClassName}`}>
                            {data.businessName || "Business"}
                        </span>
                        <p>{data.address || "123 Main St"}</p>
                        <p className={`mt-2 block font-medium ${variant.footerHeadingClassName}`}>{data.phone || "555-5555"}</p>
                    </div>
                    <div>
                        <h4 className={`font-semibold mb-4 ${variant.footerHeadingClassName}`}>Company</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                            <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                            <li><a href="#locations" className="hover:text-white transition-colors">Locations</a></li>
                            <li><a href="#about" className="hover:text-white transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="leading-relaxed">Available 24 hours a day, 7 days a week, 365 days a year. This preview only shows the selected template structure before AI page generation.</p>
                        <div className={`mt-6 flex items-center gap-2 ${variant.footerHeadingClassName}`}><CheckCircle className="w-5 h-5" style={{ color: data.primaryColor }} /> Certified Technicians</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
