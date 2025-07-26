import React from "react";
import { format, parseISO } from "date-fns";
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

export interface Person {
  id: string;
  name: string;
}

interface SchedulePanelProps {
  candidate: Person;
}

export const SchedulePanel: React.FC<SchedulePanelProps> = ({ candidate }) => {
  const date = parseISO("2025-06-27");
  const startTime = "10:00";
  const endTime = "11:00";
  const attendees = [candidate.name];
  const associatedWith = [candidate.name];

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow mb-4">
      <div className="flex items-center justify-between">
        <button className="text-gray-600 text-sm">← All events</button>
        <Input
          className="flex-1 mx-4"
          placeholder="Enter event title…"
          readOnly
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
        <div>{format(parseISO(`2025-06-27T${startTime}`), "hh:mm a")}</div>
        <div>{format(parseISO(`2025-06-27T${endTime}`), "hh:mm a")}</div>
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

      <Textarea placeholder="Enter an event description" rows={3} readOnly />

      <div className="h-8 border border-gray-200 rounded flex items-center px-2 text-gray-400 text-sm">
        [ Rich-text toolbar here ]
      </div>

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
          <Button className="bg-blue-600 text-white">Save event</Button>
        </div>
      </div>
    </div>
  );
};
