import Link from "next/link";
import { company } from "@/data/site";
import Split from "./Split";

export default function CtaBand({
  title = "Let’s build on *solid* ground",
  text = "Tell us what you need and we will recommend the right service, from a single mailbox to a full hosting and support set-up.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <span className="cta-band__bg" aria-hidden="true" data-parallax>TALK</span>
      <div className="wrap cta-band__inner">
        <div>
          <p className="eyebrow">Start a conversation</p>
          <Split as="h2" text={title} className="cta-title" id="cta-title" />
          <p>{text}</p>
        </div>
        <div className="btn-row">
          <Link href="/contact" className="btn btn--dark" data-cursor="Go">Contact us</Link>
          <a href={company.phoneHref} className="btn btn--ghost-dark">Call {company.phone}</a>
        </div>
      </div>
    </section>
  );
}
