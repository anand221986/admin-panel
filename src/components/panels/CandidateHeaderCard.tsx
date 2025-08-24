import React from "react";
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
import StarRating from "../StarRating";
import { Badge } from "@/components/ui/badge";
import { SiWhatsapp } from "react-icons/si";

interface CandidateProfileForHeader {
  first_name: string;
  last_name: string;
  headline: string | null;
  photo_url: string | null;
  resume_url: string;
  rating: string | null;
  email: string;
  phone: string;
  linkedinprofile: string;
  current_company: string | null;
  current_ctc: string | null;
  expected_ctc: string | null;
  notice_period: string;
  institutiontier: string;
  companytier: string;
  summary: string;
}

interface CandidateHeaderCardProps {
  candidate: CandidateProfileForHeader;
  onEdit: () => void;
}

export default function CandidateHeaderCard({
  candidate,
  onEdit,
}: CandidateHeaderCardProps) {
  const {
    first_name,
    last_name,
    headline,
    photo_url,
    resume_url,
    rating,
    email,
    phone,
    linkedinprofile: linkedIn,
    current_company,
    current_ctc,
    expected_ctc,
    notice_period,
    institutiontier,
    companytier,
    summary,
  } = candidate;

  const initials = [first_name?.[0], last_name?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  const linkedInUrl =
    linkedIn && !linkedIn.startsWith("http") ? `https://${linkedIn}` : linkedIn;

  const FILE_SERVER_URL = "http://16.171.117.2";
  const fullResumeUrl = resume_url
    ? `${FILE_SERVER_URL}/ats-api/uploads/${resume_url}`
    : null;

  const cleanedPhone = phone ? phone.replace(/[^0-9+]/g, "") : "";

  return (
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
              {headline && <p className="text-md text-slate-800">{headline}</p>}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreVertical className="h-5 w-5 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  Edit Candidate
                </DropdownMenuItem>
                {fullResumeUrl && (
                  <DropdownMenuItem asChild>
                    <a
                      href={fullResumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resume
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
            <p className="flex items-center space-x-2">
              <strong className="font-medium text-slate-500">Phone:</strong>{" "}
              <span>{phone}</span>
              {cleanedPhone && (
                <a
                  href={`https://wa.me/${cleanedPhone}?text=Hello%20${
                    first_name + " " + last_name
                  },%20I%20am%20from%20XYZ%20Recruitment`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center text-gray-500 hover:text-green-600 transition-colors"
                  title="Chat on WhatsApp"
                >
                  <SiWhatsapp className="h-4 w-4 text-green-600" />
                </a>
              )}
            </p>
          )}

          {linkedInUrl && (
            <p>
              <strong className="font-medium text-slate-500">LinkedIn:</strong>{" "}
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
        <div className="flex flex-wrap gap-2 items-center pt-2">
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
  );
}
