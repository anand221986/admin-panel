import { useState, useRef, FormEvent, useEffect } from "react";
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
  id?: number;
  name: string;
  email: string;
  phone: string;
  password?: string;
  confirm_password?: string;
  role: string;
  agency_id: number | "";
  first_name: string;
  last_name: string;
  status: number | ""; 
}

type CandidateFormKey = keyof CandidateForm;

const initialCandidateForm: CandidateForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirm_password: "",
  role: "",
  agency_id: "",
  first_name: "",
  last_name: "",
  status:""
};

interface UserManualProps {
  candidate?: CandidateForm | null; // For edit
  fetchCandidates: () => void;
  onClose: () => void;
}

export const UserManual = ({ candidate, fetchCandidates, onClose }: UserManualProps) => {
  const fieldRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [formData, setFormData] = useState<CandidateForm>(initialCandidateForm);
  const [errors, setErrors] = useState<Partial<Record<CandidateFormKey, string>>>({});
  const [loading, setLoading] = useState(false);
  const [agencies, setAgencies] = useState<any[]>([]);

  // Pre-fill when editing
  useEffect(() => {
    if (candidate) {
      setFormData({
        ...candidate,
        name: `${candidate.first_name ?? ""} ${candidate.last_name ?? ""}`.trim(),
        agency_id: candidate.agency_id ?? "",
        password: "",
        confirm_password: "",
        status: candidate.status ?? "",
      });
    } else {
      setFormData(initialCandidateForm);
    }
  }, [candidate]);

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
    if (!formData.phone) newErrors.phone = "Phone Number is required";
    if (!candidate) {
      // Only validate password fields for new user
      if (!formData.password) newErrors.password = "Password is required";
      if (!formData.confirm_password) newErrors.confirm_password = "Confirm password is required";
      if (formData.password && formData.confirm_password && formData.password !== formData.confirm_password) {
        newErrors.confirm_password = "Passwords do not match";
      }
    }
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.agency_id) newErrors.agency_id = "Agency is required";

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
      if (candidate) {
        // EDIT
        console.log(formData,'update_payload')
 
        await axios.put(`${API_BASE_URL}/user/${candidate.id}`, formData);
        toast.success("User updated successfully");
      } else {
        // ADD
        await axios.post(`${API_BASE_URL}/auth/signup`, formData);
        toast.success("User added successfully");
      }
      fetchCandidates();
      resetForm();
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Error saving user");
      } else {
        toast.error("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAgencies = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/agency/getAllAgencies`);
      setAgencies(data.result || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch agencies.");
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Name, Email, Phone, Password fields */}
      {[
        { key: "name", label: "Full Name", placeholder: "e.g. John", type: "text" },
        { key: "email", label: "Email", placeholder: "you@example.com", type: "text" },
        { key: "phone", label: "Phone Number", placeholder: "+1 (555) 555-5555", type: "text" },
        { key: "password", label: "Password", placeholder: "Enter password", type: "password" },
        { key: "confirm_password", label: "Confirm Password", placeholder: "Re-enter password", type: "password" },
      ].map(({ key, label, placeholder, type }) =>
        candidate && (key === "password" || key === "confirm_password") ? null : (
          <div key={key}>
            <label className="text-sm" htmlFor={key}>{label}</label>
            <Input
              id={key}
              type={type}
              value={formData[key as CandidateFormKey] || ""}
              placeholder={placeholder}
              aria-invalid={!!errors[key as CandidateFormKey]}
              onChange={(e) => handleChange(key as CandidateFormKey, e.target.value)}
              ref={(el) => (fieldRefs.current[key] = el)}
            />
            {errors[key as CandidateFormKey] && (
              <p className="text-sm text-red-500">{errors[key as CandidateFormKey]}</p>
            )}
          </div>
        )
      )}

      {/* Role Select */}
      <div>
        <label className="text-sm" htmlFor="role">Role</label>
        <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
          <SelectTrigger className={errors.role ? "border border-red-500" : ""}>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Recruiter">Recruiter</SelectItem>
            <SelectItem value="Vendor">Vendor</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
      </div>

      {/* Agency Select */}
      <div>
        <label className="text-sm" htmlFor="agency_id">Agency</label>
        <Select
          value={formData.agency_id ? String(formData.agency_id) : ""}
          onValueChange={(value) => handleChange("agency_id",  value)}
        >
          <SelectTrigger className={errors.agency_id ? "border border-red-500" : ""}>
            <SelectValue placeholder="Select agency" />
          </SelectTrigger>
          <SelectContent>
            {agencies.map((agency) => (
              <SelectItem key={agency.id} value={agency.id.toString()}>
                {agency.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.agency_id && <p className="text-sm text-red-500">{errors.agency_id}</p>}
      </div>

      {/* Status Select */}
<div>
  <label className="text-sm" htmlFor="status">Status</label>
  <Select
    value={formData.status !== "" ? String(formData.status) : ""}
    onValueChange={(value) => handleChange("status", Number(value))}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="1">Active</SelectItem>
      <SelectItem value="0">Inactive</SelectItem>
    </SelectContent>
  </Select>
</div>

      {/* Buttons */}
      <div className="md:col-span-2 flex justify-end gap-3 mt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {loading ? (candidate ? "Updating..." : "Adding...") : candidate ? "Update User" : "Add User"}
        </Button>
      </div>
    </form>
  );
};
