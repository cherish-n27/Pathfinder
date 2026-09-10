import { describe, expect, it } from "vitest";
import { rollbackApplicationStatus } from "../shared/applicationState";

describe("application status rollback", () => {
  it("restores the previous status for the failed target only", () => {
    const first = { id: 1, status: "Applied" };
    const second = { id: 2, status: "Waiting" };
    const optimistic = [{ ...first, status: "Accepted" }, second];
    expect(rollbackApplicationStatus(optimistic, optimistic[0]!, "Applied")).toEqual([{ id: 1, status: "Applied" }, second]);
  });
});
