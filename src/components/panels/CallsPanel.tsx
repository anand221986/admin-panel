import { useState } from "react";
import { format } from "date-fns";
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
import {
  PhoneCall,
  User,
  Italic,
  Underline,
  Highlighter,
  Link as LinkIcon,
  Image as ImageIcon,
  List as ListIcon,
  ListOrdered,
  Paperclip,
  Mic,
} from "lucide-react";

export interface Person {
  id: string;
  name: string;
}

interface CallsPanelProps {
  candidate: Person;
  onLogCall?: (data: {
    date: Date;
    startTime: string;
    endTime: string;
    meetingType: string;
    callOutcome: string;
    associatedWith: string[];
    notes: string;
    template: string;
  }) => void;
}

export function CallsPanel({ candidate, onLogCall }: CallsPanelProps) {
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState<string>(
    format(new Date(), "HH:mm")
  );
  const [endTime, setEndTime] = useState<string>("");
  const [meetingType, setMeetingType] = useState<string>("");
  const [callOutcome, setCallOutcome] = useState<string>("");
  const [associatedWith, setAssociatedWith] = useState<string[]>([
    candidate.name,
  ]);
  const [notes, setNotes] = useState<string>("");
  const [template, setTemplate] = useState<string>("");

  const removeAssoc = (name: string) => {
    setAssociatedWith((prev) => prev.filter((n) => n !== name));
  };

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow mb-4">
      <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
        <div className="flex items-center space-x-2 text-gray-700">
          <PhoneCall className="w-5 h-5" />
          <span className="font-medium">{candidate.name} logged a call</span>
        </div>
        <div className="flex items-center space-x-8 text-sm">
          <div className="text-right">
            <div className="text-xs font-medium uppercase text-gray-500">
              Start time
            </div>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-24"
            />
          </div>
          <div className="text-right">
            <div className="text-xs font-medium uppercase text-gray-500">
              End time
            </div>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-24"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 px-2 text-xs font-medium text-gray-500 uppercase">
        <div>Date</div>
        <div>Meeting type</div>
        <div>Call outcome</div>
        <div>Associated with</div>
      </div>

      <div className="grid grid-cols-4 gap-4 px-1 items-center text-sm">
        <div>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Select value={meetingType} onValueChange={(v) => setMeetingType(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select meeting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inbound">Inbound</SelectItem>
              <SelectItem value="outbound">Outbound</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={callOutcome} onValueChange={(v) => setCallOutcome(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select outcome" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="connected">Connected</SelectItem>
              <SelectItem value="voicemail">Voicemail</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          {associatedWith.map((n) => (
            <span
              key={n}
              className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs"
            >
              <User className="w-4 h-4 mr-1" />
              {n}
              <span
                className="ml-1 cursor-pointer"
                onClick={() => removeAssoc(n)}
              >
                ×
              </span>
            </span>
          ))}
          <button
            className="text-sm text-gray-400"
            onClick={() =>
              setAssociatedWith((prev) => [...prev, candidate.name])
            }
          >
            + add more
          </button>
        </div>
      </div>

      <Textarea
        placeholder="Enter call notes…"
        rows={4}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div className="flex items-center space-x-3 border-t border-b border-gray-200 py-2 text-gray-600">
        <Select defaultValue="div">
          <SelectTrigger className="w-20">
            <SelectValue>Div</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="div">Div</SelectItem>
            <SelectItem value="p">Paragraph</SelectItem>
            <SelectItem value="h1">H1</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="13px">
          <SelectTrigger className="w-20">
            <SelectValue>13px</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12px">12px</SelectItem>
            <SelectItem value="13px">13px</SelectItem>
            <SelectItem value="14px">14px</SelectItem>
          </SelectContent>
        </Select>

        <Italic size={16} />
        <Underline size={16} />
        <Highlighter size={16} />
        <LinkIcon size={16} />
        <ImageIcon size={16} />
        <ListIcon size={16} />
        <ListOrdered size={16} />
        <Paperclip size={16} />
        <Mic size={16} />
      </div>

      <div className="flex items-center justify-between">
        <Select value={template} onValueChange={(v) => setTemplate(v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tmpl1">Template 1</SelectItem>
            <SelectItem value="tmpl2">Template 2</SelectItem>
          </SelectContent>
        </Select>

        <Button
          className="bg-blue-600 text-white"
          onClick={() =>
            onLogCall?.({
              date: new Date(date),
              startTime,
              endTime,
              meetingType,
              callOutcome,
              associatedWith,
              notes,
              template,
            })
          }
        >
          Log call
        </Button>
      </div>
    </div>
  );
}
