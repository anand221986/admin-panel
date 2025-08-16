//import React from "react";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
export interface Person {
  candidateId: number;
  candidateName: string;
}

interface SchedulePanelProps {
  candidate: Person;
  refreshTrigger?: () => void;
}

export const SchedulePanel: React.FC<SchedulePanelProps> = ({ candidate: { candidateId, candidateName } }) => {

  const [schedule, setschedule] = useState("");
  const [eventName, setEventName] = useState("");
  const [saving, setSaving] = useState(false);
  const [eventDescription, setEventDescription] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState<() => void>(() => () => { });

  const date = parseISO("2025-08-16");
  const startTime = "10:00";
  const endTime = "11:00";
  const attendees = [candidateName];
  const associatedWith = [candidateName];
  const handleSave = async () => {
    if (!eventDescription.trim()) {
      toast.error("Please enter scheduled description.");
      return;

    }
    if (!eventName.trim()) {
      toast.error("Please provide a event name.");
      return;

    }

    setSaving(true);
    try {
      const payload = {
        candidate_id: candidateId,
        event_name: eventName,
        event_description: eventDescription,
        author_id: 1
      };
      const res = await axios.post(
        `http://13.51.235.31:3000/candidate/addCandidateSchedule`,
        payload
      );
      if (res.data.status) {
        toast.success(res.data.message || "Event Scheduled successfully.");
         refreshTrigger?.();
      } else {
        toast.error(res.data.message || "Failed to create Schedule.");
      }
    } catch (err: any) {
      console.error("Error creating scheduling", err);
      toast.error(
        err.response?.data?.message || err.message || "Server error."
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow mb-4">
      <div className="flex items-center justify-between">
        <button className="text-gray-600 text-sm">← All events</button>
        <Input
          value={`New event - ${candidateName} - Recruiter Screen`}
          className="flex-1 mx-4"
          placeholder="Enter event title…"
          readOnly
        // onChange={(e) => setEventName(e.target.value)}
        />
        <Select defaultValue="">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="template1">Template 1</SelectItem>
            <SelectItem value="template2">Template 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 gap-4 px-2 text-xs font-medium text-gray-500 uppercase">
        <div>Date</div>
        <div>Start time</div>
        <div>End time</div>
        <div>Attendees</div>
      </div>

      <div className="grid grid-cols-4 gap-4 px-2 items-center text-sm">
        <div>{format(date, "dd MMM, yyyy")}</div>
        <div>{format(parseISO(`2025-08-16T${startTime}`), "hh:mm a")}</div>
        <div>{format(parseISO(`2025-08-16T${endTime}`), "hh:mm a")}</div>
        <div className="flex items-center space-x-2">
          {attendees.map((n) => (
            <span
              key={n}
              className="px-3 py-1 bg-gray-100 rounded-full text-xs"
            >
              {n} <span className="ml-1 cursor-pointer">×</span>
            </span>
          ))}
          <button className="text-sm text-gray-400">+ add more</button>
        </div>
      </div>

      <Textarea
        placeholder="Enter an event description"
        rows={3}
        value={eventDescription}
        onChange={(e) => {
          setEventDescription(e.target.value)
          setEventName(`New event - ${candidateName} - Recruiter Screen`)
        }
        }
      />

      {/* <div className="h-8 border border-gray-200 rounded flex items-center px-2 text-gray-400 text-sm">
        [ Rich-text toolbar here ]
      </div> */}

      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-4">
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase">
              Associated with
            </div>
            <div className="flex items-center space-x-2 mt-1">
              {associatedWith.map((n) => (
                <span
                  key={n}
                  className="px-3 py-1 bg-gray-100 rounded-full text-xs"
                >
                  {n} <span className="ml-1 cursor-pointer">×</span>
                </span>
              ))}
              <button className="text-sm text-gray-400">+ add more</button>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-gray-500 uppercase">
              Scorecard
            </div>
            <Select defaultValue="">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Click to choose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="interview">Interview Scorecard</SelectItem>
                <SelectItem value="tech">Technical Scorecard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Select defaultValue="">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select calendar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="work">Work Calendar</SelectItem>
              <SelectItem value="personal">Personal Calendar</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSave} className="bg-blue-600 text-white">Save event</Button>
        </div>
      </div>
    </div>
  );
};