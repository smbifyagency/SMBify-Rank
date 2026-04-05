import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { useState } from "react";
import { Globe, ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/">
                        <div className="inline-flex items-center gap-3 cursor-pointer group mb-6">
                            <div className="h-12 w-12 rounded-xl bg-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#7C3AED]/25">
                                <Globe className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white">SiteGenie</h1>
                        </div>
                    </Link>
                    {!submitted ? (
                        <>
                            <h2 className="text-3xl font-bold text-white mb-2">Forgot your password?</h2>
                            <p className="text-gray-400">No worries, we'll send you reset instructions.</p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-3xl font-bold text-white mb-2">Check your email</h2>
                            <p className="text-gray-400">We sent a password reset link to <span className="text-white font-medium">{email}</span></p>
                        </>
                    )}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm">
                    {!submitted ? (
                        <>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mx-auto">
                                    <Mail className="h-8 w-8 text-[#7C3AED]" />
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <Label htmlFor="email" className="text-gray-300 text-sm">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#7C3AED]"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-[#7C3AED] hover:bg-[#9333EA] text-black font-bold py-6 text-base font-semibold rounded-xl"
                                >
                                    Send Reset Link
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="h-8 w-8 text-emerald-400" />
                            </div>
                            <p className="text-gray-500 text-sm">
                                Didn't receive the email?{" "}
                                <button onClick={() => setSubmitted(false)} className="text-[#7C3AED] hover:text-[#9333EA]">
                                    Click to resend
                                </button>
                            </p>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
                            <ArrowLeft className="h-4 w-4" /> Back to sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
