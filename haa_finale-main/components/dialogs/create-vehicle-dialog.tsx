"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { useCreateVehicle } from "@/hooks/use-vehicles";
import { useSupabase } from "@/components/providers/supabase-provider";
import { Search, ChevronDown } from "lucide-react";
import { VEHICLE_MAKES, VEHICLE_MODELS } from "@/lib/constants";

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 35 }, (_, i) => currentYear + 1 - i); // Next year + past 34

const vehicleSchema = z.object({
  year: z.string().min(1, "Year is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  nickname: z.string().optional(),
  mileage: z.preprocess((v) => {
    if (v === "" || v === null || v === undefined) return undefined;
    if (typeof v === "number") return Number.isNaN(v) ? undefined : v;
    if (typeof v === "string") {
      const n = parseFloat(v);
      return Number.isNaN(n) ? undefined : n;
    }
    return v;
  }, z.number().optional()),
});

type VehicleForm = z.infer<typeof vehicleSchema>;

// Searchable Dropdown Component
interface SearchableDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  error?: string;
  label: string;
}

function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  error,
  label,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <Label className="text-sm font-medium text-gray-700">{label} *</Label>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left flex items-center justify-between ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          } ${error ? "border-red-500" : ""}`}
        >
          <span className={value ? "text-gray-900" : "text-gray-400"}>
            {value || placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-hidden"
          >
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-48">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors ${
                      value === option ? "bg-blue-100 text-blue-900 font-medium" : "text-gray-900"
                    }`}
                  >
                    {option}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

interface CreateVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateVehicleDialog({
  open,
  onOpenChange,
}: CreateVehicleDialogProps) {
  const [imageUrl, setImageUrl] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useSupabase();
  const createVehicleMutation = useCreateVehicle();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vehicleSchema),
    mode: "onChange",
  });

  const selectedMake = watch("make");
  const modelOptions = selectedMake ? VEHICLE_MODELS[selectedMake] || [] : [];

  const onSubmit = async (data: VehicleForm) => {
    if (!user) return;

    try {
      await createVehicleMutation.mutateAsync({
        ...data,
        year: parseInt(data.year, 10),
        image_url: imageUrl || null,
        user_id: user.id,
      } as any);

      reset();
      setImageUrl("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating vehicle:", error);
    }
  };

  const handleClose = () => {
    reset();
    setImageUrl("");
    onOpenChange(false);
  };

  // Close on outside click and escape
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onOpenChange(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onOpenChange]);

  return (
    <div className="relative inline-block">
      <Button
        onClick={() => onOpenChange(!open)}
        className={`relative focus:outline-none focus:ring-2 focus:ring-blue-500 text-white ${
          open ? "ring-2 ring-blue-400" : ""
        }`}
      >
        Add New Vehicle
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" />
          <motion.div
            ref={containerRef}
            className="absolute right-0 mt-2 w-[520px] max-h-[84vh] overflow-auto bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-6"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Year *</Label>
                  <select
                    {...register("year")}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select year</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  {errors.year && <p className="text-sm text-red-600">{errors.year.message as string}</p>}
                </div>

                <SearchableDropdown
                  options={VEHICLE_MAKES}
                  value={watch("make") || ""}
                  onChange={(value) => {
                    setValue("make", value, { shouldValidate: true });
                    // Reset model when make changes
                    setValue("model", "", { shouldValidate: true });
                  }}
                  placeholder="Select make"
                  label="Make"
                  error={errors.make?.message as string}
                />

                <SearchableDropdown
                  options={modelOptions}
                  value={watch("model") || ""}
                  onChange={(value) => setValue("model", value, { shouldValidate: true })}
                  placeholder={selectedMake ? "Select model" : "Select make first"}
                  disabled={!selectedMake}
                  label="Model"
                  error={errors.model?.message as string}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label
                    htmlFor="nickname"
                    className="text-sm font-medium text-gray-700"
                  >
                    Nickname (Optional)
                  </Label>
                  <Input
                    id="nickname"
                    {...register("nickname")}
                    placeholder="e.g., Daily Driver, Weekend Car"
                    className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mileage" className="text-sm font-medium text-gray-700">Mileage (Optional)</Label>
                  <Input
                    id="mileage"
                    type="number"
                    {...register("mileage", { valueAsNumber: true })}
                    placeholder="50000"
                    className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Upload Image (Optional)
                </Label>
                <ImageUpload
                  value={imageUrl}
                  onChange={setImageUrl}
                  onRemove={() => setImageUrl("")}
                  disabled={createVehicleMutation.isPending}
                  compact
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createVehicleMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {createVehicleMutation.isPending
                    ? "Adding..."
                    : "Add Vehicle"}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </div>
  );
}
