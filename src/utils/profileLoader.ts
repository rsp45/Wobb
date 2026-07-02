import type { Platform, ProfileDetailResponse } from "@/types";

const profileModules = import.meta.glob<ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

async function loadProfileModule(
  path: string
): Promise<ProfileDetailResponse | null> {
  const loader = profileModules[path];

  if (!loader) {
    return null;
  }

  const result = await loader();
  const data =
    (result as { default?: ProfileDetailResponse }).default ?? result;
  return data as ProfileDetailResponse;
}

export async function loadProfileByUsername(
  username: string,
  platform?: Platform,
  userId?: string | null
): Promise<ProfileDetailResponse | null> {
  const decodedUsername = decodeURIComponent(username);
  const directMatch = await loadProfileModule(
    `../assets/data/profiles/${decodedUsername}.json`
  );

  if (
    directMatch &&
    (!platform || directMatch.data.user_profile.type === platform) &&
    (!userId || directMatch.data.user_profile.user_id === userId)
  ) {
    return directMatch;
  }

  const profiles = await Promise.all(
    Object.keys(profileModules).map((path) => loadProfileModule(path))
  );

  return (
    profiles.find((profile) => {
      if (!profile) return false;

      const candidate = profile.data.user_profile;
      const matchesUser =
        candidate.username.toLowerCase() === decodedUsername.toLowerCase() ||
        candidate.user_id === userId;
      const matchesPlatform = !platform || candidate.type === platform;

      return matchesUser && matchesPlatform;
    }) ?? null
  );
}
