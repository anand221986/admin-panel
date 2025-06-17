import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  Building2,
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
const API_BASE_URL = "/api";
console.log(API_BASE_URL);

interface Client {
  id: number;
  name: string;
  industry: string;
  location: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: string;
  activeJobs: number;
  totalHires: number;
  joinedDate: string;
  logo: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  country: string;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openEditModal, setOpenEditModal] = useState(false);
  useEffect(() => {
    fetchClients();
  }, []);
  const fetchClients = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(`${API_BASE_URL}/client/getAllClient`);
      setClients(response.data.result);
      console.log(response.data.result);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
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

        {/* Search and Filters */}
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search clients..."
                  className="pl-10 bg-white/80"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-white/80">
                  Industry
                </Button>
                <Button variant="outline" className="bg-white/80">
                  Status
                </Button>
                <Button variant="outline" className="bg-white/80">
                  Location
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clients List */}
        <div className="space-y-4">
          {clients.map((client) => (
            <Card
              key={client.id}
              className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-bold">
                        {client.logo}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-slate-800">
                          {client.name}
                        </h3>
                        <Badge className={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                      </div>

                      <p className="text-slate-600 font-medium mb-3">
                        {client.industry}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Building2 className="w-4 h-4" />
                          <span className="font-medium">
                            {client.contactPerson}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="w-4 h-4" />
                          {client.street1}
                          {client.street2}
                          {client.city}
                          {client.state}
                          {client.country}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-4 h-4" />
                          {client.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-4 h-4" />
                          {client.phone}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4 text-blue-500" />
                          <span className="font-medium text-slate-800">
                            {client.activeJobs}
                          </span>
                          <span className="text-slate-600">Active Jobs</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-green-500" />
                          <span className="font-medium text-slate-800">
                            {client.totalHires}
                          </span>
                          <span className="text-slate-600">Total Hires</span>
                        </div>
                        <span className="text-slate-500">
                          Client since {client.joinedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-white/80">
                      View Jobs
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Contact
                    </Button>
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
                        <DropdownMenuItem>Edit Client</DropdownMenuItem>
                        <DropdownMenuItem>View Contract</DropdownMenuItem>
                        <DropdownMenuItem>Send Report</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Archive Client
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
