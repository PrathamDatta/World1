export const partners = {
  icewarp: { src: "/partners/icewarp.png", alt: "IceWarp", width: 124, height: 44 },
  ox: { src: "/partners/ox.png", alt: "OX Open-Xchange", width: 70, height: 36 },
  mdaemon: { src: "/partners/mdaemon.png", alt: "MDaemon", width: 124, height: 40 },
  comodo: { src: "/partners/comodo.png", alt: "Comodo SSL Certificate", width: 128, height: 48 },
  sitelock: { src: "/partners/sitelock.png", alt: "SiteLock", width: 126, height: 36 },
  codeguard: { src: "/partners/codeguard.png", alt: "CodeGuard", width: 132, height: 36 },
  saphana: { src: "/partners/saphana.png", alt: "SAP HANA", width: 158, height: 36 },
  resellerclub: { src: "/partners/resellerclub.png", alt: "ResellerClub", width: 198, height: 54 },
  impressly: { src: "/partners/impressly.png", alt: "Impress.ly", width: 202, height: 50 },
} as const;

export type PartnerKey = keyof typeof partners;
