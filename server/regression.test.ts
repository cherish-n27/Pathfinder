import { afterEach, describe, expect, it, vi } from "vitest";
import { scoreOpportunity } from "../shared/recommendation";
import { searchLiveOpportunities } from "./db";

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.TAVILY_API_KEY;
  delete process.env.SERPAPI_API_KEY;
});

describe("PathFinder regression contracts", () => {
  it("keeps pathway scoring transparent and bounded", () => {
    expect(scoreOpportunity({ categoryMatch: true, traitOverlap: 32, constraintFit: 18 })).toEqual({ score: 90, reason: "matches your chosen direction; overlaps with your interests or skills; fits the constraints you shared" });
    expect(scoreOpportunity({ categoryMatch: false, traitOverlap: 99, constraintFit: -4 }).score).toBe(40);
  });

  it("maps SerpApi organic results into live opportunities", async () => {
    process.env.SERPAPI_API_KEY = "serp-test-key";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ organic_results: [{ title: "Remote IT support internships", link: "https://example.org/it-support", snippet: "A practical internship opportunity." }] }) }));
    const result = await searchLiveOpportunities("remote IT support", "Work", "Western Cape");
    expect(result.fallback).toBe(false);
    expect(result.results[0]).toMatchObject({ name: "Remote IT support internships", sourceUrl: "https://example.org/it-support", category: "Work", province: "Western Cape" });
  });

  it("falls back clearly when live opportunity search is unavailable", async () => {
    process.env.TAVILY_API_KEY = "test-key";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network unavailable")));
    const result = await searchLiveOpportunities("digital skills");
    expect(result.fallback).toBe(true);
    expect(result.results).toEqual([]);
    expect(result.message).toMatch(/curated|timed out|unavailable/i);
  });
});
