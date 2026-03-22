import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ServerCrash, RefreshCw, Home } from "lucide-react";

export default function ServerErrorPage() {
    const [, setLocation] = useLocation();
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                    <ServerCrash className="h-10 w-10 text-red-400" />
                </div>
                <h1 className="text-6xl font-bold text-white mb-4">500</h1>
                <h2 className="text-2xl font-bold text-white mb-3">Server Error</h2>
                <p className="text-gray-400 mb-8">Something went wrong on our end. Our team has been notified and we're working to fix it.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={() => window.location.reload()} variant="outline" className="border-white/20 text-gray-300 hover:bg-white/5 bg-transparent">
                        <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                    </Button>
                    <Button onClick={() => setLocation("/")} className="bg-gradient-to-r from-indigo-600 to-violet-600">
                        <Home className="mr-2 h-4 w-4" /> Go Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
