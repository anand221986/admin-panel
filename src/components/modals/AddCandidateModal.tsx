import { useState, useEffect, useMemo, FormEvent, ChangeEvent } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";

interface CandidateForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  linkedin: string;
  photo_url: string;
  resume_url: string;
  cover_letter: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  skills: string[];
  experience: string;
  education: string;
  summary: string;
  currency: string;
  compensation: number;
}

interface AddCandidateModalProps {
  open: boolean;
  handleClose: () => void;
}

type CandidateFormKey = keyof CandidateForm;

const initialCandidateForm: CandidateForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  linkedin: "",
  photo_url: "",
  resume_url: "",
  cover_letter: "",
  street1: "",
  street2: "",
  city: "",
  state: "",
  country: "",
  zipcode: "",
  skills: [],
  experience: "",
  education: "",
  summary: "",
  currency: "",
  compensation: 0,
};

const AddCandidateModal = ({ open, handleClose }: AddCandidateModalProps) => {
  const [formData, setFormData] = useState<CandidateForm>(initialCandidateForm);
  const [tagInput, setTagInput] = useState<string>("");
  const [errors, setErrors] = useState<
    Partial<Record<CandidateFormKey, string>>
  >({});
  const [loading, setLoading] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [fileError, setFileError] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const currencyOptions = useMemo(
    () => [
      "USD",
      "EUR",
      "INR",
      "GBP",
      "AUD",
      "CAD",
      "JPY",
      "CNY",
      "SGD",
      "CHF",
    ],
    []
  );

  useEffect(() => {
    if (open) {
      setFormData(initialCandidateForm);
      setErrors({});
      setTagInput("");
      setSelectedFiles([]);
      setParsedRows([]);
      setFileError("");
      setProgress(0);
    }
  }, [open]);

  const handleChange = (field: CandidateFormKey, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (tagInput && !formData.skills.includes(tagInput)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, tagInput],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((t) => t !== tag),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name) newErrors.first_name = "First Name is Required";
    if (!formData.email) newErrors.email = "Last Name is Required";
    if (!formData.phone) newErrors.phone = "Contact Number is Required";
    if (!formData.resume_url) newErrors.resume_url = "Resume Url is Required";
    if (!formData.education)
      newErrors.education = "Education details are Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please enter required fields.");
      return;
    }
    setLoading(true);
    try {
      console.log(formData);
      await axios.post("/api/candidate/createCandidate", formData);
      toast.success("Candidate added successfully");
      handleClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Error adding candidate");
      } else {
        toast.error("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    let allRows: any[] = [];
    let filesProcessed = 0;

    files.forEach((file) => {
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

  const handleUploadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!parsedRows.length) {
      setFileError("No data to upload");
      return;
    }
    setUploading(true);
    try {
      console.log(parsedRows);
      await axios.post("/api/candidate/bulkUpload", parsedRows, {
        headers: { "Content-Type": "application/json" },
        onUploadProgress: (evt) => {
          setProgress(Math.round((evt.loaded / evt.total!) * 100));
        },
      });
      toast.success("Upload successful");
      handleClose();
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-5xl rounded-xl overflow-hidden p-0">
        <div className="max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">
              Add Candidate
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="upload">Upload File</TabsTrigger>
            </TabsList>

            <TabsContent value="manual">
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {[
                  {
                    key: "first_name",
                    label: "First Name",
                    placeholder: "e.g. John",
                  },
                  {
                    key: "last_name",
                    label: "Last Name",
                    placeholder: "e.g. Doe",
                  },
                  {
                    key: "email",
                    label: "Email",
                    placeholder: "you@example.com",
                  },
                  {
                    key: "phone",
                    label: "Contact Number",
                    placeholder: "+1 (555) 555‑5555",
                  },
                  {
                    key: "linkedin",
                    label: "LinkedIn",
                    placeholder: "linkedin.com/in/your‑name",
                  },
                  {
                    key: "photo_url",
                    label: "Profile Photo",
                    placeholder: "Image URL (jpg/png/etc.)",
                  },
                  {
                    key: "resume_url",
                    label: "Resume",
                    placeholder: "PDF or DOC link",
                  },
                  {
                    key: "headline",
                    label: "Headline",
                    placeholder: "Paste text or link",
                  },
                  {
                    key: "street1",
                    label: "Street Address 1",
                    placeholder: "123 Main St",
                  },
                  {
                    key: "street2",
                    label: "Street Address 2",
                    placeholder: "Suite, Apt, etc. (opt.)",
                  },
                  { key: "city", label: "City", placeholder: "City name" },
                  {
                    key: "state",
                    label: "State",
                    placeholder: "State/Province",
                  },
                  {
                    key: "country",
                    label: "Country",
                    placeholder: "Country name",
                  },
                  {
                    key: "zipcode",
                    label: "Zipcode",
                    placeholder: "Postal code",
                  },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="text-sm" htmlFor={key}>
                      {label}
                    </label>
                    <Input
                      id={key}
                      value={formData[key] as string}
                      placeholder={placeholder}
                      aria-invalid={!!errors[key]}
                      onChange={(e) =>
                        handleChange(key as keyof CandidateForm, e.target.value)
                      }
                    />
                    {errors[key as keyof CandidateForm] && (
                      <p className="text-sm text-red-500">
                        {errors[key as keyof CandidateForm]}
                      </p>
                    )}
                  </div>
                ))}

                <div className="md:col-span-2">
                  <label className="text-sm">Skills</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      disabled={!tagInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {formData.skills.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-200 rounded text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-red-500"
                          aria-label={`Remove skill ${tag}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {[
                  {
                    key: "experience",
                    label: "Experience",
                    placeholder: "Enter Company name, title, date...",
                  },
                  {
                    key: "education",
                    label: "Education",
                    placeholder:
                      "Enter school name, degree, specialization, date...",
                  },
                  {
                    key: "cover_letter",
                    label: "Cover Letter",
                    placeholder: "Your cover letter text/url",
                  },
                  {
                    key: "summary",
                    label: "Summary",
                    placeholder: "More about yourself...",
                  },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="md:col-span-2">
                    <label className="text-sm mb-1 capitalize">{label}</label>
                    <Textarea
                      value={formData[key]}
                      placeholder={placeholder}
                      onChange={(e) =>
                        handleChange(key as keyof CandidateForm, e.target.value)
                      }
                      className="resize-y"
                      aria-invalid={!!errors[key]}
                    />
                  </div>
                ))}

                <div className="md:col-span-2 flex gap-4">
                  <div className="w-1/5">
                    <label className="text-sm">Currency</label>
                    <Select
                      value={formData.currency}
                      onValueChange={(val) => handleChange("currency", val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        <SelectScrollUpButton />
                        {currencyOptions.map((curr) => (
                          <SelectItem key={curr} value={curr}>
                            {curr}
                          </SelectItem>
                        ))}
                        <SelectScrollDownButton />
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-4/5">
                    <label className="text-sm">Compensation</label>
                    <Input
                      type="number"
                      value={formData.compensation}
                      onChange={(e) =>
                        handleChange("compensation", Number(e.target.value))
                      }
                    />
                  </div>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      disabled={uploading}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {loading ? "Adding..." : "Add Candidate"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="upload">
              <form onSubmit={handleUploadSubmit}>
                <Input
                  type="file"
                  multiple
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                />
                {fileError && <p className="text-red-500">{fileError}</p>}

                {parsedRows.length > 0 && (
                  <div className="max-h-96 overflow-auto mt-4">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-red-700 uppercase tracking-wider">
                            Remove
                          </th>
                          {headers.map((h) => (
                            <th
                              key={h}
                              className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {parsedRows.map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-red-800">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeRow(i);
                                }}
                              >
                                &times;
                              </Button>
                            </td>
                            {headers.map((key, j) => (
                              <td
                                key={`${i}-${j}`}
                                className="px-4 py-2 whitespace-nowrap text-sm text-gray-800"
                              >
                                {row[key] !== undefined && row[key] !== null
                                  ? String(row[key])
                                  : ""}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {uploading && (
                  <progress
                    value={progress}
                    max={100}
                    className="w-full mt-4"
                  />
                )}

                <div className="mt-4 flex justify-end">
                  <DialogClose asChild>
                    <Button variant="outline" disabled={uploading}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={uploading || !parsedRows.length}
                    className="ml-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {uploading ? `Uploading ${progress}%` : "Upload"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCandidateModal;
