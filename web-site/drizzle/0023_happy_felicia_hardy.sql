ALTER TABLE `applications` ADD `provider_care_type` text DEFAULT '개인간병' NOT NULL;--> statement-breakpoint
ALTER TABLE `applications` ADD `provider_schedule` text DEFAULT '전일제(24시간)' NOT NULL;--> statement-breakpoint
ALTER TABLE `applications` ADD `provider_available_hours` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `applications` ADD `provider_rest_terms` text DEFAULT '상호 협의' NOT NULL;--> statement-breakpoint
ALTER TABLE `applications` ADD `provider_fee` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `applications` ADD `provider_fee_period` text DEFAULT '1일' NOT NULL;--> statement-breakpoint
ALTER TABLE `applications` ADD `provider_service_scope` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `applications` ADD `provider_contract_note` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `applications` ADD `provider_contract_consent` text DEFAULT '미동의' NOT NULL;--> statement-breakpoint
ALTER TABLE `applications` ADD `provider_contract_version` text DEFAULT '간병24 제공계약서 v1.0' NOT NULL;--> statement-breakpoint
ALTER TABLE `applications` ADD `provider_contract_signed_at` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_requests` ADD `service_schedule` text DEFAULT '전일제(24시간)' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_requests` ADD `service_start_time` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_requests` ADD `service_end_time` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_requests` ADD `rest_time` text DEFAULT '상호 협의' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_requests` ADD `holiday_terms` text DEFAULT '상호 협의' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_requests` ADD `care_fee` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_requests` ADD `fee_period` text DEFAULT '1일' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_requests` ADD `payment_method` text DEFAULT '계좌이체' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_requests` ADD `payment_due` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_requests` ADD `service_scope` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_requests` ADD `cancellation_terms` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_requests` ADD `contract_note` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_requests` ADD `requester_signature` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_requests` ADD `contract_consent` text DEFAULT '미동의' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_requests` ADD `contract_version` text DEFAULT '간병24 의뢰계약서 v1.0' NOT NULL;--> statement-breakpoint
ALTER TABLE `care_requests` ADD `contract_signed_at` text DEFAULT '' NOT NULL;