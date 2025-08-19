import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MinusCircle, GraduationCap, Calendar } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = "http://16.171.117.2:3000";

interface Education {
  degree: string;
  institution: string;
  duration?: string;
}

interface EducationCardProps {
  candidateId: number;
  educationString: string;
  fetchCandidates: () => void;
}

const parseJSON = (data: string): Education[] => {
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function EducationCard({
  candidateId,
  educationString,
  fetchCandidates,
}: EducationCardProps) {
  // State to hold the data being displayed
  const [displayEducation, setDisplayEducation] = useState<Education[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  // State to hold data while it's being edited
  const [editableEducation, setEditableEducation] = useState<Education[]>([]);

  useEffect(() => {
    const parsed = parseJSON(educationString);
    setDisplayEducation(parsed);
    setEditableEducation(parsed);
  }, [educationString]);

  const handleChange = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const updated = [...editableEducation];
    updated[index] = { ...updated[index], [field]: value };
    setEditableEducation(updated);
  };

  const handleAdd = () =>
    setEditableEducation([
      ...editableEducation,
      { degree: "", institution: "", duration: "" },
    ]);

  const handleRemove = (index: number) =>
    setEditableEducation(editableEducation.filter((_, i) => i !== index));

  const handleSave = async () => {
    const originalEducation = [...displayEducation]; // Keep a copy to revert on failure

    // 1. Optimistically update the local display state and exit editing mode
    setDisplayEducation(editableEducation);
    setIsEditing(false);

    try {
      // 2. Send the update to the server
      await axios.put(`${API_BASE_URL}/candidate/${candidateId}`, {
        education: JSON.stringify(editableEducation),
      });
      toast.success("Education updated successfully!");
      // 3. Sync with parent on success
      fetchCandidates();
    } catch (error) {
      console.error("Failed to save education:", error);
      toast.error("Could not save education. Reverting changes.");
      // 4. Revert local state on failure
      setDisplayEducation(originalEducation);
      setEditableEducation(originalEducation);
    }
  };

  const handleCancel = () => {
    // On cancel, revert editable state back to the current display state
    setEditableEducation(displayEducation);
    setIsEditing(false);
  };

  return (
    <Card className="p-4 mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm">EDUCATION</p>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            className="px-2 text-xs"
            onClick={() => setIsEditing(true)}
          >
            Edit Education
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
              size="sm"
              variant="outline"
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
          {editableEducation.map((edu, index) => (
            <div
              key={index}
              className="p-3 border rounded-md space-y-2 bg-slate-50 relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-7 w-7 text-red-500 hover:bg-red-100"
                onClick={() => handleRemove(index)}
              >
                <MinusCircle className="h-5 w-5" />
              </Button>
              <div>
                <label className="text-xs font-medium text-slate-600">
                  Degree
                </label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) =>
                    handleChange(index, "degree", e.target.value)
                  }
                  className="w-full p-1 border rounded-md text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">
                  Institution
                </label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) =>
                    handleChange(index, "institution", e.target.value)
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
                  value={edu.duration || ""}
                  onChange={(e) =>
                    handleChange(index, "duration", e.target.value)
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
            + Add Education
          </Button>
        </div>
      ) : displayEducation.length > 0 ? (
        displayEducation.map((edu, idx) => (
          <div key={idx} className="flex items-start gap-2 py-1">
            <GraduationCap className="h-4 w-4 flex-shrink-0 text-gray-500 mt-1" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="text-sm font-semibold text-gray-800 capitalize">
                  {edu.degree || "N/A"}
                </p>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">{edu.institution}</p>
              {edu.duration && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <Calendar className="h-3 w-3" />
                  <span>{edu.duration}</span>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-xs text-gray-400">No education found</p>
      )}
    </Card>
  );
}
