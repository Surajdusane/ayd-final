import { LucideProps } from "lucide-react";
import { ParentTaskType, TaskType } from "./task";
import { ReactElement } from "react";

export enum InputType {
    TEXT = "TEXT",
    TEXTAREA = "TEXTAREA",
    NUMBER = "NUMBER",
    SELECT = "SELECT",
    DATE = "DATE",
}

export interface NodeStaticInput {
  name: string;
  type: NodeStaticInputType;  
  helperText?: string;
  required?: boolean;
  hideHandle?: boolean;
  value?: string;
  options?: Array<{ value: string; label: string }>;
  [key: string]: any;
}

export enum NodeStaticInputType {
    STRING = "STRING",
    NUMBER = "NUMBER",
    SELECT = "SELECT",
    DATE = "DATE",
}

export enum InputValidationType {
    NONE = "NONE",
    EMAIL = "EMAIL",
    PHONE = "PHONE",
}

export type FormFieldType = {
  type: InputType
  name: string
  label: string
  placeholder?: string
  description?: string
  disabled: boolean
  value: string | boolean | Date | number | string[]
  selectValue?: string[]
  validationType?: InputValidationType
  required?: boolean
  min?: number
  max?: number
  dateFormat?: DateFormat
  outputType: NodeStaticInputType
  handleId: string
}

export type StaticInputConfigType = {
    type: TaskType
    label: string
    icon: (props: LucideProps) => ReactElement
    parentTaskType: ParentTaskType
    entryPoint: boolean,
    inputs: Array<NodeStaticInput>,
    outputs: Array<any>
}

export enum DateFormat {
  // 🌐 ISO / International
  ISO = "YYYY-MM-DD",
  ISO_SLASH = "YYYY/MM/DD",
  ISO_DOT = "YYYY.MM.DD",
  ISO_SHORT = "YY-MM-DD",

  // 🇺🇸 US (Month-Day-Year)
  US = "MM/DD/YYYY",
  US_SHORT = "M/D/YY",
  US_LONG = "Month DD, YYYY",
  US_ABBR = "Mon DD, YYYY",

  // 🌍 European (Day-Month-Year)
  EU = "DD/MM/YYYY",
  EU_SHORT = "D/M/YY",
  EU_DOT = "DD.MM.YYYY",
  EU_DASH = "DD-MM-YYYY",

  // 📅 Textual / Human-Readable
  TEXT = "DD Month YYYY",
  TEXT_US = "Month DD YYYY",
  TEXT_DAY = "Day, DD Month YYYY",
  TEXT_US_DAY = "Day, Month DD, YYYY",

}

export enum LetterCase {
  LOWERCASE = "lowercase",     // e.g. "november"
  UPPERCASE = "uppercase",     // e.g. "NOVEMBER"
  CAPITALIZE = "capitalize",   // e.g. "November"
  TITLECASE = "titlecase",     // e.g. "November Fourth, Two Thousand Twenty-Five"
  SENTENCECASE = "sentencecase", // e.g. "November fourth, 2025"
  MIXEDCASE = "mixedcase"      // e.g. "nOvEmBeR"
}

export enum NumberFormat {
  UNGROUPED = "ungrouped",               // 1234567
  COMPACT_SHORT = "compact_short",   // 1.2K, 3.4M
  COMPACT_LONG = "compact_long",     // 1.2 thousand, 3.4 million
  WESTERN_GROUPING = "western_grouping", // 450,508
  INDIAN_GROUPING = "indian_grouping",   // 4,58,850
}

export type DocumentInputProps = {
    variable: string
    handleId: string
}