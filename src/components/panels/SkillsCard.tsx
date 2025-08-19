import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MinusCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = "http://16.171.117.2:3000";

interface SkillsCardProps {
  candidateId: number;
  skills: string[];
  fetchCandidates: () => void;
}

export default function SkillsCard({
  candidateId,
  skills,
  fetchCandidates,
}: SkillsCardProps) {
  const [displaySkills, setDisplaySkills] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editableSkills, setEditableSkills] = useState<string[]>([]);

  useEffect(() => {
    setDisplaySkills(skills || []);
    setEditableSkills(skills || []);
  }, [skills]);

  const handleChange = (index: number, value: string) => {
    const updated = [...editableSkills];
    updated[index] = value;
    setEditableSkills(updated);
  };

  const handleAdd = () => setEditableSkills([...editableSkills, ""]);

  const handleRemove = (index: number) =>
    setEditableSkills(editableSkills.filter((_, i) => i !== index));

  const handleSave = async () => {
    const originalSkills = [...displaySkills];

    setDisplaySkills(editableSkills);
    setIsEditing(false);

    try {
      await axios.put(`${API_BASE_URL}/candidate/${candidateId}`, {
        skill: JSON.stringify(editableSkills),
      });
      toast.success("Skills updated successfully!");
      fetchCandidates();
    } catch (error) {
      console.error("Failed to save skills:", error);
      toast.error("Could not save skills. Reverting changes.");
      setDisplaySkills(originalSkills);
      setEditableSkills(originalSkills);
    }
  };

  const handleCancel = () => {
    setEditableSkills(displaySkills);
    setIsEditing(false);
  };

  return (
    <Card className="p-4 my-4 space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm">SKILLS</p>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            className="px-2 text-xs"
            onClick={() => setIsEditing(true)}
          >
            Edit Skills
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
        <div className="space-y-2">
          <div className="flex flex-col space-y-2">
            {editableSkills.map((skillItem, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={skillItem}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="w-full p-1 border rounded-md text-xs"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={() => handleRemove(index)}
                >
                  <MinusCircle className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={handleAdd}
          >
            + Add Skill
          </Button>
        </div>
      ) : displaySkills?.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-2">
          {displaySkills.map((s) => (
            <Badge key={s} variant="secondary">
              {s}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400">No skills found</p>
      )}
    </Card>
  );
}
