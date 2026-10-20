import StageCanvas from "./StageCanvas";

/** Wraps the hero + story: one sticky WebGL canvas sits behind scrolling content. */
export default function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div className="stage">
      <StageCanvas />
      <div className="stage__content">{children}</div>
    </div>
  );
}
