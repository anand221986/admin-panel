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

const API_BASE_URL = "http://16.171.117.2:3000";

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
    salary_currency: "USD",
    status: "Draft",
    priority: "Medium",
  };

  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

  const [form, setForm] = useState<JobForm>({ ...initialFormState });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
          });
        })
        .catch((err) => {
          console.error("Failed to load job:", err);
          toast.error("Failed to load job data.");
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
    if (!form.department.trim())
      newErrors.department = "Department is required.";
    if (!form.workplace.trim()) newErrors.workplace = "Workplace is required.";
    if (!form.office_primary_location.trim())
      newErrors.office_primary_location = "Primary location is required.";
    if (!form.description_about.trim())
      newErrors.description_about = "Job summary is required.";
    if (!form.company_industry.trim())
      newErrors.company_industry = "Industry is required.";
    if (!form.company_job_function.trim())
      newErrors.company_job_function = "Job function is required.";

    const from = Number(form.salary_from);
    const to = Number(form.salary_to);

    if (isNaN(from) || from < 0)
      newErrors.salary_from = "Salary from must be a non-negative number.";
    if (isNaN(to) || to < 0)
      newErrors.salary_to = "Salary to must be a non-negative number.";
    if (!newErrors.salary_from && !newErrors.salary_to && from > to)
      newErrors.salary_range = "Salary from cannot exceed salary to.";

    if (!form.salary_currency.trim())
      newErrors.salary_currency = "Currency is required.";

    setErrors(newErrors);
    const firstErrorKey = Object.keys(newErrors)[0] ?? null;
    return firstErrorKey;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
        office_location_additional: prev.office_location_additional.includes(
          loc
        )
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
      jobTitle: form.job_title,
      jobCode: form.job_code,
      department: form.department,
      workplace: form.workplace,
      officeLocation: {
        primary: form.office_primary_location,
        onCareersPage: form.office_on_careers_page,
        additional: form.office_location_additional,
      },
      description: {
        about: form.description_about,
        requirements: form.description_requirements,
        benefits: form.description_benefits,
      },
      companyDetails: {
        industry: form.company_industry,
        jobFunction: form.company_job_function,
      },
      employmentDetails: {
        employmentType: form.employment_type,
        experience: form.experience,
        education: form.education,
        keywords: form.keywords,
      },
      salary: {
        from: Number(form.salary_from),
        to: Number(form.salary_to),
        currency: form.salary_currency,
      },
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
      <DialogContent className="sm:max-w-5xl rounded-xl overflow-hidden p-0">
        <form onSubmit={handleSubmit}>
          <div className="max-h-[80vh] overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-4">
                Clone Job
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              <div className="md:col-span-2 mt-5 mb-4">
                <h3 className="text-xl font-semibold">Work Details</h3>
              </div>
              <div>
                <label className="text-sm">Job Title *</label>
                <Input
                  name="job_title"
                  placeholder="Job Title"
                  value={form.job_title}
                  onChange={handleChange}
                  ref={(el) => (fieldRefs.current.job_title = el)}
                />
                {errors.job_title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.job_title}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm">Department *</label>
                <Input
                  name="department"
                  placeholder="Department"
                  value={form.department}
                  onChange={handleChange}
                  ref={(el) => (fieldRefs.current.department = el)}
                />
                {errors.department && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.department}
                  </p>
                )}
              </div>
            </div>

            {/* Workplace + Status + Priority in one line */}
            <div className="grid grid-cols-3 gap-4 w-full mt-4">
              <div>
                <label className="text-sm ">Workplace *</label>
                <Select
                  value={form.workplace}
                  onValueChange={(val) => handleSelectChange("workplace", val)}
                >
                  <SelectTrigger
                    ref={(el) => (fieldRefs.current.workplace = el)}
                    className="w-full"
                  >
                    <SelectValue placeholder="Select workplace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="On-site">On-site</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                {errors.workplace && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.workplace}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1">Status</label>
                <Select
                  value={form.status}
                  onValueChange={(val) => handleSelectChange("status", val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm mb-1">Priority</label>
                <Select
                  value={form.priority}
                  onValueChange={(val) => handleSelectChange("priority", val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Office Location - separate */}
            <div className="mt-4">
              <label className="text-sm">Office Location *</label>
              <Input
                name="office_primary_location"
                placeholder="Primary Office Location"
                value={form.office_primary_location}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center space-x-2 mb-4 mt-2">
              <Checkbox
                checked={form.office_on_careers_page}
                onCheckedChange={handleCheckboxChange}
              />
              <label className="text-sm">Show office on careers page</label>
            </div>

            <div>
              <label className="text-sm ">Additional Office Locations</label>
              <Input
                onKeyDown={handleLocationAdd}
                placeholder="Add location and press Enter"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {form.office_location_additional.map((loc, idx) => (
                  <Badge
                    key={idx}
                    className="flex items-center gap-1 px-2 py-1 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {loc}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeLocation(loc)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* rest of your form continues unchanged... */}

            <div className="grid grid-cols-1 gap-4 mt-6">
              <div className="md:col-span-1 mb-2 ">
                <h3 className="text-xl font-semibold">Job Description</h3>
              </div>
              <div>
                <label className="text-sm">About the Job *</label>
                <Textarea
                  name="description_about"
                  placeholder="Describe the role and responsibilities"
                  value={form.description_about}
                  onChange={handleChange}
                  rows={4}
                  ref={(el) => (fieldRefs.current.description_about = el)}
                />
                {errors.description_about && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description_about}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm">Requirements</label>
                <Textarea
                  name="description_requirements"
                  placeholder="Skills, experience, and qualifications required"
                  value={form.description_requirements}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Job Benefits
                </label>
                <Textarea
                  name="description_benefits"
                  placeholder="Benefits"
                  value={form.description_benefits}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Industry, Job Function, etc. ... unchanged */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Industry</label>
                <Input
                  name="company_industry"
                  placeholder="Industry"
                  value={form.company_industry}
                  onChange={handleChange}
                  ref={(el) => (fieldRefs.current.company_industry = el)}
                />
                {errors.company_industry && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.company_industry}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm">Job Function *</label>
                <Input
                  name="company_job_function"
                  placeholder="Job Function"
                  value={form.company_job_function}
                  onChange={handleChange}
                  ref={(el) => (fieldRefs.current.company_job_function = el)}
                />
                {errors.company_job_function && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.company_job_function}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm">Employment Type *</label>
                <Select
                  value={form.employment_type}
                  onValueChange={(val) =>
                    handleSelectChange("employment_type", val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Employment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm">Experience Level *</label>
                <Select
                  value={form.experience}
                  onValueChange={(val) => handleSelectChange("experience", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Experience Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry level">Entry level</SelectItem>
                    <SelectItem value="Mid level">Mid level</SelectItem>
                    <SelectItem value="Senior level">Senior level</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm">Education Level</label>
                <Select
                  value={form.education}
                  onValueChange={(val) => handleSelectChange("education", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Education Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="Associate">Associate</SelectItem>
                    <SelectItem value="Bachelor">Bachelor</SelectItem>
                    <SelectItem value="Master">Master</SelectItem>
                    <SelectItem value="Doctorate">Doctorate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 mt-10 mb-2">
  <div className="md:col-span-2 mb-4">
    <h3 className="text-xl font-semibold">Salary Information</h3>
  </div>
  <div>
    <label className="text-sm">Salary From</label>
    <Input
      name="salary_from"
      placeholder="Minimum salary"
      value={form.salary_from}
      onChange={handleChange}
      type="number"
    />
  </div>
  <div>
    <label className="text-sm">Salary To</label>
    <Input
      name="salary_to"
      placeholder="Maximum salary"
      value={form.salary_to}
      onChange={handleChange}
      type="number"
    />
  </div>
</div>

<div className="mt-5 md:mt-5">
  <label className="text-sm">Keywords (Press Enter to add)</label>
  <Input
    onKeyDown={handleKeywordAdd}
    placeholder="Add keyword and press Enter"
  />
  <div className="flex flex-wrap gap-2 mt-2">
    {form.keywords.map((kw, idx) => (
      <Badge
        key={idx}
        className="flex items-center gap-1 px-2 py-1 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {kw}
        <X
          className="h-3 w-3 cursor-pointer"
          onClick={() => removeKeyword(kw)}
        />
      </Badge>
    ))}
  </div>
</div>

          </div>
          <div className="p-6 pt-4 flex justify-end gap-3 border-t bg-gray-50 sticky bottom-0">
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                disabled={loading}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-500"
            >
              {loading ? "Cloning..." : "Clone Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
