import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { BusinessData } from "@shared/schema";
import { MapPin, Wrench } from "lucide-react";
import { useEffect } from "react";

interface DynamicPagesFormProps {
  form: UseFormReturn<BusinessData>;
}

export function DynamicPagesForm({ form }: DynamicPagesFormProps) {
  const services = form.watch("services");
  const additionalServices = form.watch("additionalServices");
  const serviceAreas = form.watch("serviceAreas");
  const additionalLocations = form.watch("additionalLocations");

  useEffect(() => {
    const servicesValue = services?.trim() || "";
    const additionalServicesValue = additionalServices?.trim() || "";
    const serviceAreasValue = serviceAreas?.trim() || "";
    const additionalLocationsValue = additionalLocations?.trim() || "";

    // Keep legacy/main fields and dynamic-page fields aligned so users enter data once.
    if (additionalServicesValue) {
      if (servicesValue !== additionalServicesValue) {
        form.setValue("services", additionalServicesValue, { shouldDirty: false });
      }
    } else if (servicesValue) {
      form.setValue("additionalServices", servicesValue, { shouldDirty: false });
    }

    if (additionalLocationsValue) {
      if (serviceAreasValue !== additionalLocationsValue) {
        form.setValue("serviceAreas", additionalLocationsValue, { shouldDirty: false });
      }
    } else if (serviceAreasValue) {
      form.setValue("additionalLocations", serviceAreasValue, { shouldDirty: false });
    }
  }, [form, services, additionalServices, serviceAreas, additionalLocations]);

  return (
    <section className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Services & Service Areas</h3>
          <p className="text-sm text-slate-600 mt-1">
            Enter these once. We reuse them across main pages and dynamic service/location pages.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="additionalServices"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                <Wrench className="w-4 h-4" />
                Services Offered
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Emergency Repairs, Maintenance, Installation"
                  className="min-h-[96px] border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value);
                    form.setValue("services", value, { shouldValidate: true, shouldDirty: true });
                  }}
                />
              </FormControl>
              <p className="text-sm text-slate-500">
                Used for service pages and AI-generated service content.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additionalLocations"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                <MapPin className="w-4 h-4" />
                Service Areas
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Downtown, Midtown, North Side"
                  className="min-h-[96px] border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value);
                    form.setValue("serviceAreas", value, { shouldValidate: true, shouldDirty: true });
                  }}
                />
              </FormControl>
              <p className="text-sm text-slate-500">
                Used for location pages and area coverage content.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
        Keywords are generated automatically by AI based on your services and service areas.
      </div>
    </section>
  );
}
