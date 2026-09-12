ALTER TABLE `care_requests` ADD `patient_gender` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_requests` ADD `diagnosis` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_requests` ADD `patient_condition` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_requests` ADD `precautions` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_requests` ADD `special_notes` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_requests` ADD `public_consent` text DEFAULT '미동의' NOT NULL;