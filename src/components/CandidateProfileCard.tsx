import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Trash2,
  MinusCircle,
  Minus,
  Building,
  User,
  Briefcase,
  Calendar,
  GraduationCap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import StarRating from "./StarRating";
import AssignToJobModal from "./modals/AssigntoJobModal";
import EditCandidateModal from "./modals/EditCandidateModal";

interface Education {
  degree: string;
  institution: string;
  duration?: string;
}

interface Experience {
  company: string;
  role: string;
  duration?: string;
  responsibilities?: string[];
}

interface CandidateProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  headline: string | null;
  photo_url: string | null;
  education: string;
  experience: string;
  current_ctc: string | null;
  expected_ctc: string | null;
  skill: string[];
  current_company: string | null;
  linkedinprofile: string;
  rating: number | string | null;
  status: string;
  recruiter_status: string;
  hmapproval: string;
  notice_period: string;
  institutiontier: string;
  companytier: string;
  resume_url: string;
  job_titles: string[];
}

interface ProfileCardProps {
  candidate: CandidateProfile;
  fetchCandidates: () => void;
}

const parseJSON = (data: string | any[]): any[] => {
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return Array.isArray(data) ? data : [];
};

export default function CandidateProfileCard({
  candidate,
  fetchCandidates,
}: ProfileCardProps) {
  const {
    id,
    first_name,
    last_name,
    email,
    phone,
    headline,
    photo_url,
    education,
    experience,
    current_ctc,
    expected_ctc,
    skill = [],
    current_company,
    linkedinprofile: linkedIn,
    rating,
    status,
    notice_period,
    institutiontier,
    companytier,
    resume_url,
    job_titles = [],
  } = candidate;

  const [editOpen, setEditOpen] = useState(false);
  const [jobOpen, setJobOpen] = useState(false);

  const initials = [first_name?.[0], last_name?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();
  const linkedInUrl =
    linkedIn && !linkedIn.startsWith("http") ? `https://${linkedIn}` : linkedIn;

  const parsedEducation: Education[] = useMemo(
    () => parseJSON(education),
    [education]
  );
  const parsedExperience: Experience[] = useMemo(
    () => parseJSON(experience),
    [experience]
  );

  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [editableExperience, setEditableExperience] = useState<Experience[]>(
    []
  );

  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [editableEducation, setEditableEducation] = useState<Education[]>([]);

  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [editableSkills, setEditableSkills] = useState<string[]>([]);

  useEffect(() => {
    setEditableExperience(parsedExperience);
    setEditableEducation(parsedEducation);
    setEditableSkills(skill);
  }, [parsedExperience, parsedEducation, skill]);

  const handleExperienceChange = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    const updated = [...editableExperience];
    updated[index] = { ...updated[index], [field]: value };
    setEditableExperience(updated);
  };
  const handleResponsibilityChange = (
    expIndex: number,
    respIndex: number,
    value: string
  ) => {
    const updated = [...editableExperience];
    const newResponsibilities = [...(updated[expIndex].responsibilities || [])];
    newResponsibilities[respIndex] = value;
    updated[expIndex] = {
      ...updated[expIndex],
      responsibilities: newResponsibilities,
    };
    setEditableExperience(updated);
  };
  const handleAddResponsibility = (expIndex: number) => {
    const updated = [...editableExperience];
    const newResponsibilities = [
      ...(updated[expIndex].responsibilities || []),
      "",
    ];
    updated[expIndex] = {
      ...updated[expIndex],
      responsibilities: newResponsibilities,
    };
    setEditableExperience(updated);
  };
  const handleRemoveResponsibility = (expIndex: number, respIndex: number) => {
    const updated = [...editableExperience];
    const newResponsibilities = [...(updated[expIndex].responsibilities || [])];
    newResponsibilities.splice(respIndex, 1);
    updated[expIndex] = {
      ...updated[expIndex],
      responsibilities: newResponsibilities,
    };
    setEditableExperience(updated);
  };
  const handleAddExperience = () =>
    setEditableExperience([
      ...editableExperience,
      { role: "", company: "", duration: "", responsibilities: [""] },
    ]);
  const handleRemoveExperience = (index: number) =>
    setEditableExperience(editableExperience.filter((_, i) => i !== index));
  const handleSaveExperience = () => {
    console.log("Saving Experience:", editableExperience);
    setIsEditingExperience(false);
  };
  const handleCancelExperience = () => {
    setEditableExperience(parsedExperience);
    setIsEditingExperience(false);
  };

  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const updated = [...editableEducation];
    updated[index] = { ...updated[index], [field]: value };
    setEditableEducation(updated);
  };
  const handleAddEducation = () =>
    setEditableEducation([
      ...editableEducation,
      { degree: "", institution: "", duration: "" },
    ]);
  const handleRemoveEducation = (index: number) =>
    setEditableEducation(editableEducation.filter((_, i) => i !== index));
  const handleSaveEducation = () => {
    console.log("Saving Education:", editableEducation);
    setIsEditingEducation(false);
  };
  const handleCancelEducation = () => {
    setEditableEducation(parsedEducation);
    setIsEditingEducation(false);
  };

  const handleSkillChange = (index: number, value: string) => {
    const updated = [...editableSkills];
    updated[index] = value;
    setEditableSkills(updated);
  };
  const handleAddSkill = () => setEditableSkills([...editableSkills, ""]);
  const handleRemoveSkill = (index: number) =>
    setEditableSkills(editableSkills.filter((_, i) => i !== index));
  const handleSaveSkills = () => {
    console.log("Saving Skills:", editableSkills);
    setIsEditingSkills(false);
  };
  const handleCancelSkills = () => {
    setEditableSkills(skill);
    setIsEditingSkills(false);
  };

  return (
    <div className="min-w-full h-full p-3 font-sans">
      <Card className="p-4 space-y-4 shadow-sm rounded-xl">
        <div className="flex items-start space-x-6">
          <Avatar className="h-16 w-16 text-xl">
            {photo_url ? (
              <img
                src={photo_url}
                alt={`${first_name} ${last_name}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-bold text-xl text-slate-800">
                  {first_name} {last_name}
                </h2>
                {headline && (
                  <p className="text-md text-slate-800">{headline}</p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <MoreVertical className="h-5 w-5 text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditOpen(true)}>
                    Edit Candidate
                  </DropdownMenuItem>
                  {resume_url && (
                    <DropdownMenuItem asChild>
                      <a
                        href={resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download Resume
                      </a>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {rating && (
          <div className="mt-2">
            <StarRating rating={Number(rating) || 0} />
          </div>
        )}

        <div className="space-y-2 pt-4 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-x-6 gap-y-1 text-sm text-slate-700">
            {email && (
              <p>
                <strong className="font-medium text-slate-500">Email:</strong>{" "}
                <a href={`mailto:${email}`} className="text-gray-400">
                  {email}
                </a>
              </p>
            )}
            {phone && (
              <p>
                <strong className="font-medium text-slate-500">Phone:</strong>{" "}
                {phone}
              </p>
            )}
            {linkedInUrl && (
              <p>
                <strong className="font-medium text-slate-500">
                  LinkedIn:
                </strong>{" "}
                <a
                  href={linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400"
                >
                  View Profile
                </a>
              </p>
            )}
            {current_company && (
              <p>
                <strong className="font-medium text-slate-500">
                  Current Company:
                </strong>{" "}
                {current_company}
              </p>
            )}
            {current_ctc && (
              <p>
                <strong className="font-medium text-slate-500">
                  Current CTC:
                </strong>{" "}
                {current_ctc}
              </p>
            )}
            {expected_ctc && (
              <p>
                <strong className="font-medium text-slate-500">
                  Expected CTC:
                </strong>{" "}
                {expected_ctc}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="secondary">Status: {status}</Badge>
            {notice_period && (
              <Badge variant="secondary">Notice: {notice_period}</Badge>
            )}
            {institutiontier && institutiontier !== "{}" && (
              <Badge variant="secondary">
                Institution Tier: {institutiontier}
              </Badge>
            )}
            {companytier && companytier !== "{}" && (
              <Badge variant="secondary">Company Tier: {companytier}</Badge>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-4 mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">JOBS</p>
          <Button
            variant="outline"
            size="sm"
            className="px-2 text-xs"
            onClick={() => setJobOpen(true)}
          >
            + Add job
          </Button>
        </div>
        {job_titles?.length > 0 ? (
          job_titles.map((title) => (
            <Badge key={title} variant="secondary" className="mx-1">
              {title}
            </Badge>
          ))
        ) : (
          <p className="text-xs text-gray-400">No jobs found</p>
        )}
      </Card>

      <Card className="p-4 mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">EDUCATION</p>
          {!isEditingEducation ? (
            <Button
              variant="outline"
              size="sm"
              className="px-2 text-xs"
              onClick={() => setIsEditingEducation(true)}
            >
              Edit Education
            </Button>
          ) : (
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="px-2 text-xs"
                onClick={handleCancelEducation}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="px-2 text-xs"
                onClick={handleSaveEducation}
              >
                Save
              </Button>
            </div>
          )}
        </div>
        {isEditingEducation ? (
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
                  onClick={() => handleRemoveEducation(index)}
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
                      handleEducationChange(index, "degree", e.target.value)
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
                      handleEducationChange(
                        index,
                        "institution",
                        e.target.value
                      )
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
                      handleEducationChange(index, "duration", e.target.value)
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
              onClick={handleAddEducation}
            >
              + Add Education
            </Button>
          </div>
        ) : parsedEducation.length > 0 ? (
          parsedEducation.map((edu, idx) => (
            <div key={idx} className="flex items-start gap-2 py-1">
              <GraduationCap className="h-4 w-4 flex-shrink-0 text-gray-500 mt-1" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-semibold text-gray-800 capitalize">
                    {edu.degree || "N/A"}
                  </p>
                  {edu.duration && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{edu.duration}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-0.5">
                  {edu.institution}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400">No education found</p>
        )}
      </Card>

      <Card className="p-4 mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">EXPERIENCE</p>
          {!isEditingExperience ? (
            <Button
              variant="outline"
              size="sm"
              className="px-2 text-xs"
              onClick={() => setIsEditingExperience(true)}
            >
              Edit Experience
            </Button>
          ) : (
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="px-2 text-xs"
                onClick={handleCancelExperience}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="px-2 text-xs"
                onClick={handleSaveExperience}
              >
                Save
              </Button>
            </div>
          )}
        </div>
        {isEditingExperience ? (
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
                  onClick={() => handleRemoveExperience(expIdx)}
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
                    onChange={(e) =>
                      handleExperienceChange(expIdx, "role", e.target.value)
                    }
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
                      handleExperienceChange(expIdx, "company", e.target.value)
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
                      handleExperienceChange(expIdx, "duration", e.target.value)
                    }
                    className="w-full p-1 border rounded-md text-xs"
                  />
                </div>
                {/* <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600">
                    Responsibilities
                  </label>
                  {(exp.responsibilities || []).map((resp, respIdx) => (
                    <div key={respIdx} className="flex items-start space-x-2">
                      <textarea
                        value={resp}
                        onChange={(e) =>
                          handleResponsibilityChange(
                            expIdx,
                            respIdx,
                            e.target.value
                          )
                        }
                        className="w-full p-1 border rounded-md text-xs"
                        rows={5}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="pt-2 h-3 w-3 flex-shrink-0"
                        onClick={() =>
                          handleRemoveResponsibility(expIdx, respIdx)
                        }
                      >
                        <MinusCircle className="h-1 w-1" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleAddResponsibility(expIdx)}
                  >
                    + Add Responsibility
                  </Button>
                </div> */}
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={handleAddExperience}
            >
              + Add Experience
            </Button>
          </div>
        ) : parsedExperience.length > 0 ? (
          parsedExperience.map((exp, idx) => (
            <div key={idx} className="bg-white px-1 pt-1 rounded-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-5 w-5 mr-2 flex-shrink-0 text-gray-600" />
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900">
                      {exp.role}
                    </h5>
                    <p className="text-xs text-gray-700 mt-0.5">
                      {exp.company}
                    </p>
                  </div>
                </div>
                {exp.duration && (
                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{exp.duration}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400">No experience found</p>
        )}
      </Card>

      <Card className="p-4 my-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">SKILLS</p>
          {!isEditingSkills ? (
            <Button
              variant="outline"
              size="sm"
              className="px-2 text-xs"
              onClick={() => setIsEditingSkills(true)}
            >
              Edit Skills
            </Button>
          ) : (
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="px-2 text-xs"
                onClick={handleCancelSkills}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="px-2 text-xs"
                onClick={handleSaveSkills}
              >
                Save
              </Button>
            </div>
          )}
        </div>
        {isEditingSkills ? (
          <div className="space-y-2">
            <div className="flex flex-col space-y-2">
              {editableSkills.map((skillItem, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={skillItem}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    className="w-full p-1 border rounded-md text-xs"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={() => handleRemoveSkill(index)}
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
              onClick={handleAddSkill}
            >
              + Add Skill
            </Button>
          </div>
        ) : skill?.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {skill.map((s) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">No skills found</p>
        )}
      </Card>

      <div className="pt-1"></div>

      {editOpen && (
        <EditCandidateModal
          isOpen={editOpen}
          onOpenChange={setEditOpen}
          candidate={candidate}
          onSaveSuccess={() => setEditOpen(false)}
        />
      )}
      {jobOpen && (
        <AssignToJobModal
          open={jobOpen}
          onOpenChange={setJobOpen}
          candidateIds={[id]}
          onSuccess={() => {
            fetchCandidates();
            setJobOpen(false);
          }}
        />
      )}
    </div>
  );
}
