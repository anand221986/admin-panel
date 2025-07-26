import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Italic,
  Link2,
  ImageIcon,
  VideoIcon,
  ListOrdered,
  List,
  Mic,
} from "lucide-react";

export function NotesPanel({ candidate }) {
  const [template, setTemplate] = useState("default");

  return (
    <div className="flex flex-col border rounded-lg bg-white shadow-sm mb-4">
      <div className="flex items-center space-x-2 px-4 py-2 border-b">
        <span className="text-2xl">✨</span>
        <span className="font-semibold">AIRA</span>
      </div>

      <div className="px-4 py-3 border-b">
        <textarea
          rows={4}
          placeholder="Enter notes here..."
          className="w-full resize-none border-none focus:outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 px-4 py-2 border-b">
        <div className="inline-flex items-center space-x-4 whitespace-nowrap">
          <Select onValueChange={() => {}}>
            <SelectTrigger className="w-auto text-sm">
              <SelectValue placeholder="Div" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="div">Div</SelectItem>
              <SelectItem value="p">Paragraph</SelectItem>
              <SelectItem value="h1">H1</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={() => {}}>
            <SelectTrigger className="w-auto text-sm">
              <SelectValue placeholder="13px" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12px">12px</SelectItem>
              <SelectItem value="13px">13px</SelectItem>
              <SelectItem value="14px">14px</SelectItem>
            </SelectContent>
          </Select>

          <Italic className="cursor-pointer" size={18} />

          <Select onValueChange={() => {}}>
            <SelectTrigger className="w-auto text-sm">
              <SelectValue placeholder="Arial" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="arial">Arial</SelectItem>
              <SelectItem value="times">Times New Roman</SelectItem>
              <SelectItem value="verdana">Verdana</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <button className="flex items-center space-x-1 text-sm">
              <span className="w-3 h-3 rounded-full bg-black border" />
              <span>▾</span>
            </button>
          </div>

          <Link2 className="cursor-pointer" size={18} />

          <VideoIcon className="cursor-pointer" size={18} />

          <ImageIcon className="cursor-pointer" size={18} />

          <ListOrdered className="cursor-pointer" size={18} />

          <List className="cursor-pointer" size={18} />

          <Mic className="cursor-pointer" size={18} />
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <Select onValueChange={(val) => setTemplate(val)}>
          <SelectTrigger className="w-auto text-sm">
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="followup">Follow-up</SelectItem>
            <SelectItem value="thankyou">Thank you</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={() => console.log("Post with template:", template)}
          className="bg-blue-500"
        >
          Post
        </Button>
      </div>
    </div>
  );
}
