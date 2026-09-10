import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, tinyint } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(), openId: varchar("openId", { length: 64 }).notNull().unique(), name: text("name"), email: varchar("email", { length: 320 }), loginMethod: varchar("loginMethod", { length: 64 }), role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(), createdAt: timestamp("createdAt").defaultNow().notNull(), updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(), lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(), userId: int("userId").notNull(), country: varchar("country", { length: 80 }).default("South Africa"), education: varchar("education", { length: 80 }), province: varchar("province", { length: 80 }), goal: varchar("goal", { length: 120 }), interests: text("interests"), skills: text("skills"), experience: text("experience"), location: varchar("location", { length: 120 }), constraints: text("constraints"), resources: text("resources"), createdAt: timestamp("createdAt").defaultNow().notNull(), updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(), userId: int("userId").notNull(), title: varchar("title", { length: 180 }), createdAt: timestamp("createdAt").defaultNow().notNull(), updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(), conversationId: int("conversationId").notNull(), sender: mysqlEnum("sender", ["user", "assistant"]).notNull(), message: text("message").notNull(), createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const pathways = mysqlTable("pathways", {
  id: int("id").autoincrement().primaryKey(), userId: int("userId").notNull(), conversationId: int("conversationId"), isSaved: tinyint("isSaved").default(0).notNull(), goal: text("goal"), currentSituation: text("currentSituation"), recommendedDirection: text("recommendedDirection"), reasons: text("reasons"), nextSteps: text("nextSteps"), alternativeOptions: text("alternativeOptions"), immediateAction: text("immediateAction"), matchScore: int("matchScore"), createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const pathwayChecklistItems = mysqlTable("pathwayChecklistItems", {
  id: int("id").autoincrement().primaryKey(), pathwayId: int("pathwayId").notNull(), text: text("text").notNull(), isComplete: int("isComplete").default(0).notNull(), isCustom: int("isCustom").default(0).notNull(), sortOrder: int("sortOrder").default(0).notNull(), createdAt: timestamp("createdAt").defaultNow().notNull(), updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const opportunities = mysqlTable("opportunities", {
  id: int("id").autoincrement().primaryKey(), category: mysqlEnum("category", ["Study", "Work", "Skills", "Business"]).notNull(), name: varchar("name", { length: 220 }).notNull(), organisation: varchar("organisation", { length: 180 }).notNull(), description: text("description").notNull(), keyRequirements: text("keyRequirements"), traits: text("traits"), province: varchar("province", { length: 80 }), deadlineDate: timestamp("deadlineDate"), sourceUrl: text("sourceUrl").notNull(), verificationStatus: mysqlEnum("verificationStatus", ["verified", "needs_review"]).default("needs_review").notNull(), sourceUpdatedAt: timestamp("sourceUpdatedAt").defaultNow().notNull(),
});

export const savedOpportunities = mysqlTable("savedOpportunities", {
  id: int("id").autoincrement().primaryKey(), userId: int("userId").notNull(), opportunityId: int("opportunityId"), snapshotData: text("snapshotData"), createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const plans = mysqlTable("plans", {
  id: int("id").autoincrement().primaryKey(), userId: int("userId").notNull(), title: varchar("title", { length: 180 }).notNull(), items: text("items").notNull(), progress: int("progress").default(0).notNull(), createdAt: timestamp("createdAt").defaultNow().notNull(), updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(), userId: int("userId").notNull(), title: varchar("title", { length: 220 }).notNull(), organisation: varchar("organisation", { length: 180 }).notNull(), type: mysqlEnum("type", ["Study", "Work", "Skills", "Business", "Other"]).notNull(), dateApplied: timestamp("dateApplied"), deadlineDate: timestamp("deadlineDate"), status: mysqlEnum("status", ["Not started", "Applied", "Interview", "Waiting", "Accepted", "Not this time", "Withdrawn"]).default("Not started").notNull(), notes: text("notes"), linkedPathwayId: int("linkedPathwayId"), linkedOpportunityId: int("linkedOpportunityId"), createdAt: timestamp("createdAt").defaultNow().notNull(), updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const promptLibrary = mysqlTable("promptLibrary", {
  id: int("id").autoincrement().primaryKey(), category: mysqlEnum("category", ["Study", "Work", "Skills", "Business", "Not Sure"]).notNull(), promptText: text("promptText").notNull(), displayOrder: int("displayOrder").default(0).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Opportunity = typeof opportunities.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type PathwayChecklistItem = typeof pathwayChecklistItems.$inferSelect;
