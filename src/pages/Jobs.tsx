import { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  EllipsisVerticalIcon,
  ChevronDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PostNewJobModal from "@/components/modals/PostNewJobModal";
import JobViewModal from "@/components/modals/JobViewModal";
import ViewApplicationsModal from "@/components/modals/ViewApplicationModal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { toast } from "sonner";
import EditJobModal from "@/components/modals/EditJobModal";
import CloneJobModal from "@/components/modals/CloneJobModal";
import PublishJobModal from "@/components/modals/PublishJobModal";
import { API_BASE_URL } from "../config/api";
const JOBS_PER_PAGE = 10;

const JOB_STATUSES = ["Draft", "Open", "Paused", "Closed", "Archived"];
const STATUS_TABS = ["All", ...JOB_STATUSES];

interface StatusOption {
  id: number;
  name: string;
  type: "candidate" | "recruiter";
  is_active: boolean;
  color: string;
}

const getStatusColorClass = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-green-500";
    case "Paused":
      return "bg-yellow-500";
    case "Closed":
      return "bg-red-500";
    case "Archived":
      return "bg-indigo-500";
    case "Draft":
    default:
      return "bg-slate-400";
  }
};

const getPriorityColorClass = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "text-red-800 bg-red-100";
    case "medium":
      return "text-yellow-800 bg-yellow-100";
    case "low":
    default:
      return "text-green-800 bg-green-100";
  }
};

type Job = {
  id: number;
  job_title: string;
  company_industry: string;
  employment_type: string;
  office_primary_location: string;
  company: string | null;
  applicants: number;
  stageCounts: Record<string, number>;
  status: string;
  priority: string;
};

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pipelineStages, setPipelineStages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatusTab, setActiveStatusTab] = useState("All");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJobViewOpen, setIsJobViewOpen] = useState(false);
  const [isViewApplicantsOpen, setIsViewApplicantsOpen] = useState(false);
  const [isJobEditOpen, setIsJobEditOpen] = useState(false);
  const [isJobCloneOpen, setIsJobCloneOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [expandedCompanies, setExpandedCompanies] = useState<
    Record<string, boolean>
  >({});
  const [currentPage, setCurrentPage] = useState(1);

  // --- Data Fetching Functions ---

  const fetchPipelineStages = async () => {
    try {
      const statusResponse = await axios.get<{ result: StatusOption[] }>(
        `${API_BASE_URL}/candidate/getAllStatus`
      );
      if (statusResponse.data && Array.isArray(statusResponse.data.result)) {
        const fetchedStages = statusResponse.data.result
          .filter((status) => status.is_active && status.type === "candidate")
          .map((status) => status.name);
        setPipelineStages(fetchedStages);
        return fetchedStages; // Return the stages for chaining
      } else {
        toast.error("Could not parse pipeline stages from API.");
        return []; // Return empty array on failure
      }
    } catch (error) {
      console.error("Failed to fetch statuses", error);
      toast.error("Could not load status options.");
      return []; // Return empty array on error
    }
  };

  const fetchJobs = async (stages: string[]) => {
    if (!stages || stages.length === 0) {
      console.error("fetchJobs was called without stages.");
      return;
    }
    try {
      const jobsResponse = await axios.get(`${API_BASE_URL}/jobs/getAllJobs`);
      const jobsData = jobsResponse.data.result;

      const jobsWithData = await Promise.all(
        jobsData.map(async (job: any) => {
          let applicantsList: any[] = [];
          try {
            const applicantsRes = await axios.get(
              `${API_BASE_URL}/jobs/${job.id}/applicants`
            );
            if (
              applicantsRes.data &&
              applicantsRes.data.status &&
              Array.isArray(applicantsRes.data.result)
            ) {
              applicantsList = applicantsRes.data.result;
            }
          } catch (err: any) {
            console.warn(
              `Could not fetch applicants for job ID ${job.id}: ${err.message}`
            );
          }

          const stageCounts = stages.reduce((acc, stage) => {
            acc[stage] = applicantsList.filter((applicant) => {
              const jobApplication = applicant.jobs_assigned?.find(
                (jobApp: any) => jobApp.job_id === job.id
              );
              return jobApplication && jobApplication.status === stage;
            }).length;
            return acc;
          }, {} as Record<string, number>);

          return {
            ...job,
            applicants: applicantsList.length,
            stageCounts,
          };
        })
      );
      setJobs(jobsWithData);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
      toast.error("Could not load job listings.");
    }
  };

  // --- Effects ---

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      const stages = await fetchPipelineStages();
      if (stages.length > 0) {
        await fetchJobs(stages);
      }
      setIsLoading(false);
    };
    initializeData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatusTab, searchQuery]);

  // --- Memos and Logic ---

  const statusCounts = useMemo(() => {
    const counts = jobs.reduce((acc, job) => {
      if (job.status) {
        acc[job.status] = (acc[job.status] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    counts.All = jobs.length;
    return counts;
  }, [jobs]);

  const filteredJobs = jobs
    .filter((job) =>
      job.job_title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((job) => {
      if (activeStatusTab === "All") return true;
      return job.status === activeStatusTab;
    });

  const indexOfLastJob = currentPage * JOBS_PER_PAGE;
  const indexOfFirstJob = indexOfLastJob - JOBS_PER_PAGE;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const groupedJobs = useMemo(() => {
    return currentJobs.reduce((acc, job) => {
      const companyName = job.company || "Unassigned Jobs";
      if (!acc[companyName]) {
        acc[companyName] = [];
      }
      acc[companyName].push(job);
      return acc;
    }, {} as Record<string, Job[]>);
  }, [currentJobs]);

  // --- Handlers and Render Functions ---

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm("Delete this job permanently?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/jobs/${jobId}`);
      toast.success("Job has been deleted.");
      const newJobs = jobs.filter((job) => job.id !== jobId);
      setJobs(newJobs);
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Could not delete the job.");
    }
  };

  const handleStatusChange = async (jobId: number, status: string) => {
    try {
      await axios.put(`${API_BASE_URL}/jobs/${jobId}`, { status });
      toast.success(`Job status updated to ${status}`);
      setJobs(jobs.map((job) => (job.id === jobId ? { ...job, status } : job)));
    } catch (err) {
      console.error("Failed to update job status", err);
      toast.error("Could not update the job status.");
    }
  };

  const toggleCompanyVisibility = (companyName: string) => {
    setExpandedCompanies((prev) => ({
      ...prev,
      [companyName]: !(prev[companyName] ?? true),
    }));
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPageButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <nav
        className="flex items-center justify-center space-x-2 mt-8"
        aria-label="Pagination"
      >
        <Button
          variant="outline"
          className="h-9 w-9 p-0"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Previous</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {startPage > 1 && (
          <Button
            variant="outline"
            className="h-9 w-9 p-0"
            onClick={() => setCurrentPage(1)}
          >
            1
          </Button>
        )}
        {startPage > 2 && <span className="pt-1">...</span>}
        {pageNumbers.map((number) => (
          <Button
            key={number}
            variant={currentPage === number ? "default" : "outline"}
            className={`h-9 w-9 p-0 ${
              currentPage === number ? "bg-blue-600 hover:bg-blue-700" : ""
            }`}
            onClick={() => setCurrentPage(number)}
          >
            {number}
          </Button>
        ))}
        {endPage < totalPages - 1 && <span className="pt-1">...</span>}
        {endPage < totalPages && (
          <Button
            variant="outline"
            className="h-9 w-9 p-0"
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </Button>
        )}
        <Button
          variant="outline"
          className="h-9 w-9 p-0"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className="sr-only">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header, Search, Tabs */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Jobs Dashboard
            </h1>
            <p className="text-slate-600 mt-1">
              View current Jobs or Post new Jobs!
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>
        <div className="flex items-center gap-2 w-full">
          <Card className="w-full border border-slate-200">
            <CardContent className="flex items-center gap-2 py-1 px-4">
              <Search className="text-slate-400" />
              <Input
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-none focus-visible:ring-0 shadow-none"
              />
            </CardContent>
          </Card>
        </div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex justify-between" aria-label="Tabs">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveStatusTab(tab)}
                className={`whitespace-nowrap w-full pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeStatusTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
                <span
                  className={`ml-2 text-xs py-0.5 px-2 rounded-full ${
                    activeStatusTab === tab
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {statusCounts[tab] || 0}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="space-y-8 pt-4">
          {isLoading ? (
            <div className="flex justify-center items-center pt-16">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <p className="text-slate-500">Loading Jobs...</p>
            </div>
          ) : Object.keys(groupedJobs).length > 0 ? (
            <>
              {Object.entries(groupedJobs).map(([companyName, jobsInGroup]) => {
                const isExpanded = expandedCompanies[companyName] ?? true;
                return (
                  <div key={companyName}>
                    <button
                      onClick={() => toggleCompanyVisibility(companyName)}
                      className="w-full flex items-center text-left text-xl font-bold text-slate-700 border-b pb-2 mb-4"
                    >
                      <ChevronDown
                        className={`w-5 h-5 mr-2 transition-transform duration-200 ${
                          isExpanded ? "rotate-0" : "-rotate-90"
                        }`}
                      />
                      {companyName}
                    </button>
                    {isExpanded && (
                      <div className="flex flex-col gap-6 pl-2">
                        {jobsInGroup.map((job) => (
                          <Card
                            key={job.id}
                            className="w-full border border-slate-200 hover:shadow-lg transition duration-200 rounded-xl"
                          >
                            <CardContent className="p-6 space-y-5">
                              <div className="flex justify-between items-start">
                                <div
                                  className="cursor-pointer space-y-1"
                                  onClick={() => {
                                    setSelectedJob(job);
                                    setIsJobViewOpen(true);
                                  }}
                                >
                                  <h3 className="text-xl font-semibold text-slate-800">
                                    {job.job_title}
                                    {job.priority && (
                                      <span
                                        className={`ml-3 px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColorClass(
                                          job.priority
                                        )}`}
                                      >
                                        {job.priority}
                                      </span>
                                    )}
                                  </h3>
                                  <div className="flex items-center gap-2 flex-wrap text-sm text-slate-600">
                                    <span>{job.office_primary_location}</span>
                                    <span className="text-gray-300">·</span>
                                    <span>{job.employment_type}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className="flex items-center gap-2 text-xs font-medium p-2 h-auto rounded-md"
                                      >
                                        <span
                                          className={`h-2 w-2 rounded-full ${getStatusColorClass(
                                            job.status
                                          )}`}
                                          aria-hidden="true"
                                        />
                                        <span>{job.status}</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="w-40"
                                    >
                                      {JOB_STATUSES.map((statusOption) => (
                                        <DropdownMenuItem
                                          key={statusOption}
                                          onSelect={() =>
                                            handleStatusChange(
                                              job.id,
                                              statusOption
                                            )
                                          }
                                          disabled={job.status === statusOption}
                                        >
                                          {statusOption}
                                        </DropdownMenuItem>
                                      ))}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                  <div
                                    onClick={() => {
                                      setSelectedJob(job);
                                      setIsViewApplicantsOpen(true);
                                    }}
                                    className="text-sm text-blue-600 font-medium cursor-pointer"
                                  >
                                    {job.applicants} applicant
                                    {job.applicants !== 1 && "s"}
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <button
                                        className="p-1 rounded-full hover:bg-slate-100 transition"
                                        aria-label="Job actions"
                                      >
                                        <EllipsisVerticalIcon className="w-5 h-5 text-slate-500" />
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="w-40"
                                    >
                                      <DropdownMenuItem
                                        onSelect={() => {
                                          setSelectedJob(job);
                                          setIsJobEditOpen(true);
                                        }}
                                      >
                                        Edit Job
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onSelect={() => {
                                          setSelectedJob(job);
                                          setIsJobCloneOpen(true);
                                        }}
                                      >
                                        Clone Job
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onSelect={() => handleDeleteJob(job.id)}
                                      >
                                        Delete Job
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onSelect={() => {
                                          setSelectedJob(job);
                                          setIsPublishModalOpen(true);
                                        }}
                                      >
                                        Publish Job
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                              <div>
                                <div className="overflow-x-auto rounded-md border border-blue-200 bg-blue-50/50">
                                  <table className="min-w-full table-fixed text-sm text-slate-700">
                                    <thead>
                                      <tr className="bg-blue-100 text-blue-800">
                                        {pipelineStages.map((stage) => (
                                          <th
                                            key={stage}
                                            className="px-4 py-2 border-b border-r last:border-r-0 font-semibold text-center"
                                          >
                                            {stage}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr className="bg-white">
                                        {pipelineStages.map((stage) => (
                                          <td
                                            key={stage}
                                            className="px-4 py-2 border-r last:border-r-0 text-center cursor-pointer"
                                            onClick={() => {
                                              setSelectedJob({ ...job });
                                              setIsViewApplicantsOpen(true);
                                              setSelectedStage(stage);
                                            }}
                                          >
                                            <span className="text-blue-600 font-medium">
                                              {job.stageCounts[stage] ?? 0}
                                            </span>
                                          </td>
                                        ))}
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {renderPagination()}
            </>
          ) : (
            <p className="text-center text-slate-500 pt-8">
              No jobs found for this status.
            </p>
          )}
        </div>
      </div>

      {/* --- All Modals --- */}
      <PostNewJobModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchJobs(pipelineStages);
        }}
      />
      {isJobViewOpen && selectedJob && (
        <JobViewModal
          open={isJobViewOpen}
          onOpenChange={setIsJobViewOpen}
          job={selectedJob}
        />
      )}
      {isViewApplicantsOpen && selectedJob && (
        <ViewApplicationsModal
          open={isViewApplicantsOpen}
          onOpenChange={(open) => {
            setIsViewApplicantsOpen(open);
            if (!open) {
              setSelectedStage(null);
              fetchJobs(pipelineStages);
            }
          }}
          jobId={selectedJob.id}
          statusFilter={selectedStage}
        />
      )}
      {isJobEditOpen && selectedJob && (
        <EditJobModal
          open={isJobEditOpen}
          onOpenChange={setIsJobEditOpen}
          jobId={selectedJob.id}
          onSuccess={() => {
            setIsJobEditOpen(false);
            fetchJobs(pipelineStages);
          }}
        />
      )}
      {isJobCloneOpen && selectedJob && (
        <CloneJobModal
          open={isJobCloneOpen}
          onOpenChange={setIsJobCloneOpen}
          jobId={selectedJob.id}
          onSuccess={() => {
            setIsJobCloneOpen(false);
            fetchJobs(pipelineStages);
          }}
        />
      )}
      {isPublishModalOpen && selectedJob && (
        <PublishJobModal
          open={isPublishModalOpen}
          onOpenChange={setIsPublishModalOpen}
          jobId={selectedJob.id}
          onSuccess={() => {
            setIsPublishModalOpen(false);
            fetchJobs(pipelineStages);
          }}
        />
      )}
    </Layout>
  );
}

