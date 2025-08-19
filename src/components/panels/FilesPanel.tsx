import { ScrollArea } from "@/components/ui/scroll-area";
import { format, parseISO } from "date-fns";
import { FileText, Download, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ResumeFile {
  id: number;
  candidate_id: number;
  resume_url: string;
  uploaded_at: string;
  uploaded_by: string;
  is_current?: boolean;
}

interface FilesPanelProps {
  candidateId: number;
}

const API_BASE_URL = "http://16.171.117.2:3000";
const FILE_SERVER_URL = "http://13.51.235.31";

export function FilesPanel({ candidateId }: FilesPanelProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewTitle, setPreviewTitle] = useState<string>("");

  const fetchResumes = useCallback(async () => {
    if (!candidateId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/candidate/candidateResumes/${candidateId}`
      );
      if (res.data.status) {
        setResumes(res.data.result || []);
      } else {
        toast.error(res.data.message || "Failed to load files.");
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setResumes([]);
      } else {
        console.error("Error fetching resumes", err);
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Server error while fetching files."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [candidateId]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleDownload = async (
    fileUrl: string,
    filename: string,
    fileId: number
  ) => {
    setDownloadingId(fileId);
    try {
      const response = await axios.get(fileUrl, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Resume downloaded successfully!");
    } catch (error) {
      console.error("Download failed", error);
      toast.error("Failed to download resume.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePreview = (url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
    setIsPreviewOpen(true);
  };

  return (
    <>
      <ScrollArea className="h-[400px] p-2">
        {loading && (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        )}
        {!loading && resumes.length === 0 && (
          <div className="flex justify-center items-center h-full text-gray-500">
            No resumes uploaded yet.
          </div>
        )}
        {!loading &&
          resumes.map((resume) => {
            const fileUrl = `${FILE_SERVER_URL}/ats-api/uploads/${resume.resume_url}`;
            const isDownloading = downloadingId === resume.id;

            return (
              <div
                key={resume.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-4"
              >
                <div className="flex items-center space-x-4">
                  <FileText className="w-6 h-6 text-gray-600" />
                  <button
                    onClick={() => handlePreview(fileUrl, resume.resume_url)}
                    className="font-medium text-blue-600 hover:underline break-all text-left"
                  >
                    {resume.resume_url}
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {resume.uploaded_at
                      ? format(parseISO(resume.uploaded_at), "dd MMM, yyyy")
                      : "N/A"}
                  </span>

                  <button
                    onClick={() =>
                      handleDownload(fileUrl, resume.resume_url, resume.id)
                    }
                    disabled={isDownloading}
                    className="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                    title="Download Resume"
                  >
                    {isDownloading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
      </ScrollArea>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="truncate">{previewTitle}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 px-6 pb-6">
            <iframe
              src={previewUrl}
              title="Resume Preview"
              className="w-full h-full border rounded-md"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
