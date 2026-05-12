import { SEOContent } from "@/app/seo/SEOContent";
import { IDE } from "@/app/ide/IDE";
import { MobileFallback } from "@/components/ide/MobileFallback";

export default function HomePage() {
  return (
    <>
      <SEOContent />
      <IDE />
      <MobileFallback />
    </>
  );
}
