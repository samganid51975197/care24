ALTER TABLE `submissions` ADD `contract_type` text DEFAULT '개인간병' NOT NULL;--> statement-breakpoint
ALTER TABLE `submissions` ADD `common_full_time_fee` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `submissions` ADD `common_two_shift_fee` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `submissions` ADD `common_three_shift_fee` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `submissions` ADD `personal_fee` text DEFAULT '' NOT NULL;