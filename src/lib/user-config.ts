export interface ColumnConfig {
  key: string;
  label: string;
}

export const ALL_COLUMNS: ColumnConfig[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "status", label: "Status" },
  { key: "role", label: "Role" },
  { key: "created_at", label: "Created At" },
  { key: "actions", label: "Actions" },
];

export const TABS = [
  ["All", "all"] as const,
  ["Status", "status"] as const,
  ["Date Added", "updated_at"] as const,
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
export const ALL_PAGES_COLUMNS: ColumnConfig[] = [
  { key: "name", label: "Page Title" },
  { key: "email", label: "Slug / URL" },
  { key: "phone", label: "Meta Title" },
  { key: "status", label: "Status" },
  { key: "role", label: "Created At" },
  { key: "created_at", label: "Updated At" },
  { key: "actions", label: "Actions" },
];

export const getStatusColor = getBadgeClasses(statusMap, "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900");
export const getRecruiterStatusColor = getBadgeClasses(recruiterStatusMap, "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800");
export const getHMApprovalColor = getBadgeClasses(hmApprovalMap, "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700");
