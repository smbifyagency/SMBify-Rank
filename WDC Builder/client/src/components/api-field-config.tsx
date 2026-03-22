import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface ApiFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "password";
  placeholder?: string;
  showToggle?: boolean;
  onToggle?: () => void;
  showValue?: boolean;
}

export function ApiField({ 
  label, 
  value, 
  onChange, 
  type = "password", 
  placeholder,
  showToggle = true,
  onToggle,
  showValue = false
}: ApiFieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <Input
          type={showValue ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {showToggle && onToggle && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={onToggle}
          >
            {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </div>
  );
}

export function getApiFieldsConfig(serviceName: string) {
  switch (serviceName) {
    case "openai":
      return [
        {
          key: "apiKey",
          label: "API Key",
          placeholder: "Enter OpenAI API key (sk-...)",
          required: true
        }
      ];
    
    case "openrouter":
      return [
        {
          key: "apiKey", 
          label: "API Key",
          placeholder: "Enter OpenRouter API key",
          required: true
        }
      ];
    
    case "unsplash":
      return [
        {
          key: "accessKey",
          label: "Access Key",
          placeholder: "Enter Unsplash Access Key",
          required: true
        },
        {
          key: "secretKey",
          label: "Secret Key", 
          placeholder: "Enter Unsplash Secret Key",
          required: true
        }
      ];
    
    default:
      return [
        {
          key: "apiKey",
          label: "API Key",
          placeholder: "Enter API key",
          required: false
        }
      ];
  }
}