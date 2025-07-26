import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  MapPin,
  Clock,
  Building2,
  Globe,
  CheckCircle,
  Users,
  Tag,
  Edit2,
} from "lucide-react";
import EditJobModal from "./modals/EditJobModal";
import { useState } from "react";

export default function JobProfileCard({ job }) {
  const [openJobModal, setOpenJobModal] = useState(false);

  if (!job) {
    return (
      <div className="w-full p-4 bg-gray-100 text-center text-gray-500 text-sm">
        Loading job details...
      </div>
    );
  }

  const {
    job_code,
    job_title,
    company_industry,
    department,
    workplace,
    office_primary_location,
    description_about,
    description_requirements,
    description_benefits,
    employment_type,
    experience,
    education,
    keywords = [],
    salary_from,
    salary_to,
    salary_currency,
    status,
    priority,
    applicants,
    posted,
    office_on_careers_page,
  } = job;

  return (
    <div className="w-full p-3">
      <Card className="shadow-sm rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-semibold text-white tracking-tight">
                {job_title}
              </h1>
              <p className="text-xs text-blue-100 mt-1">
                {company_industry} &ndash; {workplace}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/[0.1] rounded-full p-1"
              onClick={() => setOpenJobModal(true)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-1 mt-3">
            {[status, priority, employment_type].map((label) => (
              <Badge
                key={label}
                className="bg-white/[0.2] text-xs text-white py-0.5 px-2"
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-700">
            {[
              { icon: Tag, label: "Code", value: job_code },
              { icon: Building2, label: "Department", value: department },
              { icon: Globe, label: "Workplace", value: workplace },
              {
                icon: MapPin,
                label: "Location",
                value: office_primary_location,
              },
              { icon: Clock, label: "Experience", value: experience },
              { icon: Users, label: "Applicants", value: applicants },
              {
                icon: CheckCircle,
                label: "On Careers",
                value: office_on_careers_page ? "Yes" : "No",
              },
              { icon: Tag, label: "Education", value: education },
              {
                icon: Tag,
                label: "Salary",
                value: `${salary_from} - ${salary_to} ${salary_currency}`,
              },
              { icon: Tag, label: "Posted", value: posted },
            ].map((item) => (
              <div key={item.label} className="flex items-center">
                <item.icon className="w-4 h-4 text-blue-600 mr-1" />
                <div>
                  <p className="font-medium text-gray-800">{item.label}</p>
                  <p>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {[
              { key: "about", title: "About", content: description_about },
              {
                key: "requirements",
                title: "Requirements",
                content: description_requirements.split("\n"),
              },
              {
                key: "benefits",
                title: "Benefits",
                content: description_benefits.split("\n"),
              },
            ].map((section) => (
              <Accordion key={section.key} type="multiple">
                <AccordionItem value={section.key}>
                  <AccordionTrigger className="text-sm font-medium text-gray-800">
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    {Array.isArray(section.content) ? (
                      <ul className="list-disc list-inside text-xs text-gray-700 mt-1">
                        {section.content.map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-700 mt-1 whitespace-pre-line">
                        {section.content}
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>

          {keywords.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-1">
                Keywords
              </h3>
              <div className="flex flex-wrap gap-1">
                {keywords.map((kw) => (
                  <Badge
                    key={kw}
                    className="bg-blue-50 text-blue-700 text-xs py-0.5 px-2 rounded"
                  >
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <EditJobModal
        open={openJobModal}
        onOpenChange={setOpenJobModal}
        jobId={job.id}
        onSuccess={() => {}}
      />
    </div>
  );
}
