import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Key, 
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";
import type { ApiSetting } from "@shared/schema";

export function ApiSettingsManager() {
  const { data: settings, isLoading } = useQuery<ApiSetting[]>({
    queryKey: ['/api/settings'],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          API configuration has been moved to the dedicated setup tabs in the dashboard for easier management. 
          This section now shows read-only status information.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Configuration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {settings?.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {setting.isActive && setting.apiKey ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <h3 className="font-medium">{setting.displayName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {setting.isActive && setting.apiKey 
                        ? "Configured and active" 
                        : "Not configured"
                      }
                    </p>
                  </div>
                </div>
                <Badge 
                  variant={setting.isActive && setting.apiKey ? "default" : "secondary"}
                  className={
                    setting.isActive && setting.apiKey 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-600"
                  }
                >
                  {setting.isActive && setting.apiKey ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))}
            
            {(!settings || settings.length === 0) && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No API settings found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}