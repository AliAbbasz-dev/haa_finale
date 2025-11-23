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
import { toast } from "sonner";
import { HOME_PRESETS, ROOM_TYPES } from "@/lib/constants";
import { useCreateHome } from "@/hooks/use-homes";
import { useCreateRoom } from "@/hooks/use-supabase-query";
import { useSupabase } from "@/components/providers/supabase-provider";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase";

const homeSchema = z.object({
  nickname: z.string().min(1, "Home nickname is required"),
  address: z.string().optional(),
  image_url: z.string().optional(),
});

type HomeForm = z.infer<typeof homeSchema>;

interface CreateHomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateHomeDialog({
  open,
  onOpenChange,
}: CreateHomeDialogProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [preset, setPreset] = useState<string>("3 Bedrooms / 2 Bathrooms");
  const [extraRoom, setExtraRoom] = useState<string>("");
  const [extraRooms, setExtraRooms] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [fullBaths, setFullBaths] = useState<number>(2);
  const [halfBaths, setHalfBaths] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useSupabase();
  const createHomeMutation = useCreateHome();
  const createRoomMutation = useCreateRoom();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HomeForm>({
    resolver: zodResolver(homeSchema),
  });

  const onSubmit = async (data: HomeForm) => {
    if (!user) return;
    try {
      const home = await createHomeMutation.mutateAsync({
        ...data,
        image_url: imageUrl || null,
        user_id: user.id,
      });
      const rooms: string[] = [];
      rooms.push("Kitchen");
      rooms.push("Living Room");
      const bdr = Math.max(0, Math.floor(bedrooms));
      const full = Math.max(0, Math.floor(fullBaths));
      const half = Math.max(0, Math.floor(halfBaths));
      for (let i = 1; i <= bdr; i++) rooms.push(`Bedroom ${i}`);
      for (let i = 1; i <= full; i++) rooms.push(`Full Bathroom ${i}`);
      for (let i = 1; i <= half; i++) rooms.push(`Half Bathroom${half > 1 ? ` ${i}` : ""}`);
      extraRooms.forEach((r) => rooms.push(r));
      if (rooms.length && (home as any)?.id) {
        // Batch insert rooms to avoid multiple per-room toasts
        const payload = rooms.map((name) => ({
          home_id: (home as any).id,
          user_id: user.id,
          name,
          paint_color: null,
          flooring: null,
          installer: null,
          purchase_from: null,
          warranty_json: null,
          image_url: null,
        }));

        const { error: roomErr } = await supabase.from("rooms").insert(payload);
        if (roomErr) {
          // Single, clearer message instead of multiple fast toasts
          toast.error("Home added, but some preset rooms could not be created.");
        }
      }
      reset();
      setImageUrl("");
      setPreset("3 Bedrooms / 2 Bathrooms");
      setExtraRoom("");
      setExtraRooms([]);
      setBedrooms(3);
      setFullBaths(2);
      setHalfBaths(0);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Close on outside click / escape
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
        Add Home
      </Button>

      {open && (
        <>
          {/* Lightweight overlay to capture outside clicks */}
          <div className="fixed inset-0 z-40" />
          <motion.div
            ref={containerRef}
            className="absolute right-0 mt-2 w-[420px] max-h-[80vh] overflow-auto bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-6"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <Label
                  htmlFor="nickname"
                  className="text-sm font-medium text-gray-700"
                >
                  Home nickname
                </Label>
                <Input
                  id="nickname"
                  {...register("nickname")}
                  placeholder="Lake House"
                  className="mt-1 w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.nickname && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.nickname.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Quick Layout (optional)
                </Label>
                <select
                  value={preset}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPreset(val);
                    const match = HOME_PRESETS.find((p) => p.label === val);
                    if (match) {
                      setBedrooms(Math.floor(match.bedrooms || 0));
                      const bath = match.bathrooms || 0;
                      setFullBaths(Math.floor(bath));
                      setHalfBaths(bath % 1 >= 0.5 ? 1 : 0);
                    } else {
                      // Clear when "Custom" is selected
                      setBedrooms(0);
                      setFullBaths(0);
                      setHalfBaths(0);
                    }
                  }}
                  className="mt-1 w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm cursor-pointer hover:border-blue-400 transition-colors"
                  style={{ WebkitAppearance: "none" }}
                >
                  <option value="">Custom (manual setup)</option>
                  {HOME_PRESETS.map((p) => (
                    <option key={p.label} value={p.label}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Default: 3 Bedrooms / 2 Bathrooms. Adjust with +/- buttons below.
                </p>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-[11px] text-gray-600">Bedrooms</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Button type="button" variant="outline" className="px-2" onClick={() => setBedrooms((v) => Math.max(0, v - 1))}>-</Button>
                      <div className="w-10 text-center">{bedrooms}</div>
                      <Button type="button" variant="outline" className="px-2" onClick={() => setBedrooms((v) => v + 1)}>+</Button>
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-600">Full Baths</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Button type="button" variant="outline" className="px-2" onClick={() => setFullBaths((v) => Math.max(0, v - 1))}>-</Button>
                      <div className="w-10 text-center">{fullBaths}</div>
                      <Button type="button" variant="outline" className="px-2" onClick={() => setFullBaths((v) => v + 1)}>+</Button>
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-600">Half Baths</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Button type="button" variant="outline" className="px-2" onClick={() => setHalfBaths((v) => Math.max(0, v - 1))}>-</Button>
                      <div className="w-10 text-center">{halfBaths}</div>
                      <Button type="button" variant="outline" className="px-2" onClick={() => setHalfBaths((v) => v + 1)}>+</Button>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-[11px] text-gray-600 mb-1">Add more rooms</div>
                  <div className="flex gap-2">
                    <select
                      value={extraRoom}
                      onChange={(e) => setExtraRoom(e.target.value)}
                      className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select room type</option>
                      {ROOM_TYPES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      onClick={() => {
                        if (extraRoom && !extraRooms.includes(extraRoom)) {
                          setExtraRooms([...extraRooms, extraRoom]);
                          setExtraRoom("");
                        }
                      }}
                      className="px-3"
                      disabled={!extraRoom}
                    >
                      Add
                    </Button>
                  </div>
                  {extraRooms.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {extraRooms.map((r) => (
                        <span
                          key={r}
                          className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-blue-50 text-blue-800 rounded-full border border-blue-200 shadow-sm hover:bg-blue-100 transition-colors"
                        >
                          {r}
                          <button
                            type="button"
                            aria-label="Remove room"
                            onClick={() => setExtraRooms(extraRooms.filter((x) => x !== r))}
                            className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {/* Room Summary */}
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-xs font-medium text-gray-700 mb-2">Home Configuration Summary:</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Core rooms:</span>
                      <span className="font-medium">Kitchen + Living Room</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bedrooms:</span>
                      <span className="font-medium">{bedrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Full Bathrooms:</span>
                      <span className="font-medium">{fullBaths}</span>
                    </div>
                    {halfBaths > 0 && (
                      <div className="flex justify-between">
                        <span>Half Bathrooms:</span>
                        <span className="font-medium">{halfBaths}</span>
                      </div>
                    )}
                    {extraRooms.length > 0 && (
                      <div className="flex justify-between">
                        <span>Extra rooms:</span>
                        <span className="font-medium">{extraRooms.length}</span>
                      </div>
                    )}
                    <div className="pt-2 mt-2 border-t border-gray-300 flex justify-between font-semibold text-gray-800">
                      <span>Total rooms:</span>
                      <span>{2 + bedrooms + fullBaths + halfBaths + extraRooms.length}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Label
                  htmlFor="address"
                  className="text-sm font-medium text-gray-700"
                >
                  Address
                </Label>
                <Input
                  id="address"
                  {...register("address")}
                  placeholder="123 Main St, City"
                  className="mt-1 w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Image (Optional)
                </Label>
                <ImageUpload
                  value={imageUrl}
                  onChange={setImageUrl}
                  onRemove={() => setImageUrl("")}
                  disabled={createHomeMutation.isPending}
                  compact
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    onOpenChange(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 text-white">
                  Add
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </div>
  );
}
