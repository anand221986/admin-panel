import { useState, useMemo, FormEvent, ChangeEvent } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Download, FileSpreadsheet } from "lucide-react";

const API_BASE_URL = "http://16.171.117.2:3000";

export interface CandidateForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  linkedin: string;
  headline: string;
  status: string;
  address: string;
  experience: string;
  photo_url: string;
  education: string;
  summary: string;
  resume_url: string;
  cover_letter: string;
  rating: string;
  hmapproval: string;
  recruiter_status: string;
  current_company: string;
  current_ctc: string;
  expected_ctc: string;
  skill: string[];
  college: string;
  degree: string;
  currency: string;
}

const TEMPLATE_HEADERS: (keyof CandidateForm)[] = [
  "first_name",
  "last_name",
  "email",
  "phone",
  "linkedin",
  "headline",
  "status",
  "address",
  "experience",
  "photo_url",
  "education",
  "summary",
  "resume_url",
  "cover_letter",
  "rating",
  "hmapproval",
  "recruiter_status",
  "current_company",
  "current_ctc",
  "expected_ctc",
  "skill",
  "college",
  "degree",
  "currency",
];

interface UploadbulkProps {
  jobId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function Uploadbulk({
  jobId,
  onClose,
  onSuccess,
}: UploadbulkProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [fileError, setFileError] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const resetForm = () => {
    setSelectedFiles([]);
    setParsedRows([]);
    setFileError("");
    setProgress(0);
  };

  const downloadCsvTemplate = () => {
    const headerRow = TEMPLATE_HEADERS.join(",");
    const emptyRow = TEMPLATE_HEADERS.map(() => "").join(",");
    const csvContent = [headerRow, emptyRow].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "candidates_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadExcelTemplate = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [TEMPLATE_HEADERS, TEMPLATE_HEADERS.map(() => "")];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "candidates_template.xlsx");
  };

  const headers = useMemo(() => {
    const allKeys = new Set<string>();
    parsedRows.forEach((row) => {
      Object.keys(row).forEach((key) => allKeys.add(key));
    });
    return Array.from(allKeys);
  }, [parsedRows]);

  const removeRow = (index: number) => {
    setParsedRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    let allRows: any[] = [];
    let filesProcessed = 0;

    files.forEach((file) => {
      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (!validTypes.includes(file.type)) {
        setFileError(`Unsupported file type: ${file.name}`);
        return;
      }

      if (file.type === "text/csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (res) => {
            allRows = allRows.concat(res.data);
            filesProcessed++;
            if (filesProcessed === files.length) {
              setParsedRows(allRows);
            }
          },
        });
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const data = new Uint8Array(reader.result as ArrayBuffer);
          const wb = XLSX.read(data, { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          allRows = allRows.concat(XLSX.utils.sheet_to_json(ws));
          filesProcessed++;
          if (filesProcessed === files.length) {
            setParsedRows(allRows);
          }
        };
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const handleUploadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!parsedRows.length) {
      setFileError("No data to upload.");
      return;
    }
    setUploading(true);
    setProgress(0);

    const payload = parsedRows.map((row) => ({
      ...row,
      job_id: jobId,
    }));

    try {
      await axios.post(
        `${API_BASE_URL}/candidate/createCandidatesBulk`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          onUploadProgress: (evt) => {
            if (evt.total) {
              setProgress(Math.round((evt.loaded / evt.total) * 100));
            }
          },
        }
      );
      toast.success("Candidates uploaded successfully!");
      resetForm();
      onSuccess();
    } catch (err) {
      toast.error("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex w-full gap-2 mb-4">
        <Button
          className="flex-1 gap-2"
          type="button"
          variant="outline"
          onClick={downloadCsvTemplate}
        >
          <Download size={16} />
          Download CSV Template
        </Button>
        <Button
          className="flex-1 gap-2"
          type="button"
          variant="outline"
          onClick={downloadExcelTemplate}
        >
          <FileSpreadsheet size={16} />
          Download Excel Template
        </Button>
      </div>

      <form onSubmit={handleUploadSubmit}>
        <Input
          type="file"
          multiple
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          aria-label="Upload CSV or Excel file"
          disabled={uploading}
        />
        {fileError && <p className="text-red-500 mt-2">{fileError}</p>}

        {parsedRows.length > 0 && (
          <p className="text-sm italic text-gray-600 mt-4">
            ⚠️ These rows are only in preview. Click “Upload” to save.
          </p>
        )}

        {parsedRows.length > 0 && (
          <div className="max-h-96 overflow-auto mt-2 border rounded-md">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-xs font-semibold uppercase text-center w-20">
                    Remove
                  </th>
                  {headers.map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left text-xs font-semibold uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parsedRows.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRow(i)}
                        aria-label={`Remove row ${i + 1}`}
                      >
                        ×
                      </Button>
                    </td>
                    {headers.map((key, j) => (
                      <td
                        key={`${i}-${j}`}
                        className="px-4 py-2 whitespace-nowrap text-sm"
                      >
                        {row[key] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {uploading && (
          <div className="w-full mt-4">
            <progress
              value={progress}
              max={100}
              className="w-full"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
            <p className="text-center text-sm">{progress}%</p>
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={uploading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={uploading || !parsedRows.length}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            {uploading ? `Uploading...` : "Upload"}
          </Button>
        </div>
      </form>
    </div>
  );
}

