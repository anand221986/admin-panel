import { useState, useMemo, useEffect } from "react";
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
import axios from "axios";
import { toast } from "sonner";

const API_BASE = "http://16.171.117.2:3000";

export interface Activity {
  id: string;
  description: string;
  actorName: string;
  actorAvatarUrl?: string;
  timestamp: string;
}

interface ActivitiesPanelProps {
  activities?: Activity[];
  candidateId: number;
  reloadKey: number;
  readonly?: () => void; // Optional if unused
}

export function ActivitiesPanel({ candidateId,reloadKey }: ActivitiesPanelProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [activity, setActivity] = useState<Activity[]>([]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/candidate/activities/${candidateId}`
      );
      if (res.data && Array.isArray(res.data)) {
        // Transform API data into Activity[]
        const mapped = res.data.map((item: any) => ({
          id: String(item.id),
          description: item.activity_details?.note || item.activity_type,
          actorName: `Recruiter ${item.recruiter_id}`, // Adjust if you have recruiter name
          actorAvatarUrl: undefined, // You can map recruiter photo if available
          timestamp: item.created_at,
        }));
        setActivity(mapped);
      } else {
        toast.error("Unexpected response format.");
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setActivity([]);
      } else {
        console.error("Error fetching activities", err);
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Server error while fetching activities."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [candidateId,reloadKey]);

  const grouped = useMemo(() => {
    return activity.reduce<Record<string, Activity[]>>((acc, act) => {
      const dateKey = act.timestamp.split("T")[0];
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(act);
      return acc;
    }, {});
  }, [activity]);

  const totalCount = activity.length;

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
                        {act.description}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(parseISO(act.timestamp), "hh:mm a")}
                      </div>
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
