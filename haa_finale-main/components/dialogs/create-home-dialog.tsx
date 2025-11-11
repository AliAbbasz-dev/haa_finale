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
  const [preset, setPreset] = useState<string>("");
  const [extraRoom, setExtraRoom] = useState<string>("");
  const [extraRooms, setExtraRooms] = useState<string[]>([]);
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
      const sel = HOME_PRESETS.find((p) => p.label === preset);
      if (sel) {
        rooms.push("Kitchen");
        rooms.push("Living Room");
        const bdr = Math.floor(sel.bedrooms || 0);
        const bath = sel.bathrooms || 0;
        for (let i = 1; i <= bdr; i++) rooms.push(`Bedroom ${i}`);
        const full = Math.floor(bath);
        const half = bath % 1 >= 0.5 ? 1 : 0;
        for (let i = 1; i <= full; i++) rooms.push(`Full Bathroom ${i}`);
        if (half) rooms.push("Half Bathroom");
      }
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
      setPreset("");
      setExtraRoom("");
      setExtraRooms([]);
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
                  onChange={(e) => setPreset(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm cursor-pointer hover:border-transparent transition-colors"
                  style={{ WebkitAppearance: "none" }}
                >
                  <option value="">Select preset (auto rooms)</option>
                  {HOME_PRESETS.map((p) => (
                    <option key={p.label} value={p.label}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <div className="mt-2">
                  <div className="text-[11px] text-gray-600">Add more rooms</div>
                  <div className="flex gap-2 mt-1">
                    <select
                      value={extraRoom}
                      onChange={(e) => setExtraRoom(e.target.value)}
                      className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select room</option>
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
                    >
                      Add
                    </Button>
                  </div>
                  {extraRooms.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {extraRooms.map((r) => (
                        <span
                          key={r}
                          className="text-sm px-3 py-1.5 bg-blue-50 text-blue-800 rounded-full border border-blue-200 shadow-sm"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
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
