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
import { useEffect, useState } from "react";
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

const API_BASE_URL = "http://51.20.181.155:3000";

type EditJobModalProps = {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  jobId: number;
  onSuccess: () => void;
};
const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Temporary",
];
const experienceLevels = [
  "Entry level",
  "Mid level",
  "Senior level",
  "Director",
  "Executive",
];
const educationLevels = [
  "High School",
  "Associate",
  "Bachelor",
  "Master",
  "Doctorate",
];

export default function EditJobModal({
  open,
  onOpenChange,
  jobId,
  onSuccess,
}: EditJobModalProps) {
  const initialFormState = {
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
    company: "",
    about_company: "",
  };

  const [form, setForm] = useState({ ...initialFormState });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && jobId) {
      setLoading(true);
      axios
        .get(`${API_BASE_URL}/jobs/${jobId}`)
        .then((res) => {
          const job = res.data.result[0];
          setForm({
            job_title: job.job_title || "",
            job_code: job.job_code || "",
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
            company: job.company || "",
            about_company: job.about_company || "",
          });
        })
        .catch((err) => {
          console.error("Failed to load job:", err);
          toast.error("Failed to load job data.");
        })
        .finally(() => setLoading(false));
    }
  }, [jobId, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked) => {
    setForm((prev) => ({ ...prev, office_on_careers_page: checked }));
  };

  const handleKeywordAdd = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const keyword = e.target.value.trim();
      if (!form.keywords.includes(keyword)) {
        setForm((prev) => ({
          ...prev,
          keywords: [...prev.keywords, keyword],
        }));
      }
      e.target.value = "";
    }
  };

  const removeKeyword = (kw) => {
    setForm((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== kw),
    }));
  };

  const handleLocationAdd = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const loc = e.target.value.trim();
      if (!form.office_location_additional.includes(loc)) {
        setForm((prev) => ({
          ...prev,
          office_location_additional: [...prev.office_location_additional, loc],
        }));
      }
      e.target.value = "";
    }
  };

  const removeLocation = (loc) => {
    setForm((prev) => ({
      ...prev,
      office_location_additional: prev.office_location_additional.filter(
        (l) => l !== loc
      ),
    }));
  };

  const handleSelectChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      console.log(form);
      setLoading(true);
      const res = await axios.put(`${API_BASE_URL}/jobs/${jobId}`, form);
      console.log(res);
      toast.success("Job updated successfully!");
      onOpenChange(false);
      setLoading(false);
      onSuccess();
    } catch (err) {
      console.error("Error updating job:", err);
      toast.error("Failed to update job.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl rounded-2xl p-0 overflow-hidden">
        <div className="max-h-[90vh] overflow-y-auto p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Edit Job
            </DialogTitle>
          </DialogHeader>

          {/* General Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Job Title
              </label>
              <Input
                name="job_title"
                placeholder="Job Title"
                value={form.job_title}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Job Code</label>
              <Input
                name="job_code"
                placeholder="Job Code"
                value={form.job_code}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Department
              </label>
              <Input
                name="department"
                placeholder="Department"
                value={form.department}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Workspace
              </label>
              <Select
                value={form.workplace}
                onValueChange={(val) => handleSelectChange("workplace", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On-Site">On-Site</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Office Location
              </label>
              <Input
                name="office_primary_location"
                placeholder="Primary Office Location"
                value={form.office_primary_location}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.office_on_careers_page}
              onCheckedChange={handleCheckboxChange}
            />
            <label className="text-sm font-medium">
              Show office on careers page
            </label>
          </div>

          {/* Additional Locations */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Additional Office Locations
            </label>
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

          {/* Descriptions */}
          <div className="grid gap-4">
            <label className="block text-sm font-medium mb">About</label>
            <Textarea
              name="description_about"
              placeholder="About the Job"
              value={form.description_about}
              onChange={handleChange}
            />
            <label className="block text-sm font-medium mb">
              Description Requirnment
            </label>
            <Textarea
              name="description_requirements"
              placeholder="Requirements"
              value={form.description_requirements}
              onChange={handleChange}
            />
            <label className="block text-sm font-medium mb">Benifits</label>
            <Textarea
              name="description_benefits"
              placeholder="Benefits"
              value={form.description_benefits}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb">Company</label>
            <Input
              placeholder="Company Name"
              value={form.company}
              onChange={handleChange}
            />
          </div>
          <div className="block text-sm font-medium mb">
            <label className="text-sm">About Company</label>
            <Textarea
              placeholder="Describe the Company"
              rows={4}
              value={form.about_company}
              onChange={handleChange}
            />
          </div>

          {/* Select Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* <div>
              <label className="block text-sm font-medium mb-1">
                Employment Type
              </label>
              <Input
                name="employment_type"
                placeholder="Employment Type"
                value={form.employment_type}
                onChange={handleChange}
              />
            </div> */}

            <div>
              <label className="block text-sm font-medium mb">
                Employment Type
              </label>
              <select
                className="w-full border rounded-md p-2 mt-1 text-sm"
                value={form.employment_type}
                onChange={handleChange}
              >
                <option value="">Select Employment Type</option>
                {employmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Experience
              </label>
              {/* <Input
                name="experience"
                placeholder="Experience"
                value={form.experience}
                onChange={handleChange}
              /> */}

              <select
                className="w-full border rounded-md p-2 mt-1 text-sm"
                value={form.experience}
                onChange={handleChange}
              >
                <option value="">Select Experience Level</option>
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Education
              </label>

              <select
                className="w-full border rounded-md p-2 mt-1 text-sm"
                value={form.education}
                onChange={handleChange}
              >
                <option value="">Select Education Level</option>
                {educationLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {/* <Input
                name="education"
                placeholder="Education"
                value={form.education}
                onChange={handleChange}
              /> */}
            </div>
          </div>

          {/* Company Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <Input
                name="company_industry"
                placeholder="Industry"
                value={form.company_industry}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Job Function
              </label>
              <Input
                name="company_job_function"
                placeholder="Job Function"
                value={form.company_job_function}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Salary Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Salary From
              </label>
              <Input
                name="salary_from"
                placeholder="Salary From"
                value={form.salary_from}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Salary To
              </label>
              <Input
                name="salary_to"
                placeholder="Salary To"
                value={form.salary_to}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <Input
                name="salary_currency"
                placeholder="Currency"
                value={form.salary_currency}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Keywords (Press Enter to add)
            </label>
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

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
