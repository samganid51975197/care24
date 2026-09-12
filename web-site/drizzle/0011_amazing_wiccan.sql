ALTER TABLE `care_contracts` ADD `bank_name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_contracts` ADD `bank_account` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_contracts` ADD `bank_holder` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_contracts` ADD `social_insurance` text DEFAULT '미가입' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_contracts` ADD `retirement_pension` text DEFAULT '미가입' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_contracts` ADD `benefit_note` text DEFAULT '' NOT NULL;