import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import EditJobModal from "@/components/modals/EditJobModal";
import { toast } from "sonner";
import {
  Plus,
  Search,
  MapPin,
  Clock,
  Users,
  MoreHorizontal,
  Building2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PostNewJobModal from "@/components/modals/PostNewJobModal";


type Job = {
  id: number;
  title: string;
  client: string;
  department: string;
  location: string;
  type: string;
  status: string;
  applicants: number;
  posted: string;
  salary: string;
  priority: string;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Draft":
      return "bg-yellow-100 text-yellow-800";
    case "Paused":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800";
    case "Medium":
      return "bg-orange-100 text-orange-800";
    case "Low":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 5;

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Job Deleted Successfully.");
      setJobs((prev) => prev.filter((j) => j.id !== id));
      if ((currentPage - 1) * itemsPerPage >= jobs.length - 1) {
        setCurrentPage((p) => Math.max(p - 1, 1));
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete job: " + err.message);
    }
  };

  useEffect(() => {
    fetch("/api/jobs/getAllJobs")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const mapped: Job[] = data.result.map((item: any) => ({
          id: item.id,
          title: item.job_title,
          client: item.company_industry || "—",
          department: item.department,
          location: item.office_primary_location,
          type: item.employment_type,
          status: "Active",
          applicants: 0,
          posted: "Just now",
          salary: `$${item.salary_from} - $${item.salary_to}`,
          priority: "Medium",
        }));
        setJobs(mapped);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs.slice(startIdx, startIdx + itemsPerPage);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Client Jobs</h1>
            <p className="text-slate-600 mt-1">
              Manage job postings from your clients and track applications.
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>


        <PostNewJobModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {/* Filters */}
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search jobs..."
                  className="pl-10 bg-white/80"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-white/80">
                  Client
                </Button>
                <Button variant="outline" className="bg-white/80">
                  Status
                </Button>
                <Button variant="outline" className="bg-white/80">
                  Priority
                </Button>
                <Button variant="outline" className="bg-white/80">
                  Location
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Cards */}
        {loading && <p>Loading jobs…</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        <div className="space-y-4">
          {currentJobs.map((job) => (
            <Card
              key={job.id}
              className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-800">
                        {job.title}
                      </h3>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                      <Badge className={getPriorityColor(job.priority)}>
                        {job.priority}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-blue-600">
                        {job.client}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {job.applicants} applicants
                      </div>
                      <span>Posted {job.posted}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-slate-800">
                        {job.department}
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        {job.salary}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-white/80">
                      View Applications
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white/95 backdrop-blur-sm"
                      >
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedJob(job);
                            setOpenEditModal(true);
                          }}
                        >
                          Edit Job
                        </DropdownMenuItem>
                        <DropdownMenuItem>Clone Job</DropdownMenuItem>
                        <DropdownMenuItem>Contact Client</DropdownMenuItem>
                        <DropdownMenuItem>Archive Job</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onSelect={() => handleDelete(job.id)}
                        >
                          Delete Job
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Modal - OUTSIDE MAP */}
        {selectedJob && (
          <EditJobModal
            open={openEditModal}
            onOpenChange={setOpenEditModal}
            jobId={selectedJob?.id}
          />
        )}

        {/* Pagination */}
        {!loading && !error && jobs.length > itemsPerPage && (
          <div className="flex justify-center items-center space-x-2 mt-4">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, idx) => {
              const page = idx + 1;
              return (
                <Button
                  key={page}
                  variant={page === currentPage ? "outline" : "default"}
                  onClick={() => setCurrentPage(page)}
                  className= {page==currentPage ? "" : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Jobs;
