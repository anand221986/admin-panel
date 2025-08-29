import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Pencil, Trash2, Plus } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = "http://16.171.117.2:3000";

interface Agency {
  id: number;
  name: string;
  created_at: string;
}

export default function Agencies() {
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
    if (!confirm("Are you sure you want to delete this agency?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/agency/${id}`);
      toast.success("Agency deleted successfully.");
      fetchAgencies();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete agency.");
    }
  };

  const handleUpdate = async (agency: Agency) => {
    const newName = prompt("Enter new agency name:", agency.name);
    if (!newName || newName.trim() === "") return;

    try {
      await axios.put(`${API_BASE_URL}/agency/${agency.id}`, { name: newName });
      toast.success("Agency updated successfully.");
      fetchAgencies();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update agency.");
    }
  };

  const handleAdd = async () => {
    const name = prompt("Enter new agency name:");
    if (!name || name.trim() === "") return;

    try {
      await axios.post(`${API_BASE_URL}/agency`, { name });
      toast.success("Agency added successfully.");
      fetchAgencies();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add agency.");
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Agencies</h1>
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Agency
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {agencies.map((agency) => (
            <Card
              key={agency.id}
              className="border-0 bg-white/60 shadow-sm backdrop-blur-sm hover:shadow-md transition"
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Agency</p>
                  <p className="text-lg font-semibold text-slate-800">{agency.name}</p>
                  <p className="text-xs text-slate-500">
                    Created: {new Date(agency.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleUpdate(agency)}
                  >
                    <Pencil className="h-5 w-5 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(agency.id)}
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
