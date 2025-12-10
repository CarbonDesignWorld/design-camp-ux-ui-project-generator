import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Link, Image, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface SubmissionFormProps {
  challengeId: string;
  onSuccess?: () => void;
}

const SubmissionForm = ({ challengeId, onSuccess }: SubmissionFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [figmaLink, setFigmaLink] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload up to 5 images.",
        variant: "destructive",
      });
      return;
    }

    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    // Create previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate("/login", { state: { from: `/challenge/${challengeId}` } });
      return;
    }

    if (!figmaLink && !externalUrl && imageFiles.length === 0) {
      toast({
        title: "No content",
        description: "Please add at least one image, Figma link, or URL.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload images
      const imageUrls: string[] = [];
      for (const file of imageFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${challengeId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("submissions")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("submissions")
          .getPublicUrl(fileName);

        imageUrls.push(urlData.publicUrl);
      }

      // Create submission
      const { error } = await supabase.from("submissions").insert({
        user_id: user.id,
        challenge_id: challengeId,
        image_urls: imageUrls.length > 0 ? imageUrls : null,
        figma_link: figmaLink || null,
        external_url: externalUrl || null,
        notes: notes || null,
      });

      if (error) throw error;

      toast({
        title: "Submission successful!",
        description: "Your work has been submitted to this challenge.",
      });

      // Reset form
      setFigmaLink("");
      setExternalUrl("");
      setNotes("");
      setImageFiles([]);
      setImagePreviews([]);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-card rounded-xl border p-6 text-center">
        <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-display font-bold text-lg mb-2">Submit Your Work</h3>
        <p className="text-muted-foreground mb-4">
          Sign in to submit your design for this challenge.
        </p>
        <Button onClick={() => navigate("/login", { state: { from: `/challenge/${challengeId}` } })}>
          Sign In to Submit
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl border p-6 space-y-6">
      <div>
        <h3 className="font-display font-bold text-lg mb-1">Submit Your Work</h3>
        <p className="text-sm text-muted-foreground">
          Share your design with the community.
        </p>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Image className="w-4 h-4" />
          Images (up to 5)
        </Label>
        <div className="flex flex-wrap gap-3">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-20 h-20 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-danger text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {imageFiles.length < 5 && (
            <label className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
              <Upload className="w-6 h-6 text-muted-foreground" />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Figma Link */}
      <div className="space-y-2">
        <Label htmlFor="figma" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Figma Link
        </Label>
        <Input
          id="figma"
          type="url"
          placeholder="https://figma.com/file/..."
          value={figmaLink}
          onChange={(e) => setFigmaLink(e.target.value)}
        />
      </div>

      {/* External URL */}
      <div className="space-y-2">
        <Label htmlFor="url" className="flex items-center gap-2">
          <Link className="w-4 h-4" />
          External URL
        </Label>
        <Input
          id="url"
          type="url"
          placeholder="https://dribbble.com/shots/..."
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="Share your design decisions, challenges faced, or anything else..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Submit My Work
          </>
        )}
      </Button>
    </form>
  );
};

export default SubmissionForm;
