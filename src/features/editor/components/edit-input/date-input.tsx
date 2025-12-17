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
import { DateFormat } from "../../types/input-types";

const dateInputFormSchema = z.object({
  label: z.string().min(1),
  placeholder: z.string().min(1),
  description: z.string().optional(),
  disabled: z.boolean(),
  required: z.boolean(),
  handleId: z.string(),
  dateFormat: z.enum(DateFormat),
});

const DateInput = ({
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: EditInputProps) => {
  const form = useForm<z.infer<typeof dateInputFormSchema>>({
    resolver: zodResolver(dateInputFormSchema),
    defaultValues: {
      label: defaultValues.label,
      placeholder: defaultValues.placeholder,
      description: defaultValues.description,
      disabled: defaultValues.disabled,
      required: defaultValues.required,
      handleId: defaultValues.handleId,
      dateFormat: defaultValues.dateFormat,
    },
  });

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
          name="dateFormat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Format</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DateFormat).map((format) => (
                      <SelectItem key={format} value={format}>
                        {format}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

export default DateInput;
