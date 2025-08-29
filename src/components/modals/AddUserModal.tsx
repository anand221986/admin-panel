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
import { UserManual } from "../panels/UserManual";

interface AddCandidateModalProps {
  open: boolean;
  handleClose: () => void;
}

const AddCandidateModal = ({ open, handleClose }: AddCandidateModalProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-5xl rounded-xl overflow-hidden p-0">
        <div className="max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">
              Add User
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="manual" className="w-full">
            {/* <TabsList className="mb-6 w-full flex justify-around">
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
            </TabsList> */}
            <TabsContent value="manual">
              <UserManual />
            </TabsContent>
            {/* <TabsContent value="resume">
              <UploadResume />
            </TabsContent>
            <TabsContent value="upload">
              <Uploadbulk />
            </TabsContent>
            <TabsContent value="linkedin">
              <LinkedinImPort />
            </TabsContent> */}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCandidateModal;
