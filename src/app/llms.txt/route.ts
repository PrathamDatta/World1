import { pageList, pages } from "@/data/pages";
import { company } from "@/data/site";
import { abs } from "@/lib/site";

export const dynamic = "force-static";

// Plain-text summary for AI assistants and crawlers (the emerging llms.txt convention). Generated from the same registry as the page metadata and structured data so the facts cannot drift.
export function GET() {
  const lines = [
    `# ${company.name}`,
    "",
    `> ${pages.home.description}`,
    "",
    "## Company",
    `- Name: ${company.name} (${company.shortName})`,
    `- Location: ${company.location}, India`,
    `- Email: ${company.email}`,
    `- Phone / WhatsApp: ${company.phone}`,
    "",
    "## Pages",
    ...pageList.map((p) => `- [${p.name}](${abs(p.path)}): ${p.blurb}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
