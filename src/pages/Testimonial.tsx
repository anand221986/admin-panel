import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import TestimonialsNewPagesModal from "@/components/modals/TestimonialsNewPagesModal";
import TestimonialsViewList from "@/components/TestimonialsViewTable";
import axios from "axios";

const API_BASE_URL = "http://16.171.117.2:3000";

const Testimonial = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<any[]>([]); // ✅ renamed

  const fetchTestimonials = async () => { // ✅ renamed
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/testimonials`);
      setTestimonials(data); // ✅ renamed
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Testimonials Management</h1>
            <p className="text-slate-600 mt-1">
              Manage your website Testimonials.
            </p>
          </div>
        </div>

        {/* ✅ pass correct props */}
        <TestimonialsViewList
          loading={loading}
          fetchTestimonials={fetchTestimonials}
          testimonials={testimonials}
        />

        <TestimonialsNewPagesModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchTestimonials(); // ✅ use correct name
          }}
        />
      </div>
    </Layout>
  );
};

export default Testimonial;
