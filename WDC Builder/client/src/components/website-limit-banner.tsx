import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Globe, Crown, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

interface WebsiteLimitData {
  canCreate: boolean;
  remaining: number;
  limit: number;
}

export function WebsiteLimitBanner() {
  const { user } = useAuth();
  const { data: limitData, isLoading } = useQuery<WebsiteLimitData>({
    queryKey: ["/api/user/website-limits"],
    retry: false,
  });

  if (isLoading || !limitData) return null;

  // Paid users or admins have unlimited access
  const isPaid = (user as any)?.role === "paid" || (user as any)?.role === "admin" || (user as any)?.id === "admin";

  if (isPaid || limitData.limit >= 999) {
    return (
      <Alert className="border-emerald-500/20 bg-emerald-500/5 mb-6">
        <Crown className="h-4 w-4 text-emerald-400" />
        <AlertDescription className="text-emerald-300">
          <strong>Pro Plan:</strong> You have unlimited website creation.
        </AlertDescription>
      </Alert>
    );
  }

  const { canCreate, remaining, limit } = limitData;
  const used = limit - remaining;

  if (!canCreate) {
    return (
      <Alert className="border-amber-500/20 bg-amber-500/5 mb-6">
        <AlertCircle className="h-4 w-4 text-amber-400" />
        <AlertDescription className="text-amber-300">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <strong>Free Plan Limit Reached!</strong> You've created {used} of {limit} free websites.
              Upgrade to Pro for unlimited websites.
            </div>
            <Link href="/pricing">
              <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white">
                <Sparkles className="mr-1 h-3 w-3" /> Upgrade to Pro — $29/mo
              </Button>
            </Link>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (remaining <= 1) {
    return (
      <Alert className="border-amber-500/20 bg-amber-500/5 mb-6">
        <AlertCircle className="h-4 w-4 text-amber-400" />
        <AlertDescription className="text-amber-300">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <strong>Almost at your limit!</strong> {remaining} of {limit} free websites remaining.
            </div>
            <Link href="/pricing">
              <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10">
                <Sparkles className="mr-1 h-3 w-3" /> Upgrade for Unlimited
              </Button>
            </Link>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-indigo-500/20 bg-indigo-500/5 mb-6">
      <Globe className="h-4 w-4 text-indigo-400" />
      <AlertDescription className="text-indigo-300">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <strong>Free Plan:</strong> {remaining} of {limit} websites remaining.
          </div>
          <Link href="/pricing">
            <Button size="sm" variant="outline" className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10">
              <Sparkles className="mr-1 h-3 w-3" /> Upgrade for Unlimited
            </Button>
          </Link>
        </div>
      </AlertDescription>
    </Alert>
  );
}