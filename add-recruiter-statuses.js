import axios from 'axios';

const API_BASE_URL = "http://16.171.117.2:3000";

const recruiterStatuses = [
  { name: "To Contact", color: "#3b82f6", type: "recruiter", is_active: true },
  { name: "Contacted", color: "#8b5cf6", type: "recruiter", is_active: true },
  { name: "Interested", color: "#10b981", type: "recruiter", is_active: true },
  { name: "Not Interested", color: "#ef4444", type: "recruiter", is_active: true },
  { name: "Phone Screening", color: "#f59e0b", type: "recruiter", is_active: true },
  { name: "Schedule Interview", color: "#06b6d4", type: "recruiter", is_active: true },
  { name: "Interview Scheduled", color: "#84cc16", type: "recruiter", is_active: true },
  { name: "Follow Up", color: "#f97316", type: "recruiter", is_active: true },
  { name: "Submitted to Client", color: "#6366f1", type: "recruiter", is_active: true },
  { name: "Client Review", color: "#8b5cf6", type: "recruiter", is_active: true },
  { name: "Negotiating", color: "#fbbf24", type: "recruiter", is_active: true },
  { name: "Offer Extended", color: "#34d399", type: "recruiter", is_active: true },
  { name: "Offer Accepted", color: "#10b981", type: "recruiter", is_active: true },
  { name: "Offer Declined", color: "#f87171", type: "recruiter", is_active: true },
  { name: "On Hold", color: "#6b7280", type: "recruiter", is_active: true },
  { name: "Backup", color: "#9ca3af", type: "recruiter", is_active: true }
];

async function addRecruiterStatuses() {
  console.log('Adding recruiter statuses...');
  
  try {
    for (const status of recruiterStatuses) {
      try {
        const response = await axios.post(`${API_BASE_URL}/candidate/createStatus`, status);
        console.log(`✅ Added: ${status.name}`);
      } catch (error) {
        if (error.response && error.response.status === 409) {
          console.log(`⚠️ Already exists: ${status.name}`);
        } else {
          console.log(`❌ Failed to add: ${status.name} - ${error.message}`);
        }
      }
    }
    console.log('\n🎉 Finished adding recruiter statuses!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addRecruiterStatuses();




