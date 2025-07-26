import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";

const API_BASE_URL = "http://51.20.181.155:3000";

export default function UploadResume() {
  const [progress, setProgress] = useState(0);
  const [resumeupload, setResumeUpload] = useState(false);
  const [resumeFiles, setResumeFiles] = useState<FileList | null>(null);
  const [resumeError, setResumeError] = useState<string>("");
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeError("");
    const files = e.target.files;
    if (!files?.length) return;

    const allowed = [".pdf", ".doc", ".docx"];
    const invalid = Array.from(files).find((file) => {
      const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      return !allowed.includes(ext);
    });

    if (invalid) {
      setResumeError("Only PDF, DOC and DOCX files are allowed.");
      e.target.value = "";
      return;
    }

    setResumeFiles(files);
  };

  const handleResumeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFiles) {
      setResumeError("Please choose at least one file to upload.");
      return;
    }

    const formData = new FormData();
    Array.from(resumeFiles).forEach((file) => {
      formData.append("resumes", file);
    });

    try {
      setResumeUpload(true);
      setProgress(0);
      await axios.post(`${API_BASE_URL}/candidate/uploadPdf`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          const pct = Math.round((evt.loaded * 100) / (evt.total || 1));
          setProgress(pct);
        },
      });
      toast.success("Files Uploaded!");
      resetForm();
      setProgress(100);
    } catch (err: any) {
      console.error(err);
      toast.error("Upload Failed!");
      setResumeError(err.response?.data?.message || "Upload failed.");
    } finally {
      setResumeUpload(false);
    }
  };

  const resetForm = () => {
    setResumeFiles(null);
    setResumeError("");
    setProgress(0);
    setPreviewFile(null);
  };

  return (
    <>
      <form onSubmit={handleResumeSubmit}>
        <Input
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={handleResumeChange}
          aria-label="Upload PDF or Word document"
        />
        {resumeError && <p className="text-red-500 mt-2">{resumeError}</p>}

        {resumeFiles && (
          <div className="mt-4 space-y-2">
            {Array.from(resumeFiles).map((file, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border rounded p-2"
              >
                <span>{file.name}</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setPreviewFile(file)}
                    >
                      Preview
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Preview: {file.name}</DialogTitle>
                    </DialogHeader>

                    {file.name.endsWith(".pdf") ? (
                      <iframe
                        src={URL.createObjectURL(file)}
                        className="w-full h-96 border"
                        title="PDF Preview"
                      />
                    ) : (
                      <div className="mt-4">
                        <p className="mb-2">
                          Preview for DOC/DOCX is not supported in-browser.
                        </p>
                        <a
                          href={URL.createObjectURL(file)}
                          download={file.name}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Download File
                        </a>
                      </div>
                    )}

                    <DialogClose asChild>
                      <Button className="mt-4">Close</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={resumeupload}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={resumeupload || !resumeFiles}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            {resumeupload ? `Uploading ${progress}%` : "Upload"}
          </Button>
        </div>
      </form>
      {resumeupload && (
        <div className="absolute inset-0 bg-white bg-opacity-100 flex flex-col items-center justify-center z-50">
          <img
            src="/data-processing.svg"
            alt="Processing document"
            className="h-32 w-32 mb-4"
          />

          <h3 className="mb-4 text-lg font-medium text-gray-700">
            AI is extracting your data...
          </h3>

          <div className="w-2/3">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-center font-medium text-gray-600">
              {progress}%
            </p>
          </div>
        </div>
      )}
    </>
  );
}
