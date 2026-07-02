﻿import { Icon } from "./Icon";
import { ProfileCard, type ProfileCardProfile } from "./ProfileCard";

interface ProfileListProps {
  profiles: ProfileCardProfile[];
  searchQuery: string;
}

export function ProfileList({ profiles, searchQuery }: ProfileListProps) {
  return (
    <div className="mx-auto w-full">
      {profiles.length === 0 ? (
        <div className="rounded-[1.75rem] border border-slate-200/70 bg-white/85 px-6 py-12 text-center shadow-sm">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-500">
            <Icon name="search" className="h-5 w-5" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-950">
            No influencers found
          </h3>
          <p className="text-slate-500">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {profiles.map((profile, index) => (
            <ProfileCard
              key={`${profile.platform}-${profile.user_id}`}
              profile={profile}
              searchQuery={searchQuery}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
