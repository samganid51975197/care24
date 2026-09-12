ALTER TABLE `submissions` ADD `applicant_name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `submissions` ADD `applicant_phone` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `submissions` ADD `applicant_birth` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `submissions` ADD `applicant_gender` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `submissions` ADD `career_years` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `submissions` ADD `qualification` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `submissions` ADD `preferred_date` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `submissions` ADD `application_note` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `submissions` ADD `status` text DEFAULT 'saved' NOT NULL;--> statement-breakpoint
ALTER TABLE `submissions` ADD `sent_targets` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `submissions` ADD `completed_at` text;