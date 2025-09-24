import Layout from "@/components/Layout";
import TemplatesManager from "@/components/panels/TemplatesSection";
import IntegrationPage from "@/components/panels/IntegrationPage";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CMSSettingsTabs from "@/pages/CmsDashboardTabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  User,
  Users,
  Building,
  Mail,
  Shield,
  Save,
  FileText,
  ListChecks,
  Settings as SettingsIcon,
} from "lucide-react";
import { StatusSettingsTab } from "@/components/StatusSettingsTab";
import { RolePermissionsTab } from "@/components/RolePermissionsTab";
import { useEffect, useState } from "react";
import BlogsNewPagesModal from "@/components/modals/BlogsNewPagesModal";
import BlogsViewList from "@/components/BlogsViewTable";
import axios from "axios";

const API_BASE_URL = "http://16.171.117.2:3000";

const Blog = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<any[]>([]);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/blogs`);
      setPages(data);
    } catch (err) {
      console.error("Error fetching pages: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Blogs Management</h1>
            <p className="text-slate-600 mt-1">Manage your website Blogs.</p>
          </div>
        </div>

        {/* Blogs view list component */}
        <BlogsViewList
          loading={loading}
          fetchPages={fetchPages}
          pages={pages} // ✅ Ensure BlogsViewList expects these props
        />

        {/* Modal */}
        <BlogsNewPagesModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchPages(); // Refresh after success
          }}
        />
      </div>
    </Layout>
  );
};

export default Blog;
