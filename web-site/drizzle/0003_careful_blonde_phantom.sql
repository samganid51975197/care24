CREATE TABLE `document_bundles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`caregiver_name` text NOT NULL,
	`caregiver_phone` text NOT NULL,
	`document_statuses` text NOT NULL,
	`attachments` text DEFAULT '[]' NOT NULL,
	`evaluation` text NOT NULL,
	`decision` text NOT NULL,
	`reviewer` text NOT NULL,
	`reviewed_at` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'saved' NOT NULL,
	`sent_targets` text DEFAULT '' NOT NULL,
	`confirmed_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
