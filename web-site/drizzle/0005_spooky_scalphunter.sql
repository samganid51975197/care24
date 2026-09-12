CREATE TABLE `privacy_consents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`birth_date` text NOT NULL,
	`address` text NOT NULL,
	`retention_period` text NOT NULL,
	`use_consent` text NOT NULL,
	`share_consent` text NOT NULL,
	`signature_name` text NOT NULL,
	`signed_at` text NOT NULL,
	`status` text DEFAULT 'saved' NOT NULL,
	`sent_targets` text DEFAULT '' NOT NULL,
	`confirmed_at` text,
	`completed_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
