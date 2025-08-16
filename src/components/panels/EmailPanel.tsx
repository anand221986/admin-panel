import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import axios from "axios";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  ChevronDown,
  Trash2,
  Link as LinkIcon,
  Image as ImageIcon,
  List as ListIcon,
  ListOrdered,
  Paperclip,
  Mic,
  Italic,
  Underline,
  Highlighter,
} from "lucide-react";
import { toast } from "sonner";

export interface Person {
  candidateId: number;
  candidateName: string;
}

interface EmailPanelProps {
  candidate: Person;
  refreshTrigger?: () => void;
}

export function EmailPanel({ candidate }: EmailPanelProps) {
  const toRecipients = [candidate.candidateName];
   const [emailSubject, setEmailSubject] = useState("");
   const [emailContent, setEmailContent] = useState("");
    const [saving, setSaving] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState<() => void>(() => () => { });
   const handleSave = async () => {
    if (!emailSubject.trim()) {
      toast.error("Please enter email subject line.");
      return;

    }
    if (!emailContent.trim()) {
      toast.error("Please provide email Description.");
      return;

    }
   setSaving(true);
    try {
      const payload = {
        candidate_id: candidate.candidateId,
        emailSubject: emailSubject,
        emailDescription: emailContent,
        author_id: 1
      };
      const res = await axios.post(
        `http://13.51.235.31:3000/candidate/sendCandidateEmail`,
        payload
      );
      if (res.data.status) {
        toast.success(res.data.message || "email Send successfully.");
         refreshTrigger?.();
      } else {
        toast.error(res.data.message || "Failed to send email.");
      }
    } catch (err: any) {
      console.error("Error sending email", err);
      toast.error(
        err.response?.data?.message || err.message || "Server error."
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow mb-4">
            <div className="flex items-center space-x-2">
        <span className="font-normal">From</span>
        <div className="flex-1 flex items-center flex-wrap gap-2 bg-gray-50 p-2 rounded-lg">Recruiter1@a1selectors.com
        </div>
      </div>


      <div className="flex items-center space-x-2">
        <span className="font-normal">To</span>
        <div className="flex-1 flex items-center flex-wrap gap-2 bg-gray-50 p-2 rounded-lg">
          {toRecipients.map((n) => (
            <span
              key={n}
              className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              {n}
              {/* <span className="ml-1 cursor-pointer">×</span> */}
            </span>
          ))}
          {/* <button className="text-sm text-gray-400">+ add more</button> */}
        </div>
        {/* <button className="text-sm text-gray-600">CC</button>
        <button className="text-sm text-gray-600">BCC</button> */}
      </div>

      <div className="flex items-center justify-between">
        <Input className="flex-1 mr-4" placeholder="Subject" value={emailSubject}  onChange={(e) => {
          setEmailSubject(e.target.value)
        }} />
        <Select defaultValue="">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="temp1">Template 1</SelectItem>
            <SelectItem value="temp2">Template 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Textarea placeholder="Compose your email..." rows={6}  value={emailContent}  onChange={(e) => {
          setEmailContent(e.target.value)
        }
        } />

      <div className="flex items-center space-x-3 border-t border-b border-gray-200 py-2 text-gray-600">
        <Select defaultValue="div">
          <SelectTrigger className="w-20">
            <SelectValue>Div</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="div">Div</SelectItem>
            <SelectItem value="p">Paragraph</SelectItem>
            <SelectItem value="h1">H1</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="13px">
          <SelectTrigger className="w-20">
            <SelectValue>13px</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12px">12px</SelectItem>
            <SelectItem value="13px">13px</SelectItem>
            <SelectItem value="14px">14px</SelectItem>
          </SelectContent>
        </Select>

        <Italic size={16} />
        <Underline size={16} />

        <Select defaultValue="Arial">
          <SelectTrigger className="w-20">
            <SelectValue>Arial</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Roboto">Roboto</SelectItem>
          </SelectContent>
        </Select>

        <Highlighter size={16} />

        <LinkIcon size={16} />
        <ImageIcon size={16} />
        <ListIcon size={16} />
        <ListOrdered size={16} />
        <Paperclip size={16} />
        <Mic size={16} />
      </div>

      <div className="flex items-center space-x-4">
        <Button className="bg-blue-600 text-white"   onClick={handleSave}>
          Send
          <ChevronDown />
        </Button>
        <Button variant="ghost" size="icon">
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
