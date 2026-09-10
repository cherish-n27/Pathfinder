import { describe, expect, it } from "vitest";

describe("SerpApi configuration", () => {
  it("accepts the configured API key through the account endpoint", async () => {
    const key = process.env.SERPAPI_API_KEY;
    expect(key, "SERPAPI_API_KEY must be configured").toBeTruthy();
    const url = new URL("https://serpapi.com/account.json");
    url.searchParams.set("api_key", key!);
    const response = await fetch(url);
    if (response.status === 401 || response.status === 403) throw new Error(`SerpApi rejected the configured key (${response.status})`);
    expect(response.ok).toBe(true);
  }, 30000);
});
