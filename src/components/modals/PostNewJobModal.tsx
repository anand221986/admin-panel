import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import axios from "axios";
import { Upload, Loader2, Download, FileSpreadsheet } from "lucide-react";
const API_BASE_URL = "http://13.51.235.31:3000";

interface PostNewJobModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}
const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Temporary",
];
const educationLevels = [
  "High School",
  "Associate",
  "Bachelor",
  "Master",
  "Doctorate",
];
const initialForm = {
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
    education: "",
    keywords: [] as string[],
  },
  salary: { from: 0, to: 0, currency: "INR" },
  company: "",
  about_company: "",
  notice_period: "",
};

const industries = [
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

const jobFunctions = [
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

const currencyOptions = ["INR", "USD", "EUR", "GBP", "JPY", "CAD", "AUD"];

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

const TEMPLATE_HEADERS: (keyof JobsForm)[] = [
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

const PostNewJobModal: React.FC<PostNewJobModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState(initialForm);
  const [additionalInput, setAdditionalInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("manual");
  const [pastedJD, setPastedJD] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [industrySuggestions, setIndustrySuggestions] = useState<string[]>([]);
  const [showIndustrySuggestions, setShowIndustrySuggestions] = useState(false);
  const [jobFunctionSuggestions, setJobFunctionSuggestions] = useState<
    string[]
  >([]);
  const [showJobFunctionSuggestions, setShowJobFunctionSuggestions] =
    useState(false);

  const [progress, setProgress] = useState(0);

  const [departments] = useState([
    "Engineering",
    "Human Resources",
    "Marketing",
    "Finance",
    "Sales",
    "Customer Support",
    "Product",
  ]);
  const indianCities = [
    { city: "Mumbai", state: "Maharashtra" },
    { city: "Delhi", state: "Delhi" },
    { city: "Bengaluru", state: "Karnataka" },
    { city: "Hyderabad", state: "Telangana" },
    { city: "Chennai", state: "Tamil Nadu" },
    { city: "Pune", state: "Maharashtra" },
    { city: "Ahmedabad", state: "Gujarat" },
    { city: "Kolkata", state: "West Bengal" },
    { city: "Jaipur", state: "Rajasthan" },
    { city: "Surat", state: "Gujarat" },
  ];
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setFormData(initialForm);
      setAdditionalInput("");
      setKeywordInput("");
      setErrors({});
      setActiveTab("manual");
      setPastedJD("");
      setUploadedFile(null);
    }
  }, [open]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.jobTitle.trim())
      newErrors.jobTitle = "Job title is required.";
    // if (!formData.jobCode.trim()) newErrors.jobCode = "Job code is required.";
    if (!formData.department.trim())
      newErrors.department = "Department is required.";
    if (!formData.officeLocation.primary.trim())
      newErrors.officeLocation = "Primary office location is required.";
    // if (!formData.description.about.trim())
    // 	newErrors.about = "Job summary is required.";
    if (!formData.companyDetails.industry.trim())
      newErrors.industry = "Industry is required.";
    if (!formData.companyDetails.jobFunction.trim())
      newErrors.jobFunction = "Job function is required.";
    if (!formData.employmentDetails.employmentType)
      newErrors.employmentType = "Employment type is required.";
    if (!formData.employmentDetails.experience)
      newErrors.experience = "Experience level is required.";
    if (!formData.employmentDetails.education)
      newErrors.education = "Education level is required.";
    if (formData.salary.from > formData.salary.to && formData.salary.to > 0)
      newErrors.salaryRange = "Salary 'from' cannot be greater than 'to'.";
    if (!formData.salary.currency.trim())
      newErrors.currency = "Currency is required.";
    if (!formData.company.trim())
      newErrors.company = "Company name is required.";
    // if (!formData.notice_period.trim())
    // 	newErrors.company = "Company name is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "department") {
      const filtered = departments.filter((dept) =>
        dept.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    }
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    if (section === "officeLocation" && field === "primary") {
      const filtered = indianCities
        .filter(({ city, state }) =>
          `${city}, ${state}`.toLowerCase().includes(value.toLowerCase())
        )
        .map(({ city, state }) => `${city}, ${state}`); // convert to string[]

      setLocationSuggestions(filtered); // ✅ no type error
    }

    // Industry suggestion logic
    if (section === "companyDetails" && field === "industry") {
      const filtered = industries.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setIndustrySuggestions(filtered); // <-- Define this in useState
    }

    // For Job Function suggestions
    if (section === "companyDetails" && field === "jobFunction") {
      const filtered = jobFunctions.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setJobFunctionSuggestions(filtered);
    }
  };
  const addKeyword = () => {
    if (
      keywordInput.trim() &&
      !formData.employmentDetails.keywords.includes(keywordInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        employmentDetails: {
          ...prev.employmentDetails,
          keywords: [...prev.employmentDetails.keywords, keywordInput.trim()],
        },
      }));
      setKeywordInput("");
    }
  };
  const removeKeyword = (kw: string) =>
    setFormData((prev) => ({
      ...prev,
      employmentDetails: {
        ...prev.employmentDetails,
        keywords: prev.employmentDetails.keywords.filter((k) => k !== kw),
      },
    }));

  const handleParseJD = async () => {
    setIsParsing(true);
    if (!pastedJD.trim() && !uploadedFile) {
      toast.warning("Please paste a job description or upload a file.");
      return;
    }

    const formData = new FormData();
    if (uploadedFile) {
      formData.append("file", uploadedFile);
      formData.append("fileName", uploadedFile.name);
    } else {
      formData.append("jdText", pastedJD);
    }

    try {
      setIsParsing(true);
      const response = await axios.post(
        `${API_BASE_URL}/jobs/extractJob`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (evt) => {
            const pct = Math.round((evt.loaded * 100) / (evt.total || 1));
            setProgress(pct);
          },
        }
      );

      let rawExtracted = response.data.results[0].extractedData;
      console.log(rawExtracted, "rawextracted");
      rawExtracted = rawExtracted.replace(/```json\n?|```/g, "");
      let extractedObj = JSON.parse(rawExtracted);

      const parsedData = {
        jobTitle: extractedObj.jobTitle,
        description: {
          about: extractedObj.about,
          requirements: extractedObj.requirements,
        },
        companyDetails: {
          industry: extractedObj.industry,
          jobFunction: extractedObj.jobFunction,
        },
        employmentDetails: {
          experience: "",
          education: "",
          keywords: [],
        },
      };

      setFormData((prev) => ({
        ...prev,
        ...parsedData,
        description: { ...prev.description, ...parsedData.description },
        companyDetails: {
          ...prev.companyDetails,
          ...parsedData.companyDetails,
        },
        employmentDetails: {
          ...prev.employmentDetails,
          ...parsedData.employmentDetails,
        },
      }));

      toast.success("Job Description parsed! Please review the details.");
      setActiveTab("manual");
    } catch (error) {
      toast.error("Failed to parse Job Description.");
      console.error("JD Parsing Error:", error);
    } finally {
      setIsParsing(false);
      setUploadedFile(null);
      setPastedJD("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      const firstErrorKey = Object.keys(errors)[0];
      toast.error(errors[firstErrorKey]);
      return;
    }
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly.");
      return;
    }
    setLoading(true);

    const payload = {
      job_title: formData.jobTitle,
      job_code: formData.jobCode,
      department: formData.department,
      workplace: formData.workplace,
      office_primary_location: formData.officeLocation.primary,
      office_on_careers_page: formData.officeLocation.onCareersPage,
      office_location_additional: additionalInput
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      description_about: formData.description.about,
      description_requirements: formData.description.requirements,
      description_benefits: formData.description.benefits,
      company_industry: formData.companyDetails.industry,
      company_job_function: formData.companyDetails.jobFunction,
      employment_type: formData.employmentDetails.employmentType,
      experience: formData.employmentDetails.experience,
      education: formData.employmentDetails.education,
      keywords: formData.employmentDetails.keywords,
      salary_from: String(formData.salary.from),
      salary_to: String(formData.salary.to),
      salary_currency: formData.salary.currency,
      company: formData.company,
      about_company: formData.about_company,
      status: "Draft",
      priority: "Medium",
      notice_period: formData.notice_period,
    };

    try {
      await axios.post(`${API_BASE_URL}/jobs/createJob`, payload);
      toast.success("Job created successfully!");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error("Failed to create job. Please try again.");
      console.error("Failed to create job", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-5xl rounded-xl overflow-hidden p-0">
        <form onSubmit={handleSubmit}>
          <div className="max-h-[80vh] overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-4">
                Post a New Job
              </DialogTitle>
            </DialogHeader>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="import">
                  Import from Job Description
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 mb-2">
                    <h3 className="text-xl font-semibold">Work Details</h3>
                  </div>
                  <div>
                    <label className="text-sm">Job Title *</label>
                    <Input
                      placeholder="Frontend Developer"
                      value={formData.jobTitle}
                      onChange={(e) => handleChange("jobTitle", e.target.value)}
                    />
                    {errors.jobTitle && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.jobTitle}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <label className="text-sm">Department</label>
                    <Input
                      placeholder="Engineering"
                      value={formData.department}
                      onChange={(e) =>
                        handleChange("department", e.target.value)
                      }
                    />
                    {suggestions.length > 0 && (
                      <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full max-h-40 overflow-auto rounded-md shadow-md">
                        {suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                department: suggestion,
                              }));
                              setSuggestions([]);
                            }}
                            className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                    {errors.department && (
                      <p className="text-red-500 text-xs">
                        {errors.department}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <label className="text-sm">Office Location *</label>
                    <Input
                      placeholder="Location"
                      value={formData.officeLocation.primary}
                      onChange={(e) => {
                        handleNestedChange(
                          "officeLocation",
                          "primary",
                          e.target.value
                        );
                        // Show suggestions on change
                        setLocationSuggestions(
                          indianCities
                            .filter(({ city, state }) =>
                              `${city}, ${state}`
                                .toLowerCase()
                                .includes(e.target.value.toLowerCase())
                            )
                            .map(({ city, state }) => `${city}, ${state}`)
                        );
                      }}
                      onFocus={() => {
                        // Show suggestions when the input is focused
                        if (formData.officeLocation.primary) {
                          setLocationSuggestions(
                            indianCities
                              .filter(({ city, state }) =>
                                `${city}, ${state}`
                                  .toLowerCase()
                                  .includes(
                                    formData.officeLocation.primary.toLowerCase()
                                  )
                              )
                              .map(({ city, state }) => `${city}, ${state}`)
                          );
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => setLocationSuggestions([]), 150);
                      }}
                    />
                    {locationSuggestions.length > 0 && (
                      <ul
                        className="absolute z-10 bg-white border border-gray-300 mt-1 w-full max-h-40 overflow-auto rounded-md shadow-md"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {locationSuggestions.map((location, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              handleNestedChange(
                                "officeLocation",
                                "primary",
                                location
                              );
                              setLocationSuggestions([]);
                            }}
                            className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                          >
                            {location}
                          </li>
                        ))}
                      </ul>
                    )}
                    {errors.officeLocation && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.officeLocation}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center pt-4 gap-4">
                    <label className="text-sm">Workplace</label>
                    <ToggleGroup
                      type="single"
                      value={formData.workplace}
                      onValueChange={(v) => v && handleChange("workplace", v)}
                    >
                      <ToggleGroupItem value="On-site">On-site</ToggleGroupItem>
                      <ToggleGroupItem value="Hybrid">Hybrid</ToggleGroupItem>
                      <ToggleGroupItem value="Remote">Remote</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm">Show on Careers Page</label>
                    <ToggleGroup
                      type="single"
                      value={String(formData.officeLocation.onCareersPage)}
                      onValueChange={(v) =>
                        v &&
                        handleNestedChange(
                          "officeLocation",
                          "onCareersPage",
                          v === "true"
                        )
                      }
                    >
                      <ToggleGroupItem value="true">Yes</ToggleGroupItem>
                      <ToggleGroupItem value="false">No</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm">
                      Additional Locations (comma-separated)
                    </label>
                    <Input
                      placeholder="Additional Location"
                      value={additionalInput}
                      onChange={(e) => setAdditionalInput(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2 mt-4 mb-2">
                    <h3 className="text-xl font-semibold">Job Description</h3>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm">About *</label>
                    <Textarea
                      placeholder="Describe the job"
                      rows={4}
                      value={formData.description.about}
                      onChange={(e) =>
                        handleNestedChange(
                          "description",
                          "about",
                          e.target.value
                        )
                      }
                    />
                    {errors.about && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.about}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm">Requirements</label>
                    <Textarea
                      placeholder="List requirements"
                      rows={3}
                      value={formData.description.requirements}
                      onChange={(e) =>
                        handleNestedChange(
                          "description",
                          "requirements",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm">Benefits</label>
                    <Textarea
                      placeholder="List benefits"
                      rows={3}
                      value={formData.description.benefits}
                      onChange={(e) =>
                        handleNestedChange(
                          "description",
                          "benefits",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="md:col-span-2 mt-4 mb-2">
                    <h3 className="text-xl font-semibold">Company Details</h3>
                  </div>
                  <div className="relative w-full">
                    <label className="text-sm">Industry *</label>
                    <Input
                      placeholder="IT Services"
                      value={formData.companyDetails.industry}
                      onChange={(e) => {
                        handleNestedChange(
                          "companyDetails",
                          "industry",
                          e.target.value
                        );
                        setShowIndustrySuggestions(true);
                      }}
                      onBlur={() =>
                        setTimeout(() => setShowIndustrySuggestions(false), 150)
                      }
                      onFocus={() => {
                        if (formData.companyDetails.industry)
                          setShowIndustrySuggestions(true);
                      }}
                    />

                    {/* Suggestions dropdown */}
                    {showIndustrySuggestions &&
                      industrySuggestions.length > 0 && (
                        <ul
                          className="absolute z-10 bg-white border border-gray-300 rounded-md w-full mt-1 max-h-48 overflow-y-auto shadow-md"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          {industrySuggestions.map((item, index) => (
                            <li
                              key={index}
                              onClick={() => {
                                handleNestedChange(
                                  "companyDetails",
                                  "industry",
                                  item
                                );
                                setShowIndustrySuggestions(false);
                              }}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}

                    {errors.industry && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.industry}
                      </p>
                    )}
                  </div>
                  <div className="relative w-full">
                    <label className="text-sm">Job Function *</label>
                    <Input
                      placeholder="Software Development"
                      value={formData.companyDetails.jobFunction}
                      onChange={(e) => {
                        handleNestedChange(
                          "companyDetails",
                          "jobFunction",
                          e.target.value
                        );
                        setShowJobFunctionSuggestions(true);
                      }}
                      onBlur={() =>
                        setTimeout(
                          () => setShowJobFunctionSuggestions(false),
                          150
                        )
                      }
                      onFocus={() => {
                        if (formData.companyDetails.jobFunction)
                          setShowJobFunctionSuggestions(true);
                      }}
                    />

                    {showJobFunctionSuggestions &&
                      jobFunctionSuggestions.length > 0 && (
                        <ul
                          className="absolute z-10 bg-white border border-gray-300 rounded-md w-full mt-1 max-h-48 overflow-y-auto shadow-md"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          {jobFunctionSuggestions.map((item, index) => (
                            <li
                              key={index}
                              onClick={() => {
                                handleNestedChange(
                                  "companyDetails",
                                  "jobFunction",
                                  item
                                );
                                setShowJobFunctionSuggestions(false);
                              }}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}

                    {errors.jobFunction && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.jobFunction}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm">Company *</label>
                    <Input
                      placeholder="Company Name"
                      value={formData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                    />
                    {errors.company && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.company}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm">About Company</label>
                    <Textarea
                      placeholder="Describe the company"
                      rows={4}
                      value={formData.about_company}
                      onChange={(e) =>
                        handleChange("about_company", e.target.value)
                      }
                    />
                  </div>

                  <div className="md:col-span-2 mt-4 mb-2">
                    <h3 className="text-xl font-semibold">
                      Employment Details
                    </h3>
                  </div>
                  <div>
                    <label className="text-sm">Employment Type *</label>
                    <Select
                      value={formData.employmentDetails.employmentType}
                      onValueChange={(value) =>
                        handleNestedChange(
                          "employmentDetails",
                          "employmentType",
                          value
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Employment Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {employmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.employmentType && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.employmentType}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm">Experience *</label>
                    <Input
                      type="text"
                      placeholder="e.g., 5-7 years"
                      value={formData.employmentDetails.experience}
                      onChange={(e) =>
                        handleNestedChange(
                          "employmentDetails",
                          "experience",
                          e.target.value
                        )
                      }
                    />
                    {errors.experience && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.experience}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm">Education *</label>
                    <Select
                      value={formData.employmentDetails.education}
                      onValueChange={(value) =>
                        handleNestedChange(
                          "employmentDetails",
                          "education",
                          value
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Education Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {educationLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.education && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.education}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm">Keywords</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a keyword and press Enter"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addKeyword())
                        }
                      />
                      <Button
                        type="button"
                        onClick={addKeyword}
                        className="bg-blue-500"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {formData.employmentDetails.keywords.map((kw, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-200 rounded text-sm flex items-center"
                        >
                          {kw}
                          <button
                            type="button"
                            onClick={() => removeKeyword(kw)}
                            className="ml-2 text-red-500 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm">Salary From</label>
                    <Input
                      type="text"
                      placeholder="e.g., 500000"
                      value={formData.salary.from}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^[0-9\b]+$/.test(value)) {
                          handleNestedChange("salary", "from", Number(value));
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm">Salary To</label>
                    <Input
                      type="text"
                      placeholder="e.g., 700000"
                      value={formData.salary.to}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^[0-9\b]+$/.test(value)) {
                          handleNestedChange("salary", "to", Number(value));
                        }
                      }}
                    />
                    {errors.salaryRange && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.salaryRange}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm">Currency *</label>
                    <Select
                      value={formData.salary.currency}
                      onValueChange={(value) =>
                        handleNestedChange("salary", "currency", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencyOptions.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.currency && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.currency}
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="import" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="jd-paste" className="text-sm font-medium">
                      Paste Job Description
                    </label>
                    <Textarea
                      id="jd-paste"
                      placeholder="Paste the full job description text here..."
                      className="mt-1"
                      rows={10}
                      value={pastedJD}
                      onChange={(e) => setPastedJD(e.target.value)}
                      disabled={isParsing}
                    />
                  </div>
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-full border-t border-gray-300"></div>
                    <span className="relative bg-white px-4 text-sm text-gray-500">
                      OR
                    </span>
                  </div>
                  <div>
                    <label htmlFor="jd-upload" className="text-sm font-medium">
                      Upload Jobs
                    </label>

                    <label
                      htmlFor="jd-upload"
                      className="mt-1 flex justify-center w-full px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500"
                    >
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {uploadedFile
                            ? `Selected: ${uploadedFile.name}`
                            : "Click to upload a file"}
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX up to 5MB
                        </p>
                      </div>
                      <Input
                        id="jd-upload"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                          setUploadedFile(e.target.files?.[0] || null)
                        }
                        disabled={isParsing}
                      />
                    </label>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={handleParseJD}
                      disabled={isParsing || (!pastedJD && !uploadedFile)}
                      className="bg-blue-500"
                    >
                      {isParsing && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isParsing ? "Parsing..." : "Parse Job Description"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="p-6 pt-4 flex justify-end gap-3 border-t bg-gray-50 sticky bottom-0">
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                disabled={loading || isParsing}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading || isParsing}
              className="bg-blue-500"
            >
              {loading ? "Publishing..." : "Publish Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostNewJobModal;
