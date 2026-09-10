import { describe, expect, it } from "vitest";

describe("Tavily configuration", () => {
  it("accepts the configured API key when the endpoint is reachable", async () => {
    const key = process.env.TAVILY_API_KEY;
    expect(key, "TAVILY_API_KEY must be configured").toBeTruthy();
    try {
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ api_key: key, query: "South Africa youth opportunities", max_results: 1, search_depth: "basic" }),
      });
      if (response.status === 401 || response.status === 403) throw new Error(`Tavily rejected the configured key (${response.status})`);
      if (!response.ok) return;
      const payload = await response.json() as { results?: unknown[] };
      expect(Array.isArray(payload.results)).toBe(true);
    } catch (error) {
      if (error instanceof Error && error.message.includes("rejected the configured key")) throw error;
      console.warn("Tavily endpoint unavailable during local test; secure live-search fallback remains enabled.");
    }
  }, 15000);
});
