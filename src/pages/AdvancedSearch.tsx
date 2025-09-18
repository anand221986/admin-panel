import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Search, Users } from "lucide-react";

interface Filter {
  id: string;
  field: string;
  operator: string;
  value: string;
}

const FILTER_FIELDS = [
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "location", label: "Location" },
  { value: "experience", label: "Experience" },
  { value: "skills", label: "Skills" },
  { value: "company", label: "Current Company" },
  { value: "education", label: "Education" },
  { value: "status", label: "Status" },
  { value: "ctc", label: "Current CTC" },
  { value: "expected_ctc", label: "Expected CTC" },
];

const OPERATORS = [
  { value: "contains", label: "Contains" },
  { value: "equals", label: "Equals" },
  { value: "starts_with", label: "Starts with" },
  { value: "ends_with", label: "Ends with" },
  { value: "greater_than", label: "Greater than" },
  { value: "less_than", label: "Less than" },
  { value: "not_equals", label: "Not equals" },
];

const SEGMENTS = [
  "All Candidates",
  "Active Candidates", 
  "Recent Applications",
  "Top Performers",
  "Interview Ready",
  "Shortlisted",
  "Rejected Candidates",
];

export default function AdvancedSearch() {
  const [searchType, setSearchType] = useState("candidates");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [selectedSegment, setSelectedSegment] = useState("");
  const [matchType, setMatchType] = useState("all");

  const addFilter = () => {
    const newFilter: Filter = {
      id: Date.now().toString(),
      field: "",
      operator: "contains",
      value: "",
    };
    setFilters([...filters, newFilter]);
  };

  const updateFilter = (id: string, field: keyof Filter, value: string) => {
    setFilters(filters.map(filter => 
      filter.id === id ? { ...filter, [field]: value } : filter
    ));
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter(filter => filter.id !== id));
  };

  const handleSearch = () => {
    console.log("Search with filters:", { searchType, filters, selectedSegment, matchType });
  };

  const clearFilters = () => {
    setFilters([]);
    setSelectedSegment("");
    setMatchType("all");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Advanced Search</h1>
            <p className="text-slate-600 text-sm">
              Create detailed searches to find exactly what you're looking for
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Search Area */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Search Criteria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="search-type">Search Type</Label>
                    <Select value={searchType} onValueChange={setSearchType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="candidates">Candidates</SelectItem>
                        <SelectItem value="jobs">Jobs</SelectItem>
                        <SelectItem value="companies">Companies</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="match-type">Match Type</Label>
                    <Select value={matchType} onValueChange={setMatchType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select match type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Match all filters</SelectItem>
                        <SelectItem value="any">Match any filter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Filters */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Filters</Label>
                    <Button 
                      onClick={addFilter}
                      variant="outline" 
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add filter
                    </Button>
                  </div>

                  {filters.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p className="text-lg mb-2">To begin a search, add a filter</p>
                      <p className="text-sm mb-4">OR</p>
                      <Button 
                        variant="link" 
                        className="text-blue-600"
                        onClick={() => setSelectedSegment("All Candidates")}
                      >
                        Choose a segment ▼
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filters.map((filter, index) => (
                        <div key={filter.id} className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                          <div className="flex-1 grid grid-cols-3 gap-3">
                            <Select 
                              value={filter.field} 
                              onValueChange={(value) => updateFilter(filter.id, "field", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                {FILTER_FIELDS.map(field => (
                                  <SelectItem key={field.value} value={field.value}>
                                    {field.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select 
                              value={filter.operator} 
                              onValueChange={(value) => updateFilter(filter.id, "operator", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Operator" />
                              </SelectTrigger>
                              <SelectContent>
                                {OPERATORS.map(op => (
                                  <SelectItem key={op.value} value={op.value}>
                                    {op.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Input
                              placeholder="Enter value"
                              value={filter.value}
                              onChange={(e) => updateFilter(filter.id, "value", e.target.value)}
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFilter(filter.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                  <Button 
                    onClick={handleSearch}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={filters.length === 0 && !selectedSegment}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Segments */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-base">Quick Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {SEGMENTS.map((segment) => (
                    <Button
                      key={segment}
                      variant={selectedSegment === segment ? "default" : "ghost"}
                      size="sm"
                      className={`w-full justify-start text-left ${
                        selectedSegment === segment 
                          ? "bg-blue-600 text-white" 
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                      onClick={() => {
                        setSelectedSegment(segment);
                        setFilters([]);
                      }}
                    >
                      {segment}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Filters */}
            {(filters.length > 0 || selectedSegment) && (
              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base">Active Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedSegment && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Segment: {selectedSegment}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-4 w-4 p-0 hover:bg-blue-200"
                          onClick={() => setSelectedSegment("")}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    )}
                    {filters.map((filter) => (
                      filter.field && filter.value && (
                        <Badge key={filter.id} variant="secondary" className="bg-slate-100 text-slate-800">
                          {FILTER_FIELDS.find(f => f.value === filter.field)?.label} {filter.operator} "{filter.value}"
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-4 w-4 p-0 hover:bg-slate-200"
                            onClick={() => removeFilter(filter.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
