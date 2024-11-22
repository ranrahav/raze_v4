-- Add country support to providers
ALTER TABLE providers
ADD COLUMN countries TEXT[] DEFAULT '{}' NOT NULL;