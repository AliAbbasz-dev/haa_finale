"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CORE_VEHICLE_MAINTENANCE_TYPES, VEHICLE_SERVICE_DEFAULT_INTERVALS, VEHICLE_SERVICE_DEFAULT_MONTH_INTERVALS } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { useCreateVehicleMaintenance } from "@/hooks/use-supabase-query";
import { uploadPublicImage } from "@/lib/storage";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase";

const vehicleMaintenanceSchema = z.object({
  service_type: z.string().min(1, "Service type is required"),
  service_date: z.string().min(1, "Service date is required"),
  mileage: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.number().min(0).optional()
  ),
  cost: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.number().min(0).optional()
  ),
  service_company: z.string().optional(),
  notes: z.string().optional(),
  next_service_mileage: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.number().min(0).optional()
  ),
  next_service_date: z.string().optional(),
  oil_change_interval: z.number().optional(),
});

type VehicleMaintenanceForm = z.infer<typeof vehicleMaintenanceSchema>;

interface CreateVehicleMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
}

export function CreateVehicleMaintenanceDialog({
  open,
  onOpenChange,
  vehicleId,
}: CreateVehicleMaintenanceDialogProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const createVehicleMaintenanceMutation = useCreateVehicleMaintenance();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vehicleMaintenanceSchema),
    defaultValues: {
      service_date: new Date().toISOString().slice(0, 10),
    },
  });

  const serviceTypeValue = watch("service_type");
  const mileageValue = watch("mileage") as number | undefined;
  const oilIntervalValue = watch("oil_change_interval");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [companyNames, setCompanyNames] = useState<string[]>([]);

  useEffect(() => {
    // Load distinct service company names for autocomplete from past records
    async function loadCompanies() {
      try {
        const supabase = createClient();
        const names = new Set<string>();
        // Vehicle maintenance providers
        const { data: mData } = await supabase
          .from("vehicle_maintenance")
          .select("service_company, vehicle_id")
          .eq("vehicle_id", vehicleId);
        mData?.forEach((row: any) => {
          if (row?.service_company) names.add(row.service_company as string);
        });
        // Vehicle repairs providers
        const { data: rData } = await supabase
          .from("vehicle_repairs")
          .select("service_company, vehicle_id")
          .eq("vehicle_id", vehicleId);
        rData?.forEach((row: any) => {
          if (row?.service_company) names.add(row.service_company as string);
        });
        setCompanyNames(Array.from(names).sort());
      } catch (e) {
        // ignore autocomplete errors
      }
    }
    if (open && vehicleId) {
      loadCompanies();
    }
  }, [open, vehicleId]);

  useEffect(() => {
    // When service type is Oil Change and we have a valid mileage and interval,
    // compute and set the next service mileage automatically.
    try {
      if (
        serviceTypeValue &&
        serviceTypeValue.toLowerCase() === "oil change" &&
        typeof mileageValue === "number" &&
        typeof oilIntervalValue === "number"
      ) {
        const next = Math.round(mileageValue + oilIntervalValue);
        setValue("next_service_mileage", next, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    } catch (e) {
      // ignore
    }
  }, [serviceTypeValue, mileageValue, oilIntervalValue, setValue]);

  const onSubmit = async (data: VehicleMaintenanceForm) => {
    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        const uploadedUrl = await uploadPublicImage(
          imageFile,
          "vehicle-maintenance"
        );
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      await createVehicleMaintenanceMutation.mutateAsync({
        vehicle_id: vehicleId,
        service_type: data.service_type,
        service_date: data.service_date,
        mileage: data.mileage,
        cost: data.cost || null,
        service_company: data.service_company || null,
        notes: data.notes || null,
        next_service_mileage: data.next_service_mileage || null,
        next_service_date: data.next_service_date || null,
        image_url: finalImageUrl || null,
      });

      reset();
      setImageFile(null);
      setImageUrl("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating vehicle maintenance:", error);
    }
  };

  const handleClose = () => {
    reset();
    setImageFile(null);
    setImageUrl("");
    onOpenChange(false);
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    } else {
      setImageUrl("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg p-0 gap-0 border border-gray-200 shadow-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Add Maintenance Record
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 py-4 space-y-4 bg-white"
          >
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Service Type *</Label>
              <select
                {...register("service_type")}
                onChange={(e) => {
                  const val = e.target.value;
                  setValue("service_type", val, { shouldValidate: true });
                  // Auto-set next service based on defaults
                  if (val && mileageValue && VEHICLE_SERVICE_DEFAULT_INTERVALS[val]) {
                    if (typeof mileageValue === 'number') {
                      setValue("next_service_mileage", mileageValue + VEHICLE_SERVICE_DEFAULT_INTERVALS[val]);
                    }
                  }
                  if (val && VEHICLE_SERVICE_DEFAULT_MONTH_INTERVALS[val]) {
                    const months = VEHICLE_SERVICE_DEFAULT_MONTH_INTERVALS[val];
                    const baseDate = new Date();
                    baseDate.setMonth(baseDate.getMonth() + months);
                    setValue("next_service_date", baseDate.toISOString().slice(0,10));
                  }
                }}
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select service</option>
                {CORE_VEHICLE_MAINTENANCE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.service_type && <p className="text-sm text-red-600">{errors.service_type.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="service_date"
                  className="text-sm font-medium text-gray-700"
                >
                  Service Date *
                </Label>
                <Input
                  id="service_date"
                  type="date"
                  {...register("service_date")}
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.service_date && (
                  <p className="text-sm text-red-600">
                    {errors.service_date.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="mileage"
                  className="text-sm font-medium text-gray-700"
                >
                  Mileage
                </Label>
                <Input
                  id="mileage"
                  type="number"
                  {...register("mileage", { valueAsNumber: true })}
                  placeholder="50000"
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.mileage && (
                  <p className="text-sm text-red-600">
                    {errors.mileage.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="service_company"
                  className="text-sm font-medium text-gray-700"
                >
                  Service Company
                </Label>
                <Input
                  id="service_company"
                  list="vehicle-service-companies"
                  {...register("service_company")}
                  placeholder="Jiffy Lube"
                  className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <datalist id="vehicle-service-companies">
                  {companyNames.map((n) => (
                    <option value={n} key={n} />
                  ))}
                </datalist>
              </div>

              <div className="flex items-end justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdvanced((s) => !s)}
                  className="ml-auto"
                >
                  {showAdvanced ? "Hide Advanced" : "Advanced Fields"}
                </Button>
              </div>
            </div>

            {showAdvanced && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="cost"
                      className="text-sm font-medium text-gray-700"
                    >
                      Cost
                    </Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      {...register("cost", { valueAsNumber: true })}
                      placeholder="75.00"
                      className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="next_service_mileage"
                      className="text-sm font-medium text-gray-700"
                    >
                      Next Service Mileage
                    </Label>
                    <Input
                      id="next_service_mileage"
                      type="number"
                      {...register("next_service_mileage", { valueAsNumber: true })}
                      placeholder="53000"
                      className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="next_service_date"
                      className="text-sm font-medium text-gray-700"
                    >
                      Next Service Date
                    </Label>
                    <Input
                      id="next_service_date"
                      type="date"
                      {...register("next_service_date")}
                      className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Oil change interval: only show when service type is Oil Change */}
            {serviceTypeValue &&
              serviceTypeValue.toLowerCase() === "oil change" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Oil Change Interval (miles)
                  </Label>
                  <select
                    {...register("oil_change_interval", {
                      valueAsNumber: true,
                    })}
                    className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select interval</option>
                    <option value={3000}>3,000 miles</option>
                    <option value={4000}>4,000 miles</option>
                    <option value={5000}>5,000 miles</option>
                  </select>
                  <p className="text-sm text-gray-500">
                    Selecting an interval will auto-calculate the next service
                    mileage based on the current mileage.
                  </p>
                  {typeof mileageValue === "number" && typeof oilIntervalValue === "number" && (
                    <p className="text-sm text-blue-600">
                      Next oil change at {Math.round(mileageValue + oilIntervalValue)} miles ({oilIntervalValue} miles from now).
                    </p>
                  )}
                </div>
              )}

            {showAdvanced && (
              <>
                <div className="space-y-2">
                  <Label
                    htmlFor="notes"
                    className="text-sm font-medium text-gray-700"
                  >
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    {...register("notes")}
                    placeholder="Service details, recommendations..."
                    rows={3}
                    className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Upload Image (Optional)
                  </Label>
                  <ImageUpload
                    value={imageUrl}
                    onChange={(url) => setImageUrl(url)}
                    onRemove={() => {
                      setImageUrl("");
                      setImageFile(null);
                    }}
                    disabled={createVehicleMaintenanceMutation.isPending}
                  />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent rounded-md"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createVehicleMaintenanceMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 rounded-md font-medium"
              >
                {createVehicleMaintenanceMutation.isPending
                  ? "Creating..."
                  : "Create Record"}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
