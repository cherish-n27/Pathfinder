export type StructuredPathway = {
  recommended_direction: string;
  goal: string;
  education: string;
  interests_or_skills: string;
  province: string;
  constraint: string;
  reasons: string;
  next_steps: string[];
  immediate_action: string;
};

export function isPathwayReady(pathway: Partial<StructuredPathway> | null | undefined): pathway is StructuredPathway {
  return Boolean(
    pathway &&
      pathway.recommended_direction?.trim() &&
      pathway.goal?.trim() &&
      pathway.education?.trim() &&
      pathway.interests_or_skills?.trim() &&
      pathway.province?.trim() &&
      pathway.constraint?.trim() &&
      pathway.reasons?.trim() &&
      Array.isArray(pathway.next_steps) &&
      typeof pathway.immediate_action === "string",
  );
}

export function shouldPersistPathway(saveIntent: boolean, pathway: Partial<StructuredPathway> | null | undefined) {
  return saveIntent === true && isPathwayReady(pathway);
}

export function canOfferSavePathway(pathway: Partial<StructuredPathway> | null | undefined) {
  return isPathwayReady(pathway);
}

export function shouldPromotePathway(saveIntent: boolean, existingPathwayId: number | null | undefined) {
  return saveIntent === true && typeof existingPathwayId === "number" && existingPathwayId > 0;
}

export function buildPathwayChecklist(pathway: Pick<StructuredPathway, "next_steps" | "immediate_action">) {
  const nextSteps = (pathway.next_steps ?? []).filter((step) => typeof step === "string" && step.trim()).map((step) => step.trim());
  const items = [...nextSteps, pathway.immediate_action?.trim() ?? ""].filter(Boolean);
  const unique = items.filter((item, index) => items.indexOf(item) === index);
  return unique.length ? unique : ["Review the official requirements for this direction"];
}

export function buildPromotionPlan(pathway: Pick<StructuredPathway, "next_steps" | "immediate_action">) {
  return { isSaved: 1, checklist: buildPathwayChecklist(pathway) };
}
