﻿import type { SVGProps } from "react";

export type IconName =
  | "arrowLeft"
  | "barChart"
  | "bookmark"
  | "check"
  | "download"
  | "filter"
  | "instagram"
  | "music"
  | "search"
  | "share"
  | "trash"
  | "users"
  | "youtube"
  | "tiktok";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

const iconPaths: Record<IconName, React.ReactNode> = {
  arrowLeft: <path d="M19 12H5m7-7-7 7 7 7" />,
  barChart: <path d="M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-8" />,
  bookmark: <path d="M6 4h12v16l-6-3-6 3V4Z" />,
  check: <path d="m5 12 4 4L19 6" />,
  download: <path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" />,
  filter: <path d="M4 6h16M7 12h10m-7 6h4" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".5" />
    </>
  ),
  music: <path d="M9 18V5l10-2v13M9 18a3 3 0 1 1-2-2.83M19 16a3 3 0 1 1-2-2.83" />,
  search: <path d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />,
  share: <path d="M18 8a3 3 0 1 0-2.83-4M6 13a3 3 0 1 0 0-2m9.17-5.17L8.83 9.17m0 5.66 6.34 3.34M18 22a3 3 0 1 0-2.83-4" />,
  trash: <path d="M4 7h16m-10 4v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />,
  users: <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
  youtube: (
    <>
      <path d="M2.5 17.6V6.4c0-1.5.8-2.3 2.3-2.7C6.6 3 12 3 12 3s5.4 0 7.2.7c1.5.4 2.3 1.2 2.3 2.7v11.2c0 1.5-.8 2.3-2.3 2.7-1.8.7-7.2.7-7.2.7s-5.4 0-7.2-.7c-1.5-.4-2.3-1.2-2.3-2.7Z" />
      <polygon points="10 15 15.5 12 10 9 10 15" fill="currentColor" />
    </>
  ),
  tiktok: (
    <>
      <path d="M19 8.3a4.3 4.3 0 0 1-2.2-3.4V2.5h-3v13a4 4 0 1 1-4-4c.4 0 .8 0 1.1.1V8.6a7 7 0 0 0-1.1-.1 7 7 0 1 0 7 7v-7Z" />
    </>
  ),
};

export function Icon({ name, className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {iconPaths[name]}
    </svg>
  );
}
