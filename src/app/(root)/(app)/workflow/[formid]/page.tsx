import { FormFieldType } from "@/features/editor/types/input-types";
import FormClient from "@/features/form/components/form-client-wraper";

const page = async ({ params }: { params: Promise<{ formid: string }> }) => {
  const { formid } = await params;
  const dynamicInputs = [
    {
      type: "TEXT",
      name: "text",
      label: "Enter Text",
      placeholder: "Enter text...",
      description: "Enter your text",
      disabled: false,
      value: "",
      validationType: "NONE",
      required: true,
      min: 0,
      max: 1000,
      outputType: "STRING",
      handleId: "598b18ef-8a36-42d4-aa73-0549ba25f9c4",
    },
    {
      type: "TEXTAREA",
      name: "Textarea",
      label: "Textarea",
      placeholder: "Enter text...",
      description: "Enter your textarea",
      disabled: false,
      value: "",
      validationType: "NONE",
      required: true,
      min: 0,
      max: 1000,
      outputType: "STRING",
      handleId: "d40daa84-9037-40fb-81ca-18124dac36e6",
    },
    {
      type: "NUMBER",
      name: "Number",
      label: "Number",
      placeholder: "Enter number...",
      description: "Enter your number",
      disabled: false,
      value: "",
      validationType: "NONE",
      required: true,
      min: 0,
      max: 11111111111111111111111111111,
      outputType: "NUMBER",
      handleId: "df990309-8e37-4cfe-b3bd-1d600ae74ef7",
    },
    {
      type: "DATE",
      name: "Date",
      label: "Date",
      placeholder: "Select date",
      description: "Select your date",
      disabled: false,
      value: "",
      outputType: "DATE", 
      handleId: "bbd03b53-868d-4fb7-39d88116013",
      dateFormat: "ISO",
    }
  ] as FormFieldType[];

  return (
    <div className="mx-auto max-w-xl py-10">
      <FormClient formId={formid} />
    </div>
  );
};

export default page;
