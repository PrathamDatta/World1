import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap">
        <h1>Page not found</h1>
        <p className="lede">The page you are looking for does not exist.</p>
        <Link href="/" className="btn btn--primary">Back to home</Link>
      </div>
    </section>
  );
}
