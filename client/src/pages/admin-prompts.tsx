import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, Edit, Copy, Trash2, Save, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminPrompts() {
    const { data: prompts, isLoading } = useQuery<any[]>({
        queryKey: ["/api/admin/prompts"]
    });
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<any>({});
    const [isCreating, setIsCreating] = useState(false);

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch('/api/admin/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error("Failed to create prompt");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/prompts"] });
            setIsCreating(false);
            setEditForm({});
            toast({ title: "Success", description: "Prompt created successfully." });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: any }) => {
            const res = await fetch(`/api/admin/prompts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error("Failed to update prompt");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/prompts"] });
            setEditingId(null);
            toast({ title: "Success", description: "Prompt updated successfully." });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/admin/prompts/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Failed to delete prompt");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/prompts"] });
            toast({ title: "Success", description: "Prompt deleted successfully." });
        }
    });

    const handleEditClick = (p: any) => {
        setEditingId(p.id);
        setEditForm({ ...p });
        setIsCreating(false);
    };

    const handleCreateClick = () => {
        setIsCreating(true);
        setEditingId(null);
        setEditForm({ name: "", displayName: "", prompt: "", category: "Content" });
    };

    const handleSave = () => {
        if (isCreating) {
            createMutation.mutate(editForm);
        } else if (editingId) {
            updateMutation.mutate({ id: editingId, data: editForm });
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setIsCreating(false);
    };

    const EditorBlock = () => (
        <div className="rounded-2xl border border-indigo-500/50 bg-indigo-500/10 p-5 space-y-4">
            <h3 className="text-white font-medium">{isCreating ? "Create New Prompt" : "Edit Prompt"}</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label className="text-gray-300">System Name (No Spaces)</Label>
                    <Input
                        value={editForm.name || ""}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="bg-gray-900 border-white/10 text-white mt-1"
                    />
                </div>
                <div>
                    <Label className="text-gray-300">Display Name</Label>
                    <Input
                        value={editForm.displayName || ""}
                        onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                        className="bg-gray-900 border-white/10 text-white mt-1"
                    />
                </div>
            </div>
            <div>
                <Label className="text-gray-300">Category</Label>
                <select
                    value={editForm.category || "Content"}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full mt-1 bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-white">
                    <option value="Content">Content</option>
                    <option value="Blog">Blog</option>
                    <option value="SEO">SEO</option>
                </select>
            </div>
            <div>
                <Label className="text-gray-300">Prompt Definition</Label>
                <Textarea
                    value={editForm.prompt || ""}
                    onChange={(e) => setEditForm({ ...editForm, prompt: e.target.value })}
                    rows={4}
                    className="bg-gray-900 border-white/10 text-white mt-1"
                />
            </div>
            <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCancel} className="text-gray-300 border-white/10"><X className="h-4 w-4 mr-1" /> Cancel</Button>
                <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-600 to-violet-600 block text-white" disabled={!editForm.name || !editForm.prompt || createMutation.isPending || updateMutation.isPending}>
                    <Save className="h-4 w-4 mr-1 inline-block" /> {isCreating ? "Create" : "Save"}
                </Button>
            </div>
        </div>
    );

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <FileText className="h-8 w-8 text-violet-400" /> Prompt Manager
                        </h1>
                        <p className="text-gray-400 mt-1">Manage AI prompt templates for content generation.</p>
                    </div>
                    {!isCreating && (
                        <Button onClick={handleCreateClick} className="bg-gradient-to-r from-indigo-600 to-violet-600 block text-white">
                            <Plus className="mr-1 h-4 w-4 inline-block" /> New Prompt
                        </Button>
                    )}
                </div>

                <div className="space-y-4">
                    {isCreating && <EditorBlock />}

                    {isLoading ? (
                        <div className="p-8 text-center text-gray-400">Loading prompts...</div>
                    ) : !prompts || prompts.length === 0 ? (
                        !isCreating && <div className="p-8 text-center text-gray-400">No prompts found.</div>
                    ) : (
                        prompts.map((p: any) => (
                            <div key={p.id}>
                                {editingId === p.id ? (
                                    <EditorBlock />
                                ) : (
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-start justify-between">
                                        <div className="w-full mr-4">
                                            <p className="text-white font-medium">{p.displayName || p.name}</p>
                                            <p className="text-xs text-gray-400 font-mono mt-1 opacity-60 truncate">{p.name}</p>
                                            <p className="text-sm text-gray-300 mt-2 line-clamp-2">{p.prompt}</p>
                                            <div className="flex gap-3 text-xs text-gray-500 mt-3">
                                                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">{p.category}</span>
                                                <span>~{p.prompt.length * 2} tokens equivalent</span>
                                                {p.isDefault && <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">Default Template</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 whitespace-nowrap">
                                            <button onClick={() => {
                                                const content = p.prompt;
                                                navigator.clipboard.writeText(content);
                                                toast({ title: "Copied", description: "Prompt copied to clipboard" });
                                            }} className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5" title="Copy"><Copy className="h-4 w-4" /></button>
                                            <button onClick={() => handleEditClick(p)} className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5" title="Edit"><Edit className="h-4 w-4" /></button>
                                            <button onClick={() => {
                                                if (confirm("Are you sure you want to delete this prompt?")) {
                                                    deleteMutation.mutate(p.id);
                                                }
                                            }} className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5" title="Delete"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
