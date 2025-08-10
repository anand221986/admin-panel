import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import UploadResume from "../panels/UploadResume";
import Uploadbulk from "../panels/Uploadbulk";
import LinkedinImPort from "../panels/LinkedinImport";
import { CandidateManual } from "../panels/CandidateManual";

interface AddCandidateModalProps {
  open: boolean;
  jobId: number;
  handleClose: () => void;
}

const AddCandidateModal = ({
  open,
  jobId,
  handleClose,
}: AddCandidateModalProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-5xl rounded-xl overflow-hidden p-0">
        <div className="max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">
              Add Candidate
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="mb-6 w-full flex justify-around">
              <TabsTrigger className="w-full" value="manual">
                Manual Entry
              </TabsTrigger>
              <TabsTrigger className="w-full" value="resume">
                Resume Upload
              </TabsTrigger>
              <TabsTrigger className="w-full" value="upload">
                Bulk Upload
              </TabsTrigger>
              <TabsTrigger className="w-full" value="linkedin">
                LinkedIn Import
              </TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <CandidateManual jobId={jobId} onClose={handleClose} />
            </TabsContent>
            <TabsContent value="resume">
              <UploadResume jobId={jobId} onClose={handleClose} />
            </TabsContent>
            <TabsContent value="upload">
              <Uploadbulk jobId={jobId} onClose={handleClose} />
            </TabsContent>
            <TabsContent value="linkedin">
              <LinkedinImPort jobId={jobId} onClose={handleClose} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCandidateModal;
