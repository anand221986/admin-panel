import Layout from "@/components/Layout";
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddCandidateModal from "@/components/modals/AddUserModal";
import { Plus, UserCheck, FileText, Calendar, Download } from "lucide-react";
import axios from "axios";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import CandidateViewList from "@/components/UserViewTable";

const API_BASE_URL = "http://16.171.117.2:3000";

interface ParsedAddress {
  firstline: string;
  city: string | null;
  pincode: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
}

interface CandidateForm {
  id: number;
  job_id: number;
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
  college: string | null;
  degree: string | null;
  created_at: string;
  updated_at: string;
  linkedinprofile: string;
  institutiontier: string;
  companytier: string;
  role: string;
  created_dt: string;
}

const parseAddress = (addressString: string): ParsedAddress => {
  if (!addressString) {
    return {
      firstline: "",
      city: null,
      district: null,
      state: null,
      pincode: null,
      country: null,
    };
  }
  const parts = addressString.split(",").map((part) => part.trim());
  return {
    firstline: parts[0] || "",
    city: parts[1] || null,
    district: parts[2] || null,
    state: parts[3] || null,
    pincode: parts[4] || null,
    country: parts[5] || null,
  };
};

const getParsedAddress = (address: string | ParsedAddress): ParsedAddress => {
  if (typeof address === "string") {
    return parseAddress(address);
  }
  if (address) {
    return address;
  }
  return {
    firstline: "",
    city: null,
    district: null,
    state: null,
    pincode: null,
    country: null,
  };
};

export default function Users() {
  const [candidates, setCandidates] = useState<CandidateForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/user/getAllUsers`
      );
      setCandidates(data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!candidates.length) {
      alert("No User to export.");
      return;
    }

    const header = [
      "Name",
      "Email",
      "Phone",
      "Status",
      "Role",
      "Created At",
      "Updated At",
    ];

    const rows = candidates.map((c) => {
      const parsedAddr = getParsedAddress(c.address);
      const location = [
        parsedAddr.firstline,
        parsedAddr.city,
        parsedAddr.state,
        parsedAddr.country,
        parsedAddr.pincode,
      ]
        .filter(Boolean)
        .join(", ");

      return [
        `${c.first_name} ${c.last_name}`,
        c.email,
        c.phone,
        c.status,
        c.role,
        c.created_dt
      ];
    });

    const csvContent = [header, ...rows]
      .map((r) => r.map((field) => `"${field ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const dateStr = new Date().toISOString().split('T')[0]; // "2025-07-29"
    const fileName = `user_${dateStr}.csv`;
    saveAs(blob, fileName);
    toast.success("Exported CSV file successfully!");
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Ats Users</h1>
            <p className="text-slate-600 text-sm">
              Manage Users Access and approvals
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExport}
              variant="outline"
              className="bg-white/80"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Users
            </Button>
          </div>
        </div>

        <AddCandidateModal
          open={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
        />

        <CandidateViewList
          loading={loading}
          candidates={candidates}
          fetchCandidates={fetchCandidates}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">
                    Pending Recruiter Review
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {
                      candidates.filter(
                        (c) => c.recruiter_status === "New Application"
                      ).length
                    }
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card> */}
          {/* 
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Awaiting HM Approval</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {
                      candidates.filter((c) => c.hmapproval === "Pending")
                        .length
                    }
                  </p>
                </div>
                <FileText className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card> */}

          {/* <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Ready for Interview</p>
                  <p className="text-2xl font-bold text-green-600">
                    {candidates.filter((c) => c.status === "Interview").length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </Layout>
  );
}