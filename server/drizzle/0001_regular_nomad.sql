DROP INDEX IF EXISTS `products_sku_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `products_sku_org_unique` ON `products` (`sku`,`organization_id`);