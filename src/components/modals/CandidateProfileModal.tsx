import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CandidateProfilePage from "../CandidateProfilePage";

export default function CandidateProfileModal({
  open,
  onOpenChange,
  candidate,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-screen 
          h-screen 
          max-w-none 
          max-h-none 
          bg-gray-50 
          p-0 
          shadow-none 
          rounded-none 
          flex 
          flex-col 
          overflow-hidden
        "
      >
        <DialogHeader className="border-b px-4 py-4 bg-gray-100">
          <DialogTitle>Candidate Profile</DialogTitle>
        </DialogHeader>

        <div
          className="
            flex-1 
            overflow-auto 
            scrollbar-custom
          "
        >
          <CandidateProfilePage candidate={candidate} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
