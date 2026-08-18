type JsonLdProps = {
  /** A schema.org document, normally produced by `jsonLdGraph(...)`. */
  data: Record<string, unknown>;
};

/**
 * Renders structured data as a JSON-LD script tag.
 * `<` is escaped so a stray value can never close the script element early.
 */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
