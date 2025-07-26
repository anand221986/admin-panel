import JobProfileCard from "./JobProfileCard";
import JobDetailsTabs from "./JobDetailsTabs";

export default function JobProfilePage({ job }) {
  return (
    <div className="flex h-screen">
      <div className="w-[30%]">
        <JobProfileCard job={job} />
      </div>

      <div className="w-[70%]">
        <JobDetailsTabs job={job} />
      </div>
    </div>
  );
}
