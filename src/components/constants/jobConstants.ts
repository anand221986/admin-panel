// jobConstants.ts

export interface JobsForm {
  job_title: string;
  job_code?: string;
  department?: string;
  workplace: string;
  office_primary_location: string;
  office_on_careers_page?: boolean;
  office_location_additional?: string[];
  description_about: string;
  description_requirements?: string;
  description_benefits?: string;
  company_industry: string;
  company_job_function: string;
  employment_type: string;
  experience: string;
  experienceFrom: number;
  experienceTo: number;
  education: string;
  keywords?: string[];
  salary_from?: number;
  salary_to?: number;
  salary_currency?: string;
  status?: string;
  priority?: string;
  company?: string;
  about_company?: string;
  notice_period: string;
}

// Currency options to show in dropdowns or validation
export const currencyOptions = [
  "INR",
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
] as const;

export type Currency = typeof currencyOptions[number]; // gives union: "INR" | "USD" | ...

// Template headers used for CSV, table columns, etc.
export const TEMPLATE_HEADERS: (keyof JobsForm)[] = [
  "job_title",
  "job_code",
  "department",
  "workplace",
  "office_primary_location",
  "office_on_careers_page",
  "office_location_additional",
  "description_about",
  "description_requirements",
  "description_benefits",
  "company_industry",
  "company_job_function",
  "employment_type",
  "experience",
  "experienceFrom",
  "experienceTo",
  "education",
  "keywords",
  "salary_from",
  "salary_to",
  "salary_currency",
  "status",
  "priority",
  "company",
  "about_company",
  "notice_period",
];

export const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Temporary",
];

export const educationLevels = [
  "High School",
  "Associate",
  "Bachelor",
  "Master",
  "Doctorate",
];

export  const initialForm = {
  jobTitle: "",
  jobCode: "",
  department: "",
  workplace: "On-site",
  officeLocation: { primary: "", onCareersPage: true },
  description: { about: "", requirements: "", benefits: "" },
  companyDetails: { industry: "", jobFunction: "" },
  employmentDetails: {
    employmentType: "",
    experience: "",
    experienceTo: "",
    experienceFrom: "",
    education: "",
    keywords: [] as string[],
  },
  salary: { from: 0, to: 0, currency: "INR" },
  company: "",
  about_company: "",
  notice_period: "",
};


export const industries = [
  "IT Services",
  "Information Technology",
  "Software Development",
  "Healthcare",
  "Pharmaceuticals",
  "Biotechnology",
  "Finance",
  "Banking",
  "Insurance",
  "Retail",
  "E-commerce",
  "Telecommunications",
  "Manufacturing",
  "Automotive",
  "Aerospace",
  "Construction",
  "Real Estate",
  "Education",
  "Government",
  "Defense",
  "Media",
  "Entertainment",
  "Hospitality",
  "Travel & Tourism",
  "Logistics & Supply Chain",
  "Transportation",
  "Energy",
  "Utilities",
  "Mining",
  "Agriculture",
  "Food & Beverage",
  "Legal Services",
  "Non-Profit",
  "Consulting",
  "Marketing & Advertising",
  "Consumer Goods",
  "Cybersecurity",
  "Electronics",
  "Public Sector",
  "Textile",
  "Publishing",
  "Human Resources",
  "Research & Development",
  "Environmental Services",
  "Sports & Recreation",
  "Biotechnology",
  "Chemicals",
  "Civil Engineering",
  "Computer Hardware",
  "Consumer Electronics",
  "Cosmetics",
  "Dairy",
  "Design",
  "Electric Vehicles",
  "Fashion",
  "Food Production",
  "Gaming",
  "Graphic Design",
  "Hardware Engineering",
  "Home Furnishings",
  "Industrial Automation",
  "Information Services",
  "Internet",
  "Journalism",
  "Leisure, Travel & Tourism",
  "Machine Learning",
  "Management Consulting",
  "Mechanical Engineering",
  "Medical Devices",
  "Military",
  "Music",
  "Nanotechnology",
  "Oil & Gas",
  "Packaging",
  "Plastics",
  "Political Organization",
  "Printing",
  "Public Relations",
  "Railroad Manufacture",
  "Renewables & Environment",
  "Semiconductors",
  "Space",
  "Venture Capital & Private Equity",
];


export const jobFunctions = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Software Engineer",
  "QA Engineer",
  "Test Automation Engineer",
  "Mobile App Developer",
  "iOS Developer",
  "Android Developer",
  "Web Developer",
  "UI/UX Designer",
  "Product Manager",
  "Scrum Master",
  "Tech Lead",
  "Solution Architect",
  "Cloud Engineer",
  "Database Administrator",
  "Data Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "Game Developer",
  "Embedded Software Engineer",
  "Security Engineer",
  "Site Reliability Engineer",
  "Blockchain Developer",
  "AR/VR Developer",
  "System Analyst",
  "Software Support Engineer",
];

export const API_BASE_URL = "http://16.171.117.2:3000";