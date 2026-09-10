import { describe, expect, it } from "vitest";
import { hasVerifiableSource, normalizeSourceUrl } from "../shared/sourceIntegrity";

describe("opportunity source integrity", () => {
  it("accepts canonical secure source links", () => {
    expect(normalizeSourceUrl(" https://example.org/path#details ")).toBe("https://example.org/path");
    expect(hasVerifiableSource("https://www.nsfas.org.za/content/bursary-scheme.html")).toBe(true);
  });

  it("rejects insecure or relative links", () => {
    expect(normalizeSourceUrl("http://example.org")).toBeNull();
    expect(normalizeSourceUrl("/relative-opportunity")).toBeNull();
    expect(hasVerifiableSource(undefined)).toBe(false);
  });
});
