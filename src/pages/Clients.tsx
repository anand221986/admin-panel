import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Star,
  Calendar,
  DollarSign,
  TrendingUp,
  MessageCircle,
  Send,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditClientModal from "@/components/modals/EditClientModal";
import AddClientModal from "@/components/modals/AddClientModal";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const API_BASE_URL = "http://16.171.117.2:3000";

// API interfaces based on backend structure
interface BackendClient {
  id: number;
  name: string;
  website?: string;
  careers_page?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  linkedin?: string;
  phone?: string;
  tags?: string[];
  industry?: string;
  size?: number | null;
  currency?: string | null;
  revenue?: number | null;
  created_dt?: string;
  updated_dt?: string;
  email?: string;
  contact_person?: string;
}

interface Client {
  id: number;
  name: string;
  industry?: string;
  location?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  status?: string;
  active_jobs?: number;
  total_hires?: number;
  joined_date?: string;
  logo?: string;
  created_at?: string;
  updated_at?: string;
  website?: string;
  linkedin?: string;
  tags?: string[];
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  careers_page?: string;
  size?: number | null;
  currency?: string | null;
  revenue?: number | null;
}

interface Prospect {
  id: number;
  name: string;
  industry?: string;
  location?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  status?: string;
  potential_value?: string;
  last_contact?: string;
  next_follow_up?: string;
  source?: string;
  interest_level?: number;
  logo?: string;
  created_at?: string;
  updated_at?: string;
}

// Helper functions
const generateLogo = (name: string) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.getFullYear().toString();
};

const getStatusColor = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Inactive":
      return "bg-red-100 text-red-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Hot":
      return "bg-red-100 text-red-800";
    case "Warm":
      return "bg-orange-100 text-orange-800";
    case "Cold":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getInterestStars = (level) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-3 h-3 ${
        i < level ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
      }`}
    />
  ));
};

const Clients = () => {
  const { toast } = useToast();
  const [editingClient, setEditingClient] = useState<Client | Prospect | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isProspectEdit, setIsProspectEdit] = useState(false);
  const [clientsList, setClientsList] = useState<Client[]>([]);
  const [prospectsList, setProspectsList] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // API Functions
  const fetchClients = async () => {
    try {
      setLoading(true);
      // Use the getAllClient endpoint to fetch all clients
      const response = await axios.get(`${API_BASE_URL}/client/getAllClient`);
      if (response.data.status && Array.isArray(response.data.result)) {
        // Map the backend fields to frontend expectations
        const mappedClients = response.data.result.map((client: BackendClient) => ({
          id: client.id,
          name: client.name,
          industry: client.industry,
          location: `${client.city}, ${client.state}, ${client.country}`,
          contact_person: client.contact_person,
          email: client.email,
          phone: client.phone,
          status: "Active", // Default status since it's not in API
          active_jobs: 0, // Default value since it's not in API
          total_hires: 0, // Default value since it's not in API
          joined_date: client.created_dt,
          logo: generateLogo(client.name),
          created_at: client.created_dt,
          updated_at: client.updated_dt,
          website: client.website,
          linkedin: client.linkedin,
          tags: client.tags || [],
          street1: client.street1,
          street2: client.street2,
          city: client.city,
          state: client.state,
          country: client.country,
          zipcode: client.zipcode,
          careers_page: client.careers_page,
          size: client.size,
          currency: client.currency,
          revenue: client.revenue
        }));
        setClientsList(mappedClients);
      } else {
        setClientsList([]);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Error",
        description: "Failed to fetch clients",
        variant: "destructive",
      });
      setClientsList([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (clientId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/client/${clientId}`);
      setClientsList(prev => prev.filter(client => client.id !== clientId));
      toast({
        title: "Success",
        description: "Client deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      });
    }
  };

  const updateClient = async (clientId: number, updatedData: Partial<BackendClient>) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/client/${clientId}`, updatedData);
      if (response.data.status) {
        // Refresh the entire list to get updated data
        await fetchClients();
        toast({
          title: "Success",
          description: "Client updated successfully",
        });
      }
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        title: "Error",
        description: "Failed to update client",
        variant: "destructive",
      });
    }
  };

  // Load clients on component mount
  useEffect(() => {
    fetchClients();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Helper functions
  const generateLogo = (name: string) => {
    const words = name.split(' ');
    if (words.length >= 2) {
      return words[0][0] + words[1][0];
    }
    return name.slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  // Filter clients based on search term
  const filteredClients = clientsList.filter(client =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClient = (client: Client | Prospect, isProspect = false) => {
    setEditingClient(client);
    setIsProspectEdit(isProspect);
    setIsEditFormOpen(true);
  };

  const handleSaveClient = async (updatedClient: Client | Prospect) => {
    if (isProspectEdit) {
      setProspectsList((prev) =>
        prev.map((p) => (p.id === updatedClient.id ? updatedClient as Prospect : p))
      );
      toast({
        title: "Prospect Updated",
        description: `${updatedClient.name} has been updated.`,
      });
    } else {
      await updateClient(updatedClient.id, updatedClient as Client);
    }
    setIsEditFormOpen(false);
    setEditingClient(null);
  };

  const handleDeleteClient = async (clientId: number, clientName: string) => {
    if (window.confirm(`Are you sure you want to delete ${clientName}?`)) {
      await deleteClient(clientId);
    }
  };

  const handleWhatsAppConnect = (phone, name, isProspect = false) => {
    const message = isProspect
      ? `Hi ${name}, I hope this message finds you well. I wanted to follow up regarding our discussion about potential recruitment services. Would you like to schedule a call to explore how we can help with your hiring needs?`
      : `Hi ${name}, I hope you're doing well. I wanted to check in on our current recruitment projects and see if there's anything you need assistance with. Please let me know if you'd like to discuss any upcoming hiring requirements.`;

    const cleanPhone = phone.replace(/[^\d]/g, "");
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");

    toast({
      title: "WhatsApp Opened",
      description: `Opening WhatsApp chat with ${name}`,
    });
  };

  const handleEmailConnect = (email, name, isProspect = false) => {
    const subject = isProspect
      ? `Follow-up: Partnership Opportunity with Your Company`
      : `Check-in: Current Recruitment Projects`;

    const body = isProspect
      ? `Dear ${name},\n\nI hope this email finds you well. I wanted to follow up on our recent conversation regarding potential recruitment services for your organization.\n\nWe specialize in connecting top talent with innovative companies, and I believe we could be a valuable partner in helping you build your team.\n\nWould you be available for a brief call this week to discuss your current and upcoming hiring needs?\n\nBest regards,\n[Your Name]`
      : `Dear ${name},\n\nI hope you're doing well. I wanted to check in on our current recruitment projects and see how everything is progressing.\n\nIf you have any upcoming hiring requirements or would like to discuss expanding our current search, please let me know. I'm here to support your talent acquisition needs.\n\nLooking forward to hearing from you.\n\nBest regards,\n[Your Name]`;

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);

    toast({
      title: "Email Client Opened",
      description: `Opening email composer for ${name}`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Client Management
            </h1>
            <p className="text-slate-600 mt-1">
              Manage your active clients and prospect pipeline.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Prospect
            </Button>
            <Button
              onClick={() => setIsAddClientOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>

        <AddClientModal
          open={isAddClientOpen}
          onClose={() => setIsAddClientOpen(false)}
        />

        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="clients" className="text-lg">
              Active Clients
            </TabsTrigger>
            <TabsTrigger value="prospects" className="text-lg">
              Prospect Pipeline
            </TabsTrigger>
          </TabsList>

          {/* Active Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            {/* Search and Filters for Clients */}
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search clients..."
                      className="pl-10 bg-white/80"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
            {loading ? (
              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading clients...</span>
                  </div>
                </CardContent>
              </Card>
            ) : filteredClients.length === 0 ? (
              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-center text-gray-500">
                    {searchTerm ? "No clients found matching your search." : "No clients found."}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredClients.map((client) => (
                  <Card
                    key={client.id}
                    className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-16 h-16">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-bold">
                              {client.logo || generateLogo(client.name)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-slate-800">
                                {client.name}
                              </h3>
                              <Badge className={getStatusColor(client.status || "Active")}>
                                {client.status || "Active"}
                              </Badge>
                            </div>

                            <p className="text-slate-600 font-medium mb-3">
                              {client.industry || "N/A"}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Building2 className="w-4 h-4" />
                                <span className="font-medium">
                                  {client.contact_person || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <MapPin className="w-4 h-4" />
                                {client.location || "N/A"}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Mail className="w-4 h-4" />
                                {client.email || "N/A"}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Phone className="w-4 h-4" />
                                {client.phone || "N/A"}
                              </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm">
                              <div className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4 text-blue-500" />
                                <span className="font-medium text-slate-800">
                                  {client.active_jobs || 0}
                                </span>
                                <span className="text-slate-600">
                                  Active Jobs
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-green-500" />
                                <span className="font-medium text-slate-800">
                                  {client.total_hires || 0}
                                </span>
                                <span className="text-slate-600">
                                  Total Hires
                                </span>
                              </div>
                              <span className="text-slate-500">
                                Client since {formatDate(client.joined_date || client.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/80"
                            onClick={() =>
                              handleWhatsAppConnect(
                                client.phone || "",
                                client.contact_person || client.name,
                                false
                              )
                            }
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            WhatsApp
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/80"
                            onClick={() =>
                              handleEmailConnect(
                                client.email || "",
                                client.contact_person || client.name,
                                false
                              )
                            }
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Email
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/80"
                          >
                            View Jobs
                          </Button>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
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
                              <DropdownMenuItem
                                onClick={() =>
                                  handleWhatsAppConnect(
                                    client.phone || "",
                                    client.contact_person || client.name,
                                    false
                                  )
                                }
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                WhatsApp Connect
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleEmailConnect(
                                    client.email || "",
                                    client.contact_person || client.name,
                                    false
                                  )
                                }
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Email Connect
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditClient(client, false)}
                              >
                                Edit Client
                              </DropdownMenuItem>
                              <DropdownMenuItem>View Contract</DropdownMenuItem>
                              <DropdownMenuItem>Send Report</DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteClient(client.id, client.name)}
                              >
                                Delete Client
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Prospects Tab */}
          <TabsContent value="prospects" className="space-y-6">
            {/* Search and Filters for Prospects */}
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search prospects..."
                      className="pl-10 bg-white/80"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="bg-white/80">
                      Status
                    </Button>
                    <Button variant="outline" className="bg-white/80">
                      Industry
                    </Button>
                    <Button variant="outline" className="bg-white/80">
                      Source
                    </Button>
                    <Button variant="outline" className="bg-white/80">
                      Interest Level
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prospects List */}
            <div className="space-y-4">
              {prospectsList.map((prospect) => (
                <Card
                  key={prospect.id}
                  className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white text-lg font-bold">
                            {prospect.logo}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-slate-800">
                              {prospect.name}
                            </h3>
                            <Badge className={getStatusColor(prospect.status)}>
                              {prospect.status}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {getInterestStars(prospect.interest_level || 0)}
                            </div>
                          </div>

                          <p className="text-slate-600 font-medium mb-3">
                            {prospect.industry}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Building2 className="w-4 h-4" />
                              <span className="font-medium">
                                {prospect.contact_person || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <MapPin className="w-4 h-4" />
                              {prospect.location}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Mail className="w-4 h-4" />
                              {prospect.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="w-4 h-4" />
                              {prospect.phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-medium">
                                ${prospect.potential_value || 0}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <TrendingUp className="w-4 h-4" />
                              <span>Source: {prospect.source}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span className="text-slate-600">
                                Last Contact: {prospect.last_contact || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-orange-500" />
                              <span className="text-slate-600">
                                Next Follow-up: {prospect.next_follow_up || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/80"
                          onClick={() =>
                            handleWhatsAppConnect(
                              prospect.phone,
                              prospect.contact_person || prospect.name,
                              true
                            )
                          }
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          WhatsApp
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/80"
                          onClick={() =>
                            handleEmailConnect(
                              prospect.email,
                              prospect.contact_person || prospect.name,
                              true
                            )
                          }
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Email
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/80"
                        >
                          Schedule Call
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Convert to Client
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
                            <DropdownMenuItem
                              onClick={() =>
                                handleWhatsAppConnect(
                                  prospect.phone,
                                  prospect.contact_person || prospect.name,
                                  true
                                )
                              }
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              WhatsApp Connect
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleEmailConnect(
                                  prospect.email,
                                  prospect.contact_person || prospect.name,
                                  true
                                )
                              }
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Email Connect
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditClient(prospect, true)}
                            >
                              Edit Prospect
                            </DropdownMenuItem>
                            <DropdownMenuItem>Add Notes</DropdownMenuItem>
                            <DropdownMenuItem>Send Proposal</DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Mark as Lost
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {isEditFormOpen && editingClient && (
          <EditClientModal
            clientId={editingClient.id}
            open={isEditFormOpen}
            onOpenChange={() => {
              setIsEditFormOpen(false);
              setEditingClient(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default Clients;
