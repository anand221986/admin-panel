import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";

const API_BASE_URL = "http://16.171.117.2:3000";

interface LinkedinImPortProps {
  jobId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LinkedinImPort({
  jobId,
  onClose,
  onSuccess,
}: LinkedinImPortProps) {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [importing, setImporting] = useState(false);

  const resetForm = () => {
    setLinkedinUrl("");
    setImporting(false);
  };

  const handleLinkedInImport = async (linkedinUrlsText: string) => {
    const urls = Array.from(
      new Set(
        linkedinUrlsText
          .split("\n")
          .map((u) => u.trim())
          .filter(Boolean)
      )
    );
    const invalid = urls.filter(
      (u) =>
        !/^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_.]+\/?/.test(u)
    );

    if (invalid.length)
      return toast.error(`Invalid URL(s): ${invalid.join(", ")}`);
    if (!urls.length)
      return toast.error("Please enter at least one LinkedIn URL.");

    setImporting(true);
    try {
      await axios.post(`${API_BASE_URL}/linkedinImportBulk`, {
        urls,
        job_id: jobId,
      });
      toast.success("LinkedIn profiles imported successfully.");
      resetForm();
      onSuccess();
    } catch {
      toast.error("Bulk import failed.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLinkedInImport(linkedinUrl);
      }}
      className="space-y-4"
    >
      <label className="text-sm">LinkedIn Profile URLs</label>
      <Textarea
        placeholder="Enter one URL per line"
        rows={5}
        value={linkedinUrl}
        onChange={(e) => setLinkedinUrl(e.target.value)}
        disabled={importing}
      />
      {linkedinUrl.trim() && (
        <p className="text-sm text-gray-600">
          {
            Array.from(
              new Set(
                linkedinUrl
                  .split("\n")
                  .map((u) => u.trim())
                  .filter(Boolean)
              )
            ).length
          }{" "}
          URL(s) entered.
        </p>
      )}
      <div className="mt-4 flex justify-end">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            disabled={importing}
            onClick={resetForm}
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={importing || !linkedinUrl.trim()}
          className="ml-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {importing ? "Importing..." : "Import All"}
        </Button>
      </div>
    </form>
  );
}

