import Image from "next/image";
import { partners, type PartnerKey } from "@/data/partners";

export default function PartnerLogo({ name }: { name: PartnerKey }) {
  const p = partners[name];
  return (
    <div className="logo-tile">
      <Image src={p.src} alt={p.alt} width={p.width} height={p.height} />
    </div>
  );
}
