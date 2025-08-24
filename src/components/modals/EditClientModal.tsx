import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectItem,
} from "@/components/ui/select";

const API_BASE_URL = "http://16.171.117.2:3000";

interface ClientForm {
  name: string;
  website: string;
  careersPage: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  linkedin: string;
  phone: string;
  tags: string[];
  industry: string;
  size: string;
  currency: string;
  revenue: string;
}

const INDUSTRY_OPTIONS = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Manufacturing",
  "Hospitality",
  "Transportation",
  "Energy",
  "Other",
];

export default function EditClientModal({ open, onOpenChange, clientId }) {
  const initialFormState: ClientForm = {
    name: "",
    website: "",
    careersPage: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    linkedin: "",
    phone: "",
    tags: [],
    industry: "",
    size: "",
    currency: "USD",
    revenue: "",
  };

  const [form, setForm] = useState<ClientForm>({ ...initialFormState });
  const [loading, setLoading] = useState(false);

  const handleSelectChange = (field: keyof ClientForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (open && clientId != null) {
      setLoading(true);
      axios
        .get(`${API_BASE_URL}/client/${clientId}`)
        .then((res) => {
          const list = res.data.result;
          const c = Array.isArray(list) ? list[0] : list;
          setForm({
            name: c.name || "",
            website: c.website || "",
            careersPage: c.careersPage || "",
            street1: c.street1 || "",
            street2: c.street2 || "",
            city: c.city || "",
            state: c.state || "",
            country: c.country || "",
            zipcode: c.zipcode || "",
            linkedin: c.linkedin || "",
            phone: c.phone || "",
            tags: c.tags || [],
            industry: c.industry || "",
            size: c.size || "",
            currency: c.currency || "USD",
            revenue: c.revenue || "",
          });
        })
        .catch((err) => {
          console.error("Failed to load client:", err);
          toast.error("Failed to load client data.");
        })
        .finally(() => setLoading(false));
    }
  }, [clientId, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagAdd = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const tag = e.target.value.trim();
      if (!form.tags.includes(tag)) {
        setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      }
      e.target.value = "";
    }
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`${API_BASE_URL}/client/${clientId}`, form);
      toast.success("Client updated successfully!");
      onOpenChange(false);
    } catch (err) {
      console.error("Error updating client:", err);
      toast.error("Failed to update client.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl rounded-2xl p-0 overflow-hidden">
        <div className="max-h-[90vh] overflow-y-auto p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Edit Client
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                name="name"
                placeholder="Client Name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <Input
                name="website"
                placeholder="https://example.com"
                value={form.website}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Careers Page URL
              </label>
              <Input
                name="careersPage"
                placeholder="Careers Page URL"
                value={form.careersPage}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn</label>
              <Input
                name="linkedin"
                placeholder="LinkedIn URL"
                value={form.linkedin}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Street 1</label>
              <Input
                name="street1"
                placeholder="Street address line 1"
                value={form.street1}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Street 2</label>
              <Input
                name="street2"
                placeholder="Street address line 2"
                value={form.street2}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <Input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <Input
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <Input
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Zip Code</label>
              <Input
                name="zipcode"
                placeholder="Postal Code"
                value={form.zipcode}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input
                name="phone"
                placeholder="Phone number"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="md:cols-span-2">
            <label className="block text-sm font-medium mb-1">
              Tags (Enter to add)
            </label>
            <Input
              placeholder="Add tag and press Enter"
              onKeyDown={handleTagAdd}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {form.tags.map((tag, idx) => (
                <Badge
                  key={idx}
                  className="flex items-center gap-1 px-2 py-1 text-sm bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transition-all"
                >
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Industry</label>
              <Select
                value={form.industry || ""}
                onValueChange={(val) => handleSelectChange("industry", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectScrollUpButton />
                  {INDUSTRY_OPTIONS.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                  <SelectScrollDownButton />
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm">Company Size</label>
              <Select
                value={form.size}
                onValueChange={(val) => handleSelectChange("size", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>

                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectScrollUpButton />
                  {[
                    "0–1",
                    "2–10",
                    "11–50",
                    "51–200",
                    "201–500",
                    "501–1,000",
                    "1,001–5,000",
                    "5,001–10,000",
                    "10,001+",
                  ].map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                  <SelectScrollDownButton />
                </SelectContent>
              </Select>
            </div>
            {/* Currency & Revenue */}
            <div className="md:col-span-2 flex gap-4">
              <div className="w-1/5">
                <label className="text-sm">Currency</label>
                <Select
                  value={form.currency}
                  onValueChange={(val) => handleSelectChange("currency", val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>

                  <SelectContent className="max-h-60 overflow-y-auto">
                    <SelectScrollUpButton />
                    {[
                      "USD",
                      "EUR",
                      "INR",
                      "GBP",
                      "AUD",
                      "CAD",
                      "JPY",
                      "CNY",
                      "SGD",
                      "CHF",
                    ].map((curr) => (
                      <SelectItem key={curr} value={curr}>
                        {curr}
                      </SelectItem>
                    ))}
                    <SelectScrollDownButton />
                  </SelectContent>
                </Select>
              </div>

              <div className="w-4/5">
                <label className="text-sm">Revenue</label>
                <Input
                  placeholder="e.g. 5000000"
                  value={form.revenue}
                  onChange={(e) =>
                    handleSelectChange("revenue", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              onClick={handleSubmit}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

