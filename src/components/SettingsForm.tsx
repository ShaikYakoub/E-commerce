"use client";

import { updateProfile } from "@/actions/updateProfile";
import { UploadButton } from "@/lib/uploadthing";
import { useState } from "react";
import Image from "next/image";
import { User, Loader2, Camera, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [imageUrl, setImageUrl] = useState(user.image || "");
  const [isPending, setIsPending] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Track image upload status
  const [success, setSuccess] = useState(false); // Track success state for UI
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setSuccess(false);
    
    await updateProfile(formData);
    
    setIsPending(false);
    setSuccess(true);

    // Redirect to Dashboard (Home) after 1 second so they see the success message
    setTimeout(() => {
      router.push("/"); 
      router.refresh();
    }, 1000);
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-5 h-5" />
          <span>Profile updated successfully! Redirecting...</span>
        </div>
      )}

      {/* PROFILE PICTURE SECTION */}
      <div className="flex flex-col items-center sm:flex-row gap-6">
        <div className="relative group">
          {/* 1. The Image Display */}
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg relative">
            {imageUrl ? (
              <Image src={imageUrl} alt="Profile" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <User className="w-12 h-12" />
              </div>
            )}

            {/* Loading Overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
            
            {/* Hover Overlay (Visual Cue) */}
            {!isUploading && (
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                <Camera className="w-8 h-8 text-white mb-1" />
                <span className="text-white text-xs font-medium">Change</span>
              </div>
            )}
          </div>

          {/* 2. The Invisible Upload Button (Click Hijacking) */}
          <div className="absolute inset-0 z-30 opacity-0 cursor-pointer overflow-hidden rounded-full">
            <UploadButton
              endpoint="imageUploader"
              onUploadBegin={() => setIsUploading(true)}
              onClientUploadComplete={(res) => {
                setIsUploading(false);
                if (res?.[0]?.url) {
                  setImageUrl(res[0].url);
                }
              }}
              onUploadError={(error: Error) => {
                setIsUploading(false);
                alert(`Error uploading: ${error.message}`);
              }}
              appearance={{
                button: "w-full h-full scale-150 cursor-pointer", // Scale up to cover edges
                allowedContent: "hidden",
                container: "w-full h-full"
              }}
            />
          </div>
        </div>
        
        <div className="text-center sm:text-left">
          <h3 className="font-medium text-gray-900">Profile Picture</h3>
          <p className="text-sm text-gray-500 mt-1">
            Click the image to upload a new photo.
          </p>
          <input type="hidden" name="imageUrl" value={imageUrl} />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            name="name"
            defaultValue={user.name || ""}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            value={user.email}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending || isUploading}
        className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition disabled:opacity-50"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Saving...
          </span>
        ) : (
          "Save Changes"
        )}
      </button>
    </form>
  );
}