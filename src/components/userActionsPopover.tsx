import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import CandidateNotesPanel from "./CandidateNotesPanel";
import CallLogPanel from "./CallLogPanel";
import EditCandidateModal from "./modals/EditCandidateModal";

interface JobAssignment {
  job_id: number;
  status: string;
  job_title: string;
  hmapproval: string;
  recruiter_status: string;
}

interface CandidateForm {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  headline: string | null;
  address: string;
  experience: string;
  photo_url: string | null;
  education: string;
  summary: string | null;
  resume_url: string;
  cover_letter: string | null;
  rating: string | null;
  current_company: string | null;
  current_ctc: string | null;
  expected_ctc: string | null;
  skill: string[];
  created_at: string;
  updated_at: string;
  linkedinprofile: string;
  notice_period: string;
  institutiontier: string;
  companytier: string;
  jobs_assigned: JobAssignment[];
}

type CandidateActionsPopoverProps = {
    candidate:CandidateForm,
  fetchCandidates: () => void;
  children: React.ReactNode;
  candidateId: number;
};

export function UserActionsPopover({
    candidate,
  fetchCandidates,
  children,
  candidateId
}: CandidateActionsPopoverProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [callLogOpen, setCallLogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <div
            onMouseEnter={() => setPopoverOpen(true)}
            onMouseLeave={() => setPopoverOpen(false)}
          >
            {children}
          </div>
        </PopoverTrigger>

        <PopoverContent
          side="right"
          align="start"
          className="w-32 p-2"
          onMouseEnter={() => setPopoverOpen(true)}
          onMouseLeave={() => setPopoverOpen(false)}
        >
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              setPopoverOpen(false);
              setSheetOpen(true);
            }}
          >
            Notes
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              setPopoverOpen(false);
              setCallLogOpen(true);
            }}
          >
            Call Log
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              setPopoverOpen(false);
              setEditModalOpen(true);
            }}
          >
            Edit
          </Button>
        </PopoverContent>
      </Popover>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <CandidateNotesPanel candidateId={candidateId} authorId={1} />
        </SheetContent>
      </Sheet>
      <Sheet open={callLogOpen} onOpenChange={setCallLogOpen}>
        <SheetContent>
          <CallLogPanel candidateId={candidateId} />
        </SheetContent>
      </Sheet>
      {editModalOpen && (
        <EditCandidateModal
          isOpen={editModalOpen}
          onOpenChange={setEditModalOpen}
          candidate={candidate}
          onSaveSuccess={() => {
            fetchCandidates();
            setEditModalOpen(false);
          }}
        />
      )}
    </>
  );
}
