import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { BusinessData, Website } from "@shared/schema";

interface QuickEditModalProps {
  website: Website;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickEditModal({ website, isOpen, onClose }: QuickEditModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get business data from the website
  const businessData = website.businessData as BusinessData;
  
  // State for editable fields
  const [formData, setFormData] = useState({
    businessName: businessData.businessName || "",
    phone: businessData.phone || "",
    email: businessData.email || "",
    address: businessData.address || "",
    businessHours: businessData.businessHours || "",
    ctaWhatsappNumber: businessData.ctaWhatsappNumber || "",
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Merge updated fields with existing business data
      const updatedBusinessData = {
        ...businessData,
        ...data,
      };

      return apiRequest("PUT", `/api/websites/${website.id}`, {
        businessData: updatedBusinessData,
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["/api/websites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/websites", website.id] });
      
      // Auto-redeploy if the website has netlify info
      if (website.netlifyApiKey && website.netlifySiteId) {
        try {
          const result = await apiRequest("POST", `/api/websites/${website.id}/redeploy`, {});
          const data = await result.json();
          if (data?.newSite) {
            toast({
              title: "Website Updated & Deployed to New Site",
              description: "Your website has been updated and deployed to a new Netlify site since the previous one was unavailable.",
            });
          } else {
            toast({
              title: "Website Updated & Redeployed",
              description: "Your website has been updated and redeployed to reflect the changes.",
            });
          }
        } catch (error) {
          toast({
            title: "Website Updated",
            description: "Website updated successfully, but auto-redeploy failed. Use the Redeploy button to apply changes.",
            variant: "default",
          });
        }
      } else {
        toast({
          title: "Website Updated",
          description: "Your website information has been updated successfully.",
        });
      }
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update website",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Basic validation
    if (!formData.businessName.trim()) {
      toast({
        title: "Business Name Required",
        description: "Please enter a business name.",
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate(formData);
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      businessName: businessData.businessName || "",
      phone: businessData.phone || "",
      email: businessData.email || "",
      address: businessData.address || "",
      businessHours: businessData.businessHours || "",
      ctaWhatsappNumber: businessData.ctaWhatsappNumber || "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quick Edit: {website.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
                placeholder="Your Business Name"
                data-testid="input-business-name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
                data-testid="input-phone"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="info@yourbusiness.com"
                data-testid="input-email"
              />
            </div>
            
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Business Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="123 Main St, City, State 12345"
              rows={2}
              data-testid="input-address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessHours">Business Hours</Label>
              <Textarea
                id="businessHours"
                value={formData.businessHours}
                onChange={(e) => handleInputChange("businessHours", e.target.value)}
                placeholder="Mon-Fri: 9AM-5PM, Sat: 10AM-3PM, Sun: Closed"
                rows={3}
                data-testid="input-business-hours"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ctaWhatsappNumber">WhatsApp Number</Label>
              <Input
                id="ctaWhatsappNumber"
                value={formData.ctaWhatsappNumber}
                onChange={(e) => handleInputChange("ctaWhatsappNumber", e.target.value)}
                placeholder="+1234567890"
                data-testid="input-whatsapp"
              />
              <p className="text-xs text-gray-500">Include country code (e.g., +1)</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} data-testid="button-cancel">
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={updateMutation.isPending}
            data-testid="button-save"
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}