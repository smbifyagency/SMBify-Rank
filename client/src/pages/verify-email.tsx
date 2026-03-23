import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Globe, MailCheck, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
    const [, setLocation] = useLocation();
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

    useEffect(() => {
        // Simulate email verification API call
        const timer = setTimeout(() => {
            setStatus("success");
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/">
                        <div className="inline-flex items-center gap-3 cursor-pointer group mb-6">
                            <div className="h-12 w-12 rounded-xl bg-[#AADD00] flex items-center justify-center shadow-lg shadow-[#AADD00]/25">
                                <Globe className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white">SMBify</h1>
                        </div>
                    </Link>
                    {status === "verifying" && (
                        <>
                            <h2 className="text-3xl font-bold text-white mb-2">Verifying your email...</h2>
                            <p className="text-gray-400">Please wait while we confirm your email address.</p>
                        </>
                    )}
                    {status === "success" && (
                        <>
                            <h2 className="text-3xl font-bold text-white mb-2">Email verified!</h2>
                            <p className="text-gray-400">Your email has been successfully verified. You can now access all features.</p>
                        </>
                    )}
                    {status === "error" && (
                        <>
                            <h2 className="text-3xl font-bold text-white mb-2">Verification failed</h2>
                            <p className="text-gray-400">This verification link may have expired or already been used.</p>
                        </>
                    )}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm text-center">
                    {status === "verifying" && (
                        <div className="py-4">
                            <div className="w-16 h-16 rounded-full bg-[#AADD00]/10 flex items-center justify-center mx-auto">
                                <Loader2 className="h-8 w-8 text-[#AADD00] animate-spin" />
                            </div>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="py-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="h-8 w-8 text-emerald-400" />
                            </div>
                            <Button
                                onClick={() => setLocation("/dashboard")}
                                className="bg-[#AADD00] hover:bg-[#bef000] text-black font-bold py-5 px-8 text-base font-semibold rounded-xl"
                            >
                                Go to Dashboard
                            </Button>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="py-4">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                                <XCircle className="h-8 w-8 text-red-400" />
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setStatus("verifying")}
                                className="border-white/20 text-white hover:bg-white/5 bg-transparent py-5 px-8 text-base rounded-xl"
                            >
                                <MailCheck className="mr-2 h-4 w-4" />
                                Resend Verification Email
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
