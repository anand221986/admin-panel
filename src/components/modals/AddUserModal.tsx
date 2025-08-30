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
interface CandidateForm {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  role: string;
  agency:string;
}

interface AddCandidateModalProps {
  open: boolean;
  handleClose: () => void;
   candidate?: CandidateForm | null;   // <-- accept candidate
  fetchCandidates: () => void; 
}

const AddCandidateModal = ({ open, handleClose,candidate, fetchCandidates }: AddCandidateModalProps) => {
   const isEditMode = !!candidate;
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-5xl rounded-xl overflow-hidden p-0">
        <div className="max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">
              {isEditMode ? "Edit User" : "Add User"}
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
               <UserManual
                candidate={candidate}        // pass candidate to form
                fetchCandidates={fetchCandidates}
                onClose={handleClose}
              />
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
