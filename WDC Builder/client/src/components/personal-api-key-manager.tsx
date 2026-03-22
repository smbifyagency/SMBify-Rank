import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  Key, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  User, 
  Shield, 
  Trash2 
} from "lucide-react";

interface PersonalApiKeyStatus {
  hasApiKey: boolean;
  isSet: boolean;
}

export function PersonalApiKeyManager() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Query to get current personal API key status
  const { data: apiKeyStatus, isLoading } = useQuery<PersonalApiKeyStatus>({
    queryKey: ['/api/user/personal-api-key'],
    enabled: !!user,
  });

  const updateApiKeyMutation = useMutation({
    mutationFn: async (data: { apiKey: string }) => {
      const response = await fetch('/api/user/personal-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update API key');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/personal-api-key'] });
      toast({
        title: "Personal API Key Updated",
        description: "Your personal OpenAI API key has been saved successfully.",
      });
      setApiKey(""); // Clear the input after successful save
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update personal API key",
        variant: "destructive",
      });
    },
  });

  const clearApiKeyMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/user/personal-api-key', {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to clear API key');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/personal-api-key'] });
      toast({
        title: "Personal API Key Cleared",
        description: "Your personal OpenAI API key has been removed.",
      });
      setApiKey("");
    },
    onError: (error: any) => {
      toast({
        title: "Clear Failed",
        description: error.message || "Failed to clear personal API key",
        variant: "destructive",
      });
    },
  });

  const testConnection = async () => {
    if (!apiKey || !apiKey.startsWith('sk-')) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid OpenAI API key starting with 'sk-'",
        variant: "destructive",
      });
      return;
    }

    setIsTestingConnection(true);
    try {
      // Test the API key by making a simple request
      const response = await fetch('/api/test-openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });

      if (response.ok) {
        toast({
          title: "Connection Successful",
          description: "Your OpenAI API key is working correctly!",
        });
      } else {
        const error = await response.text();
        toast({
          title: "Connection Failed",
          description: error || "Invalid API key or connection issue",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Unable to test connection. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSave = () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      toast({
        title: "Invalid Format",
        description: "OpenAI API keys should start with 'sk-'",
        variant: "destructive",
      });
      return;
    }

    updateApiKeyMutation.mutate({ apiKey });
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to remove your personal API key? This action cannot be undone.")) {
      clearApiKeyMutation.mutate();
    }
  };

  const isConfigured = apiKeyStatus?.hasApiKey;

  // Don't show for admin user
  if ((user as any)?.id === "admin") {
    return (
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Personal API Key Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center space-y-3">
              <Shield className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="text-gray-600">
                As an admin, you use the system OpenAI API key configured in the API settings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Personal OpenAI API Key
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <div className="flex items-center gap-3">
            {isConfigured ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-600" />
            )}
            <div>
              <p className="font-medium">
                {isConfigured ? "Personal API Key Set" : "No Personal API Key"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isConfigured 
                  ? "You can now use AI features with your own API key" 
                  : "Set your personal API key to use AI features"
                }
              </p>
            </div>
          </div>
          {isConfigured && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Active
            </Badge>
          )}
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your personal API key is separate from the system settings and only you can modify it. 
            Get your key from{" "}
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline"
            >
              OpenAI Platform
              <ExternalLink className="h-3 w-3" />
            </a>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label htmlFor="personal-openai-key">Your OpenAI API Key</Label>
            <div className="relative mt-1">
              <Input
                id="personal-openai-key"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="pr-10"
                data-testid="input-personal-api-key"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowKey(!showKey)}
                data-testid="button-toggle-key-visibility"
              >
                {showKey ? "Hide" : "Show"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Your API key is encrypted and only accessible by you
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={updateApiKeyMutation.isPending || !apiKey}
              className="flex-1"
              data-testid="button-save-personal-api-key"
            >
              {updateApiKeyMutation.isPending ? "Saving..." : "Save API Key"}
            </Button>
            <Button
              variant="outline"
              onClick={testConnection}
              disabled={isTestingConnection || !apiKey}
              data-testid="button-test-personal-api-key"
            >
              {isTestingConnection ? "Testing..." : "Test"}
            </Button>
            {isConfigured && (
              <Button
                variant="destructive"
                onClick={handleClear}
                disabled={clearApiKeyMutation.isPending}
                data-testid="button-clear-personal-api-key"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h4 className="font-medium mb-2">Personal API Key Benefits:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Full control over your OpenAI usage and costs</li>
            <li>• Your API key is private and secure - only you can access it</li>
            <li>• Use AI features even if system API key is not configured</li>
            <li>• Track your own usage and billing through OpenAI dashboard</li>
            <li>• Separate from admin/system API key settings</li>
          </ul>
        </div>

        {isConfigured && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <h4 className="font-medium text-amber-800 dark:text-amber-200">Important</h4>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Keep your API key secure and never share it with others. 
              You will be charged for all usage associated with your key.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}