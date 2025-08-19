import Layout from "@/components/Layout";
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, FileText, Calendar, Download } from "lucide-react";
import axios from "axios";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import CandidateViewList from "@/components/CandidateViewTable";
const API_BASE_URL = "http://16.171.117.2:3000";

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
  status: string;
  address: string;
  experience: string;
  photo_url: string | null;
  education: string;
  summary: string | null;
  resume_url: string;
  cover_letter: string | null;
  rating: string | null;
  hmapproval: string;
  recruiter_status: string;
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

export default function Candidates() {
  const [candidates, setCandidates] = useState<CandidateForm[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/candidate/getAllCandidates`
      );
      setCandidates(data.result || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch candidates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const summaryCounts = useMemo(() => {
    let pendingRecruiter = 0;
    let pendingHM = 0;

    candidates.forEach((candidate) => {
      (candidate.jobs_assigned || []).forEach((job) => {
        if (job.recruiter_status === "New Application") {
          pendingRecruiter++;
        }
        if (job.hmapproval === "Pending") {
          pendingHM++;
        }
      });
    });

    const readyForInterview = candidates.filter(
      (c) => c.status === "Interview"
    ).length;

    return { pendingRecruiter, pendingHM, readyForInterview };
  }, [candidates]);

  const handleExport = () => {
    if (!candidates.length) {
      toast.warning("No candidates to export.");
      return;
    }

    const header = [
      "Name",
      "Assigned Jobs",
      "Email",
      "Phone",
      "LinkedIn",
      "Overall Status",
      "Current Company",
      "Location",
      "Skills",
    ];

    const rows = candidates.map((c) => [
      `${c.first_name} ${c.last_name}`,
      (c.jobs_assigned || []).map((job) => job.job_title).join("; "),
      c.email,
      c.phone,
      c.linkedinprofile,
      c.status,
      c.current_company || "N/A",
      formatCandidateAddress(c.address),
      c.skill?.join(";") || "N/A",
    ]);

    const csvContent = [header, ...rows]
      .map((r) =>
        r.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const today = new Date()
      .toLocaleDateString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");
    saveAs(blob, `candidates-${today}.csv`);

    toast.success("Exported CSV file successfully!");
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Candidates Pipeline
            </h1>
            <p className="text-sm text-slate-600">
              Manage candidate workflow and approvals
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExport}
              variant="outline"
              className="bg-white/80"
              disabled={loading}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <CandidateViewList
          loading={loading}
          jobId={null}
          candidates={candidates}
          fetchCandidates={fetchCandidates}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-0 bg-white/60 shadow-sm backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">
                    Pending Recruiter Review
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {summaryCounts.pendingRecruiter}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white/60 shadow-sm backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Awaiting HM Approval</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {summaryCounts.pendingHM}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white/60 shadow-sm backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Ready for Interview</p>
                  <p className="text-2xl font-bold text-green-600">
                    {summaryCounts.readyForInterview}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
