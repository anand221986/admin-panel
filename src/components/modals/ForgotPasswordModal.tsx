import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const API_BASE_URL = "http://16.171.117.2:3000";

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ForgotPasswordModal({
  open,
  onOpenChange,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  useEffect(() => {
    if (open) {
      setEmail("");
      setStatus("idle");
    }
  }, [open]);

  const handleSend = async () => {
    setStatus("sending");
    try {
      await axios.post(
        `${API_BASE_URL}/auth/forgot-password`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      setStatus("sent");
      onOpenChange(false);
      toast.success("Reset link sent successfully!");
    } catch (err) {
      toast.error("Please enter correct email.");
      console.error("Forgot password error", err);
      setStatus("error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Reset your password</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Label htmlFor="fp-email" className="text-sm font-medium">
            Enter your email address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="fp-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-15"
              required
            />
          </div>

          <Button
            onClick={handleSend}
            disabled={status === "sending" || !email}
            className="w-full h-11"
          >
            {status === "sending"
              ? "Sending..."
              : status === "sent"
              ? "Email Sent"
              : status === "error"
              ? "Try Again"
              : "Send Reset Link"}
          </Button>

          {status === "sent" && (
            <p className="text-green-600 text-sm">
              Check your email for reset instructions.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
