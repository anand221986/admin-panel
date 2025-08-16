import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Phone } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

export interface CallItem {
  id: number;
  candidate_id: number;
  author_id: number;
  meeting_date: string;
  meeting_type: string;
  call_outcome: string;
  call_notes: string;
  created_at: string;
  updated_at: string;
}

interface CallsListPanelProps {
  calls?: CallItem[]; // fallback prop (optional)
  candidateId: number;
}

const API_BASE = "http://13.51.235.31:3000";

export function CallsListPanel({ calls = [], candidateId }: CallsListPanelProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [sampleCalls, setSampleCalls] = useState<CallItem[]>([]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/candidate/calls/${candidateId}`);
      if (res.data.status) {
        const result: CallItem[] = res.data.result || [];
        setSampleCalls(result);
      } else {
        toast.error(res.data.message || "Failed to load call logs.");
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setSampleCalls([]);
      } else {
        console.error("Error fetching calls", err);
        toast.error(
          err.response?.data?.message || err.message || "Server error while fetching calls."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [candidateId]);

  // Use sampleCalls if available, else fallback to passed `calls` prop
  const displayCalls = sampleCalls.length ? sampleCalls : calls;

  return (
    <ScrollArea className="h-[400px] p-2">
      {loading ? (
        <p className="text-sm text-gray-500 text-center">Loading call logs...</p>
      ) : displayCalls.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">No call logs found.</p>
      ) : (
        displayCalls.map((call) => (
          <div
            key={call.id}
            className="flex flex-col space-y-1 bg-white p-4 rounded-lg shadow-sm mb-4"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">
                  {new Date(call.created_at).toLocaleString()}
                </span>
                <Badge variant="outline" className="capitalize">
                  {call.call_outcome}
                </Badge>
              </div>
              <span className="text-sm font-medium text-gray-700">
                Recruiter #{call.author_id}
              </span>
            </div>
            <p className="text-gray-800 text-sm mt-2">{call.call_notes}</p>
          </div>
        ))
      )}
    </ScrollArea>
  );
}
