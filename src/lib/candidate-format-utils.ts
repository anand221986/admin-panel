interface AddressData {
  firstline?: string;
  city?: string;
  pincode?: string;
  district?: string;
  state?: string;
  country?: string;
}

interface ExperienceData {
  company?: string;
  position?: string;
  role?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface EducationData {
  degree?: string;
  institution?: string;
  school?: string;
  year?: string;
  graduation_year?: string;
  grade?: string;
  cgpa?: string;
  field?: string;
}

export const formatAddress = (address: string | AddressData[]): string => {
  if (typeof address !== "string") return JSON.stringify(address);
  try {
    const parsedAddress = JSON.parse(address);
    if (Array.isArray(parsedAddress) && parsedAddress.length > 0) {
      const addr = parsedAddress[0];
      const parts = [];
      if (addr.firstline) parts.push(addr.firstline);
      if (addr.city) parts.push(addr.city);
      if (addr.district) parts.push(addr.district);
      if (addr.state) parts.push(addr.state);
      if (addr.pincode) parts.push(addr.pincode);
      if (addr.country) parts.push(addr.country);
      return parts.join(", ");
    }
    return address;
  } catch {
    return address;
  }
};

export const formatExperience = (experience: string | ExperienceData[]): string => {
  if (typeof experience !== "string") return JSON.stringify(experience);
  try {
    const parsedExp = JSON.parse(experience);
    if (Array.isArray(parsedExp)) {
      return parsedExp.map((exp, index) => {
        const parts = [];
        if (exp.company) parts.push(`Company: ${exp.company}`);
        if (exp.position || exp.role) parts.push(`Role: ${exp.position || exp.role}`);
        if (exp.duration || (exp.startDate && exp.endDate)) {
          const duration = exp.duration || `${exp.startDate} - ${exp.endDate}`;
          parts.push(`Duration: ${duration}`);
        }
        if (exp.description) parts.push(`Description: ${exp.description}`);
        return `${index + 1}. ${parts.join(" | ")}`;
      }).join("\n\n");
    }
    return experience;
  } catch {
    return experience;
  }
};

export const formatEducation = (education: string | EducationData[]): string => {
  if (typeof education !== "string") return JSON.stringify(education);
  try {
    const parsedEdu = JSON.parse(education);
    if (Array.isArray(parsedEdu)) {
      return parsedEdu.map((edu, index) => {
        const parts = [];
        if (edu.degree) parts.push(`Degree: ${edu.degree}`);
        if (edu.institution || edu.school) parts.push(`Institution: ${edu.institution || edu.school}`);
        if (edu.year || edu.graduation_year) parts.push(`Year: ${edu.year || edu.graduation_year}`);
        if (edu.grade || edu.cgpa) parts.push(`Grade: ${edu.grade || edu.cgpa}`);
        if (edu.field) parts.push(`Field: ${edu.field}`);
        return `${index + 1}. ${parts.join(" | ")}`;
      }).join("\n\n");
    }
    return education;
  } catch {
    return education;
  }
};
