// src/components/SettingsTabs.jsx
import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  User,
  Building,
  Bell,
  Mail,
  FileText,
  Settings as SettingsIcon,
  ListChecks,
  Users,
  Shield,
  Save,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import TemplatesManager from "@/components/panels/TemplatesSection";
import IntegrationPage from "@/components/panels/IntegrationPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { StatusSettingsTab } from "@/components/StatusSettingsTab";
import { RolePermissionsTab } from "@/components/RolePermissionsTab";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState, useMemo } from "react";
import CandidateViewList from "@/components/UserViewTable";
import axios from "axios";
interface CandidateForm {
  id: number;
  job_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  headline: string | null;
  status: string;
  address: string;
  experience: string;
  photo_url: string | null;
  education: string;
  summary: string | null;
  resume_url: string;
  cover_letter: string | null;
  rating: string | null;
  hmapproval: string;
  recruiter_status: string;
  current_company: string | null;
  current_ctc: string | null;
  expected_ctc: string | null;
  skill: string[];
  college: string | null;
  degree: string | null;
  created_at: string;
  updated_at: string;
  linkedinprofile: string;
  institutiontier: string;
  companytier: string;
  role: string;
  created_dt: string;
  agency_id:number;
}
const API_BASE_URL = "http://16.171.117.2:3000";
const SettingsTabs = () => {
    const [candidates, setCandidates] = useState<CandidateForm[]>([]);
      const [loading, setLoading] = useState(true);
        useEffect(() => {
    fetchCandidates();
  }, []);
   const fetchCandidates = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/user/getAllUsers`
      );
      setCandidates(data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid w-full grid-cols-9 bg-white/60 backdrop-blur-sm">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="w-4 h-4" />
         Users
        </TabsTrigger>
        <TabsTrigger value="company" className="flex items-center gap-2">
          <Building className="w-4 h-4" />
          Jobs
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Candidate
        </TabsTrigger>
        {/* <TabsTrigger value="email" className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email
        </TabsTrigger>
        <TabsTrigger value="templates" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Templates
        </TabsTrigger>
        <TabsTrigger value="integrations" className="flex items-center gap-2">
          <SettingsIcon className="w-4 h-4" />
          Integrations
        </TabsTrigger>
        <TabsTrigger value="status" className="flex items-center gap-2">
          <ListChecks className="w-4 h-4" />
          Status
        </TabsTrigger>
        <TabsTrigger value="roles" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Roles
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Security
        </TabsTrigger> */}
      </TabsList>

      {/* Profile Tab */}
      <TabsContent value="profile">
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-800">
              User List
            </CardTitle>
          </CardHeader>
   <CandidateViewList
           loading={loading}
           candidates={candidates}
           fetchCandidates={fetchCandidates}
         />
        </Card>
      </TabsContent>
                
          <TabsContent value="company">
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800">
                  Company Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="TalentFlow Inc."
                      className="bg-white/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://talentflow.com"
                      className="bg-white/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select>
                      <SelectTrigger id="industry" className="bg-white/80">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-sm">
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Company Size</Label>
                    <Select>
                      <SelectTrigger id="size" className="bg-white/80">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-sm">
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-1000">
                          201-1000 employees
                        </SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Company address..."
                    className="bg-white/80"
                    rows={3}
                  />
                </div>

                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

       
          <TabsContent value="notifications">
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800">
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newApplications">New Applications</Label>
                      <p className="text-sm text-slate-600">
                        Get notified when new applications are received
                      </p>
                    </div>
                    <Switch id="newApplications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="interviewReminders">
                        Interview Reminders
                      </Label>
                      <p className="text-sm text-slate-600">
                        Receive reminders before scheduled interviews
                      </p>
                    </div>
                    <Switch id="interviewReminders" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="candidateUpdates">
                        Candidate Updates
                      </Label>
                      <p className="text-sm text-slate-600">
                        Get notified when candidates update their status
                      </p>
                    </div>
                    <Switch id="candidateUpdates" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weeklyReports">Weekly Reports</Label>
                      <p className="text-sm text-slate-600">
                        Receive weekly recruitment analytics reports
                      </p>
                    </div>
                    <Switch id="weeklyReports" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="systemUpdates">System Updates</Label>
                      <p className="text-sm text-slate-600">
                        Get notified about system maintenance and updates
                      </p>
                    </div>
                    <Switch id="systemUpdates" defaultChecked />
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

        
          <TabsContent value="email">
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800">
                  Email Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicationReceived">
                      Application Received
                    </Label>
                    <Textarea
                      id="applicationReceived"
                      placeholder="Email template for when applications are received..."
                      className="bg-white/80"
                      rows={4}
                      defaultValue="Dear {candidate_name}, Thank you for your application for the {job_title} position..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interviewInvite">
                      Interview Invitation
                    </Label>
                    <Textarea
                      id="interviewInvite"
                      placeholder="Email template for interview invitations..."
                      className="bg-white/80"
                      rows={4}
                      defaultValue="Dear {candidate_name}, We would like to invite you for an interview for the {job_title} position..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rejection">Rejection Email</Label>
                    <Textarea
                      id="rejection"
                      placeholder="Email template for rejection notifications..."
                      className="bg-white/80"
                      rows={4}
                      defaultValue="Dear {candidate_name}, Thank you for your interest in the {job_title} position..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="offer">Job Offer</Label>
                    <Textarea
                      id="offer"
                      placeholder="Email template for job offers..."
                      className="bg-white/80"
                      rows={4}
                      defaultValue="Dear {candidate_name}, We are pleased to offer you the position of {job_title}..."
                    />
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Templates
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

        
          <TabsContent value="templates">
            <TemplatesManager />
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <IntegrationPage />
          </TabsContent>

          
          <TabsContent value="status">
            <StatusSettingsTab />
          </TabsContent>

          {/* Role-Based Access Tab */}
          <TabsContent value="roles">
            <RolePermissionsTab />
          </TabsContent>
    </Tabs>
  );
};

export default SettingsTabs;
