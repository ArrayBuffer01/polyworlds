import { relations } from "drizzle-orm";
import { pgTable, serial, integer, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("user", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 25 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  gold: integer("gold").notNull().default(0),
  coins: integer("coins").notNull().default(0)
});

export const userRelations = relations(usersTable, ({ many }) => ({
  sessions: many(sessionTable),
  feeds: many(userFeedTable)
}));

export const sessionTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date"
  }).notNull()
});

export const userFeedTable = pgTable("user_feed", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const userFeedRelations = relations(userFeedTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [userFeedTable.userId],
    references: [usersTable.id]
  })
}));

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionTable.userId],
    references: [usersTable.id]
  })
}));
