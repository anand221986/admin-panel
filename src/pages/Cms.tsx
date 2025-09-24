import Layout from "@/components/Layout";
import TemplatesManager from "@/components/panels/TemplatesSection";
import IntegrationPage from "@/components/panels/IntegrationPage";
import { Button } from "@/components/ui/button";
import {
  Plus,
} from "lucide-react";
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
import { useEffect, useState, useMemo } from "react";
import PostNewPagesModal from "@/components/modals/PostNewPagesModal";
const CMS = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">CMS Management</h1>
            <p className="text-slate-600 mt-1">
              Manage your website Pages and Seo.
            </p>
          </div>
        </div>

     <CMSSettingsTabs/>
      </div>
    </Layout>
  );
    <PostNewPagesModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
          }}
        />
};

export default CMS;
