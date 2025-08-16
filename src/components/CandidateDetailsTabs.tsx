import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NotesPanel } from "./panels/NotesPanel";
import { TasksPanel } from "./panels/TasksPanel";
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
import { TasksListPanel } from "./panels/TasksListPanel";
import { NotesListPanel } from "./panels/NotesListPanel";

export default function CandidateDetailsTabs({
  candidate,
  fetchCandidates,
}: {
  candidate: any;
  fetchCandidates: () => void;
}) {
  const [primaryTab, setPrimaryTab] = useState<string>("notes");
  const [secondaryTab, setSecondaryTab] = useState<string>("activities");
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [activitiesReloadKey, setActivitiesReloadKey] = useState(0);
  const [activitiesRefreshKey, setActivitiesRefreshKey] = useState(0);

const handleAdded = () => {
  setRefreshFlag((f) => !f);           // trigger useEffect
  setActivitiesReloadKey((k) => k+1);  // force remount child component
  setActivitiesRefreshKey(prev => prev + 1);
};
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
            { value: "tasks", label: "Tasks" },
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
          <NotesPanel candidateId={candidate.id} authorId={1} refreshTrigger={handleAdded}  />
        </TabsContent>
        <TabsContent value="tasks">
          <TasksPanel
            candidateId={candidate.id}
            authorId={1}
            onTaskAdded={handleAdded}
          />
        </TabsContent>
        <TabsContent value="schedule">
          <SchedulePanel   candidate={{
    candidateId: candidate.id,
    candidateName: `${candidate.first_name} ${candidate.last_name}`,
  }} 
  
  refreshTrigger={handleAdded}/>
        </TabsContent>
        <TabsContent value="email">
          <EmailPanel candidate={{
    candidateId: candidate.id,
    candidateName: `${candidate.first_name} ${candidate.last_name}`,
  }}  
  
  refreshTrigger={handleAdded}/>
        </TabsContent>
        <TabsContent value="calls">
          <CallsPanel candidate={{
    candidateId: candidate.id,
    candidateName: `${candidate.first_name} ${candidate.last_name}`,
  }} />
        </TabsContent>
        <TabsContent value="text">
          <TextPanel candidate={{
    candidateId: candidate.id,
    candidateName: `${candidate.first_name} ${candidate.last_name}`,
  }} />
        </TabsContent>
        <TabsContent value="activity">
          <ActivityPanel candidate={candidate} />
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
            { value: "tasks_list", label: "Tasks" },
            { value: "Notes_list", label: "Notes" },
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
          {/* <ActivitiesPanel activities={candidate.activities || []} /> */}
          <ActivitiesPanel candidateId={candidate.id} reloadKey={activitiesRefreshKey} />
        </TabsContent>
        <TabsContent value="files">
          <FilesPanel candidateId={candidate.id}  />
        </TabsContent>
        <TabsContent value="scorecards">
          <ScorecardsPanel scorecards={candidate.scorecards} />
        </TabsContent>
        <TabsContent value="conversations">
          <ConversationsPanel conversations={candidate.conversations} />
        </TabsContent>
        <TabsContent value="calls_list">
          <CallsListPanel calls={candidate.calls} candidateId={candidate.id} />
        </TabsContent>
        <TabsContent value="Notes_list">
          <NotesListPanel candidateId={candidate.id} authorId={1} />
        </TabsContent>

        <TabsContent value="tasks_list">
          <TasksListPanel
            candidateId={candidate.id}
            authorId={1}
            refreshTrigger={refreshFlag}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
