import { pageGraph } from "@/lib/jsonld";
import type { PageKey } from "@/data/pages";
import JsonLd from "./JsonLd";

export default function PageSchema({ page }: { page: PageKey }) {
  return <JsonLd data={pageGraph(page)} />;
}
