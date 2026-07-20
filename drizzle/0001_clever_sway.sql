CREATE TABLE "forum_post_replies" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"content" varchar(4000) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "forum_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"forum_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"content" varchar(4000) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "forum" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"description" varchar(400),
	"locked" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "medal" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"image_url" varchar(500),
	"created_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "owned_medal" (
	"user_id" integer NOT NULL,
	"medal_id" integer NOT NULL,
	CONSTRAINT "owned_medal_user_id_medal_id_pk" PRIMARY KEY("user_id","medal_id")
);
--> statement-breakpoint
CREATE TABLE "user_feed" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(25) NOT NULL,
	"email" varchar(255),
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"gold" integer DEFAULT 0 NOT NULL,
	"coins" integer DEFAULT 0 NOT NULL,
	"last_reward" timestamp,
	"bio" varchar(2000),
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DROP TABLE "users" CASCADE;