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

interface RecruiterStatus {
  name: string;
  color: string;
  is_active: boolean;
}

interface Status {
  id: number;
  type: "candidate" | "recruiter";
  name: string;
  color: string;
  is_active: boolean;
  recruiter_status: RecruiterStatus[];
  created_at?: string;
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
  const [dialogMode, setDialogMode] = useState<
    "parent_add" | "parent_edit" | "child_add" | "child_edit"
  >("parent_add");
  const [currentStatus, setCurrentStatus] = useState<Status | null>(null);
  const [currentRecruiterStatusIndex, setCurrentRecruiterStatusIndex] =
    useState<number | null>(null);
  const [statusName, setStatusName] = useState("");
  const [statusColor, setStatusColor] = useState("#808080");

  const fetchStatuses = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/candidate/getAllStatus`
      );
      if (Array.isArray(response.data.result)) {
        const candidateStatuses = response.data.result.filter(
          (s: Status) => s.type === "candidate"
        );
        setStatuses(candidateStatuses);
      } else {
        setStatuses([]);
      }
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
      toast.error("Failed to load statuses.");
      setStatuses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const handleOpenDialog = (
    mode: "parent_add" | "parent_edit" | "child_add" | "child_edit",
    parentStatus?: Status,
    childIndex?: number
  ) => {
    setDialogMode(mode);
    setCurrentStatus(parentStatus || null);
    setCurrentRecruiterStatusIndex(childIndex ?? null);

    if (mode === "parent_edit" && parentStatus) {
      setStatusName(parentStatus.name);
      setStatusColor(parentStatus.color);
    } else if (
      mode === "child_edit" &&
      parentStatus &&
      childIndex !== undefined
    ) {
      const childStatus = parentStatus.recruiter_status[childIndex];
      setStatusName(childStatus.name);
      setStatusColor(childStatus.color);
    } else {
      setStatusName("");
      setStatusColor("#808080");
    }
    setIsDialogOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!statusName.trim()) {
      toast.error("Status name cannot be empty.");
      return;
    }
    setIsSaving(true);

    let payload: any = {};
    let url = "";
    let method: "post" | "put" = "put";

    if (dialogMode === "parent_edit") {
      payload = { name: statusName, color: statusColor };
      url = `${API_BASE_URL}/candidate/status/${currentStatus!.id}`;
      method = "put";
    } else if (dialogMode === "parent_add") {
      payload = {
        type: "candidate",
        name: statusName,
        color: statusColor,
        is_active: true,
        recruiter_status: [],
      };
      url = `${API_BASE_URL}/candidate/createStatus`;
      method = "post";
    } else if (
      (dialogMode === "child_add" || dialogMode === "child_edit") &&
      currentStatus
    ) {
      const updatedRecruiterStatuses = [
        ...(currentStatus.recruiter_status || []),
      ];
      const newRecruiterStatus: RecruiterStatus = {
        name: statusName,
        color: statusColor,
        is_active:
          dialogMode === "child_edit"
            ? updatedRecruiterStatuses[currentRecruiterStatusIndex!].is_active
            : true,
      };

      if (dialogMode === "child_edit") {
        updatedRecruiterStatuses[currentRecruiterStatusIndex!] =
          newRecruiterStatus;
      } else {
        updatedRecruiterStatuses.push(newRecruiterStatus);
      }

      const { id, created_at, ...restOfStatus } = currentStatus;
      payload = { ...restOfStatus, recruiter_status: updatedRecruiterStatuses };
      url = `${API_BASE_URL}/candidate/status/${currentStatus.id}`;
      method = "put";
    }

    try {
      await axios[method](url, payload);
      toast.success("Status saved successfully!");
      fetchStatuses();
    } catch (error) {
      console.error("Failed to save status:", error);
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteStatus = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/candidate/status/${id}`);
      toast.success("Status deleted successfully!");
      setStatuses((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete status:", error);
      toast.error("Failed to delete status.");
    }
  };

  const handleDeleteRecruiterStatus = async (
    parentStatus: Status,
    indexToDelete: number
  ) => {
    const updatedRecruiterStatuses = parentStatus.recruiter_status.filter(
      (_, index) => index !== indexToDelete
    );

    const { id, created_at, ...restOfStatus } = parentStatus;
    const payload = {
      ...restOfStatus,
      recruiter_status: updatedRecruiterStatuses,
    };

    try {
      await axios.put(
        `${API_BASE_URL}/candidate/status/${parentStatus.id}`,
        payload
      );
      toast.success("Recruiter status deleted successfully!");
      fetchStatuses();
    } catch (error) {
      console.error("Failed to delete recruiter status:", error);
      toast.error("Failed to delete recruiter status.");
    }
  };

  const handleToggleActive = async (
    statusToToggle: Status,
    childIndex?: number
  ) => {
    const originalStatuses = JSON.parse(JSON.stringify(statuses));

    const newStatuses = statuses.map((s) => {
      if (s.id !== statusToToggle.id) {
        return s;
      }
      if (childIndex !== undefined) {
        const updatedRecruiterStatuses = s.recruiter_status.map((rs, index) =>
          index === childIndex ? { ...rs, is_active: !rs.is_active } : rs
        );
        return { ...s, recruiter_status: updatedRecruiterStatuses };
      }
      return { ...s, is_active: !s.is_active };
    });
    setStatuses(newStatuses);

    let payload;
    const updatedStatus = newStatuses.find((s) => s.id === statusToToggle.id)!;

    if (childIndex !== undefined) {
      const { id, created_at, ...restOfStatus } = updatedStatus;
      payload = restOfStatus;
    } else {
      payload = { is_active: updatedStatus.is_active };
    }

    try {
      await axios.put(
        `${API_BASE_URL}/candidate/status/${statusToToggle.id}`,
        payload
      );

      const wasActivated =
        childIndex !== undefined
          ? updatedStatus.recruiter_status[childIndex].is_active
          : updatedStatus.is_active;
      toast.success(
        `Status successfully ${wasActivated ? "activated" : "deactivated"}.`
      );
    } catch (error) {
      console.error("Failed to toggle status:", error);
      toast.error("Update failed. Reverting changes.");
      setStatuses(originalStatuses);
    }
  };

  const renderDialog = () => {
    let title = "Add New Candidate Status";
    if (dialogMode === "parent_edit") title = "Edit Candidate Status";
    if (dialogMode === "child_add")
      title = `Add Recruiter Status for "${currentStatus?.name}"`;
    if (dialogMode === "child_edit")
      title = `Edit Recruiter Status in "${currentStatus?.name}"`;

    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Customize the status name and choose a color.
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
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manage Custom Statuses</CardTitle>
        </CardHeader>
        <CardContent>
          <StatusRowSkeleton />
          <StatusRowSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-slate-800 text-md">
            Manage Candidate Statuses
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenDialog("parent_add")}
            className="hover:bg-slate-50 h-8 px-3 text-xs"
          >
            <Plus className="w-3 h-3 mr-2" /> Add Candidate Status
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statuses.map((status) => (
            <div key={status.id} className="bg-slate-50/80 p-3 rounded-lg">
              <div className="group flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Switch
                    checked={status.is_active}
                    onCheckedChange={() => handleToggleActive(status)}
                  />
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span
                      className={`font-medium text-sm ${
                        status.is_active
                          ? "text-slate-800"
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
                    onClick={() => handleOpenDialog("parent_edit", status)}
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
                          This will permanently delete the "{status.name}"
                          status.
                        </AlertDialogDesc>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteStatus(status.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="pl-8 pt-3 space-y-2">
                {status.recruiter_status?.map((rs, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between pl-4 border-l-2"
                  >
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={rs.is_active}
                        onCheckedChange={() =>
                          handleToggleActive(status, index)
                        }
                        className="h-4 w-8 [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-4"
                      />
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: rs.color }}
                        />
                        <span
                          className={`text-xs ${
                            rs.is_active
                              ? "text-slate-600"
                              : "text-slate-400 line-through"
                          }`}
                        >
                          {rs.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleOpenDialog("child_edit", status, index)
                        }
                        className="h-6 w-6"
                      >
                        <Edit className="w-3 h-3 text-slate-500" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDesc>
                              This will delete the "{rs.name}" recruiter status.
                            </AlertDialogDesc>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDeleteRecruiterStatus(status, index)
                              }
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
                <div className="pl-4 border-l-2">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleOpenDialog("child_add", status)}
                    className="text-xs h-8 text-blue-600"
                  >
                    <Plus className="w-3 h-3 mr-1.5" /> Add Recruiter Status
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {renderDialog()}
      </CardContent>
    </Card>
  );
};
