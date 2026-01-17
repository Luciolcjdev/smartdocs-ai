// lib/db/schema.ts
import { relations } from "drizzle-orm";
import { boolean, integer, jsonb, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// ==================== AUTH TABLES ====================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  avatarImageUrl: text("avatar_image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  expiresAt: timestamp("expires_at"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==================== APP TABLES ====================

export const planEnum = pgEnum("plan", ["FREE", "PRO", "ENTERPRISE"]);
export const roleEnum = pgEnum("role", ["OWNER", "ADMIN", "MEMBER"]);

export const workspace = pgTable("workspace", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  plan: planEnum("plan").default("FREE").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripePriceId: text("stripe_price_id"),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workspaceMember = pgTable("workspace_member", {
  id: text("id").primaryKey(),
  role: roleEnum("role").default("MEMBER").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspace.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const document = pgTable("document", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  language: text("language"),
  fileName: text("file_name"),
  fileUrl: text("file_url"),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspace.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const embedding = pgTable("embedding", {
  id: text("id").primaryKey(),
  documentId: text("document_id")
    .notNull()
    .references(() => document.id, { onDelete: "cascade" }),
  vectorId: text("vector_id").notNull().unique(),
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chat = pgTable("chat", {
  id: text("id").primaryKey(),
  documentId: text("document_id")
    .notNull()
    .references(() => document.id, { onDelete: "cascade" }),
  messages: jsonb("messages").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const creditUsage = pgTable("credit_usage", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspace.id, { onDelete: "cascade" }),
  credits: integer("credits").notNull(),
  type: text("type").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==================== RELATIONS ====================

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
  workspaces: many(workspaceMember),
  credits: many(creditUsage),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const workspaceRelations = relations(workspace, ({ many }) => ({
  members: many(workspaceMember),
  documents: many(document),
  credits: many(creditUsage),
}));

export const workspaceMemberRelations = relations(workspaceMember, ({ one }) => ({
  user: one(user, {
    fields: [workspaceMember.userId],
    references: [user.id],
  }),
  workspace: one(workspace, {
    fields: [workspaceMember.workspaceId],
    references: [workspace.id],
  }),
}));

export const documentRelations = relations(document, ({ one, many }) => ({
  workspace: one(workspace, {
    fields: [document.workspaceId],
    references: [workspace.id],
  }),
  embeddings: many(embedding),
  chats: many(chat),
}));

export const embeddingRelations = relations(embedding, ({ one }) => ({
  document: one(document, {
    fields: [embedding.documentId],
    references: [document.id],
  }),
}));

export const chatRelations = relations(chat, ({ one }) => ({
  document: one(document, {
    fields: [chat.documentId],
    references: [document.id],
  }),
}));

export const creditUsageRelations = relations(creditUsage, ({ one }) => ({
  user: one(user, {
    fields: [creditUsage.userId],
    references: [user.id],
  }),
  workspace: one(workspace, {
    fields: [creditUsage.workspaceId],
    references: [workspace.id],
  }),
}));
