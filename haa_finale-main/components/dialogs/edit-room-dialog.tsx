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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { FileUpload } from "@/components/ui/file-upload";
import {
  useUpdateRoom,
  useRoomFiles,
  useUploadRoomFile,
  useDeleteRoomFile,
} from "@/hooks/use-supabase-query";
import { uploadPublicImage, uploadPublicFile } from "@/lib/storage";
import { X } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/lib/supabase";

const roomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  paint_color: z.string().optional(),
  flooring: z.string().optional(),
  lighting: z.string().optional(),
  installer: z.string().optional(),
  purchase_from: z.string().optional(),
  warranty_provider: z.string().optional(),
  warranty_start_date: z.string().optional(),
  warranty_end_date: z.string().optional(),
  warranty_notes: z.string().optional(),
});

type RoomForm = z.infer<typeof roomSchema>;

interface EditRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: Database["public"]["Tables"]["rooms"]["Row"];
  homeId: string;
}

export function EditRoomDialog({
  open,
  onOpenChange,
  room,
  homeId,
}: EditRoomDialogProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(room.image_url || "");
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const updateRoomMutation = useUpdateRoom();
  const { data: roomFiles, isLoading: filesLoading } = useRoomFiles(room.id);
  const uploadFileMutation = useUploadRoomFile();
  const deleteFileMutation = useDeleteRoomFile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoomForm>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: room.name || "",
      paint_color: room.paint_color || "",
      flooring: room.flooring || "",
      lighting: room.lighting || "",
      installer: room.installer || "",
      purchase_from: room.purchase_from || "",
      warranty_provider: room.warranty_json?.provider || "",
      warranty_start_date: room.warranty_json?.start_date || "",
      warranty_end_date: room.warranty_json?.end_date || "",
      warranty_notes: room.warranty_json?.notes || "",
    },
  });

  useEffect(() => {
    if (room) {
      reset({
        name: room.name || "",
        paint_color: room.paint_color || "",
        flooring: room.flooring || "",
        lighting: room.lighting || "",
        installer: room.installer || "",
        purchase_from: room.purchase_from || "",
        warranty_provider: room.warranty_json?.provider || "",
        warranty_start_date: room.warranty_json?.start_date || "",
        warranty_end_date: room.warranty_json?.end_date || "",
        warranty_notes: room.warranty_json?.notes || "",
      });
      setImageUrl(room.image_url || "");
      setNewFiles([]);
    }
  }, [room, reset]);

  const onSubmit = async (data: RoomForm) => {
    try {
      setUploading(true);
      let finalImageUrl = imageUrl;

      if (imageFile) {
        const uploadedUrl = await uploadPublicImage(imageFile, "rooms");
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      let warranty_json = null;
      if (
        data.warranty_provider ||
        data.warranty_start_date ||
        data.warranty_end_date ||
        data.warranty_notes
      ) {
        warranty_json = {
          provider: data.warranty_provider || null,
          start_date: data.warranty_start_date || null,
          end_date: data.warranty_end_date || null,
          notes: data.warranty_notes || null,
        };
      }

      await updateRoomMutation.mutateAsync({
        id: room.id,
        homeId,
        name: data.name,
        paint_color: data.paint_color || null,
        flooring: data.flooring || null,
        lighting: data.lighting || null,
        installer: data.installer || null,
        purchase_from: data.purchase_from || null,
        warranty_json,
        image_url: finalImageUrl || null,
      });

      for (const file of newFiles) {
        const result = await uploadPublicFile(file, "room-files");
        if (result) {
          await uploadFileMutation.mutateAsync({
            room_id: room.id,
            file_name: result.fileName,
            file_url: result.url,
            file_type: file.type,
            file_size: file.size,
          });
        }
      }

      setNewFiles([]);
      setImageFile(null);
      onOpenChange(false);
      toast.success("Room updated successfully");
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Failed to update room");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    reset();
    setImageFile(null);
    setImageUrl(room.image_url || "");
    setNewFiles([]);
    onOpenChange(false);
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    } else {
      setImageUrl(room.image_url || "");
    }
  };

  const handleRemoveExistingFile = async (fileId: string, fileUrl: string) => {
    await deleteFileMutation.mutateAsync({
      id: fileId,
      roomId: room.id,
      fileUrl,
    });
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
                Edit Room: {room.name}
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
              <Label className="text-sm font-medium text-gray-700">
                Room Name *
              </Label>
              <Input
                {...register("name")}
                placeholder="Living Room"
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Paint Color
                </Label>
                <Input
                  {...register("paint_color")}
                  placeholder="Beige"
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Flooring
                </Label>
                <Input
                  {...register("flooring")}
                  placeholder="Hardwood"
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Lighting
              </Label>
              <Input
                {...register("lighting")}
                placeholder="LED Recessed Lights"
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Installer
                </Label>
                <Input
                  {...register("installer")}
                  placeholder="ABC Flooring Co."
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Purchased From
                </Label>
                <Input
                  {...register("purchase_from")}
                  placeholder="Home Depot"
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900">
                Warranty Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Warranty Provider
                  </Label>
                  <Input
                    {...register("warranty_provider")}
                    placeholder="Manufacturer"
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Start Date
                  </Label>
                  <Input
                    type="date"
                    {...register("warranty_start_date")}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    End Date
                  </Label>
                  <Input
                    type="date"
                    {...register("warranty_end_date")}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Notes
                  </Label>
                  <Textarea
                    {...register("warranty_notes")}
                    placeholder="Additional warranty details..."
                    rows={2}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Room Image
              </Label>
              <ImageUpload
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
                onRemove={() => {
                  setImageUrl("");
                  setImageFile(null);
                }}
                disabled={uploading}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Documents & Receipts
              </Label>
              <FileUpload
                onFileSelect={setNewFiles}
                existingFiles={roomFiles || []}
                onRemoveExisting={handleRemoveExistingFile}
                disabled={uploading}
                maxFiles={10}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={uploading}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent rounded-md"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 rounded-md font-medium"
              >
                {uploading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
