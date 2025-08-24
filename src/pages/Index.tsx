import Layout from "@/components/Layout";
import MetricCard from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Briefcase,
  Building2,
  TrendingUp,
  Plus,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useEffect, useState } from "react";
import PostNewJobModal from "@/components/modals/PostNewJobModal";
import AddClientModal from "@/components/modals/AddClientModal";
import axios from "axios";
const API_BASE_URL = "http://16.171.117.2:3000";

type Metric = {
  title: string;
  value: string | number;
  change: string;
  icon: any;
  trend: "up" | "down";
};
const metricsData = [
  {
    title: "Active Clients",
    value: 12,
    change: "+2 new this month",
    icon: Building2,
    trend: "up" as const,
  },
  {
    title: "Active Jobs",
    value: 24,
    change: "+12% from last month",
    icon: Briefcase,
    trend: "up" as const,
  },
  {
    title: "Total Candidates",
    value: 1847,
    change: "+5% from last month",
    icon: Users,
    trend: "up" as const,
  },
  {
    title: "Placement Rate",
    value: "23%",
    change: "+3% from last quarter",
    icon: TrendingUp,
    trend: "up" as const,
  },
];

const chartData = [
  { month: "Jan", applications: 120, hires: 8, clients: 8 },
  { month: "Feb", applications: 150, hires: 12, clients: 9 },
  { month: "Mar", applications: 180, hires: 15, clients: 10 },
  { month: "Apr", applications: 220, hires: 18, clients: 11 },
  { month: "May", applications: 190, hires: 14, clients: 12 },
  { month: "Jun", applications: 240, hires: 22, clients: 12 },
];

const recentActivities = [
  {
    id: 1,
    action: "New client onboarded",
    candidate: "",
    job: "TechCorp Solutions",
    time: "1 hour ago",
    type: "client",
  },
  {
    id: 2,
    action: "Candidate placed",
    candidate: "Sarah Johnson",
    job: "Frontend Developer at TechCorp",
    time: "2 hours ago",
    type: "hire",
  },
  {
    id: 3,
    action: "Interview completed",
    candidate: "Mike Chen",
    job: "Backend Engineer at HealthcarePlus",
    time: "4 hours ago",
    type: "interview",
  },
  {
    id: 4,
    action: "New job received",
    candidate: "",
    job: "Product Manager at FinanceFlow",
    time: "6 hours ago",
    type: "job",
  },
  {
    id: 5,
    action: "Application received",
    candidate: "Emma Davis",
    job: "UX Designer at Creative Studios",
    time: "1 day ago",
    type: "application",
  },
];

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [metricsData, setMetricsData] = useState<Metric[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    fetchstats();
  }, []);
  const fetchstats = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/common/getDashboardStats`
      );
      setMetricsData(data.result);
      console.log(data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Agency Dashboard
            </h1>
            <p className="text-slate-600 mt-1">
              Welcome back! Here's how your recruiting agency is performing.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsClientModalOpen(true)}
              variant="outline"
              className="bg-white/80"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Add Client
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </div>
        </div>

        <AddClientModal
          open={isClientModalOpen}
          onClose={() => setIsClientModalOpen(false)}
        />

        <PostNewJobModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricsData.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-800">
                Monthly Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="applications"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    name="Applications"
                  />
                  <Bar
                    dataKey="hires"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                    name="Successful Placements"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-800">Client Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="clients"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                    name="Active Clients"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-800">
              Recent Agency Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {activity.type === "application" && (
                      <Clock className="w-5 h-5 text-blue-500" />
                    )}
                    {activity.type === "interview" && (
                      <Users className="w-5 h-5 text-purple-500" />
                    )}
                    {activity.type === "hire" && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {activity.type === "job" && (
                      <Briefcase className="w-5 h-5 text-orange-500" />
                    )}
                    {activity.type === "client" && (
                      <Building2 className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">
                      {activity.action}
                    </p>
                    <p className="text-sm text-slate-600">
                      {activity.candidate && `${activity.candidate} • `}
                      {activity.job}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs text-slate-500">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;

