import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FC } from "react";

export const LabeledInput: FC<{
  label: string;
  required?: boolean;
  tooltip: string;
  disabled?: boolean;
  value?: number | string;
  type?: "number" | "text";
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  labelClassName?: string;
}> = ({ label, required, tooltip, disabled, value, onChange, id, type = "number", labelClassName }) => {
  return (
    <div className="flex flex-col item-center space-y-4">
      <Label htmlFor={id} tooltip={tooltip}>
        <span className={labelClassName}>{label}</span> {required ? "" : "(optional)"}
      </Label>
      <Input disabled={disabled} type={type} id={id} value={value} onChange={onChange} />
    </div>
  );
};
