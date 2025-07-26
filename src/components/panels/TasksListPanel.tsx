import { useEffect, useState } from "react";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface TaskItem {
  id: number;
  candidate_id: number;
  author_id: number;
  task: string;
  created_at: string;
  updated_at: string;
}

interface TasksListPanelProps {
  candidateId: number;
  authorId: number;
  refreshTrigger?: boolean;
}

const API_BASE = "http://51.20.181.155:3000";

export function TasksListPanel({
  candidateId,
  authorId,
  refreshTrigger,
}: TasksListPanelProps) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [adding, setAdding] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<string>("");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/candidate/task/${candidateId}`);
      if (res.data.status) {
        setTasks(res.data.result);
      } else {
        toast.error(res.data.message || "Failed to load tasks.");
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setTasks([]);
      } else {
        console.error("Error fetching tasks", err);
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Server error while fetching tasks."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [candidateId, refreshTrigger]);

  const updateTask = async (taskId: number, taskText: string) => {
    try {
      await axios.post(`${API_BASE}/candidate/task/${taskId}`, {
        task: taskText,
      });
      toast.success("Task updated successfully.");
      setEditingId(null);
      setEditingTask("");
      fetchTasks();
    } catch (err: any) {
      console.error(`Error updating task ${taskId}`, err);
      toast.error(
        err.response?.data?.message || err.message || "Failed to update task."
      );
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) {
      toast.error("Please enter a task before adding.");
      return;
    }
    setAdding(true);
    try {
      const res = await axios.post(`${API_BASE}/candidate/addCandidateTask`, {
        candidate_id: candidateId,
        author_id: authorId,
        task: newTask,
      });
      if (res.data.status) {
        toast.success(res.data.message || "Task added successfully.");
        setNewTask("");
        fetchTasks();
      } else {
        toast.error(res.data.message || "Failed to add task.");
      }
    } catch (err: any) {
      console.error("Error adding task", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Server error while adding task."
      );
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      <form
        className="my-5 flex space-x-2"
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
      >
        <Input
          placeholder="Enter new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" className="bg-blue-500" disabled={adding}>
          {adding ? "Adding…" : "Add Task"}
        </Button>
      </form>

      <ScrollArea className="h-[400px]">
        {loading ? (
          <div>Loading tasks...</div>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex justify-between items-center bg-white py-2 px-4 rounded-lg shadow-sm mb-4"
            >
              <div className="flex-1 flex items-center space-x-3">
                {task.updated_at !== task.created_at ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}

                {editingId === task.id ? (
                  <Input
                    className="flex-1"
                    value={editingTask}
                    onChange={(e) => setEditingTask(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        updateTask(task.id, editingTask);
                      }
                    }}
                  />
                ) : (
                  <span className="text-sm text-gray-800 flex-1">
                    {task.task}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-3">
                {editingId === task.id ? (
                  <>
                    <Button
                      size="sm"
                      className="bg-blue-500"
                      onClick={() => updateTask(task.id, editingTask)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Badge variant="outline">By {task.author_id}</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(task.id);
                        setEditingTask(task.task);
                      }}
                    >
                      Edit
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No tasks available.</div>
        )}
      </ScrollArea>
    </div>
  );
}
