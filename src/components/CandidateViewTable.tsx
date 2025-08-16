import { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FilterColumnsModal } from "@/components/modals/FilterCoulmnModal";
import AddCandidateModal from "@/components/modals/AddCandidateModal";
import {
  Search,
  Filter,
  Building2,
  GraduationCap,
  Star,
  Plus,
  Check,
  X,
  ChevronUp,
  FileText,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import CandidateProfileModal from "@/components/modals/CandidateProfileModal";
import { BulkUpdateFieldsModal } from "@/components/modals/BulkUpdateFieldsModal";
import AssignToJobModal from "@/components/modals/AssigntoJobModal";
import {
  ALL_COLUMNS,
  TABS,
  getStatusColor,
  getRecruiterStatusColor,
} from "@/lib/candidate-config";
import { CandidateActionsPopover } from "./CandidateActionsPopover";

const API_BASE_URL = "http://13.51.235.31:3000";
const FILE_SERVER_URL = "http://13.51.235.31";

const CANDIDATE_STATUSES = [
  "Sourced",
  "Application",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
  "Rejected",
];

const RECRUITER_STATUSES = [
  "New Application",
  "Initial Review",
  "Screening Complete",
  "Recommended",
  "Not Suitable",
];

const noticePeriodOptions = ["15 days", "30 days", "60 days", "90 days"];

interface JobAssignment {
  job_id: number;
  status: string;
  job_title: string;
  hmapproval: string;
  recruiter_status: string;
}

interface CandidateForm {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  headline: string | null;
  address: string;
  experience: string;
  photo_url: string | null;
  education: string;
  summary: string | null;
  resume_url: string;
  cover_letter: string | null;
  rating: string | null;
  current_company: string | null;
  current_ctc: string | null;
  expected_ctc: string | null;
  skill: string[];
  created_at: string;
  updated_at: string;
  linkedinprofile: string;
  notice_period: string;
  institutiontier: string;
  companytier: string;
  jobs_assigned: JobAssignment[];
}

interface ParsedEducation {
  institution: string;
  degree: string;
}

interface CandidateViewListProps {
  loading: boolean;
  jobId: number;
  candidates: CandidateForm[];
  fetchCandidates: () => void;
}

const formatCandidateAddress = (address: string): string => {
  if (!address || !address.trim()) return "NA";
  try {
    const parsed = JSON.parse(address);
    if (Array.isArray(parsed)) {
      const latestAddress = [...parsed]
        .reverse()
        .find(
          (addr) => addr && Object.values(addr).some((val) => val && val !== "")
        );
      if (!latestAddress) return "NA";
      const fields = [
        latestAddress.firstline,
        latestAddress.city,
        latestAddress.district,
        latestAddress.state,
        latestAddress.pincode,
        latestAddress.country,
      ];
      const cleaned = fields
        .map((val) => (val ?? "").trim())
        .filter((val) => val);
      return cleaned.length ? cleaned.join(", ") : "NA";
    }
    return "NA";
  } catch {
    return address.trim() || "NA";
  }
};

const EditableCell = ({
  value,
  onSave,
}: {
  value: string | null;
  onSave: (newValue: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (currentValue !== value) {
      onSave(currentValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setCurrentValue(value || "");
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="h-8 text-sm pr-16"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={handleSave}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setIsEditing(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1 text-sm text-slate-700 cursor-pointer hover:bg-slate-100 p-1 rounded min-h-[32px]"
      onClick={() => setIsEditing(true)}
    >
      {value || "N/A"}
    </span>
  );
};

export default function CandidateViewList({
  loading,
  jobId,
  candidates,
  fetchCandidates,
}: CandidateViewListProps) {
  const [localCandidates, setLocalCandidates] = useState<CandidateForm[]>([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [expandedCandidates, setExpandedCandidates] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    setLocalCandidates(candidates);
  }, [candidates]);

  const toggleCandidateJobs = (candidateId: number) => {
    setExpandedCandidates((prev) => {
      const next = new Set(prev);
      if (next.has(candidateId)) {
        next.delete(candidateId);
      } else {
        next.add(candidateId);
      }
      return next;
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const itemsPerPage = 20;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    ALL_COLUMNS.map((c) => c.key)
  );
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateForm | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const lowerTerm = searchQuery.toLowerCase().trim();
  const safe = (s?: string | null) => s?.toLowerCase() ?? "";

  const filtered = useMemo(
    () =>
      localCandidates.filter((c) => {
        if (!lowerTerm) return true;
        if (activeTab === "all") {
          const fullName = `${c.first_name ?? ""} ${c.last_name ?? ""}`;
          return (
            fullName.toLowerCase().includes(lowerTerm) ||
            (c.skill ?? []).join(" ").toLowerCase().includes(lowerTerm) ||
            safe(c.current_company).includes(lowerTerm) ||
            safe(c.email).includes(lowerTerm)
          );
        }
        return safe(c[activeTab as keyof CandidateForm]?.toString()).includes(
          lowerTerm
        );
      }),
    [localCandidates, lowerTerm, activeTab]
  );

  const filteredIds = useMemo(() => filtered.map((c) => c.id), [filtered]);
  const allSelectedInFilter = useMemo(
    () => filteredIds.length > 0 && filteredIds.every((id) => selected.has(id)),
    [filteredIds, selected]
  );

  const toggleAll = () => {
    if (allSelectedInFilter) {
      const next = new Set(selected);
      filteredIds.forEach((id) => next.delete(id));
      setSelected(next);
    } else {
      setSelected((prev) => new Set([...prev, ...filteredIds]));
    }
  };

  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleColumn = (key: string, show: boolean) => {
    setVisibleColumns((prev) =>
      show ? [...prev, key] : prev.filter((c) => c !== key)
    );
  };

  const handleDelete = async () => {
    if (!selected.size) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selected.size} candidate(s)?`
    );
    if (!confirmed) return;

    const originalCandidates = [...localCandidates];
    const originalSelected = new Set(selected);

    setLocalCandidates((prev) =>
      prev.filter((c) => !originalSelected.has(c.id))
    );
    setSelected(new Set());

    try {
      await axios.post(`${API_BASE_URL}/candidate/bulk-delete`, {
        data: { ids: [...originalSelected] },
      });
      toast.success(`${originalSelected.size} candidate(s) deleted.`);
    } catch (err) {
      console.error("Failed to delete candidates", err);
      toast.error("Could not delete. Reverting changes.");
      setLocalCandidates(originalCandidates);
      setSelected(originalSelected);
    }
  };

  const handleEdit = () => {
    if (!selected.size) {
      toast.error("Select at least one candidate first");
      return;
    }
    setIsBulkModalOpen(true);
  };

  const handleFieldUpdate = async (
    id: number,
    field: keyof CandidateForm,
    value: any
  ) => {
    const originalCandidates = [...localCandidates];

    setLocalCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );

    try {
      await axios.put(`${API_BASE_URL}/candidate/${id}`, { [field]: value });
      toast.success(`Candidate's ${field.replace(/_/g, " ")} updated.`);
    } catch (err) {
      console.error(`Failed to update ${field}`, err);
      toast.error(`Could not update ${field}. Reverting change.`);
      setLocalCandidates(originalCandidates);
    }
  };

  const handleJobAssignmentUpdate = async (
    candidateId: number,
    jobId: number,
    field: "status" | "recruiter_status" | "hmapproval",
    value: string
  ) => {
    const originalCandidates = JSON.parse(JSON.stringify(localCandidates));

    setLocalCandidates((prev) =>
      prev.map((candidate) => {
        if (candidate.id === candidateId) {
          const updatedJobs = (candidate.jobs_assigned || []).map((job) =>
            job.job_id === jobId ? { ...job, [field]: value } : job
          );
          return { ...candidate, jobs_assigned: updatedJobs };
        }
        return candidate;
      })
    );

    try {
      await axios.put(`${API_BASE_URL}/candidate/job-assignment/update`, {
        candidateId,
        jobId,
        field,
        value,
      });
      toast.success("Stage updated successfully.");
    } catch (err) {
      toast.error("Failed to update stage. Reverting changes.");
      setLocalCandidates(originalCandidates);
    }
  };

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  return (
    <div className="space-y-4 max-w-[95vw]">
      <Card className="border-0 bg-white/60 shadow-sm backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, skills, company..."
                className="h-9 bg-white/80 pl-10"
              />
            </div>
            <div className="flex gap-2">
              {TABS.map(([label, key]) => (
                <Button
                  key={key}
                  size="sm"
                  variant={activeTab === key ? "secondary" : "outline"}
                  onClick={() => {
                    setActiveTab(key);
                    setSearchQuery("");
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 bg-white/60 shadow-sm backdrop-blur-sm max-w-[100%]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg text-slate-800">
            <div>Candidates ({filtered.length})</div>
            <div className="flex gap-4">
              <Button onClick={() => setIsFilterOpen(true)} variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filter Columns
              </Button>
              <Button
                onClick={() => setAddModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Candidate
              </Button>
            </div>
          </CardTitle>
          {selected.size > 0 && (
            <div className="flex flex-wrap items-center gap-4 rounded p-2">
              <span>{selected.size} selected</span>
              <Button
                size="sm"
                onClick={() => setSelected(new Set())}
                variant="outline"
              >
                Clear Selection
              </Button>
              <Button
                size="sm"
                onClick={() => setAssignModalOpen(true)}
                variant="outline"
              >
                Add to Job
              </Button>
              <Button size="sm" onClick={handleEdit} variant="outline">
                Update fields
              </Button>
              <Button size="sm" variant="outline">
                Email
              </Button>
              <Button size="sm" variant="outline">
                WhatsApp
              </Button>
              <Button size="sm" onClick={handleDelete} variant="destructive">
                Delete records
              </Button>
            </div>
          )}
        </CardHeader>
        <AssignToJobModal
          open={assignModalOpen}
          onOpenChange={setAssignModalOpen}
          candidateIds={Array.from(selected)}
          onSuccess={fetchCandidates}
        />
        <BulkUpdateFieldsModal
          open={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
          selectedIds={Array.from(selected)}
          onSuccess={fetchCandidates}
        />
        <FilterColumnsModal
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          columns={ALL_COLUMNS.filter((c) => c.key !== "name")}
          visibleColumns={visibleColumns}
          onChange={toggleColumn}
        />
        <CardContent className="p-0">
          <div className="max-h-[600px] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-gray-50 backdrop-blur-sm z-10">
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allSelectedInFilter}
                      onCheckedChange={toggleAll}
                      aria-label="Select all in current view"
                      className="border-0 bg-gray-200 outline-none"
                    />
                  </TableHead>
                  {ALL_COLUMNS.map((col) =>
                    visibleColumns.includes(col.key) ? (
                      <TableHead
                        className="whitespace-nowrap text-black"
                        key={col.key}
                      >
                        {col.label.toUpperCase()}
                      </TableHead>
                    ) : null
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={visibleColumns.length + 1}
                      className="text-center"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={visibleColumns.length + 1}
                      className="text-center"
                    >
                      No candidates found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((candidate) => {
                    let parsedEdu: ParsedEducation | null = null;
                    try {
                      const eduData = JSON.parse(candidate.education);
                      if (Array.isArray(eduData) && eduData.length > 0)
                        parsedEdu = eduData[0];
                    } catch {}

                    const isExpanded = expandedCandidates.has(candidate.id);

                    return (
                      <TableRow
                        key={candidate.id}
                        className="hover:bg-slate-50/50 align-top"
                      >
                        <TableCell className="w-12">
                          <Checkbox
                            checked={selected.has(candidate.id)}
                            onCheckedChange={() => toggleOne(candidate.id)}
                            aria-label={`Select ${candidate.first_name}`}
                            className="border-0 bg-gray-200 outline-none"
                          />
                        </TableCell>
                        {visibleColumns.includes("name") && (
                          <TableCell className="min-w-[200px] py-2">
                            <CandidateActionsPopover
                              candidate={candidate}
                              fetchCandidates={fetchCandidates}
                            >
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                                    {candidate.first_name?.toUpperCase()[0]}
                                    {candidate.last_name?.toUpperCase()[0]}
                                  </AvatarFallback>
                                </Avatar>

                                <button
                                  onClick={() => {
                                    setSelectedCandidate(candidate);
                                    setProfileModalOpen(true);
                                  }}
                                  className="whitespace-nowrap text-sm font-medium text-slate-600 focus:outline-none hover:underline"
                                >
                                  {candidate.first_name} {candidate.last_name}
                                </button>
                                {candidate.resume_url && (
                                  <a
                                    href={`${FILE_SERVER_URL}/ats-api/uploads/${candidate.resume_url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-blue-600 transition-colors"
                                    title="View Resume in new tab"
                                  >
                                    <FileText className="h-4 w-4" />
                                  </a>
                                )}
                              </div>
                            </CandidateActionsPopover>
                          </TableCell>
                        )}

                        {visibleColumns.includes("job_and_stage") && (
                          <TableCell className="min-w-[400px] py-3">
                            {(candidate.jobs_assigned || []).length > 0 ? (
                              <div>
                                {(isExpanded
                                  ? candidate.jobs_assigned
                                  : (candidate.jobs_assigned || []).slice(0, 1)
                                ).map((job, index) => (
                                  <div
                                    key={job.job_id}
                                    className="mb-3 last:mb-0"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="min-w-[180px] text-sm font-medium text-gray-700 cursor-pointer">
                                        {job.job_title}
                                      </div>

                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-auto p-2 text-xs min-w-[120px] justify-start"
                                          >
                                            <span
                                              className={`mr-2 w-2 h-2 rounded-full ${getStatusColor(
                                                job.status
                                              )}`}
                                            />
                                            {job.status}
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                          {CANDIDATE_STATUSES.map((s) => (
                                            <DropdownMenuItem
                                              key={s}
                                              onSelect={() =>
                                                handleJobAssignmentUpdate(
                                                  candidate.id,
                                                  job.job_id,
                                                  "status",
                                                  s
                                                )
                                              }
                                            >
                                              {s}
                                            </DropdownMenuItem>
                                          ))}
                                        </DropdownMenuContent>
                                      </DropdownMenu>

                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-auto p-2 text-xs min-w-[150px] justify-start"
                                          >
                                            <span
                                              className={`mr-2 w-2 h-2 rounded-full ${getRecruiterStatusColor(
                                                job.recruiter_status
                                              )}`}
                                            />
                                            {job.recruiter_status}
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                          {RECRUITER_STATUSES.map((s) => (
                                            <DropdownMenuItem
                                              key={s}
                                              onSelect={() =>
                                                handleJobAssignmentUpdate(
                                                  candidate.id,
                                                  job.job_id,
                                                  "recruiter_status",
                                                  s
                                                )
                                              }
                                            >
                                              {s}
                                            </DropdownMenuItem>
                                          ))}
                                        </DropdownMenuContent>
                                      </DropdownMenu>

                                      {index === 0 &&
                                        (candidate.jobs_assigned || []).length >
                                          1 && (
                                          <button
                                            onClick={() =>
                                              toggleCandidateJobs(candidate.id)
                                            }
                                            className="text-sm font-medium text-gray-800 hover:underline whitespace-nowrap"
                                          >
                                            {isExpanded ? (
                                              <ChevronUp
                                                size={20}
                                                color="black"
                                                strokeWidth={1.5}
                                              />
                                            ) : (
                                              `+${
                                                (candidate.jobs_assigned || [])
                                                  .length - 1
                                              }`
                                            )}
                                          </button>
                                        )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-500 text-center">
                                Not Assigned
                              </span>
                            )}
                          </TableCell>
                        )}

                        {visibleColumns.includes("notice_period") && (
                          <TableCell className="min-w-[150px]">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="flex w-full items-center justify-start gap-2 text-xs font-medium py-2 px-3 h-auto rounded-md"
                                >
                                  <span>
                                    {candidate.notice_period || "Select period"}
                                  </span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                {noticePeriodOptions.map((periodOption) => (
                                  <DropdownMenuItem
                                    key={periodOption}
                                    onSelect={() =>
                                      handleFieldUpdate(
                                        candidate.id,
                                        "notice_period",
                                        periodOption
                                      )
                                    }
                                    disabled={
                                      candidate.notice_period === periodOption
                                    }
                                  >
                                    {periodOption}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}

                        {visibleColumns.includes("current_ctc") && (
                          <TableCell className="min-w-[150px] whitespace-nowrap py-2">
                            <EditableCell
                              value={candidate.current_ctc}
                              onSave={(newValue) =>
                                handleFieldUpdate(
                                  candidate.id,
                                  "current_ctc",
                                  newValue
                                )
                              }
                            />
                          </TableCell>
                        )}
                        {visibleColumns.includes("expected_ctc") && (
                          <TableCell className="min-w-[150px] whitespace-nowrap py-2">
                            <EditableCell
                              value={candidate.expected_ctc}
                              onSave={(newValue) =>
                                handleFieldUpdate(
                                  candidate.id,
                                  "expected_ctc",
                                  newValue
                                )
                              }
                            />
                          </TableCell>
                        )}
                        {visibleColumns.includes("headline") && (
                          <TableCell className="min-w-[150px]">
                            {candidate.headline || "N/A"}
                          </TableCell>
                        )}

                        {visibleColumns.includes("phone") && (
                          <TableCell className="min-w-[150px] whitespace-nowrap text-sm text-slate-500">
                            {candidate.phone}
                          </TableCell>
                        )}
                        {visibleColumns.includes("email") && (
                          <TableCell className="min-w-[200px] whitespace-nowrap text-sm text-slate-500">
                            {candidate.email}
                          </TableCell>
                        )}

                        {visibleColumns.includes("current_company") && (
                          <TableCell className="min-w-[150px]">
                            <span className="inline-flex items-center gap-1 whitespace-nowrap text-sm text-slate-500">
                              <Building2 className="h-3 w-3 text-slate-400" />
                              {candidate.current_company || "N/A"}
                            </span>
                          </TableCell>
                        )}

                        {visibleColumns.includes("skill") && (
                          <TableCell className="min-w-[400px] py-2">
                            <div className="flex flex-wrap gap-1">
                              {(candidate.skill || [])
                                .slice(0, 2)
                                .map((skill, idx) => (
                                  <Badge key={idx} variant="secondary">
                                    {skill}
                                  </Badge>
                                ))}
                              {(candidate.skill || []).length > 2 && (
                                <Badge variant="secondary">
                                  +{candidate.skill.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.includes("education") && (
                          <TableCell className="min-w-[200px] whitespace-nowrap py-2">
                            <div>
                              <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-600">
                                <GraduationCap className="h-4 w-4 text-slate-600" />
                                {parsedEdu?.institution || "N/A"}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500">
                              {parsedEdu?.degree || ""}
                            </span>
                          </TableCell>
                        )}
                        {visibleColumns.includes("rating") && (
                          <TableCell>
                            <div className="mt-1 flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-slate-600">
                                {candidate.rating || "N/A"}
                              </span>
                            </div>
                          </TableCell>
                        )}

                        {visibleColumns.includes("address") && (
                          <TableCell className="min-w-[200px] max-w-[250px]">
                            <div
                              className="truncate text-sm text-slate-500"
                              title={formatCandidateAddress(candidate.address)}
                            >
                              {formatCandidateAddress(candidate.address)}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {totalPages > 1 && (
        <CardContent className="flex justify-center space-x-2 py-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => (p > 1 ? p - 1 : 1))}
            className="bg-blue-500"
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              className={
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "text-blue-500 bg-white"
              }
            >
              {page}
            </Button>
          ))}
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => (p < totalPages ? p + 1 : p))}
            className="bg-blue-500"
          >
            Next
          </Button>
        </CardContent>
      )}
      <AddCandidateModal
        open={isAddModalOpen}
        jobId={jobId}
        handleClose={() => setAddModalOpen(false)}
        onSuccess={() => {
          fetchCandidates();
          setAddModalOpen(false);
        }}
      />
      <CandidateProfileModal
        open={isProfileModalOpen}
        onOpenChange={setProfileModalOpen}
        candidate={selectedCandidate}
        fetchCandidates={fetchCandidates}
      />
    </div>
  );
}
