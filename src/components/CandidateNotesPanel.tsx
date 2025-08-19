import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

const API_BASE = "http://16.171.117.2:3000";

interface Note {
  id: number;
  note: string;
  created_at: string;
  updated_at: string;
}

interface CandidateNotesPanelProps {
  candidateId: number;
  authorId: number;
}

export default function CandidateNotesPanel({
  candidateId,
  authorId,
}: CandidateNotesPanelProps) {
  const [candidateName, setCandidateName] = useState<string>("Candidate");
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  const fetchCandidateName = async () => {
    try {
      const res = await axios.get<{
        status: boolean;
        message: string;
        result: Array<{
          first_name?: string;
          last_name?: string;
          name?: string;
        }>;
      }>(`${API_BASE}/candidate/${candidateId}`);

      const data = res.data;
      if (data.result && data.result.length > 0) {
        const cand = data.result[0];
        setCandidateName(
          cand.name ||
            [cand.first_name, cand.last_name].filter(Boolean).join(" ") ||
            "Candidate"
        );
      }
    } catch (err) {
      console.error("Error fetching candidate name:", err);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await axios.get<{
        status: boolean;
        message: string;
        result: Note[];
      }>(`${API_BASE}/candidate/notes/${candidateId}`);
      setNotes(Array.isArray(res.data.result) ? res.data.result : []);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setNotes([]);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    try {
      await axios.post(`${API_BASE}/candidate/addCandidateNotes`, {
        candidate_id: candidateId,
        author_id: authorId,
        note: newNote.trim(),
      });
      setNewNote("");
      fetchNotes();
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  const updateNote = async (id: number) => {
    if (!editingText.trim()) return;
    try {
      await axios.post(`${API_BASE}/candidate/notes/${id}`, {
        note: editingText.trim(),
      });
      setEditingId(null);
      setEditingText("");
      fetchNotes();
    } catch (err) {
      console.error("Error updating note:", err);
    }
  };

  useEffect(() => {
    fetchCandidateName();
    fetchNotes();
  }, [candidateId]);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4">Notes for {candidateName}</h2>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium mb-2">Add New Note</h3>
        <Textarea
          placeholder="Type a note about the candidate…"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <Button
          className="mt-2 bg-blue-500"
          onClick={addNote}
          disabled={!newNote.trim()}
        >
          Add Note
        </Button>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-2">
        {notes.length === 0 && (
          <p className="text-sm text-slate-500">No notes yet.</p>
        )}

        {notes.map((n) => (
          <div key={n.id} className="border rounded-md bg-slate-50 p-3">
            {editingId === n.id ? (
              <>
                <Textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    className="bg-blue-500"
                    onClick={() => updateNote(n.id)}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setEditingText("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-700">{n.note}</p>
                <div className="text-xs text-slate-400 mt-1">
                  Last updated: {new Date(n.updated_at).toLocaleString()}
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="px-0 text-xs mt-1"
                  onClick={() => {
                    setEditingId(n.id);
                    setEditingText(n.note);
                  }}
                >
                  Edit
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
