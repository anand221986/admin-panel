import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

interface PageFormValues {
  title: string;
  slug: string;
  content: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
}

interface PageFormModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchPages: () => void;
  editingPage: any | null;
  setEditingPage: (page: any | null) => void;
}

const API_BASE_URL = "http://16.171.117.2:3000";

const initialFormValues: PageFormValues = {
  title: "",
  slug: "",
  content: null,
  metaTitle: null,
  metaDescription: null,
  metaKeywords: null,
  ogTitle: null,
  ogDescription: null,
  ogImage: null,
};

export default function PageFormModal({ open, setOpen, fetchPages, editingPage, setEditingPage }: PageFormModalProps) {
  const [formValues, setFormValues] = useState<PageFormValues>(initialFormValues);

  useEffect(() => {
    if (editingPage) {
      setFormValues({
        title: editingPage.title,
        slug: editingPage.slug,
        content: editingPage.content,
        metaTitle: editingPage.meta_title,
        metaDescription: editingPage.meta_description,
        metaKeywords: editingPage.meta_keywords,
        ogTitle: editingPage.og_title,
        ogDescription: editingPage.og_description,
        ogImage: editingPage.og_image,
      });
    } else {
      setFormValues(initialFormValues);
    }
  }, [editingPage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingPage) {
        await axios.put(`${API_BASE_URL}/pages/${editingPage.id}`, formValues);
        toast.success("Page updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/pages`, formValues);
        toast.success("Page created successfully");
      }
      fetchPages();
      setOpen(false);
      setEditingPage(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save page");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingPage ? "Edit Page" : "Add Page"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formValues.title}
              onChange={e => setFormValues({ ...formValues, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={formValues.slug}
              onChange={e => setFormValues({ ...formValues, slug: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={formValues.content || ""}
              onChange={e => setFormValues({ ...formValues, content: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input
              id="metaTitle"
              name="metaTitle"
              value={formValues.metaTitle || ""}
              onChange={e => setFormValues({ ...formValues, metaTitle: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              name="meta_description"
              value={formValues.metaDescription || ""}
              onChange={e => setFormValues({ ...formValues, metaDescription: e.target.value })}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">{editingPage ? "Update Page" : "Create Page"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
