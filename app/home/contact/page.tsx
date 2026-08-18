import type { Metadata } from "next";
import ContactPage from "@/components/home/contact-page";
import JsonLd from "@/components/seo/json-ld";
import {
  ORGANIZATION_ID,
  absoluteUrl,
  breadcrumbSchema,
  buildPageMetadata,
  jsonLdGraph,
  siteConfig,
} from "@/lib/seo";

const path = "/home/contact";
const title = "Contact Us";
const description =
  "Get in touch with the OK Movement — questions, media enquiries, partnership requests and volunteer coordination. We read every message.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path,
  keywords: [
    "contact OK Movement",
    "OK Movement email",
    "OK Movement media enquiries",
    "OK Movement support",
  ],
});

export default function Page() {
  return (
    <>
      <ContactPage />
      <JsonLd
        data={jsonLdGraph(
          {
            "@type": "ContactPage",
            "@id": `${absoluteUrl(path)}#webpage`,
            url: absoluteUrl(path),
            name: title,
            description,
            inLanguage: "en-NG",
            about: { "@id": ORGANIZATION_ID },
            mainEntity: {
              "@type": "Organization",
              "@id": ORGANIZATION_ID,
              name: siteConfig.name,
              email: siteConfig.contactEmail,
            },
          },
          breadcrumbSchema([{ name: title, path }]),
        )}
      />
    </>
  );
}
