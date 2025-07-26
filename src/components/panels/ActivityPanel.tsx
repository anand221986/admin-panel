import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock as ClockIcon } from "lucide-react";

export interface Person {
  id: string;
  first_name: string;
}

interface ActivityPanelProps {
  candidate: Person;
}

export function ActivityPanel({ candidate }: ActivityPanelProps) {
  const activityDate = parseISO("2025-06-26");
  const activityTime = "15:42";

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow mb-4">
      <div className="grid grid-cols-4 gap-4 px-2 text-xs font-medium text-gray-500 uppercase">
        <div>Activity type</div>
        <div>Activity date</div>
        <div>Activity time</div>
        <div>Activity by</div>
      </div>

      <div className="grid grid-cols-4 gap-4 px-2 items-center text-sm">
        <div>
          <Select defaultValue="">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select activity type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="call">Call</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start w-full">
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                {format(activityDate, "dd MMM, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <input
                type="date"
                className="w-full"
                defaultValue="2025-06-26"
                readOnly
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center space-x-2">
          <ClockIcon className="text-gray-500" />
          <Input type="time" value={activityTime} readOnly className="w-24" />
        </div>
        <div className="text-sm capitalize">{candidate.first_name}</div>
      </div>

      <div className="h-8 border border-gray-200 rounded flex items-center px-2 text-gray-400 text-sm">
        [ Rich-text toolbar here ]
      </div>

      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-500 uppercase">
          Associated with
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs">
            {candidate.first_name}{" "}
            <span className="ml-1 cursor-pointer">×</span>
          </span>
          <button className="text-sm text-gray-400">+ add more</button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Select defaultValue="">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tmpl1">Template 1</SelectItem>
            <SelectItem value="tmpl2">Template 2</SelectItem>
          </SelectContent>
        </Select>
        <Button className="bg-blue-600 text-white">Save</Button>
      </div>
    </div>
  );
}
