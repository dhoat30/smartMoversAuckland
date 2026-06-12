/**
 * Renders a JSON-LD <script> tag for structured data.
 * Server component — safe to drop anywhere in the page tree.
 */
export default function JsonLd({ data }) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      // Schema is built from trusted CMS/site data, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
