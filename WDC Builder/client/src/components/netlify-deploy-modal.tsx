import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ExternalLink, Info, Settings } from "lucide-react";
import { BusinessData } from "@shared/schema";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";

interface NetlifyDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessData: BusinessData;
  template: string;
  websiteId?: string;
  customFiles?: Record<string, string>;
  onDeploymentSuccess?: (result: any) => void;
}

export function NetlifyDeployModal({
  isOpen,
  onClose,
  businessData,
  template,
  websiteId,
  customFiles,
  onDeploymentSuccess
}: NetlifyDeployModalProps) {
  const [siteName, setSiteName] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if Netlify API key is configured
  const { data: netlifySetting, isLoading: isLoadingNetlify } = useQuery({
    queryKey: ["/api/settings/netlify"],
    enabled: isOpen
  });

  const { data: existingWebsite, isLoading: isLoadingWebsite } = useQuery({
    queryKey: ["/api/websites", websiteId],
    enabled: isOpen && !!websiteId
  });

  const netlifyToken = (netlifySetting as any)?.apiKey || "";
  const isNetlifyConfigured = netlifyToken && netlifyToken.length > 0;
  const existingSiteName =
    (existingWebsite as any)?.netlifySiteId ||
    ((existingWebsite as any)?.netlifyUrl?.match(/https?:\/\/([^.]+)\.netlify\.app/)?.[1] ?? "");
  const isRedeployMode = Boolean(websiteId && existingSiteName);

  const generateSiteName = () => {
    const businessName = businessData.businessName?.toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 30) || "my-business";

    const timestamp = Date.now().toString().slice(-6);
    return `${businessName}-${timestamp}`;
  };

  // Initialize site name when modal opens
  useEffect(() => {
    if (!isOpen || !isNetlifyConfigured || siteName) return;

    if (isRedeployMode) {
      setSiteName(existingSiteName);
      return;
    }

    if (!isLoadingWebsite) {
      setSiteName(generateSiteName());
    }
  }, [isOpen, isNetlifyConfigured, siteName, isRedeployMode, existingSiteName, isLoadingWebsite]);


  const deployToNetlify = async () => {
    if (!isNetlifyConfigured) {
      toast({
        title: "Netlify API Key Required",
        description: "Please configure your Netlify API key in the API Setup page first",
        variant: "destructive",
      });
      return;
    }

    if (!siteName.trim()) {
      toast({
        title: "Site Name Required",
        description: "Please enter a site name for your website",
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);
    try {
      const response = await fetch("/api/deploy-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessData,
          template,
          netlifyToken,
          siteName: siteName.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
          customDomain: customDomain.trim() || undefined,
          websiteId,
          customFiles,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to deploy website");
      }

      const result = await response.json();
      setDeploymentResult(result);
      onDeploymentSuccess?.(result);
      queryClient.invalidateQueries({ queryKey: ["/api/websites"] });
      if (websiteId) {
        queryClient.invalidateQueries({ queryKey: ["/api/websites", websiteId] });
      }

      toast({
        title: isRedeployMode ? "Redeployment Successful!" : "Deployment Successful!",
        description: `Your website is now live at ${result.siteUrl}`,
      });
    } catch (error) {
      console.error("Deployment error:", error);
      toast({
        title: "Deployment Failed",
        description: error instanceof Error ? error.message : "Failed to deploy website",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const resetModal = () => {
    setSiteName("");
    setCustomDomain("");
    setDeploymentResult(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (deploymentResult) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-600">
              {isRedeployMode ? "🎉 Website Redeployed Successfully!" : "🎉 Website Deployed Successfully!"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Your website is now live!</h3>
              <p className="text-sm text-green-700 mb-3">
                Site: <strong>{deploymentResult.siteName}</strong>
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(deploymentResult.siteUrl, '_blank')}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Your Website
              </Button>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Live URL:</strong> {deploymentResult.siteUrl}</p>
              <p><strong>Deploy ID:</strong> {deploymentResult.deployId}</p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deploy to Netlify</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoadingNetlify ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Checking Netlify configuration...</span>
            </div>
          ) : isLoadingWebsite ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading website deployment settings...</span>
            </div>
          ) : !isNetlifyConfigured ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-amber-800 font-medium mb-2">Netlify API Key Required</p>
                  <p className="text-amber-700 mb-3">
                    You need to configure your Netlify API key before deploying websites.
                    This is now done in the API Setup page for better security.
                  </p>
                  <Link href="/api-setup">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white hover:bg-amber-50"
                      onClick={onClose}
                      data-testid="button-go-to-api-setup"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Go to API Setup
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              {isRedeployMode && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-blue-800 font-medium">
                      CMS Mode: changes will update your existing site ({existingSiteName}.netlify.app)
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Info className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-800 font-medium">
                    ✓ Netlify API key is configured and ready to use
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="your-business-name"
                  disabled={isRedeployMode}
                  data-testid="input-site-name"
                />
                <p className="text-xs text-gray-500">
                  Your site will be available at: {siteName ? `${siteName.toLowerCase().replace(/[^a-z0-9-]/g, "-")}.netlify.app` : "your-site-name.netlify.app"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customDomain">Custom Domain (Optional)</Label>
                <Input
                  id="customDomain"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="www.yourbusiness.com"
                  data-testid="input-custom-domain"
                />
                <p className="text-xs text-gray-500">
                  If specified, this URL will be used in sitemap.xml and robots.txt for SEO optimization. Leave empty to use the Netlify subdomain.
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex-col space-y-2">
          <Button
            onClick={deployToNetlify}
            disabled={!isNetlifyConfigured || !siteName.trim() || isDeploying || isLoadingNetlify || isLoadingWebsite}
            className="w-full"
            data-testid="button-deploy"
          >
            {isDeploying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isRedeployMode ? "Redeploying..." : "Deploying..."}
              </>
            ) : (
              isRedeployMode ? "Redeploy Website" : "Deploy Website"
            )}
          </Button>
          <Button variant="outline" onClick={handleClose} className="w-full">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
