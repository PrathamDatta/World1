import Link from "next/link";
import { company } from "@/data/site";

export default function CtaBand({
  title = "Talk to our team",
  text = "Tell us what you need and we will recommend the right service, from a single mailbox to a full hosting and support set-up.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="wrap cta-band__inner">
        <div>
          <h2 id="cta-title">{title}</h2>
          <p>{text}</p>
        </div>
        <div className="btn-row">
          <Link href="/contact" className="btn btn--primary">Contact us</Link>
          <a href={company.phoneHref} className="btn btn--light">Call {company.phone}</a>
        </div>
      </div>
    </section>
  );
}
