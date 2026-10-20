/** Prefixes static asset paths with the deployment base path (needed for GitHub Pages project sites). */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
