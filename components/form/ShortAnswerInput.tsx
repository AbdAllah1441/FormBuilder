import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  
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
          placeholder={t.enterYourAnswer}
          className="w-full"
        />
      </div>
    </div>
  );
}
