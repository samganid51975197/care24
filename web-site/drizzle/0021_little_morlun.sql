CREATE TABLE `board_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`board_type` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`author` text DEFAULT '관리자' NOT NULL,
	`attachments` text DEFAULT '[]' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
