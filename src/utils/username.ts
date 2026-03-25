const USERNAME_REGEX = /^[a-z0-9._]{3,20}$/;

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function validateUsername(value: string) {
  const normalized = normalizeUsername(value);

  if (!normalized) {
    return "Choose a username to finish your profile.";
  }

  if (!USERNAME_REGEX.test(normalized)) {
    return "Use 3-20 lowercase letters, numbers, periods, or underscores.";
  }

  return null;
}
