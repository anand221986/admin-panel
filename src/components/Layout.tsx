import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Home,
  Briefcase,
  Users,
  Building2,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    roles: ["admin", "Interviewer", "Recruiter"],
  },
  {
    title: "Jobs",
    url: "/jobs",
    icon: Briefcase,
    roles: ["admin", "Recruiter"],
  },
  {
    title: "Candidates",
    url: "/candidates",
    icon: Users,
    roles: ["admin", "Recruiter"],
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Building2,
    roles: ["admin", "Recruiter"],
  },
  {
    title: "Interviews",
    url: "/interviews",
    icon: Calendar,
    roles: ["Interviewer", "admin"],
  },
  {
    title: "Users",
    url: "/users",
    icon: BarChart3,
    roles: ["admin", "Recruiter"],
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    roles: ["Recruiter", "admin"],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    roles: ["admin", "Interviewer"],
  },
];

function AppSidebar() {
  const location = useLocation();
  const { getUserRoles, getUserDetails} = useAuth();
  const userRoles = getUserRoles();
  console.log(userRoles, "userRoles");

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.some((role) =>
      userRoles.map((r) => r.toLowerCase()).includes(role.toLowerCase())
    )
  );

  console.log(filteredMenuItems, "filteredMenuItems");

  const displayItems =
    filteredMenuItems.length > 0 ? filteredMenuItems : menuItems;
  return (
    <Sidebar className="border-r bg-slate-50/50 backdrop-blur-sm">
      <SidebarHeader className="border-b p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-800">XBeesHire</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {displayItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={cn(
                  "w-full justify-start transition-all duration-200 hover:bg-blue-50 hover:text-blue-700",
                  location.pathname === item.url &&
                    "bg-blue-100 text-blue-700 font-medium shadow-sm"
                )}
              >
                <Link
                  to={item.url}
                  className="flex items-center gap-3 px-3 py-2"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
 

// ✅ Rename the type to avoid conflict with the variable
interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { logout ,getUserDetails} = useAuth();
  
  const navigate = useNavigate();
  const userDetails = getUserDetails();
 
  console.log( userDetails.name,'userDetails')
  const [user] = useState({
    name: userDetails.name,
    avatarUrl:
      "https://ui-avatars.com/api/?name=John+Doe&background=4f46e5&color=fff",
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
    console.log("Logging out...");
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50/30">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <SidebarTrigger className="hover:bg-slate-100 transition-colors" />
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="px-2 py-4 h-10 rounded-lg overflow-hidden flex items-center gap-2 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    >
                      <img
                        src={user.avatarUrl}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-medium text-slate-700 hidden sm:inline">
                        Anand Gupta
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <div className="flex-1 p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
