import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FilterColumnsModal } from "@/components/modals/FilterCoulmnModal";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Building2,
  DollarSign,
  GraduationCap,
  Star,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  getHMApprovalColor,
} from "@/lib/candidate-config";
import { CandidateActionsPopover } from "./CandidateActionsPopover";

const API_BASE_URL = "http://51.20.181.155:3000";

interface CandidateForm {
  id: number;
  job_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  linkedin: string;
  headline: string;
  status: string;
  address: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  experience: string;
  photo_url: string;
  education: string;
  summary: string;
  resume_url: string;
  cover_letter: string;
  rating: string;
  hmapproval: string;
  recruiter_status: string;
  current_company: string;
  current_ctc: string;
  expected_ctc: string;
  currency: string;
  skill: string[];
  college: string;
  degree: string;
}

interface CandidateViewListProps {
  loading: boolean;
  candidates: CandidateForm[];
  fetchCandidates: () => void;
}

export default function CandidateViewList({
  loading,
  candidates,
  fetchCandidates,
}: CandidateViewListProps) {
  const [localCandidates, setLocalCandidates] = useState<CandidateForm[]>([]);

  useEffect(() => {
    setLocalCandidates(candidates);
  }, [candidates]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "status" | "recruiter" | "hm" | "ctc"
  >("all");
  const term = searchQuery.toLowerCase().trim();
  const itemsPerPage = 5;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    ALL_COLUMNS.map((c) => c.key)
  );
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [isOpen, setOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateForm | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const allIds = useMemo(
    () => localCandidates.map((c) => c.id),
    [localCandidates]
  );
  const allSelected = useMemo(
    () => allIds.length > 0 && allIds.every((id) => selected.has(id)),
    [allIds, selected]
  );
  const [assignModalOpen, setAssignModalOpen] = useState(false);

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
    try {
      await axios.post(`${API_BASE_URL}/candidate/bulk-delete`, {
        data: { ids: [...selected] },
      });
      setLocalCandidates((prev) => prev.filter((c) => !selected.has(c.id)));
      setSelected(new Set());
      toast.success("Deleted!");
    } catch (err) {
      console.error("Failed to delete candidates", err);
      toast.error("Could not delete candidates");
    }
  };

  const handleEdit = () => {
    if (!selected.size) {
      toast.error("Select at least one candidate first");
      return;
    }
    setIsBulkModalOpen(true);
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    console.log("handleStatusChange triggered", { id, newStatus });
    try {
      console.log(`Updating status for candidate ${id} to ${newStatus}`);
      const res = await axios.put(`${API_BASE_URL}/candidate/${id}`, {
        status: newStatus,
      });
      console.log("Response:", res);
      setLocalCandidates((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error("Could not update status");
    }
  };

  const handleRecruiterStatusChange = async (
    id: number,
    newRecruiterStatus: string
  ) => {
    try {
      await axios.put(`${API_BASE_URL}/candidate/${id}`, {
        recruiter_status: newRecruiterStatus,
      });
      setLocalCandidates((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, recruiter_status: newRecruiterStatus } : c
        )
      );
    } catch (err) {
      console.error("Failed to update recruiter status", err);
      toast.error("Could not update recruiter status");
    }
  };

  const handleHMApprovalChange = async (id: number, newHMApproval: string) => {
    try {
      await axios.put(`${API_BASE_URL}/candidate/${id}`, {
        hmapproval: newHMApproval,
      });
      setLocalCandidates((prev) =>
        prev.map((c) => (c.id === id ? { ...c, hmapproval: newHMApproval } : c))
      );
    } catch (err) {
      console.error("Failed to update HM approval", err);
      toast.error("Could not update HM approval");
    }
  };

  // Filtering and pagination
  const filtered = localCandidates.filter((c) => {
    if (!term) return true;
    switch (activeTab) {
      case "status":
        return c.status.toLowerCase().includes(term);
      case "recruiter":
        return c.recruiter_status.toLowerCase().includes(term);
      case "hm":
        return c.hmapproval.toLowerCase().includes(term);
      case "ctc": {
        const val = parseFloat(c.current_ctc);
        if (term.includes("-")) {
          const [min, max] = term.split("-").map(Number);
          return !isNaN(min) && !isNaN(max) && val >= min && val <= max;
        }
        return c.current_ctc.toLowerCase().includes(term);
      }
      case "all":
      default:
        const name = `${c.first_name} ${c.last_name}`.toLowerCase();
        return (
          name.includes(term) ||
          c.skill.join(" ").toLowerCase().includes(term) ||
          c.current_company.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          c.phone.toLowerCase().includes(term) ||
          c.rating.includes(term)
        );
    }
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === "all"
                    ? "Search any field…"
                    : `Search by ${
                        activeTab === "status"
                          ? "Status"
                          : activeTab === "recruiter"
                          ? "Recruiter Status"
                          : activeTab === "hm"
                          ? "HM Approval"
                          : "CTC Range (e.g. 3-7)"
                      }…`
                }
                className="pl-10 bg-white/80 h-9"
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
      <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-slate-800 flex items-center justify-between">
            <div>
              Candidates ({filtered.length}) • Page {currentPage} of{" "}
              {totalPages}
            </div>
            <Button
              className="text-sm font-medium"
              onClick={() => setIsFilterOpen(true)}
              variant="outline"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter Columns
            </Button>
          </CardTitle>
          {/* Action bar when selections exist */}
          {selected.size > 0 && (
            <div className="flex items-center gap-4 p-2 rounded">
              <span>{selected.size} selected</span>
              <Button
                size="sm"
                onClick={() => {
                  setSelected(new Set());
                }}
                variant="outline"
              >
                Clear Selection
              </Button>
              <Button size="sm" variant="outline">
                Email
              </Button>
              <Button size="sm" variant="outline">
                Disqualify
              </Button>
              <Button size="sm" variant="outline">
                Add to Campaign
              </Button>
              <Button size="sm" variant="outline">
                Pitch Candidates
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAssignModalOpen(true)}
              >
                Add to Job
              </Button>
              <Button size="sm" onClick={handleEdit} variant="outline">
                Update fields
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
          onChange={(key, show) => toggleColumn(key, show)}
        />

        <CardContent className="p-0">
          <div className="max-h-[600px] max-w-[95vw] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white/90 backdrop-blur-sm">
                <TableRow>
                  {/* Select-all checkbox */}
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={() => setSelected(new Set(allIds))}
                      aria-label="Select all"
                      className="outline-none border-0 bg-gray-200"
                    />
                  </TableHead>
                  {ALL_COLUMNS.map((col) =>
                    visibleColumns.includes(col.key) ? (
                      <TableHead
                        className="whitespace-nowrap text-black"
                        key={col.key}
                      >
                        {col.label}
                      </TableHead>
                    ) : null
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10}>Loading...</TableCell>
                  </TableRow>
                ) : (
                  paginated.map((candidate) => (
                    <TableRow
                      key={candidate.id}
                      className="hover:bg-slate-50/50"
                    >
                      <TableCell className="w-12">
                        <Checkbox
                          checked={selected.has(candidate.id)}
                          onCheckedChange={() => toggleOne(candidate.id)}
                          aria-label={`Select ${candidate.first_name}`}
                          className="outline-none border-0 bg-gray-200"
                        />
                      </TableCell>
                      {visibleColumns.includes("name") && (
                        <TableCell className="py-2 min-w-[150px]">
                          <CandidateActionsPopover candidateId={candidate.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                                  {[
                                    candidate.first_name[0],
                                    candidate.last_name[0],
                                  ]
                                    .filter(Boolean)
                                    .join("")}
                                  {}
                                </AvatarFallback>
                              </Avatar>
                              <button
                                onClick={() => {
                                  setSelectedCandidate(candidate);
                                  setOpen(true);
                                }}
                                className="font-medium text-sm text-slate-600 whitespace-nowrap focus:outline-none"
                              >
                                {candidate.first_name +
                                  " " +
                                  candidate.last_name}
                              </button>
                            </div>
                          </CandidateActionsPopover>
                          <CandidateProfileModal
                            open={isOpen}
                            onOpenChange={setOpen}
                            candidate={selectedCandidate}
                          />
                        </TableCell>
                      )}

                      {visibleColumns.includes("job_id") && (
                        <TableCell className="min-w-[150px]">
                          <div className="text-sm text-slate-600 flex items-center whitespace-nowrap">
                            {candidate.job_id}
                          </div>
                        </TableCell>
                      )}

                      {visibleColumns.includes("status") && (
                        <TableCell className="px-2 min-w-[170px]">
                          <Select
                            value={candidate.status}
                            onValueChange={(newStatus) =>
                              handleStatusChange(candidate.id, newStatus)
                            }
                          >
                            <SelectTrigger
                              className={cn(
                                "w-full h-8 text-xs",
                                getStatusColor(candidate.status)
                              )}
                            >
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "Application",
                                "Screening",
                                "Interview",
                                "Hired",
                                "Rejected",
                              ].map((opt) => (
                                <SelectItem
                                  key={opt}
                                  value={opt}
                                  className="flex items-center gap-2"
                                >
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      )}

                      {visibleColumns.includes("recruiter_status") && (
                        <TableCell className="px-2 min-w-[170px]">
                          <Select
                            value={candidate.recruiter_status}
                            onValueChange={(newRecruiterStatus) =>
                              handleRecruiterStatusChange(
                                candidate.id,
                                newRecruiterStatus
                              )
                            }
                          >
                            <SelectTrigger
                              className={cn(
                                "w-full h-8 text-xs",
                                getRecruiterStatusColor(
                                  candidate.recruiter_status
                                )
                              )}
                            >
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "New Application",
                                "Initial Review",
                                "Screening Complete",
                                "Recommended",
                                "Not Suitable",
                              ].map((opt) => (
                                <SelectItem
                                  key={opt}
                                  value={opt}
                                  className="flex gap-2 items-center"
                                >
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      )}

                      {visibleColumns.includes("hmapproval") && (
                        <TableCell className="px-2 min-w-[170px]">
                          <Select
                            value={candidate.hmapproval}
                            onValueChange={(newHMApproval) =>
                              handleHMApprovalChange(
                                candidate.id,
                                newHMApproval
                              )
                            }
                          >
                            <SelectTrigger
                              className={cn(
                                "w-full h-8 text-xs",
                                getHMApprovalColor(candidate.hmapproval)
                              )}
                            >
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {["Pending", "Approved", "Rejected"].map(
                                (opt) => (
                                  <SelectItem
                                    key={opt}
                                    value={opt}
                                    className="flex gap-2 items-center"
                                  >
                                    {opt}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      )}

                      {visibleColumns.includes("headline") && (
                        <TableCell className="min-w-[150px]">
                          <div className="text-sm text-slate-600 flex items-center whitespace-nowrap">
                            {candidate.headline}
                          </div>
                        </TableCell>
                      )}

                      {visibleColumns.includes("phone") && (
                        <TableCell className="min-w-[150px]">
                          <div className="text-sm whitespace-nowrap text-slate-500">
                            {candidate.phone}
                          </div>
                        </TableCell>
                      )}

                      {visibleColumns.includes("email") && (
                        <TableCell className="min-w-[150px]">
                          <div className="text-sm whitespace-nowrap text-slate-500">
                            {candidate.email}
                          </div>
                        </TableCell>
                      )}

                      {visibleColumns.includes("current_company") && (
                        <TableCell className="min-w-[150px]">
                          <span className="inline-flex items-center gap-1 text-sm text-slate-500 whitespace-nowrap">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            {candidate.current_company}
                          </span>
                        </TableCell>
                      )}

                      {visibleColumns.includes("current_ctc") && (
                        <TableCell className="py-2 min-w-[150px] whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-sm text-slate-700">
                            <DollarSign className="w-3 h-3 text-green-600" />
                            {candidate.current_ctc}
                          </span>
                        </TableCell>
                      )}

                      {visibleColumns.includes("expected_ctc") && (
                        <TableCell className="py-2 min-w-[150px] whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-sm text-slate-700">
                            <DollarSign className="w-3 h-3 text-green-600" />
                            {candidate.expected_ctc}
                          </span>
                        </TableCell>
                      )}

                      {visibleColumns.includes("skill") && (
                        <TableCell className="py-2 min-w-[150px] whitespace-nowrap">
                          <div className="flex flex-nowrap gap-1 overflow-x-auto">
                            {Array.isArray(candidate.skill) &&
                              candidate.skill.slice(0, 2).map((skill, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="bg-slate-100 text-slate-700 text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}

                            {Array.isArray(candidate.skill) &&
                              candidate.skill.length > 2 && (
                                <Badge
                                  variant="secondary"
                                  className="bg-slate-100 text-slate-700 text-xs"
                                >
                                  +{candidate.skill.length - 2}
                                </Badge>
                              )}
                          </div>
                        </TableCell>
                      )}

                      {visibleColumns.includes("education") && (
                        <TableCell className="py-2 min-w-[150px] whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <span className="inline-flex items-center font-medium gap-1 text-sm text-slate-600">
                              <GraduationCap className="w-4 h-4 text-slate-600" />
                              {candidate.college}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">
                            {candidate.degree}
                          </span>
                        </TableCell>
                      )}

                      {visibleColumns.includes("rating") && (
                        <TableCell>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-slate-600">
                              {candidate.rating}
                            </span>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Pagination */}
      <CardContent className="flex justify-center space-x-2">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm"
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }).map((_, idx) => {
          const page = idx + 1;
          return (
            <Button
              key={page}
              variant={page === currentPage ? "outline" : "default"}
              onClick={() => setCurrentPage(page)}
              className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm"
            >
              {page}
            </Button>
          );
        })}
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm"
        >
          Next
        </Button>
      </CardContent>
    </div>
  );
}
