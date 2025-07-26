import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NotesPanel } from "./panels/NotesPanel";
import { SchedulePanel } from "./panels/SchedulePanel";
import { EmailPanel } from "./panels/EmailPanel";
import { CallsPanel } from "./panels/CallsPanel";
import { TextPanel } from "./panels/TextPanel";
import { ActivityPanel } from "./panels/ActivityPanel";
import { ActivitiesPanel } from "./panels/ActivitiesPanel";
import { FilesPanel } from "./panels/FilesPanel";
import { ScorecardsPanel } from "./panels/ScorecardsPanel";
import { ConversationsPanel } from "./panels/ConversationsPanel";
import { CallsListPanel } from "./panels/CallsListPanel";

export default function JobDetailsTabs({ job }: { job: any }) {
  const [primaryTab, setPrimaryTab] = useState<string>("notes");
  const [secondaryTab, setSecondaryTab] = useState<string>("activities");

  if (!job) {
    return (
      <p className="p-4 text-center text-gray-500">Loading job details...</p>
    );
  }

  return (
    <div className="p-3 w-full space-y-6">
      <Tabs
        value={primaryTab}
        onValueChange={setPrimaryTab}
        aria-label="Candidate primary sections"
      >
        <TabsList className="flex w-full overflow-x-auto">
          {[
            { value: "notes", label: "Notes" },
            { value: "schedule", label: "Schedule" },
            { value: "email", label: "Email" },
            { value: "calls", label: "Calls" },
            { value: "text", label: "Text (SMS)" },
            { value: "activity", label: "Activity" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-1 text-center"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="notes">
          <NotesPanel candidate={job} />
        </TabsContent>
        <TabsContent value="schedule">
          <SchedulePanel candidate={job} />
        </TabsContent>
        <TabsContent value="email">
          <EmailPanel candidate={job} />
        </TabsContent>
        <TabsContent value="calls">
          <CallsPanel candidate={job} />
        </TabsContent>
        <TabsContent value="text">
          <TextPanel candidate={job} />
        </TabsContent>
        <TabsContent value="activity">
          <ActivityPanel candidate={job} />
        </TabsContent>
      </Tabs>

      <Tabs
        value={secondaryTab}
        onValueChange={setSecondaryTab}
        aria-label="Candidate other details"
      >
        <TabsList className="flex w-full overflow-x-auto">
          {[
            { value: "activities", label: "Activities" },
            { value: "files", label: "Files" },
            { value: "scorecards", label: "Scorecards" },
            { value: "conversations", label: "Conversations" },
            { value: "calls_list", label: "Calls" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-1 text-center"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="activities">
          <ActivitiesPanel activities={job.activities || []} />
        </TabsContent>
        <TabsContent value="files">
          <FilesPanel files={job.files} />
        </TabsContent>
        <TabsContent value="scorecards">
          <ScorecardsPanel scorecards={job.scorecards} />
        </TabsContent>
        <TabsContent value="conversations">
          <ConversationsPanel conversations={job.conversations} />
        </TabsContent>
        <TabsContent value="calls_list">
          <CallsListPanel calls={job.calls} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
