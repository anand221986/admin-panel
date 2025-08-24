import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const API_BASE_URL = "http://16.171.117.2:3000";

const CAREER_SITES = [
  "LinkedIn",
  "Indeed",
  "Glassdoor",
  "Company Website",
  "AngelList",
];

type PublishJobModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: number;
  onSuccess: () => void;
};

export default function PublishJobModal({
  open,
  onOpenChange,
  jobId,
  onSuccess,
}: PublishJobModalProps) {
  const [selectedSites, setSelectedSites] = useState<Record<string, boolean>>(
    {}
  );
  const [isPublishing, setIsPublishing] = useState(false);

  const handleSiteSelectionChange = (site: string, checked: boolean) => {
    setSelectedSites((prev) => ({
      ...prev,
      [site]: checked,
    }));
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    const sitesToPublish = Object.keys(selectedSites).filter(
      (site) => selectedSites[site]
    );

    if (sitesToPublish.length === 0) {
      toast.error("Please select at least one career site to publish to.");
      setIsPublishing(false);
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/jobs/${jobId}/publish`, {
        sites: sitesToPublish,
      });

      toast.success(
        `Job successfully published to: ${sitesToPublish.join(", ")}`
      );
      onSuccess();
    } catch (error) {
      console.error("Failed to publish job:", error);
      toast.error("An error occurred while trying to publish the job.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Publish Job</DialogTitle>
          <DialogDescription>
            Select the career sites where you want to post this job opening.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <p className="font-semibold text-sm text-slate-700">Career Sites</p>
          <div className="space-y-3">
            {CAREER_SITES.map((site) => (
              <div key={site} className="flex items-center space-x-2">
                <Checkbox
                  id={site}
                  checked={!!selectedSites[site]}
                  onCheckedChange={(checked) =>
                    handleSiteSelectionChange(site, !!checked)
                  }
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <Label htmlFor={site} className="cursor-pointer">
                  {site}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
