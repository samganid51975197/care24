CREATE TABLE `care_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`requester_name` text NOT NULL,
	`requester_phone` text NOT NULL,
	`patient_name` text NOT NULL,
	`building` text NOT NULL,
	`ward` text NOT NULL,
	`room` text DEFAULT '' NOT NULL,
	`care_type` text NOT NULL,
	`start_date` text NOT NULL,
	`request_note` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'requesting' NOT NULL,
	`caregiver_id` integer,
	`caregiver_name` text DEFAULT '' NOT NULL,
	`caregiver_profile` text DEFAULT '' NOT NULL,
	`matched_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
