import { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import CandidateViewList from "../CandidateViewTable";
import { RefreshCw, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API_BASE_URL = "http://16.171.117.2:3000";

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
      if (data.status && Array.isArray(data.result)) {
        setApplicants(data.result);
      } else {
        setApplicants([]);
        if (!data.status) {
          throw new Error(data.message || "Failed to fetch applicants");
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message);
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && jobId) {
      setActiveStatus(initialStatus);
      fetchApplicants();
    }
  }, [open, jobId, initialStatus]);

  const filteredApplicants = applicants
    .filter((applicant) =>
      applicant.jobs_assigned?.some((job: any) => job.job_id === jobId)
    )
    .map((applicant) => {
      const jobData = applicant.jobs_assigned.find(
        (job: any) => job.job_id === jobId
      );
      return {
        ...applicant,
        status: jobData?.status || applicant.status,
      };
    })
    .filter((applicant) => {
      if (activeStatus === "All") {
        return true;
      }
      return applicant.status === activeStatus;
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen h-screen flex flex-col p-0 gap-0">
        <div className="relative flex-shrink-0 p-6 border-b bg-white/80 backdrop-blur-sm top-0 z-10">
          <DialogHeader className="space-y-0">
            <div className="flex items-center">
              <DialogTitle className="flex items-center space-x-4 text-lg">
                <span>View Applications</span>
              </DialogTitle>
            </div>

            <div className="flex space-x-2 overflow-x-auto pt-4 pb-1">
              {STATUSES.map((status) => (
                <Button
                  key={status}
                  variant={status === activeStatus ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    fetchApplicants();
                    setActiveStatus(status);
                  }}
                  className={
                    status === activeStatus
                      ? "whitespace-nowrap bg-blue-500 hover:bg-blue-600"
                      : "whitespace-nowrap"
                  }
                >
                  {status}
                </Button>
              ))}
            </div>
          </DialogHeader>

          <DialogClose asChild>
            <Button
              variant="ghost"
              className="absolute top-6 right-6 p-2 h-auto rounded-full"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </div>

        <div className="flex-grow overflow-y-auto bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <RefreshCw className="h-6 w-6 animate-spin mr-3" />
              <span>Loading Applicants...</span>
            </div>
          ) : (
            <div className="p-4 md:p-6">
              <CandidateViewList
                loading={false}
                jobId={jobId}
                candidates={filteredApplicants}
                fetchCandidates={fetchApplicants}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
