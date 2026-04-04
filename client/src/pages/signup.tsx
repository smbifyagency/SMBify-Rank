import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Eye, EyeOff, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { registerSchema, type RegisterData } from "@shared/schema";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
    const [, setLocation] = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const form = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (data: RegisterData) => {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Registration failed");
            }

            return response.json();
        },
        onSuccess: () => {
            toast({
                title: "Registration Successful",
                description: "Welcome to SMBify!",
            });
            queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
            setLocation("/dashboard");
        },
        onError: (error: any) => {
            toast({
                title: "Registration Failed",
                description: error.message || "Could not create account",
                variant: "destructive",
            });
        },
    });

    const onSubmit = (data: RegisterData) => {
        registerMutation.mutate(data);
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) {
            toast({
                title: "Google Signup Failed",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/">
                        <div className="inline-flex items-center gap-3 cursor-pointer group mb-6">
                            <div className="h-12 w-12 rounded-xl bg-[#AADD00] flex items-center justify-center shadow-lg shadow-[#AADD00]/25">
                                <Globe className="h-6 w-6 text-black" />
                            </div>
                            <h1 className="text-2xl font-bold text-white">SMBify</h1>
                        </div>
                    </Link>
                    <h2 className="text-3xl font-bold text-white mb-2">Create your account</h2>
                    <p className="text-gray-400">Start building professional websites for free</p>
                </div>

                {/* Form */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm">
                    <div className="flex justify-center w-full mb-6 relative z-10">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGoogleLogin}
                            className="w-full bg-[#0b0f19] border-white/10 hover:bg-white/5 text-white h-12 rounded-xl flex items-center justify-center gap-3 text-sm font-medium transition-all duration-200"
                        >
                            <svg viewBox="0 0 24 24" className="h-5 w-5">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </Button>
                    </div>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#0b0f19] px-2 text-gray-500">Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 relative z-0">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="firstName" className="text-gray-300 text-sm">First name</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="John"
                                    {...form.register("firstName")}
                                    className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#AADD00]"
                                />
                                {form.formState.errors.firstName && (
                                    <p className="text-red-400 text-xs mt-1">{form.formState.errors.firstName.message}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="lastName" className="text-gray-300 text-sm">Last name</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    {...form.register("lastName")}
                                    className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#AADD00]"
                                />
                                {form.formState.errors.lastName && (
                                    <p className="text-red-400 text-xs mt-1">{form.formState.errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-gray-300 text-sm">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@company.com"
                                {...form.register("email")}
                                className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#AADD00]"
                            />
                            {form.formState.errors.email && (
                                <p className="text-red-400 text-xs mt-1">{form.formState.errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="password" className="text-gray-300 text-sm">Password</Label>
                            <div className="relative mt-1.5">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    {...form.register("password")}
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
                            {form.formState.errors.password && (
                                <p className="text-red-400 text-xs mt-1">{form.formState.errors.password.message}</p>
                            )}

                            <div className="mt-2 space-y-1">
                                {["At least 6 characters"].map((rule) => (
                                    <div key={rule} className="flex items-center gap-2 text-xs text-gray-400">
                                        <CheckCircle className="h-3 w-3 text-[#AADD00]" />{rule}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword" className="text-gray-300 text-sm">Confirm password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                {...form.register("confirmPassword")}
                                className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#AADD00]"
                            />
                            {form.formState.errors.confirmPassword && (
                                <p className="text-red-400 text-xs mt-1">{form.formState.errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={registerMutation.isPending}
                            className="w-full bg-[#AADD00] hover:bg-[#bef000] text-black font-bold py-6 text-base rounded-xl shadow-lg shadow-[#AADD00]/25"
                        >
                            {registerMutation.isPending ? "Creating account..." : (
                                <>Create Account <ArrowRight className="ml-2 h-4 w-4" /></>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[#AADD00] hover:text-[#bef000] font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-gray-500">
                    By creating an account, you agree to our{" "}
                    <Link href="/terms" className="text-gray-400 hover:text-white underline">Terms</Link> and{" "}
                    <Link href="/privacy" className="text-gray-400 hover:text-white underline">Privacy Policy</Link>.
                </p>
            </div>
        </div>
    );
}
