CREATE TABLE `applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`applicant_name` text NOT NULL,
	`applicant_phone` text NOT NULL,
	`applicant_birth` text NOT NULL,
	`applicant_gender` text NOT NULL,
	`career_years` text NOT NULL,
	`qualification` text DEFAULT '' NOT NULL,
	`preferred_date` text NOT NULL,
	`application_note` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'saved' NOT NULL,
	`sent_targets` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
