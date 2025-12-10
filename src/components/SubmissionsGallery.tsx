import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ExternalLink, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Submission {
  id: string;
  user_id: string;
  challenge_id: string;
  image_urls: string[] | null;
  figma_link: string | null;
  external_url: string | null;
  notes: string | null;
  created_at: string;
  user_name?: string;
  challenge_title?: string;
}

const SubmissionsGallery = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data: submissionsData, error: submissionsError } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (submissionsError) throw submissionsError;

      if (!submissionsData || submissionsData.length === 0) {
        setSubmissions([]);
        setLoading(false);
        return;
      }

      // Fetch user names
      const userIds = [...new Set(submissionsData.map((s) => s.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, name")
        .in("user_id", userIds);

      const profileMap = new Map(
        profiles?.map((p) => [p.user_id, p.name]) || []
      );

      // Fetch challenge titles
      const challengeIds = [...new Set(submissionsData.map((s) => s.challenge_id))];
      const { data: challenges } = await supabase
        .from("challenges")
        .select("id, title")
        .in("id", challengeIds);

      const challengeMap = new Map(
        challenges?.map((c) => [c.id, c.title]) || []
      );

      const enrichedSubmissions = submissionsData.map((s) => ({
        ...s,
        user_name: profileMap.get(s.user_id) || "Camper",
        challenge_title: challengeMap.get(s.challenge_id) || "Unknown Challenge",
      }));

      setSubmissions(enrichedSubmissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getThumbnail = (submission: Submission): string | null => {
    if (submission.image_urls && submission.image_urls.length > 0) {
      return submission.image_urls[0];
    }
    return null;
  };

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="camp-card animate-pulse"
          >
            <div className="aspect-video bg-muted radius-md mb-4" />
            <div className="h-4 bg-muted radius-sm w-3/4 mb-2" />
            <div className="h-3 bg-muted radius-sm w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mb-6">
          <ImageIcon className="w-10 h-10 text-secondary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          No Submissions Yet
        </h3>
        <p className="text-muted-foreground max-w-md">
          Be the first to share your work! Complete a challenge and submit your design.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions.map((submission) => {
          const thumbnail = getThumbnail(submission);
          
          return (
            <div
              key={submission.id}
              className="camp-card cursor-pointer group"
              onClick={() => setSelectedSubmission(submission)}
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-muted radius-md mb-4 overflow-hidden">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={submission.challenge_title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                )}
              </div>

              {/* Info */}
              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {submission.challenge_title}
              </h4>
              <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                <span>by {submission.user_name}</span>
                <span>{format(new Date(submission.created_at), "MMM d")}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Detail Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSubmission?.challenge_title}</DialogTitle>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-6">
              {/* Images */}
              {selectedSubmission.image_urls && selectedSubmission.image_urls.length > 0 && (
                <div className="space-y-4">
                  {selectedSubmission.image_urls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Submission ${idx + 1}`}
                      className="w-full radius-md"
                    />
                  ))}
                </div>
              )}

              {/* Notes */}
              {selectedSubmission.notes && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Notes</h4>
                  <p className="text-muted-foreground">{selectedSubmission.notes}</p>
                </div>
              )}

              {/* Links */}
              <div className="flex flex-wrap gap-3">
                {selectedSubmission.figma_link && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(selectedSubmission.figma_link!, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View in Figma
                  </Button>
                )}
                {selectedSubmission.external_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(selectedSubmission.external_url!, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live
                  </Button>
                )}
              </div>

              {/* Meta */}
              <div className="pt-4 border-t border-border text-sm text-muted-foreground">
                <p>
                  Submitted by <span className="font-medium text-foreground">{selectedSubmission.user_name}</span> on{" "}
                  {format(new Date(selectedSubmission.created_at), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubmissionsGallery;
