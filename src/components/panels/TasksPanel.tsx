import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PhoneCall } from "lucide-react";
import { toast } from "sonner";

interface TasksPanelProps {
  candidateId: number;
  authorId: number;
  onTaskAdded?: () => void;
}

export function TasksPanel({
  candidateId,
  authorId,
  onTaskAdded,
}: TasksPanelProps) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [associatedWith, setAssociatedWith] = useState("Zenith Accufore");
  const [assignedTo, setAssignedTo] = useState("anand gupta");
  const [type, setType] = useState("call");
  const [dueDate, setDueDate] = useState("2025-07-03");
  const [reminderDate, setReminderDate] = useState("2025-07-03");
  const [reminderTime, setReminderTime] = useState("09:00");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!taskName.trim()) {
      toast.error("Please provide a task name.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        candidate_id: candidateId,
        author_id: authorId,
        task: taskName,
      };
      const res = await axios.post(
        `http://16.171.117.2:3000/candidate/addCandidateTask`,
        payload
      );
      if (res.data.status) {
        toast.success(res.data.message || "Task created successfully.");
        setTaskName("");
        setDescription("");
        onTaskAdded?.();
      } else {
        toast.error(res.data.message || "Failed to create task.");
      }
    } catch (err: any) {
      console.error("Error creating task", err);
      toast.error(
        err.response?.data?.message || err.message || "Server error."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col border rounded-lg bg-white shadow-sm mb-4">
      <div className="flex items-center px-4 py-2 border-b">
        <span className="text-2xl mr-2">✨</span>
        <span className="font-semibold">XBeeAI</span>
      </div>

      <div className="px-4 py-2 border-b">
        <Input
          placeholder="Name your task..."
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="text-sm"
        />
      </div>

      <div className="px-4 py-2 border-b">
        <Textarea
          rows={4}
          placeholder="Enter details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-sm"
        />
      </div>

      <div className="px-4 py-2 border-b overflow-x-auto scrollbar-custom">
        <div className="inline-flex items-center space-x-4 whitespace-nowrap">
          <Select onValueChange={() => {}}>
            <SelectTrigger className="w-auto text-sm">
              <SelectValue placeholder="Div" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="div">Div</SelectItem>
              <SelectItem value="p">Paragraph</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={() => {}}>
            <SelectTrigger className="w-auto text-sm">
              <SelectValue placeholder="13px" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12px">12px</SelectItem>
              <SelectItem value="13px">13px</SelectItem>
              <SelectItem value="14px">14px</SelectItem>
            </SelectContent>
          </Select>

          <PhoneCall className="cursor-pointer" size={18} />
        </div>
      </div>

      <div className="px-4 py-4 flex flex-wrap gap-4 border-b">
        <div className="flex flex-row gap-6 w-full">
          <div>
            <label className="block text-xs font-medium mb-1">
              Associated with
            </label>
            <div className="inline-flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1 text-sm">
              <span>{associatedWith}</span>
              <button
                onClick={() => setAssociatedWith("")}
                className="text-gray-500"
              >
                ×
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              Assigned to
            </label>
            <div className="inline-flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1 text-sm">
              <span>{assignedTo}</span>
              <button
                onClick={() => setAssignedTo("")}
                className="text-gray-500"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-6 w-full">
          <div>
            <label className="block text-xs font-medium mb-1">Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full text-sm">
                <div className="flex items-center space-x-2">
                  {type === "call" && <PhoneCall size={16} />}
                  <SelectValue placeholder="Select type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="task">Task</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Due date</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <label className="block text-xs font-medium mb-1">
              Email reminder
            </label>
            <div className="flex gap-4 items-center">
              <Input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="text-sm"
              />
              <Input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 flex justify-end">
        <Button
          disabled={saving}
          onClick={handleSave}
          className="text-sm bg-blue-500"
        >
          {saving ? "Saving…" : "Save Task"}
        </Button>
      </div>
    </div>
  );
}
