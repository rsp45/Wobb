import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { Platform, SearchData, UserProfileSummary } from "@/types";

const platformData: Record<Platform, SearchData> = {
  instagram: instagramData as SearchData,
  youtube: youtubeData as SearchData,
  tiktok: tiktokData as SearchData,
};

export function getSearchData(platform: Platform): SearchData {
  return platformData[platform];
}

export function extractProfiles(platform: Platform): UserProfileSummary[] {
  const data = getSearchData(platform);
  return data.accounts.map((item) => item.account.user_profile);
}

export function filterProfiles(
  profiles: UserProfileSummary[],
  query: string
): UserProfileSummary[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return profiles;

  return profiles.filter((profile) => {
    const searchableText = [
      profile.username,
      profile.fullname,
      profile.handle,
      profile.custom_name,
      profile.platform,
      profile.url,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

export function getProfileRoute(
  profile: UserProfileSummary,
  platform: Platform
): string {
  return `/profile/${encodeURIComponent(profile.username)}?platform=${platform}&id=${encodeURIComponent(
    profile.user_id
  )}`;
}

export function isPlatform(value: string | null): value is Platform {
  return value === "instagram" || value === "youtube" || value === "tiktok";
}

export const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

export function getPlatformLabel(platform: Platform): string {
  if (platform === "instagram") return "Instagram";
  if (platform === "youtube") return "YouTube";
  return "TikTok";
}
