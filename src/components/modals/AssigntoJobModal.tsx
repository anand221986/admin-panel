import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { InfoIcon } from "lucide-react";

const API_BASE_URL = "http://16.171.117.2:3000";

interface Job {
  id: number;
  job_title: string;
  job_code: string;
  department: string;
  workplace: string;
  employment_type: string;
  office_primary_location: string;
  description_about: string;
  description_requirements: string;
  description_benefits: string;
}

interface AssignToJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateIds: number[];
  onSuccess?: () => void;
}

interface BatchAssignPayload {
  jobIds: number[];
  candidateIds: number[];
}

const AssignToJobModal: React.FC<AssignToJobModalProps> = ({
  open,
  onOpenChange,
  candidateIds,
  onSuccess,
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobs, setSelectedJobs] = useState<Set<number>>(new Set());
  const [previewJob, setPreviewJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      axios
        .get(`${API_BASE_URL}/jobs/getAllJobs`)
        .then((res) => {
          const list = res.data.result as Job[];
          setJobs(list);
        })
        .catch((err) => console.error("Error fetching jobs:", err));
    }
  }, [open]);

  useEffect(() => {
    setSearchTerm("");
    setSelectedJobs(new Set());
    setPreviewJob(null);
  }, [open]);

  const filteredJobs = useMemo(
    () =>
      jobs.filter(
        (job) =>
          job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.job_code.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [jobs, searchTerm]
  );

  const toggleJobSelection = (id: number) => {
    const newSet = new Set(selectedJobs);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedJobs(newSet);
  };

  const handleAssign = async () => {
    if (selectedJobs.size === 0) {
      toast.error("Please select at least one job.");
      return;
    }
    setLoading(true);

    const jobIds = Array.from(selectedJobs);
    const payload: BatchAssignPayload = {
      jobIds,
      candidateIds,
    };

    try {
      console.log(payload);
      await axios.post(`${API_BASE_URL}/candidate/assignCandidates`, payload);
      toast.success(
        `Assigned ${candidateIds.length} candidate(s) to ${jobIds.length} job(s)`
      );
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error("Batch assignment failed:", err);
      toast.error("Failed to assign candidates!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Assign Candidates to Job(s)</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search jobs by title or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
          aria-label="Search jobs"
        />

        <div className="flex gap-4">
          <ScrollArea className="h-64 w-1/2 border p-2 rounded">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-1 hover:bg-gray-50 rounded"
              >
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedJobs.has(job.id)}
                    onCheckedChange={() => toggleJobSelection(job.id)}
                    aria-label={`Select job ${job.job_title}`}
                  />
                  <span>{job.job_title}</span>
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewJob(job)}
                  aria-label={`Preview details for ${job.job_title}`}
                >
                  <InfoIcon />
                </Button>
              </div>
            ))}
            {filteredJobs.length === 0 && (
              <p className="text-center text-sm text-gray-500 mt-4">
                No jobs found.
              </p>
            )}
          </ScrollArea>

          <div className="w-1/2 h-64 overflow-auto border p-2 rounded">
            {previewJob ? (
              <div className="space-y-2">
                <h3 className="font-semibold">{previewJob.job_title}</h3>
                <p>
                  <strong>Code:</strong> {previewJob.job_code}
                </p>
                <p>
                  <strong>Department:</strong> {previewJob.department}
                </p>
                <p>
                  <strong>Workplace:</strong> {previewJob.workplace}
                </p>
                <p>
                  <strong>Employment Type:</strong> {previewJob.employment_type}
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  {previewJob.office_primary_location}
                </p>
                <h4 className="mt-2 font-medium">About</h4>
                <p className="text-sm whitespace-pre-wrap">
                  {previewJob.description_about}
                </p>
                <h4 className="mt-2 font-medium">Requirements</h4>
                <p className="text-sm whitespace-pre-wrap">
                  {previewJob.description_requirements}
                </p>
                <h4 className="mt-2 font-medium">Benefits</h4>
                <p className="text-sm whitespace-pre-wrap">
                  {previewJob.description_benefits}
                </p>
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500 mt-4">
                Click the{" "}
                <InfoIcon
                  className="inline h-4 w-4 align-text-bottom"
                  aria-hidden="true"
                />{" "}
                icon to preview job details.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={selectedJobs.size === 0 || loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {loading ? "Assigning" : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignToJobModal;

