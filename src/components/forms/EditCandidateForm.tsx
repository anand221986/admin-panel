import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { API_BASE_URL } from "../../config/api";

interface CandidateForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  headline?: string;
  address: string;
  experience: string;
  education: string;
  summary?: string;
  current_company?: string;
  current_ctc?: string;
  expected_ctc?: string;
  linkedinprofile: string;
  notice_period: string;
  institutiontier: string;
  companytier: string;
  skill: string[];
}

interface EditCandidateFormProps {
  candidate: any;
  onSaveSuccess: () => void;
  onCancel: () => void;
}

const parseJsonString = <T,>(value: string | T, defaultValue: T): T => {
  if (typeof value !== "string") return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T) : ([parsed] as T);
  } catch {
    return defaultValue;
  }
};

export const EditCandidateForm: React.FC<EditCandidateFormProps> = ({
  candidate,
  onSaveSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<CandidateForm> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (candidate) {
      setFormData({
        ...candidate,
        skill: Array.isArray(candidate.skill)
          ? candidate.skill
          : parseJsonString<string[]>(candidate.skill as any, []),
      });
      setError(null);
    }
  }, [candidate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const skillsArray = value.split(",").map((skill) => skill.trim());
    setFormData((prev) => ({ ...prev, skill: skillsArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `${API_BASE_URL}/candidate/${candidate.id}`,
        formData
      );

      if (response.data.status) {
        toast.success("Candidate updated successfully!");
        onSaveSuccess();
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update candidate";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!formData) return null;

  return (
    <div className="h-full flex flex-col bg-white border rounded-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Edit Candidate Details</h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="headline">Headline</Label>
            <Input
              id="headline"
              name="headline"
              value={formData.headline || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current_company">Current Company</Label>
              <Input
                id="current_company"
                name="current_company"
                value={formData.current_company || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                name="experience"
                value={formData.experience || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current_ctc">Current CTC</Label>
              <Input
                id="current_ctc"
                name="current_ctc"
                value={formData.current_ctc || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="expected_ctc">Expected CTC</Label>
              <Input
                id="expected_ctc"
                name="expected_ctc"
                value={formData.expected_ctc || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notice_period">Notice Period</Label>
            <Input
              id="notice_period"
              name="notice_period"
              value={formData.notice_period || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="linkedinprofile">LinkedIn Profile</Label>
            <Input
              id="linkedinprofile"
              name="linkedinprofile"
              value={formData.linkedinprofile || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="education">Education</Label>
            <Textarea
              id="education"
              name="education"
              value={formData.education || ""}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="skill">Skills (comma-separated)</Label>
            <Input
              id="skill"
              name="skill"
              value={formData.skill?.join(", ") || ""}
              onChange={handleSkillsChange}
              placeholder="React, Node.js, Python..."
            />
          </div>

          <div>
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              name="summary"
              value={formData.summary || ""}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="institutiontier">Institution Tier</Label>
              <Input
                id="institutiontier"
                name="institutiontier"
                value={formData.institutiontier || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="companytier">Company Tier</Label>
              <Input
                id="companytier"
                name="companytier"
                value={formData.companytier || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </form>
      </div>

      <div className="flex justify-end gap-2 p-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
