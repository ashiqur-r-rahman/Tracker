type Profile = { username?: string | null; display_name?: string | null };

export function getUsername(profile: Profile | Profile[] | null | undefined) {
  const value = Array.isArray(profile) ? profile[0] : profile;
  return value?.username || "unknown";
}