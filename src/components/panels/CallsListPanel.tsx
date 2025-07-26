import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Phone } from "lucide-react";

export interface CallItem {
  id: string;
  time: string;
  outcome: string;
  notes: string;
  caller: string;
}

interface CallsListPanelProps {
  calls?: CallItem[];
}

const sampleCalls: CallItem[] = [
  {
    id: "cl1",
    time: "2025-06-26 10:00 AM",
    outcome: "Connected",
    notes: "Discussed project requirements and next steps.",
    caller: "Alice",
  },
  {
    id: "cl2",
    time: "2025-06-25 03:30 PM",
    outcome: "Voicemail",
    notes: "Left a message regarding interview schedule.",
    caller: "Bob",
  },
  {
    id: "cl3",
    time: "2025-06-24 01:15 PM",
    outcome: "Connected",
    notes: "Explained company benefits and answered questions.",
    caller: "Carol",
  },
  {
    id: "cl4",
    time: "2025-06-23 11:45 AM",
    outcome: "Missed",
    notes: "Candidate did not answer, follow-up required.",
    caller: "Dave",
  },
  {
    id: "cl5",
    time: "2025-06-22 04:20 PM",
    outcome: "Connected",
    notes: "Walked through the application process.",
    caller: "Eve",
  },
];

export function CallsListPanel({ calls }: CallsListPanelProps) {
  const list = calls && calls.length ? calls : sampleCalls;

  return (
    <ScrollArea className="h-[400px] p-2">
      {list.map((call) => (
        <div
          key={call.id}
          className="flex flex-col space-y-1 bg-white p-4 rounded-lg shadow-sm mb-4"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">{call.time}</span>
              <Badge variant="outline" className="capitalize">
                {call.outcome}
              </Badge>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {call.caller}
            </span>
          </div>
          <p className="text-gray-800 text-sm mt-2">{call.notes}</p>
        </div>
      ))}
    </ScrollArea>
  );
}
