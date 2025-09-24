import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import TestimonialFormModal from "./modals/TestimonialFormModal"; // ✅ renamed import

interface Testimonial {
  id: number;
  message: string;
  author_name: string;
  author_designation?: string;
  company?: string;
  star_rating: number;
  created_at: string;
  updated_at: string;
}

interface TestimonialsViewListProps {
  loading: boolean;
  fetchTestimonials: () => void; // ✅ consistent
  testimonials: Testimonial[];
}

const API_BASE_URL = "http://16.171.117.2:3000";

export default function TestimonialsViewList({
  loading,
  fetchTestimonials,
  testimonials,
}: TestimonialsViewListProps) {
  const [localTestimonials, setLocalTestimonials] = useState<Testimonial[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [open, setOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);

  const itemsPerPage = 10;

  useEffect(() => setLocalTestimonials(testimonials), [testimonials]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return localTestimonials.slice(start, start + itemsPerPage);
  }, [localTestimonials, currentPage]);

  const totalPages = Math.ceil(localTestimonials.length / itemsPerPage);

  const allSelected = useMemo(
    () =>
      paginated.length > 0 &&
      paginated.every((t) => selected.has(t.id)),
    [paginated, selected]
  );

  const toggleAll = () => {
    if (allSelected) {
      const next = new Set(selected);
      paginated.forEach((t) => next.delete(t.id));
      setSelected(next);
    } else {
      setSelected((prev) => new Set([...prev, ...paginated.map((t) => t.id)]));
    }
  };

  const toggleOne = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleAdd = () => {
    setEditingTestimonial(null);
    setOpen(true);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/testimonials/${id}`);
      toast.success("Testimonial deleted successfully");
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete testimonial");
    }
  };

  const handleBulkDelete = async () => {
    if (!selected.size) return toast.error("No testimonials selected");
    try {
      await axios.post(`${API_BASE_URL}/testimonials/bulk-delete`, {
        ids: [...selected],
      });
      toast.success("Selected testimonials deleted");
      fetchTestimonials();
      setSelected(new Set());
    } catch (err) {
      console.error(err);
      toast.error("Failed bulk delete");
    }
  };

  return (
    <div className="space-y-4 max-w-[95vw]">
      {/* Header */}
      <Card className="border-0 bg-white/60 shadow-sm backdrop-blur-sm">
        <CardContent className="flex justify-between p-4">
          <h2 className="font-semibold text-lg">Testimonials</h2>
          <div className="flex gap-2">
            {/* <Button variant="outline" onClick={handleBulkDelete} disabled={!selected.size}>Delete Selected</Button> */}
            <Button onClick={handleAdd}>+ Add Testimonial</Button>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Table */}
      <Card className="border-0 bg-white/60 shadow-sm backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="max-h-[600px] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white/90 backdrop-blur-sm">
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Author Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Star Rating</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead className="w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      No testimonials found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <Checkbox
                          checked={selected.has(t.id)}
                          onCheckedChange={() => toggleOne(t.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {t.message}
                      </TableCell>
                      <TableCell>{t.author_name}</TableCell>
                      <TableCell>{t.author_designation || "-"}</TableCell>
                      <TableCell>{t.company || "-"}</TableCell>
                      <TableCell>{t.star_rating}</TableCell>
                      <TableCell>
                        {new Date(t.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(t.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(t)}
                        >
                          <Edit className="w-3 h-3 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                          onClick={() => handleDelete(t.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" /> Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <CardContent className="flex justify-center gap-2 py-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </Button>
            )
          )}
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </CardContent>
      )}

      {/* Modal Form */}
      <TestimonialFormModal
        open={open}
        setOpen={setOpen}
        fetchTestimonials={fetchTestimonials} // ✅ correct prop
        editingTestimonial={editingTestimonial} // ✅ correct prop
        setEditingTestimonial={setEditingTestimonial} // ✅ correct prop
      />
    </div>
  );
}
