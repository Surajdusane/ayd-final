import { useEffect, useId, useState } from "react";

import { Asterisk } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { NodeStaticInput } from "../../types/input-types";

type SelectInputProps = {
  input: NodeStaticInput;
  value: string;
  updateNodeParamValue: (newValue: string) => void;
  disabled?: boolean;
};

const SelectInput = ({ input, value, disabled, updateNodeParamValue }: SelectInputProps) => {
  const id = useId();
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Default options if none provided - you can customize this
  const selectOptions = input.options;
  if (!selectOptions) return null;

  return (
    <div className="w-full space-y-3 p-1">
      <Label htmlFor={id} className="flex text-xs font-medium">
        {input.name}
        {input.required ? (
          <Badge variant="secondary" className="flex items-center justify-center">
            <Asterisk />
          </Badge>
        ) : (
          <Badge variant="secondary">Optional</Badge>
        )}
      </Label>
      <Select
        value={internalValue}
        onValueChange={(newValue) => {
          setInternalValue(newValue);
          updateNodeParamValue(newValue);
        }}
        disabled={disabled}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {selectOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {input.helperText && <p className="text-muted-foreground text-xs">{input.helperText}</p>}
    </div>
  );
};

export default SelectInput;
