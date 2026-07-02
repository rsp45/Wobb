﻿import type { Platform } from "@/types";
import { Icon, type IconName } from "./Icon";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";

export type PlatformSelection = Platform | "all";

interface PlatformFilterProps {
  selected: PlatformSelection;
  onChange: (platform: PlatformSelection) => void;
}

const platformIcons: Record<PlatformSelection, IconName> = {
  all: "users",
  instagram: "instagram",
  youtube: "youtube",
  tiktok: "tiktok",
};

export function PlatformFilter({ selected, onChange }: PlatformFilterProps) {
  const options: PlatformSelection[] = ["all", ...PLATFORMS];

  return (
    <div className="flex flex-wrap items-center gap-3" aria-label="Platform filter">
      {options.map((platform) => (
        <button
          key={platform}
          type="button"
          onClick={() => onChange(platform)}
          aria-pressed={selected === platform}
          className={`flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-all duration-200 ${
            selected === platform
              ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200"
              : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
          }`}
        >
          <Icon name={platformIcons[platform]} className="h-4 w-4" />
          {platform === "all" ? "All" : getPlatformLabel(platform)}
        </button>
      ))}
    </div>
  );
}
