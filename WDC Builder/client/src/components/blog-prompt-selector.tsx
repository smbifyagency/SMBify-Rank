import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from 'lucide-react';

interface BlogPromptSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

interface BlogPrompt {
  id: string;
  name: string;
  description: string;
  prompt: string;
  isActive: boolean;
}

export function BlogPromptSelector({ value, onChange }: BlogPromptSelectorProps) {
  const { data: prompts, isLoading, error } = useQuery<BlogPrompt[]>({
    queryKey: ['/api/blog-prompts'],
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (error || !prompts) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Unable to load writing styles. Using default prompt.
        </AlertDescription>
      </Alert>
    );
  }

  const activePrompts = prompts.filter(prompt => prompt.isActive);

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select writing style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default Style</SelectItem>
          {activePrompts.map((prompt) => (
            <SelectItem key={prompt.id} value={prompt.id}>
              {prompt.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {value && value !== "default" && (
        <div className="text-xs text-gray-600">
          {activePrompts.find(p => p.id === value)?.description}
        </div>
      )}
    </div>
  );
}