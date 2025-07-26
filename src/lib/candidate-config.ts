export interface ColumnConfig {
  key: string;
  label: string;
}

export const ALL_COLUMNS: ColumnConfig[] = [
  { key: "name", label: "Name" },
  { key: "job_id", label: "Job ID" },
  { key: "status", label: "Candidate Status" },
  { key: "recruiter_status", label: "Recruiter Status" },
  { key: "hmapproval", label: "HM Approval" },
  { key: "headline", label: "Headline" },
  { key: "phone", label: "Phone Number" },
  { key: "email", label: "Email Address" },
  { key: "current_company", label: "Current Company" },
  { key: "current_ctc", label: "Current CTC" },
  { key: "expected_ctc", label: "Expected CTC" },
  { key: "skill", label: "Skills" },
  { key: "education", label: "Education" },
  { key: "rating", label: "Rating" },
  { key: "address", label: "Address"},
];

export const TABS = [
  ["All", "all"] as const,
  ["Status", "status"] as const,
  ["Recruiter", "recruiter"] as const,
  ["HM Approval", "hm"] as const,
  ["Date Added", "updated_at"] as const,
  ["Address", "address"] as const
];

type StatusColorMap = Record<string, string>;

function getBadgeClasses(map: StatusColorMap, defaultClass: string) {
  return (key: string) => map[key] || defaultClass;
}

const statusMap: StatusColorMap = {
  Application: "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900",
  Screening: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900",
  Interview: "bg-purple-100 text-purple-800 hover:bg-purple-200 hover:text-purple-900",
  Hired: "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900",
  Rejected: "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900",
};

const recruiterStatusMap: StatusColorMap = {
  "New Application": "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800",
  "Initial Review": "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 hover:text-yellow-800",
  "Screening Complete": "bg-purple-100 text-purple-700 hover:bg-purple-200 hover:text-purple-800",
  Recommended: "bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800",
  "Not Suitable": "bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800",
};

const hmApprovalMap: StatusColorMap = {
  Pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900",
  Approved: "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900",
  Rejected: "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900",
  "Not Required": "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700",
};

export const getStatusColor = getBadgeClasses(statusMap, "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900");
export const getRecruiterStatusColor = getBadgeClasses(recruiterStatusMap, "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800");
export const getHMApprovalColor = getBadgeClasses(hmApprovalMap, "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700");
