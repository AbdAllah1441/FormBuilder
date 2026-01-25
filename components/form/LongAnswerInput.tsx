import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface LongAnswerInputProps {
  label: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export function LongAnswerInput({
  label,
  required,
  value = "",
  onChange,
}: LongAnswerInputProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="mt-3">
        <Textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Enter your answer"
          rows={4}
          className="w-full"
        />
      </div>
    </div>
  );
}
