import { FormFieldType } from "../types/input-types"

export function getDynamicInputData(data: FormFieldType[], id: string) {
    return data.find(input => input.handleId === id)
}