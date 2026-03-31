import { useState, useEffect, useCallback, useMemo } from "react";

// ─── Themes ─────────────────────────────────────────────────────────
const THEMES = {
  midnight: { name: "Midnight", accent: "#ff2d78", accent2: "#ff6b35", bg: "linear-gradient(145deg, #06060c 0%, #0d0b18 40%, #0a0812 100%)", cardBg: "rgba(255,255,255,0.05)", text: "#fff", sub: "rgba(255,255,255,0.5)", border: "rgba(255,255,255,0.08)" },
  ocean: { name: "Ocean", accent: "#00b4d8", accent2: "#0077b6", bg: "linear-gradient(145deg, #020c1b 0%, #0a192f 40%, #051425 100%)", cardBg: "rgba(0,180,216,0.04)", text: "#ccd6f6", sub: "rgba(204,214,246,0.5)", border: "rgba(0,180,216,0.12)" },
  sunset: { name: "Sunset", accent: "#f97316", accent2: "#ef4444", bg: "linear-gradient(145deg, #1a0a00 0%, #1c0f0a 40%, #150800 100%)", cardBg: "rgba(249,115,22,0.04)", text: "#fff", sub: "rgba(255,255,255,0.5)", border: "rgba(249,115,22,0.12)" },
  neon: { name: "Neon", accent: "#a855f7", accent2: "#06b6d4", bg: "linear-gradient(145deg, #0a0015 0%, #0d001a 40%, #080012 100%)", cardBg: "rgba(168,85,247,0.04)", text: "#e2e8f0", sub: "rgba(226,232,240,0.5)", border: "rgba(168,85,247,0.12)" },
  minimal: { name: "Minimal", accent: "#18181b", accent2: "#3f3f46", bg: "linear-gradient(145deg, #fafafa 0%, #f4f4f5 40%, #fafafa 100%)", cardBg: "rgba(0,0,0,0.03)", text: "#18181b", sub: "rgba(24,24,27,0.5)", border: "rgba(0,0,0,0.08)" },
};

// ─── Platform Config ────────────────────────────────────────────────
const PLATFORMS = {
  twitter: { name: "X / Twitter", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>, getFollowUrl: (h) => `https://twitter.com/intent/follow?screen_name=${h}`, getProfileUrl: (h) => `https://twitter.com/${h}`, getDmUrl: (h) => `https://twitter.com/messages/compose?recipient_id=${h}`, supportsDm: true, placeholder: "handle (no @)", color: "#fff" },
  youtube: { name: "YouTube", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>, getFollowUrl: (h) => `https://www.youtube.com/${h}?sub_confirmation=1`, getProfileUrl: (h) => `https://www.youtube.com/${h}`, supportsDm: false, placeholder: "@channel", color: "#FF0033" },
  instagram: { name: "Instagram", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>, getFollowUrl: (h) => `instagram://user?username=${h}`, getProfileUrl: (h) => `https://www.instagram.com/${h}/`, getDmUrl: () => `instagram://direct-new`, supportsDm: true, placeholder: "username", color: "#E4405F" },
  tiktok: { name: "TikTok", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>, getFollowUrl: (h) => `https://www.tiktok.com/@${h}`, getProfileUrl: (h) => `https://www.tiktok.com/@${h}`, supportsDm: false, placeholder: "username", color: "#00f2ea" },
  github: { name: "GitHub", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>, getFollowUrl: (h) => `https://github.com/${h}`, getProfileUrl: (h) => `https://github.com/${h}`, supportsDm: false, placeholder: "username", color: "#f0f6fc" },
  spotify: { name: "Spotify", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>, getFollowUrl: (h) => `spotify:artist:${h}`, getProfileUrl: (h) => `https://open.spotify.com/artist/${h}`, supportsDm: false, placeholder: "artist ID", color: "#1DB954" },
  twitch: { name: "Twitch", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" /></svg>, getFollowUrl: (h) => `https://www.twitch.tv/${h}`, getProfileUrl: (h) => `https://www.twitch.tv/${h}`, supportsDm: false, placeholder: "username", color: "#9146FF" },
  website: { name: "Website", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>, getFollowUrl: (h) => h.startsWith("http") ? h : `https://${h}`, getProfileUrl: (h) => h.startsWith("http") ? h : `https://${h}`, supportsDm: false, placeholder: "yoursite.com", color: "#64ffda" },
};

const ACTION_MODES = [
  { id: "follow", label: "Follow", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg> },
  { id: "connect", label: "Connect", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M7 8h10M7 12h6M7 16h8" /></svg> },
  { id: "dm", label: "DM", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
  { id: "book", label: "Book", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> },
  { id: "pay", label: "Pay", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> },
];

// ─── URL Profile Encoding ───────────────────────────────────────────
function encodeProfile(profile) {
  const data = {
    n: profile.name,
    h: profile.handle,
    b: profile.bio,
    t: profile.theme || "midnight",
    e: profile.email || "",
    p: profile.phone || "",
    cal: profile.calendly || "",
    ca: profile.cashapp || "",
    ve: profile.venmo || "",
    pp: profile.paypal || "",
    s: {},
  };
  Object.entries(profile.socials).forEach(([k, v]) => {
    if (v?.trim()) data.s[k] = v;
  });
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

function decodeProfile(hash) {
  try {
    const data = JSON.parse(decodeURIComponent(atob(hash)));
    return {
      name: data.n || "",
      handle: data.h || "",
      bio: data.b || "",
      theme: data.t || "midnight",
      email: data.e || "",
      phone: data.p || "",
      calendly: data.cal || "",
      cashapp: data.ca || "",
      venmo: data.ve || "",
      paypal: data.pp || "",
      socials: data.s || {},
    };
  } catch {
    return null;
  }
}

// ─── vCard ──────────────────────────────────────────────────────────
function downloadVCard(profile) {
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `FN:${profile.name || "LockedIn User"}`];
  if (profile.bio) lines.push(`NOTE:${profile.bio}`);
  if (profile.email) lines.push(`EMAIL:${profile.email}`);
  if (profile.phone) lines.push(`TEL:${profile.phone}`);
  Object.entries(profile.socials).forEach(([p, h]) => {
    if (!h?.trim()) return;
    const c = PLATFORMS[p];
    if (c) lines.push(`URL;type=${c.name}:${c.getProfileUrl(h)}`);
  });
  lines.push("END:VCARD");
  const blob = new Blob([lines.join("\r\n")], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(profile.name || "contact").replace(/\s+/g, "_")}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getAvatarUrl(profile) {
  if (profile.socials.github) return `https://github.com/${profile.socials.github}.png?size=200`;
  if (profile.socials.twitter) return `https://unavatar.io/twitter/${profile.socials.twitter}`;
  if (profile.socials.instagram) return `https://unavatar.io/instagram/${profile.socials.instagram}`;
  return null;
}

// ─── Feed Panel ─────────────────────────────────────────────────────
function FeedPanel({ platform, handle, isActive, onClick, theme }) {
  const config = PLATFORMS[platform];
  const t = THEMES[theme] || THEMES.midnight;
  if (!config || !handle) return null;

  const renderEmbed = () => {
    switch (platform) {
      case "twitter":
        return <div style={{ width: "100%", height: 200, borderRadius: 8, overflow: "hidden", background: "rgba(0,0,0,0.3)" }}><a className="twitter-timeline" data-theme="dark" data-chrome="noheader nofooter noborders transparent" data-tweet-limit="3" href={`https://twitter.com/${handle}`}>Loading...</a></div>;
      case "youtube": {
        const ch = handle.startsWith("@") ? handle.slice(1) : handle;
        return <div style={{ width: "100%", height: 200, borderRadius: 8, overflow: "hidden" }}><iframe src={`https://www.youtube.com/embed?listType=user_uploads&list=${ch}`} style={{ width: "100%", height: "100%", border: "none", borderRadius: 8 }} title="YouTube" /></div>;
      }
      case "github":
        return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <img src={`https://ghchart.rshah.org/${t.accent.replace("#", "")}/${handle}`} alt="contributions" style={{ width: "100%", borderRadius: 8 }} />
          <a href={config.getProfileUrl(handle)} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", background: `${t.accent}15`, border: `1px solid ${t.accent}30`, borderRadius: 8, color: t.accent, fontSize: 12, fontWeight: 600, textDecoration: "none", fontFamily: "'Outfit', sans-serif" }}>View @{handle}</a>
        </div>;
      case "spotify":
        return <div style={{ width: "100%", height: 200, borderRadius: 8, overflow: "hidden" }}><iframe src={`https://open.spotify.com/embed/artist/${handle}?theme=0`} style={{ width: "100%", height: "100%", border: "none", borderRadius: 8 }} title="Spotify" /></div>;
      case "twitch":
        return <div style={{ width: "100%", height: 200, borderRadius: 8, overflow: "hidden" }}><iframe src={`https://player.twitch.tv/?channel=${handle}&parent=${window.location.hostname}&muted=true`} style={{ width: "100%", height: "100%", border: "none", borderRadius: 8 }} title="Twitch" /></div>;
      default:
        return <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 0" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: `${config.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: config.color }}>{config.icon}</div>
          <div><span style={{ color: t.text, fontSize: 14, fontWeight: 600 }}>{config.name}</span><br /><span style={{ color: t.sub, fontSize: 12 }}>{platform === "website" ? handle : `@${handle.replace(/^@/, "")}`}</span></div>
          <a href={config.getProfileUrl(handle)} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "auto", padding: "6px 14px", background: `${config.color}15`, border: `1px solid ${config.color}25`, borderRadius: 8, color: config.color, fontSize: 11, fontWeight: 600, textDecoration: "none", fontFamily: "'Outfit', sans-serif" }}>Visit</a>
        </div>;
    }
  };

  return (
    <div className="feed-panel" onClick={onClick} style={{ background: isActive ? `${config.color}08` : `${t.cardBg}`, border: `1px solid ${isActive ? config.color + "40" : t.border}`, borderRadius: 16, overflow: "hidden", marginBottom: 12, cursor: "pointer", transition: "all 0.3s", boxShadow: isActive ? `0 0 30px ${config.color}10` : "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: `1px solid ${t.border}` }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: config.color }} />
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: config.color }}>{config.icon}<span style={{ fontWeight: 700, fontSize: 12, letterSpacing: 0.5 }}>{config.name}</span></div>
        <span style={{ marginLeft: "auto", fontSize: 11, color: t.sub, fontFamily: "'Space Mono', monospace" }}>{platform === "website" ? handle : `@${handle.replace(/^@/, "")}`}</span>
      </div>
      <div style={{ padding: 12 }}>{renderEmbed()}</div>
    </div>
  );
}

// ─── LANDING PAGE ───────────────────────────────────────────────────
function LandingPage({ onCreateCard, onViewDemo }) {
  return (
    <div style={{ minHeight: "100vh", background: THEMES.midnight.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Outfit', sans-serif", textAlign: "center" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 30px rgba(255,45,120,0.3); } 50% { box-shadow: 0 0 60px rgba(255,45,120,0.5); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .landing-cta:hover { transform: scale(1.05) !important; filter: brightness(1.1); }
        .landing-demo:hover { background: rgba(255,255,255,0.1) !important; }
        .feature-card:hover { transform: translateY(-4px) !important; border-color: rgba(255,45,120,0.3) !important; }
      `}</style>

      <div style={{ animation: "float 4s ease-in-out infinite", marginBottom: 32 }}>
        <div style={{ width: 80, height: 80, borderRadius: 20, background: "rgba(255,45,120,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#ff2d78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: 48, fontWeight: 700, color: "#fff", letterSpacing: -2, margin: 0 }}>LockedIn</h1>
      </div>

      <div style={{ animation: "slideUp 0.6s ease-out 0.2s backwards", maxWidth: 600 }}>
        <p style={{ fontSize: 22, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, marginBottom: 8, fontWeight: 300 }}>
          Not a link page. An <span style={{ color: "#ff2d78", fontWeight: 700 }}>action router</span>.
        </p>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: 40 }}>
          One tap to follow everywhere, save contacts, send DMs, book meetings, or get paid. The future of connecting.
        </p>
      </div>

      <div style={{ animation: "slideUp 0.6s ease-out 0.4s backwards", display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginBottom: 60 }}>
        <button className="landing-cta" onClick={onCreateCard} style={{ padding: "18px 40px", background: "linear-gradient(135deg, #ff2d78, #ff6b35)", border: "none", borderRadius: 16, color: "#fff", fontSize: 18, fontWeight: 700, fontFamily: "'Outfit', sans-serif", cursor: "pointer", transition: "all 0.3s", animation: "glow 3s ease-in-out infinite" }}>
          Create Your Card
        </button>
        <button className="landing-demo" onClick={onViewDemo} style={{ padding: "18px 40px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, color: "rgba(255,255,255,0.8)", fontSize: 18, fontWeight: 600, fontFamily: "'Outfit', sans-serif", cursor: "pointer", transition: "all 0.3s" }}>
          See Demo
        </button>
      </div>

      <div style={{ animation: "slideUp 0.6s ease-out 0.6s backwards", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, maxWidth: 800, width: "100%" }}>
        {[
          { title: "Follow All", desc: "One tap chains follow actions across every platform", icon: "+" },
          { title: "Save Contact", desc: "vCard drops into their phone with all your socials", icon: "\u2193" },
          { title: "Action Modes", desc: "Follow, Connect, DM, Book, or Pay \u2014 they choose", icon: "\u26A1" },
          { title: "NFC Ready", desc: "Write your URL to any NFC sticker \u2014 tap to connect", icon: "\u2022" },
        ].map((f, i) => (
          <div key={i} className="feature-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px 20px", textAlign: "left", transition: "all 0.3s", cursor: "default" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,45,120,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ff2d78", fontWeight: 700, fontSize: 18, marginBottom: 12 }}>{f.icon}</div>
            <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.5 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 60, animation: "slideUp 0.6s ease-out 0.8s backwards" }}>
        <p style={{ color: "rgba(255,255,255,0.15)", fontSize: 12, fontFamily: "'Space Mono', monospace" }}>TAP &bull; SCAN &bull; CONNECT</p>
      </div>
    </div>
  );
}

// ─── EMPTY PROFILE ──────────────────────────────────────────────────
const EMPTY_PROFILE = { name: "", handle: "", bio: "", theme: "midnight", email: "", phone: "", calendly: "", cashapp: "", venmo: "", paypal: "", socials: {} };

const DEMO_PROFILE = { name: "James Dare", handle: "@DareDev256", bio: "AI Software Developer \u2022 Creative Director \u2022 TdotsSolutionsz", theme: "midnight", email: "", phone: "", calendly: "", cashapp: "", venmo: "", paypal: "", socials: { twitter: "TdotsSolutionsz", youtube: "@PassionOS", instagram: "TdotsSolutionsz", github: "DareDev256", website: "www.jamesdare.com" } };

const QR_SIZE = 140;
const BASE_URL = "https://tapin-bay.vercel.app";

// ─── Main App ───────────────────────────────────────────────────────
export default function LockedIn() {
  const [page, setPage] = useState("loading"); // loading | landing | editor | card
  const [profile, setProfile] = useState({ ...EMPTY_PROFILE });
  const [activeMode, setActiveMode] = useState("follow");
  const [activeFeed, setActiveFeed] = useState(null);
  const [followingState, setFollowingState] = useState({});
  const [followAllTriggered, setFollowAllTriggered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contactSaved, setContactSaved] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // On load: check URL hash for encoded profile
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const decoded = decodeProfile(hash);
      if (decoded) {
        setProfile(decoded);
        setPage("card");
        // Set document title
        document.title = `${decoded.name} — LockedIn`;
        return;
      }
    }
    setPage("landing");
  }, []);

  // Load Twitter widgets when on card page
  useEffect(() => {
    if (page === "card") {
      const s = document.createElement("script");
      s.src = "https://platform.twitter.com/widgets.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, [page]);

  useEffect(() => {
    if (activeFeed === "twitter" && window.twttr?.widgets) {
      setTimeout(() => window.twttr.widgets.load(), 300);
    }
  }, [activeFeed]);

  const theme = THEMES[profile.theme] || THEMES.midnight;
  const avatarUrl = getAvatarUrl(profile);
  const activeSocials = Object.entries(profile.socials).filter(([, v]) => v?.trim());
  const dmPlatforms = activeSocials.filter(([p]) => PLATFORMS[p]?.supportsDm);

  const shareUrl = useMemo(() => {
    if (!profile.name) return BASE_URL;
    return `${BASE_URL}#${encodeProfile(profile)}`;
  }, [profile]);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${QR_SIZE}x${QR_SIZE}&data=${encodeURIComponent(shareUrl)}&bgcolor=${theme === THEMES.minimal ? "fafafa" : "0a0a12"}&color=${theme === THEMES.minimal ? "18181b" : "ffffff"}&format=svg`;

  const handleFollowOne = useCallback((platform, handle) => {
    const c = PLATFORMS[platform];
    if (!c) return;
    window.open(platform === "twitter" || platform === "youtube" ? c.getFollowUrl(handle) : c.getProfileUrl(handle), "_blank", "noopener");
    setFollowingState((p) => ({ ...p, [platform]: true }));
  }, []);

  const handleFollowAll = useCallback(() => {
    setFollowAllTriggered(true);
    activeSocials.forEach(([platform, handle], i) => {
      setTimeout(() => {
        const c = PLATFORMS[platform];
        if (!c) return;
        window.open(platform === "twitter" || platform === "youtube" ? c.getFollowUrl(handle) : c.getProfileUrl(handle), "_blank", "noopener");
        setFollowingState((p) => ({ ...p, [platform]: true }));
      }, i * 600);
    });
  }, [activeSocials]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(shareUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }, [shareUrl]);

  const handleSaveContact = useCallback(() => {
    downloadVCard(profile);
    setContactSaved(true);
    setTimeout(() => setContactSaved(false), 3000);
  }, [profile]);

  const generateShareLink = useCallback(() => {
    const url = `${BASE_URL}#${encodeProfile(profile)}`;
    window.history.replaceState(null, "", `#${encodeProfile(profile)}`);
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }, [profile]);

  const availableModes = ACTION_MODES.filter((m) => {
    if (m.id === "follow") return activeSocials.length > 0;
    if (m.id === "connect") return true;
    if (m.id === "dm") return dmPlatforms.length > 0;
    if (m.id === "book") return !!profile.calendly;
    if (m.id === "pay") return !!(profile.cashapp || profile.venmo || profile.paypal);
    return true;
  });

  // ─── LOADING ────────────────────────────────────────────────
  if (page === "loading") return <div style={{ minHeight: "100vh", background: "#06060c", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 40, height: 40, border: "3px solid rgba(255,45,120,0.2)", borderTopColor: "#ff2d78", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>;

  // ─── LANDING PAGE ───────────────────────────────────────────
  if (page === "landing") return <LandingPage onCreateCard={() => { setProfile({ ...EMPTY_PROFILE }); setPage("editor"); }} onViewDemo={() => { setProfile({ ...DEMO_PROFILE }); setPage("card"); }} />;

  // ─── GLOBAL STYLES ──────────────────────────────────────────
  const isMinimal = profile.theme === "minimal";
  const textColor = theme.text;
  const subColor = theme.sub;
  const accent = theme.accent;

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse-ring { 0% { transform: scale(0.95); } 50% { transform: scale(1.05); } 100% { transform: scale(0.95); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px ${accent}44; } 50% { box-shadow: 0 0 40px ${accent}88; } }
        @keyframes fadeSwitch { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounceIn { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes livePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .dashboard { animation: slideUp 0.6s ease-out; }
        .card-section { animation: slideUp 0.5s ease-out 0.1s backwards; }
        .feed-section { animation: slideIn 0.6s ease-out 0.2s backwards; }
        .follow-btn:hover { transform: translateY(-2px) !important; filter: brightness(1.2); }
        .social-row { animation: slideUp 0.5s ease-out backwards; }
        .follow-all-btn { animation: glow 2s ease-in-out infinite; }
        .follow-all-btn:hover { transform: scale(1.03) !important; }
        .mode-pill:hover { transform: translateY(-1px); filter: brightness(1.1); }
        .mode-content { animation: fadeSwitch 0.35s ease-out; }
        .avatar-bounce { animation: bounceIn 0.8s ease-out, float 4s ease-in-out 0.8s infinite; }
        .feed-panel:hover { transform: translateY(-2px); }
        .live-dot { animation: livePulse 1.5s ease-in-out infinite; }
        .action-btn:hover { transform: translateY(-2px) !important; filter: brightness(1.15); }
        .edit-input { width: 100%; background: ${isMinimal ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)"}; border: 1px solid ${theme.border}; border-radius: 8px; padding: 10px 14px; color: ${textColor}; font-family: 'Outfit', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .edit-input:focus { border-color: ${accent}; }
        .edit-input::placeholder { color: ${subColor}; }
        .feed-scroll::-webkit-scrollbar { width: 4px; }
        .feed-scroll::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 4px; }
        .theme-btn:hover { transform: scale(1.15) !important; }
        @media (max-width: 900px) { .dashboard-layout { flex-direction: column !important; } .feed-sidebar { max-height: 50vh !important; width: 100% !important; min-width: unset !important; } .card-wrap { max-width: 100% !important; } }
      `}</style>

      <div className="dashboard" style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 20px 40px" }}>
        {/* TOP BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0 24px", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 20, color: textColor }}>LockedIn</span>
            {page === "card" && <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8, padding: "4px 10px", background: `${accent}12`, borderRadius: 20, color: accent }}><div className="live-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: accent }} /><span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5 }}>LIVE</span></div>}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {page === "card" && (
              <button onClick={() => setPage("editor")} style={{ display: "flex", alignItems: "center", gap: 6, background: `${accent}15`, border: `1px solid ${accent}30`, borderRadius: 8, padding: "8px 14px", color: accent, fontSize: 13, fontFamily: "'Outfit', sans-serif", cursor: "pointer", fontWeight: 600 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                Edit
              </button>
            )}
            {page === "editor" && (
              <button onClick={() => { if (profile.name) setPage("card"); }} style={{ display: "flex", alignItems: "center", gap: 6, background: profile.name ? `${accent}15` : `${accent}08`, border: `1px solid ${profile.name ? accent + "30" : theme.border}`, borderRadius: 8, padding: "8px 14px", color: profile.name ? accent : subColor, fontSize: 13, fontFamily: "'Outfit', sans-serif", cursor: profile.name ? "pointer" : "default", fontWeight: 600, opacity: profile.name ? 1 : 0.5 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                Preview
              </button>
            )}
            <button onClick={() => { setPage("landing"); setProfile({ ...EMPTY_PROFILE }); }} style={{ background: "none", border: `1px solid ${theme.border}`, borderRadius: 8, padding: "8px 14px", color: subColor, fontSize: 13, fontFamily: "'Outfit', sans-serif", cursor: "pointer" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            </button>
          </div>
        </div>

        {/* ─── EDITOR PAGE ─── */}
        {page === "editor" && (
          <div style={{ maxWidth: 520, margin: "0 auto", animation: "slideUp 0.5s ease-out" }}>
            <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: 24, padding: "32px 28px", backdropFilter: "blur(20px)" }}>
              <h2 style={{ color: textColor, fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Create Your Card</h2>
              <p style={{ color: subColor, fontSize: 14, marginBottom: 28 }}>Fill in your details. Get a shareable link instantly.</p>

              {/* Theme picker */}
              <p style={{ fontSize: 11, fontWeight: 700, color: subColor, letterSpacing: 2, marginBottom: 12 }}>THEME</p>
              <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
                {Object.entries(THEMES).map(([key, t]) => (
                  <button key={key} className="theme-btn" onClick={() => setProfile({ ...profile, theme: key })} style={{ width: 40, height: 40, borderRadius: 12, background: t.accent, border: profile.theme === key ? `3px solid ${textColor}` : "3px solid transparent", cursor: "pointer", transition: "all 0.2s", position: "relative" }}>
                    {profile.theme === key && <div style={{ position: "absolute", inset: -1, borderRadius: 14, border: `2px solid ${t.accent}`, opacity: 0.5 }} />}
                  </button>
                ))}
              </div>

              {/* Profile fields */}
              <p style={{ fontSize: 11, fontWeight: 700, color: subColor, letterSpacing: 2, marginBottom: 12 }}>PROFILE</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                <input className="edit-input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Your Name" style={{ fontSize: 18, fontWeight: 700 }} />
                <input className="edit-input" value={profile.handle} onChange={(e) => setProfile({ ...profile, handle: e.target.value })} placeholder="@handle" />
                <input className="edit-input" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Short bio" />
              </div>

              {/* Socials */}
              <p style={{ fontSize: 11, fontWeight: 700, color: subColor, letterSpacing: 2, marginBottom: 12 }}>SOCIALS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                {Object.entries(PLATFORMS).map(([key, config]) => (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${config.color}12`, display: "flex", alignItems: "center", justifyContent: "center", color: config.color, flexShrink: 0 }}>{config.icon}</div>
                    <input className="edit-input" value={profile.socials[key] || ""} onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, [key]: e.target.value } })} placeholder={config.placeholder} style={{ flex: 1 }} />
                  </div>
                ))}
              </div>

              {/* Contact & Payments */}
              <p style={{ fontSize: 11, fontWeight: 700, color: subColor, letterSpacing: 2, marginBottom: 12 }}>CONTACT & PAYMENTS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
                {[
                  { key: "email", ph: "Email" }, { key: "phone", ph: "Phone" },
                  { key: "calendly", ph: "Calendly / Cal.com URL" },
                  { key: "cashapp", ph: "Cash App $cashtag" }, { key: "venmo", ph: "Venmo username" }, { key: "paypal", ph: "PayPal.me handle" },
                ].map(({ key, ph }) => (
                  <input key={key} className="edit-input" value={profile[key]} onChange={(e) => setProfile({ ...profile, [key]: e.target.value })} placeholder={ph} />
                ))}
              </div>

              {/* Generate link */}
              <button className="action-btn" onClick={() => { generateShareLink(); setPage("card"); }} disabled={!profile.name} style={{ width: "100%", padding: "16px", background: profile.name ? `linear-gradient(135deg, ${accent}, ${theme.accent2})` : theme.border, border: "none", borderRadius: 14, color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: "'Outfit', sans-serif", cursor: profile.name ? "pointer" : "default", transition: "all 0.3s", opacity: profile.name ? 1 : 0.5 }}>
                {copied ? "Link Copied! \u2713" : "Generate & Copy Link"}
              </button>
            </div>
          </div>
        )}

        {/* ─── CARD VIEW (DASHBOARD) ─── */}
        {page === "card" && (
          <div className="dashboard-layout" style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
            {/* LEFT: FEEDS */}
            <div className="feed-section feed-sidebar feed-scroll" style={{ flex: 1, minWidth: 320, maxWidth: 480, maxHeight: "calc(100vh - 120px)", overflowY: "auto", paddingRight: 8 }}>
              <div style={{ marginBottom: 12, paddingLeft: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: subColor, letterSpacing: 2 }}>LIVE FEEDS</span>
              </div>
              {activeSocials.map(([platform, handle]) => (
                <FeedPanel key={platform} platform={platform} handle={handle} isActive={activeFeed === platform} onClick={() => setActiveFeed(activeFeed === platform ? null : platform)} theme={profile.theme} />
              ))}
            </div>

            {/* RIGHT: CARD */}
            <div className="card-section card-wrap" style={{ flex: "0 0 420px", position: "sticky", top: 20, maxWidth: 420 }}>
              <div style={{ background: theme.cardBg, backdropFilter: "blur(24px)", border: `1px solid ${theme.border}`, borderRadius: 24, padding: "28px 24px", overflow: "hidden" }}>
                {/* Profile */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
                  <div className="avatar-bounce" style={{ width: 96, height: 96, borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, ${theme.accent2}, ${accent})`, backgroundSize: "300% 300%", animation: "shimmer 4s ease-in-out infinite", padding: 3, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {avatarUrl && !avatarError ? (
                      <img src={avatarUrl} alt={profile.name} onLoad={() => setAvatarLoaded(true)} onError={() => setAvatarError(true)} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", opacity: avatarLoaded ? 1 : 0, transition: "opacity 0.4s" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: isMinimal ? "#fafafa" : "#14121f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 800, color: accent, fontFamily: "'Space Mono', monospace" }}>
                        {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
                      </div>
                    )}
                  </div>
                  <h1 style={{ fontSize: 24, fontWeight: 800, color: textColor, letterSpacing: -0.5 }}>{profile.name}</h1>
                  <p style={{ fontSize: 13, color: subColor, fontFamily: "'Space Mono', monospace", marginTop: 4 }}>{profile.handle}</p>
                  <p style={{ fontSize: 13, color: subColor, marginTop: 8, textAlign: "center", lineHeight: 1.5 }}>{profile.bio}</p>
                </div>

                {/* Action mode selector */}
                {availableModes.length > 1 && (
                  <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                    {availableModes.map((m) => (
                      <button key={m.id} className="mode-pill" onClick={() => { setActiveMode(m.id); setFollowAllTriggered(false); setFollowingState({}); }}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "8px 12px", borderRadius: 12, border: `1px solid ${activeMode === m.id ? accent + "55" : theme.border}`, cursor: "pointer", transition: "all 0.25s", fontFamily: "'Outfit', sans-serif", minWidth: 52, background: activeMode === m.id ? `${accent}18` : "transparent", color: activeMode === m.id ? accent : subColor }}>
                        {m.icon}<span style={{ fontSize: 10, fontWeight: 600, marginTop: 2 }}>{m.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Mode content */}
                <div className="mode-content" key={activeMode} style={{ minHeight: 80 }}>
                  {activeMode === "follow" && activeSocials.length > 0 && (
                    <>
                      <button className="follow-all-btn" style={{ width: "100%", padding: "14px 20px", background: followAllTriggered ? "linear-gradient(135deg, #1DB954, #1ed760)" : `linear-gradient(135deg, ${accent}, ${theme.accent2})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "'Outfit', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", marginBottom: 4, animation: followAllTriggered ? "none" : undefined }} onClick={handleFollowAll} disabled={followAllTriggered}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 8 }}>{followAllTriggered ? <polyline points="20 6 9 17 4 12" /> : <><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></>}</svg>
                        {followAllTriggered ? `Opened ${activeSocials.length} profiles` : `Follow All (${activeSocials.length})`}
                      </button>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "10px 0" }}><div style={{ flex: 1, height: 1, background: theme.border }} /><span style={{ fontSize: 10, color: subColor, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>or individually</span><div style={{ flex: 1, height: 1, background: theme.border }} /></div>
                      {activeSocials.map(([platform, handle], i) => {
                        const c = PLATFORMS[platform];
                        const followed = followingState[platform];
                        return (
                          <div key={platform} className="social-row" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: isMinimal ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.025)", borderRadius: 12, border: `1px solid ${theme.border}`, marginBottom: 4, animationDelay: `${i * 0.08}s` }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${c.color}12`, display: "flex", alignItems: "center", justifyContent: "center", color: c.color }}>{c.icon}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: textColor }}>{c.name}</span><br />
                              <span style={{ fontSize: 11, color: subColor, fontFamily: "'Space Mono', monospace" }}>{platform === "website" ? handle : handle.startsWith("@") ? handle : `@${handle}`}</span>
                            </div>
                            <button className="follow-btn" onClick={() => handleFollowOne(platform, handle)} style={{ padding: "7px 16px", background: followed ? "rgba(29,185,84,0.15)" : `${accent}15`, border: `1px solid ${followed ? "rgba(29,185,84,0.3)" : accent + "25"}`, borderRadius: 8, color: followed ? "#1DB954" : accent, fontSize: 12, fontWeight: 600, fontFamily: "'Outfit', sans-serif", cursor: "pointer", transition: "all 0.2s" }}>
                              {followed ? "Opened \u2713" : "Follow"}
                            </button>
                          </div>
                        );
                      })}
                    </>
                  )}
                  {activeMode === "connect" && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0" }}>
                      <p style={{ fontSize: 14, color: subColor, textAlign: "center", marginBottom: 16 }}>Save <strong style={{ color: textColor }}>{profile.name}</strong> to your contacts with all socials.</p>
                      <button className="action-btn" onClick={handleSaveContact} style={{ padding: "14px 28px", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, fontFamily: "'Outfit', sans-serif", cursor: "pointer", transition: "all 0.3s", background: contactSaved ? "linear-gradient(135deg, #1DB954, #1ed760)" : "linear-gradient(135deg, #64ffda, #00b4d8)", color: contactSaved ? "#fff" : "#0a0a12" }}>
                        {contactSaved ? "\u2713 Contact Saved" : "Save Contact"}
                      </button>
                      <p style={{ fontSize: 11, color: subColor, marginTop: 10, opacity: 0.6 }}>Opens native "Add Contact" on mobile</p>
                    </div>
                  )}
                  {activeMode === "dm" && dmPlatforms.map(([platform, handle]) => {
                    const c = PLATFORMS[platform];
                    return <button key={platform} className="action-btn" onClick={() => window.open(c.getDmUrl(handle), "_blank", "noopener")} style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "12px 16px", background: isMinimal ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.025)", border: `1px solid ${theme.border}`, borderRadius: 12, cursor: "pointer", fontFamily: "'Outfit', sans-serif", marginBottom: 8 }}><div style={{ width: 36, height: 36, borderRadius: 10, background: `${c.color}12`, display: "flex", alignItems: "center", justifyContent: "center", color: c.color }}>{c.icon}</div><span style={{ fontWeight: 600, color: textColor }}>DM on {c.name}</span></button>;
                  })}
                  {activeMode === "book" && profile.calendly && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0" }}>
                      <button className="action-btn" onClick={() => window.open(profile.calendly.startsWith("http") ? profile.calendly : `https://${profile.calendly}`, "_blank")} style={{ padding: "14px 28px", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, fontFamily: "'Outfit', sans-serif", cursor: "pointer", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#0a0a12" }}>Open Calendar</button>
                    </div>
                  )}
                  {activeMode === "pay" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {profile.cashapp && <button className="action-btn" onClick={() => window.open(`https://cash.app/$${profile.cashapp}`, "_blank")} style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "12px 16px", background: isMinimal ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.025)", border: `1px solid ${theme.border}`, borderRadius: 12, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}><span style={{ fontWeight: 600, color: "#34d399" }}>Cash App &mdash; ${profile.cashapp}</span></button>}
                      {profile.venmo && <button className="action-btn" onClick={() => window.open(`https://venmo.com/${profile.venmo}`, "_blank")} style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "12px 16px", background: isMinimal ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.025)", border: `1px solid ${theme.border}`, borderRadius: 12, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}><span style={{ fontWeight: 600, color: "#008CFF" }}>Venmo &mdash; @{profile.venmo}</span></button>}
                      {profile.paypal && <button className="action-btn" onClick={() => window.open(`https://paypal.me/${profile.paypal}`, "_blank")} style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "12px 16px", background: isMinimal ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.025)", border: `1px solid ${theme.border}`, borderRadius: 12, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}><span style={{ fontWeight: 600, color: "#00457C" }}>PayPal &mdash; @{profile.paypal}</span></button>}
                    </div>
                  )}
                </div>

                {/* QR + Share */}
                {activeSocials.length > 0 && (
                  <div style={{ marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "10px 0" }}><div style={{ flex: 1, height: 1, background: theme.border }} /><span style={{ fontSize: 10, color: subColor, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>share your LockedIn</span><div style={{ flex: 1, height: 1, background: theme.border }} /></div>
                    <div style={{ padding: 10, background: isMinimal ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)", borderRadius: 14, border: `1px solid ${theme.border}`, marginBottom: 12 }}>
                      <img src={qrUrl} alt="QR Code" style={{ width: QR_SIZE, height: QR_SIZE, borderRadius: 8 }} />
                    </div>
                    <button className="action-btn" onClick={handleCopy} style={{ padding: "9px 24px", background: `${accent}12`, border: `1px solid ${accent}25`, borderRadius: 10, color: accent, fontSize: 12, fontWeight: 600, fontFamily: "'Outfit', sans-serif", cursor: "pointer" }}>
                      {copied ? "Link Copied! \u2713" : "Copy Link"}
                    </button>
                  </div>
                )}

                <div style={{ marginTop: 24, textAlign: "center", lineHeight: 2.2 }}>
                  <span style={{ fontSize: 10, color: subColor, letterSpacing: 1.5, opacity: 0.5 }}>TAP &bull; SCAN &bull; CONNECT</span><br />
                  <span style={{ fontSize: 12, color: subColor, fontFamily: "'Space Mono', monospace" }}>
                    Powered by <span style={{ color: accent, fontWeight: 700 }}>LockedIn</span>
                    <span style={{ marginLeft: 8, padding: "2px 6px", background: `${accent}12`, borderRadius: 4, fontSize: 9, color: accent, letterSpacing: 1 }}>NFC READY</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
