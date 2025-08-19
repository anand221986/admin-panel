import { useState, useRef, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";

const API_BASE_URL = "http://16.171.117.2:3000";

interface CandidateForm {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  role: string;
}

type CandidateFormKey = keyof CandidateForm;

const initialCandidateForm: CandidateForm = {
  name: "",
  email: "",
  phone_number: "",
  password: "",
  confirm_password: "",
  role: "",
};

export const CandidateManual = () => {
  const fieldRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [formData, setFormData] = useState<CandidateForm>(initialCandidateForm);
  const [errors, setErrors] = useState<Partial<Record<CandidateFormKey, string>>>({});
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData(initialCandidateForm);
    setErrors({});
  };

  const handleChange = (field: CandidateFormKey, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone_number) newErrors.phone_number = "Phone Number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirm_password) newErrors.confirm_password = "Confirm password is required";
    if (formData.password && formData.confirm_password && formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }
    if (!formData.role) newErrors.role = "Role is required";

    setErrors(newErrors);
    const firstErrorKey = Object.keys(newErrors)[0] ?? null;
    return firstErrorKey;
  };

  const handleSubmit = async (e: FormEvent) => {
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

    try {
      const payload = {
        ...formData,
      };
      await axios.post(`${API_BASE_URL}/auth/signup`, payload);
      toast.success("User added successfully");
      resetForm();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Error adding user");
      } else {
        toast.error("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        {
          key: "name",
          label: "Full Name",
          placeholder: "e.g. John",
          type: "text",
        },
        {
          key: "email",
          label: "Email",
          placeholder: "you@example.com",
          type: "text",
        },
        {
          key: "phone_number",
          label: "Phone Number",
          placeholder: "+1 (555) 555‑5555",
          type: "text",
        },
        {
          key: "password",
          label: "Password",
          placeholder: "Enter your password",
          type: "password",
        },
        {
          key: "confirm_password",
          label: "Confirm Password",
          placeholder: "Re-enter your password",
          type: "password",
        },
      ].map(({ key, label, placeholder, type }) => (
        <div key={key}>
          <label className="text-sm" htmlFor={key}>
            {label}
          </label>
          <Input
            id={key}
            type={type}
            value={formData[key as CandidateFormKey]}
            placeholder={placeholder}
            aria-invalid={!!errors[key as CandidateFormKey]}
            onChange={(e) => handleChange(key as CandidateFormKey, e.target.value)}
            ref={(el) => (fieldRefs.current[key] = el)}
          />
          {errors[key as CandidateFormKey] && (
            <p className="text-sm text-red-500">
              {errors[key as CandidateFormKey]}
            </p>
          )}
        </div>
      ))}

      {/* Role Select */}
    <div>
  <label className="text-sm" htmlFor="role">
    Role
  </label>
  <Select
    value={formData.role}
    onValueChange={(value) => handleChange("role", value)}
  >
    <SelectTrigger
      className={errors.role ? "border border-red-500" : ""}
    >
      <SelectValue placeholder="Select role" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="Admin">Admin</SelectItem>
      <SelectItem value="Candidate">Candidate</SelectItem>
      <SelectItem value="HiringManager">Hiring Manager</SelectItem>
      <SelectItem value="Interviewer">Interviewer</SelectItem>
      <SelectItem value="Recruiter">Recruiter</SelectItem>
      <SelectItem value="Vendor">Vendor</SelectItem>
    </SelectContent>
  </Select>
  {errors.role && (
    <p className="text-sm text-red-500">{errors.role}</p>
  )}
</div>


      <div className="md:col-span-2 flex justify-end gap-3 mt-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {loading ? "Adding..." : "Add User"}
        </Button>
      </div>
    </form>
  );
};
