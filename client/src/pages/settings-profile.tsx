import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function SettingsProfile() {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
            });
        }
    }, [user]);

    const updateProfileMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const res = await fetch("/api/auth/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                throw new Error(errorData?.message || "Failed to update profile");
            }
            return res.json();
        },
        onSuccess: () => {
            toast({ title: "Profile updated", description: "Your details have been successfully saved." });
            queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        },
        onError: (error: Error) => {
            toast({ title: "Update failed", description: error.message, variant: "destructive" });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfileMutation.mutate(formData);
    };

    const initials = `${formData.firstName?.[0] || ""}${formData.lastName?.[0] || ""}`.toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || "U";

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <User className="h-8 w-8 text-[#AADD00]" /> Profile
                </h1>
                <p className="text-gray-400 mb-8">Manage your account information.</p>

                <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br bg-[#AADD00] flex items-center justify-center text-white text-2xl font-bold">
                            {initials}
                        </div>
                        <div>
                            <p className="text-white font-medium">{formData.firstName} {formData.lastName}</p>
                            <p className="text-gray-400 text-sm">{formData.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-gray-300 text-sm">First Name</Label>
                            <Input
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="mt-1.5 bg-white/5 border-white/10 text-white focus:border-[#AADD00]"
                            />
                        </div>
                        <div>
                            <Label className="text-gray-300 text-sm">Last Name</Label>
                            <Input
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="mt-1.5 bg-white/5 border-white/10 text-white focus:border-[#AADD00]"
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="text-gray-300 text-sm">Email</Label>
                        <Input
                            value={formData.email}
                            disabled
                            className="mt-1.5 bg-white/5 border-white/10 text-white/70 cursor-not-allowed opacity-70"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                    </div>

                    <Button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="bg-gradient-to-r from-[#AADD00] to-[#7ec800] border-0"
                    >
                        {updateProfileMutation.isPending ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                        ) : (
                            <><Save className="mr-2 h-4 w-4" /> Save Changes</>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
