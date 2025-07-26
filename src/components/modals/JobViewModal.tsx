import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import JobProfilePage from "../JobProfilePage";

export default function JobProfileModal({ open, onOpenChange, job }) {
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
          <DialogTitle>Job Profile</DialogTitle>
        </DialogHeader>

        <div
          className="
            flex-1 
            overflow-auto 
            scrollbar-custom
          "
        >
          <JobProfilePage job={job} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
