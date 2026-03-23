import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Globe, Users, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function AcceptInvitePage() {
    const [, setLocation] = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ name: "", password: "", confirm: "" });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLocation("/dashboard");
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
                    <h2 className="text-3xl font-bold text-white mb-2">You've been invited!</h2>
                    <p className="text-gray-400">
                        <span className="text-white font-medium">Digital Agency LLC</span> has invited you to
                        join their team on SMBify.
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-[#AADD00]/8 flex items-center justify-center mx-auto mb-6">
                            <Users className="h-8 w-8 text-[#AADD00]" />
                        </div>
                    </div>

                    <div className="rounded-xl bg-violet-500/5 border border-[#AADD00]/15 p-4 mb-6">
                        <div className="text-sm text-gray-400">
                            <p><span className="text-gray-300 font-medium">Team:</span> Digital Agency LLC</p>
                            <p><span className="text-gray-300 font-medium">Role:</span> Editor</p>
                            <p><span className="text-gray-300 font-medium">Invited by:</span> admin@digitalagency.com</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <Label htmlFor="name" className="text-gray-300 text-sm">Your name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#AADD00]"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" className="text-gray-300 text-sm">Create password</Label>
                            <div className="relative mt-1.5">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                        <Button
                            type="submit"
                            className="w-full bg-[#AADD00] hover:bg-[#bef000] text-black font-bold py-6 text-base font-semibold rounded-xl shadow-lg shadow-[#AADD00]/25"
                        >
                            Accept Invite & Join <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[#AADD00] hover:text-[#bef000] font-medium">
                            Sign in instead
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
