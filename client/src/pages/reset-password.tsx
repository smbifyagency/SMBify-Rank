import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Globe, Eye, EyeOff, Lock, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
    const [, setLocation] = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setLocation("/login"), 3000);
    };

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
                    {!submitted ? (
                        <>
                            <h2 className="text-3xl font-bold text-white mb-2">Set new password</h2>
                            <p className="text-gray-400">Your new password must be different from previously used passwords.</p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-3xl font-bold text-white mb-2">Password reset!</h2>
                            <p className="text-gray-400">Your password has been successfully reset. Redirecting to login...</p>
                        </>
                    )}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm">
                    {!submitted ? (
                        <>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-[#AADD00]/10 flex items-center justify-center mx-auto">
                                    <Lock className="h-8 w-8 text-[#AADD00]" />
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <Label htmlFor="password" className="text-gray-300 text-sm">New password</Label>
                                    <div className="relative mt-1.5">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#AADD00] pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="confirm" className="text-gray-300 text-sm">Confirm password</Label>
                                    <Input
                                        id="confirm"
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#AADD00]"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-[#AADD00] hover:bg-[#bef000] text-black font-bold py-6 text-base font-semibold rounded-xl"
                                >
                                    Reset Password
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                                <CheckCircle className="h-8 w-8 text-emerald-400" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
