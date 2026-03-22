import { Wrench, Clock } from "lucide-react";

export default function MaintenancePage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
                    <Wrench className="h-10 w-10 text-amber-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">Under Maintenance</h1>
                <p className="text-gray-400 mb-8">We're performing scheduled maintenance to improve our platform. We'll be back shortly.</p>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 inline-block">
                    <div className="flex items-center gap-3 text-amber-400">
                        <Clock className="h-5 w-5" />
                        <span className="font-medium">Estimated downtime: 30 minutes</span>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-6">Follow us on Twitter @SMBify for real-time updates.</p>
            </div>
        </div>
    );
}
