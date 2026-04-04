// ─── Extracted pure utilities for TapIn ─────────────────────────────
// These functions are the core logic behind analytics, profile encoding,
// avatar resolution, and vCard generation. Extracted for testability.

/** Hash a profile into a localStorage key using djb2-style hash */
export function getAnalyticsKey(profile) {
  const raw = (profile.name || "") + "|" + (profile.handle || "");
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash) + raw.charCodeAt(i);
    hash |= 0;
  }
  return `lockedin_analytics_${Math.abs(hash)}`;
}

/** Compute dashboard stats from a raw event array */
export function computeAnalytics(events) {
  const now = Date.now();
  const day = 86400000;
  const views = events.filter((e) => e.type === "view");
  const clicks = events.filter((e) => e.type !== "view");
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const dayStart = now - (6 - i) * day;
    const dayEnd = dayStart + day;
    return events.filter((e) => e.timestamp >= dayStart && e.timestamp < dayEnd).length;
  });
  const platformClicks = {};
  clicks.forEach((e) => {
    if (e.platform) platformClicks[e.platform] = (platformClicks[e.platform] || 0) + 1;
  });
  const followAllClicks = events.filter((e) => e.type === "follow_all").length;
  const contactSaves = events.filter((e) => e.type === "contact_save").length;
  const ctr = views.length > 0 ? ((clicks.length / views.length) * 100).toFixed(1) : "0.0";
  return { totalViews: views.length, totalClicks: clicks.length, followAllClicks, contactSaves, platformClicks, last7, ctr };
}

/** Base64-encode a profile object into a URL-safe hash */
export function encodeProfile(profile) {
  const data = {
    n: profile.name,
    h: profile.handle,
    b: profile.bio,
    t: profile.theme || "midnight",
    e: profile.email || "",
    p: profile.phone || "",
    s: {},
    cl: profile.customLinks || [],
    fp: profile.feedConfig || {},
  };
  Object.entries(profile.socials).forEach(([k, v]) => {
    if (v?.trim()) data.s[k] = v;
  });
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

/** Decode a URL hash back into a profile object */
export function decodeProfile(hash) {
  try {
    const data = JSON.parse(decodeURIComponent(atob(hash)));
    return {
      name: data.n || "",
      handle: data.h || "",
      bio: data.b || "",
      theme: data.t || "midnight",
      email: data.e || "",
      phone: data.p || "",
      socials: data.s || {},
      customLinks: data.cl || [],
      feedConfig: data.fp || {},
    };
  } catch {
    return null;
  }
}

/** Resolve a profile avatar URL from connected socials */
export function getAvatarUrl(profile) {
  if (profile.socials.github) return `https://github.com/${profile.socials.github}.png?size=200`;
  if (profile.socials.twitter) return `https://unavatar.io/twitter/${profile.socials.twitter}`;
  if (profile.socials.instagram) return `https://unavatar.io/instagram/${profile.socials.instagram}`;
  return null;
}

/** Build vCard lines (without DOM download logic, for testability) */
export function buildVCardLines(profile, PLATFORMS) {
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `FN:${profile.name || "LockedIn User"}`];
  if (profile.bio) lines.push(`NOTE:${profile.bio}`);
  if (profile.email) lines.push(`EMAIL:${profile.email}`);
  if (profile.phone) lines.push(`TEL:${profile.phone}`);
  Object.entries(profile.socials).forEach(([p, h]) => {
    if (!h?.trim()) return;
    const c = PLATFORMS[p];
    if (c) lines.push(`URL;type=${c.name}:${c.getProfileUrl(h)}`);
  });
  (profile.customLinks || []).forEach((cl) => {
    if (cl.url?.trim()) lines.push(`URL;type=${cl.label || "Link"}:${cl.url}`);
  });
  lines.push("END:VCARD");
  return lines;
}
