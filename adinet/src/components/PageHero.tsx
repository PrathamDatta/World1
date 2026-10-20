import Link from "next/link";

export default function PageHero({ title, intro }: { title: string; intro: string }) {
  return (
    <section className="page-hero">
      <div className="wrap">
        <p className="crumbs">
          <Link href="/">Home</Link> / {title}
        </p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
    </section>
  );
}
