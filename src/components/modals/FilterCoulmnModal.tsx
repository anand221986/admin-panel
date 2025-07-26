import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterColumnsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: { key: string; label: string }[];
  visibleColumns: string[];
  onChange: (key: string, visible: boolean) => void;
}

export function FilterColumnsModal({
  open,
  onOpenChange,
  columns,
  visibleColumns,
  onChange,
}: FilterColumnsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl w-full max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800">
            Show / Hide Columns
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4 max-h-60 overflow-y-auto">
          {columns.map((col) => (
            <div key={col.key} className="flex items-center space-x-3">
              <Checkbox
                id={col.key}
                checked={visibleColumns.includes(col.key)}
                onCheckedChange={(checked) =>
                  onChange(col.key, Boolean(checked))
                }
                className="h-5 w-5"
              />
              <Label
                htmlFor={col.key}
                className="text-sm font-medium text-slate-700"
              >
                {col.label}
              </Label>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            className="w-full rounded-lg"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
