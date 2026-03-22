import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Phone, MapPin, CheckCircle, Clock } from "lucide-react";

interface TemplateData {
    businessName: string;
    phone: string;
    email: string;
    address: string;
    primaryColor: string;
    secondaryColor: string;
    heroHeadline: string;
    heroSubheadline: string;
    aboutText: string;
    youtubeUrl: string;
    services: string[];
    locations: string[];
}

export default function WaterDamageTemplatePreview({ data }: { data: TemplateData }) {

    // Helper functions to parse the comma-separated strings into usable arrays
    const formattedServices = data.services || [];
    const formattedLocations = data.locations || [];

    // Smart YouTube Embed Converter (Takes a standard URL and makes it iframe ready)
    let embedUrl = data.youtubeUrl;
    if (data.youtubeUrl.includes("watch?v=")) {
        embedUrl = data.youtubeUrl.replace("watch?v=", "embed/");
    } else if (data.youtubeUrl.includes("youtu.be/")) {
        embedUrl = data.youtubeUrl.replace("youtu.be/", "www.youtube.com/embed/");
    }

    return (
        <div className="w-full bg-[#f8f9fa] text-gray-900 border-x-4 border-gray-900 mx-auto overflow-y-auto max-h-[800px] shadow-2xl rounded-lg">

            {/* 1. STICKY EMERGENCY HEADER */}
            <div className="sticky top-0 z-50 bg-white border-b shadow-sm" style={{ borderBottomColor: data.primaryColor }}>
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Logo Placeholder */}
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xl" style={{ backgroundColor: data.secondaryColor }}>
                            {data.businessName ? data.businessName.charAt(0).toUpperCase() : 'W'}
                        </div>
                        <span className="font-extrabold text-xl tracking-tight" style={{ color: data.secondaryColor }}>
                            {data.businessName || "Business Name"}
                        </span>
                    </div>

                    <div className="hidden md:flex gap-6 font-medium text-sm text-gray-600">
                        <a href="#services" className="hover:text-black transition-colors">Services</a>
                        <a href="#about" className="hover:text-black transition-colors">About</a>
                        <a href="#locations" className="hover:text-black transition-colors">Locations</a>
                    </div>

                    <a href={`tel:${data.phone.replace(/[^0-9]/g, '')}`}>
                        <Button className="font-bold text-white shadow-lg animate-pulse" style={{ backgroundColor: data.primaryColor }}>
                            <Phone className="mr-2 w-4 h-4" /> 24/7 EMERGENCY: {data.phone || "555-0100"}
                        </Button>
                    </a>
                </div>
            </div>

            {/* 2. HIGH-CONVERTING HERO SECTION */}
            <div className="relative overflow-hidden bg-gray-900 py-24 sm:py-32">
                <div className="absolute inset-0 z-0 bg-[#0f172a]">
                    <img
                        src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80"
                        alt="Water damage restoration background"
                        className="h-full w-full object-cover opacity-20"
                    />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-6 shadow-sm bg-white/10"
                        style={{ color: data.primaryColor }}>
                        <Clock className="w-4 h-4" /> 60-Minute Response Time Guaranteed
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
                        {data.heroHeadline || "Emergency Water Restoration"}
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        {data.heroSubheadline || "Add your subheadline to build trust."}
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                        <a href={`tel:${data.phone.replace(/[^0-9]/g, '')}`}>
                            <Button size="lg" className="w-full sm:w-auto text-lg font-bold text-white shadow-xl hover:opacity-90" style={{ backgroundColor: data.primaryColor }}>
                                Call for Immediate Dispatch
                            </Button>
                        </a>
                        <a href="#about">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg border-white/30 text-white hover:bg-white/10 bg-transparent">
                                Watch Our Process
                            </Button>
                        </a>
                    </div>

                    {/* Trust Signals */}
                    <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-8 text-sm text-gray-400 font-medium">
                        <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" style={{ color: data.primaryColor }} /> IICRC Certified</div>
                        <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" style={{ color: data.primaryColor }} /> Fully Licensed & Insured</div>
                        <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" style={{ color: data.primaryColor }} /> Direct Insurance Billing</div>
                        <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" style={{ color: data.primaryColor }} /> 5-Star Rated</div>
                    </div>
                </div>
            </div>

            {/* 3. DYNAMIC SERVICES GRID */}
            <div id="services" className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Expert Restoration Services</h2>
                        <p className="mt-4 text-lg text-gray-600">Generated automatically from your Service List input.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {formattedServices.length === 0 ? (
                            <div className="col-span-4 text-center text-gray-400 py-10 border-2 border-dashed border-gray-200 rounded-xl">
                                Add comma-separated services in the configurator to see them here.
                            </div>
                        ) : (
                            formattedServices.map((service, index) => (
                                <div key={index} className="bg-gray-50 border border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all text-center group cursor-pointer">
                                    <div className="w-16 h-16 mx-auto bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-3xl mb-6 relative overflow-hidden">
                                        💧
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: data.primaryColor }}></div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{service}</h3>
                                    <p className="text-gray-600 text-sm mb-6">Professional, rapid {service.toLowerCase()} utilizing industry-leading structural drying techniques.</p>
                                    <span style={{ color: data.secondaryColor }} className="font-semibold cursor-pointer hover:underline">
                                        Learn More →
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* 4. ABOUT & RICH MEDIA (YOUTUBE) SECTION */}
            <div id="about" className="py-24 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">Why Choose {data.businessName}?</h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-8 whitespace-pre-line">
                                {data.aboutText || "Add your about text in the configurator to explain your process."}
                            </p>
                            <ul className="space-y-4">
                                {["We handle the insurance paperwork.", "Industrial water extractors and dehumidifiers.", "Prevent secondary mold and structural rot."].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 shrink-0 mt-0.5" style={{ color: data.primaryColor }} />
                                        <span className="text-gray-700 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-10">
                                <Button size="lg" className="font-bold text-white shadow-md hover:opacity-90" style={{ backgroundColor: data.secondaryColor }}>
                                    Request Free Estimate
                                </Button>
                            </div>
                        </div>

                        {/* Dynamic YouTube Video Wrapper */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 aspect-video ring-1 ring-gray-900/10">
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
                                        Paste a YouTube URL in the media tab.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. DYNAMIC LOCATIONS GRID */}
            <div id="locations" className="py-24 bg-white border-t border-gray-100">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-12">Service Areas</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {formattedLocations.length === 0 ? (
                            <div className="text-center text-gray-400 py-4 w-full border-2 border-dashed border-gray-200 rounded-xl">
                                Add your service areas (cities or neighborhoods) in the generator tab.
                            </div>
                        ) : (
                            formattedLocations.map((loc, index) => (
                                <div key={index} className="flex items-center gap-2 px-6 py-3 bg-gray-50 border border-gray-200 rounded-full hover:border-gray-300 hover:shadow-sm hover:-translate-y-0.5 transition-all text-gray-700 font-medium cursor-pointer">
                                    <MapPin className="w-4 h-4" style={{ color: data.primaryColor }} /> {loc}, TX
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* 6. FOOTER */}
            <div className="bg-gray-900 text-gray-400 py-12 border-t border-white/10">
                <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-sm">
                    <div>
                        <span className="font-extrabold text-xl tracking-tight text-white block mb-4">
                            {data.businessName || "Business"}
                        </span>
                        <p>{data.address || "123 Main St"}</p>
                        <p className="mt-2 block font-medium text-white">{data.phone || "555-5555"}</p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                            <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                            <li><a href="#locations" className="hover:text-white transition-colors">Locations</a></li>
                            <li><a href="#about" className="hover:text-white transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="leading-relaxed">Available 24 hours a day, 7 days a week, 365 days a year. We dispatch immediately for water and fire emergencies.</p>
                        <div className="mt-6 flex items-center gap-2 text-white/80"><CheckCircle className="w-5 h-5 text-gray-500" /> Certified Technicians</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
