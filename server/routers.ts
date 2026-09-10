import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { isPathwayReady } from "../shared/pathwaySave";
import { adminUpdateOpportunity, adminListOpportunities } from "./db";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => { if (ctx.user.role !== "admin") throw new Error("Admin access required"); return next(); });
import { addMessage, createApplication, createConversation, listApplications, listDeadlineItems, listUpcomingDeadlines, updateApplication, deleteApplication, listChecklistItems, listConversations, listMessages, listOpportunities, listPathways, listPromptLibrary, listSavedOpportunities, toggleSavedOpportunity, updateChecklist, upsertProfile, getProfile, searchLiveOpportunities, upsertPersonalisedPathwayDraft, saveConversationPathway } from "./db";

const profileInput = z.object({ country: z.string().default("South Africa"), education: z.string().optional(), province: z.string().optional(), goal: z.string().optional(), interests: z.string().optional(), skills: z.string().optional(), experience: z.string().optional(), location: z.string().optional(), constraints: z.string().optional(), resources: z.string().optional() });
const applicationInput = z.object({ title: z.string().min(2), organisation: z.string().min(2), type: z.enum(["Study", "Work", "Skills", "Business", "Other"]), dateApplied: z.date().optional(), deadlineDate: z.date().optional(), status: z.enum(["Not started", "Applied", "Interview", "Waiting", "Accepted", "Not this time", "Withdrawn"]).optional(), notes: z.string().optional(), linkedPathwayId: z.number().optional(), linkedOpportunityId: z.number().optional() });
const historyInput = z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }));
const pathwayResponseSchema = { type: "object", properties: { recommended_direction: { type: "string" }, goal: { type: "string" }, education: { type: "string" }, interests_or_skills: { type: "string" }, province: { type: "string" }, constraint: { type: "string" }, reasons: { type: "string" }, next_steps: { type: "array", items: { type: "string" } }, immediate_action: { type: "string" } }, required: ["recommended_direction", "goal", "education", "interests_or_skills", "province", "constraint", "reasons", "next_steps", "immediate_action"], additionalProperties: false } as const;

export const appRouter = router({
  system: systemRouter,
  auth: router({ me: publicProcedure.query(opts => opts.ctx.user), logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }) }),
  opportunities: router({ adminList: adminProcedure.query(() => adminListOpportunities()), adminUpdate: adminProcedure.input(z.object({ id: z.number(), name: z.string().min(2).optional(), organisation: z.string().min(2).optional(), description: z.string().min(2).optional(), sourceUrl: z.string().url().startsWith("https://").optional(), verificationStatus: z.enum(["verified", "needs_review"]).optional(), deadlineDate: z.date().nullable().optional(), province: z.string().optional() })).mutation(({ input }) => { const { id, ...data } = input; return adminUpdateOpportunity(id, data); }), liveSearch: publicProcedure.input(z.object({ query: z.string().optional(), category: z.string().optional(), province: z.string().optional() })).query(({ input }) => searchLiveOpportunities(input.query || "", input.category, input.province)),
    list: publicProcedure.input(z.object({ search: z.string().optional(), category: z.enum(["Study", "Work", "Skills", "Business"]).optional(), province: z.string().optional() }).optional()).query(({ input }) => listOpportunities(input?.search, input?.category, input?.province)),
    save: protectedProcedure.input(z.object({ opportunityId: z.number().optional(), snapshotData: z.string() })).mutation(({ ctx, input }) => toggleSavedOpportunity(ctx.user.id, input.opportunityId, input.snapshotData)),
    saved: protectedProcedure.query(({ ctx }) => listSavedOpportunities(ctx.user.id)),
  }),
  prompts: router({ list: publicProcedure.query(() => listPromptLibrary()) }),
  profile: router({ get: protectedProcedure.query(({ ctx }) => getProfile(ctx.user.id)), save: protectedProcedure.input(profileInput).mutation(({ ctx, input }) => upsertProfile(ctx.user.id, input)) }),
  conversations: router({
    list: protectedProcedure.query(({ ctx }) => listConversations(ctx.user.id)),
    create: protectedProcedure.input(z.object({ title: z.string().optional() }).optional()).mutation(({ ctx, input }) => createConversation(ctx.user.id, input?.title)),
    messages: protectedProcedure.input(z.object({ conversationId: z.number() })).query(({ ctx, input }) => listMessages(ctx.user.id, input.conversationId)),
    addMessage: protectedProcedure.input(z.object({ conversationId: z.number(), sender: z.enum(["user", "assistant"]), message: z.string().min(1) })).mutation(({ ctx, input }) => addMessage(ctx.user.id, input.conversationId, input.sender, input.message)),
  }),
  applications: router({ list: protectedProcedure.query(({ ctx }) => listApplications(ctx.user.id)), deadlines: protectedProcedure.input(z.object({ from: z.date(), to: z.date() })).query(({ ctx, input }) => listDeadlineItems(ctx.user.id, input.from, input.to)), upcoming: protectedProcedure.query(({ ctx }) => listUpcomingDeadlines(ctx.user.id)), create: protectedProcedure.input(applicationInput).mutation(({ ctx, input }) => createApplication(ctx.user.id, input)), update: protectedProcedure.input(applicationInput.partial().extend({ id: z.number() })).mutation(({ ctx, input }) => { const { id, ...data } = input; return updateApplication(ctx.user.id, id, data); }), remove: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => deleteApplication(ctx.user.id, input.id)) }),
  pathways: router({ list: protectedProcedure.query(({ ctx }) => listPathways(ctx.user.id)), save: protectedProcedure.input(z.object({ conversationId: z.number() })).mutation(async ({ ctx, input }) => { const saved = await saveConversationPathway(ctx.user.id, input.conversationId); if (!saved) throw new Error("A complete pathway must be generated in this conversation before it can be saved."); return saved; }), checklist: protectedProcedure.input(z.object({ pathwayId: z.number() })).query(({ ctx, input }) => listChecklistItems(ctx.user.id, input.pathwayId)), toggleChecklist: protectedProcedure.input(z.object({ itemId: z.number(), isComplete: z.number().min(0).max(1) })).mutation(({ ctx, input }) => updateChecklist(ctx.user.id, input.itemId, input.isComplete)) }),
  guide: router({
    respond: protectedProcedure.input(z.object({ profile: z.string(), history: historyInput, message: z.string(), conversationId: z.number().optional(), completePathway: z.boolean().optional() })).mutation(async ({ ctx, input }) => {
      if (input.conversationId) await addMessage(ctx.user.id, input.conversationId, "user", input.message);
      const response = await invokeLLM({ messages: [{ role: "system", content: "You are PathFinder, a warm South African youth career guide. Ask only one question at a time. Use Grade 10 reading level, stay practical and encouraging, never diagnose, never guarantee outcomes, and never invent an institution or opportunity. Return only JSON matching the schema. Set pathway to a real object only when the readiness bar is met: goal, education, interests or skills, province, and main constraint are all known from the profile or conversation. Otherwise pathway must be null. Always extract every explicit profile field from the latest user message into profile_updates using canonical keys goal, education, province, interests, skills, constraints, experience, location, resources, and country. Dense messages may contain several fields at once; capture all of them and never ask again for a field already present in the supplied profile. Set save_intent for compatibility only; saving is controlled exclusively by the explicit Save this pathway button." }, { role: "user", content: `Profile context: ${input.profile}\nConversation so far: ${JSON.stringify(input.history)}\nNew message: ${input.message}` }], response_format: { type: "json_schema", json_schema: { name: "pathfinder_guide_response", strict: true, schema: { type: "object", properties: { reply: { type: "string" }, profile_updates: { type: "object", additionalProperties: { type: "string" } }, pathway: { anyOf: [{ ...pathwayResponseSchema }, { type: "null" }] }, save_intent: { type: "boolean" } }, required: ["reply", "profile_updates", "pathway", "save_intent"], additionalProperties: false } } } });
      const content = response.choices?.[0]?.message?.content; let parsed: any = null; try { parsed = typeof content === "string" ? JSON.parse(content) : null; } catch { parsed = null; }
      const message = typeof parsed?.reply === "string" ? parsed.reply : "I’m listening. Tell me a little more about what you want to explore.";
      const allowedProfileKeys = ["country", "education", "province", "goal", "interests", "skills", "experience", "location", "constraints", "resources"] as const;
      const rawProfile = (() => { try { return JSON.parse(input.profile || "{}"); } catch { return {}; } })() as Record<string, unknown>;
      const profileUpdates = Object.fromEntries(allowedProfileKeys.filter(key => typeof parsed?.profile_updates?.[key] === "string" && parsed.profile_updates[key].trim()).map(key => [key, parsed.profile_updates[key].trim()])) as Record<string, string>;
      if (typeof parsed?.profile_updates?.interests_or_skills === "string" && !profileUpdates.interests && !profileUpdates.skills) profileUpdates.interests = parsed.profile_updates.interests_or_skills.trim();
      const mergedProfile = { ...rawProfile, ...profileUpdates };
      if (Object.keys(profileUpdates).length) await upsertProfile(ctx.user.id, mergedProfile as any);
      if (input.conversationId) await addMessage(ctx.user.id, input.conversationId, "assistant", message);
      let structuredPathway = isPathwayReady(parsed?.pathway) ? parsed.pathway : null;
      const pathwayTrigger = Boolean(input.completePathway) || /here(?:'|’)s your pathway|here is your pathway|practical pathway|action plan|next steps|recommended direction|pathway to/i.test(message);
      if (!structuredPathway && pathwayTrigger) {
        const extraction = await invokeLLM({ messages: [{ role: "system", content: input.completePathway ? "The user chose Complete pathway. Create the best grounded structured PathFinder pathway from the supplied profile and conversation. Return a pathway only when the readiness bar is met: goal, education, interests or skills, province, and main constraint must be known. Never invent missing facts; use the closest grounded wording from the context." : "Extract a complete structured PathFinder pathway from the supplied profile, conversation, and assistant reply. Return a pathway only when the readiness bar is met: goal, education, interests or skills, province, and main constraint must be known. Never invent missing facts; use the closest grounded wording from the context." }, { role: "user", content: `Profile: ${input.profile}\nConversation: ${JSON.stringify(input.history)}\nAssistant reply: ${message}` }], response_format: { type: "json_schema", json_schema: { name: "pathfinder_pathway_extraction", strict: true, schema: pathwayResponseSchema } } });
        try { const extracted = typeof extraction.choices?.[0]?.message?.content === "string" ? JSON.parse(extraction.choices[0].message.content) : null; if (isPathwayReady(extracted)) structuredPathway = extracted; } catch { structuredPathway = null; }
      }
      const ready = isPathwayReady(structuredPathway);
      let pathway = null;
      if (input.conversationId && ready) {
        await upsertPersonalisedPathwayDraft(ctx.user.id, input.conversationId, structuredPathway, message);
        pathway = await saveConversationPathway(ctx.user.id, input.conversationId);
      }
      return { message: input.completePathway && !ready ? "I need a little more context before I can complete a pathway. Tell me your goal, education, interests or skills, province, and main constraint, then choose Complete pathway again." : message, pathway, pathwayDraft: input.conversationId && ready ? structuredPathway : null, profileUpdates: parsed?.profile_updates || {}, saveIntent: false, pathwayReady: ready && Boolean(input.conversationId) };
    }),
  }),
  drafts: router({
    generate: protectedProcedure.input(z.object({ opportunity: z.string(), profile: z.string(), draftType: z.enum(["study", "work"]) })).mutation(async ({ input }) => {
      const response = await invokeLLM({ messages: [{ role: "system", content: "You are PathFinder's application assistant. Produce a complete, editable starting draft. Use only the profile and opportunity context provided. Do not invent marks, qualifications, work history, or claims. Use placeholders like [add your subject] when information is missing. Include a short note that the user must personalise and verify the official requirements." }, { role: "user", content: `Draft type: ${input.draftType}\nOpportunity: ${input.opportunity}\nProfile: ${input.profile}` }] });
      const content = response.choices?.[0]?.message?.content; return { draft: typeof content === "string" ? content : "Start by adding your education, skills, and why this opportunity interests you." };
    }),
  }),
});
export type AppRouter = typeof appRouter;
