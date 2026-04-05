import { BusinessData } from "@shared/schema";
import { MapPin, Wrench, Star, Clock, Shield, Users, Award, CheckCircle, Home, ArrowRight, Phone, Mail, Zap, BadgeCheck, HeadphonesIcon, AlertCircle, ExternalLink, Calendar } from "lucide-react";
import { Link } from "wouter";

interface DynamicPageProps {
  businessData: BusinessData;
  pageType: "location" | "service";
  pageName: string;
}

function getCategoryImage(category: string): string {
  const categoryImages: { [key: string]: string } = {
    "Plumbing": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=600&fit=crop&crop=center",
    "HVAC (Heating & Cooling)": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&crop=center",
    "Electrical": "https://images.unsplash.com/photo-1621905741667-64b2d5b5b8b4?w=800&h=600&fit=crop&crop=center",
    "Handyman": "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop&crop=center",
    "Roofing": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center",
    "Landscaping & Lawn Care": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&crop=center",
  };
  
  return categoryImages[category] || "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop&crop=center";
}

export function DynamicPage({ businessData, pageType, pageName }: DynamicPageProps) {
  const isLocation = pageType === "location";
  const pageTitle = isLocation 
    ? pageName
    : `${pageName} Services - ${businessData.businessName}`;
  
  const pageDescription = isLocation
    ? `Professional ${businessData.heroService.toLowerCase()} services in ${pageName}. ${businessData.heroDescription}`
    : `Expert ${pageName.toLowerCase()} services from ${businessData.businessName}. ${businessData.heroDescription}`;
    
  // Parse features for the features section
  const features = businessData.featureHeadlines.split(',').map(f => f.trim()).filter(f => f);
  const descriptions = businessData.featureDescriptions.split(',').map(d => d.trim()).filter(d => d);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                {isLocation ? (
                  <MapPin className="w-6 h-6 text-white" />
                ) : (
                  <Wrench className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-900">
                  {businessData.businessName}
                </h1>
                <div className="flex items-center space-x-2 text-sm">
                  <BadgeCheck className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">Licensed & Insured</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{businessData.yearsInBusiness}+ Years</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <HeadphonesIcon className="w-4 h-4 text-blue-600" />
                <span className="font-medium">24/7 Emergency Service</span>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Call Now</div>
                <a href={`tel:${businessData.phone}`} className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  {businessData.phone}
                </a>
              </div>
              <a href={`tel:${businessData.phone}`} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105">
                Call Now
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        {/* Background elements */}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Hero Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium text-sm">{businessData.yearsInBusiness}+ Years Experience</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="block">{businessData.heroService}</span>
              <span className="block text-4xl lg:text-5xl text-blue-200">in {pageTitle}</span>
            </h1>
            
            {/* Description */}
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              {pageDescription}
            </p>
            
            {/* Hero Features */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white text-sm font-medium">Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-white text-sm font-medium">24/7 Emergency</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-white text-sm font-medium">100% Satisfaction</span>
              </div>
            </div>
            
            {/* CTA Buttons - 3 Column Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12 place-items-center">
              <a
                href={`tel:${businessData.phone}`}
                className="inline-flex items-center justify-center px-6 py-4 bg-white text-blue-900 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-2xl transform hover:scale-105 hover:-translate-y-1"
                data-testid="button-call-hero"
              >
                <Phone className="w-5 h-5 mr-3" />
                Call Now
              </a>
              {businessData.ctaWhatsappNumber ? (
                <a
                  href={`https://wa.me/${businessData.ctaWhatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all duration-300 shadow-2xl transform hover:scale-105 hover:-translate-y-1"
                  data-testid="button-whatsapp-hero"
                >
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  WhatsApp
                </a>
              ) : (
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-6 py-4 bg-blue-700 text-white rounded-xl font-bold text-lg hover:bg-blue-800 transition-all duration-300 shadow-2xl transform hover:scale-105 hover:-translate-y-1"
                  data-testid="button-contact-hero"
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  Get Quote
                </a>
              )}
              {businessData.ctaCustomUrl && businessData.ctaCustomText ? (
                <a
                  href={businessData.ctaCustomUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-all duration-300 shadow-2xl transform hover:scale-105 hover:-translate-y-1"
                  data-testid="button-website-hero"
                >
                  <ExternalLink className="w-5 h-5 mr-3" />
                  Visit Website
                </a>
              ) : (
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-6 py-4 bg-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20"
                  data-testid="button-quote-hero"
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  Get Quote
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side: Content */}
            <div>
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full mb-4">
                  About {businessData.businessName}
                </span>
                <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  About {businessData.businessName} {isLocation ? `in ${pageName}` : ''}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  {businessData.aboutDescription}
                </p>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{businessData.yearsInBusiness}+</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">100%</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Satisfaction</div>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right side: Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src={businessData.aboutImage || getCategoryImage(businessData.category)} 
                  alt={`Professional ${businessData.heroService} in ${isLocation ? pageName : businessData.heroLocation}`}
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-xl border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Quality</div>
                    <div className="text-sm text-gray-600">Guaranteed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section 2 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side: Image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src={businessData.aboutImage2 || getCategoryImage(businessData.category)} 
                  alt={`Trusted ${businessData.heroService} professionals in ${isLocation ? pageName : businessData.heroLocation}`}
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating stats */}
              <div className="absolute -top-6 -right-6 bg-white rounded-xl p-6 shadow-xl border border-gray-100">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">100%</div>
                  <div className="text-sm text-gray-600 font-medium">Satisfaction</div>
                </div>
              </div>
            </div>
            
            {/* Right side: Content */}
            <div className="order-1 lg:order-2">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full mb-4">
                  Trusted Professionals
                </span>
                <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  Trusted {businessData.heroService} Professionals {isLocation ? `in ${pageName}` : ''}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Our dedication to excellence and customer satisfaction has made us the preferred choice for {businessData.heroService.toLowerCase()} services {isLocation ? `in ${pageName}` : 'in the area'}. We combine years of experience with modern techniques to deliver outstanding results.
                </p>
              </div>
              
              {/* Quality badges */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">Quality</div>
                  <div className="text-sm text-gray-600">Guaranteed</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">Expert</div>
                  <div className="text-sm text-gray-600">Service</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">Trusted</div>
                  <div className="text-sm text-gray-600">Professionals</div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex justify-start">
                <a
                  href={`tel:${businessData.phone}`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our {isLocation ? 'Services' : pageName} {isLocation ? `in ${pageName}` : 'Offerings'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional services with upfront pricing and guaranteed satisfaction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessData.services.split(',').map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 hover:border-blue-200 group">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {service.trim()}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Professional {service.trim().toLowerCase()} services with guaranteed satisfaction and upfront pricing.
                </p>
                <div className="mt-4 flex items-center text-blue-600 font-medium text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Emergency service available
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Linking Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore More
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our other service locations and offerings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Back to Home */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-[#7C3AED]/5 to-[#F59E0B]/3 rounded-xl p-6 border border-[#7C3AED]/20">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Home className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Main Office
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Learn more about our company and services
                  </p>
                </div>
                <Link
                  href="/"
                  className="w-full bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] text-white px-4 py-3 rounded-lg font-medium hover:from-[#9333EA] hover:to-[#7C3AED] transition-all duration-300 flex items-center justify-center group"
                >
                  Visit Homepage
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>

            {/* Other Locations */}
            {businessData.additionalLocations && (
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Other Locations
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      We serve these areas too
                    </p>
                  </div>
                  <div className="space-y-2">
                    {businessData.additionalLocations.split(',')
                      .filter(loc => loc.trim().toLowerCase() !== pageName.toLowerCase())
                      .slice(0, 3)
                      .map((location, index) => {
                        const trimmedLocation = location.trim();
                        const locationSlug = encodeURIComponent(trimmedLocation.toLowerCase().replace(/\s+/g, '-'));
                        
                        return (
                          <Link
                            key={index}
                            href={`/location/${locationSlug}`}
                            className="block w-full bg-white/80 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-white hover:text-blue-600 transition-all duration-300 border border-blue-100 hover:border-blue-200"
                          >
                            {trimmedLocation}
                          </Link>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* Other Services */}
            {businessData.additionalServices && (
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wrench className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Other Services
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Explore our full service range
                    </p>
                  </div>
                  <div className="space-y-2">
                    {businessData.additionalServices.split(',')
                      .filter(svc => svc.trim().toLowerCase() !== pageName.toLowerCase())
                      .slice(0, 3)
                      .map((service, index) => {
                        const trimmedService = service.trim();
                        const serviceSlug = encodeURIComponent(trimmedService.toLowerCase().replace(/\s+/g, '-'));
                        
                        return (
                          <Link
                            key={index}
                            href={`/service/${serviceSlug}`}
                            className="block w-full bg-white/80 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-white hover:text-purple-600 transition-all duration-300 border border-purple-100 hover:border-purple-200"
                          >
                            {trimmedService}
                          </Link>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-800 to-blue-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              Contact Us {isLocation ? `in ${pageName}` : `for ${pageName}`}
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
              Ready to get started? Contact our licensed professionals for a free consultation and quote.
            </p>
          </div>
          
          {/* Contact Cards - Improved Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 max-w-6xl mx-auto">
            {/* Call Us */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Phone className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Call Us</h3>
              <p className="text-blue-200 mb-6 text-lg font-medium">{businessData.phone}</p>
              <a
                href={`tel:${businessData.phone}`}
                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg transform hover:scale-105"
                data-testid="button-call-contact"
              >
                Call Now
              </a>
            </div>

            {/* Email Us */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Mail className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Email Us</h3>
              <p className="text-blue-200 mb-6 text-lg font-medium break-all text-center">{businessData.email || 'info@company.com'}</p>
              <a
                href={`mailto:${businessData.email || 'info@company.com'}`}
                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg transform hover:scale-105"
                data-testid="button-email-contact"
              >
                Email Us
              </a>
            </div>

            {/* Service Area */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Service Area</h3>
              <p className="text-blue-200 mb-6 text-lg">Serving {isLocation ? pageName : businessData.heroLocation}</p>
              <a
                href="#services"
                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg transform hover:scale-105"
                data-testid="button-areas-contact"
              >
                View Areas
              </a>
            </div>
          </div>

          {/* CTA Buttons - 3 Column Layout */}
          <div className="text-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto place-items-center">
              <a
                href={`tel:${businessData.phone}`}
                className="inline-flex items-center justify-center px-6 py-4 bg-white text-blue-900 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-2xl transform hover:scale-105 hover:-translate-y-1"
                data-testid="button-call-contact-bottom"
              >
                <Phone className="w-5 h-5 mr-3" />
                Call Now
              </a>
              {businessData.ctaWhatsappNumber ? (
                <a
                  href={`https://wa.me/${businessData.ctaWhatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all duration-300 shadow-2xl transform hover:scale-105 hover:-translate-y-1"
                  data-testid="button-whatsapp-contact-bottom"
                >
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.90-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  WhatsApp
                </a>
              ) : (
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-6 py-4 bg-blue-700 text-white rounded-xl font-bold text-lg hover:bg-blue-800 transition-all duration-300 shadow-2xl transform hover:scale-105 hover:-translate-y-1"
                  data-testid="button-contact-bottom"
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  Get Quote
                </a>
              )}
              {businessData.ctaCustomUrl && businessData.ctaCustomText ? (
                <a
                  href={businessData.ctaCustomUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-all duration-300 shadow-2xl transform hover:scale-105 hover:-translate-y-1"
                  data-testid="button-website-contact-bottom"
                >
                  <ExternalLink className="w-5 h-5 mr-3" />
                  Visit Website
                </a>
              ) : (
                <a
                  href="mailto:info@company.com"
                  className="inline-flex items-center justify-center px-6 py-4 bg-gray-600 text-white rounded-xl font-bold text-lg hover:bg-gray-700 transition-all duration-300 shadow-2xl transform hover:scale-105 hover:-translate-y-1"
                  data-testid="button-email-contact-bottom"
                >
                  <Mail className="w-5 h-5 mr-3" />
                  Email Us
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{businessData.businessName}</h3>
              <p className="text-gray-400 mb-4">{businessData.footerDescription}</p>
              <div className="flex items-center text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                {businessData.address}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <div>Phone: {businessData.phone}</div>
                {businessData.email && <div>Email: {businessData.email}</div>}
                <div>Hours: {businessData.businessHours}</div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href={`tel:${businessData.phone}`}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  Call Now
                </a>
                {businessData.ctaWhatsappNumber && (
                  <a
                    href={`https://wa.me/${businessData.ctaWhatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors"
                  >
                    WhatsApp
                  </a>
                )}
                {businessData.ctaCustomUrl && businessData.ctaCustomText && (
                  <a
                    href={businessData.ctaCustomUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors"
                  >
                    {businessData.ctaCustomText}
                  </a>
                )}
                <div className="text-sm text-gray-400 mt-4">
                  <p>Service Areas: {businessData.serviceAreas}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 {businessData.businessName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}