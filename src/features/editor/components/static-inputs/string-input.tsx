import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NodeStaticInput } from "../../types/input-types"; 
import { Asterisk } from "lucide-react";
import { useEffect, useId, useState } from "react";

type StringInputProps = {
  input: NodeStaticInput;
  value: string;
  updateNodeParamValue: (newValue: string) => void;
  disabled?: boolean;
}

const StringInput = ({ input, value, disabled, updateNodeParamValue }: StringInputProps) => {
  const id = useId();
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value])


  return (
    <div className="space-y-3 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex font-medium">
        {input.name}
        {input.required 
          ? <Badge variant="secondary" className="felx justify-center items-center "><Asterisk /></Badge>
          : <Badge variant="secondary" >Optional</Badge>
        }
      </Label>
      <Input
        placeholder={"Enter value"}
        id={id}
        value={internalValue}
        onChange={(e : React.ChangeEvent<HTMLInputElement>) => setInternalValue(e.target.value)}
        onBlur={(e : React.ChangeEvent<HTMLInputElement>) => updateNodeParamValue(e.target.value)}
        disabled={disabled}
        className=""
      />
      {input.helperText && (
        <p className="text-xs text-muted-foreground">{input.helperText}</p>
      )}
    </div>
  );
};

export default StringInput;

