import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  integer,
  text,
  varchar,
  timestamp,
  primaryKey
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("user", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 25 }).notNull().unique(),
  email: varchar("email", { length: 255 }).unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  gold: integer("gold").notNull().default(0),
  coins: integer("coins").notNull().default(0),
  lastReward: timestamp("last_reward"),
  bio: varchar("bio", { length: 2000 })
});

export const userRelations = relations(usersTable, ({ many }) => ({
  sessions: many(sessionTable),
  feeds: many(userFeedTable),
  createdMedals: many(medalsTable),
  ownedMedals: many(ownedMedalsTable)
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

export const medalsTable = pgTable("medal", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
  imageURL: varchar("image_url", { length: 500 }),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const ownedMedalsTable = pgTable(
  "owned_medal",
  {
    userId: integer("user_id").notNull(),
    medalId: integer("medal_id").notNull()
  },
  (table) => [primaryKey({ columns: [table.userId, table.medalId] })]
);

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

export const medalsRelations = relations(medalsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [medalsTable.createdBy],
    references: [usersTable.id]
  })
}));

export const ownedMedalsRelations = relations(ownedMedalsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [ownedMedalsTable.userId],
    references: [usersTable.id]
  }),
  medal: one(medalsTable, {
    fields: [ownedMedalsTable.medalId],
    references: [medalsTable.id]
  })
}));
