import Image from "next/image";
import { asset } from "@/data/assets";
import { partners, type PartnerKey } from "@/data/partners";

export default function PartnerLogo({ name }: { name: PartnerKey }) {
  const p = partners[name];
  return (
    <div className="logo-tile">
      <Image src={asset(p.src)} alt={p.alt} width={p.width} height={p.height} />
    </div>
  );
}
