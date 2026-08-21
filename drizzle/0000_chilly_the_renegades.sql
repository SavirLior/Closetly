CREATE TABLE `outfit_feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`outfit_id` text NOT NULL,
	`type` text NOT NULL,
	`reason` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `saved_outfits` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`outfit_id` text NOT NULL,
	`title` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `wardrobe_items` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`image_key` text,
	`metadata_json` text NOT NULL,
	`favorite` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
