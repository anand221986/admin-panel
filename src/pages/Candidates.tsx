import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Star,
  MapPin,
  Building2,
  DollarSign,
  GraduationCap,
  MessageSquare,
  UserCheck,
  FileText,
  Eye,
  Calendar,
  Download,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddCandidateModal from "@/components/modals/AddCandidateModal";

const candidates = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    position: "Frontend Developer",
    location: "San Francisco, CA",
    status: "Interview",
    rating: 4.5,
    experience: "5+ years",
    skills: ["React", "TypeScript", "CSS", "Node.js"],
    applied: "2 days ago",
    currentCompany: "TechStart Inc.",
    currentCTC: "$95,000",
    expectedCTC: "$120,000",
    college: "Stanford University",
    degree: "MS Computer Science",
    recruiterStatus: "Screening Complete",
    hmApproval: "Pending",
    comments: "Strong frontend skills, good cultural fit",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike.chen@email.com",
    phone: "+1 (555) 987-6543",
    position: "Backend Engineer",
    location: "Seattle, WA",
    status: "Screening",
    rating: 4.2,
    experience: "7+ years",
    skills: ["Node.js", "Python", "AWS", "Docker"],
    applied: "4 days ago",
    currentCompany: "Amazon",
    currentCTC: "$140,000",
    expectedCTC: "$160,000",
    college: "UC Berkeley",
    degree: "BS Computer Science",
    recruiterStatus: "Initial Review",
    hmApproval: "Not Required",
    comments: "Excellent backend experience",
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma.davis@email.com",
    phone: "+1 (555) 456-7890",
    position: "UX Designer",
    location: "New York, NY",
    status: "Hired",
    rating: 4.8,
    experience: "4+ years",
    skills: ["Figma", "Sketch", "User Research", "Prototyping"],
    applied: "1 week ago",
    currentCompany: "Design Studio",
    currentCTC: "$85,000",
    expectedCTC: "$105,000",
    college: "Parsons School of Design",
    degree: "MFA Design",
    recruiterStatus: "Recommended",
    hmApproval: "Approved",
    comments: "Outstanding portfolio, hired!",
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    email: "alex.rodriguez@email.com",
    phone: "+1 (555) 321-0987",
    position: "Product Manager",
    location: "Austin, TX",
    status: "Application",
    rating: 4.0,
    experience: "6+ years",
    skills: ["Product Strategy", "Analytics", "Agile", "SQL"],
    applied: "3 days ago",
    currentCompany: "StartupXYZ",
    currentCTC: "$110,000",
    expectedCTC: "$130,000",
    college: "UT Austin",
    degree: "MBA",
    recruiterStatus: "New Application",
    hmApproval: "Not Required",
    comments: "Strong PM background",
  },
  {
    id: 5,
    name: "Lisa Wang",
    email: "lisa.wang@email.com",
    phone: "+1 (555) 654-3210",
    position: "Data Scientist",
    location: "Boston, MA",
    status: "Rejected",
    rating: 3.8,
    experience: "3+ years",
    skills: ["Python", "Machine Learning", "SQL", "R"],
    applied: "1 week ago",
    currentCompany: "Analytics Corp",
    currentCTC: "$90,000",
    expectedCTC: "$115,000",
    college: "MIT",
    degree: "PhD Data Science",
    recruiterStatus: "Not Suitable",
    hmApproval: "Rejected",
    comments: "Overqualified for current role",
  },
];

// Add more candidates to demonstrate the compact view
const extendedCandidates = [...candidates];
for (let i = 6; i <= 25; i++) {
  extendedCandidates.push({
    ...candidates[i % 5],
    id: i,
    name: `Candidate ${i}`,
    email: `candidate${i}@email.com`,
  });
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Application":
      return "bg-blue-100 text-blue-800";
    case "Screening":
      return "bg-yellow-100 text-yellow-800";
    case "Interview":
      return "bg-purple-100 text-purple-800";
    case "Hired":
      return "bg-green-100 text-green-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getRecruiterStatusColor = (status: string) => {
  switch (status) {
    case "New Application":
      return "bg-blue-100 text-blue-700";
    case "Initial Review":
      return "bg-yellow-100 text-yellow-700";
    case "Screening Complete":
      return "bg-purple-100 text-purple-700";
    case "Recommended":
      return "bg-green-100 text-green-700";
    case "Not Suitable":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getHMApprovalColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Approved":
      return "bg-green-100 text-green-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    case "Not Required":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const Candidates = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Candidates Pipeline
            </h1>
            <p className="text-slate-600 text-sm">
              Manage candidate workflow and approvals
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white/80">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Candidate
            </Button>
          </div>
        </div>

        <AddCandidateModal
          open={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
        />

        {/* Search and Quick Actions */}
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search candidates by name, skills, company..."
                  className="pl-10 bg-white/80 h-9"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-white/80">
                  Status
                </Button>
                <Button variant="outline" size="sm" className="bg-white/80">
                  Skills
                </Button>
                <Button variant="outline" size="sm" className="bg-white/80">
                  CTC Range
                </Button>
                <Button variant="outline" size="sm" className="bg-white/80">
                  Recruiter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compact Candidates Table */}
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-800">
              Candidate Database ({extendedCandidates.length} candidates)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white/90 backdrop-blur-sm">
                  <TableRow>
                    <TableHead className="w-[200px]">Candidate</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[150px]">Current Company</TableHead>
                    <TableHead className="w-[100px]">Current CTC</TableHead>
                    <TableHead className="w-[200px]">Skills</TableHead>
                    <TableHead className="w-[150px]">Education</TableHead>
                    <TableHead className="w-[120px]">
                      Recruiter Status
                    </TableHead>
                    <TableHead className="w-[120px]">HM Approval</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {extendedCandidates.map((candidate) => (
                    <TableRow
                      key={candidate.id}
                      className="hover:bg-slate-50/50"
                    >
                      <TableCell className="py-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                              {candidate.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm text-slate-800">
                              {candidate.name}
                            </div>
                            <div className="text-xs text-slate-600">
                              {candidate.position}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <MapPin className="w-3 h-3" />
                              {candidate.location}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-2">
                        <Badge
                          className={`${getStatusColor(
                            candidate.status
                          )} text-xs`}
                        >
                          {candidate.status}
                        </Badge>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-slate-600">
                            {candidate.rating}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-2">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span className="text-sm text-slate-700">
                            {candidate.currentCompany}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {candidate.experience}
                        </div>
                      </TableCell>

                      <TableCell className="py-2">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-green-600" />
                          <span className="text-sm font-medium text-slate-700">
                            {candidate.currentCTC}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          Exp: {candidate.expectedCTC}
                        </div>
                      </TableCell>

                      <TableCell className="py-2">
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 2).map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-slate-100 text-slate-700 text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 2 && (
                            <Badge
                              variant="secondary"
                              className="bg-slate-100 text-slate-700 text-xs"
                            >
                              +{candidate.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="py-2">
                        <div className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-slate-400" />
                          <div>
                            <div className="text-sm text-slate-700">
                              {candidate.college}
                            </div>
                            <div className="text-xs text-slate-500">
                              {candidate.degree}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-2">
                        <Badge
                          className={`${getRecruiterStatusColor(
                            candidate.recruiterStatus
                          )} text-xs`}
                        >
                          {candidate.recruiterStatus}
                        </Badge>
                      </TableCell>

                      <TableCell className="py-2">
                        <Badge
                          className={`${getHMApprovalColor(
                            candidate.hmApproval
                          )} text-xs`}
                        >
                          {candidate.hmApproval}
                        </Badge>
                      </TableCell>

                      <TableCell className="py-2">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                          >
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                          >
                            <Calendar className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Agency Workflow Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">
                    Pending Recruiter Review
                  </p>
                  <p className="text-2xl font-bold text-blue-600">8</p>
                </div>
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Awaiting HM Approval</p>
                  <p className="text-2xl font-bold text-yellow-600">5</p>
                </div>
                <FileText className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Ready for Interview</p>
                  <p className="text-2xl font-bold text-green-600">12</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Candidates;
