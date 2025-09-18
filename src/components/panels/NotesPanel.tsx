import { useState,useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Italic,
  Link2,
  ImageIcon,
  VideoIcon,
  ListOrdered,
  List,
  Mic,
} from "lucide-react";
interface NotesPanelProps {
  candidateId: number;
  authorId: number;
  refreshTrigger?: () => void;
}

  
export function NotesPanel({ candidateId,authorId }: NotesPanelProps) {
const [notesName, setNotesName] = useState("");
  const [template, setTemplate] = useState("default");
  const [saving, setSaving] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState<() => void>(() => () => {});
  const [templates, setTemplates] = useState<{ id: string; template_name: string,subject:string,body:string }[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const handleSave = async () => {
    if (!notesName.trim()) {
      toast.error("Please provide a note Description.");
      return;

    }
    setSaving(true);
    try {
      const payload = {
        candidate_id: candidateId,
        author_id: authorId,
        note: notesName,
      };
      const res = await axios.post(
        `http://16.171.117.2:3000/candidate/addCandidateNotes`,
        payload
      );
      if (res.data.status) {
        toast.success(res.data.message || "notes created successfully.");
        setNotesName("");
        refreshTrigger?.();
      } else {
        toast.error(res.data.message || "Failed to create notes.");
      }
    } catch (err: any) {
      console.error("Error creating notes", err);
      toast.error(
        err.response?.data?.message || err.message || "Server error."
      );
    } finally {
      setSaving(false);
    }
  };

   const fetchTemplates = async () => {
      try {
        const res = await fetch("http://16.171.117.2:3000/settings/getAllTemplates")
        const data = await res.json()
        const result=data.result;
        const emailTemplates = result.filter((tpl: any) => tpl.template_type === "notes")
        setTemplates(emailTemplates)
      } catch (error) {
        console.error("Failed to fetch templates:", error)
      }
    }

 useEffect(()=>{
fetchTemplates();
  },[])

  return (
    <div className="flex flex-col border rounded-lg bg-white shadow-sm mb-4">
      <div className="flex items-center space-x-2 px-4 py-2 border-b">
        <span className="text-2xl">✨</span>
        <span className="font-semibold">XBeeAI</span>
      </div>

      <div className="px-4 py-3 border-b">
        <textarea
          rows={4}
          value={notesName}
          placeholder="Enter notes here..."
          className="w-full resize-none border-none focus:outline-none text-gray-700 placeholder-gray-400"
          onChange={(e) => setNotesName(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 px-4 py-2 border-b">
        <div className="inline-flex items-center space-x-4 whitespace-nowrap">
          <Select onValueChange={() => {}}>
            <SelectTrigger className="w-auto text-sm">
              <SelectValue placeholder="Div" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="div">Div</SelectItem>
              <SelectItem value="p">Paragraph</SelectItem>
              <SelectItem value="h1">H1</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={() => {}}>
            <SelectTrigger className="w-auto text-sm">
              <SelectValue placeholder="13px" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12px">12px</SelectItem>
              <SelectItem value="13px">13px</SelectItem>
              <SelectItem value="14px">14px</SelectItem>
            </SelectContent>
          </Select>

          <Italic className="cursor-pointer" size={18} />

          <Select onValueChange={() => {}}>
            <SelectTrigger className="w-auto text-sm">
              <SelectValue placeholder="Arial" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="arial">Arial</SelectItem>
              <SelectItem value="times">Times New Roman</SelectItem>
              <SelectItem value="verdana">Verdana</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <button className="flex items-center space-x-1 text-sm">
              <span className="w-3 h-3 rounded-full bg-black border" />
              <span>▾</span>
            </button>
          </div>

          <Link2 className="cursor-pointer" size={18} />

          <VideoIcon className="cursor-pointer" size={18} />

          <ImageIcon className="cursor-pointer" size={18} />

          <ListOrdered className="cursor-pointer" size={18} />

          <List className="cursor-pointer" size={18} />

          <Mic className="cursor-pointer" size={18} />
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
               <Select value={selectedTemplate}  onValueChange={(value)=>{
setSelectedTemplate(value);
const tpl = templates.find((t) => String(t.id) === String(value));
 if (tpl) {
       const replacedBody = tpl.body?.replace(/{candidate}/g, '');
      setNotesName(replacedBody || "");
    }
        }}>
          <SelectTrigger className="w-auto text-sm">
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
              {templates.map((tpl) => (
            <SelectItem key={tpl.id} value={tpl.id}>
              {tpl.template_name}
            </SelectItem>
          ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleSave}
     
          className="bg-blue-500"
        >
          Post
        </Button>
      </div>
    </div>
  );
}
