import { Label } from "@/components/ui/label";
import { QuestionOption } from "@/types/form";

interface RadioInputProps {
  label: string;
  required?: boolean;
  options: QuestionOption[];
  value?: string;
  onChange?: (value: string) => void;
}

export function RadioInput({
  label,
  required,
  options,
  value,
  onChange,
}: RadioInputProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="mt-3 space-y-3">
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-3">
            <input
              type="radio"
              id={option.id}
              name={label}
              value={option.id}
              checked={value === option.id}
              onChange={(e) => onChange?.(e.target.value)}
              className="h-4 w-4 text-foreground border-input focus:ring-2 focus:ring-ring cursor-pointer"
            />
            <Label
              htmlFor={option.id}
              className="font-normal cursor-pointer text-sm text-foreground"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
