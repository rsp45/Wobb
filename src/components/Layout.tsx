﻿import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@/components/Icon";
import { useSelectedProfilesStore } from "@/store/useSelectedProfilesStore";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  minimal?: boolean;
}

const motionVars: CSSProperties = {
  ["--motion-page-intro-delay" as string]: "0ms",
  ["--motion-results-delay" as string]: "120ms",
  ["--motion-card-base" as string]: "80ms",
  ["--motion-card-stagger" as string]: "45ms",
  ["--motion-detail-back-delay" as string]: "0ms",
  ["--motion-detail-panel-delay" as string]: "80ms",
  ["--motion-metric-base" as string]: "0ms",
  ["--motion-metric-stagger" as string]: "45ms",
  ["--motion-selected-back-delay" as string]: "0ms",
  ["--motion-selected-stat-delay" as string]: "60ms",
  ["--motion-selected-card-base" as string]: "90ms",
  ["--motion-selected-card-stagger" as string]: "35ms",
};

export function Layout({ children, title, subtitle, minimal = false }: LayoutProps) {
  const { selectedProfiles } = useSelectedProfilesStore();

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden ${minimal ? "text-white" : "text-slate-900"}`}
      style={motionVars}
    >
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-700 text-xl font-bold text-white shadow-lg shadow-cyan-500/20">
              W
            </span>
            <div className="text-left">
              <div className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200">
                Wobb
              </div>
              <div className="text-lg font-semibold text-white">
                Influencer Discovery
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 text-sm text-slate-200 md:flex">
            <Link to="/discover" className="rounded-full px-4 py-2 transition hover:bg-white/10">
              Discover
            </Link>
            <Link to="/selected" className="rounded-full px-4 py-2 transition hover:bg-white/10">
              Shortlist
            </Link>
          </nav>

          <div className="flex items-center gap-3 text-sm text-slate-200">
            <Link
              to="/discover"
              className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 font-medium transition hover:bg-white/10 sm:inline-flex"
            >
              Discover
            </Link>
            <Link
              to="/selected"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-50"
            >
              <Icon name="bookmark" className="h-4 w-4" />
              <span>Shortlist</span>
              <span className="rounded-full bg-slate-950 px-2.5 py-0.5 text-xs font-bold text-white">
                {selectedProfiles.length}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {minimal ? (
          children
        ) : (
          <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.45)] backdrop-blur-xl">
            <div className="border-b border-slate-200/70 bg-gradient-to-r from-white via-violet-50/70 to-sky-50/70 px-6 py-6 sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-600">
                    Assignment submission
                  </p>
                  {title && (
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                      {subtitle}
                    </p>
                  )}
                </div>
                <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm ring-1 ring-slate-900/5">
                  <span className="font-semibold text-slate-900">
                    {selectedProfiles.length}
                  </span>{" "}
                  saved profiles in your shortlist
                </div>
              </div>
            </div>

            <div className="px-6 py-6 sm:px-8 sm:py-8">{children}</div>
          </section>
        )}
      </main>
    </div>
  );
}
