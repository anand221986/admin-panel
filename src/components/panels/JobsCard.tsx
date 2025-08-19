import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MinusCircle, ChevronDown } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = "http://16.171.117.2:3000";

interface StatusOption {
  id: number;
  name: string;
  type: "candidate" | "recruiter";
  is_active: boolean;
  color: string;
}

interface JobAssignment {
  job_id: number;
  status: string;
  job_title: string;
}

interface JobsCardProps {
  candidateId: number;
  jobs: JobAssignment[];
  fetchCandidates: () => void;
  onAddJob: () => void;
}

export default function JobsCard({
  candidateId,
  jobs,
  fetchCandidates,
  onAddJob,
}: JobsCardProps) {
  const [localJobs, setLocalJobs] = useState<JobAssignment[]>(jobs);
  const [jobPipelineStages, setJobPipelineStages] = useState<StatusOption[]>(
    []
  );

  useEffect(() => {
    setLocalJobs(jobs);
  }, [jobs]);

  useEffect(() => {
    const fetchJobStatuses = async () => {
      try {
        const response = await axios.get<{ result: StatusOption[] }>(
          `${API_BASE_URL}/candidate/getAllStatus`
        );
        if (response.data && Array.isArray(response.data.result)) {
          const activeCandidateStatuses = response.data.result.filter(
            (status) => status.is_active && status.type === "candidate"
          );
          setJobPipelineStages(activeCandidateStatuses);
        }
      } catch (error) {
        console.error("Failed to fetch job pipeline statuses:", error);
        toast.error("Could not load job stages.");
      }
    };

    fetchJobStatuses();
  }, []);

  const handleJobStatusChange = async (
    jobId: number,
    field: string,
    value: string
  ) => {
    const originalJobs = [...localJobs];

    const updatedJobs = localJobs.map((job) =>
      job.job_id === jobId ? { ...job, [field]: value } : job
    );
    setLocalJobs(updatedJobs);

    try {
      await axios.put(`${API_BASE_URL}/candidate/job-assignment/update`, {
        candidateId,
        jobId,
        field,
        value,
      });
      toast.success(`Status updated to "${value}"`);
      fetchCandidates();
    } catch (error) {
      console.error("Failed to update job status:", error);
      toast.error("Failed to update status. Reverting changes.");
      setLocalJobs(originalJobs);
    }
  };

  const handleRemoveJob = async (jobId: number) => {
    const originalJobs = [...localJobs];
    const updatedJobs = localJobs.filter((job) => job.job_id !== jobId);
    setLocalJobs(updatedJobs);

    try {
      await axios.post(`${API_BASE_URL}/candidate/job-detachment`, {
        jobIds: [jobId],
        candidateIds: [candidateId],
      });
      toast.success("Job removed from candidate");
      fetchCandidates();
    } catch (error) {
      console.error("Failed to remove job:", error);
      toast.error("Failed to remove job. Reverting changes.");
      setLocalJobs(originalJobs);
    }
  };

  return (
    <Card className="p-3 mt-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-xs uppercase text-slate-500">Jobs</p>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={onAddJob}
        >
          + Add job
        </Button>
      </div>
      <div className="space-y-2 pt-2">
        {localJobs?.length > 0 ? (
          localJobs.map((job) => {
            const currentStatus = jobPipelineStages.find(
              (s) => s.name === job.status
            );

            return (
              <div
                key={job.job_id}
                className="p-2 border rounded-md flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-sm text-slate-800">
                    {job.job_title}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-8 px-2 py-1 text-xs w-32 justify-between"
                      >
                        <div className="flex items-center">
                          <span
                            className="mr-2 h-2 w-2 rounded-full"
                            style={{
                              backgroundColor:
                                currentStatus?.color || "#94a3b8",
                            }}
                          />
                          <span>{job.status}</span>
                        </div>
                        <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {jobPipelineStages.map((stage) => (
                        <DropdownMenuItem
                          key={stage.id}
                          disabled={job.status === stage.name}
                          onSelect={() =>
                            handleJobStatusChange(
                              job.job_id,
                              "status",
                              stage.name
                            )
                          }
                        >
                          <div className="flex items-center">
                            <span
                              className="mr-2 h-2 w-2 rounded-full"
                              style={{ backgroundColor: stage.color }}
                            />
                            {stage.name}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-100 hover:text-red-600 h-8 w-8"
                    onClick={() => handleRemoveJob(job.job_id)}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-gray-400 text-center py-2">
            No jobs assigned.
          </p>
        )}
      </div>
    </Card>
  );
}
