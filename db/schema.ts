import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const wardrobeItems = sqliteTable("wardrobe_items", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  imageKey: text("image_key"),
  metadataJson: text("metadata_json").notNull(),
  favorite: integer("favorite", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const savedOutfits = sqliteTable("saved_outfits", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  outfitId: text("outfit_id").notNull(),
  title: text("title").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const outfitFeedback = sqliteTable("outfit_feedback", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  outfitId: text("outfit_id").notNull(),
  type: text("type").notNull(),
  reason: text("reason"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
