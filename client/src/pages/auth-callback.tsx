import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Globe, Loader2 } from "lucide-react";

export default function AuthCallback() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        let handled = false;

        const syncSession = async (accessToken: string) => {
            if (handled) return;
            handled = true;

            try {
                const res = await fetch("/api/auth/supabase", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ access_token: accessToken }),
                });

                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.message || "Failed to sync session with server");
                }

                await res.json();
                await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
                setLocation("/dashboard");
            } catch (err: any) {
                console.error("Sync error:", err);
                setErrorMsg(err.message);
                toast({ title: "Authentication Sync Failed", description: err.message, variant: "destructive" });
                setTimeout(() => setLocation("/login"), 2000);
            }
        };

        if (!supabase) {
            setErrorMsg("Authentication service not configured");
            toast({ title: "Authentication Failed", description: "Google authentication is not configured.", variant: "destructive" });
            setTimeout(() => setLocation("/login"), 2000);
            return;
        }

        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                setErrorMsg(error.message);
                toast({ title: "Authentication Failed", description: error.message, variant: "destructive" });
                setTimeout(() => setLocation("/login"), 2000);
                return;
            }

            if (session?.access_token) {
                syncSession(session.access_token);
            } else {
                setLocation("/login");
            }
        });

        // Supabase specifically fires this event when an OAuth login finishes parsing
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN" && session?.access_token) {
                syncSession(session.access_token);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [setLocation, queryClient, toast]);

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
            <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[#AADD00]/10 border border-[#AADD00]/20 mb-6 relative">
                    <Globe className="h-8 w-8 text-[#AADD00] absolute opacity-50" />
                    <Loader2 className="h-8 w-8 text-[#AADD00] animate-spin absolute" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Authenticating...</h2>
                <p className="text-gray-400 max-w-sm mx-auto">
                    {errorMsg || "Please wait while we log you into your account and secure your session."}
                </p>
            </div>
        </div>
    );
}
