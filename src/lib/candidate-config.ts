export interface ColumnConfig {
  key: string;
  label: string;
}

export const ALL_COLUMNS: ColumnConfig[] = [
  { key: "name", label: "Name" },
  { key: "job_and_stage", label: "Job - Candidate Stage - Recruiter Stage" },
  { key: "notice_period", label: "Notice Period"},
  { key: "current_ctc", label: "Current CTC" },
  { key: "expected_ctc", label: "Expected CTC" },
  { key: "headline", label: "Headline" },
  { key: "phone", label: "Phone Number" },
  { key: "email", label: "Email Address" },
  { key: "current_company", label: "Current Company" },
  { key: "skill", label: "Skills" },
  { key: "education", label: "Education" },
  { key: "rating", label: "Rating" },
  { key: "address", label: "Address"},
];

export const TABS = [
  ["All", "all"] as const,
  ["Date Added", "updated_at"] as const,
  ["Address", "address"] as const
];

type StatusColorMap = Record<string, string>;

function getBadgeClasses(map: StatusColorMap, defaultClass: string) {
  return (key: string) => map[key] || defaultClass;
}

const statusMap: StatusColorMap = {
  Application: "bg-blue-400 text-blue-800 hover:bg-blue-500 hover:text-blue-900",
  Screening: "bg-yellow-400 text-yellow-800 hover:bg-yellow-500 hover:text-yellow-900",
  Interview: "bg-purple-400 text-purple-800 hover:bg-purple-500 hover:text-purple-900",
  Hired: "bg-green-400 text-green-800 hover:bg-green-500 hover:text-green-900",
  Rejected: "bg-red-400 text-red-800 hover:bg-red-500 hover:text-red-900",
};

const recruiterStatusMap: StatusColorMap = {
  "New Application": "bg-blue-400 text-blue-700 hover:bg-blue-500 hover:text-blue-800",
  "Initial Review": "bg-yellow-400 text-yellow-700 hover:bg-yellow-500 hover:text-yellow-800",
  "Screening Complete": "bg-purple-400 text-purple-700 hover:bg-purple-500 hover:text-purple-800",
  Recommended: "bg-green-400 text-green-700 hover:bg-green-500 hover:text-green-800",
  "Not Suitable": "bg-red-400 text-red-700 hover:bg-red-500 hover:text-red-800",
};

const hmApprovalMap: StatusColorMap = {
  Pending: "bg-yellow-400 text-yellow-800 hover:bg-yellow-500 hover:text-yellow-900",
  Approved: "bg-green-400 text-green-800 hover:bg-green-500 hover:text-green-900",
  Rejected: "bg-red-400 text-red-800 hover:bg-red-500 hover:text-red-900",
  "Not Required": "bg-gray-400 text-gray-600 hover:bg-gray-500 hover:text-gray-700",
};

export const getStatusColor = getBadgeClasses(statusMap, "bg-gray-700 text-gray-800 hover:bg-gray-800 hover:text-gray-900");
export const getRecruiterStatusColor = getBadgeClasses(recruiterStatusMap, "bg-gray-700 text-gray-700 hover:bg-gray-800 hover:text-gray-800");
export const getHMApprovalColor = getBadgeClasses(hmApprovalMap, "bg-gray-700 text-gray-600 hover:bg-gray-800 hover:text-gray-700");
