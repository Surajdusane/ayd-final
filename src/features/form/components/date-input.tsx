"use client";

import React, { useEffect, useRef, useState } from "react";

import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { DateFormat, FormFieldType } from "../../editor/types/input-types";

// Utility: format a Date object into a given format
export const formatDate = (date: Date, formatType: DateFormat): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const monthNamesFull = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthNamesAbbr = monthNamesFull.map((m) => m.slice(0, 3));
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  switch (formatType) {
    case DateFormat.ISO:
      return `${year}-${month}-${day}`;
    case DateFormat.ISO_SLASH:
      return `${year}/${month}/${day}`;
    case DateFormat.ISO_DOT:
      return `${year}.${month}.${day}`;
    case DateFormat.ISO_SHORT:
      return `${String(year).slice(2)}-${month}-${day}`;
    case DateFormat.US:
      return `${month}/${day}/${year}`;
    case DateFormat.US_SHORT:
      return `${Number(month)}/${Number(day)}/${String(year).slice(2)}`;
    case DateFormat.US_LONG:
      return `${monthNamesFull[date.getMonth()]} ${day}, ${year}`;
    case DateFormat.US_ABBR:
      return `${monthNamesAbbr[date.getMonth()]} ${day}, ${year}`;
    case DateFormat.EU:
      return `${day}/${month}/${year}`;
    case DateFormat.EU_SHORT:
      return `${Number(day)}/${Number(month)}/${String(year).slice(2)}`;
    case DateFormat.EU_DOT:
      return `${day}.${month}.${year}`;
    case DateFormat.EU_DASH:
      return `${day}-${month}-${year}`;
    case DateFormat.TEXT:
      return `${day} ${monthNamesFull[date.getMonth()]} ${year}`;
    case DateFormat.TEXT_US:
      return `${monthNamesFull[date.getMonth()]} ${day} ${year}`;
    case DateFormat.TEXT_DAY:
      return `${dayNames[date.getDay()]}, ${day} ${monthNamesFull[date.getMonth()]} ${year}`;
    case DateFormat.TEXT_US_DAY:
      return `${dayNames[date.getDay()]}, ${monthNamesFull[date.getMonth()]} ${day}, ${year}`;
    default:
      return date.toISOString().split("T")[0];
  }
};

// Helper function to safely parse ISO date strings to Date objects
// Handles timezone issues by creating date in local timezone
const parseDateValue = (value: any): Date | undefined => {
  if (!value && value !== 0) return undefined;

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? undefined : value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    // Handle ISO date (YYYY-MM-DD) safely - create in LOCAL timezone
    const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      // Use local timezone constructor to avoid UTC shift
      return new Date(Number(year), Number(month) - 1, Number(day));
    }

    // Fallback for other formats
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  }

  if (typeof value === "number") {
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  }

  return undefined;
};

type DateFormInputProps = {
  data: FormFieldType;
  onChange: (handleId: string, value: string) => void;
};

const DateFormInput = ({ data, onChange }: DateFormInputProps) => {
  const {
    label,
    description,
    value,
    name,
    placeholder,
    disabled,
    required,
    dateFormat = DateFormat.ISO,
    handleId,
  } = data;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    return parseDateValue(value);
  });

  const [open, setOpen] = useState(false);

  // Track what we last sent to the parent via onChange
  const lastSentValueRef = useRef<string>("");

  // Only sync from prop if it's different from what we last sent
  useEffect(() => {
    const propValue = String(value || "");

    // If the prop value is different from what we sent, it's an external change
    if (propValue && propValue !== lastSentValueRef.current) {
      const parsedDate = parseDateValue(value);
      setSelectedDate(parsedDate);
      lastSentValueRef.current = propValue;
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setOpen(false);

    if (date) {
      const formattedDate = formatDate(date, dateFormat as DateFormat);
      lastSentValueRef.current = formattedDate; // Track what we're sending
      onChange(handleId, formattedDate);
    } else {
      lastSentValueRef.current = "";
      onChange(handleId, "");
    }
  };

  const formattedDisplay = selectedDate
    ? formatDate(selectedDate, dateFormat as DateFormat)
    : placeholder || "Pick a date";

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>

      {description && <FieldDescription>{description}</FieldDescription>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={name}
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
            disabled={disabled}
            type="button"
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">{formattedDisplay}</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={disabled}
            className="rounded-md border"
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>

      <p className="text-muted-foreground mt-1 text-xs">Format: {dateFormat}</p>
    </Field>
  );
};

export default DateFormInput;
