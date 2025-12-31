import { AdditionOpreation } from "./addition-opreation";
import { DivisionOpreation } from "./division-opreation";
import { DocumentNode } from "./document-node";
import { FormInput } from "./form-input";
import { LetterCaseOpreation } from "./letter-case-opreation";
import { MultiplicationOpreation } from "./multiplication-opreation";
import { NumberFormatOpreation } from "./number-format-opreation";
import { NumberToStringOpreation } from "./number-to-string";
import { PercentageOpreation } from "./percentage-opreation";
import { PrefixOpreation } from "./prefix-opreation";
import { SubtractionOpreation } from "./subtraction-opreation";
import { SuffixOpreation } from "./suffix-opreation";

export const tasks = {
  FORM_INPUTS: FormInput,
  ADDITION_OPREATION: AdditionOpreation,
  SUBTRACTION_OPREATION: SubtractionOpreation,
  MULTIPLICATION_OPREATION: MultiplicationOpreation,
  DIVISION_OPREATION: DivisionOpreation,
  PERCENTAGE_OPREATION: PercentageOpreation,
  NUMBER_TO_STRING_OPREATION: NumberToStringOpreation,
  LETTERCASE_OPREATION: LetterCaseOpreation,
  NUMBER_FORMAT_OPREATION: NumberFormatOpreation,
  PREFIX_OPREATION: PrefixOpreation,
  SUFFIX_OPREATION: SuffixOpreation,
  DOCUMENT_NODE: DocumentNode,
};
