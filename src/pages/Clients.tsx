import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  Users,
  Briefcase,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddClientModal from "@/components/modals/AddClientModal";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";

const API_BASE_URL = "http://51.20.181.155:3000";

interface Client {
  id: number;
  name: string;
  industry: string;
  status: string;
  website: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string | null;
  activeJobs: number;
  totalHires: number;
  created_dt: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Inactive":
      return "bg-red-100 text-red-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const Clients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [filterIndustry, setFilterIndustry] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/client/getAllClient`);
      setClients(response.data.result);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load clients.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this client?")) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/client/${id}`);
      toast.success("Client archived successfully.");
      fetchClients();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to archive client.");
    } finally {
      setLoading(false);
    }
  };

  const visibleClients = clients.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = filterIndustry
      ? c.industry === filterIndustry
      : true;
    return matchesSearch && matchesIndustry;
  });

  const industries = Array.from(new Set(clients.map((c) => c.industry)));

  const getHostname = (url: string) => {
    try {
      const normalized = url.startsWith("http") ? url : `https://${url}`;
      return new URL(normalized).hostname;
    } catch {
      return "";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Clients</h1>
            <p className="text-slate-600 mt-1">
              Manage your client relationships and track their hiring needs.
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Client
          </Button>
        </div>

        <AddClientModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients..."
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {industries.map((ind) => (
              <Button
                key={ind}
                variant={filterIndustry === ind ? "default" : "outline"}
                onClick={() =>
                  setFilterIndustry((f) => (f === ind ? null : ind))
                }
              >
                {ind}
              </Button>
            ))}
          </div>
        </div>

        {!visibleClients.length && (
          <div className="text-center py-20 text-gray-500">
            No clients match your search or filters.
          </div>
        )}

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {visibleClients.map((c) => (
            <Card
              key={c.id}
              className="hover:shadow-lg transition-all duration-200"
            >
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    {c.website && (
                      <AvatarImage
                        src={`https://logo.clearbit.com/${getHostname(
                          c.website
                        )}`}
                        alt={`${c.name} logo`}
                        onError={(e) => {
                          e.currentTarget.src = undefined;
                        }}
                      />
                    )}
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                      {c.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">
                      {c.name}
                    </CardTitle>
                    <Badge className={getStatusColor(c.status)}>
                      {c.status}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-white/95 backdrop-blur-sm"
                  >
                    <DropdownMenuItem onClick={() => {}}>
                      Edit Client
                    </DropdownMenuItem>
                    <DropdownMenuItem>View Contract</DropdownMenuItem>
                    <DropdownMenuItem>Send Report</DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(c.id)}
                    >
                      Archive Client
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-600">{c.industry}</p>
                <p className="text-xs text-slate-500">
                  Joined {format(new Date(c.created_dt), "MMM d, yyyy")}
                </p>

                <div className="space-y-1 pt-2">
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4" />
                    {[c.street1, c.street2, c.city, c.state, c.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  {c.email && (
                    <p className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4" />
                      {c.email}
                    </p>
                  )}
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4" />
                    {c.phone}
                  </p>
                </div>

                <div className="flex items-center gap-6 text-sm pt-4">
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-slate-800">
                      {c.activeJobs}
                    </span>
                    <span className="text-slate-600">Active Jobs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-slate-800">
                      {c.totalHires}
                    </span>
                    <span className="text-slate-600">Total Hires</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Clients;
