import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, parseISO } from "date-fns";
import { FileText, Download } from "lucide-react";

export interface FileItem {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  uploaderAvatarUrl?: string;
}

interface FilesPanelProps {
  files?: FileItem[];
}

const sampleFiles: FileItem[] = [
  {
    id: "f1",
    name: "Resume.pdf",
    url: "#",
    uploadedAt: "2025-06-20T09:00:00Z",
    uploadedBy: "Alice",
  },
  {
    id: "f2",
    name: "Portfolio.zip",
    url: "#",
    uploadedAt: "2025-06-21T14:30:00Z",
    uploadedBy: "Bob",
  },
  {
    id: "f3",
    name: "Certificate.png",
    url: "#",
    uploadedAt: "2025-06-22T11:15:00Z",
    uploadedBy: "Carol",
  },
  {
    id: "f4",
    name: "Project_Report.docx",
    url: "#",
    uploadedAt: "2025-06-23T16:45:00Z",
    uploadedBy: "Dave",
  },
  {
    id: "f5",
    name: "Presentation.pptx",
    url: "#",
    uploadedAt: "2025-06-24T08:20:00Z",
    uploadedBy: "Eve",
  },
];

export function FilesPanel({ files }: FilesPanelProps) {
  const fileList = files && files.length ? files : sampleFiles;

  return (
    <ScrollArea className="h-[400px] p-2">
      {fileList.map((f) => (
        <div
          key={f.id}
          className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-4"
        >
          <div className="flex items-center space-x-4">
            <FileText className="w-6 h-6 text-gray-600" />
            <a
              href={f.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-blue-600 hover:underline"
            >
              {f.name}
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Avatar className="w-5 h-5">
                {f.uploaderAvatarUrl ? (
                  <AvatarImage src={f.uploaderAvatarUrl} alt={f.uploadedBy} />
                ) : (
                  <AvatarFallback>
                    {f.uploadedBy ? f.uploadedBy[0] : "?"}
                  </AvatarFallback>
                )}
              </Avatar>
              <span>{f.uploadedBy}</span>
            </div>
            <span className="text-sm text-gray-500">
              {format(parseISO(f.uploadedAt), "dd MMM, yyyy")}
            </span>
            <a
              href={f.url}
              download
              className="text-gray-600 hover:text-gray-800"
            >
              <Download className="w-5 h-5" />
            </a>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
}
