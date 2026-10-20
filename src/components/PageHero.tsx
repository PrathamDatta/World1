import Link from "next/link";

export default function PageHero({ title, intro }: { title: string; intro: string }) {
  return (
    <section className="page-hero">
      <div className="wrap">
        <p className="crumbs enter" style={{ ["--i" as string]: 0 }}>
          <Link href="/">Home</Link> / {title}
        </p>
        <h1 className="enter" style={{ ["--i" as string]: 1 }}>{title}</h1>
        <p className="enter" style={{ ["--i" as string]: 2 }}>{intro}</p>
      </div>
    </section>
  );
}
