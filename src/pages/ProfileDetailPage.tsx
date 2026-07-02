import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, Platform, ProfileDetailResponse, ProfilePost } from "@/types";
import { formatEngagementRate, formatNumber, formatPercent } from "@/utils/formatters";
import { isPlatform, getPlatformLabel } from "@/utils/dataHelpers";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useSelectedProfilesStore } from "@/store/useSelectedProfilesStore";

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const requestedPlatform = isPlatform(searchParams.get("platform"))
    ? searchParams.get("platform")
    : undefined;
  const profileId = searchParams.get("id");
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(
    null
  );
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const previousKeyRef = useRef<string | null>(null);

  const { addProfile, removeProfile, isProfileSelected } =
    useSelectedProfilesStore();

  useEffect(() => {
    if (!username) {
      return;
    }

    let cancelled = false;
    const currentKey = `${username}:${requestedPlatform ?? "any"}:${profileId ?? "any"}`;

    // Only reset if the key changed from what's loaded
    if (previousKeyRef.current !== currentKey) {
      setLoadedKey(null);
      setProfileData(null);
    }

    loadProfileByUsername(username, requestedPlatform, profileId).then((data) => {
      if (cancelled) {
        return;
      }

      setProfileData(data);
      setLoadedKey(currentKey);
      previousKeyRef.current = currentKey;
    });

    return () => {
      cancelled = true;
    };
  }, [username, requestedPlatform, profileId]);

  if (!username) {
    return (
      <Layout>
        <p>Invalid profile</p>
        <Link to="/discover">Back</Link>
      </Layout>
    );
  }

  const currentKey = `${username}:${requestedPlatform ?? "any"}:${profileId ?? "any"}`;

  if (loadedKey !== currentKey) {
    return (
      <Layout title={`@${username}`} subtitle="Loading profile details...">
        <p className="text-slate-500">Loading...</p>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`} subtitle="Unable to load profile">
        <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 px-6 py-10 text-center text-rose-700">
          Could not load profile details for {username}
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const platform: Platform = requestedPlatform ?? (isPlatform(user.type ?? null) ? user.type : "instagram");
  const isSelected = isProfileSelected(user.user_id);
  const topPosts = (user.top_posts ?? user.recent_posts ?? []).slice(0, 4);
  const audienceAges =
    profileData.audience_followers?.data?.audience_ages?.slice(0, 4) ?? [];
  const audienceCountries =
    profileData.audience_followers?.data?.audience_geo?.countries?.slice(0, 3) ?? [];
  const themes =
    user.interests?.map((interest) => interest.name).slice(0, 6) ??
    user.relevant_tags?.map((tag) => tag.tag).slice(0, 6) ??
    [];

  const handleAddRemove = () => {
    if (isSelected) {
      removeProfile(user.user_id);
      return;
    }

    addProfile(user, platform);
  };

  return (
    <Layout
      title={user.fullname}
      subtitle={`A clean profile workspace for ${user.username} on ${getPlatformLabel(platform)}.`}
    >
      <div
        className="motion-rise mb-6 flex flex-wrap items-center justify-between gap-3"
        style={{ animationDelay: "var(--motion-detail-back-delay)" }}
      >
        <Link
          to="/discover"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        >
          Back to search
        </Link>

        <Link
          to="/selected"
          className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
        >
          View shortlist
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
        <div className="space-y-6">
          <section
            className="motion-rise overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 shadow-sm"
            style={{ animationDelay: "var(--motion-detail-panel-delay)" }}
          >
            <div className="relative min-h-52 overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(77,106,255,0.35),_transparent_32%),linear-gradient(135deg,_#0f172a_0%,_#31415e_40%,_#d97706_100%)] p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <img
                    src={user.picture}
                    alt={user.fullname}
                    className="h-28 w-28 rounded-[1.75rem] border-4 border-white object-cover shadow-xl"
                  />
                  <div className="text-white">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-3xl font-semibold tracking-tight">
                        {user.fullname}
                      </h2>
                      <VerifiedBadge verified={user.is_verified} />
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-100">
                      @{user.username} / {getPlatformLabel(platform)}
                    </p>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200">
                      {user.description ??
                        "A polished creator profile workspace for review, comparison, and shortlist decisions."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleAddRemove}
                    className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                      isSelected
                        ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20"
                        : "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
                    }`}
                  >
                    {isSelected ? "Added to shortlist" : "Add to shortlist"}
                  </button>
                  {user.url && (
                    <a
                      href={user.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                    >
                      View original profile
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section
            className="motion-rise rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-sm"
            style={{ animationDelay: "calc(var(--motion-detail-panel-delay) + 100ms)" }}
          >
            <h3 className="text-lg font-semibold text-slate-950">Key metrics</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <MetricCard label="Followers" value={formatNumber(user.followers)} delayMs={0} />
              <MetricCard label="Engagement rate" value={formatEngagementRate(user.engagement_rate)} delayMs={1} />
              {user.posts_count !== undefined && (
                <MetricCard label="Posts" value={formatNumber(user.posts_count)} delayMs={2} />
              )}
              {user.avg_likes !== undefined && (
                <MetricCard label="Avg likes" value={formatNumber(user.avg_likes)} delayMs={3} />
              )}
              {user.avg_comments !== undefined && (
                <MetricCard label="Avg comments" value={formatNumber(user.avg_comments)} delayMs={4} />
              )}
              {user.engagements !== undefined && (
                <MetricCard label="Engagements" value={formatNumber(user.engagements)} delayMs={5} />
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section
            className="motion-rise rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-sm"
            style={{ animationDelay: "calc(var(--motion-detail-panel-delay) + 140ms)" }}
          >
            <h3 className="text-lg font-semibold text-slate-950">Top posts</h3>
            {topPosts.length > 0 ? (
              <div className="mt-5 grid grid-cols-2 gap-3">
                {topPosts.map((post) => (
                  <PostCard key={post.post_id} post={post} fallbackName={user.fullname} />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">No post data available.</p>
            )}
          </section>

          <section
            className="motion-rise rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-sm"
            style={{ animationDelay: "calc(var(--motion-detail-panel-delay) + 220ms)" }}
          >
            <h3 className="text-lg font-semibold text-slate-950">Audience snapshot</h3>
            {audienceAges.length > 0 ? (
              <div className="mt-5 space-y-3">
                {audienceAges.map((segment) => (
                  <AudienceBar key={segment.code} label={segment.code} value={segment.weight} />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Audience age data is not available.</p>
            )}
            {audienceCountries.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {audienceCountries.map((country) => (
                  <span
                    key={country.id ?? country.name}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {country.name} {formatPercent(country.weight)}
                  </span>
                ))}
              </div>
            )}
          </section>

          <section
            className="motion-rise rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-sm"
            style={{ animationDelay: "calc(var(--motion-detail-panel-delay) + 300ms)" }}
          >
            <h3 className="text-lg font-semibold text-slate-950">Content themes</h3>
            {themes.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {themes.map((theme) => (
                  <span
                    key={theme}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">No theme data available.</p>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  delayMs?: number;
}

function MetricCard({ label, value, delayMs = 0 }: MetricCardProps) {
  return (
    <div
      className="motion-rise rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4"
      style={{
        animationDelay: `calc(var(--motion-metric-base) + ${delayMs} * var(--motion-metric-stagger))`,
      }}
    >
      <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-xl font-semibold text-slate-950">{value}</div>
    </div>
  );
}

function PostCard({ post, fallbackName }: { post: ProfilePost; fallbackName: string }) {
  const image = post.thumbnail ?? post.image;
  const content = (
    <>
      {image && <img src={image} alt={fallbackName} className="h-28 w-full object-cover" />}
      <div className="p-3 text-xs text-slate-500">
        {formatNumber(post.stat?.likes ?? 0)} likes / {formatNumber(post.stat?.comments ?? 0)} comments
      </div>
    </>
  );

  if (post.link) {
    return (
      <a
        href={post.link}
        target="_blank"
        rel="noopener noreferrer"
        className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition hover:border-blue-200 hover:bg-blue-50"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
      {content}
    </div>
  );
}

function AudienceBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-950">{formatPercent(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </div>
    </div>
  );
}
