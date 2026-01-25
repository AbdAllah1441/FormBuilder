import { Label } from "@/components/ui/label";

interface RatingInputProps {
  label: string;
  required?: boolean;
  value?: number;
  onChange?: (value: number) => void;
}

export function RatingInput({
  label,
  required,
  value,
  onChange,
}: RatingInputProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="mt-3 flex items-center space-x-4">
        {[1, 2, 3, 4, 5].map((rating) => (
          <div key={rating} className="flex items-center space-x-2">
            <input
              type="radio"
              id={`${label}-${rating}`}
              name={label}
              value={rating}
              checked={value === rating}
              onChange={() => onChange?.(rating)}
              className="h-4 w-4 text-foreground border-input focus:ring-2 focus:ring-ring cursor-pointer"
            />
            <Label
              htmlFor={`${label}-${rating}`}
              className="font-normal cursor-pointer text-sm text-foreground"
            >
              {rating}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
