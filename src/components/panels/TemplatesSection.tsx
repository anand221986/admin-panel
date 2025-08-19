import React, { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronDown,
  ChevronRight,
  Bold,
  Italic,
  Underline,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Paperclip,
  Type,
} from "lucide-react";

interface Template {
  id?: number;
  templateName: string;
  templateType: string;
  subject?: string;
  body: string;
  shareWithEveryone: boolean;
  type: "email" | "sms" | "notes" | "aira";
}

interface APITemplate {
  id: number;
  template_name: string;
  template_type: string;
  subject?: string;
  body: string;
  share_with_everyone?: boolean;
  created_at: string;
}

interface APIResponse {
  status: boolean;
  message: string;
  result?: APITemplate[];
}

const TemplatesManager: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<{
    isEditing: boolean;
    templateId?: number;
  }>({ isEditing: false });
  const [templateToEdit, setTemplateToEdit] = useState<Template | null>(null);

  const [expandedSections, setExpandedSections] = useState({
    email: true,
    sms: true,
    notes: true,
    aira: true,
  });

  const [dialogs, setDialogs] = useState({
    email: false,
    sms: false,
    notes: false,
    aira: false,
  });

  const [formData, setFormData] = useState({
    templateName: "",
    templateType: "",
    subject: "",
    body: "",
    shareWithEveryone: false,
  });

  const [emailFormat, setEmailFormat] = useState({
    htmlTag: "div",
    fontSize: "13px",
    fontFamily: "Arial",
    bold: false,
    italic: false,
    underline: false,
    alignment: "left",
  });

  const API_BASE = "http://16.171.117.2:3000/settings";

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/getAllTemplates`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiResponse: APIResponse = await response.json();

      if (apiResponse.status && apiResponse.result) {
        console.log("Raw API Response:", apiResponse.result);
        const templatesData: Template[] = apiResponse.result.map(
          (template: APITemplate) => ({
            id: template.id,
            templateName: template.template_name,
            templateType: template.template_type,
            subject: template.subject || "",
            body: template.body || "",
            shareWithEveryone: template.share_with_everyone || false,
            type: template.template_type as "email" | "sms" | "notes" | "aira",
          })
        );
        console.log("Processed Templates Data:", templatesData);
        setTemplates(templatesData);
      } else {
        throw new Error(apiResponse.message || "Failed to fetch templates");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch templates"
      );
      console.error("Error fetching templates:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTemplate = useCallback(
    async (templateData: Omit<Template, "id">) => {
      try {
        setLoading(true);
        setError(null);

        const requestBody = {
          template_name: templateData.templateName,
          template_type: templateData.type,
          subject: templateData.subject || "",
          body: templateData.body,
          share_with_everyone: templateData.shareWithEveryone,
        };

        console.log("Request body being sent to API:", requestBody);

        const response = await fetch(`${API_BASE}/createTemplate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiResponse: APIResponse = await response.json();

        if (apiResponse.status) {
          await fetchTemplates();
          return apiResponse;
        } else {
          throw new Error(apiResponse.message || "Failed to create template");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create template"
        );
        console.error("Error creating template:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchTemplates]
  );

 const updateTemplate = useCallback(
    async (id: number, templateData: Partial<Template>) => {
      try {
        setLoading(true);
        setError(null);

        
        const requestBody = {
          template_name: templateData.templateName,
          template_type: templateData.templateType || templateData.type, 
          subject: templateData.subject || "",
          body: templateData.body,
          share_with_everyone: templateData.shareWithEveryone,
        };

        console.log("Update request body:", requestBody);

        const response = await fetch(`${API_BASE}/templates/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiResponse: APIResponse = await response.json();

        if (apiResponse.status) {
          await fetchTemplates();
          return apiResponse;
        } else {
          throw new Error(apiResponse.message || "Failed to update template");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update template"
        );
        console.error("Error updating template:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchTemplates]
  );

  const getTemplate = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/templates/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiResponse: APIResponse = await response.json();

      if (apiResponse.status && apiResponse.result) {
        return apiResponse.result[0];
      } else {
        throw new Error(apiResponse.message || "Failed to fetch template");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch template");
      console.error("Error fetching template:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTemplate = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE}/templates/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiResponse = await response.json();
        console.log("Delete API Response:", apiResponse);


        if (apiResponse.job && apiResponse.job.status) {
          await fetchTemplates();
          return apiResponse;
        } else {
          throw new Error(apiResponse.message || "Failed to delete template");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete template"
        );
        console.error("Error deleting template:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchTemplates]
  );

  const handleEdit = useCallback(
    async (template: Template) => {
      try {
        console.log("Editing template:", template);
        if (template.id) {
          const fullTemplate = await getTemplate(template.id);
          console.log("Full template from API:", fullTemplate);

          setTemplateToEdit({
            ...template,
            templateName: fullTemplate.template_name,
            templateType: fullTemplate.template_type, 
            subject: fullTemplate.subject,
            body: fullTemplate.body,
            shareWithEveryone: fullTemplate.share_with_everyone || false,
          });

         setFormData({
  templateName: fullTemplate.template_name || '',
  templateType: fullTemplate.template_type || '', 
  subject: fullTemplate.subject || '',
  body: fullTemplate.body || '',
  shareWithEveryone: fullTemplate.share_with_everyone || false
});
          setEditing({ isEditing: true, templateId: template.id });
          console.log("Edit state set:", {
            isEditing: true,
            templateId: template.id,
          });

          
          const templateType =
            fullTemplate.template_type === "sms"
              ? "sms"
              : fullTemplate.template_type === "email"
              ? "email"
              : fullTemplate.template_type === "notes"
              ? "notes"
              : "aira";
          console.log("Opening dialog for type:", templateType);
          setDialogs((prev) => ({ ...prev, [templateType]: true }));
        }
      } catch (err) {
        console.error("Error loading template for edit:", err);
        alert("Failed to load template for editing. Please try again.");
      }
    },
    [getTemplate]
  );

  const handleDelete = useCallback(
    async (template: Template) => {
      console.log("Delete button clicked for template:", template);
      if (
        template.id &&
        confirm(
          `Are you sure you want to delete "${template.templateName}"? This action cannot be undone.`
        )
      ) {
        try {
          console.log("Deleting template with ID:", template.id);
          await deleteTemplate(template.id);
          alert("Template deleted successfully!");
        } catch (err) {
          console.error("Error deleting template:", err);
          alert("Failed to delete template. Please try again.");
        }
      }
    },
    [deleteTemplate]
  );

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const testAPIConnection = useCallback(async () => {
    console.log("Testing API connection...");
    try {
      const response = await fetch(`${API_BASE}/getAllTemplates`);
      console.log("API Response Status:", response.status);
      console.log(
        "API Response Headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok) {
        const data: APIResponse = await response.json();
        console.log("API Response Data:", data);

        if (data.status && data.result) {
          alert(
            `✅ API connection successful!\n\nMessage: ${data.message}\nTemplates found: ${data.result.length}\n\nCheck console for full response.`
          );
        } else {
          alert(`⚠️ API responded but with error:\n${data.message}`);
        }
      } else {
        const errorText = await response.text();
        console.log("API Error Response:", errorText);
        alert(
          `❌ API connection failed with status ${response.status}:\n${errorText}`
        );
      }
    } catch (error) {
      console.error("API Connection Error:", error);
      alert(
        `🔥 Network error:\n${
          error instanceof Error ? error.message : "Unknown error"
        }\n\nCheck console for details.`
      );
    }
  }, []);

  const updateFormField = useCallback(
    (field: string, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const updateEmailFormat = useCallback(
    (field: string, value: string | boolean) => {
      setEmailFormat((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const toggleBold = useCallback(() => {
    setEmailFormat((prev) => ({ ...prev, bold: !prev.bold }));
  }, []);

  const toggleItalic = useCallback(() => {
    setEmailFormat((prev) => ({ ...prev, italic: !prev.italic }));
  }, []);

  const toggleUnderline = useCallback(() => {
    setEmailFormat((prev) => ({ ...prev, underline: !prev.underline }));
  }, []);

  const setAlignment = useCallback((align: string) => {
    setEmailFormat((prev) => ({ ...prev, alignment: align }));
  }, []);

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url) {
      const linkText = `[Link](${url})`;
      setFormData((prev) => ({
        ...prev,
        body: prev.body + linkText,
      }));
    }
  }, []);

  const insertImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (url) {
      const imageText = `![Image](${url})`;
      setFormData((prev) => ({
        ...prev,
        body: prev.body + imageText,
      }));
    }
  }, []);

  const attachFile = useCallback(() => {
    alert("File attachment functionality would be implemented here");
  }, []);

  const resetFormatting = useCallback(() => {
    setEmailFormat({
      htmlTag: "div",
      fontSize: "13px",
      fontFamily: "Arial",
      bold: false,
      italic: false,
      underline: false,
      alignment: "left",
    });
  }, []);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const openDialog = useCallback((type: string) => {

    setEditing({ isEditing: false });
    setTemplateToEdit(null);
    setFormData({
      templateName: "",
      templateType: "",
      subject: "",
      body: "",
      shareWithEveryone: false,
    });
    setDialogs((prev) => ({ ...prev, [type]: true }));
  }, []);

  const closeDialog = useCallback((type: string) => {
    setDialogs((prev) => ({ ...prev, [type]: false }));
  }, []);

  const handleSave = useCallback(
    async (type: string) => {
      try {
        console.log("Form Data:", formData);
        console.log("Template Type:", type);
        console.log("Editing mode:", editing);

        if (!formData.templateName || !formData.templateName.trim()) {
          alert("Please enter a template name");
          return;
        }

        if (!formData.body || !formData.body.trim()) {
          alert("Please enter template content");
          return;
        }

        const templateData: Omit<Template, "id"> = {
          templateName: formData.templateName.trim(),
          templateType: formData.templateType || type,
          subject: formData.subject || "",
          body: formData.body.trim(),
          shareWithEveryone: formData.shareWithEveryone,
          type: type as "email" | "sms" | "notes" | "aira",
        };

        console.log("Template Data being sent:", templateData);

        if (editing.isEditing && editing.templateId) {
        
          await updateTemplate(editing.templateId, templateData);
          alert(
            `${
              type.charAt(0).toUpperCase() + type.slice(1)
            } template updated successfully!`
          );
        } else {

          await createTemplate(templateData);
          alert(
            `${
              type.charAt(0).toUpperCase() + type.slice(1)
            } template created successfully!`
          );
        }

  
        setEditing({ isEditing: false });
        setTemplateToEdit(null);
        closeDialog(type);
      } catch (err) {
        const action = editing.isEditing ? "update" : "save";
        alert(`Failed to ${action} ${type} template. Please try again.`);
      }
    },
    [formData, createTemplate, updateTemplate, editing, closeDialog]
  );

  const handleCancel = useCallback(
    (type: string) => {
      
      setEditing({ isEditing: false });
      setTemplateToEdit(null);
      closeDialog(type);
    },
    [closeDialog]
  );

  const TemplateSection = ({
    title,
    type,
    icon,
  }: {
    title: string;
    type: string;
    icon: string;
  }) => {
    const sectionTemplates = templates.filter((t) => t.type === type);

    return (
      <div className="border border-gray-200 rounded-lg mb-4">
        <div
          onClick={() => toggleSection(type)}
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              {expandedSections[type] ? (
                <ChevronDown className="w-4 h-4 text-white" />
              ) : (
                <ChevronRight className="w-4 h-4 text-white" />
              )}
            </div>
            <span className="text-lg font-medium text-blue-600">{title}</span>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              {sectionTemplates.length} templates
            </span>
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              openDialog(type);
            }}
            variant="outline"
            className="text-blue-600 border-blue-200 hover:border-blue-300"
          >
            Add template
          </Button>
        </div>
        {expandedSections[type] && (
          <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
            {loading ? (
              <div className="py-4 text-gray-500 text-center">
                Loading templates...
              </div>
            ) : error ? (
              <div className="py-4 text-red-500 text-center">
                Error: {error}
              </div>
            ) : sectionTemplates.length === 0 ? (
              <div className="py-4 text-gray-500 text-center">
                No templates added yet
              </div>
            ) : (
              <div className="space-y-2 py-2">
                {sectionTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-3 bg-white rounded border"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {template.templateName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {template.templateType}
                      </p>
                      {template.subject && (
                        <p className="text-xs text-gray-400 mt-1">
                          Subject: {template.subject}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                    
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(template)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const AddTemplateDialog = ({
    type,
    title,
    isOpen,
    onClose,
  }: {
    type: string;
    title: string;
    isOpen: boolean;
    onClose: (type: string) => void;
  }) => (
    <Dialog open={isOpen} onOpenChange={() => onClose(type)}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                TEMPLATE NAME <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter template name..."
                value={formData.templateName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    templateName: e.target.value,
                  }))
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                TEMPLATE TYPE <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.templateType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, templateType: value }))
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a template type" />
                </SelectTrigger>
                <SelectContent>
                  {type === "email" && (
                    <>
                      <SelectItem value="candidate-email">
                        Candidate Email
                      </SelectItem>
                      <SelectItem value="post-interview-candidate">
                        Post-interview email (Candidate)
                      </SelectItem>
                      <SelectItem value="contact-email">
                        Contact Email
                      </SelectItem>
                      <SelectItem value="submission-email">
                        Candidate Submission Email
                      </SelectItem>
                      <SelectItem value="post-interview-contact">
                        Post-interview email (Contact)
                      </SelectItem>
                    </>
                  )}

                  {type === "sms" && (
                    <>
                      <SelectItem value="otp">Candidate SMS</SelectItem>
                      <SelectItem value="reminder">Contact SMS</SelectItem>
                    </>
                  )}

                  {type === "notes" && (
                    <>
                      <SelectItem value="candidate-feedback">
                        Candidate Note
                      </SelectItem>
                      <SelectItem value="interview-notes">
                        Contact Note
                      </SelectItem>
                      <SelectItem value="internal-comments">
                        Job Note
                      </SelectItem>
                      <SelectItem value="task-notes">Company Note</SelectItem>
                      <SelectItem value="interview-notes">Deal Note</SelectItem>
                    </>
                  )}

                  {type === "aira" && (
                    <>
                      <SelectItem value="ai-intro">Candidate Prompt</SelectItem>
                      <SelectItem value="ai-followup">
                        Contact Prompt
                      </SelectItem>
                      <SelectItem value="ai-summary">Job Prompt</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {type === "email" && (
            <div>
              <Label className="text-sm font-medium text-gray-700">
                SUBJECT
              </Label>
              <Input
                placeholder="Enter a subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                }
                className="mt-2"
              />
            </div>
          )}

          <div>
            <Label className="text-sm font-medium text-gray-700">BODY</Label>
            <div className="border border-gray-300 rounded-lg mt-2">
              {type === "email" && (
                <TooltipProvider>
                  <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                   
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select
                              value={emailFormat.htmlTag}
                              onValueChange={(value) =>
                                updateEmailFormat("htmlTag", value)
                              }
                            >
                              <SelectTrigger className="w-20 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="div">Div</SelectItem>
                                <SelectItem value="p">P</SelectItem>
                                <SelectItem value="h1">H1</SelectItem>
                                <SelectItem value="h2">H2</SelectItem>
                                <SelectItem value="h3">H3</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>HTML Tag</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Font Size Selector */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select
                              value={emailFormat.fontSize}
                              onValueChange={(value) =>
                                updateEmailFormat("fontSize", value)
                              }
                            >
                              <SelectTrigger className="w-16 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="10px">10px</SelectItem>
                                <SelectItem value="12px">12px</SelectItem>
                                <SelectItem value="13px">13px</SelectItem>
                                <SelectItem value="14px">14px</SelectItem>
                                <SelectItem value="16px">16px</SelectItem>
                                <SelectItem value="18px">18px</SelectItem>
                                <SelectItem value="24px">24px</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Font Size</p>
                        </TooltipContent>
                      </Tooltip>

                     
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select
                              value={emailFormat.fontFamily}
                              onValueChange={(value) =>
                                updateEmailFormat("fontFamily", value)
                              }
                            >
                              <SelectTrigger className="w-24 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Arial">Arial</SelectItem>
                                <SelectItem value="Helvetica">
                                  Helvetica
                                </SelectItem>
                                <SelectItem value="Times New Roman">
                                  Times
                                </SelectItem>
                                <SelectItem value="Georgia">Georgia</SelectItem>
                                <SelectItem value="Verdana">Verdana</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Font Family</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="flex items-center space-x-1">
                  
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant={emailFormat.bold ? "default" : "ghost"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={toggleBold}
                          >
                            <Bold className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Bold</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant={emailFormat.italic ? "default" : "ghost"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={toggleItalic}
                          >
                            <Italic className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Italic</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant={
                              emailFormat.underline ? "default" : "ghost"
                            }
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={toggleUnderline}
                          >
                            <Underline className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Underline</p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant={
                              emailFormat.alignment === "left"
                                ? "default"
                                : "ghost"
                            }
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setAlignment("left")}
                          >
                            <AlignLeft className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Align Left</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant={
                              emailFormat.alignment === "center"
                                ? "default"
                                : "ghost"
                            }
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setAlignment("center")}
                          >
                            <AlignCenter className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Align Center</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant={
                              emailFormat.alignment === "right"
                                ? "default"
                                : "ghost"
                            }
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setAlignment("right")}
                          >
                            <AlignRight className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Align Right</p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                 
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={insertLink}
                          >
                            <Link className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Insert Link</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={insertImage}
                          >
                            <Image className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Insert Image</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={attachFile}
                          >
                            <Paperclip className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Attach File</p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                   
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={resetFormatting}
                          >
                            <Type className="w-4 h-4 mr-1" />
                            Reset
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reset Formatting</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </TooltipProvider>
              )}

              <Textarea
                placeholder={
                  type === "email"
                    ? "Enter your email template content..."
                    : "Enter template content..."
                }
                value={formData.body}
                onChange={(e) => updateFormField("body", e.target.value)}
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-y-auto"
                rows={type === "email" ? 6 : 8}
                style={{
                  maxHeight: type === "email" ? "150px" : "auto",
                  minHeight: "120px",
                  fontSize: type === "email" ? emailFormat.fontSize : undefined,
                  fontFamily:
                    type === "email" ? emailFormat.fontFamily : undefined,
                  fontWeight:
                    type === "email" && emailFormat.bold ? "bold" : "normal",
                  fontStyle:
                    type === "email" && emailFormat.italic
                      ? "italic"
                      : "normal",
                  textDecoration:
                    type === "email" && emailFormat.underline
                      ? "underline"
                      : "none",
                  textAlign:
                    type === "email"
                      ? (emailFormat.alignment as "left" | "center" | "right")
                      : "left",
                }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="shareWithEveryone"
              checked={formData.shareWithEveryone}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  shareWithEveryone: !!checked,
                }))
              }
            />
            <Label
              htmlFor="shareWithEveryone"
              className="text-sm text-gray-700"
            >
              Share template with everyone
            </Label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => handleCancel(type)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleSave(type)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editing.isEditing ? "Update" : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Templates</h2>
          <p className="text-gray-600 mt-2">
            Manage your templates for email, SMS, notes, and AIRA
            communications.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={fetchTemplates}
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh Templates"}
          </Button>
        
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">API Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <div className="ml-3 text-sm text-blue-700">
              Loading templates...
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl">
        <TemplateSection title="Email Templates" type="email" icon="✉️" />
        <TemplateSection title="SMS Templates" type="sms" icon="💬" />
        <TemplateSection title="Notes Templates" type="notes" icon="📝" />
        <TemplateSection title="AIRA Prompt Templates" type="aira" icon="🤖" />
      </div>

      <Dialog
        open={dialogs.email}
        onOpenChange={(open) => !open && closeDialog("email")}
      >
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing.isEditing ? "Edit Email Template" : "Add Email Template"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  TEMPLATE NAME <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter template name..."
                  value={formData.templateName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      templateName: e.target.value,
                    }))
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  TEMPLATE TYPE <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.templateType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, templateType: value }))
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a template type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="candidate-email">
                      Candidate Email
                    </SelectItem>
                    <SelectItem value="post-interview-candidate">
                      Post-interview email (Candidate)
                    </SelectItem>
                    <SelectItem value="contact-email">Contact Email</SelectItem>
                    <SelectItem value="submission-email">
                      Candidate Submission Email
                    </SelectItem>
                    <SelectItem value="post-interview-contact">
                      Post-interview email (Contact)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                SUBJECT
              </Label>
              <Input
                placeholder="Enter a subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">BODY</Label>
              <div className="border border-gray-300 rounded-lg mt-2">
                <TooltipProvider>
                  <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select
                              value={emailFormat.htmlTag}
                              onValueChange={(value) =>
                                setEmailFormat((prev) => ({
                                  ...prev,
                                  htmlTag: value,
                                }))
                              }
                            >
                              <SelectTrigger className="w-20 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="div">Div</SelectItem>
                                <SelectItem value="p">P</SelectItem>
                                <SelectItem value="h1">H1</SelectItem>
                                <SelectItem value="h2">H2</SelectItem>
                                <SelectItem value="h3">H3</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>HTML Tag</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select
                              value={emailFormat.fontSize}
                              onValueChange={(value) =>
                                setEmailFormat((prev) => ({
                                  ...prev,
                                  fontSize: value,
                                }))
                              }
                            >
                              <SelectTrigger className="w-16 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="10px">10px</SelectItem>
                                <SelectItem value="12px">12px</SelectItem>
                                <SelectItem value="13px">13px</SelectItem>
                                <SelectItem value="14px">14px</SelectItem>
                                <SelectItem value="16px">16px</SelectItem>
                                <SelectItem value="18px">18px</SelectItem>
                                <SelectItem value="24px">24px</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Font Size</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Select
                              value={emailFormat.fontFamily}
                              onValueChange={(value) =>
                                setEmailFormat((prev) => ({
                                  ...prev,
                                  fontFamily: value,
                                }))
                              }
                            >
                              <SelectTrigger className="w-24 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Arial">Arial</SelectItem>
                                <SelectItem value="Helvetica">
                                  Helvetica
                                </SelectItem>
                                <SelectItem value="Times New Roman">
                                  Times
                                </SelectItem>
                                <SelectItem value="Georgia">Georgia</SelectItem>
                                <SelectItem value="Verdana">Verdana</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Font Family</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant={emailFormat.bold ? "default" : "ghost"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={toggleBold}
                          >
                            <Bold className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Bold</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant={emailFormat.italic ? "default" : "ghost"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={toggleItalic}
                          >
                            <Italic className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Italic</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant={
                              emailFormat.underline ? "default" : "ghost"
                            }
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={toggleUnderline}
                          >
                            <Underline className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Underline</p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant={
                              emailFormat.alignment === "left"
                                ? "default"
                                : "ghost"
                            }
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setAlignment("left")}
                          >
                            <AlignLeft className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Align Left</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant={
                              emailFormat.alignment === "center"
                                ? "default"
                                : "ghost"
                            }
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setAlignment("center")}
                          >
                            <AlignCenter className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Align Center</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant={
                              emailFormat.alignment === "right"
                                ? "default"
                                : "ghost"
                            }
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setAlignment("right")}
                          >
                            <AlignRight className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Align Right</p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={insertLink}
                          >
                            <Link className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Insert Link</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={insertImage}
                          >
                            <Image className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Insert Image</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={attachFile}
                          >
                            <Paperclip className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Attach File</p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={resetFormatting}
                          >
                            <Type className="w-4 h-4 mr-1" />
                            Reset
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reset Formatting</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </TooltipProvider>
                <Textarea
                  placeholder="Enter your email template content..."
                  value={formData.body}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, body: e.target.value }))
                  }
                  className="border-0 focus:ring-0 resize-none"
                  rows={6}
                  style={{
                    maxHeight: "150px",
                    minHeight: "120px",
                    fontSize: emailFormat.fontSize,
                    fontFamily: emailFormat.fontFamily,
                    fontWeight: emailFormat.bold ? "bold" : "normal",
                    fontStyle: emailFormat.italic ? "italic" : "normal",
                    textDecoration: emailFormat.underline
                      ? "underline"
                      : "none",
                    textAlign: emailFormat.alignment as
                      | "left"
                      | "center"
                      | "right",
                  }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="shareWithEveryone-email"
                checked={formData.shareWithEveryone}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    shareWithEveryone: !!checked,
                  }))
                }
              />
              <Label
                htmlFor="shareWithEveryone-email"
                className="text-sm text-gray-700"
              >
                Share template with everyone
              </Label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => handleCancel("email")}>
                Cancel
              </Button>
              <Button
                onClick={() => handleSave("email")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {editing.isEditing ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

   
      <Dialog
        open={dialogs.sms}
        onOpenChange={(open) => !open && closeDialog("sms")}
      >
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing.isEditing ? "Edit SMS Template" : "Add SMS Template"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  TEMPLATE NAME <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter template name..."
                  value={formData.templateName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      templateName: e.target.value,
                    }))
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  TEMPLATE TYPE <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.templateType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, templateType: value }))
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a template type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="otp">Candidate SMS</SelectItem>
                    <SelectItem value="reminder">Contact SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">BODY</Label>
              <Textarea
                placeholder="Enter template content..."
                value={formData.body}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, body: e.target.value }))
                }
                className="mt-2"
                rows={8}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="shareWithEveryone-sms"
                checked={formData.shareWithEveryone}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    shareWithEveryone: !!checked,
                  }))
                }
              />
              <Label
                htmlFor="shareWithEveryone-sms"
                className="text-sm text-gray-700"
              >
                Share template with everyone
              </Label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => handleCancel("sms")}>
                Cancel
              </Button>
              <Button
                onClick={() => handleSave("sms")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {editing.isEditing ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogs.notes}
        onOpenChange={(open) => !open && closeDialog("notes")}
      >
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing.isEditing ? "Edit Notes Template" : "Add Notes Template"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  TEMPLATE NAME <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter template name..."
                  value={formData.templateName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      templateName: e.target.value,
                    }))
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  TEMPLATE TYPE <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.templateType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, templateType: value }))
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a template type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="candidate-feedback">
                      Candidate Note
                    </SelectItem>
                    <SelectItem value="interview-notes">
                      Contact Note
                    </SelectItem>
                    <SelectItem value="internal-comments">Job Note</SelectItem>
                    <SelectItem value="task-notes">Company Note</SelectItem>
                    <SelectItem value="deal-notes">Deal Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">BODY</Label>
              <Textarea
                placeholder="Enter template content..."
                value={formData.body}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, body: e.target.value }))
                }
                className="mt-2"
                rows={8}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="shareWithEveryone-notes"
                checked={formData.shareWithEveryone}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    shareWithEveryone: !!checked,
                  }))
                }
              />
              <Label
                htmlFor="shareWithEveryone-notes"
                className="text-sm text-gray-700"
              >
                Share template with everyone
              </Label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => handleCancel("notes")}>
                Cancel
              </Button>
              <Button
                onClick={() => handleSave("notes")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {editing.isEditing ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogs.aira}
        onOpenChange={(open) => !open && closeDialog("aira")}
      >
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing.isEditing
                ? "Edit AIRA Prompt Template"
                : "Add AIRA Prompt Template"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  TEMPLATE NAME <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter template name..."
                  value={formData.templateName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      templateName: e.target.value,
                    }))
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  TEMPLATE TYPE <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.templateType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, templateType: value }))
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a template type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai-intro">Candidate Prompt</SelectItem>
                    <SelectItem value="ai-followup">Contact Prompt</SelectItem>
                    <SelectItem value="ai-summary">Job Prompt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">BODY</Label>
              <Textarea
                placeholder="Enter template content..."
                value={formData.body}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, body: e.target.value }))
                }
                className="mt-2"
                rows={8}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="shareWithEveryone-aira"
                checked={formData.shareWithEveryone}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    shareWithEveryone: !!checked,
                  }))
                }
              />
              <Label
                htmlFor="shareWithEveryone-aira"
                className="text-sm text-gray-700"
              >
                Share template with everyone
              </Label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => handleCancel("aira")}>
                Cancel
              </Button>
              <Button
                onClick={() => handleSave("aira")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {editing.isEditing ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplatesManager;
