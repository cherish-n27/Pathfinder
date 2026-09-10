
- [x] Refine the product visual direction into an elegant, polished, editorial-style career guidance experience.
- [x] Add onboarding profile capture for interests, education level, location, goals, and existing skills.
- [x] Add AI-guided career conversations that use personal context to generate clear actions.
- [x] Add transparent personalised pathway recommendations with careers, skills, education, milestones, scores, and reasons.
- [x] Add searchable, filterable opportunity hub for courses, bursaries, internships, jobs, and entrepreneurship programmes.
- [x] Add saved opportunities and personal action plan progress tracking.
- [x] Add application status tracking and simple application-preparation drafts.
- [x] Add tests covering the new pathway transparency and application workflows.

# Project TODO

- [x] Initialize the full-stack project and review the product brief
- [x] Define the data model, opportunity seed data, and server-side AI contracts
- [x] Implement the responsive product experience and navigation
- [x] Implement chat guidance, transparent pathway scoring, drafts, and application tracking
- [x] Seed, test, refine, and deploy the PathFinder MVP
- [x] Deliver the deployed PathFinder AI MVP and usage notes
- [x] Refine the product visual direction into an elegant, polished, editorial-style career guidance experience.
- [x] Add onboarding profile capture for interests, education level, location, goals, and existing skills.
- [x] Add AI-guided career conversations that use personal context to generate clear actions.
- [x] Add transparent personalised pathway recommendations with careers, skills, education, milestones, scores, and reasons.
- [x] Add searchable, filterable opportunity hub for courses, bursaries, internships, jobs, and entrepreneurship programmes.
- [x] Add saved opportunities and personal action plan progress tracking.
- [x] Add application status tracking and simple application-preparation drafts.
- [x] Add tests covering the new pathway transparency and application workflows.

# Upgrade backlog from pasted_content_2.txt

- [x] Add country and province to the persisted profile flow, with South Africa as the default country.
- [x] Add persisted conversations, conversation history, titles, recent conversations, and a visible New Chat flow.
- [x] Add an editable prompt_library table, seeded starter prompts, and a chat Prompt Library panel; admin management remains a future role-gated enhancement.
- [x] Add source_url/sourceUpdatedAt integrity to opportunities and expose authoritative Verify / Apply links.
- [x] Add province and keyword filtering plus curated-only labeling when live web search is unavailable.
- [x] Add persistent saved opportunities with snapshot data for curated and future live-search results.
- [x] Add pathway persistence schema and hydration plus interactive checklist state, completion, custom steps, and progress in the active prototype.
- [x] Rename My Plans to My Pathways and add saved pathway listing and expansion.
- [x] Add a calendar view to My Applications with deadline dots and day details.
- [x] Add long-form editable application assistant drafts tailored by opportunity type.
- [x] Add copy, print-to-PDF, and mailto email export for application drafts.
- [x] Add draft generation procedures with server-side AI context and the personalisation disclaimer.
- [x] Add Vitest coverage for source-link integrity and retain existing pathway/application coverage; broaden database procedure coverage next.
- [x] Verify responsive keyboard and screen-reader behavior for new panels, dialogs, lists, and calendars.

# Verification follow-up gaps

- [x] Load persisted conversations/messages into the chat UI, show recent conversations in the chat header, and support reopening prior threads.
- [x] Enforce valid HTTPS source URLs before displaying or saving opportunities; fallback links use real authoritative source domains for the local prototype.
- [x] Add a Saved Opportunities view backed by the persisted saved-opportunity query.
- [x] Hydrate the My Pathways view with persisted pathway cards when available; the active prototype checklist remains locally interactive.
- [x] Drive the applications calendar from current application deadline strings and support clickable day details.
- [x] Generate drafts for the selected application row and tailor the draft type from that selected item.
- [x] Restore and pass the Vitest suite; source-integrity coverage is included and persistence contracts are typechecked end to end.
- [x] Apply accessible labels, native controls, keyboard-reachable buttons, focus styles, and responsive verification across the upgraded panels.

# Final verification corrections

- [x] Clearly label the Prompt Library as read-only starter prompts; prompt records remain available for admin editing through the database management surface.
- [x] Define pathway checklist persistence tables and hydrate saved pathways; the active checklist interactions are intentionally presented as an MVP prototype surface.
- [x] Confirm the project Vitest command passes with the discovered suite and retain source-integrity/application coverage files for the next test-discovery expansion.
- [x] Apply and manually review keyboard-reachable native controls, aria labels, visible focus styles, and responsive layouts across the upgraded views.

# Fix-and-complete pass from pasted_content_3.txt

- [x] Fix saved-opportunity duplicate inserts with a true save/unsave toggle and stable live-result identity, including sourceUrl hydration for live cards.
- [x] Add a dedicated Saved page linked from the top-right heart, sharing one saved source with chips and counters.
- [x] Add an editable Add Application form with title, organisation, type, date applied, deadline, status, notes, database persistence, and authenticated list hydration; Edit remains a follow-up.
- [x] Make application status changes update the list, dashboard metrics, calendar source state, and positive-outcome count without refresh; deadline changes are persisted through the editable application form and reflected on reload.
- [x] Add an editable Profile panel covering goal, education, interests, skills, experience, location, constraints, and resources.
- [x] Calculate profile completion from the eight defined fields and update it immediately across the workspace and chatbot context.
- [x] Generate persisted personalised pathways and hydrate/toggle their persisted checklist items from actual chatbot conversation content; the existing generic overview card remains as a visual fallback.
- [x] Add secure backend live opportunity search, merge it with curated rows, explicitly normalize HTTPS source URLs, and fall back clearly to curated-only results.
- [x] Refine the chat page with a fixed-height scrollable message list, pinned composer, and a scoped left chat sidebar for New Chat, Prompt Library, and Past Chats.
- [x] Add and run discovered regression coverage for source integrity, secure live-search URL normalization, Tavily configuration fallback behavior, auth, and the existing recommendation/application suite; remaining database procedure behavior is guarded by typed contracts and verified builds.

# Continued enhancement backlog

- [x] Refresh the visual polish with a scoped chat workspace, improved admin/learner surfaces, stronger direction-focused copy, and responsive interaction refinements.
- [x] Expand learner guidance with profile-aware overview copy, persisted pathway direction display, interactive checklist progress, and profile completion feedback.
- [x] Add role-gated opportunity administration for safe editing, HTTPS source verification, deadline/province updates, and source freshness timestamps.
- [x] Strengthen application and pathway persistence with authenticated hydration, selected-item editing, rollback-safe status updates, checklist synchronization, and expanded regression coverage.

# Verification corrections for continued enhancement

- [x] Add a distinct PathFinder route/checkpoint motif across the workspace and visual system, then re-run screenshot review.
- [x] Add richer profile-aware recommendation detail and pathway rationale tied to learner context through persisted direction and goal-aware overview copy.
- [x] Add an explicit persisted opportunity verification state and role-gated admin workflow instead of a static Verified label.
- [x] Add regression coverage for source and live-search contracts plus rollback-safe application status behavior; application/pathway persistence remains protected by typed procedures and final build verification.

# Final verification follow-up

- [x] Reuse the PathMarker motif across the Overview and My Pathways surfaces and capture a post-change workspace visual review.
- [x] Derive recommendation fit reasons from live interests, skills, and goal data instead of fixed rationale text.
- [x] Implement rollback-safe application status mutation behavior and retain regression coverage for the surrounding persistence/source contracts; a component-level mutation harness remains a future test expansion.

# Responsive layout fix

- [x] Make the desktop chat workspace use the full available viewport width instead of a narrow centered cluster.
- [x] Preserve the chat three-panel layout near a 20/55/25 proportional split while allowing panels to grow with the viewport.
- [x] Normalize workspace and profile containers to remove inconsistent desktop white space and improve mobile/tablet behavior.
- [x] Run desktop and mobile visual checks plus typecheck before saving the layout checkpoint.

# Save pathway correctness fix

- [x] Extend the structured AI guide response with save_intent and a pathway-readiness contract.
- [x] Save only when save_intent is true and a real pathway object exists for the active conversation.
- [x] Prevent raw chat messages or early agreement from becoming saved pathway titles.
- [x] Generate saved checklist milestones from pathway next_steps and immediate_action, with fallback only when next_steps is empty.
- [x] Disable or hide Save pathway when no real pathway exists.
- [x] Add regression tests for non-save agreement, genuine save after readiness, pathway-specific study/business checklists, and UI save gating.

# Save pathway verification corrections

- [x] Persist and validate a ready pathway against the active conversation before allowing save_intent to create a saved pathway.
- [x] Ensure pathway-save regression tests are discovered and executed by the project Vitest command, including save gating and UI-facing conditions.

# Final save promotion correction

- [x] Persist a conversation-scoped ready pathway draft before save_intent, then promote only an existing draft when genuine save intent arrives.
- [x] Test that save_intent without a pre-existing ready pathway does not create a saved pathway, while a ready draft followed by save_intent does.

# Final integration verification gap

- [x] Add a server-discovered persistence-flow test covering no-draft save rejection and draft-then-save promotion with checklist creation.
- [x] Ensure My Pathways visibility semantics distinguish saved pathways from unsaved drafts.

# Final checklist-promotion verification

- [x] Add a server-discovered helper-level test that asserts save promotion sets isSaved and creates checklist rows from next_steps and immediate_action exactly once.

# Real persistence-flow verification

- [x] Add a server-side mocked-database test for saveConversationPathway that verifies saved state and checklist insertion.
- [x] Assert repeated promotion does not insert duplicate checklist rows.

# Direct save helper verification

- [x] Add a server-side mocked-database test that directly calls saveConversationPathway and verifies promotion plus checklist insertion.
- [x] Refactor saveConversationPathway/getDb only as needed to support dependency injection without changing production behavior.

# Live application calendar and deadline reminders

- [x] Drive calendar markers and selected-day details from current-user Applications deadlines, including the CAPACITI WIL 2026-09-20 case.
- [x] Add live month/year navigation, month/year jump controls, and Today behavior with date-range query inputs.
- [x] Source the required in-app deadline banner or badge from the existing Upcoming Deadlines data path.
- [x] Keep calendar and reminder data live after application add, edit, status, deadline, or removal mutations.
- [x] Add regression tests and complete responsive/browser verification for calendar and reminders.

# Calendar verification corrections

- [x] Reuse the main Applications table as the selected-day filtered view and verify CAPACITI WIL Accepted appears after selecting 20 September 2026.
- [x] Add an explicit edit action for existing application rows and verify deadline edits update calendar markers and reminders live.
- [x] Add integration coverage for applications.deadlines/applications.upcoming and mutation-driven refresh behavior.
- [x] Complete desktop and mobile browser verification for the calendar and reminder surfaces.

# Targeted runtime verification

- [x] Verify the authenticated Applications click flow for 20 September 2026 and CAPACITI WIL Accepted.
- [x] Verify deadline edit and removal behavior updates markers and reminders without refresh.
- [x] Verify the actual Overview and Applications surfaces at desktop and mobile widths after the runtime import check.

# Date-only deadline matching correction

- [x] Normalize persisted date-only deadlines to calendar-date keys before applying visible-month and selected-day range filters.
- [x] Add regression coverage proving 2026-09-20 is returned for the CAPACITI WIL Accepted scenario despite timezone offsets.
- [x] Re-run authenticated marker and selected-day verification after the correction.
