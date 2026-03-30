import { useState, useEffect, useCallback, useRef } from "react";

// ─── Platform Config ────────────────────────────────────────────────
const PLATFORMS = {
  twitter: {
    name: "X / Twitter",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    getFollowUrl: (h) => `https://twitter.com/intent/follow?screen_name=${h}`,
    getDeepLink: (h) => `twitter://user?screen_name=${h}`,
    getProfileUrl: (h) => `https://twitter.com/${h}`,
    getDmUrl: (h) => `https://twitter.com/messages/compose?recipient_id=${h}`,
    getDmDeepLink: (h) => `twitter://messages/compose?recipient_id=${h}`,
    supportsDm: true,
    placeholder: "handle (no @)",
    color: "#fff",
  },
  youtube: {
    name: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    getFollowUrl: (h) => `https://www.youtube.com/${h}?sub_confirmation=1`,
    getDeepLink: (h) => `vnd.youtube://www.youtube.com/${h}`,
    getProfileUrl: (h) => `https://www.youtube.com/${h}`,
    supportsDm: false,
    placeholder: "@channel or /c/name",
    color: "#FF0033",
  },
  instagram: {
    name: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
    getFollowUrl: (h) => `instagram://user?username=${h}`,
    getDeepLink: (h) => `instagram://user?username=${h}`,
    getProfileUrl: (h) => `https://www.instagram.com/${h}/`,
    getDmUrl: () => `instagram://direct-new`,
    getDmDeepLink: () => `instagram://direct-new`,
    supportsDm: true,
    placeholder: "username",
    color: "#E4405F",
  },
  tiktok: {
    name: "TikTok",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    getFollowUrl: (h) => `snssdk1233://user/profile/${h}`,
    getDeepLink: (h) => `snssdk1233://user/profile/${h}`,
    getProfileUrl: (h) => `https://www.tiktok.com/@${h}`,
    supportsDm: false,
    placeholder: "username",
    color: "#00f2ea",
  },
  spotify: {
    name: "Spotify",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
    getFollowUrl: (h) => `spotify:artist:${h}`,
    getDeepLink: (h) => `spotify:artist:${h}`,
    getProfileUrl: (h) => `https://open.spotify.com/artist/${h}`,
    supportsDm: false,
    placeholder: "artist ID",
    color: "#1DB954",
  },
  twitch: {
    name: "Twitch",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
      </svg>
    ),
    getFollowUrl: (h) => `https://www.twitch.tv/${h}`,
    getDeepLink: (h) => `twitch://stream/${h}`,
    getProfileUrl: (h) => `https://www.twitch.tv/${h}`,
    supportsDm: false,
    placeholder: "username",
    color: "#9146FF",
  },
  website: {
    name: "Website",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
    getFollowUrl: (h) => h.startsWith("http") ? h : `https://${h}`,
    getDeepLink: (h) => h.startsWith("http") ? h : `https://${h}`,
    getProfileUrl: (h) => h.startsWith("http") ? h : `https://${h}`,
    supportsDm: false,
    placeholder: "yoursite.com",
    color: "#64ffda",
  },
};

// ─── Action Modes ───────────────────────────────────────────────────
const ACTION_MODES = [
  {
    id: "follow",
    label: "Follow",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
    ),
    color: "#ff2d78",
  },
  {
    id: "connect",
    label: "Connect",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M7 8h10M7 12h6M7 16h8" />
      </svg>
    ),
    color: "#64ffda",
  },
  {
    id: "dm",
    label: "DM",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: "#a78bfa",
  },
  {
    id: "book",
    label: "Book",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    color: "#fbbf24",
  },
  {
    id: "pay",
    label: "Pay",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    color: "#34d399",
  },
];

// ─── Deep Link Helper ───────────────────────────────────────────────
function tryDeepLink(deepLink, fallbackUrl) {
  // On desktop, just open the web URL
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (!isMobile) {
    window.open(fallbackUrl, "_blank", "noopener");
    return;
  }
  // On mobile, try native app deep link first, fallback to web
  const start = Date.now();
  window.location.href = deepLink;
  setTimeout(() => {
    // If we're still here after 1.5s, the deep link didn't fire — use web fallback
    if (Date.now() - start < 2000) {
      window.open(fallbackUrl, "_blank", "noopener");
    }
  }, 1500);
}

// ─── vCard Generator ────────────────────────────────────────────────
function generateVCard(profile) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${profile.name || "LockedIn User"}`,
  ];
  if (profile.bio) lines.push(`NOTE:${profile.bio}`);
  if (profile.email) lines.push(`EMAIL:${profile.email}`);
  if (profile.phone) lines.push(`TEL:${profile.phone}`);

  Object.entries(profile.socials).forEach(([platform, handle]) => {
    if (!handle || !handle.trim()) return;
    const config = PLATFORMS[platform];
    if (config) {
      lines.push(`URL;type=${config.name}:${config.getProfileUrl(handle)}`);
    }
  });

  lines.push("END:VCARD");
  return lines.join("\r\n");
}

function downloadVCard(profile) {
  const vcard = generateVCard(profile);
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(profile.name || "contact").replace(/\s+/g, "_")}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Default Profile ────────────────────────────────────────────────
const DEFAULT_PROFILE = {
  name: "James Dare",
  handle: "@DareDev256",
  bio: "AI Software Developer \u2022 Creative Director \u2022 TdotsSolutionsz",
  email: "",
  phone: "",
  calendly: "",
  cashapp: "",
  venmo: "",
  paypal: "",
  socials: {
    twitter: "TdotsSolutionsz",
    youtube: "@PassionOS",
    instagram: "TdotsSolutionsz",
    website: "www.jamesdare.com",
  },
};

const QR_SIZE = 160;

// ─── Main Component ─────────────────────────────────────────────────
export default function LockedIn() {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({ ...DEFAULT_PROFILE, socials: { ...DEFAULT_PROFILE.socials } });
  const [activeMode, setActiveMode] = useState("follow");
  const [followingState, setFollowingState] = useState({});
  const [followAllTriggered, setFollowAllTriggered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contactSaved, setContactSaved] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const modeContentRef = useRef(null);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const activeSocials = Object.entries(profile.socials).filter(
    ([, val]) => val && val.trim() !== ""
  );

  const dmPlatforms = activeSocials.filter(([p]) => PLATFORMS[p]?.supportsDm);

  const handleFollowOne = useCallback((platform, handle) => {
    const config = PLATFORMS[platform];
    if (!config) return;
    if (platform === "twitter" || platform === "youtube") {
      window.open(config.getFollowUrl(handle), "_blank", "noopener");
    } else {
      tryDeepLink(config.getDeepLink(handle), config.getProfileUrl(handle));
    }
    setFollowingState((prev) => ({ ...prev, [platform]: true }));
  }, []);

  const handleFollowAll = useCallback(() => {
    setFollowAllTriggered(true);
    activeSocials.forEach(([platform, handle], i) => {
      setTimeout(() => {
        const config = PLATFORMS[platform];
        if (!config) return;
        if (platform === "twitter" || platform === "youtube") {
          window.open(config.getFollowUrl(handle), "_blank", "noopener");
        } else {
          window.open(config.getProfileUrl(handle), "_blank", "noopener");
        }
        setFollowingState((prev) => ({ ...prev, [platform]: true }));
      }, i * 600);
    });
  }, [activeSocials]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [shareUrl]);

  const handleSaveContact = useCallback(() => {
    downloadVCard(profile);
    setContactSaved(true);
    setTimeout(() => setContactSaved(false), 3000);
  }, [profile]);

  const handleDm = useCallback((platform, handle) => {
    const config = PLATFORMS[platform];
    if (!config?.getDmUrl) return;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && config.getDmDeepLink) {
      window.location.href = config.getDmDeepLink(handle);
    } else {
      window.open(config.getDmUrl(handle), "_blank", "noopener");
    }
  }, []);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${QR_SIZE}x${QR_SIZE}&data=${encodeURIComponent(shareUrl)}&bgcolor=0a0a12&color=ffffff&format=svg`;

  // Available modes based on what the user has configured
  const availableModes = ACTION_MODES.filter((m) => {
    if (m.id === "follow") return activeSocials.length > 0;
    if (m.id === "connect") return true;
    if (m.id === "dm") return dmPlatforms.length > 0;
    if (m.id === "book") return !!profile.calendly;
    if (m.id === "pay") return !!(profile.cashapp || profile.venmo || profile.paypal);
    return true;
  });

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse-ring { 0% { transform: scale(0.95); opacity: 0.7; } 50% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.7; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(255, 45, 120, 0.3); } 50% { box-shadow: 0 0 40px rgba(255, 45, 120, 0.6); } }
        @keyframes fadeSwitch { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .tapin-card { animation: slideUp 0.6s ease-out; }
        .follow-btn:hover { transform: translateY(-2px) !important; filter: brightness(1.2); }
        .follow-btn:active { transform: translateY(0) !important; }
        .social-row { animation: slideUp 0.5s ease-out backwards; }
        .follow-all-btn { animation: glow 2s ease-in-out infinite; }
        .follow-all-btn:hover { transform: scale(1.03) !important; }
        .mode-toggle:hover { background: rgba(255,255,255,0.15) !important; }
        .mode-pill:hover { transform: translateY(-1px); filter: brightness(1.1); }
        .mode-content { animation: fadeSwitch 0.35s ease-out; }
        .edit-input {
          width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px; padding: 10px 14px; color: #fff; font-family: 'Outfit', sans-serif;
          font-size: 14px; outline: none; transition: border-color 0.2s;
        }
        .edit-input:focus { border-color: #ff2d78; }
        .edit-input::placeholder { color: rgba(255,255,255,0.3); }
        .action-btn:hover { transform: translateY(-2px) !important; filter: brightness(1.15); }
        .action-btn:active { transform: translateY(0) !important; }
      `}</style>

      <div style={styles.container} className="tapin-card">
        {/* ── Header ── */}
        <div style={styles.header}>
          <div style={styles.logoRow}>
            <div style={styles.logoMark}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#ff2d78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={styles.logoText}>LockedIn</span>
          </div>
          <button className="mode-toggle" style={styles.modeToggle} onClick={() => { setEditMode(!editMode); setActiveMode("follow"); }}>
            {editMode ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            )}
            <span style={{ marginLeft: 6 }}>{editMode ? "Preview" : "Edit"}</span>
          </button>
        </div>

        {/* ── Profile ── */}
        <div style={styles.profileSection}>
          <div style={styles.avatarRing}>
            <div style={styles.avatar}>
              {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
            </div>
          </div>
          {editMode ? (
            <div style={styles.editFields}>
              <input className="edit-input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Display Name" style={{ fontSize: 18, fontWeight: 700, textAlign: "center" }} />
              <input className="edit-input" value={profile.handle} onChange={(e) => setProfile({ ...profile, handle: e.target.value })} placeholder="@handle" style={{ textAlign: "center", marginTop: 8 }} />
              <input className="edit-input" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Short bio" style={{ textAlign: "center", marginTop: 8 }} />
            </div>
          ) : (
            <>
              <h1 style={styles.name}>{profile.name || "Your Name"}</h1>
              <p style={styles.handle}>{profile.handle || "@handle"}</p>
              <p style={styles.bio}>{profile.bio || "Your bio here"}</p>
            </>
          )}
        </div>

        {/* ── Edit Mode ── */}
        {editMode && (
          <div style={styles.editSocials}>
            <p style={styles.sectionLabel}>SOCIAL PROFILES</p>
            {Object.entries(PLATFORMS).map(([key, config]) => (
              <div key={key} style={styles.editSocialRow}>
                <div style={{ ...styles.platformIcon, color: config.color }}>{config.icon}</div>
                <input className="edit-input" value={profile.socials[key] || ""} onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, [key]: e.target.value } })} placeholder={config.placeholder} style={{ flex: 1 }} />
              </div>
            ))}

            <p style={{ ...styles.sectionLabel, marginTop: 20 }}>CONTACT INFO</p>
            <div style={styles.editSocialRow}>
              <div style={{ ...styles.platformIcon, color: "#a78bfa" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <input className="edit-input" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="Email" style={{ flex: 1 }} />
            </div>
            <div style={styles.editSocialRow}>
              <div style={{ ...styles.platformIcon, color: "#a78bfa" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <input className="edit-input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="Phone" style={{ flex: 1 }} />
            </div>

            <p style={{ ...styles.sectionLabel, marginTop: 20 }}>BOOKING & PAYMENTS</p>
            <div style={styles.editSocialRow}>
              <div style={{ ...styles.platformIcon, color: "#fbbf24" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <input className="edit-input" value={profile.calendly} onChange={(e) => setProfile({ ...profile, calendly: e.target.value })} placeholder="Calendly or Cal.com URL" style={{ flex: 1 }} />
            </div>
            <div style={styles.editSocialRow}>
              <div style={{ ...styles.platformIcon, color: "#34d399" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <input className="edit-input" value={profile.cashapp} onChange={(e) => setProfile({ ...profile, cashapp: e.target.value })} placeholder="Cash App $cashtag" style={{ flex: 1 }} />
            </div>
            <div style={styles.editSocialRow}>
              <div style={{ ...styles.platformIcon, color: "#34d399" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <input className="edit-input" value={profile.venmo} onChange={(e) => setProfile({ ...profile, venmo: e.target.value })} placeholder="Venmo username" style={{ flex: 1 }} />
            </div>
            <div style={styles.editSocialRow}>
              <div style={{ ...styles.platformIcon, color: "#34d399" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <input className="edit-input" value={profile.paypal} onChange={(e) => setProfile({ ...profile, paypal: e.target.value })} placeholder="PayPal.me handle" style={{ flex: 1 }} />
            </div>
          </div>
        )}

        {/* ── View Mode: Action Picker + Content ── */}
        {!editMode && (
          <>
            {/* Action Mode Selector */}
            {availableModes.length > 1 && (
              <div style={styles.modeSelectorRow}>
                {availableModes.map((m) => (
                  <button
                    key={m.id}
                    className="mode-pill"
                    onClick={() => { setActiveMode(m.id); setFollowAllTriggered(false); setFollowingState({}); }}
                    style={{
                      ...styles.modePill,
                      background: activeMode === m.id ? `${m.color}22` : "rgba(255,255,255,0.04)",
                      borderColor: activeMode === m.id ? `${m.color}55` : "rgba(255,255,255,0.08)",
                      color: activeMode === m.id ? m.color : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {m.icon}
                    <span style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>{m.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Mode Content */}
            <div ref={modeContentRef} className="mode-content" key={activeMode} style={styles.modeContent}>

              {/* ── FOLLOW MODE ── */}
              {activeMode === "follow" && activeSocials.length > 0 && (
                <>
                  <button
                    className="follow-all-btn"
                    style={{ ...styles.followAllBtn, ...(followAllTriggered ? styles.followAllDone : {}) }}
                    onClick={handleFollowAll}
                    disabled={followAllTriggered}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 8 }}>
                      {followAllTriggered ? <polyline points="20 6 9 17 4 12" /> : (
                        <><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></>
                      )}
                    </svg>
                    {followAllTriggered ? `Opened ${activeSocials.length} profiles` : `Follow All (${activeSocials.length})`}
                  </button>

                  <div style={styles.dividerRow}>
                    <div style={styles.dividerLine} />
                    <span style={styles.dividerText}>or pick individually</span>
                    <div style={styles.dividerLine} />
                  </div>

                  {activeSocials.map(([platform, handle], i) => {
                    const config = PLATFORMS[platform];
                    const followed = followingState[platform];
                    return (
                      <div key={platform} className="social-row" style={{ ...styles.socialRow, animationDelay: `${i * 0.08}s` }}>
                        <div style={{ ...styles.platformIcon, color: config.color }}>{config.icon}</div>
                        <div style={styles.socialInfo}>
                          <span style={styles.platformName}>{config.name}</span>
                          <span style={styles.socialHandle}>{platform === "website" ? handle : handle.startsWith("@") ? handle : `@${handle}`}</span>
                        </div>
                        <button className="follow-btn" style={{ ...styles.followBtn, ...(followed ? styles.followedBtn : {}) }} onClick={() => handleFollowOne(platform, handle)}>
                          {followed ? "Opened \u2713" : "Follow"}
                        </button>
                      </div>
                    );
                  })}
                </>
              )}

              {/* ── CONNECT MODE ── */}
              {activeMode === "connect" && (
                <div style={styles.connectMode}>
                  <div style={styles.connectIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#64ffda" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M7 8h10M7 12h6M7 16h8" />
                    </svg>
                  </div>
                  <p style={styles.connectDesc}>
                    Save <strong>{profile.name}</strong> directly to your contacts with all social profiles embedded.
                  </p>
                  <button
                    className="action-btn"
                    style={{ ...styles.actionBtn, background: contactSaved ? "linear-gradient(135deg, #1DB954 0%, #1ed760 100%)" : "linear-gradient(135deg, #64ffda 0%, #00b4d8 100%)", color: contactSaved ? "#fff" : "#0a0a12" }}
                    onClick={handleSaveContact}
                  >
                    {contactSaved ? "\u2713 Contact Saved" : "Save Contact"}
                  </button>
                  <p style={styles.connectHint}>Opens your phone's native "Add Contact" flow</p>
                </div>
              )}

              {/* ── DM MODE ── */}
              {activeMode === "dm" && (
                <div style={styles.dmMode}>
                  <p style={{ ...styles.sectionLabel, marginBottom: 14 }}>SEND A MESSAGE</p>
                  {dmPlatforms.map(([platform, handle]) => {
                    const config = PLATFORMS[platform];
                    return (
                      <button
                        key={platform}
                        className="action-btn"
                        style={{ ...styles.dmBtn, borderColor: `${config.color}33` }}
                        onClick={() => handleDm(platform, handle)}
                      >
                        <div style={{ ...styles.platformIcon, color: config.color, width: 36, height: 36 }}>{config.icon}</div>
                        <span style={{ fontWeight: 600, color: "#fff" }}>DM on {config.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ── BOOK MODE ── */}
              {activeMode === "book" && profile.calendly && (
                <div style={styles.connectMode}>
                  <div style={styles.connectIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <p style={styles.connectDesc}>Book a meeting with <strong>{profile.name}</strong></p>
                  <button
                    className="action-btn"
                    style={{ ...styles.actionBtn, background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)", color: "#0a0a12" }}
                    onClick={() => {
                      const url = profile.calendly.startsWith("http") ? profile.calendly : `https://${profile.calendly}`;
                      window.open(url, "_blank", "noopener");
                    }}
                  >
                    Open Calendar
                  </button>
                </div>
              )}

              {/* ── PAY MODE ── */}
              {activeMode === "pay" && (
                <div style={styles.dmMode}>
                  <p style={{ ...styles.sectionLabel, marginBottom: 14 }}>SEND A PAYMENT</p>
                  {profile.cashapp && (
                    <button className="action-btn" style={{ ...styles.dmBtn, borderColor: "rgba(52,211,153,0.2)" }} onClick={() => window.open(`https://cash.app/$${profile.cashapp}`, "_blank", "noopener")}>
                      <div style={{ ...styles.platformIcon, color: "#34d399", width: 36, height: 36 }}>
                        <span style={{ fontSize: 16, fontWeight: 800 }}>$</span>
                      </div>
                      <span style={{ fontWeight: 600, color: "#fff" }}>Cash App &mdash; ${profile.cashapp}</span>
                    </button>
                  )}
                  {profile.venmo && (
                    <button className="action-btn" style={{ ...styles.dmBtn, borderColor: "rgba(52,211,153,0.2)" }} onClick={() => window.open(`https://venmo.com/${profile.venmo}`, "_blank", "noopener")}>
                      <div style={{ ...styles.platformIcon, color: "#008CFF", width: 36, height: 36 }}>
                        <span style={{ fontSize: 14, fontWeight: 800 }}>V</span>
                      </div>
                      <span style={{ fontWeight: 600, color: "#fff" }}>Venmo &mdash; @{profile.venmo}</span>
                    </button>
                  )}
                  {profile.paypal && (
                    <button className="action-btn" style={{ ...styles.dmBtn, borderColor: "rgba(52,211,153,0.2)" }} onClick={() => window.open(`https://paypal.me/${profile.paypal}`, "_blank", "noopener")}>
                      <div style={{ ...styles.platformIcon, color: "#00457C", width: 36, height: 36 }}>
                        <span style={{ fontSize: 14, fontWeight: 800 }}>P</span>
                      </div>
                      <span style={{ fontWeight: 600, color: "#fff" }}>PayPal &mdash; @{profile.paypal}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Empty state */}
              {activeMode === "follow" && activeSocials.length === 0 && (
                <div style={styles.emptyState}>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                    Tap <strong>Edit</strong> to add your social profiles
                  </p>
                </div>
              )}
            </div>

            {/* QR + Share */}
            {activeSocials.length > 0 && (
              <div style={styles.shareSection}>
                <div style={styles.dividerRow}>
                  <div style={styles.dividerLine} />
                  <span style={styles.dividerText}>share your LockedIn</span>
                  <div style={styles.dividerLine} />
                </div>
                <div style={styles.qrContainer}>
                  <img src={qrUrl} alt="QR Code" style={styles.qrImage} />
                </div>
                <button className="action-btn" style={styles.copyBtn} onClick={handleCopy}>
                  {copied ? "Copied! \u2713" : "Copy Link"}
                </button>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          <span style={styles.footerText}>
            <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10, letterSpacing: 1.5 }}>TAP &bull; SCAN &bull; CONNECT</span>
            <br />
            Powered by <span style={{ color: "#ff2d78", fontWeight: 700 }}>LockedIn</span>
            <span style={{ marginLeft: 8, padding: "2px 6px", background: "rgba(255,45,120,0.1)", borderRadius: 4, fontSize: 9, color: "#ff2d78", letterSpacing: 1 }}>NFC READY</span>
          </span>
        </div>
      </div>

      <div style={styles.demoBadge}>
        <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", opacity: 0.6 }}>
          Built live at Claude Code Meetup
        </span>
      </div>
    </div>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────
const styles = {
  root: {
    minHeight: "100vh",
    background: "linear-gradient(145deg, #0a0a12 0%, #12101f 50%, #0d0b16 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 16px",
    fontFamily: "'Outfit', sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: 420,
    background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: "28px 24px",
    overflow: "hidden",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 },
  logoRow: { display: "flex", alignItems: "center", gap: 8 },
  logoMark: { width: 36, height: 36, borderRadius: 10, background: "rgba(255, 45, 120, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 18, color: "#fff", letterSpacing: -0.5 },
  modeToggle: { display: "flex", alignItems: "center", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, padding: "8px 14px", color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: "'Outfit', sans-serif", cursor: "pointer", transition: "all 0.2s" },
  profileSection: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 },
  avatarRing: { width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg, #ff2d78, #ff6b35, #ff2d78)", padding: 3, marginBottom: 16, animation: "pulse-ring 3s ease-in-out infinite" },
  avatar: { width: "100%", height: "100%", borderRadius: "50%", background: "#14121f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: "#ff2d78", fontFamily: "'Space Mono', monospace" },
  name: { fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: -0.5, margin: 0 },
  handle: { fontSize: 14, color: "rgba(255,255,255,0.4)", fontFamily: "'Space Mono', monospace", marginTop: 4 },
  bio: { fontSize: 14, color: "rgba(255,255,255,0.55)", marginTop: 8, textAlign: "center", lineHeight: 1.5 },
  editFields: { width: "100%", display: "flex", flexDirection: "column", alignItems: "center" },

  // Edit mode
  editSocials: { display: "flex", flexDirection: "column", gap: 10 },
  editSocialRow: { display: "flex", alignItems: "center", gap: 10 },
  sectionLabel: { fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 2, textAlign: "center", marginBottom: 12 },

  // Action mode selector
  modeSelectorRow: { display: "flex", justifyContent: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  modePill: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
    padding: "10px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)",
    cursor: "pointer", transition: "all 0.25s ease", fontFamily: "'Outfit', sans-serif",
    minWidth: 56, background: "none",
  },
  modeContent: { minHeight: 100 },

  // Follow mode
  followAllBtn: { width: "100%", padding: "16px 20px", background: "linear-gradient(135deg, #ff2d78 0%, #ff6b35 100%)", border: "none", borderRadius: 14, color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: "'Outfit', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease", marginBottom: 4 },
  followAllDone: { background: "linear-gradient(135deg, #1DB954 0%, #1ed760 100%)", animation: "none" },
  dividerRow: { display: "flex", alignItems: "center", gap: 12, margin: "12px 0" },
  dividerLine: { flex: 1, height: 1, background: "rgba(255,255,255,0.08)" },
  dividerText: { fontSize: 11, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, whiteSpace: "nowrap" },
  socialRow: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", transition: "all 0.2s", marginBottom: 6 },
  platformIcon: { width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  socialInfo: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
  platformName: { fontSize: 14, fontWeight: 600, color: "#fff" },
  socialHandle: { fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'Space Mono', monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  followBtn: { padding: "8px 18px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" },
  followedBtn: { background: "rgba(29, 185, 84, 0.15)", borderColor: "rgba(29, 185, 84, 0.3)", color: "#1DB954" },

  // Connect mode
  connectMode: { display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0" },
  connectIcon: { marginBottom: 16, opacity: 0.9 },
  connectDesc: { fontSize: 15, color: "rgba(255,255,255,0.65)", textAlign: "center", lineHeight: 1.6, marginBottom: 20, maxWidth: 280 },
  connectHint: { fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 12 },
  actionBtn: { padding: "16px 32px", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, fontFamily: "'Outfit', sans-serif", cursor: "pointer", transition: "all 0.3s ease", letterSpacing: 0.3 },

  // DM mode
  dmMode: { display: "flex", flexDirection: "column", gap: 10 },
  dmBtn: { display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "14px 18px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, cursor: "pointer", transition: "all 0.2s", fontFamily: "'Outfit', sans-serif" },

  // Share section
  shareSection: { marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" },
  qrContainer: { padding: 12, background: "rgba(255,255,255,0.04)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 14 },
  qrImage: { width: QR_SIZE, height: QR_SIZE, borderRadius: 8 },
  copyBtn: { padding: "10px 28px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif", cursor: "pointer", transition: "all 0.2s" },

  // Footer
  footer: { marginTop: 28, textAlign: "center", lineHeight: 2 },
  footerText: { fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "'Space Mono', monospace" },
  demoBadge: { marginTop: 20, padding: "8px 16px", background: "rgba(255,255,255,0.04)", borderRadius: 8, color: "rgba(255,255,255,0.4)", fontFamily: "'Outfit', sans-serif" },

  emptyState: { padding: "40px 20px", textAlign: "center" },
};
