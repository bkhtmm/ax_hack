import { leanInductionIterativePrompt } from "./lean-induction-iterative-prompt";

export const DEFAULT_PROMPT_TYPE: string = "induction-iterative";

export type PromptType = {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
};

export const promptTypes: PromptType[] = [
  {
    id: "induction-iterative",
    name: "Induction Formalization",
    description: "Formalize mathematical induction proofs with exact code output matching reference format",
    systemPrompt: leanInductionIterativePrompt,
  },
];
