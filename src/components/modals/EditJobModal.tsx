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
import {
  currencyOptions,
  API_BASE_URL,
  employmentTypes,
  educationLevels,
} from "@/components/constants/jobConstants";
type EditJobModalProps = {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  jobId: number;
  onSuccess: () => void;
};
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
    salary: { from: 0, to: 0, currency: "INR" },
   employmentDetails:{experienceFrom:0,experienceTo:0},
  };

  const [form, setForm] = useState({ ...initialFormState });
  const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handleNestedChange = (section: string, field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  }
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
  // 👇 Make sure nested objects are always present
  salary: {
    from: job.salary_from || 0,
    to: job.salary_to || 0,
    currency: job.salary_currency || "INR",
  },
  employmentDetails: {
    experienceFrom: job.experience_from || 0,
    experienceTo: job.experience_to || 0,
  },
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
      console.error("Error on updating the job:", err);
      toast.error("Failed to update the  job.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl rounded-xl overflow-hidden p-0">
        <div className="max-h-[80vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">
              Edit Job
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
              />
            </div>
            <div>
              <label className="text-sm">Job Code</label>
              <Input
                name="job_code"
                placeholder="Job Code"
                value={form.job_code}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div>
              <label className="text-sm">Department</label>
              <Input
                name="department"
                placeholder="Department"
                value={form.department}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm">Workplace</label>
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
              <label className="text-sm">Office Location *</label>
              <Input
                name="office_primary_location"
                placeholder="Primary Office Location"
                value={form.office_primary_location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              checked={form.office_on_careers_page}
              onCheckedChange={handleCheckboxChange}
            />
            <label className="text-sm">
              Show office on careers page
            </label>
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

          {/* Descriptions */}
          <div className="grid grid-cols-1 gap-4 mt-6">
            <div className="md:col-span-1 mb-2">
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
                className="w-full"
              />
            </div>
            <div className="w-full">
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
              <label className="text-sm">Benefits</label>
              <Textarea
                name="description_benefits"
                placeholder="What we offer to our employees"
                value={form.description_benefits}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 ">
            <div className="md:col-span-1 mb-2 mt-10">
              <h3 className="text-xl font-semibold">Company Information</h3>
            </div>
            <div>
              <label className="text-sm">Company Name</label>
              <Input
                name="company"
                placeholder="Company Name"
                value={form.company}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm">About Company</label>
              <Textarea
                name="about_company"
                placeholder="Describe the company"
                rows={3}
                value={form.about_company}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            <div className="md:col-span-2 mb-2">
              <h3 className="text-xl font-semibold">Employment Details</h3>
            </div>
            <div>
              <label className="text-sm">Employment Type *</label>
              <Select
                value={form.employment_type}
                onValueChange={(val) => handleSelectChange("employment_type", val)}
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
            </div>
<div>
                                  <label className="text-sm">Experience *</label>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Input
                                      type="number"
                                      placeholder="From"
                                      value={form.employmentDetails.experienceFrom}
                                      onChange={(e) =>
                                        handleNestedChange(
                                          "employmentDetails",
                                          "experienceFrom",
                                          e.target.value
                                        )
                                      }
                                      className="w-24"
                                    />
                                    <span>to</span>
                                    <Input
                                      type="number"
                                      placeholder="To"
                                      value={form.employmentDetails.experienceTo}
                                      onChange={(e) =>
                                        handleNestedChange(
                                          "employmentDetails",
                                          "experienceTo",
                                          e.target.value
                                        )
                                      }
                                      className="w-24"
                                    />
                                    <span>Years</span>
                                  </div>
              
                                  {(errors.experienceFrom || errors.experienceTo) && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {errors.experienceFrom}<br /> {errors.experienceTo}
                                    </p>
                                  )}
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
                  {educationLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm">Industry</label>
              <Input
                name="company_industry"
                placeholder="Industry"
                value={form.company_industry}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm">Job Function</label>
              <Input
                name="company_job_function"
                placeholder="Job Function"
                value={form.company_job_function}
                onChange={handleChange}
              />
            </div>
          </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 mt-10 mb-2">
  <div className="md:col-span-2 mb-4">
    <h3 className="text-xl font-semibold">Salary Information</h3>
  </div>
 
       {/* Salary */}
                     <div>
                       <label className="text-sm">Annual Salary</label>
                       <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                         <Select
                           value={form.salary.currency}
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
   
                         {/* FROM */}
                         <input
                           type="number"
                           placeholder="Min salary"
                           value={form.salary.from}
                            onChange={(e) => {
       const val = e.target.value;
       handleNestedChange("salary", "from", val === "" ? "" : Number(val));
     }}
                         />
                         <span>To</span>
   
                         {/* TO */}
                         <input
                           type="number"
                           placeholder="Max salary"
                           value={form.salary.to}
                             onChange={(e) => {
       const val = e.target.value;
       handleNestedChange("salary", "to", val === "" ? "" : Number(val));
     }}
                         /> lacs
                       </div>
                       {errors.salaryRange && (
                         <p className="text-red-500 text-xs mt-1">{errors.salaryRange}</p>
                       )}
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
          <Button
            variant="outline"
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

