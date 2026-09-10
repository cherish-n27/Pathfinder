import { describe, expect, it } from "vitest";
import { deadlineDateKey, deadlineTone, groupDeadlinesByDate, isDeadlineInRange } from "./deadlineCalendar";

describe("deadline calendar grouping", () => {
  it("marks CAPACITI WIL on 20 September 2026 and keeps Accepted green", () => {
    const items = [{ title: "CAPACITI WIL", deadlineDate: "2026-09-20T00:00:00.000Z", status: "Accepted" }];
    const grouped = groupDeadlinesByDate(items);
    expect(deadlineDateKey(items[0].deadlineDate)).toBe("2026-09-20");
    expect(grouped.get("2026-09-20")?.[0].title).toBe("CAPACITI WIL");
    expect(deadlineTone(grouped.get("2026-09-20") ?? [])).toBe("green");
  });

  it("preserves the persisted SQL calendar date instead of shifting it by timezone", () => {
    const item = { title: "CAPACITI WIL", deadlineDate: "2026-09-20 00:00:00", status: "Accepted" };
    expect(deadlineDateKey(item.deadlineDate)).toBe("2026-09-20");
    expect(groupDeadlinesByDate([item]).get("2026-09-20")?.[0].status).toBe("Accepted");
    expect(isDeadlineInRange(item.deadlineDate, new Date("2026-09-01T00:00:00.000Z"), new Date("2026-10-01T00:00:00.000Z"))).toBe(true);
  });

  it("uses coral for approaching non-accepted deadlines", () => {
    expect(deadlineTone([{ title: "Application", deadlineDate: "2026-09-20", status: "Accepted" }, { title: "Other", deadlineDate: "2026-09-20", status: "Applied" }])).toBe("green");
    expect(deadlineTone([{ title: "Other", deadlineDate: "2026-09-20", status: "Applied" }])).toBe("coral");
  });
});
