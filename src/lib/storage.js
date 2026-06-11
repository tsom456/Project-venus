/* Persistence: window.storage when available (artifact runtime),
   otherwise localStorage. API stays async so callers don't care which. */

const hasArtifactStorage = () =>
  typeof window !== "undefined" && window.storage && typeof window.storage.get === "function";

export async function loadKey(key, fallback) {
  try {
    if (hasArtifactStorage()) {
      const r = await window.storage.get(key);
      return r ? JSON.parse(r.value) : fallback;
    }
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export async function saveKey(key, value) {
  try {
    if (hasArtifactStorage()) {
      await window.storage.set(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
    return true;
  } catch {
    return false;
  }
}
