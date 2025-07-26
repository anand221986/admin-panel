import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import CandidateViewList from "../CandidateViewTable";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API_BASE_URL = "http://51.20.181.155:3000";

const STATUSES = [
  "All",
  "Sourced",
  "Application",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
];

type ViewApplicationsModalProps = {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  jobId: number;
  statusFilter?: string | null;
};

export default function ViewApplicationsModal({
  open,
  onOpenChange,
  jobId,
  statusFilter,
}: ViewApplicationsModalProps) {
  const initialStatus = statusFilter ?? "All";

  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState<string>(initialStatus);

  const fetchApplicants = async () => {
    if (!jobId) return;

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/jobs/${jobId}/applicants`
      );
      if (data.status) {
        let list = data.result as any[];
        if (activeStatus && activeStatus !== "All") {
          list = list.filter((applicant) => applicant.status === activeStatus);
        }
        setApplicants(list);
      } else {
        throw new Error(data.message || "Failed to fetch applicants");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && jobId) {
      fetchApplicants();
    }
  }, [open, jobId, activeStatus]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="scrollbar-custom max-w-screen h-screen overflow-auto bg-gray-50">
        <DialogHeader className="flex flex-col space-y-2">
          {/* Title + Refresh */}
          <div className="flex items-center">
            <DialogTitle className="flex items-center space-x-2">
              <span>View Applications</span>
              {activeStatus !== "All" && (
                <span className="text-blue-600 font-medium">
                  — {activeStatus}
                </span>
              )}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchApplicants}
              aria-label="Refresh applicants"
              className="ml-1"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex space-x-2 overflow-auto">
            {STATUSES.map((status) => (
              <Button
                key={status}
                variant={status === activeStatus ? "secondary" : "outline"}
                size="sm"
                onClick={() => setActiveStatus(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">Loading...</div>
        ) : (
          <div>
            <CandidateViewList
              loading={loading}
              candidates={applicants}
              fetchCandidates={fetchApplicants}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
