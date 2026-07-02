import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { Icon } from "./Icon";
import { VerifiedBadge } from "./VerifiedBadge";
import { useSelectedProfilesStore } from "@/store/useSelectedProfilesStore";
import { formatCompactEngagementRate, formatNumber } from "@/utils/formatters";
import { getProfileRoute, getPlatformLabel } from "@/utils/dataHelpers";

export type ProfileCardProfile = UserProfileSummary & { platform: Platform };

interface ProfileCardProps {
  profile: ProfileCardProfile;
  searchQuery: string;
  index?: number;
}

export function ProfileCard({ profile, searchQuery, index = 0 }: ProfileCardProps) {
  const navigate = useNavigate();
  const { addProfile, removeProfile, isProfileSelected } =
    useSelectedProfilesStore();
  const profileRoute = getProfileRoute(profile, profile.platform);

  const handleClick = () => {
    navigate(profileRoute);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  const handleAddRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (isProfileSelected(profile.user_id)) {
      removeProfile(profile.user_id);
    } else {
      addProfile(profile, profile.platform);
    }
  };

  const isSelected = isProfileSelected(profile.user_id);

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`View profile for ${profile.fullname}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`motion-rise group flex cursor-pointer flex-col gap-5 rounded-[1.75rem] border p-5 text-left transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/10 ${
        isSelected
          ? "border-blue-300 bg-blue-50/80 shadow-blue-100"
          : "border-slate-200/80 bg-white/95"
      }`}
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
      data-search={searchQuery}
    >
      <div className="flex items-start gap-4">
        <img
          src={profile.picture}
          alt={profile.fullname}
          className="h-24 w-24 shrink-0 rounded-[1.35rem] border border-white object-cover shadow-md ring-1 ring-slate-900/5"
        />
        <div className="min-w-0 flex-1 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <div className="truncate text-lg font-semibold text-slate-950">
              @{profile.username}
            </div>
            <VerifiedBadge verified={profile.is_verified} />
          </div>
          <div className="mt-1 truncate text-sm text-slate-600">
            {profile.fullname}
          </div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700">
            {getPlatformLabel(profile.platform)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-[1.2rem] bg-slate-50 p-3 text-left">
        <Metric label="Followers" value={formatNumber(profile.followers)} />
        <Metric
          label="Engagement"
          value={formatCompactEngagementRate(profile.engagement_rate)}
        />
      </div>

      <button
        type="button"
        onClick={handleAddRemove}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-all duration-200 ${
          isSelected
            ? "bg-slate-950 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800"
            : "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
        }`}
      >
        <Icon name={isSelected ? "check" : "bookmark"} className="h-4 w-4" />
        {isSelected ? "Added to shortlist" : "Add to shortlist"}
      </button>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white px-3 py-2">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-slate-950">{value}</div>
    </div>
  );
}
