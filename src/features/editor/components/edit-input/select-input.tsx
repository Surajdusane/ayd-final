import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { EditInputProps } from ".";
import { InputValidationType } from "../../types/input-types";
import { NodeStaticInputType } from "../../types/input-types";

const selectInputFormSchema = z.object({
  label: z.string().min(1),
  placeholder: z.string().min(1),
  description: z.string().optional(),
  disabled: z.boolean(),
  value: z.string().optional(),
  selectValue: z
    .array(z.string())
    .refine((arr) => arr.length > 0, "At least one option is required")
    .refine(
      (arr) => arr.every((val) => val.trim().length > 0),
      "Option values cannot be empty"
    ),

  required: z.boolean(),
  handleId: z.string(),
});

const SelectInput = ({
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: EditInputProps) => {
  const form = useForm<z.infer<typeof selectInputFormSchema>>({
    resolver: zodResolver(selectInputFormSchema),
    defaultValues: {
      label: defaultValues.label,
      placeholder: defaultValues.placeholder,
      description: defaultValues.description,
      disabled: defaultValues.disabled,
      value: defaultValues.value ? (defaultValues.value as string) : "",
      selectValue: defaultValues.selectValue as string[],
      required: defaultValues.required,
      handleId: defaultValues.handleId,
    },
  });

  const handleAddOption = () => {
    const currentOptions = form.getValues("selectValue") || [];
    form.setValue("selectValue", [
      ...currentOptions,
      `Option ${currentOptions.length + 1}`,
    ]);
  };

  const handleRemoveOption = (index: number) => {
    const currentOptions = form.getValues("selectValue") || [];
    const newOptions = currentOptions.filter((_, i) => i !== index);
    form.setValue("selectValue", newOptions);
  };

  const handleOptionChange = (index: number, value: string) => {
    const currentOptions = form.getValues("selectValue") || [];
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    form.setValue("selectValue", newOptions);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-x-6">
          <FormField
            control={form.control}
            name="disabled"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-2 rounded-none size-5"
                    />
                  </FormControl>
                  <FormLabel>Disabled</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="required"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-2 rounded-none size-5"
                    />
                  </FormControl>
                  <FormLabel>Required</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Value</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select default value" />
                  </SelectTrigger>
                  <SelectContent>
                    {form
                      .watch("selectValue")
                      ?.filter((option) => option.trim() !== "")
                      .map((option, index) => (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select Options */}
        <FormField
          control={form.control}
          name="selectValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Options</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {field.value?.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        placeholder={`Option ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveOption(index)}
                        disabled={field.value.length <= 1}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddOption}
                    className="w-full"
                  >
                    Add Option
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-y-2">
          <Button className="w-full" type="submit" disabled={disabled}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SelectInput;
