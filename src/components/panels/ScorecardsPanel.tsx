import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export interface ScorecardItem {
  id: string;
  title: string;
  score: number;
  reviewer: string;
}

interface ScorecardsPanelProps {
  scorecards?: ScorecardItem[];
}

const sampleScorecards: ScorecardItem[] = [
  { id: "s1", title: "Technical Interview", score: 4, reviewer: "Alice" },
  { id: "s2", title: "Culture Fit", score: 5, reviewer: "Bob" },
  { id: "s3", title: "Coding Test", score: 3, reviewer: "Carol" },
  { id: "s4", title: "System Design", score: 4, reviewer: "Dave" },
  { id: "s5", title: "Problem Solving", score: 5, reviewer: "Eve" },
];

export function ScorecardsPanel({ scorecards }: ScorecardsPanelProps) {
  const list = scorecards && scorecards.length ? scorecards : sampleScorecards;

  return (
    <ScrollArea className="h-[400px] p-2">
      {list.map((s) => (
        <div
          key={s.id}
          className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-4"
        >
          <div className="space-y-1">
            <p className="font-medium text-gray-800">{s.title}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Reviewer:</span>
              <Badge variant="outline">{s.reviewer}</Badge>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-yellow-500">
            {Array.from({ length: s.score }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-500" />
            ))}
            {Array.from({ length: 5 - s.score }).map((_, i) => (
              <Star key={i + s.score} className="w-4 h-4" />
            ))}
          </div>
        </div>
      ))}
    </ScrollArea>
  );
}
