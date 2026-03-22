import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit3, Trash2, Save, X } from "lucide-react";
import type { BlogPrompt, InsertBlogPrompt } from "@shared/schema";

export function BlogPromptManager() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<BlogPrompt | null>(null);
  const [formData, setFormData] = useState<Partial<InsertBlogPrompt>>({
    name: "",
    displayName: "",
    prompt: "",
    category: "professional",
    isDefault: false,
    isActive: true,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: prompts = [], isLoading } = useQuery<BlogPrompt[]>({
    queryKey: ["/api/blog-prompts"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertBlogPrompt) => 
      fetch("/api/blog-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-prompts"] });
      setIsCreateOpen(false);
      resetForm();
      toast({ title: "Blog prompt created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create blog prompt", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertBlogPrompt> }) => 
      fetch(`/api/blog-prompts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-prompts"] });
      setEditingPrompt(null);
      resetForm();
      toast({ title: "Blog prompt updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update blog prompt", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => 
      fetch(`/api/blog-prompts/${id}`, {
        method: "DELETE",
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-prompts"] });
      toast({ title: "Blog prompt deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete blog prompt", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      displayName: "",
      prompt: "",
      category: "professional",
      isDefault: false,
      isActive: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.displayName || !formData.prompt) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    if (editingPrompt) {
      updateMutation.mutate({ id: editingPrompt.id, data: formData });
    } else {
      createMutation.mutate(formData as InsertBlogPrompt);
    }
  };

  const startEdit = (prompt: BlogPrompt) => {
    setEditingPrompt(prompt);
    setFormData({
      name: prompt.name,
      displayName: prompt.displayName,
      prompt: prompt.prompt,
      category: prompt.category,
      isDefault: prompt.isDefault,
      isActive: prompt.isActive,
    });
    setIsCreateOpen(true);
  };

  const cancelEdit = () => {
    setEditingPrompt(null);
    setIsCreateOpen(false);
    resetForm();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "professional": return "bg-blue-100 text-blue-800";
      case "seo": return "bg-green-100 text-green-800";
      case "conversational": return "bg-purple-100 text-purple-800";
      case "technical": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Blog Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Blog Prompts</CardTitle>
            <CardDescription>
              Manage your AI blog generation prompts to control writing style and tone
            </CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Prompt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingPrompt ? "Edit Blog Prompt" : "Create Blog Prompt"}
                </DialogTitle>
                <DialogDescription>
                  Configure a new AI prompt for blog generation with specific style and tone
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Internal Name *</Label>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., professional_tone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name *</Label>
                    <Input
                      id="displayName"
                      value={formData.displayName || ""}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      placeholder="e.g., Professional & Informative"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category || "professional"} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="seo">SEO Focused</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt">Prompt Instructions *</Label>
                  <Textarea
                    id="prompt"
                    value={formData.prompt || ""}
                    onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                    placeholder="Enter detailed instructions for the AI to follow when generating blog posts..."
                    rows={6}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isDefault || false}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Set as default prompt</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive === true}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Active</span>
                  </label>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingPrompt ? "Update" : "Create"} Prompt
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {prompts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No blog prompts configured yet.</p>
            <p className="text-sm">Add your first prompt to start customizing blog generation.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prompts.map((prompt) => (
              <div
                key={prompt.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{prompt.displayName}</h3>
                      <Badge className={getCategoryColor(prompt.category || 'professional')}>
                        {prompt.category || 'professional'}
                      </Badge>
                      {prompt.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {prompt.prompt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(prompt)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => prompt.id && deleteMutation.mutate(prompt.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}