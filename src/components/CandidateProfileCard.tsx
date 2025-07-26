import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import StarRating from "./StarRating";
import { Badge } from "@/components/ui/badge";
import { BulkUpdateFieldsModal } from "./modals/BulkUpdateFieldsModal";
import AssignToJobModal from "./modals/AssigntoJobModal";

interface Job {
  id: number;
  title: string;
}

interface Education {
  degree: string;
  institution: string;
  duration?: string;
}

interface Experience {
  title: string;
  company: string;
  role: string;
  duration?: string;
  details?: string[];
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
  jobs: Job[];
}

interface ProfileCardProps {
  candidate: CandidateProfile;
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

export default function CandidateProfileCard({ candidate }: ProfileCardProps) {
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
    jobs = [],
  } = candidate;

  const [editOpen, setEditOpen] = useState(false);
  const [jobOpen, setJobOpen] = useState(false);
  const initials = [first_name?.[0], last_name?.[0]].filter(Boolean).join("");

  const parsedEducation: Education[] = parseJSON(education);
  const parsedExperience: Experience[] = parseJSON(experience);

  return (
    <div className="w-full p-3">
      <Card className="p-4 space-y-4 shadow-md">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            {photo_url ? (
              <img src={photo_url} alt={`${first_name} ${last_name}`} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <h2 className="font-semibold text-2xl">
              {first_name} {last_name}
            </h2>
            {headline && (
              <p className="text-sm text-gray-600 capitalize">
                {headline}
                {current_company && ` at ${current_company}`}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                Edit Candidate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-1 text-sm text-gray-700">
          {email && <p>Email: {email}</p>}
          {phone && <p>Phone: {phone}</p>}
          {linkedIn && (
            <p>
              LinkedIn:{" "}
              <a
                href={linkedIn}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline"
              >
                Profile
              </a>
            </p>
          )}
          {current_ctc && <p>Current CTC: {current_ctc}</p>}
          {expected_ctc && <p>Expected CTC: {expected_ctc}</p>}
        </div>

        <StarRating rating={Number(rating) || 0} />
        <Button variant="outline" size="sm">
          + Add tag
        </Button>
      </Card>

      <Card className="p-4 mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">JOBS</p>
          <Button variant="outline" size="sm" onClick={() => setJobOpen(true)}>
            + Add job
          </Button>
        </div>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <p key={job.id} className="text-sm text-slate-600">
              {job.title}
            </p>
          ))
        ) : (
          <p className="text-xs text-gray-400">No jobs found</p>
        )}
      </Card>

      <Card className="p-4 mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">EDUCATION</p>
          <Button variant="outline" size="sm">
            + Add Education
          </Button>
        </div>
        {parsedEducation.length > 0 ? (
          parsedEducation.map((edu, idx) => (
            <div key={idx}>
              <p className="text-sm font-medium text-gray-800">
                {edu.degree} - {edu.institution}
              </p>
              {edu.duration && (
                <p className="text-xs text-gray-600">{edu.duration}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400">No education found</p>
        )}
      </Card>

      <Card className="p-4 mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">EXPERIENCE</p>
          <Button variant="outline" size="sm">
            + Add experience
          </Button>
        </div>
        {parsedExperience.length > 0 ? (
          parsedExperience.map((exp, idx) => (
            <div key={idx}>
              <p className="text-sm font-medium text-gray-800">
                {exp.title} - {exp.company} - {exp.role}
              </p>
              {exp.duration && (
                <p className="text-xs text-gray-600">{exp.duration}</p>
              )}
              {exp.details?.length > 0 && (
                <ul className="list-disc pl-5 text-xs text-gray-700 mt-1 space-y-1">
                  {exp.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400">No experience found</p>
        )}
      </Card>

      <Card className="p-4 mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">SKILLS</p>
          <Button variant="outline" size="sm">
            + Add skill
          </Button>
        </div>
        {skill.length > 0 ? (
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

      {editOpen && (
        <BulkUpdateFieldsModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          selectedIds={[id]}
          onSuccess={() => {
            setEditOpen(false);
          }}
        />
      )}

      {jobOpen && (
        <AssignToJobModal
          open={jobOpen}
          onOpenChange={() => setJobOpen(false)}
          candidateIds={[id]}
          onSuccess={() => setJobOpen(false)}
        />
      )}
    </div>
  );
}
