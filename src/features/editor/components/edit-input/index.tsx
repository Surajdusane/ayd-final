import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";

import { Tooltip, TooltipContent } from "@/components/ui/tooltip";

import { FormFieldType, InputType } from "../../types/input-types";
import DateInput from "./date-input";
import NumberInput from "./number-input";
import SelectInput from "./select-input";
import TextAreaInput from "./text-area-input";
import TextInput from "./text-input";

export type EditInputProps = {
  onSubmit: (data: any) => void;
  onDelete: () => void;
  disabled: boolean;
  defaultValues: FormFieldType;
};

export const EditInput = ({ defaultValues, onSubmit, onDelete, disabled }: EditInputProps) => {
  switch (defaultValues.type) {
    case InputType.TEXT:
      return <TextInput defaultValues={defaultValues} disabled={disabled} onSubmit={onSubmit} onDelete={onDelete} />;
    case InputType.TEXTAREA:
      return (
        <TextAreaInput defaultValues={defaultValues} disabled={disabled} onSubmit={onSubmit} onDelete={onDelete} />
      );
    case InputType.NUMBER:
      return <NumberInput defaultValues={defaultValues} disabled={disabled} onSubmit={onSubmit} onDelete={onDelete} />;
    case InputType.SELECT:
      return <SelectInput defaultValues={defaultValues} disabled={disabled} onSubmit={onSubmit} onDelete={onDelete} />;
    case InputType.DATE:
      return <DateInput defaultValues={defaultValues} disabled={disabled} onSubmit={onSubmit} onDelete={onDelete} />;
    default:
      return <TextInput defaultValues={defaultValues} disabled={disabled} onSubmit={onSubmit} onDelete={onDelete} />;
  }
};

export const LabelInfo = ({ description }: { description: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Info />
      </TooltipTrigger>
      <TooltipContent>
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  );
};
