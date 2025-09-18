import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

interface SearchFilters {
  type?: string;
  location?: string;
  experience?: string;
  skills?: string[];
  company?: string;
}

interface GlobalSearchBarProps {
  onSearch?: (query: string, filters?: SearchFilters) => void;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Advanced search filters
  const [searchType, setSearchType] = useState("all");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [company, setCompany] = useState("");

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        document.getElementById("global-search-input")?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
    setIsDropdownOpen(false);
  };

  const handleAdvancedSearch = () => {
    if (onSearch) {
      onSearch(searchQuery, {
        type: searchType,
        location,
        experience,
        skills: skills.split(",").map(s => s.trim()),
        company,
      });
    }
    setIsAdvancedOpen(false);
    setIsDropdownOpen(false);
  };

  const clearFilters = () => {
    setSearchType("all");
    setLocation("");
    setExperience("");
    setSkills("");
    setCompany("");
  };

  return (
    <>
      <div className="relative">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="global-search-input"
            type="text"
            placeholder="Search people, jobs, companies"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(searchQuery);
              }
            }}
            className="pl-10 pr-16 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
            Ctrl K
          </div>
        </div>

        {/* Search Dropdown */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-4">
              {searchQuery ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 mb-2">Search results for "{searchQuery}"</p>
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No options</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No options</p>
                </div>
              )}
              
              <div className="pt-2 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigate('/advanced-search');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full justify-start text-blue-600 hover:text-blue-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Go to advanced search
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Click outside to close dropdown */}
        {isDropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>

      {/* Advanced Search Modal */}
      <Dialog open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Advanced Search</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="search-type">Search Type</Label>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select search type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="people">People</SelectItem>
                    <SelectItem value="jobs">Jobs</SelectItem>
                    <SelectItem value="companies">Companies</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="search-query">Search Query</Label>
                <Input
                  id="search-query"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter your search terms"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., New York, Remote"
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select value={experience} onValueChange={setExperience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                      <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                      <SelectItem value="lead">Lead/Principal (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="skills">Skills</Label>
                <Input
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g., React, Node.js, Python (comma-separated)"
                />
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g., Google, Microsoft"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setIsAdvancedOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdvancedSearch}>
                  Search
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
