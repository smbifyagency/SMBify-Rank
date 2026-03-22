import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { templates } from "@/lib/templates";
import { BusinessData, businessCategories } from "@shared/schema";
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface BulkImportProps {
  onClose: () => void;
}

export function BulkImport({ onClose }: BulkImportProps) {
  const [csvData, setCsvData] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResults, setValidationResults] = useState<{ valid: boolean; errors: string[]; count: number } | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCsvData(text);
        validateCsvData(text);
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
    }
  };

  const validateCsvData = (data: string) => {
    try {
      const lines = data.trim().split('\n');
      if (lines.length < 2) {
        setValidationResults({ valid: false, errors: ["CSV must have at least header and one data row"], count: 0 });
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const requiredHeaders = [
        'businessName', 'heroService', 'heroLocation', 'heroDescription',
        'category', 'phone', 'email', 'address', 'services', 'serviceAreas',
        'targetedKeywords', 'featureHeadlines', 'featureDescriptions',
        'aboutDescription', 'businessHours', 'footerTitle', 'footerDescription', 'keyFacts',
        'seoHeading1', 'seoContent1', 'seoHeading2', 'seoContent2',
        'seoHeading3', 'seoContent3', 'seoHeading4', 'seoContent4',
        'seoHeading5', 'seoContent5', 'seoHeading6', 'seoContent6'
      ];

      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      const errors: string[] = [];

      if (missingHeaders.length > 0) {
        errors.push(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      const businesses = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          if (values.length !== headers.length) {
            errors.push(`Row ${i + 1}: Column count mismatch`);
            continue;
          }

          const business: any = {};
          headers.forEach((header, index) => {
            business[header] = values[index];
          });

          // Basic validation
          if (!business.businessName) errors.push(`Row ${i + 1}: Business name is required`);
          if (!businessCategories.includes(business.category)) {
            errors.push(`Row ${i + 1}: Invalid category "${business.category}"`);
          }

          businesses.push(business);
        }
      }

      setValidationResults({
        valid: errors.length === 0,
        errors,
        count: businesses.length
      });

    } catch (error) {
      setValidationResults({
        valid: false,
        errors: ["Failed to parse CSV data"],
        count: 0
      });
    }
  };

  const processBulkGeneration = async () => {
    if (!csvData || !validationResults?.valid) {
      toast({
        title: "Invalid Data",
        description: "Please upload and validate CSV data first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const businesses: BusinessData[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          const business: any = {};
          
          headers.forEach((header, index) => {
            business[header] = values[index];
          });

          // Convert yearsInBusiness to number
          business.yearsInBusiness = parseInt(business.yearsInBusiness) || 1;
          
          // Set default SEO content if not provided
          business.seoHeading1 = business.seoHeading1 || "Why Choose Our Services";
          business.seoContent1 = business.seoContent1 || "We provide professional services with years of experience and commitment to excellence.";
          business.seoHeading2 = business.seoHeading2 || "Quality Service Guarantee";
          business.seoContent2 = business.seoContent2 || "Our commitment to excellence ensures customer satisfaction with every project.";
          business.seoHeading3 = business.seoHeading3 || "Get Started Today";
          business.seoContent3 = business.seoContent3 || "Contact us now for a free estimate and professional consultation.";
          business.seoHeading4 = business.seoHeading4 || "Your Trusted Partner";
          business.seoContent4 = business.seoContent4 || "Choose us for reliable service, competitive pricing, and the peace of mind that comes with working with experienced professionals.";
          business.seoHeading5 = business.seoHeading5 || "Professional Excellence";
          business.seoContent5 = business.seoContent5 || "Our commitment to professional excellence ensures every job is completed to the highest standards.";
          business.seoHeading6 = business.seoHeading6 || "Trusted by Customers";
          business.seoContent6 = business.seoContent6 || "Join hundreds of satisfied customers who trust us for their service needs.";
          // Set optional image fields
          business.aboutImage = business.aboutImage || "";
          business.aboutImage2 = business.aboutImage2 || "";
          business.aboutImageAlt = business.aboutImageAlt || "";
          business.aboutImage2Alt = business.aboutImage2Alt || "";

          businesses.push(business);
        }
      }

      const response = await fetch('/api/bulk-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businesses,
          template: selectedTemplate,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Bulk generation failed');
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bulk-websites-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Bulk Generation Complete!",
        description: `${businesses.length} websites have been generated and downloaded.`,
      });

      onClose();

    } catch (error) {
      console.error("Bulk generation error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate websites",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const templateCsv = `businessName,heroService,heroLocation,heroDescription,category,phone,email,address,yearsInBusiness,services,serviceAreas,targetedKeywords,featureHeadlines,featureDescriptions,aboutDescription,businessHours,facebookUrl,twitterUrl,footerTitle,footerDescription,keyFacts,seoHeading1,seoContent1,seoHeading2,seoContent2,seoHeading3,seoContent3,seoHeading4,seoContent4,seoHeading5,seoContent5,seoHeading6,seoContent6,aboutImage,aboutImage2
"ABC Plumbing","Professional Plumbing Services","New York, NY","24/7 emergency plumbing repairs and installations","Plumbing","(555) 123-4567","info@abcplumbing.com","123 Main St, New York, NY 10001",10,"Emergency repairs, pipe installation, drain cleaning","Manhattan, Brooklyn, Queens","plumbing NYC, emergency plumber, pipe repair","Fast Response Time, Licensed Professionals, Quality Workmanship","We respond within 30 minutes, our team is fully licensed and insured, we guarantee all our work","ABC Plumbing has been serving NYC for over 10 years with reliable, professional plumbing services.","Mon-Sun: 24/7 Emergency Service","","","Contact ABC Plumbing","Ready to fix your plumbing issues? Call us now!","Over 1000 satisfied customers, Same-day service available, 1-year warranty on all work","Why Choose Our Plumbing Services","We provide fast, reliable plumbing services with experienced technicians available 24/7 for emergencies.","Licensed and Insured Professionals","Our fully licensed and insured team ensures quality workmanship and peace of mind for every job.","Emergency Service Available","Call us anytime for urgent plumbing repairs - we're here when you need us most.","Your Trusted NYC Plumbing Partner","Choose ABC Plumbing for reliable service, competitive pricing, and the peace of mind that comes with working with experienced professionals.","Professional Excellence Guaranteed","Our commitment to professional excellence ensures every job is completed to the highest standards with attention to detail.","Trusted by New York Residents","Join hundreds of satisfied customers who trust us for their plumbing needs. Our reputation is built on reliability and exceptional service.","https://images.unsplash.com/photo-1558618666-fbd6c327cd24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"`;
    
    const blob = new Blob([templateCsv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-import-template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Template Downloaded",
      description: "Use this CSV template to format your business data",
    });
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileSpreadsheet className="h-6 w-6" />
          <span>Bulk Website Generation</span>
        </CardTitle>
        <CardDescription>
          Upload a CSV file with business data to generate multiple websites at once
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Download */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div>
            <h3 className="font-medium text-blue-900">Need a CSV template?</h3>
            <p className="text-sm text-blue-700">Download our sample CSV with all required columns</p>
          </div>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="csv-file">Upload CSV File</Label>
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="cursor-pointer"
          />
        </div>

        {/* Manual CSV Input */}
        <div className="space-y-2">
          <Label htmlFor="csv-data">Or Paste CSV Data</Label>
          <Textarea
            id="csv-data"
            placeholder="Paste your CSV data here..."
            value={csvData}
            onChange={(e) => {
              setCsvData(e.target.value);
              if (e.target.value.trim()) {
                validateCsvData(e.target.value);
              } else {
                setValidationResults(null);
              }
            }}
            rows={6}
          />
        </div>

        {/* Validation Results */}
        {validationResults && (
          <div className={`p-4 rounded-lg ${validationResults.valid ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center space-x-2 mb-2">
              {validationResults.valid ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span className={`font-medium ${validationResults.valid ? 'text-green-900' : 'text-red-900'}`}>
                {validationResults.valid ? 'CSV Valid' : 'CSV Validation Failed'}
              </span>
            </div>
            {validationResults.valid ? (
              <p className="text-green-700">
                Ready to generate {validationResults.count} websites
              </p>
            ) : (
              <ul className="text-red-700 text-sm space-y-1">
                {validationResults.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Template Selection */}
        <div className="space-y-2">
          <Label>Website Template</Label>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={processBulkGeneration}
            disabled={!validationResults?.valid || isProcessing}
            className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Generate {validationResults?.count || 0} Websites
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}