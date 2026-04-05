import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, type LoginData } from "@shared/schema";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const handleGoogleLogin = async () => {
    if (!supabase) {
      toast({
        title: "Google Login Unavailable",
        description: "Google authentication is not configured. Please use email/password login.",
        variant: "destructive",
      });
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      toast({
        title: "Google Login Failed",
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
              <div className="h-12 w-12 rounded-xl bg-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#7C3AED]/25">
                <Globe className="h-6 w-6 text-black" />
              </div>
              <h1 className="text-2xl font-bold text-white">SiteGenie</h1>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-gray-400">Sign in to your account to continue</p>
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
            <div>
              <Label htmlFor="email" className="text-gray-300 text-sm">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                {...form.register("email")}
                className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#7C3AED]"
                data-testid="input-email"
              />
              {form.formState.errors.email && (
                <p className="text-red-400 text-xs mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300 text-sm">Password</Label>
                <Link href="/forgot-password" className="text-xs text-[#7C3AED] hover:text-[#9333EA]">
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...form.register("password")}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#7C3AED] pr-10"
                  data-testid="input-password"
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
            </div>
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#7C3AED] hover:bg-[#9333EA] text-black font-bold py-6 text-base rounded-xl shadow-lg shadow-[#7C3AED]/25"
              data-testid="button-login"
            >
              {loginMutation.isPending ? "Signing in..." : (
                <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#7C3AED] hover:text-[#9333EA] font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}