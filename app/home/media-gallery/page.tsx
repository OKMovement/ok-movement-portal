import HomeFooterSection from "@/components/home/home-footer-section";
import HomeSiteHeader from "@/components/home/home-site-header";
import MediaGalleryPage from "@/components/home/media-gallery-page";

export default function MediaGalleryRoute() {
  return (
    <>
      <HomeSiteHeader />
      <MediaGalleryPage />
      <HomeFooterSection />
    </>
  );
}
