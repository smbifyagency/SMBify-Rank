import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { BarChart3, Search, Globe, Code, Save, Eye, EyeOff } from "lucide-react";

interface SiteSetting {
  id: string;
  category: string;
  name: string;
  displayName: string;
  description: string;
  code: string;
  isActive: boolean;
  placement: string;
}

const DEFAULT_SETTINGS: Partial<SiteSetting>[] = [
  // Analytics
  {
    id: "google-analytics",
    category: "analytics",
    name: "google_analytics",
    displayName: "Google Analytics",
    description: "Track website traffic and user behavior with Google Analytics",
    code: "",
    isActive: true,
    placement: "head",
  },
  {
    id: "facebook-pixel",
    category: "analytics",
    name: "facebook_pixel",
    displayName: "Facebook Pixel",
    description: "Track conversions and build audiences for Facebook ads",
    code: "",
    isActive: true,
    placement: "head",
  },
  // Verification
  {
    id: "google-search-console",
    category: "verification",
    name: "google_search_console",
    displayName: "Google Search Console",
    description: "Verify site ownership with Google Search Console",
    code: "",
    isActive: true,
    placement: "head",
  },
  {
    id: "ahrefs",
    category: "verification",
    name: "ahrefs",
    displayName: "Ahrefs",
    description: "Verify site ownership with Ahrefs Site Audit",
    code: "",
    isActive: true,
    placement: "head",
  },
  // Ads
  {
    id: "adsense-header",
    category: "ads",
    name: "adsense_header",
    displayName: "AdSense Header",
    description: "Display ads at the top of your pages",
    code: "",
    isActive: true,
    placement: "header",
  },
  {
    id: "adsense-sidebar",
    category: "ads",
    name: "adsense_sidebar",
    displayName: "AdSense Sidebar",
    description: "Display ads in the sidebar",
    code: "",
    isActive: true,
    placement: "body_start",
  },
  {
    id: "adsense-footer",
    category: "ads",
    name: "adsense_footer",
    displayName: "AdSense Footer",
    description: "Display ads at the bottom of your pages",
    code: "",
    isActive: true,
    placement: "footer",
  },
  {
    id: "google-ads",
    category: "ads",
    name: "google_ads",
    displayName: "Google Ads",
    description: "Track conversions and retargeting with Google Ads",
    code: "",
    isActive: true,
    placement: "head",
  },
  // Custom
  {
    id: "custom-head-scripts",
    category: "custom",
    name: "custom_head_scripts",
    displayName: "Custom Head Scripts",
    description: "Add custom scripts to the <head> section",
    code: "",
    isActive: true,
    placement: "head",
  },
  {
    id: "custom-footer-scripts",
    category: "custom",
    name: "custom_footer_scripts",
    displayName: "Custom Footer Scripts",
    description: "Add custom scripts before closing </body> tag",
    code: "",
    isActive: true,
    placement: "body_end",
  },
];

export default function SiteSettings() {
  const { toast } = useToast();
  const [showCodes, setShowCodes] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState("analytics");

  // Fetch existing site settings
  const { data: settings, isLoading } = useQuery<SiteSetting[]>({
    queryKey: ["/api/site-settings"],
  });

  // Update site setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async (data: { id: string; code: string }) => {
      return await apiRequest("PUT", `/api/site-settings/${data.id}`, { code: data.code });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const handleSave = (settingId: string, code: string) => {
    updateSettingMutation.mutate({ id: settingId, code });
  };

  const toggleShowCode = (settingId: string) => {
    setShowCodes((prev) => ({
      ...prev,
      [settingId]: !prev[settingId],
    }));
  };

  // Merge default settings with existing settings
  const mergedSettings = DEFAULT_SETTINGS.map((defaultSetting) => {
    const existingSetting = settings?.find((s) => s.id === defaultSetting.id);
    return existingSetting || defaultSetting;
  });

  // Group settings by category
  const settingsByCategory = {
    analytics: mergedSettings.filter((s) => s.category === "analytics"),
    verification: mergedSettings.filter((s) => s.category === "verification"),
    ads: mergedSettings.filter((s) => s.category === "ads"),
    custom: mergedSettings.filter((s) => s.category === "custom"),
  };

  const renderSettingCard = (setting: Partial<SiteSetting>, iconColor: string, IconComponent: any) => (
    <Card key={setting.id} className="bg-white/[0.02] border-white/10 backdrop-blur-sm" data-testid={`card-${setting.id}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center">
            <IconComponent className={`mr-2 h-5 w-5 ${iconColor}`} />
            {setting.displayName}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-gray-300 bg-transparent hover:text-white hover:bg-white/5"
            onClick={() => toggleShowCode(setting.id!)}
            data-testid={`button-toggle-${setting.id}`}
          >
            {showCodes[setting.id!] ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Code
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show Code
              </>
            )}
          </Button>
        </CardTitle>
        <CardDescription className="text-gray-400">{setting.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`code-${setting.id}`} className="text-gray-300">
            {setting.category === 'analytics' ? 'Tracking Code' :
              setting.category === 'verification' ? 'Verification Code' :
                setting.category === 'ads' ? 'Ad Code' : 'Custom Code'}
          </Label>
          <div className="mt-2">
            {showCodes[setting.id!] ? (
              <Textarea
                id={`code-${setting.id}`}
                data-testid={`textarea-${setting.id}`}
                placeholder={`Paste your ${setting.displayName} code here...`}
                defaultValue={setting.code}
                rows={8}
                className="font-mono text-sm bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#7C3AED]"
              />
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-md p-4 h-32 flex items-center justify-center">
                <p className="text-gray-400 text-sm">
                  Click "Show Code" to view and edit the code
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <p className="text-sm text-gray-400">
            Placement: <code className="bg-white/10 text-gray-300 px-2 py-1 rounded">{setting.placement}</code>
          </p>
          <Button
            size="sm"
            className="bg-[#7C3AED] hover:bg-[#9333EA] text-black font-bold text-white border-0"
            onClick={() => {
              const textarea = document.getElementById(`code-${setting.id}`) as HTMLTextAreaElement;
              if (textarea) {
                handleSave(setting.id!, textarea.value);
              }
            }}
            disabled={updateSettingMutation.isPending}
            data-testid={`button-save-${setting.id}`}
          >
            <Save className="h-4 w-4 mr-2" />
            {updateSettingMutation.isPending ? "Saving..." : "Save Code"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Site Settings Dashboard
        </h1>
        <p className="text-gray-400">
          Manage all your site tracking codes, analytics, and custom scripts in one place
        </p>
      </div>

      {/* Quick Start Guide */}
      <Card className="mb-8 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border-[#7C3AED]/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Code className="mr-2 h-6 w-6 text-[#7C3AED]" />
            Quick Start Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-300">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-[#7C3AED] text-black rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <p className="font-semibold text-white">Choose a category</p>
              <p className="text-sm text-gray-400">
                Select from Analytics, Verification, Ads, or Custom tabs
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-[#7C3AED] text-black rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <p className="font-semibold text-white">Get your tracking codes</p>
              <p className="text-sm text-gray-400">
                Sign up for the services you need and copy their tracking codes
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-[#7C3AED] text-black rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <p className="font-semibold text-white">Paste and save</p>
              <p className="text-sm text-gray-400">
                Click "Show Code", paste your tracking code, and click "Save Code"
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-[#7C3AED] text-black rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <p className="font-semibold text-white">Track and analyze</p>
              <p className="text-sm text-gray-400">
                Your codes will be automatically added to all generated websites
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different categories */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8" data-testid="tabs-list">
          <TabsTrigger value="analytics" className="flex items-center gap-2" data-testid="tab-analytics">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="verification" className="flex items-center gap-2" data-testid="tab-verification">
            <Search className="h-4 w-4" />
            Verification
          </TabsTrigger>
          <TabsTrigger value="ads" className="flex items-center gap-2" data-testid="tab-ads">
            <Globe className="h-4 w-4" />
            Ads
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2" data-testid="tab-custom">
            <Code className="h-4 w-4" />
            Custom
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {settingsByCategory.analytics.map((setting) => renderSettingCard(setting, "text-blue-400", BarChart3))}
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          {settingsByCategory.verification.map((setting) => renderSettingCard(setting, "text-emerald-400", Search))}
        </TabsContent>

        <TabsContent value="ads" className="space-y-6">
          {settingsByCategory.ads.map((setting) => renderSettingCard(setting, "text-purple-400", Globe))}
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          {settingsByCategory.custom.map((setting) => renderSettingCard(setting, "text-amber-400", Code))}
        </TabsContent>
      </Tabs>

      {/* Information Card */}
      <Card className="mt-8 bg-white/[0.02] border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">How It Works</CardTitle>
          <CardDescription className="text-gray-400">
            Understanding code placement and integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="font-semibold text-white">Code Placements</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <strong>head:</strong> Inside &lt;head&gt; section
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full mr-2"></span>
                  <strong>body_start:</strong> After &lt;body&gt; tag
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                  <strong>body_end:</strong> Before &lt;/body&gt; tag
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
                  <strong>header/footer:</strong> In specific sections
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-white">Categories</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-blue-400" />
                  <strong>Analytics:</strong> Traffic & behavior tracking
                </li>
                <li className="flex items-center">
                  <Search className="h-4 w-4 mr-2 text-emerald-400" />
                  <strong>Verification:</strong> Site ownership verification
                </li>
                <li className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-purple-400" />
                  <strong>Ads:</strong> Advertisement placements
                </li>
                <li className="flex items-center">
                  <Code className="h-4 w-4 mr-2 text-amber-400" />
                  <strong>Custom:</strong> Your custom scripts
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-sm text-amber-200">
              <strong>Note:</strong> All codes will be automatically integrated into websites generated through the platform. Make sure to test your codes before deploying to production.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
