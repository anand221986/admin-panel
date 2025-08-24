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
import { Button } from "@/components/ui/button";
import { X, FileText } from "lucide-react";
import { EditCandidateForm } from "./forms/EditCandidateForm";

export default function CandidateDetailsTabs({
  candidate,
  fetchCandidates,
  isEditMode = false,
  onEditModeChange,
}: {
  candidate: any;
  fetchCandidates: () => void;
  isEditMode?: boolean;
  onEditModeChange?: (isEdit: boolean) => void;
}) {
  const [primaryTab, setPrimaryTab] = useState<string>("notes");
  const [secondaryTab, setSecondaryTab] = useState<string>("activities");
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [activitiesReloadKey, setActivitiesReloadKey] = useState(0);
  const [activitiesRefreshKey, setActivitiesRefreshKey] = useState(0);

  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleAdded = () => {
    setRefreshFlag((f) => !f);
    setActivitiesReloadKey((k) => k + 1);
    setActivitiesRefreshKey((prev) => prev + 1);
  };

  const handleResumePreview = (resume: any, url: string) => {
    setSelectedResume(resume);
    setPreviewUrl(url);
  };

  const closePreview = () => {
    setSelectedResume(null);
    setPreviewUrl("");
  };

  const handleEditCancel = () => {
    if (onEditModeChange) {
      onEditModeChange(false);
    }
  };

  const handleEditSave = () => {
    fetchCandidates();
    if (onEditModeChange) {
      onEditModeChange(false);
    }
  };

  if (isEditMode && selectedResume) {
    return (
      <div className="p-3 w-full">
        <div className="flex gap-4 h-[700px]">
          <div className="w-1/2 border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resume Preview
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closePreview}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-sm text-gray-600 mb-4 truncate">
              {selectedResume.resume_url}
            </div>
            <div className="h-[600px] border rounded overflow-hidden">
              <iframe
                src={previewUrl}
                title="Resume Preview"
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="w-1/2">
            <EditCandidateForm
              candidate={candidate}
              onSaveSuccess={handleEditSave}
              onCancel={handleEditCancel}
            />
          </div>
        </div>
      </div>
    );
  }

  if (isEditMode) {
    return (
      <div className="p-3 w-full">
        <div className="flex gap-6 h-[700px]">
          <div className="w-1/2">
            <Tabs
              value={primaryTab}
              onValueChange={setPrimaryTab}
              aria-label="Candidate primary sections"
            >
              <div className="w-full overflow-x-auto flex-shrink-0 mb-4">
                <TabsList className="flex min-w-max w-full">
                  {[
                    { value: "files", label: "Files" },
                    { value: "notes", label: "Notes" },
                    { value: "tasks", label: "Tasks" },
                    { value: "activities", label: "Activities" },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="text-center whitespace-nowrap px-4 py-2 min-w-fit"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value="files">
                <FilesPanel
                  candidateId={candidate.id}
                  onResumePreview={handleResumePreview}
                />
              </TabsContent>
              <TabsContent value="notes">
                <NotesPanel
                  candidateId={candidate.id}
                  authorId={1}
                  refreshTrigger={handleAdded}
                />
              </TabsContent>
              <TabsContent value="tasks">
                <TasksPanel
                  candidateId={candidate.id}
                  authorId={1}
                  refreshTrigger={handleAdded}
                />
              </TabsContent>
              <TabsContent value="activities">
                <ActivitiesPanel
                  candidateId={candidate.id}
                  reloadKey={activitiesRefreshKey}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="w-1/2">
            <EditCandidateForm
              candidate={candidate}
              onSaveSuccess={handleEditSave}
              onCancel={handleEditCancel}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 w-full">
      <div className="flex gap-6 min-h-[800px]">
        {selectedResume && (
          <div className="w-1/2 border rounded-lg p-4 bg-white flex flex-col">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resume Preview
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closePreview}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-sm text-gray-600 mb-4 truncate flex-shrink-0">
              {selectedResume.resume_url}
            </div>
            <div className="flex-1 border rounded overflow-hidden min-h-[600px]">
              <iframe
                src={previewUrl}
                title="Resume Preview"
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        <div
          className={`${
            selectedResume ? "w-1/2" : "w-full"
          } flex flex-col space-y-4`}
        >
          <div className="flex-1">
            <Tabs
              value={primaryTab}
              onValueChange={setPrimaryTab}
              aria-label="Candidate primary sections"
              className="h-full flex flex-col"
            >
              <div className="w-full overflow-x-auto flex-shrink-0 mb-4">
                <TabsList className="flex min-w-max w-full">
                  {[
                    { value: "notes", label: "Notes" },
                    { value: "tasks", label: "Tasks" },
                    { value: "schedule", label: "Schedule" },
                    { value: "email", label: "Email" },
                    { value: "calls", label: "Calls" },
                    { value: "text", label: "Text" },
                    { value: "activity", label: "Activity" },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="text-center whitespace-nowrap px-4 py-2 min-w-fit flex-1 justify-center"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="flex-1 min-h-[300px]">
                <TabsContent value="notes">
                  <NotesPanel
                    candidateId={candidate.id}
                    authorId={1}
                    refreshTrigger={handleAdded}
                  />
                </TabsContent>
                <TabsContent value="tasks">
                  <TasksPanel
                    candidateId={candidate.id}
                    authorId={1}
                    onTaskAdded={handleAdded}
                  />
                </TabsContent>
                <TabsContent value="schedule">
                  <SchedulePanel
                    candidate={{
                      candidateId: candidate.id,
                      candidateName: `${candidate.first_name} ${candidate.last_name}`,
                    }}
                    refreshTrigger={handleAdded}
                  />
                </TabsContent>
                <TabsContent value="email">
                  <EmailPanel
                    candidate={{
                      candidateId: candidate.id,
                      candidateName: `${candidate.first_name} ${candidate.last_name}`,
                    }}
                    refreshTrigger={handleAdded}
                  />
                </TabsContent>
                <TabsContent value="calls">
                  <CallsPanel
                    candidate={{
                      candidateId: candidate.id,
                      candidateName: `${candidate.first_name} ${candidate.last_name}`,
                    }}
                  />
                </TabsContent>
                <TabsContent value="text">
                  <TextPanel
                    candidate={{
                      candidateId: candidate.id,
                      candidateName: `${candidate.first_name} ${candidate.last_name}`,
                    }}
                  />
                </TabsContent>
                <TabsContent value="activity">
                  <ActivityPanel candidate={candidate} />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <div className="flex-1">
            <Tabs
              value={secondaryTab}
              onValueChange={setSecondaryTab}
              aria-label="Candidate other details"
              className="h-full flex flex-col"
            >
              <div className="w-full overflow-x-auto flex-shrink-0 mb-4">
                <TabsList className="flex w-full">
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
                      className="text-center whitespace-nowrap px-4 py-2 min-w-fit flex-1 justify-center"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="flex-1 min-h-[300px]">
                <TabsContent value="activities">
                  <ActivitiesPanel
                    candidateId={candidate.id}
                    reloadKey={activitiesRefreshKey}
                  />
                </TabsContent>
                <TabsContent value="files">
                  <FilesPanel
                    candidateId={candidate.id}
                    onResumePreview={handleResumePreview}
                  />
                </TabsContent>
                <TabsContent value="scorecards">
                  <ScorecardsPanel scorecards={candidate.scorecards} />
                </TabsContent>
                <TabsContent value="conversations">
                  <ConversationsPanel conversations={candidate.conversations} />
                </TabsContent>
                <TabsContent value="calls_list">
                  <CallsListPanel
                    calls={candidate.calls}
                    candidateId={candidate.id}
                  />
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
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
