import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export interface ConversationItem {
  id: string;
  channel: string;
  preview: string;
  date: string;
  sender: string;
}

interface ConversationsPanelProps {
  conversations?: ConversationItem[];
}

const sampleConversations: ConversationItem[] = [
  {
    id: "c1",
    channel: "email",
    preview: "Thanks for reaching out, I'll get back to you soon.",
    date: "2025-06-25",
    sender: "Alice",
  },
  {
    id: "c2",
    channel: "linkedin",
    preview: "Let's connect and discuss the opportunity.",
    date: "2025-06-24",
    sender: "Bob",
  },
  {
    id: "c3",
    channel: "email",
    preview: "Here is my updated resume.",
    date: "2025-06-23",
    sender: "Carol",
  },
  {
    id: "c4",
    channel: "phone",
    preview: "Spoke over the phone regarding interview process.",
    date: "2025-06-22",
    sender: "Dave",
  },
  {
    id: "c5",
    channel: "email",
    preview: "Following up on our previous conversation.",
    date: "2025-06-21",
    sender: "Eve",
  },
];

export function ConversationsPanel({ conversations }: ConversationsPanelProps) {
  const list =
    conversations && conversations.length ? conversations : sampleConversations;

  return (
    <ScrollArea className="h-[400px] p-2">
      {list.map((c) => (
        <div
          key={c.id}
          className="flex flex-col space-y-1 bg-white p-4 rounded-lg shadow-sm mb-4"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="capitalize">
                {c.channel}
              </Badge>
              <span className="text-sm text-gray-500">{c.date}</span>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {c.sender}
            </span>
          </div>
          <p className="text-gray-800 text-sm mt-2">{c.preview}</p>
        </div>
      ))}
    </ScrollArea>
  );
}
