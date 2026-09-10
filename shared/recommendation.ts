export type MatchInput = { categoryMatch: boolean; traitOverlap: number; constraintFit: number };
export function scoreOpportunity(input: MatchInput) {
  const category = input.categoryMatch ? 40 : 0;
  const traits = Math.max(0, Math.min(40, input.traitOverlap));
  const constraints = Math.max(0, Math.min(20, input.constraintFit));
  const score = Math.round(category + traits + constraints);
  const reasons: string[] = [];
  if (input.categoryMatch) reasons.push("matches your chosen direction");
  if (traits > 0) reasons.push("overlaps with your interests or skills");
  if (constraints >= 15) reasons.push("fits the constraints you shared");
  if (constraints < 15) reasons.push("check the requirements and access details");
  return { score, reason: reasons.join("; ") };
}
