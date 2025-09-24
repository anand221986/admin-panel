import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  currencyOptions,
  API_BASE_URL,
} from "@/components/constants/jobConstants";

type CloneJobModalProps = {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  jobId: number;
  onSuccess: () => void;
};

interface JobForm {
  job_title: string;
  job_code: string;
  department: string;
  workplace: string;
  office_primary_location: string;
  office_on_careers_page: boolean;
  office_location_additional: string[];
  description_about: string;
  description_requirements: string;
  description_benefits: string;
  company_industry: string;
  company_job_function: string;
  employment_type: string;
  experience: string;
  education: string;
  keywords: string[];
  salary_from: string;
  salary_to: string;
  salary_currency: string;
  status: string;
  priority: string;
  salary: {
    from: number;
    to: number;
    currency: string;
  };
  employmentDetails: {
    experienceFrom: number;
    experienceTo: number;
  };
  company: string;
  about_company: string;
  agency_id:number;
}

export default function CloneJobModal({
  open,
  onOpenChange,
  jobId,
  onSuccess,
}: CloneJobModalProps) {
  const initialFormState: JobForm = {
    job_title: "",
    job_code: "",
    department: "",
    workplace: "",
    office_primary_location: "",
    office_on_careers_page: true,
    office_location_additional: [],
    description_about: "",
    description_requirements: "",
    description_benefits: "",
    company_industry: "",
    company_job_function: "",
    employment_type: "",
    experience: "",
    education: "",
    keywords: [],
    salary_from: "",
    salary_to: "",
    status: "Draft",
    priority: "Medium",
    salary: { from: 0, to: 0, currency: "INR" },
    salary_currency: "INR",
    employmentDetails: { experienceFrom: 0, experienceTo: 0 },
    company: "",
    about_company: "",
    agency_id:0
  };

  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});
  const [form, setForm] = useState<JobForm>({ ...initialFormState });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
const agencyId = localStorage.getItem('agency_id');
  // fetch job data when opening
  useEffect(() => {
    if (open && jobId) {
      setLoading(true);
      axios
        .get(`${API_BASE_URL}/jobs/${jobId}`)
        .then(({ data }) => {
          if (!data.result || !Array.isArray(data.result) || !data.result[0]) {
            toast.error("Invalid job data received.");
            return;
          }
          const job = data.result[0];
          setForm({
            ...initialFormState,
            job_title: job.job_title || "",
            job_code: "",
            department: job.department || "",
            workplace: job.workplace || "",
            office_primary_location: job.office_primary_location || "",
            office_on_careers_page: job.office_on_careers_page ?? true,
            office_location_additional: job.office_location_additional || [],
            description_about: job.description_about || "",
            description_requirements: job.description_requirements || "",
            description_benefits: job.description_benefits || "",
            company_industry: job.company_industry || "",
            company_job_function: job.company_job_function || "",
            employment_type: job.employment_type || "",
            experience: job.experience || "",
            education: job.education || "",
            keywords: job.keywords || [],
            salary_from: job.salary_from || "",
            salary_to: job.salary_to || "",
            salary_currency: job.salary_currency || "USD",
            status: job.status || "Draft",
            priority: job.priority || "Medium",
            employmentDetails: {
              experienceFrom: job.experience_from,
              experienceTo: job.experience_to,
            },
            salary: {
              from: job.salary_from,
              to: job.salary_to,
              currency: job.salary_currency,
            },
            company: job.company,
            about_company: job.about_company,
            agency_id:Number(agencyId)
          });
        })
        .catch((err) => {
          console.error("Failed to Clone the job:", err);
          toast.error("There is some issue to clone the job ");
        })
        .finally(() => setLoading(false));
    }
  }, [jobId, open]);

  useEffect(() => {
    if (!open) {
      setForm({ ...initialFormState });
      setErrors({});
    }
  }, [open]);

  const validateForm = (): string | null => {
    const newErrors: Record<string, string> = {};
    if (!form.job_title.trim()) newErrors.job_title = "Job title is required.";
    if (!form.department.trim()) newErrors.department = "Department is required.";
    if (!form.workplace.trim()) newErrors.workplace = "Workplace is required.";
    if (!form.office_primary_location.trim())
      newErrors.office_primary_location = "Primary location is required.";
    if (!form.description_about.trim())
      newErrors.description_about = "Job summary is required.";
    if (!form.company_industry.trim())
      newErrors.company_industry = "Industry is required.";
    if (!form.company_job_function.trim())
      newErrors.company_job_function = "Job function is required.";

    const from = Number(form.salary.from);
    const to = Number(form.salary.to);

    if (isNaN(from) || from < 0)
      newErrors.salary_from = "Salary from must be a non-negative number.";
    if (isNaN(to) || to < 0)
      newErrors.salary_to = "Salary to must be a non-negative number.";
    if (!newErrors.salary_from && !newErrors.salary_to && from > to)
      newErrors.salary_range = "Salary from cannot exceed salary to.";

    if (!form.salary_currency.trim())
      newErrors.salary_currency = "Currency is required.";

    setErrors(newErrors);
    return Object.keys(newErrors)[0] ?? null;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setForm((prev) => ({ ...prev, office_on_careers_page: checked }));
  };

  const handleKeywordAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (e.key === "Enter" && target.value.trim()) {
      e.preventDefault();
      const kw = target.value.trim();
      setForm((prev) => ({
        ...prev,
        keywords: prev.keywords.includes(kw)
          ? prev.keywords
          : [...prev.keywords, kw],
      }));
      target.value = "";
    }
  };

  const removeKeyword = (kw: string) => {
    setForm((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== kw),
    }));
  };

  const handleLocationAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (e.key === "Enter" && target.value.trim()) {
      e.preventDefault();
      const loc = target.value.trim();
      setForm((prev) => ({
        ...prev,
        office_location_additional: prev.office_location_additional.includes(loc)
          ? prev.office_location_additional
          : [...prev.office_location_additional, loc],
      }));
      target.value = "";
    }
  };

  const removeLocation = (loc: string) => {
    setForm((prev) => ({
      ...prev,
      office_location_additional: prev.office_location_additional.filter(
        (l) => l !== loc
      ),
    }));
  };

  const handleSelectChange = (name: keyof JobForm, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  const firstError = validateForm();
    if (firstError) {
      toast.error("Please enter required fields.");
      const el = fieldRefs.current[firstError];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus();
      return;
    }

    setLoading(true);

    const payload = {
      job_title: form.job_title,
      job_code: form.job_code,
      department: form.department,
      workplace: form.workplace,
      office_primary_location: form.office_primary_location,
      office_on_careers_page: form.office_on_careers_page,
      office_location_additional: form.office_location_additional,
      description_about: form.description_about,
      description_requirements: form.description_requirements,
      description_benefits: form.description_benefits,
      company_industry: form.company_industry,
      company_job_function: form.company_job_function,
      employment_type: form.employment_type,
      experience: form.experience,
      education: form.education,
      keywords: form.keywords,
      salary_from: form.salary.from,
      salary_to: form.salary.to,
      salary_currency: form.salary_currency,
      status: form.status,
      priority: form.priority,
      experienceFrom: form.employmentDetails.experienceFrom,
      experienceTo: form.employmentDetails.experienceTo,
      company: form.company,
      about_company: form.about_company,
      agency_id:agencyId
    };

    try {
      await axios.post(`${API_BASE_URL}/jobs/createJob`, payload);
      toast.success("Job cloned successfully.");
      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      console.error("Clone job failed:", err.response || err);
      const msg =
        err.response?.data?.message || err.message || "Failed to clone job.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[80vw] min-h-[80vh] rounded-2xl p-0 overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 max-h-[75vh] overflow-y-auto p-6 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                Clone Job
              </DialogTitle>
            </DialogHeader>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Job Title</label>
              <Input
                name="job_title"
                placeholder="Job Title"
                value={form.job_title}
                onChange={handleChange}
                ref={(el) => (fieldRefs.current.job_title = el)}
              />
              {errors.job_title && (
                <p className="text-red-500 text-xs">{errors.job_title}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <Input
                name="department"
                placeholder="Department"
                value={form.department}
                onChange={handleChange}
                ref={(el) => (fieldRefs.current.department = el)}
              />
              {errors.department && (
                <p className="text-red-500 text-xs">{errors.department}</p>
              )}
            </div>

            {/* Workplace */}
            <div>
              <label className="block text-sm font-medium mb-1">Workplace</label>
              <Input
                name="workplace"
                placeholder="Workplace"
                value={form.workplace}
                onChange={handleChange}
                ref={(el) => (fieldRefs.current.workplace = el)}
              />
              {errors.workplace && (
                <p className="text-red-500 text-xs">{errors.workplace}</p>
              )}
            </div>

            {/* Primary Location */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Primary Location
              </label>
              <Input
                name="office_primary_location"
                placeholder="Primary Location"
                value={form.office_primary_location}
                onChange={handleChange}
                ref={(el) => (fieldRefs.current.office_primary_location = el)}
              />
              {errors.office_primary_location && (
                <p className="text-red-500 text-xs">
                  {errors.office_primary_location}
                </p>
              )}
            </div>

            {/* Salary */}
            <div className="grid grid-cols-3 gap-3">
              <Input
                type="number"
                placeholder="From"
                value={form.salary.from}
                onChange={(e) =>
                  handleNestedChange("salary", "from", Number(e.target.value))
                }
                ref={(el) => (fieldRefs.current.salary_from = el)}
              />
              <Input
                type="number"
                placeholder="To"
                value={form.salary.to}
                onChange={(e) =>
                  handleNestedChange("salary", "to", Number(e.target.value))
                }
                ref={(el) => (fieldRefs.current.salary_to = el)}
              />
              <Select
                value={form.salary_currency}
                onValueChange={(val) => handleSelectChange("salary_currency", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errors.salary_range && (
              <p className="text-red-500 text-xs">{errors.salary_range}</p>
            )}

            {/* About Job */}
            <div>
              <label className="block text-sm font-medium mb-1">About Job</label>
              <Textarea
                name="description_about"
                value={form.description_about}
                onChange={handleChange}
                ref={(el) => (fieldRefs.current.description_about = el)}
              />
              {errors.description_about && (
                <p className="text-red-500 text-xs">{errors.description_about}</p>
              )}
            </div>
          </div>

          {/* Footer with submit */}
          <div className="p-6 pt-4 flex justify-end gap-3 border-t bg-gray-50 sticky bottom-0">
            <Button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? "Posting..." : "Post Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
