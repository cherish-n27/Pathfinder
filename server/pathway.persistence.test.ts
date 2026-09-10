import { describe, expect, it, vi, beforeEach } from "vitest";

const upsertDraft = vi.fn();
const saveConversationPathway = vi.fn();
const invokeLLM = vi.fn();

vi.mock("./db", async () => {
  const actual = await vi.importActual<typeof import("./db")>("./db");
  return { ...actual, addMessage: vi.fn(), upsertPersonalisedPathwayDraft: upsertDraft, saveConversationPathway };
});

vi.mock("./_core/llm", () => ({ invokeLLM }));

const { appRouter } = await import("./routers");
const { promotePathwayRecord, saveConversationPathway: realSaveConversationPathway } = await vi.importActual<typeof import("./db")>("./db");

const context = {
  user: { id: 7, openId: "pathway-test", name: "Pathway Test", email: "test@example.com", loginMethod: "test", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
  req: {} as any,
  res: {} as any,
};

const readyPathway = {
  recommended_direction: "Study software development",
  goal: "Earn a qualification",
  education: "Matric",
  interests_or_skills: "Problem solving and computers",
  province: "Gauteng",
  constraint: "Limited transport budget",
  reasons: "It connects the learner's interests with a realistic qualification path.",
  next_steps: ["Compare two accredited programmes", "Check mathematics requirements"],
  immediate_action: "Save one official study opportunity",
};

function llmReply(save_intent: boolean) {
  invokeLLM.mockResolvedValueOnce({ choices: [{ message: { content: JSON.stringify({ reply: save_intent ? "Saved." : "Here is a direction to explore.", profile_updates: {}, pathway: readyPathway, save_intent }) } }] });
}

describe("guide pathway persistence flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not auto-save when the AI reports save intent", async () => {
    llmReply(true);
    const result = await appRouter.createCaller(context).guide.respond({ profile: "{}", history: [], message: "save this", conversationId: 91 });
    expect(result.pathway).toBeNull();
    expect(saveConversationPathway).not.toHaveBeenCalled();
    expect(upsertDraft).toHaveBeenCalledWith(7, 91, readyPathway, expect.any(String));
  });

  it("promotes a real pathway record into saved state and inserts its checklist exactly once", async () => {
    const updateSet = vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) });
    const insertValues = vi.fn().mockResolvedValue(undefined);
    const fakeDb = { update: vi.fn().mockReturnValue({ set: updateSet }), insert: vi.fn().mockReturnValue({ values: insertValues }) } as any;
    const pathway = { id: 44, isSaved: 0, nextSteps: "Compare two accredited programmes; Check mathematics requirements", immediateAction: "Save one official study opportunity" } as any;

    const promoted = await promotePathwayRecord(fakeDb, pathway);
    const repeated = await promotePathwayRecord(fakeDb, promoted);

    expect(promoted).toMatchObject({ id: 44, isSaved: 1 });
    expect(insertValues).toHaveBeenCalledTimes(1);
    expect(insertValues).toHaveBeenCalledWith([
      expect.objectContaining({ pathwayId: 44, text: "Compare two accredited programmes", sortOrder: 0 }),
      expect.objectContaining({ pathwayId: 44, text: "Check mathematics requirements", sortOrder: 1 }),
      expect.objectContaining({ pathwayId: 44, text: "Save one official study opportunity", sortOrder: 2 }),
    ]);
    expect(repeated).toEqual(promoted);
    expect(updateSet).toHaveBeenCalledTimes(1);
    expect(insertValues).toHaveBeenCalledTimes(1);
  });

  it("directly saves a conversation pathway through the real helper with one checklist insert", async () => {
    const pathway = { id: 45, userId: 7, conversationId: 93, isSaved: 0, nextSteps: "Compare two accredited programmes; Check mathematics requirements", immediateAction: "Save one official study opportunity" } as any;
    const savedPathway = { ...pathway, isSaved: 1 };
    let selectCall = 0;
    const selectChain = () => ({
      from: () => ({
        where: () => ({
          orderBy: () => ({ limit: vi.fn().mockImplementation(async () => (++selectCall === 1 ? [pathway] : [savedPathway])) }),
          limit: vi.fn().mockImplementation(async () => (++selectCall === 1 ? [pathway] : [savedPathway])),
        }),
      }),
    });
    const updateSet = vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) });
    const insertValues = vi.fn().mockResolvedValue(undefined);
    const fakeDb = { select: vi.fn(selectChain), update: vi.fn().mockReturnValue({ set: updateSet }), insert: vi.fn().mockReturnValue({ values: insertValues }) } as any;

    const result = await realSaveConversationPathway(7, 93, fakeDb);

    expect(result).toMatchObject({ id: 45, conversationId: 93, isSaved: 1 });
    expect(updateSet).toHaveBeenCalledTimes(1);
    expect(insertValues).toHaveBeenCalledTimes(1);
    expect(insertValues.mock.calls[0][0]).toHaveLength(3);
    expect(insertValues.mock.calls[0][0].map((item: any) => item.text)).toEqual([
      "Compare two accredited programmes",
      "Check mathematics requirements",
      "Save one official study opportunity",
    ]);
  });

  it("creates a draft first, then promotes that conversation draft on save intent", async () => {
    upsertDraft.mockResolvedValueOnce({ id: 12, conversationId: 92, isSaved: 0 });
    saveConversationPathway.mockResolvedValueOnce({ id: 12, conversationId: 92, isSaved: 1 });

    llmReply(false);
    const draftResult = await appRouter.createCaller(context).guide.respond({ profile: "{}", history: [], message: "show me a direction", conversationId: 92 });
    expect(draftResult.pathway).toBeNull();
    expect(upsertDraft).toHaveBeenCalledWith(7, 92, readyPathway, expect.any(String));

    llmReply(true);
    const readyResult = await appRouter.createCaller(context).guide.respond({ profile: "{}", history: [], message: "save this pathway", conversationId: 92 });
    expect(readyResult.pathway).toBeNull();
    expect(saveConversationPathway).not.toHaveBeenCalled();
    const savedResult = await appRouter.createCaller(context).pathways.save({ conversationId: 92 });
    expect(savedResult).toMatchObject({ id: 12, conversationId: 92, isSaved: 1 });
    expect(saveConversationPathway).toHaveBeenCalledWith(7, 92);
  });
});
