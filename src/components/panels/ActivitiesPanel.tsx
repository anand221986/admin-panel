import { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter } from "lucide-react";

export interface Activity {
  id: string;
  description: string;
  actorName: string;
  actorAvatarUrl?: string;
  timestamp: string;
}

interface ActivitiesPanelProps {
  activities?: Activity[];
}

const sampleActivities: Activity[] = [
  {
    id: "a1",
    description: "Updated profile picture",
    actorName: "Alice",
    timestamp: "2025-06-20T09:15:00Z",
  },
  {
    id: "a2",
    description: "Changed email address",
    actorName: "Bob",
    timestamp: "2025-06-21T11:30:00Z",
  },
  {
    id: "a3",
    description: "Added new skill: ReactJS",
    actorName: "Carol",
    timestamp: "2025-06-22T14:45:00Z",
  },
  {
    id: "a4",
    description: "Removed outdated certification",
    actorName: "Dave",
    timestamp: "2025-06-23T08:00:00Z",
  },
  {
    id: "a5",
    description: "Updated LinkedIn URL",
    actorName: "Eve",
    timestamp: "2025-06-24T16:20:00Z",
  },
];

export function ActivitiesPanel({ activities }: ActivitiesPanelProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const acts = activities && activities.length ? activities : sampleActivities;

  const grouped = useMemo(() => {
    return acts.reduce<Record<string, Activity[]>>((acc, act) => {
      const dateKey = act.timestamp.split("T")[0];
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(act);
      return acc;
    }, {});
  }, [acts]);

  const totalCount = acts.length;

  return (
    <div className="p-1">
      <div className="flex items-center justify-end space-x-2 mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <Filter className="mr-1 h-4 w-4" />
          Filter activities ({totalCount}/{totalCount})
        </Button>
        {filterOpen && (
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="profile">Profile updates</SelectItem>
              <SelectItem value="rating">Rating changes</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <ScrollArea className="h-[400px]">
        {Object.entries(grouped).map(([dateKey, actsOnDate]) => (
          <div key={dateKey} className="space-y-2 my-4">
            <div className="text-xs font-medium text-gray-500 uppercase">
              {format(parseISO(dateKey), "EEEE, do MMM")}
            </div>
            <div className="space-y-3">
              {actsOnDate.map((act) => (
                <div
                  key={act.id}
                  className="flex space-x-4 bg-white p-4 rounded-lg shadow-sm"
                >
                  <Avatar>
                    {act.actorAvatarUrl ? (
                      <AvatarImage
                        src={act.actorAvatarUrl}
                        alt={act.actorName}
                      />
                    ) : (
                      <AvatarFallback>{act.actorName[0]}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-800">
                        Profile updated
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(parseISO(act.timestamp), "hh:mm a")}
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-gray-700">
                      {act.description}
                    </div>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <Avatar className="w-4 h-4">
                        {act.actorAvatarUrl ? (
                          <AvatarImage
                            src={act.actorAvatarUrl}
                            alt={act.actorName}
                          />
                        ) : (
                          <AvatarFallback>{act.actorName[0]}</AvatarFallback>
                        )}
                      </Avatar>
                      <span className="ml-2">{act.actorName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
