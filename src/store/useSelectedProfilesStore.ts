﻿import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  FullUserProfile,
  Platform,
  SelectedProfile,
  UserProfileSummary,
} from "@/types";

interface SelectedProfilesStore {
  selectedProfiles: SelectedProfile[];
  addProfile: (
    profile: UserProfileSummary | FullUserProfile,
    platform: Platform
  ) => void;
  removeProfile: (userId: string) => void;
  clearList: () => void;
  isProfileSelected: (userId: string) => boolean;
}

const EMPTY_STATE = { selectedProfiles: [] } satisfies Pick<
  SelectedProfilesStore,
  "selectedProfiles"
>;

export const useSelectedProfilesStore = create<SelectedProfilesStore>()(
  persist(
    (set, get) => ({
      selectedProfiles: [],
      addProfile: (profile, platform) => {
        const { selectedProfiles } = get();
        const exists = selectedProfiles.some(
          (selectedProfile) => selectedProfile.user_id === profile.user_id
        );
        if (!exists) {
          set({
            selectedProfiles: [
              ...selectedProfiles,
              {
                user_id: profile.user_id,
                username: profile.username,
                platform,
                picture: profile.picture,
                fullname: profile.fullname,
                is_verified: profile.is_verified,
                followers: profile.followers,
                engagements: profile.engagements,
                engagement_rate: profile.engagement_rate,
                url: profile.url,
              },
            ],
          });
        }
      },
      removeProfile: (userId) => {
        set((state) => ({
          selectedProfiles: state.selectedProfiles.filter(
            (profile) => profile.user_id !== userId
          ),
        }));
      },
      clearList: () => {
        set({ selectedProfiles: [] });
      },
      isProfileSelected: (userId) => {
        return get().selectedProfiles.some((profile) => profile.user_id === userId);
      },
    }),
    {
      name: "wobb-selected-profiles",
      version: 1,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== "object") {
          return EMPTY_STATE;
        }

        const selectedProfiles = (persistedState as Partial<SelectedProfilesStore>)
          .selectedProfiles;

        if (!Array.isArray(selectedProfiles)) {
          return EMPTY_STATE;
        }

        return {
          selectedProfiles: selectedProfiles.map((profile) => ({
            ...profile,
            url: profile.url ?? "",
          })),
        };
      },
    }
  )
);
