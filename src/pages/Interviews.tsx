import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const interviews = [
  {
    id: 1,
    candidate: "Sarah Johnson",
    position: "Frontend Developer",
    interviewer: "John Smith",
    date: "2024-05-27",
    time: "10:00 AM",
    duration: "1 hour",
    type: "Video Call",
    status: "Scheduled",
    notes: "Technical interview focusing on React and TypeScript",
  },
  {
    id: 2,
    candidate: "Mike Chen",
    position: "Backend Engineer",
    interviewer: "Emily Davis",
    date: "2024-05-27",
    time: "2:00 PM",
    duration: "45 minutes",
    type: "In-person",
    status: "Scheduled",
    notes: "System design and coding assessment",
  },
  {
    id: 3,
    candidate: "Alex Rodriguez",
    position: "Product Manager",
    interviewer: "Lisa Wang",
    date: "2024-05-28",
    time: "11:30 AM",
    duration: "1 hour",
    type: "Video Call",
    status: "Confirmed",
    notes: "Product strategy and leadership discussion",
  },
  {
    id: 4,
    candidate: "Emma Davis",
    position: "UX Designer",
    interviewer: "Mark Johnson",
    date: "2024-05-28",
    time: "3:00 PM",
    duration: "1.5 hours",
    type: "In-person",
    status: "Completed",
    notes: "Portfolio review and design challenge",
  },
  {
    id: 5,
    candidate: "Lisa Wang",
    position: "Data Scientist",
    interviewer: "Sarah Johnson",
    date: "2024-05-29",
    time: "9:00 AM",
    duration: "1 hour",
    type: "Video Call",
    status: "Rescheduled",
    notes: "Machine learning and analytics discussion",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Scheduled":
      return "bg-blue-100 text-blue-800";
    case "Confirmed":
      return "bg-green-100 text-green-800";
    case "Completed":
      return "bg-gray-100 text-gray-800";
    case "Rescheduled":
      return "bg-yellow-100 text-yellow-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const Interviews = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Interviews</h1>
            <p className="text-slate-600 mt-1">
              Schedule and manage candidate interviews.
            </p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Interview
          </Button>
        </div>

        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">May 2024</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="bg-white/80">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="bg-white/80">
                  Today
                </Button>
                <Button variant="outline" size="sm" className="bg-white/80">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="p-2 text-sm font-medium text-slate-600"
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 5;
                const isCurrentMonth = day > 0 && day <= 31;
                const isToday = day === 26;
                const hasInterview = [27, 28, 29].includes(day);

                return (
                  <div
                    key={i}
                    className={`p-2 text-sm cursor-pointer rounded-lg transition-colors ${
                      isCurrentMonth
                        ? isToday
                          ? "bg-blue-600 text-white font-semibold"
                          : hasInterview
                          ? "bg-purple-100 text-purple-800 font-medium hover:bg-purple-200"
                          : "text-slate-800 hover:bg-slate-100"
                        : "text-slate-400"
                    }`}
                  >
                    {isCurrentMonth ? day : ""}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-800">
              Upcoming Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div
                  key={interview.id}
                  className="p-4 border border-slate-200 rounded-lg bg-white/50 hover:bg-white/80 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {interview.candidate
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-slate-800">
                            {interview.candidate}
                          </h3>
                          <Badge className={getStatusColor(interview.status)}>
                            {interview.status}
                          </Badge>
                        </div>

                        <p className="text-slate-600 mb-2">
                          {interview.position}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {interview.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {interview.time} ({interview.duration})
                          </div>
                          <div className="flex items-center gap-1">
                            {interview.type === "Video Call" ? (
                              <Video className="w-4 h-4" />
                            ) : (
                              <MapPin className="w-4 h-4" />
                            )}
                            {interview.type}
                          </div>
                        </div>

                        <p className="text-sm text-slate-600">
                          Interviewer:{" "}
                          <span className="font-medium">
                            {interview.interviewer}
                          </span>
                        </p>

                        {interview.notes && (
                          <p className="text-sm text-slate-500 mt-2 italic">
                            {interview.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {interview.type === "Video Call" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Join Call
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/80"
                      >
                        Reschedule
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Interviews;
