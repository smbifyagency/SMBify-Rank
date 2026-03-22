import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Website } from "@shared/schema";
import { ExternalLink } from "lucide-react";

interface EditLiveUrlButtonProps {
  website: Website;
}

export function EditLiveUrlButton({ website }: EditLiveUrlButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newSiteName, setNewSiteName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateUrlMutation = useMutation({
    mutationFn: async (siteName: string) => {
      return apiRequest("POST", `/api/websites/${website.id}/change-url`, {
        siteName: siteName.trim()
      });
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/websites"] });
      toast({
        title: "URL Updated Successfully",
        description: "Your website has been deployed to a new URL and is now live.",
      });
      setIsOpen(false);
      setNewSiteName("");
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update URL",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!newSiteName.trim()) {
      toast({
        title: "Site Name Required",
        description: "Please enter a new site name.",
        variant: "destructive",
      });
      return;
    }

    updateUrlMutation.mutate(newSiteName);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        data-testid={`button-edit-url-${website.id}`}
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Edit URL
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Website URL</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Current URL:</strong> {website.netlifyUrl}
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="siteName" className="text-sm font-medium">
                New Site Name
              </label>
              <Input
                id="siteName"
                type="text"
                placeholder="your-business-name"
                value={newSiteName}
                onChange={(e) => setNewSiteName(e.target.value)}
                data-testid="input-edit-site-name"
              />
              <p className="text-xs text-gray-500">
                {newSiteName ? 
                  `New URL will be: ${newSiteName.toLowerCase().replace(/[^a-z0-9-]/g, "-")}.netlify.app` : 
                  "Enter a site name for your new URL"
                }
              </p>
            </div>
            
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> This will update your existing website's URL. Your content and settings will remain the same.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={updateUrlMutation.isPending}
              data-testid="button-save-url"
            >
              {updateUrlMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}