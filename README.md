PathFinder AI

Find Your Next Step.

PathFinder AI is a conversational guidance platform that helps young people — especially South African youth — turn "I'm not sure what's next" into one concrete, personalised next step. It combines an AI-guided conversation, real and current opportunity data, and a personal tracker, so guidance doesn't stop at advice — it follows through to a real outcome.

Guidance, not a guarantee. Always verify requirements with the official source.

Live demo: [add deployed app link here]

Table of Contents
The Problem
The Solution
Key Features
Tech Stack
Architecture
Getting Started
Environment Variables
Database Schema
Responsible AI & Limitations
Roadmap
Team
Acknowledgements
License
The Problem

Career guidance today is usually one of two things: generic, one-size-fits-all advice that ignores a person's actual circumstances, or proper guidance locked behind expensive counselling most people can't access. Two people with the exact same interest but very different constraints — money, access, location — often get identical, unhelpful advice.

The Solution

PathFinder leads with a real conversation, one question at a time, and quietly builds a profile of the user's goals, interests, education, and constraints. It never recommends anything it can't back up — every suggested opportunity links back to a real, verifiable source. It supports five ways forward:

🎓 Study — university, TVET, courses & bursaries
💼 Work — jobs, internships & learnerships
🛠 Learn Skills — practical skills that get you hired
🚀 Start a Business — hustles, side income & funding
🧭 Not Sure Yet — explored together, never forced into a box
Key Features
AI-guided conversation — one question at a time, branches by goal, remembers what's already been answered
Prompt library & chat history — quick-start prompts by category, plus the ability to start a new chat or resume a past one
Live opportunity search — real-time search via the SerpApi search API, merged with a curated internal list, every result carrying a real source link
Save opportunities for later — bookmark any result (curated or live) for quick access afterward
Personalised "Your Pathway" results — goal, reasoning, a transparent match score, next steps, and alternatives
Interactive pathway checklists — each saved pathway's next steps become tickable, trackable tasks with a progress bar, and users can add their own steps
Application tracker — log real applications with status (Applied / Interview / Waiting / Accepted / etc.), deadlines, and notes
Deadline calendar — a synced monthly calendar view with in-app reminders for upcoming deadlines
AI application drafts — generates a full, editable CV or cover letter draft per opportunity, with copy, PDF export, and email export
Responsible AI guardrails — transparent scoring, no fabricated institutions or figures, privacy-conscious data collection, and a clear "verify with the official source" disclaimer throughout
Tech Stack
Layer	Technology
Frontend	React, TypeScript, Tailwind CSS, shadcn/ui
Backend	Managed Postgres + Auth + Edge Functions (Supabase-style)
AI / Conversation	LLM API (conversation engine + application draft generation)
Live Search	SerpApi
Deployment	Built with Manus
Architecture

PathFinder is organised into four layers, wrapped in a set of responsible AI guardrails that apply across all of them:

Conversation — the LLM-driven chat, branching by goal
Recommend — a transparent, rules-based scoring layer that ranks opportunities against the user's profile
Automation — saving, deadline tracking, and reminder logic
Data & Deploy — the database and hosting layer

All AI provider keys and search API keys are kept server-side only (Edge Functions / backend routes) and are never exposed to the browser.

Getting Started
bash
# Clone the repository
git clone <repo-url>
cd pathfinder-ai

# Install dependencies
npm install

# Copy the example environment file and fill in your own keys
cp .env.example .env

# Run the development server
npm run dev
Environment Variables

Create a .env file with the following (never commit this file):

Variable	Description
VITE_SUPABASE_URL	Your backend project URL
VITE_SUPABASE_ANON_KEY	Public anon key (safe for frontend use, restricted by row-level security)
AI_PROVIDER_API_KEY	LLM API key — server-side only
SERPAPI_API_KEY	SerpApi key for live opportunity search — server-side only

Never expose AI_PROVIDER_API_KEY or SERPAPI_API_KEY in frontend code. Both should only be called from a backend/Edge Function.

Database Schema
Table	Purpose
Users	Account info: name, email, country, province
Conversations / Messages	Chat history per user
UserProfiles	Goal, education, interests, skills, experience, constraints, location, resources
Pathways	AI-generated results: goal, reasoning, next steps, alternatives
PathwayChecklistItems	Tickable steps per pathway, including user-added custom steps
Opportunities	Curated real opportunities, each with a source URL and last-updated timestamp
SavedOpportunities	User-bookmarked opportunities (curated or live-searched)
Applications	User-tracked real-world applications: status, deadline, notes, linked pathway/opportunity
PromptLibrary	Admin-editable starter prompts shown in the chat
Responsible AI & Limitations
Recommendations are only ever drawn from real, sourced opportunities — the AI does not invent institutions, qualifications, or figures
The match score is a transparent, rules-based calculation, not a trained machine learning model — this is stated plainly rather than overclaimed
PathFinder does not state exact APS scores, NBT results, or cut-offs as fact; it uses directional language and always points to the official source
This is a guidance tool, not a substitute for professional counselling or an official admissions/HR decision
Live search depends on a metered third-party API (SerpApi); production use at scale would need caching and a paid tier
Roadmap
Push/email notifications for deadlines (current version is in-app only)
A genuinely trained recommender model, once enough real outcome data exists
WhatsApp integration
Multi-language support
Expansion beyond South Africa
Team

Built by Team ImpactDevs as part of the CAPACITI Demand Academy AI Bootcamp:

Acknowledgements

Built as part of the CAPACITI Demand Academy — 1 Month AI Bootcamp, and developed using Manus.
