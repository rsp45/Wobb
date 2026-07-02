import { Link } from "react-router-dom";
import { Icon } from "@/components/Icon";
import { Layout } from "@/components/Layout";
import { extractProfiles } from "@/utils/dataHelpers";
import { formatNumber } from "@/utils/formatters";

export function LandingPage() {
  const featuredProfiles = extractProfiles("instagram").slice(0, 4);

  return (
    <Layout minimal>
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-12 text-white shadow-2xl sm:px-10 sm:py-16 lg:px-16">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
        </div>

        <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Left content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="motion-rise inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-white/90">Live Discovery Platform</span>
            </div>

            <p className="motion-rise mt-6 text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300">
              Wobb / Influencer Discovery
            </p>
            <h1 className="motion-rise mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl" style={{ animationDelay: "90ms" }}>
              Find your perfect{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                creator match
              </span>
            </h1>
            <p className="motion-rise mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg" style={{ animationDelay: "150ms" }}>
              Explore verified creators, compare engagement at a glance, and build a shortlist that looks as polished as the brands you represent.
            </p>

            {/* CTA Buttons */}
            <div className="motion-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "220ms" }}>
              <Link
                to="/discover"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-white/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-50 hover:shadow-xl hover:shadow-cyan-500/20"
              >
                <Icon name="search" className="h-4 w-4 transition-transform group-hover:scale-110" />
                Start Discovering
              </Link>
              <Link
                to="/selected"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
              >
                <Icon name="bookmark" className="h-4 w-4 transition-transform group-hover:scale-110" />
                View Shortlist
              </Link>
            </div>

            {/* Stats */}
            <div className="motion-rise mt-10 grid gap-4 sm:grid-cols-3" style={{ animationDelay: "300ms" }}>
              <FeatureStat label="Verified Profiles" value="12K+" />
              <FeatureStat label="Avg. Engagement" value="4.8%" />
              <FeatureStat label="Shortlist Speed" value="3x faster" />
            </div>
          </div>

          {/* Right side - Featured Profiles Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredProfiles.map((profile, index) => (
              <article
                key={profile.user_id}
                className="motion-rise group overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/10 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.7)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-2xl"
                style={{ animationDelay: `${index * 90 + 180}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={profile.picture} 
                    alt={profile.fullname} 
                    className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">@{profile.username}</p>
                      <p className="truncate text-xs text-slate-300">{profile.fullname}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-cyan-100">
                      {formatNumber(profile.followers)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="mt-12 grid gap-6 lg:grid-cols-3">
        <InfoPanel 
          eyebrow="How it works" 
          title="Search, compare, shortlist."
          icon="search"
          description="Use the discovery dashboard to filter creators by platform, inspect details, and maintain a clean shortlist in one pass."
        />
        <InfoPanel 
          eyebrow="Platform coverage" 
          title="Instagram, TikTok, YouTube."
          icon="users"
          description="Start broad across every platform, then narrow by creator size, verification, shortlist status, and engagement."
        />
        <InfoPanel 
          eyebrow="Submission-ready" 
          title="Lean runtime, clear state."
          icon="check"
          description="The app now uses local data, React, routing, and Zustand with a leaner runtime."
        />
      </section>

      {/* Platform Logos Section */}
      <section className="mt-12 overflow-hidden rounded-[2rem] border border-slate-200/70 bg-gradient-to-br from-violet-50 via-white to-cyan-50 p-8 lg:p-12">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-600">Trusted Platforms</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-950 sm:text-3xl">Connect with creators from top platforms</h2>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 lg:gap-12">
          <div className="group flex flex-col items-center gap-3 rounded-2xl border border-pink-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 text-white shadow-lg">
              <Icon name="instagram" className="h-8 w-8" />
            </div>
            <span className="text-sm font-semibold text-slate-700">Instagram</span>
          </div>
          <div className="group flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg">
              <Icon name="youtube" className="h-8 w-8" />
            </div>
            <span className="text-sm font-semibold text-slate-700">YouTube</span>
          </div>
          <div className="group flex flex-col items-center gap-3 rounded-2xl border border-cyan-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-pink-500 text-white shadow-lg">
              <Icon name="tiktok" className="h-8 w-8" />
            </div>
            <span className="text-sm font-semibold text-slate-700">TikTok</span>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function FeatureStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="group rounded-[1.25rem] border border-white/15 bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/15">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white transition-transform duration-300 group-hover:scale-105">{value}</p>
    </div>
  );
}

function InfoPanel({
  eyebrow,
  title,
  icon,
  description,
}: {
  eyebrow: string;
  title: string;
  icon: "search" | "users" | "check";
  description: string;
}) {
  const iconColors = {
    search: "from-blue-500 to-cyan-400",
    users: "from-violet-500 to-purple-400",
    check: "from-emerald-500 to-teal-400",
  };

  return (
    <div className="motion-rise group relative overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 opacity-50 transition-transform duration-500 group-hover:scale-150" />
      <div className="relative">
        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${iconColors[icon]} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
          <Icon name={icon} className="h-6 w-6" />
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.35em] text-violet-600">{eyebrow}</p>
        <h2 className="mt-2 text-xl font-bold text-slate-950">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
    </div>
  );
}
