import { describe, expect, it } from "vitest";
import { scoreOpportunity } from "./recommendation";

describe("scoreOpportunity", () => {
  it("weights category, interest overlap, and constraints transparently", () => {
    expect(scoreOpportunity({ categoryMatch: true, traitOverlap: 32, constraintFit: 18 })).toEqual({ score: 90, reason: "matches your chosen direction; overlaps with your interests or skills; fits the constraints you shared" });
  });

  it("does not allow scores outside the 0-100 range", () => {
    expect(scoreOpportunity({ categoryMatch: false, traitOverlap: 99, constraintFit: -4 }).score).toBe(40);
  });
});
