import data from "../../../../data.json" with { type: "json" };
import formData from "../../../../formdata.json" with { type: "json" };
import plan from "../../../../plan.json" with { type: "json" };
import { generateFinalOutput } from "./final-execution";

const result = generateFinalOutput(data.edges, formData, plan);

console.log(result);
