import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, Check, AlertCircle, Sparkles, Globe, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyInputProps {
  onKeySaved?: () => void;
}

type Provider = "openai" | "openrouter" | "gemini" | "netlify" | "unsplash";

interface ProviderConfig {
  name: string;
  description: string;
  placeholder: string;
  docsUrl: string;
  validation?: (key: string) => boolean;
  icon: typeof Key;
}

const providers: Record<Provider, ProviderConfig> = {
  openai: {
    name: "OpenAI",
    description: "For AI content generation (paid)",
    placeholder: "sk-...",
    docsUrl: "https://platform.openai.com/api-keys",
    validation: (key) => key.startsWith("sk-"),
    icon: Sparkles
  },
  openrouter: {
    name: "OpenRouter",
    description: "For AI content generation with multiple model providers",
    placeholder: "sk-or-v1-...",
    docsUrl: "https://openrouter.ai/settings/keys",
    validation: (key) => key.startsWith("sk-or-"),
    icon: Sparkles
  },
  gemini: {
    name: "Google Gemini",
    description: "For AI content generation (FREE!)",
    placeholder: "API Key",
    docsUrl: "https://aistudio.google.com/app/apikey",
    icon: Sparkles
  },
  netlify: {
    name: "Netlify",
    description: "For website deployment",
    placeholder: "nfp_...",
    docsUrl: "https://app.netlify.com/user/applications#personal-access-tokens",
    icon: Globe
  },
  unsplash: {
    name: "Unsplash",
    description: "For blog post images",
    placeholder: "Access Key",
    docsUrl: "https://unsplash.com/oauth/applications",
    icon: Image
  }
};

export function ApiKeyInput({ onKeySaved }: ApiKeyInputProps) {
  const [apiKeys, setApiKeys] = useState<Record<Provider, string>>({
    openai: "",
    openrouter: "",
    gemini: "",
    netlify: "",
    unsplash: ""
  });
  
  const [savedStates, setSavedStates] = useState<Record<Provider, boolean>>({
    openai: false,
    openrouter: false,
    gemini: false,
    netlify: false,
    unsplash: false
  });
  
  const { toast } = useToast();

  useEffect(() => {
    const ONE_HOUR = 60 * 60 * 1000;
    
    // Check expiration and clear expired keys
    const checkExpiration = () => {
      const now = Date.now();
      let hasExpired = false;
      
      (Object.keys(providers) as Provider[]).forEach(provider => {
        const savedKey = sessionStorage.getItem(`guest_${provider}_key`);
        const savedTimestamp = sessionStorage.getItem(`guest_${provider}_key_timestamp`);
        
        if (savedKey && savedTimestamp) {
          const timestamp = parseInt(savedTimestamp, 10);
          
          // Check if key is still valid (less than 1 hour old)
          if (now - timestamp < ONE_HOUR) {
            setApiKeys(prev => ({ ...prev, [provider]: savedKey }));
            setSavedStates(prev => ({ ...prev, [provider]: true }));
          } else {
            // Key expired, clear it from session storage and state
            sessionStorage.removeItem(`guest_${provider}_key`);
            sessionStorage.removeItem(`guest_${provider}_key_timestamp`);
            setApiKeys(prev => ({ ...prev, [provider]: "" }));
            setSavedStates(prev => ({ ...prev, [provider]: false }));
            hasExpired = true;
          }
        }
      });
      
      // Show toast notification if any keys expired
      if (hasExpired) {
        toast({
          title: "API Keys Expired",
          description: "Your API keys have expired after 1 hour. Please re-enter them to continue.",
          variant: "destructive",
        });
      }
    };
    
    // Initial check on mount
    checkExpiration();
    
    // Check every minute for expired keys (while component is mounted)
    const intervalId = setInterval(checkExpiration, 60000);
    
    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [toast]);

  const handleSaveKey = async (provider: Provider) => {
    const key = apiKeys[provider];
    const config = providers[provider];
    
    if (!key.trim()) {
      toast({
        title: "API Key Required",
        description: `Please enter your ${config.name} API key.`,
        variant: "destructive",
      });
      return;
    }

    if (config.validation && !config.validation(key)) {
      toast({
        title: "Invalid API Key",
        description: `${config.name} API keys should start with "${config.placeholder.split('.')[0]}". Please check your key.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/guest/save-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider,
          apiKey: key,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save API key");
      }

      // Store key with timestamp for 1-hour expiration
      sessionStorage.setItem(`guest_${provider}_key`, key);
      sessionStorage.setItem(`guest_${provider}_key_timestamp`, Date.now().toString());
      setSavedStates(prev => ({ ...prev, [provider]: true }));
      
      toast({
        title: "API Key Saved",
        description: `Your ${config.name} API key has been saved securely for 1 hour.`,
      });

      onKeySaved?.();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save ${config.name} API key. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const hasSavedKeys = Object.values(savedStates).some(state => state);

  const renderProviderInput = (provider: Provider) => {
    const config = providers[provider];
    const Icon = config.icon;
    
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900">
            <p className="font-medium mb-1">{config.description}</p>
            <p className="text-blue-700">
              Get your API key from{" "}
              <a 
                href={config.docsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline font-medium hover:text-blue-900"
              >
                {config.name} Documentation
              </a>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${provider}-key`} className="text-sm font-medium">
            {config.name} API Key
          </Label>
          <div className="flex gap-2">
            <Input
              id={`${provider}-key`}
              type="password"
              placeholder={config.placeholder}
              value={apiKeys[provider]}
              onChange={(e) => {
                setApiKeys(prev => ({ ...prev, [provider]: e.target.value }));
                setSavedStates(prev => ({ ...prev, [provider]: false }));
              }}
              className="flex-1"
              data-testid={`input-${provider}-key`}
            />
            <Button 
              onClick={() => handleSaveKey(provider)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              data-testid={`button-save-${provider}-key`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {savedStates[provider] ? "Update" : "Save"}
            </Button>
          </div>
          {savedStates[provider] && (
            <div className="flex items-center space-x-1 text-green-600">
              <Check className="h-3 w-3" />
              <p className="text-xs font-medium">Saved</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50" data-testid="api-key-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Key className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                API Keys Setup
                {hasSavedKeys && (
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    <Check className="h-3 w-3 mr-1" />
                    Configured
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Enter your API keys to enable features (no signup required!)
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gemini" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
            <TabsTrigger value="gemini" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Gemini (Free!)
            </TabsTrigger>
            <TabsTrigger value="openai" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              OpenAI
            </TabsTrigger>
            <TabsTrigger value="openrouter" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              OpenRouter
            </TabsTrigger>
            <TabsTrigger value="netlify" className="text-xs">
              <Globe className="h-3 w-3 mr-1" />
              Netlify
            </TabsTrigger>
            <TabsTrigger value="unsplash" className="text-xs">
              <Image className="h-3 w-3 mr-1" />
              Unsplash
            </TabsTrigger>
          </TabsList>
          
          {(Object.keys(providers) as Provider[]).map(provider => (
            <TabsContent key={provider} value={provider}>
              {renderProviderInput(provider)}
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg space-y-2">
          <p className="text-xs font-semibold text-green-900 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Privacy & Security
          </p>
          <ul className="text-xs text-green-800 space-y-1 ml-4 list-disc">
            <li><strong>Session Isolated:</strong> Your API keys are stored in your private session only. Other users cannot access your keys.</li>
            <li><strong>Auto-Reset:</strong> Keys automatically expire and reset after 1 hour for your security.</li>
            <li><strong>No Server Storage:</strong> We never permanently store your API keys on our servers.</li>
            <li><strong>You Control Usage:</strong> You only pay for what you use with your own API accounts.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
