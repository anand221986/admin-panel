import CandidateProfileCard from "./CandidateProfileCard";
import CandidateDetailsTabs from "./CandidateDetailsTabs";

export default function CandidateProfilePage({ candidate }) {
  return (
    <div className="flex h-screen">
      <div className="w-[30%]">
        <CandidateProfileCard candidate={candidate} />
      </div>

      <div className="w-[70%]">
        <CandidateDetailsTabs candidate={candidate} />
      </div>
    </div>
  );
}
