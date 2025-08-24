import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MinusCircle, Briefcase, Calendar, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = "http://16.171.117.2:3000";

interface Experience {
  company: string;
  role: string;
  duration?: string;
}

interface ExperienceCardProps {
  candidateId: number;
  experienceString: string;
  fetchCandidates: () => void;
}

const parseJSON = (data: string): Experience[] => {
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function ExperienceCard({
  candidateId,
  experienceString,
  fetchCandidates,
}: ExperienceCardProps) {
  const [displayExperience, setDisplayExperience] = useState<Experience[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editableExperience, setEditableExperience] = useState<Experience[]>(
    []
  );

  useEffect(() => {
    const parsed = parseJSON(experienceString);
    setDisplayExperience(parsed);
    setEditableExperience(parsed);
  }, [experienceString]);

  const handleChange = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    const updated = [...editableExperience];
    updated[index] = { ...updated[index], [field]: value };
    setEditableExperience(updated);
  };

  const handleAdd = () =>
    setEditableExperience([
      ...editableExperience,
      { role: "", company: "", duration: "" },
    ]);

  const handleRemove = (index: number) =>
    setEditableExperience(editableExperience.filter((_, i) => i !== index));

  const handleSave = async () => {
    const originalExperience = [...displayExperience];

    setDisplayExperience(editableExperience);
    setIsEditing(false);

    try {
      await axios.put(`${API_BASE_URL}/candidate/${candidateId}`, {
        experience: JSON.stringify(editableExperience),
      });
      toast.success("Experience updated successfully!");
      fetchCandidates();
    } catch (error) {
      console.error("Failed to save experience:", error);
      toast.error("Could not save experience. Reverting changes.");
      setDisplayExperience(originalExperience);
      setEditableExperience(originalExperience);
    }
  };

  const handleCancel = () => {
    setEditableExperience(displayExperience);
    setIsEditing(false);
  };

  return (
    <Card className="p-4 mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm">EXPERIENCE</p>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            className="px-2 text-xs"
            onClick={() => setIsEditing(true)}
          >
            Edit Experience
          </Button>
        ) : (
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="px-2 text-xs"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-2 text-xs"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        )}
      </div>
      {isEditing ? (
        <div className="space-y-4">
          {editableExperience.map((exp, expIdx) => (
            <div
              key={expIdx}
              className="p-3 border rounded-md space-y-3 bg-slate-50 relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-7 w-7 text-red-500 hover:bg-inherit hover:text-red-600"
                onClick={() => handleRemove(expIdx)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
              <div>
                <label className="text-xs font-medium text-slate-600">
                  Role
                </label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => handleChange(expIdx, "role", e.target.value)}
                  className="w-full p-1 border rounded-md text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">
                  Company
                </label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) =>
                    handleChange(expIdx, "company", e.target.value)
                  }
                  className="w-full p-1 border rounded-md text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">
                  Duration
                </label>
                <input
                  type="text"
                  value={exp.duration || ""}
                  onChange={(e) =>
                    handleChange(expIdx, "duration", e.target.value)
                  }
                  className="w-full p-1 border rounded-md text-xs"
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={handleAdd}
          >
            + Add Experience
          </Button>
        </div>
      ) : displayExperience.length > 0 ? (
        displayExperience.map((exp, idx) => (
          <div key={idx} className="bg-white px-1 pt-1 rounded-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-5 w-5 mr-2 flex-shrink-0 text-gray-600" />
                <div>
                  <h5 className="text-sm font-semibold text-gray-900">
                    {exp.role}
                  </h5>
                  <p className="text-xs text-gray-700 mt-0.5">{exp.company}</p>
                  {exp.duration && (
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{exp.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-xs text-gray-400">No experience found</p>
      )}
    </Card>
  );
}

