import { useState, useRef } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CandidateNotesPanel from "./CandidateNotesPanel";
import CallLogPanel from "./CallLogPanel";

type CandidateActionsPopoverProps = {
  candidateId: number;
  children: React.ReactNode;
};

export function CandidateActionsPopover({
  candidateId,
  children,
}: CandidateActionsPopoverProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [callLogOpen, setCallLogOpen] = useState(false);

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
    </>
  );
}
