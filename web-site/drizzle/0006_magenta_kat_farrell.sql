ALTER TABLE `document_bundles` ADD `criminal_reviewer` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `document_bundles` ADD `criminal_reviewed_at` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `document_bundles` ADD `criminal_result` text DEFAULT '확인 대기' NOT NULL;