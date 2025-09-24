import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Pencil, Trash2, Plus } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Link } from 'react-router-dom';
import SettingsTabs from "@/pages/AgencyDashboardTabs";
const API_BASE_URL = "http://16.171.117.2:3000";

interface Agency {
  id: number;
  name: string;
  created_at: string;
}
export default function AgenciesDashboard() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgencies = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/agency/getAllAgencies`);
      setAgencies(data.result || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch agencies.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    
  };

  const handleUpdate = async (agency: Agency) => {

  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Agencies Dashboard</h1>
        </div>
  <SettingsTabs/>
      </div>
    </Layout>
  );
}
