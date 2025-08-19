import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription as AlertDialogDesc,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";

const API_BASE_URL = "http://16.171.117.2:3000";

interface Status {
  id: number;
  type: "candidate" | "recruiter";
  name: string;
  color: string;
  is_active: boolean;
}

interface ApiResponse {
  result: Status;
}

const PRESET_COLORS = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#f97316",
  "#8b5cf6",
  "#ec4899",
  "#64748b",
];

const StatusRowSkeleton = () => (
  <div className="flex items-center justify-between p-2.5 space-x-4">
    <div className="flex items-center gap-4">
      <div className="h-6 w-11 rounded-full bg-slate-200 animate-pulse" />
      <div className="w-24 h-4 rounded bg-slate-200 animate-pulse" />
    </div>
    <div className="w-16 h-8 rounded bg-slate-200 animate-pulse" />
  </div>
);

export const StatusSettingsTab = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<Status | null>(null);
  const [statusName, setStatusName] = useState("");
  const [statusColor, setStatusColor] = useState("#000000");
  const [statusType, setStatusType] = useState<"candidate" | "recruiter">(
    "candidate"
  );

  const fetchStatuses = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/candidate/getAllStatus`
      );
      if (Array.isArray(response.data.result)) {
        setStatuses(response.data.result);
      } else {
        setStatuses([]);
      }
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
      toast.error("Failed to load statuses. Check backend connection.");
      setStatuses([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchStatuses();
  }, []);
  const handleOpenAddDialog = (type: "candidate" | "recruiter") => {
    setEditingStatus(null);
    setStatusName("");
    setStatusColor("#808080");
    setStatusType(type);
    setIsDialogOpen(true);
  };
  const handleOpenEditDialog = (status: Status) => {
    setEditingStatus(status);
    setStatusName(status.name);
    setStatusColor(status.color);
    setStatusType(status.type);
    setIsDialogOpen(true);
  };
  const handleSaveStatus = async () => {
    if (!statusName.trim()) {
      toast.error("Status name cannot be empty.");
      return;
    }
    setIsSaving(true);
    const originalStatuses = [...statuses];
    const tempId = !editingStatus ? Date.now() : null;
    if (editingStatus) {
      setStatuses(
        statuses.map((s) =>
          s.id === editingStatus.id
            ? { ...s, name: statusName, color: statusColor }
            : s
        )
      );
    } else {
      const newStatus: Status = {
        id: tempId!,
        type: statusType,
        name: statusName,
        color: statusColor,
        is_active: true,
      };
      setStatuses([...statuses, newStatus]);
    }
    setIsDialogOpen(false);
    const payload = {
      type: statusType,
      name: statusName,
      color: statusColor,
      is_active: editingStatus ? editingStatus.is_active : true,
    };
    try {
      if (editingStatus) {
        await axios.put(
          `${API_BASE_URL}/candidate/status/${editingStatus.id}`,
          payload
        );
        toast.success("Status updated successfully!");
      } else {
        const response = await axios.post<ApiResponse>(
          `${API_BASE_URL}/candidate/createStatus`,
          payload
        );
        const savedStatus = response.data.result;
        setStatuses((currentStatuses) =>
          currentStatuses.map((s) => (s.id === tempId ? savedStatus : s))
        );
        toast.success("Status created successfully!");
      }
    } catch (error) {
      console.error("Failed to save status:", error);
      toast.error("An error occurred. Reverting changes.");
      setStatuses(originalStatuses);
    } finally {
      setIsSaving(false);
    }
  };
  const handleDeleteStatus = async (id: number) => {
    const originalStatuses = [...statuses];
    setStatuses(statuses.filter((s) => s.id !== id));
    try {
      await axios.delete(`${API_BASE_URL}/candidate/status/${id}`);
      toast.success("Status deleted successfully!");
    } catch (error) {
      console.error("Failed to delete status:", error);
      toast.error("Failed to delete. Reverting changes.");
      setStatuses(originalStatuses);
    }
  };
  const handleToggleActive = async (status: Status) => {
    const originalStatuses = [...statuses];
    setStatuses(
      statuses.map((s) =>
        s.id === status.id ? { ...s, is_active: !s.is_active } : s
      )
    );
    const payload = { ...status, is_active: !status.is_active };
    try {
      await axios.put(`${API_BASE_URL}/candidate/status/${status.id}`, payload);
      toast.success(
        `Status successfully ${
          payload.is_active ? "activated" : "deactivated"
        }.`
      );
    } catch (error) {
      console.error("Failed to toggle status:", error);
      toast.error("Could not update status activation. Reverting changes.");
      setStatuses(originalStatuses);
    }
  };
  const renderStatusList = (type: "candidate" | "recruiter") => {
    const filteredStatuses = statuses.filter((s) => s.type === type);
    if (filteredStatuses.length === 0) {
      return (
        <div className="text-center text-xs text-slate-500 py-8 border-2 border-dashed rounded-lg">
          No {type} statuses found.
        </div>
      );
    }
    return (
      <div className="space-y-1">
        {filteredStatuses.map((status) => (
          <div
            key={status.id}
            className="group flex items-center justify-between p-2.5 rounded-md transition-colors hover:bg-slate-100/80"
          >
            <div className="flex items-center gap-4">
              <Switch
                checked={status.is_active}
                onCheckedChange={() => handleToggleActive(status)}
                className="data-[state=checked]:bg-blue-500 h-4 w-8 [&>span]:h-3 [&>span]:w-4 [&>span]:data-[state=checked]:translate-x-3"
              />
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <span
                  className={`font-medium text-xs ${
                    status.is_active
                      ? "text-slate-700"
                      : "text-slate-400 line-through"
                  }`}
                >
                  {status.name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleOpenEditDialog(status)}
                className="h-7 w-7"
              >
                <Edit className="w-3.5 h-3.5 text-slate-500" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDesc>
                      This will permanently delete the "{status.name}" status.
                      This action cannot be undone.
                    </AlertDialogDesc>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteStatus(status.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">
            Manage Custom Statuses
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-6 w-40 bg-slate-200 rounded animate-pulse" />
            <div className="space-y-2">
              <StatusRowSkeleton />
              <StatusRowSkeleton />
              <StatusRowSkeleton />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-6 w-40 bg-slate-200 rounded animate-pulse" />
            <div className="space-y-2">
              <StatusRowSkeleton />
              <StatusRowSkeleton />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-800 text-md">
          Manage Custom Statuses
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-sm text-slate-700">
              Candidate Statuses
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenAddDialog("candidate")}
              className="hover:bg-slate-50 h-8 px-3 text-xs"
            >
              <Plus className="w-3 h-3 mr-2" /> Add Status
            </Button>
          </div>
          {renderStatusList("candidate")}
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-sm text-slate-700">
              Recruiter Statuses
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenAddDialog("recruiter")}
              className="hover:bg-slate-50 h-8 px-3 text-xs"
            >
              <Plus className="w-3 h-3 mr-2" /> Add Status
            </Button>
          </div>
          {renderStatusList("recruiter")}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>
                {editingStatus ? "Edit" : "Add New"}{" "}
                <span className="capitalize">{statusType}</span> Status
              </DialogTitle>
              <DialogDescription>
                Customize the status name and choose a color. Click save when
                you're done.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="statusName">Status Name</Label>
                <Input
                  id="statusName"
                  value={statusName}
                  onChange={(e) => setStatusName(e.target.value)}
                  placeholder="e.g., Screening"
                />
              </div>
              <div className="grid gap-2">
                <Label>Color</Label>
                <div className="flex items-center gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-9 w-9 p-0 flex-shrink-0"
                        style={{ backgroundColor: statusColor }}
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-none">
                      <HexColorPicker
                        color={statusColor}
                        onChange={setStatusColor}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    value={statusColor}
                    onChange={(e) => setStatusColor(e.target.value)}
                    className="flex-grow"
                    placeholder="#2563eb"
                  />
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setStatusColor(color)}
                      className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
                        statusColor.toLowerCase() === color.toLowerCase()
                          ? "border-blue-500"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveStatus}
                disabled={isSaving}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? "Saving..." : "Save Status"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
