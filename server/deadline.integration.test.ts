import { describe, expect, it, vi } from "vitest";

const listDeadlineItems = vi.fn();
const listUpcomingDeadlines = vi.fn();

vi.mock("./db", async () => {
  const actual = await vi.importActual<typeof import("./db")>("./db");
  return { ...actual, listDeadlineItems, listUpcomingDeadlines };
});

const { appRouter } = await import("./routers");

const context = {
  user: { id: 7, openId: "deadline-test", name: "Deadline Test", email: "deadline@example.com", loginMethod: "test", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
  req: {} as any,
  res: {} as any,
};

describe("deadline procedures", () => {
  it("returns a September 20 deadline through the calendar range procedure", async () => {
    const deadline = { id: 21, title: "CAPACITI WIL", organisation: "CAPACITI", type: "Work", deadlineDate: new Date("2026-09-20T00:00:00.000Z"), status: "Accepted", source: "application" };
    listDeadlineItems.mockResolvedValueOnce([deadline]);
    const result = await appRouter.createCaller(context).applications.deadlines({ from: new Date("2026-09-01T00:00:00.000Z"), to: new Date("2026-10-01T00:00:00.000Z") });
    expect(result).toEqual([deadline]);
    expect(listDeadlineItems).toHaveBeenCalledWith(7, new Date("2026-09-01T00:00:00.000Z"), new Date("2026-10-01T00:00:00.000Z"));
  });

  it("uses the shared upcoming-deadlines procedure for the overview reminder", async () => {
    const upcoming = [{ id: 21, title: "CAPACITI WIL", deadlineDate: new Date("2026-09-20T00:00:00.000Z"), status: "Accepted" }];
    listUpcomingDeadlines.mockResolvedValueOnce(upcoming);
    const result = await appRouter.createCaller(context).applications.upcoming();
    expect(result).toEqual(upcoming);
    expect(listUpcomingDeadlines).toHaveBeenCalledWith(7);
  });
});
