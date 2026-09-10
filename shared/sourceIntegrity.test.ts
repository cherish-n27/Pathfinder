import { describe, expect, it } from "vitest";
import { hasVerifiableSource, normalizeSourceUrl } from "./sourceIntegrity";

describe("hasVerifiableSource", () => {
  it("accepts secure external source URLs", () => {
    expect(hasVerifiableSource("https://www.nsfas.org.za/content/bursary-scheme.html")).toBe(true);
  });
  it("rejects missing, relative, and insecure URLs", () => {
    expect(hasVerifiableSource(undefined)).toBe(false);
    expect(hasVerifiableSource("/opportunity/1")).toBe(false);
    expect(hasVerifiableSource("http://example.com")).toBe(false);
  });
});

describe("normalizeSourceUrl", () => {
  it("canonicalizes secure URLs and removes fragments", () => {
    expect(normalizeSourceUrl(" https://example.org/path#section ")).toBe("https://example.org/path");
  });
  it("returns null for non-HTTPS URLs", () => {
    expect(normalizeSourceUrl("http://example.org/path")).toBeNull();
  });
});
