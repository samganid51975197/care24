ALTER TABLE `applications` ADD `caregiver_handwriting` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_contracts` ADD `caregiver_handwriting` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `privacy_consents` ADD `caregiver_handwriting` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `submissions` ADD `caregiver_handwriting` text DEFAULT '' NOT NULL;