import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

const API_BASE = "http://16.171.117.2:3000";

interface CallEntry {
  id: number;
  timestamp: string;
  summary: string;
}

interface CallLogPanelProps {
  candidateId: number;
}

export default function CallLogPanel({ candidateId }: CallLogPanelProps) {
  const [calls, setCalls] = useState<CallEntry[]>([]);
  const [newSummary, setNewSummary] = useState("");

  const fetchCalls = async () => {
    try {
      const res = await axios.get<{ result: CallEntry[] }>(
        `${API_BASE}/candidate/callLog/${candidateId}`
      );
      setCalls(res.data.result || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addCall = async () => {
    if (!newSummary.trim()) return;
    try {
      await axios.post(`${API_BASE}/candidate/callLog/${candidateId}`, {
        summary: newSummary.trim(),
      });
      setNewSummary("");
      fetchCalls();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, [candidateId]);

  return (
    <div className="flex flex-col h-full py-2 space-y-4">
      <h2 className="text-lg font-semibold">Call Log</h2>

      <div className="space-y-2">
        <Textarea
          placeholder="Enter call summary…"
          value={newSummary}
          onChange={(e) => setNewSummary(e.target.value)}
        />
        <Button onClick={addCall} disabled={!newSummary.trim()}>
          Add Call
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {calls.length === 0 ? (
          <p className="text-sm text-slate-500">No calls logged yet.</p>
        ) : (
          calls.map((c) => (
            <div key={c.id} className="border rounded p-3 bg-slate-100">
              <div className="text-xs text-slate-400 mb-1">
                {new Date(c.timestamp).toLocaleString()}
              </div>
              <p className="text-sm">{c.summary}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
