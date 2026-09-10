import { describe, expect, it } from "vitest";
import { buildPathwayChecklist, buildPromotionPlan, canOfferSavePathway, isPathwayReady, shouldPersistPathway, shouldPromotePathway, type StructuredPathway } from "./pathwaySave";

const studyPathway: StructuredPathway = {
  recommended_direction: "Study software development",
  goal: "Earn a qualification",
  education: "Matric",
  interests_or_skills: "Problem solving and computers",
  province: "Gauteng",
  constraint: "Limited transport budget",
  reasons: "This route connects the learner's interests with a realistic qualification path.",
  next_steps: ["Compare two accredited programmes", "Check mathematics requirements"],
  immediate_action: "Save one official study opportunity",
};

const businessPathway: StructuredPathway = {
  recommended_direction: "Start a small food business",
  goal: "Build an income stream",
  education: "TVET student",
  interests_or_skills: "Cooking and customer service",
  province: "Western Cape",
  constraint: "Needs low-cost starting options",
  reasons: "This route starts from an existing practical skill and can be tested in small steps.",
  next_steps: ["Interview three potential customers", "Price a small starter menu"],
  immediate_action: "Write a one-page test offer",
};

describe("pathway save safety", () => {
  it("does not save general agreement or incomplete pathways", () => {
    expect(shouldPersistPathway(false, studyPathway)).toBe(false);
    expect(shouldPersistPathway(true, null)).toBe(false);
    expect(isPathwayReady({ ...studyPathway, province: "" })).toBe(false);
  });

  it("requires genuine save intent and a ready pathway", () => {
    expect(shouldPersistPathway(true, studyPathway)).toBe(true);
  });

  it("keeps the UI save action unavailable until a ready pathway exists", () => {
    expect(canOfferSavePathway(null)).toBe(false);
    expect(canOfferSavePathway({ ...studyPathway, next_steps: [] })).toBe(true);
  });

  it("promotes only an existing conversation draft", () => {
    expect(shouldPromotePathway(true, null)).toBe(false);
    expect(shouldPromotePathway(true, 42)).toBe(true);
    expect(shouldPromotePathway(false, 42)).toBe(false);
  });

  it("verifies the promotion plan sets saved state and creates pathway-specific checklist rows", () => {
    const plan = buildPromotionPlan(studyPathway);
    expect(plan.isSaved).toBe(1);
    expect(plan.checklist).toEqual(["Compare two accredited programmes", "Check mathematics requirements", "Save one official study opportunity"]);
  });

  it("derives different checklists from each pathway", () => {
    const study = buildPathwayChecklist(studyPathway);
    const business = buildPathwayChecklist(businessPathway);
    expect(study).toContain("Compare two accredited programmes");
    expect(business).toContain("Interview three potential customers");
    expect(study).not.toEqual(business);
  });
});
