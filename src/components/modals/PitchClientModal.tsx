import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const API_BASE_URL = "http://16.171.117.2:3000";

interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
}

interface Client {
  id: number;
  name: string;
}

type PitchClientModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCandidates: Candidate[];
  onSuccess: () => void;
};

export default function PitchClientModal({
  open,
  onOpenChange,
  selectedCandidates,
  onSuccess,
}: PitchClientModalProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [pitchMessage, setPitchMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  useEffect(() => {
    if (open) {
      const fetchClients = async () => {
        setIsLoadingClients(true);
        try {
          const response = await axios.get(
            `${API_BASE_URL}/client/getAllClient`
          );
          if (response.data && Array.isArray(response.data.result)) {
            setClients(response.data.result);
          }
        } catch (error) {
          toast.error("Failed to fetch clients.");
          console.error(error);
        } finally {
          setIsLoadingClients(false);
        }
      };
      fetchClients();
    }
  }, [open]);

  useEffect(() => {
    if (selectedCandidates.length > 0 && clients.length > 0) {
      const clientName =
        clients.find((c) => c.id.toString() === selectedClientId)?.name ||
        "[Client Name]";
      const candidateList = selectedCandidates
        .map((c) => `- ${c.first_name} ${c.last_name}`)
        .join("\n");

      const defaultMessage = `Dear ${clientName},\n\nThese candidates are shortlisted for the Assistant Manager role. Please find the profiles of the following candidates for your review:\n\n${candidateList}\n\nLooking forward to your feedback.`;
      setPitchMessage(defaultMessage);
    }
  }, [selectedCandidates, selectedClientId, clients]);

  useEffect(() => {
    if (!open) {
      setSelectedClientId("");
      setPitchMessage("");
      setIsSending(false);
    }
  }, [open]);

  const handleSendPitch = async () => {
    if (!selectedClientId) {
      toast.warning("Please select a client.");
      return;
    }
    setIsSending(true);
    try {
      await axios.post(`${API_BASE_URL}/client/createPitch`, {
        client_id: parseInt(selectedClientId, 10),
        candidate_ids: selectedCandidates.map((c) => c.id),
        message: pitchMessage,
      });

      toast.success("Pitch sent successfully!");
      onSuccess();
    } catch (error) {
      toast.error("Failed to send pitch. Please try again.");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[80vw] max-h-[80vh] overflow-auto rounded-lg">
        <DialogHeader>
          <DialogTitle>Pitch Candidates to Client</DialogTitle>
          <DialogDescription>
            Select a client and review the message before sending the pitch.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Select
              value={selectedClientId}
              onValueChange={setSelectedClientId}
              disabled={isLoadingClients}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingClients ? "Loading clients..." : "Select a client"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Selected Candidates ({selectedCandidates.length})</Label>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto rounded-md border p-2 bg-slate-50">
              {selectedCandidates.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-2 bg-white p-1 px-2 rounded-full border"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-xs">
                      {c.first_name?.[0]}
                      {c.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">
                    {c.first_name} {c.last_name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Pitch Message</Label>
            <Textarea
              id="message"
              value={pitchMessage}
              onChange={(e) => setPitchMessage(e.target.value)}
              rows={10}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSendPitch}
            disabled={isSending}
            className="bg-blue-500"
          >
            {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Pitch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
