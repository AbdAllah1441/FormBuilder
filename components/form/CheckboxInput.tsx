import { Label } from "@/components/ui/label";
import { QuestionOption } from "@/types/form";

interface CheckboxInputProps {
  label: string;
  required?: boolean;
  options: QuestionOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
}

export function CheckboxInput({
  label,
  required,
  options,
  value = [],
  onChange,
}: CheckboxInputProps) {
  const handleChange = (optionId: string, checked: boolean) => {
    if (checked) {
      onChange?.([...value, optionId]);
    } else {
      onChange?.(value.filter((id) => id !== optionId));
    }
  };

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
              type="checkbox"
              id={option.id}
              checked={value.includes(option.id)}
              onChange={(e) => handleChange(option.id, e.target.checked)}
              className="h-4 w-4 text-foreground border-input focus:ring-2 focus:ring-ring rounded cursor-pointer"
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
