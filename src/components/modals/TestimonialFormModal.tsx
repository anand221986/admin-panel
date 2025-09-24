import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

interface TestimonialFormValues {
  message: string;
  author_name: string;
  author_designation: string;
  company: string;
  star_rating: number;
}

interface TestimonialFormModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchTestimonials: () => void;
  editingTestimonial: any | null;
  setEditingTestimonial: (testimonial: any | null) => void;
}

const API_BASE_URL = "http://16.171.117.2:3000";

const initialFormValues: TestimonialFormValues = {
  message: "",
  author_name: "",
  author_designation: "",
  company: "",
  star_rating: 5,
};

export default function TestimonialFormModal({
  open,
  setOpen,
  fetchTestimonials,
  editingTestimonial,
  setEditingTestimonial,
}: TestimonialFormModalProps) {
  const [formValues, setFormValues] = useState<TestimonialFormValues>(
    initialFormValues
  );
  const [errors, setErrors] = useState<Partial<TestimonialFormValues>>({});

  useEffect(() => {
    if (editingTestimonial) {
      setFormValues({
        message: editingTestimonial.message,
        author_name: editingTestimonial.author_name,
        author_designation: editingTestimonial.author_designation,
        company: editingTestimonial.company,
        star_rating: editingTestimonial.star_rating,
      });
    } else {
      setFormValues(initialFormValues);
    }
  }, [editingTestimonial]);

  const validate = (): boolean => {
    const newErrors: Partial<TestimonialFormValues> = {};

    if (!formValues.message.trim()) {
      newErrors.message = "Testimonial message is required";
    }
    if (!formValues.author_name.trim()) {
      newErrors.author_name = "Author name is required";
    }
    if (!formValues.author_designation.trim()) {
      newErrors.author_designation = "Author designation is required";
    }
    // if (formValues.star_rating < 1 || formValues.star_rating > 5) {
    //   newErrors.star_rating = "Star rating must be between 1 and 5";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (editingTestimonial) {
        await axios.put(
          `${API_BASE_URL}/testimonials/${editingTestimonial.id}`,
          formValues
        );
        toast.success("Testimonial updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/testimonials`, formValues);
        toast.success("Testimonial created successfully");
      }
      fetchTestimonials();
      setOpen(false);
      setEditingTestimonial(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save testimonial");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Testimonial message */}
          <div className="space-y-2">
            <Label htmlFor="message">Testimonial</Label>
            <Textarea
              id="message"
              name="message"
              value={formValues.message}
              onChange={(e) =>
                setFormValues({ ...formValues, message: e.target.value })
              }
              rows={4}
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message}</p>
            )}
          </div>

          {/* Author Name */}
          <div className="space-y-2">
            <Label htmlFor="author_name">Author Name</Label>
            <Input
              id="author_name"
              name="author_name"
              value={formValues.author_name}
              onChange={(e) =>
                setFormValues({ ...formValues, author_name: e.target.value })
              }
            />
            {errors.author_name && (
              <p className="text-red-500 text-sm">{errors.author_name}</p>
            )}
          </div>

          {/* Author Designation */}
          <div className="space-y-2">
            <Label htmlFor="author_designation">Author Designation</Label>
            <Input
              id="author_designation"
              name="author_designation"
              value={formValues.author_designation}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  author_designation: e.target.value,
                })
              }
            />
            {errors.author_designation && (
              <p className="text-red-500 text-sm">
                {errors.author_designation}
              </p>
            )}
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              value={formValues.company}
              onChange={(e) =>
                setFormValues({ ...formValues, company: e.target.value })
              }
            />
          </div>

          {/* Star Rating */}
          <div className="space-y-2">
            <Label htmlFor="star_rating">Star Rating</Label>
            <Input
              type="number"
              id="star_rating"
              name="star_rating"
              value={formValues.star_rating}
              min={1}
              max={5}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  star_rating: parseInt(e.target.value, 10),
                })
              }
            />
            {errors.star_rating && (
              <p className="text-red-500 text-sm">{errors.star_rating}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingTestimonial ? "Update Testimonial" : "Create Testimonial"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
