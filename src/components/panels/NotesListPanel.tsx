import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, parseISO } from "date-fns";
import { FileText, Download } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
export interface FileItem {
  id: string;
  candidate_id: string;
  note: string;
  created_at: string;
  uploadedBy: string;
  is_current?: boolean;
  uploaderAvatarUrl?: string; 
}

interface FilesPanelProps {
  files?: FileItem[];
  candidateId: number;
  authorId: number;
  refreshTrigger?: boolean;
}

const API_BASE = "http://16.171.117.2:3000";

export function NotesListPanel({ files, candidateId }: FilesPanelProps) {
  const sampleFiles: FileItem[] = []; // optional fallback if needed
  const fileList = files && files.length ? files : sampleFiles;

  const [loading, setLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<FileItem[]>([]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/candidate/notes/${candidateId}`);
      if (res.data.status) {
        setTasks(res.data.result);
      } else {
        toast.error(res.data.message || "Failed to load files.");
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setTasks([]);
      } else {
        console.error("Error fetching tasks", err);
        toast.error(err.response?.data?.message || err.message || "Server error while fetching files.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [candidateId]);

  return (
    <ScrollArea className="h-[400px] p-2">
         {loading ? (
          <div>Loading tasks...</div>
        ) : tasks.length > 0 ? (
      tasks.map((f) => (
        <div
          key={f.id}
          className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-4"
        >
          {/* <div className="flex items-center space-x-4">
            <FileText className="w-6 h-6 text-gray-600" />
            <a
              href={f.resume_url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-blue-600 hover:underline break-all"
            >
              {f.resume_url}
            </a>
          </div> */}

           <div className="space-y-1">
            <p className="font-medium text-gray-800">{f.note}</p>
            {/* <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Reviewer:</span>
              <Badge variant="outline">{f.note}</Badge>
            </div> */}
          </div>
          <div className="flex items-center space-x-4">
            {/* Uncomment and modify if you have avatar data */}
            {/* <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Avatar className="w-5 h-5">
                {f.uploaderAvatarUrl ? (
                  <AvatarImage src={f.uploaderAvatarUrl} alt={f.uploadedBy} />
                ) : (
                  <AvatarFallback>{f.uploadedBy?.[0] ?? "?"}</AvatarFallback>
                )}
              </Avatar>
              <span>{f.uploadedBy}</span>
            </div> */}
            <span className="text-sm text-gray-500">
        {f.created_at ? format(parseISO(f.created_at), "dd MMM, yyyy") : "N/A"}
            </span>
            {/* <a
              href={`http://51.20.181.155/ats-api/uploads/f.resume_url`}
              download
              className="text-gray-600 hover:text-gray-800"
              target="blank"
            >
              <Download className="w-5 h-5" />
            </a> */}
          </div>
        </div>
      ))  ) : (
          <div className="text-center text-gray-500">No tasks available.</div>
        )}
    </ScrollArea>



  );
}
