import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ShortAnswerInputProps {
  label: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export function ShortAnswerInput({
  label,
  required,
  value = "",
  onChange,
}: ShortAnswerInputProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="mt-3">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Enter your answer"
          className="w-full"
        />
      </div>
    </div>
  );
}
