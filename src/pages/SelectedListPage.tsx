import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@/components/Icon";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { useSelectedProfilesStore } from "@/store/useSelectedProfilesStore";
import { getProfileRoute, getPlatformLabel } from "@/utils/dataHelpers";
import { formatCompactEngagementRate, formatNumber } from "@/utils/formatters";
import type { SelectedProfile } from "@/types";

export function SelectedListPage() {
  const { selectedProfiles, removeProfile, clearList } =
    useSelectedProfilesStore();
  const navigate = useNavigate();
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleRemove = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    removeProfile(userId);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all selected profiles?")) {
      clearList();
      setActionMessage("Shortlist cleared.");
    }
  };

  const handleExport = () => {
    const csv = buildShortlistCsv(selectedProfiles);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "wobb-shortlist.csv";
    link.click();
    URL.revokeObjectURL(url);
    setActionMessage("Shortlist exported as CSV.");
  };

  const handleShare = async () => {
    const shareText = buildShareText(selectedProfiles);

    try {
      if (navigator.share) {
        await navigator.share({ title: "Wobb shortlist", text: shareText });
        setActionMessage("Shortlist shared.");
        return;
      }

      await navigator.clipboard.writeText(shareText);
      setActionMessage("Shortlist copied to clipboard.");
    } catch {
      setActionMessage("Sharing was not completed.");
    }
  };

  const openProfile = (profile: SelectedProfile) => {
    navigate(getProfileRoute(profile, profile.platform));
  };

  return (
    <Layout
      title="Shortlist management"
      subtitle="Review selected creators, remove profiles you no longer need, and keep the list ready for client handoff."
    >
      <div
        className="motion-rise mb-6 flex flex-wrap items-center justify-between gap-3"
        style={{ animationDelay: "var(--motion-selected-back-delay)" }}
      >
        <Link
          to="/discover"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        >
          <Icon name="arrowLeft" className="h-4 w-4" />
          Back to search
        </Link>

        {selectedProfiles.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <Icon name="download" className="h-4 w-4" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <Icon name="share" className="h-4 w-4" />
              Share shortlist
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              <Icon name="trash" className="h-4 w-4" />
              Clear all
            </button>
          </div>
        )}
      </div>

      {actionMessage && (
        <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
          {actionMessage}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Profiles saved" value={String(selectedProfiles.length)} delayMs={0} />
        <StatCard
          label="Platforms covered"
          value={String(new Set(selectedProfiles.map((profile) => profile.platform)).size)}
          delayMs={1}
        />
        <StatCard
          label="Ready to review"
          value={selectedProfiles.length > 0 ? "Yes" : "No"}
          delayMs={2}
        />
      </div>

      {selectedProfiles.length === 0 ? (
        <div
          className="motion-rise mt-6 rounded-[1.75rem] border border-slate-200/70 bg-white/85 px-6 py-16 text-center shadow-sm"
          style={{ animationDelay: "calc(var(--motion-selected-stat-delay) + 150ms)" }}
        >
          <h3 className="text-2xl font-semibold text-slate-950">
            Your shortlist is empty
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-slate-500">
            Add influencers from search or profile details to build a curated
            list for review.
          </p>
          <Link
            to="/discover"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Icon name="search" className="h-4 w-4" />
            Find influencers
          </Link>
        </div>
      ) : (
        <div
          className="motion-rise mt-6 overflow-x-auto rounded-[1.75rem] border border-slate-200/70 bg-white/90 shadow-sm"
          style={{ animationDelay: "calc(var(--motion-selected-stat-delay) + 80ms)" }}
        >
          <div className="min-w-[860px]">
            <div className="grid grid-cols-[1.4fr_0.8fr_0.9fr_0.9fr_0.7fr] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              <span>Creator</span>
              <span>Followers</span>
              <span>Engagement</span>
              <span>Platform</span>
              <span className="text-right">Actions</span>
            </div>

            {selectedProfiles.map((profile, index) => (
              <article
                key={profile.user_id}
                role="button"
                tabIndex={0}
                aria-label={`View profile for ${profile.fullname}`}
                onClick={() => openProfile(profile)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openProfile(profile);
                  }
                }}
                className="grid cursor-pointer grid-cols-[1.4fr_0.8fr_0.9fr_0.9fr_0.7fr] items-center gap-4 border-b border-slate-100 px-5 py-4 transition focus:outline-none focus:ring-4 focus:ring-blue-100 hover:bg-slate-50"
                style={{ animationDelay: `calc(var(--motion-selected-card-base) + ${index} * var(--motion-selected-card-stagger))` }}
              >
                <div className="flex items-center gap-3 text-left">
                  <img
                    src={profile.picture}
                    alt={profile.fullname}
                    className="h-12 w-12 rounded-2xl border border-white object-cover shadow-md ring-1 ring-slate-900/5"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-semibold text-slate-950">
                        @{profile.username}
                      </span>
                      <VerifiedBadge verified={profile.is_verified} />
                    </div>
                    <p className="truncate text-xs text-slate-500">{profile.fullname}</p>
                  </div>
                </div>

                <span className="text-sm font-semibold text-slate-950">
                  {formatNumber(profile.followers)}
                </span>
                <span className="text-sm font-semibold text-slate-950">
                  {formatCompactEngagementRate(profile.engagement_rate)}
                </span>
                <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-700">
                  {getPlatformLabel(profile.platform)}
                </span>

                <div className="flex justify-end gap-2">
                  <Link
                    to={getProfileRoute(profile, profile.platform)}
                    onClick={(event) => event.stopPropagation()}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    View details
                  </Link>
                  <button
                    type="button"
                    onClick={(event) => handleRemove(profile.user_id, event)}
                    className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  delayMs?: number;
}

function StatCard({ label, value, delayMs = 0 }: StatCardProps) {
  return (
    <div
      className="motion-rise rounded-[1.5rem] border border-white/70 bg-white/85 p-5 shadow-sm"
      style={{ animationDelay: `calc(var(--motion-selected-stat-delay) + ${delayMs} * 70ms)` }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function buildShortlistCsv(profiles: SelectedProfile[]): string {
  const rows = profiles.map((profile) => [
    profile.fullname,
    profile.username,
    profile.platform,
    String(profile.followers),
    profile.engagement_rate === undefined ? "" : String(profile.engagement_rate),
    profile.url,
  ]);

  return [
    ["Full name", "Username", "Platform", "Followers", "Engagement rate", "Profile URL"],
    ...rows,
  ]
    .map((row) => row.map(escapeCsvCell).join(","))
    .join("\n");
}

function buildShareText(profiles: SelectedProfile[]): string {
  return profiles
    .map((profile) => {
      const route = `${window.location.origin}${getProfileRoute(profile, profile.platform)}`;
      return `${profile.fullname} (@${profile.username}) - ${getPlatformLabel(profile.platform)} - ${formatNumber(profile.followers)} followers - ${route}`;
    })
    .join("\n");
}

function escapeCsvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}
