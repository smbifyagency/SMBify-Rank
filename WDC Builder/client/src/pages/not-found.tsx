import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">404 Page Not Found</h1>
          <p className="text-gray-400 text-sm">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>
      </div>
    </div>
  );
}
