import { describe, it, expect } from "vitest";
import { getAnalyticsKey, computeAnalytics, encodeProfile, decodeProfile, getAvatarUrl, buildVCardLines } from "./utils.js";

const fullProfile = {
  name: "James Olusoga", handle: "daredev256", bio: "AI Solutions Engineer", theme: "neon",
  email: "james@example.com", phone: "+1234567890",
  socials: { github: "daredev256", twitter: "daredev256", linkedin: "jamesolusoga" },
  customLinks: [{ label: "Portfolio", url: "https://jamesdare.com" }], feedConfig: {},
};
const emptyProfile = { name: "", handle: "", bio: "", theme: "midnight", email: "", phone: "", socials: {}, customLinks: [], feedConfig: {} };

describe("getAnalyticsKey", () => {
  it("is deterministic and prefixed correctly", () => {
    const k = getAnalyticsKey(fullProfile);
    expect(k).toMatch(/^lockedin_analytics_\d+$/);
    expect(getAnalyticsKey(fullProfile)).toBe(k);
  });
  it("produces distinct keys for different profiles", () => {
    expect(getAnalyticsKey({ name: "A", handle: "x" })).not.toBe(getAnalyticsKey({ name: "B", handle: "x" }));
  });
  it("handles missing properties without crashing", () => {
    expect(getAnalyticsKey({})).toMatch(/^lockedin_analytics_\d+$/);
  });
});

describe("computeAnalytics", () => {
  const now = Date.now();
  const day = 86400000;

  it("returns zeroed stats for empty events", () => {
    const s = computeAnalytics([]);
    expect(s.totalViews).toBe(0);
    expect(s.totalClicks).toBe(0);
    expect(s.ctr).toBe("0.0");
    expect(s.last7).toHaveLength(7);
    expect(s.last7.every((v) => v === 0)).toBe(true);
  });
  it("separates views from clicks and calculates CTR", () => {
    const events = [
      { type: "view", timestamp: now }, { type: "view", timestamp: now },
      { type: "view", timestamp: now }, { type: "view", timestamp: now },
      { type: "follow", platform: "github", timestamp: now },
    ];
    const s = computeAnalytics(events);
    expect(s.totalViews).toBe(4);
    expect(s.totalClicks).toBe(1);
    expect(s.ctr).toBe("25.0");
  });
  it("avoids division by zero when no views exist", () => {
    expect(computeAnalytics([{ type: "follow", platform: "gh", timestamp: now }]).ctr).toBe("0.0");
  });
  it("counts follow_all and contact_save separately", () => {
    const events = [
      { type: "follow_all", timestamp: now }, { type: "follow_all", timestamp: now },
      { type: "contact_save", timestamp: now },
    ];
    const s = computeAnalytics(events);
    expect(s.followAllClicks).toBe(2);
    expect(s.contactSaves).toBe(1);
  });
  it("aggregates platform clicks and excludes null platforms", () => {
    const events = [
      { type: "follow", platform: "github", timestamp: now },
      { type: "follow", platform: "github", timestamp: now },
      { type: "follow_all", timestamp: now }, // no platform
    ];
    expect(computeAnalytics(events).platformClicks).toEqual({ github: 2 });
  });
  it("bins events into 7-day sparkline", () => {
    const events = [
      { type: "view", timestamp: now + 100 },
      { type: "view", timestamp: now - day + 100 },
      { type: "view", timestamp: now - 8 * day }, // outside window
    ];
    const total = computeAnalytics(events).last7.reduce((a, b) => a + b, 0);
    expect(total).toBe(2); // only 2 within window
  });
  it("treats every non-view type as a click", () => {
    const types = ["follow", "follow_all", "contact_save", "dm", "book", "pay", "copy_link"];
    const events = types.map((type) => ({ type, platform: "x", timestamp: now }));
    expect(computeAnalytics(events).totalClicks).toBe(7);
  });
});

describe("encodeProfile & decodeProfile", () => {
  it("roundtrips a full profile", () => {
    const d = decodeProfile(encodeProfile(fullProfile));
    expect(d.name).toBe("James Olusoga");
    expect(d.socials).toEqual({ github: "daredev256", twitter: "daredev256", linkedin: "jamesolusoga" });
    expect(d.customLinks).toEqual(fullProfile.customLinks);
  });
  it("roundtrips an empty profile", () => {
    const d = decodeProfile(encodeProfile(emptyProfile));
    expect(d.name).toBe("");
    expect(d.socials).toEqual({});
  });
  it("strips whitespace-only social handles", () => {
    const p = { ...fullProfile, socials: { github: "ok", twitter: "", instagram: "   " } };
    expect(decodeProfile(encodeProfile(p)).socials).toEqual({ github: "ok" });
  });
  it("defaults theme to midnight when missing", () => {
    expect(decodeProfile(encodeProfile({ ...fullProfile, theme: undefined })).theme).toBe("midnight");
  });
  it("handles unicode in name and bio", () => {
    const p = { ...fullProfile, name: "José 🚀", bio: "日本語" };
    const d = decodeProfile(encodeProfile(p));
    expect(d.name).toBe("José 🚀");
    expect(d.bio).toBe("日本語");
  });
  it("returns null for invalid inputs", () => {
    expect(decodeProfile("!!!bad!!!")).toBeNull();
    expect(decodeProfile("")).toBeNull();
    expect(decodeProfile(btoa("not json"))).toBeNull();
  });
});

describe("getAvatarUrl", () => {
  it("prioritizes github > twitter > instagram", () => {
    expect(getAvatarUrl({ socials: { github: "gh", twitter: "tw" } })).toContain("github.com/gh");
    expect(getAvatarUrl({ socials: { twitter: "tw", instagram: "ig" } })).toContain("unavatar.io/twitter/tw");
    expect(getAvatarUrl({ socials: { instagram: "ig" } })).toContain("unavatar.io/instagram/ig");
  });
  it("returns null when no matching socials", () => {
    expect(getAvatarUrl({ socials: {} })).toBeNull();
    expect(getAvatarUrl({ socials: { linkedin: "x" } })).toBeNull();
  });
});

describe("buildVCardLines", () => {
  const platforms = {
    github: { name: "GitHub", getProfileUrl: (h) => `https://github.com/${h}` },
    twitter: { name: "Twitter", getProfileUrl: (h) => `https://twitter.com/${h}` },
  };
  it("produces valid vCard with all fields", () => {
    const l = buildVCardLines(fullProfile, platforms);
    expect(l[0]).toBe("BEGIN:VCARD");
    expect(l.at(-1)).toBe("END:VCARD");
    expect(l).toContain("FN:James Olusoga");
    expect(l).toContain("EMAIL:james@example.com");
    expect(l).toContain("URL;type=GitHub:https://github.com/daredev256");
    expect(l).toContain("URL;type=Portfolio:https://jamesdare.com");
  });
  it("uses default name and omits empty fields", () => {
    const l = buildVCardLines(emptyProfile, platforms);
    expect(l).toContain("FN:LockedIn User");
    expect(l.some((x) => x.startsWith("EMAIL:"))).toBe(false);
  });
  it("skips empty handles and empty custom link URLs", () => {
    const p = { ...emptyProfile, socials: { github: "", twitter: "   " }, customLinks: [{ label: "X", url: "" }] };
    expect(buildVCardLines(p, platforms).filter((x) => x.startsWith("URL;"))).toHaveLength(0);
  });
  it("defaults custom link label to 'Link'", () => {
    const p = { ...emptyProfile, customLinks: [{ url: "https://example.com" }] };
    expect(buildVCardLines(p, platforms)).toContain("URL;type=Link:https://example.com");
  });
});
