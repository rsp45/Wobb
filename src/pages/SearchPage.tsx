import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Platform } from "@/types";
import { Icon } from "@/components/Icon";
import { Layout } from "@/components/Layout";
import { SearchBar } from "@/components/SearchBar";
import { PlatformFilter, type PlatformSelection } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import type { ProfileCardProfile } from "@/components/ProfileCard";
import { extractProfiles, filterProfiles, PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { useSelectedProfilesStore } from "@/store/useSelectedProfilesStore";

const followerTiers = {
  any: { label: "Any size", min: 0, max: Infinity },
  emerging: { label: "Under 1M", min: 0, max: 999999 },
  macro: { label: "1M-100M", min: 1000000, max: 99999999 },
  mega: { label: "100M+", min: 100000000, max: Infinity },
} as const;

type FollowerTier = keyof typeof followerTiers;
type VerificationFilter = "all" | "verified" | "unverified";
type EngagementFilter = "all" | "1" | "3" | "5";
type SortMode = "followers" | "engagement";

export function SearchPage() {
  const [platform, setPlatform] = useState<PlatformSelection>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("followers");
  const [verificationFilter, setVerificationFilter] =
    useState<VerificationFilter>("all");
  const [followerTier, setFollowerTier] = useState<FollowerTier>("any");
  const [engagementFilter, setEngagementFilter] =
    useState<EngagementFilter>("all");
  const [shortlistOnly, setShortlistOnly] = useState(false);
  const { selectedProfiles } = useSelectedProfilesStore();

  const allProfiles = useMemo<ProfileCardProfile[]>(() => {
    const platforms: Platform[] = platform === "all" ? PLATFORMS : [platform];

    return platforms.flatMap((currentPlatform) =>
      extractProfiles(currentPlatform).map((profile) => ({
        ...profile,
        platform: currentPlatform,
      }))
    );
  }, [platform]);

  const selectedProfileIds = useMemo(
    () => new Set(selectedProfiles.map((profile) => profile.user_id)),
    [selectedProfiles]
  );

  const filtered = useMemo(() => {
    const searched = filterProfiles(allProfiles, searchQuery) as ProfileCardProfile[];
    const tier = followerTiers[followerTier];
    const minEngagement = engagementFilter === "all" ? 0 : Number(engagementFilter) / 100;

    return searched.filter((profile) => {
      const matchesVerification =
        verificationFilter === "all" ||
        (verificationFilter === "verified" && profile.is_verified) ||
        (verificationFilter === "unverified" && !profile.is_verified);
      const matchesFollowerTier =
        profile.followers >= tier.min && profile.followers <= tier.max;
      const matchesEngagement = (profile.engagement_rate ?? 0) >= minEngagement;
      const matchesShortlist = !shortlistOnly || selectedProfileIds.has(profile.user_id);

      return (
        matchesVerification &&
        matchesFollowerTier &&
        matchesEngagement &&
        matchesShortlist
      );
    });
  }, [allProfiles, searchQuery, followerTier, engagementFilter, verificationFilter, shortlistOnly, selectedProfileIds]);

  const sortedProfiles = useMemo(() => {
    const next = [...filtered];
    next.sort((a, b) => {
      if (sortMode === "engagement") {
        return (b.engagement_rate ?? 0) - (a.engagement_rate ?? 0);
      }

      return b.followers - a.followers;
    });

    return next;
  }, [filtered, sortMode]);

  const topTierCount = useMemo(
    () => allProfiles.filter((profile) => profile.followers >= 100000000).length,
    [allProfiles]
  );

  const resetFilters = () => {
    setPlatform("all");
    setSearchQuery("");
    setVerificationFilter("all");
    setFollowerTier("any");
    setEngagementFilter("all");
    setShortlistOnly(false);
    setSortMode("followers");
  };

  return (
    <Layout
      title="Discovery dashboard"
      subtitle="Search creators across platforms, filter by fit, sort by performance, and build a shortlist with a clean professional workflow."
    >
      <div className="grid gap-6 xl:grid-cols-[310px_minmax(0,1fr)]">
        <aside className="motion-rise rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-950">Active filters</h2>
            <Icon name="filter" className="h-5 w-5 text-slate-400" />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <FilterPill>{platform === "all" ? "All platforms" : getPlatformLabel(platform as Platform)}</FilterPill>
            <FilterPill>{searchQuery || "Any keyword"}</FilterPill>
            <FilterPill>{followerTiers[followerTier].label}</FilterPill>
            {shortlistOnly && <FilterPill>Shortlist only</FilterPill>}
          </div>

          <div className="mt-6 space-y-4 border-t border-slate-200 pt-6">
            <StatRow label="Shortlisted" value={String(selectedProfiles.length)} />
            <StatRow label="Matching creators" value={String(sortedProfiles.length)} />
            <StatRow label="100M+ creators" value={String(topTierCount)} />
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-200 pt-6">
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Reset filters
            </button>
            <Link
              to="/selected"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Icon name="bookmark" className="h-4 w-4" />
              Open shortlist
            </Link>
          </div>
        </aside>

        <section className="space-y-5">
          <div className="motion-rise rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-6 shadow-sm">
            <div className="flex flex-col gap-5">
              <PlatformFilter selected={platform} onChange={setPlatform} />

              <div className="space-y-4">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search by creator, handle, platform, or URL"
                />

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Verification
                    </label>
                    <select
                      value={verificationFilter}
                      onChange={(event) =>
                        setVerificationFilter(event.target.value as VerificationFilter)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="all">All verification</option>
                      <option value="verified">Verified only</option>
                      <option value="unverified">Unverified only</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Followers
                    </label>
                    <select
                      value={followerTier}
                      onChange={(event) => setFollowerTier(event.target.value as FollowerTier)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      {Object.entries(followerTiers).map(([value, tier]) => (
                        <option key={value} value={value}>{tier.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Engagement
                    </label>
                    <select
                      value={engagementFilter}
                      onChange={(event) => setEngagementFilter(event.target.value as EngagementFilter)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="all">Any engagement</option>
                      <option value="1">1%+</option>
                      <option value="3">3%+</option>
                      <option value="5">5%+</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Sort by
                    </label>
                    <select
                      value={sortMode}
                      onChange={(event) => setSortMode(event.target.value as SortMode)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="followers">Follower Count</option>
                      <option value="engagement">Engagement Rate</option>
                    </select>
                  </div>
                </div>

                <label className="inline-flex w-fit items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shortlistOnly}
                    onChange={(event) => setShortlistOnly(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Shortlist only
                </label>
              </div>
            </div>
          </div>

          <div className="motion-rise rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Discovery feed
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  {sortedProfiles.length} creators found
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                <Icon name="bookmark" className="h-4 w-4" />
                <span>Saved shortlist</span>
                <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white">
                  {selectedProfiles.length}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <ProfileList profiles={sortedProfiles} searchQuery={searchQuery} />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function FilterPill({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
      {children}
    </span>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-semibold text-slate-950">{value}</span>
    </div>
  );
}
