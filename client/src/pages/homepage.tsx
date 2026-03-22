import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { 
  Globe, 
  Zap, 
  Shield, 
  Users, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Sparkles,
  Target,
  Rocket,
  Award,
  TrendingUp,
  Clock,
  Phone,
  LogIn
} from "lucide-react";

export default function Homepage() {
  const { isAuthenticated } = useAuth();
  const features = [
    {
      icon: <Globe className="h-8 w-8 text-blue-600" />,
      title: "200+ Business Categories",
      description: "Automatic industry-specific templates and images for every business type"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "AI-Powered Content",
      description: "Generate professional content, SEO optimization, and blog posts instantly"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Local SEO Optimized",
      description: "Built-in schema markup and local search optimization"
    },
    {
      icon: <Target className="h-8 w-8 text-purple-600" />,
      title: "Conversion Focused",
      description: "Professional designs that turn visitors into customers"
    }
  ];

  const benefits = [
    "Professional websites in minutes, not weeks",
    "Automatic industry-relevant images",
    "Mobile-responsive designs",
    "Local business schema markup",
    "SEO-optimized content",
    "Social media integration",
    "Contact forms and CTAs",
    "Blog functionality included"
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      business: "Elite Plumbing Services",
      content: "LocalSite Builder helped me create a professional website that actually brings in customers. The automatic images and content made it so easy!",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      business: "Rodriguez Landscaping",
      content: "I was amazed how quickly I could build a complete website. The local SEO features have helped my business show up in Google searches.",
      rating: 5
    },
    {
      name: "Jennifer Chen",
      business: "Bright Smile Dental",
      content: "The templates are beautiful and the AI content generation saved me hours of work. My patients love the professional look.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Public Navigation Header (shown when not authenticated) */}
      {!isAuthenticated && (
        <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">
                  LocalSite Builder
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="default" size="sm" asChild>
                  <Link href="/dashboard/websites">
                    <Rocket className="h-4 w-4 mr-2" />
                    Start Building Free
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200">
              <Sparkles className="h-4 w-4 mr-2" />
              200+ Business Categories Supported
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Build Stunning 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Local Business </span>
              Websites
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Create professional, SEO-optimized websites with automatic industry images, 
              AI-powered content, and local business optimization. No coding required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all" asChild>
                <Link href="/dashboard/websites">
                  <Rocket className="h-5 w-5 mr-2" />
                  {isAuthenticated ? "Start Building Now" : "Login to Build"}
                </Link>
              </Button>
              {isAuthenticated && (
                <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-blue-600 px-8 py-4 text-lg font-semibold" asChild>
                  <Link href="/dashboard">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    View Dashboard
                  </Link>
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">200+</div>
                <div className="text-gray-600">Business Types</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">5 Min</div>
                <div className="text-gray-600">Setup Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                <div className="text-gray-600">Mobile Ready</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">SEO</div>
                <div className="text-gray-600">Optimized</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Everything Your Business Needs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional website features designed specifically for local service businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl mb-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Why Choose LocalSite Builder?
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Join thousands of local businesses who trust our platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-4">
                <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg" asChild>
              <Link href="/dashboard/websites">
                {isAuthenticated ? "Get Started Today" : "Login to Get Started"}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Trusted by Local Businesses
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers say about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <p className="text-blue-600 font-medium">{testimonial.business}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-12 text-white">
            <Award className="h-16 w-16 mx-auto mb-6 text-yellow-400" />
            <h2 className="text-4xl font-bold mb-6">
              Ready to Build Your Professional Website?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of successful local businesses. Create your website in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg" asChild>
                <Link href="/dashboard/websites">
                  <Rocket className="h-5 w-5 mr-2" />
                  {isAuthenticated ? "Start Building Now" : "Start Building Free - No Signup Required"}
                </Link>
              </Button>
              <div className="text-blue-200">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">Setup in 5 minutes • No credit card required</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4 text-blue-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Free to start</span>
              </div>
              <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Professional templates</span>
              </div>
              <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Expert support</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}