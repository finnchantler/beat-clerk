ALTER TABLE "Release" ADD COLUMN "style_new" "Style"[];
UPDATE "Release" SET "style_new" = ARRAY["style"::"Style"];
ALTER TABLE "Release" DROP COLUMN "style";
ALTER TABLE "Release" RENAME COLUMN "style_new" TO "style";
ALTER TABLE "Release" ALTER COLUMN "style" SET NOT NULL;