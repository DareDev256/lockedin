import { useState, useEffect, useCallback, useRef } from "react";

// ─── Platform Config ────────────────────────────────────────────────
const PLATFORMS = {
  twitter: {
    name: "X / Twitter",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
    getFollowUrl: (h) => `https://twitter.com/intent/follow?screen_name=${h}`,
    getDeepLink: (h) => `twitter://user?screen_name=${h}`,
    getProfileUrl: (h) => `https://twitter.com/${h}`,
    getDmUrl: (h) => `https://twitter.com/messages/compose?recipient_id=${h}`,
    supportsDm: true,
    placeholder: "handle (no @)",
    color: "#fff",
    embedType: "twitter",
  },
  youtube: {
    name: "YouTube",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>,
    getFollowUrl: (h) => `https://www.youtube.com/${h}?sub_confirmation=1`,
    getDeepLink: (h) => `vnd.youtube://www.youtube.com/${h}`,
    getProfileUrl: (h) => `https://www.youtube.com/${h}`,
    supportsDm: false,
    placeholder: "@channel",
    color: "#FF0033",
    embedType: "youtube",
  },
  instagram: {
    name: "Instagram",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>,
    getFollowUrl: (h) => `instagram://user?username=${h}`,
    getDeepLink: (h) => `instagram://user?username=${h}`,
    getProfileUrl: (h) => `https://www.instagram.com/${h}/`,
    getDmUrl: () => `instagram://direct-new`,
    supportsDm: true,
    placeholder: "username",
    color: "#E4405F",
    embedType: "instagram",
  },
  tiktok: {
    name: "TikTok",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>,
    getFollowUrl: (h) => `snssdk1233://user/profile/${h}`,
    getDeepLink: (h) => `snssdk1233://user/profile/${h}`,
    getProfileUrl: (h) => `https://www.tiktok.com/@${h}`,
    supportsDm: false,
    placeholder: "username",
    color: "#00f2ea",
    embedType: "tiktok",
  },
  github: {
    name: "GitHub",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>,
    getFollowUrl: (h) => `https://github.com/${h}`,
    getDeepLink: (h) => `https://github.com/${h}`,
    getProfileUrl: (h) => `https://github.com/${h}`,
    supportsDm: false,
    placeholder: "username",
    color: "#f0f6fc",
    embedType: "github",
  },
  spotify: {
    name: "Spotify",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>,
    getFollowUrl: (h) => `spotify:artist:${h}`,
    getDeepLink: (h) => `spotify:artist:${h}`,
    getProfileUrl: (h) => `https://open.spotify.com/artist/${h}`,
    supportsDm: false,
    placeholder: "artist ID",
    color: "#1DB954",
    embedType: "spotify",
  },
  twitch: {
    name: "Twitch",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" /></svg>,
    getFollowUrl: (h) => `https://www.twitch.tv/${h}`,
    getDeepLink: (h) => `twitch://stream/${h}`,
    getProfileUrl: (h) => `https://www.twitch.tv/${h}`,
    supportsDm: false,
    placeholder: "username",
    color: "#9146FF",
    embedType: "twitch",
  },
  website: {
    name: "Website",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>,
    getFollowUrl: (h) => h.startsWith("http") ? h : `https://${h}`,
    getDeepLink: (h) => h.startsWith("http") ? h : `https://${h}`,
    getProfileUrl: (h) => h.startsWith("http") ? h : `https://${h}`,
    supportsDm: false,
    placeholder: "yoursite.com",
    color: "#64ffda",
    embedType: "website",
  },
};

// ─── Action Modes ───────────────────────────────────────────────────
const ACTION_MODES = [
  { id: "follow", label: "Follow", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>, color: "#ff2d78" },
  { id: "connect", label: "Connect", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M7 8h10M7 12h6M7 16h8" /></svg>, color: "#64ffda" },
  { id: "dm", label: "DM", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>, color: "#a78bfa" },
  { id: "book", label: "Book", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>, color: "#fbbf24" },
  { id: "pay", label: "Pay", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>, color: "#34d399" },
];

// ─── vCard Generator ────────────────────────────────────────────────
function generateVCard(profile) {
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `FN:${profile.name || "LockedIn User"}`];
  if (profile.bio) lines.push(`NOTE:${profile.bio}`);
  if (profile.email) lines.push(`EMAIL:${profile.email}`);
  if (profile.phone) lines.push(`TEL:${profile.phone}`);
  Object.entries(profile.socials).forEach(([platform, handle]) => {
    if (!handle?.trim()) return;
    const config = PLATFORMS[platform];
    if (config) lines.push(`URL;type=${config.name}:${config.getProfileUrl(handle)}`);
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

// ─── Profile Avatar URL from socials ────────────────────────────────
function getAvatarUrl(profile) {
  // GitHub has the most reliable public avatar API
  if (profile.socials.github) {
    return `https://github.com/${profile.socials.github}.png?size=200`;
  }
  // Twitter/X — use unavatar.io as a proxy
  if (profile.socials.twitter) {
    return `https://unavatar.io/twitter/${profile.socials.twitter}`;
  }
  // Instagram via unavatar
  if (profile.socials.instagram) {
    return `https://unavatar.io/instagram/${profile.socials.instagram}`;
  }
  return null;
}

// ─── Live Feed Panel Component ──────────────────────────────────────
function FeedPanel({ platform, handle, color, isActive, onClick }) {
  const config = PLATFORMS[platform];
  if (!config || !handle) return null;

  const renderEmbed = () => {
    switch (platform) {
      case "twitter":
        return (
          <div style={feedStyles.embedWrap}>
            <a
              className="twitter-timeline"
              data-theme="dark"
              data-chrome="noheader nofooter noborders transparent"
              data-tweet-limit="3"
              href={`https://twitter.com/${handle}`}
            >Loading tweets...</a>
          </div>
        );
      case "youtube": {
        const channelHandle = handle.startsWith("@") ? handle.slice(1) : handle;
        return (
          <div style={feedStyles.embedWrap}>
            <iframe
              src={`https://www.youtube.com/embed?listType=user_uploads&list=${channelHandle}&autoplay=0`}
              style={{ width: "100%", height: "100%", border: "none", borderRadius: 8 }}
              allow="encrypted-media"
              title="YouTube"
            />
          </div>
        );
      }
      case "instagram":
        return (
          <div style={feedStyles.profileCard}>
            <div style={{ ...feedStyles.igGrid }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  ...feedStyles.igCell,
                  background: `linear-gradient(${135 + i * 30}deg, ${color}22, ${color}08)`,
                  animationDelay: `${i * 0.15}s`,
                }} className="ig-cell" />
              ))}
            </div>
            <a href={config.getProfileUrl(handle)} target="_blank" rel="noopener noreferrer" style={feedStyles.visitBtn}>
              View @{handle} on Instagram
            </a>
          </div>
        );
      case "github":
        return (
          <div style={feedStyles.profileCard}>
            <img
              src={`https://ghchart.rshah.org/ff2d78/${handle}`}
              alt="GitHub contributions"
              style={{ width: "100%", borderRadius: 8, marginBottom: 12 }}
            />
            <div style={feedStyles.ghStats}>
              <img src={`https://github-readme-stats.vercel.app/api?username=${handle}&show_icons=true&theme=radical&hide_border=true&bg_color=00000000&text_color=ffffff&icon_color=ff2d78&title_color=ff2d78&hide=contribs&hide_title=true&hide_rank=true`} alt="GitHub stats" style={{ width: "100%", borderRadius: 8 }} />
            </div>
            <a href={config.getProfileUrl(handle)} target="_blank" rel="noopener noreferrer" style={feedStyles.visitBtn}>
              View @{handle} on GitHub
            </a>
          </div>
        );
      case "spotify":
        return (
          <div style={feedStyles.embedWrap}>
            <iframe
              src={`https://open.spotify.com/embed/artist/${handle}?theme=0`}
              style={{ width: "100%", height: "100%", border: "none", borderRadius: 8 }}
              allow="encrypted-media"
              title="Spotify"
            />
          </div>
        );
      case "tiktok":
        return (
          <div style={feedStyles.profileCard}>
            <div style={feedStyles.ttPreview}>
              <div style={feedStyles.ttIcon}>{config.icon}</div>
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>@{handle}</span>
            </div>
            <a href={config.getProfileUrl(handle)} target="_blank" rel="noopener noreferrer" style={feedStyles.visitBtn}>
              View @{handle} on TikTok
            </a>
          </div>
        );
      case "twitch":
        return (
          <div style={feedStyles.embedWrap}>
            <iframe
              src={`https://player.twitch.tv/?channel=${handle}&parent=${window.location.hostname}&muted=true`}
              style={{ width: "100%", height: "100%", border: "none", borderRadius: 8 }}
              allow="autoplay; encrypted-media"
              title="Twitch"
            />
          </div>
        );
      case "website":
        return (
          <div style={feedStyles.embedWrap}>
            <iframe
              src={handle.startsWith("http") ? handle : `https://${handle}`}
              style={{ width: "100%", height: "100%", border: "none", borderRadius: 8 }}
              title="Website"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="feed-panel"
      onClick={onClick}
      style={{
        ...feedStyles.panel,
        borderColor: isActive ? `${color}66` : "rgba(255,255,255,0.06)",
        boxShadow: isActive ? `0 0 30px ${color}15, inset 0 0 30px ${color}05` : "none",
      }}
    >
      <div style={feedStyles.panelHeader}>
        <div style={{ ...feedStyles.panelDot, background: color }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, color }}>
          {config.icon}
          <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>{config.name}</span>
        </div>
        <span style={feedStyles.panelHandle}>
          {platform === "website" ? handle : `@${handle.replace(/^@/, "")}`}
        </span>
      </div>
      <div style={feedStyles.panelBody}>
        {renderEmbed()}
      </div>
    </div>
  );
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
    github: "DareDev256",
    website: "www.jamesdare.com",
  },
};

const QR_SIZE = 140;

// ─── Main Component ─────────────────────────────────────────────────
export default function LockedIn() {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({ ...DEFAULT_PROFILE, socials: { ...DEFAULT_PROFILE.socials } });
  const [activeMode, setActiveMode] = useState("follow");
  const [activeFeed, setActiveFeed] = useState("twitter");
  const [followingState, setFollowingState] = useState({});
  const [followAllTriggered, setFollowAllTriggered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contactSaved, setContactSaved] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    setShareUrl(window.location.href);
    // Load Twitter widget script
    const s = document.createElement("script");
    s.src = "https://platform.twitter.com/widgets.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  // Re-render Twitter embeds when feed switches to twitter
  useEffect(() => {
    if (activeFeed === "twitter" && window.twttr?.widgets) {
      setTimeout(() => window.twttr.widgets.load(), 300);
    }
  }, [activeFeed]);

  const avatarUrl = getAvatarUrl(profile);

  const activeSocials = Object.entries(profile.socials).filter(([, val]) => val?.trim());
  const dmPlatforms = activeSocials.filter(([p]) => PLATFORMS[p]?.supportsDm);

  const handleFollowOne = useCallback((platform, handle) => {
    const config = PLATFORMS[platform];
    if (!config) return;
    if (platform === "twitter" || platform === "youtube") {
      window.open(config.getFollowUrl(handle), "_blank", "noopener");
    } else {
      window.open(config.getProfileUrl(handle), "_blank", "noopener");
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

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${QR_SIZE}x${QR_SIZE}&data=${encodeURIComponent(shareUrl)}&bgcolor=0a0a12&color=ffffff&format=svg`;

  const availableModes = ACTION_MODES.filter((m) => {
    if (m.id === "follow") return activeSocials.length > 0;
    if (m.id === "connect") return true;
    if (m.id === "dm") return dmPlatforms.length > 0;
    if (m.id === "book") return !!profile.calendly;
    if (m.id === "pay") return !!(profile.cashapp || profile.venmo || profile.paypal);
    return true;
  });

  // ─── RENDER ─────────────────────────────────────────────────────
  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #06060c; }

        @keyframes pulse-ring { 0% { transform: scale(0.95); opacity: 0.7; } 50% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.7; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(255, 45, 120, 0.3); } 50% { box-shadow: 0 0 40px rgba(255, 45, 120, 0.6); } }
        @keyframes fadeSwitch { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes bounceIn { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes livePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes gridFade { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }

        .dashboard { animation: slideUp 0.6s ease-out; }
        .card-section { animation: slideUp 0.5s ease-out 0.1s backwards; }
        .feed-section { animation: slideIn 0.6s ease-out 0.2s backwards; }
        .follow-btn:hover { transform: translateY(-2px) !important; filter: brightness(1.2); }
        .follow-btn:active { transform: translateY(0) !important; }
        .social-row { animation: slideUp 0.5s ease-out backwards; }
        .follow-all-btn { animation: glow 2s ease-in-out infinite; }
        .follow-all-btn:hover { transform: scale(1.03) !important; }
        .mode-toggle:hover { background: rgba(255,255,255,0.15) !important; }
        .mode-pill:hover { transform: translateY(-1px); filter: brightness(1.1); }
        .mode-content { animation: fadeSwitch 0.35s ease-out; }
        .avatar-bounce { animation: bounceIn 0.8s ease-out, float 4s ease-in-out 0.8s infinite; }
        .feed-panel { cursor: pointer; transition: all 0.3s ease; }
        .feed-panel:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.15) !important; }
        .ig-cell { animation: gridFade 0.4s ease-out backwards; }
        .live-dot { animation: livePulse 1.5s ease-in-out infinite; }
        .action-btn:hover { transform: translateY(-2px) !important; filter: brightness(1.15); }
        .action-btn:active { transform: translateY(0) !important; }

        .edit-input {
          width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px; padding: 10px 14px; color: #fff; font-family: 'Outfit', sans-serif;
          font-size: 14px; outline: none; transition: border-color 0.2s;
        }
        .edit-input:focus { border-color: #ff2d78; }
        .edit-input::placeholder { color: rgba(255,255,255,0.3); }

        /* Scrollbar */
        .feed-scroll::-webkit-scrollbar { width: 4px; }
        .feed-scroll::-webkit-scrollbar-track { background: transparent; }
        .feed-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        @media (max-width: 900px) {
          .dashboard-layout { flex-direction: column !important; }
          .feed-sidebar { max-height: 50vh !important; width: 100% !important; min-width: unset !important; }
        }
      `}</style>

      {/* ── DASHBOARD LAYOUT ── */}
      <div className="dashboard" style={styles.dashboardWrap}>

        {/* ── TOP BAR ── */}
        <div style={styles.topBar}>
          <div style={styles.logoRow}>
            <div style={styles.logoMark}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#ff2d78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={styles.logoText}>LockedIn</span>
            <div style={styles.liveBadge}>
              <div className="live-dot" style={styles.liveDot} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5 }}>LIVE</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button className="mode-toggle" style={styles.modeToggle} onClick={() => { setEditMode(!editMode); setActiveMode("follow"); }}>
              {editMode ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              )}
              <span style={{ marginLeft: 6 }}>{editMode ? "Preview" : "Edit"}</span>
            </button>
          </div>
        </div>

        {/* ── MAIN LAYOUT: FEEDS LEFT + CARD RIGHT ── */}
        <div className="dashboard-layout" style={styles.layout}>

          {/* ── LEFT: LIVE FEEDS ── */}
          {!editMode && (
            <div className="feed-section feed-sidebar feed-scroll" style={styles.feedSidebar}>
              <div style={styles.feedHeader}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 2 }}>LIVE FEEDS</span>
              </div>
              {activeSocials.map(([platform, handle], i) => (
                <FeedPanel
                  key={platform}
                  platform={platform}
                  handle={handle}
                  color={PLATFORMS[platform].color}
                  isActive={activeFeed === platform}
                  onClick={() => setActiveFeed(platform)}
                />
              ))}
            </div>
          )}

          {/* ── RIGHT: CARD ── */}
          <div className="card-section" style={styles.cardSection}>
            <div style={styles.container}>
              {/* Profile */}
              <div style={styles.profileSection}>
                <div className="avatar-bounce" style={styles.avatarRing}>
                  {avatarUrl && !avatarError ? (
                    <img
                      src={avatarUrl}
                      alt={profile.name}
                      onLoad={() => setAvatarLoaded(true)}
                      onError={() => setAvatarError(true)}
                      style={{
                        ...styles.avatarImg,
                        opacity: avatarLoaded ? 1 : 0,
                      }}
                    />
                  ) : (
                    <div style={styles.avatarFallback}>
                      {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
                    </div>
                  )}
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

              {/* ── EDIT MODE ── */}
              {editMode && (
                <div style={styles.editSocials}>
                  <p style={styles.sectionLabel}>SOCIAL PROFILES</p>
                  {Object.entries(PLATFORMS).map(([key, config]) => (
                    <div key={key} style={styles.editSocialRow}>
                      <div style={{ ...styles.platformIcon, color: config.color }}>{config.icon}</div>
                      <input className="edit-input" value={profile.socials[key] || ""} onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, [key]: e.target.value } })} placeholder={config.placeholder} style={{ flex: 1 }} />
                    </div>
                  ))}
                  <p style={{ ...styles.sectionLabel, marginTop: 20 }}>CONTACT & PAYMENTS</p>
                  {[
                    { key: "email", placeholder: "Email", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
                    { key: "phone", placeholder: "Phone", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
                    { key: "calendly", placeholder: "Calendly / Cal.com URL", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg> },
                    { key: "cashapp", placeholder: "Cash App $cashtag", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
                    { key: "venmo", placeholder: "Venmo username", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
                    { key: "paypal", placeholder: "PayPal.me handle", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
                  ].map(({ key, placeholder, icon }) => (
                    <div key={key} style={styles.editSocialRow}>
                      <div style={{ ...styles.platformIcon, color: "#a78bfa" }}>{icon}</div>
                      <input className="edit-input" value={profile[key]} onChange={(e) => setProfile({ ...profile, [key]: e.target.value })} placeholder={placeholder} style={{ flex: 1 }} />
                    </div>
                  ))}
                </div>
              )}

              {/* ── VIEW MODE ── */}
              {!editMode && (
                <>
                  {availableModes.length > 1 && (
                    <div style={styles.modeSelectorRow}>
                      {availableModes.map((m) => (
                        <button key={m.id} className="mode-pill" onClick={() => { setActiveMode(m.id); setFollowAllTriggered(false); setFollowingState({}); }}
                          style={{ ...styles.modePill, background: activeMode === m.id ? `${m.color}22` : "rgba(255,255,255,0.04)", borderColor: activeMode === m.id ? `${m.color}55` : "rgba(255,255,255,0.08)", color: activeMode === m.id ? m.color : "rgba(255,255,255,0.5)" }}>
                          {m.icon}
                          <span style={{ fontSize: 10, fontWeight: 600, marginTop: 2 }}>{m.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mode-content" key={activeMode} style={{ minHeight: 80 }}>
                    {/* FOLLOW */}
                    {activeMode === "follow" && activeSocials.length > 0 && (
                      <>
                        <button className="follow-all-btn" style={{ ...styles.followAllBtn, ...(followAllTriggered ? styles.followAllDone : {}) }} onClick={handleFollowAll} disabled={followAllTriggered}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 8 }}>
                            {followAllTriggered ? <polyline points="20 6 9 17 4 12" /> : <><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></>}
                          </svg>
                          {followAllTriggered ? `Opened ${activeSocials.length} profiles` : `Follow All (${activeSocials.length})`}
                        </button>
                        <div style={styles.dividerRow}><div style={styles.dividerLine} /><span style={styles.dividerText}>or pick individually</span><div style={styles.dividerLine} /></div>
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

                    {/* CONNECT */}
                    {activeMode === "connect" && (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0" }}>
                        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", textAlign: "center", marginBottom: 16 }}>
                          Save <strong style={{ color: "#fff" }}>{profile.name}</strong> to your contacts with all socials embedded.
                        </p>
                        <button className="action-btn" style={{ ...styles.actionBtn, background: contactSaved ? "linear-gradient(135deg, #1DB954, #1ed760)" : "linear-gradient(135deg, #64ffda, #00b4d8)", color: contactSaved ? "#fff" : "#0a0a12" }} onClick={handleSaveContact}>
                          {contactSaved ? "\u2713 Contact Saved" : "Save Contact"}
                        </button>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 10 }}>Opens native "Add Contact" on mobile</p>
                      </div>
                    )}

                    {/* DM */}
                    {activeMode === "dm" && dmPlatforms.map(([platform, handle]) => {
                      const config = PLATFORMS[platform];
                      return (
                        <button key={platform} className="action-btn" style={styles.dmBtn} onClick={() => { const url = config.getDmUrl(handle); window.open(url, "_blank", "noopener"); }}>
                          <div style={{ ...styles.platformIcon, color: config.color, width: 36, height: 36 }}>{config.icon}</div>
                          <span style={{ fontWeight: 600, color: "#fff" }}>DM on {config.name}</span>
                        </button>
                      );
                    })}

                    {/* BOOK */}
                    {activeMode === "book" && profile.calendly && (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0" }}>
                        <button className="action-btn" style={{ ...styles.actionBtn, background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#0a0a12" }} onClick={() => window.open(profile.calendly.startsWith("http") ? profile.calendly : `https://${profile.calendly}`, "_blank", "noopener")}>
                          Open Calendar
                        </button>
                      </div>
                    )}

                    {/* PAY */}
                    {activeMode === "pay" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {profile.cashapp && <button className="action-btn" style={styles.dmBtn} onClick={() => window.open(`https://cash.app/$${profile.cashapp}`, "_blank")}><span style={{ fontWeight: 600, color: "#34d399" }}>Cash App &mdash; ${profile.cashapp}</span></button>}
                        {profile.venmo && <button className="action-btn" style={styles.dmBtn} onClick={() => window.open(`https://venmo.com/${profile.venmo}`, "_blank")}><span style={{ fontWeight: 600, color: "#008CFF" }}>Venmo &mdash; @{profile.venmo}</span></button>}
                        {profile.paypal && <button className="action-btn" style={styles.dmBtn} onClick={() => window.open(`https://paypal.me/${profile.paypal}`, "_blank")}><span style={{ fontWeight: 600, color: "#00457C" }}>PayPal &mdash; @{profile.paypal}</span></button>}
                      </div>
                    )}
                  </div>

                  {/* QR + Share */}
                  {activeSocials.length > 0 && (
                    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={styles.dividerRow}><div style={styles.dividerLine} /><span style={styles.dividerText}>share your LockedIn</span><div style={styles.dividerLine} /></div>
                      <div style={styles.qrContainer}><img src={qrUrl} alt="QR Code" style={{ width: QR_SIZE, height: QR_SIZE, borderRadius: 8 }} /></div>
                      <button className="action-btn" style={styles.copyBtn} onClick={handleCopy}>{copied ? "Copied! \u2713" : "Copy Link"}</button>
                    </div>
                  )}
                </>
              )}

              {/* Footer */}
              <div style={styles.footer}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", letterSpacing: 1.5 }}>TAP &bull; SCAN &bull; CONNECT</span>
                <br />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "'Space Mono', monospace" }}>
                  Powered by <span style={{ color: "#ff2d78", fontWeight: 700 }}>LockedIn</span>
                  <span style={{ marginLeft: 8, padding: "2px 6px", background: "rgba(255,45,120,0.1)", borderRadius: 4, fontSize: 9, color: "#ff2d78", letterSpacing: 1 }}>NFC READY</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom badge */}
        <div style={styles.demoBadge}>
          <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", opacity: 0.5 }}>Built live at Claude Code Meetup</span>
        </div>
      </div>
    </div>
  );
}

// ─── Feed Panel Styles ──────────────────────────────────────────────
const feedStyles = {
  panel: {
    background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  panelDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
  },
  panelHandle: {
    marginLeft: "auto",
    fontSize: 11,
    color: "rgba(255,255,255,0.3)",
    fontFamily: "'Space Mono', monospace",
  },
  panelBody: {
    padding: 12,
    minHeight: 180,
  },
  embedWrap: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    background: "rgba(0,0,0,0.3)",
  },
  profileCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  igGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 4,
    width: "100%",
    aspectRatio: "1",
    maxHeight: 140,
  },
  igCell: {
    borderRadius: 4,
    minHeight: 40,
  },
  visitBtn: {
    display: "inline-block",
    padding: "8px 16px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    textDecoration: "none",
    transition: "all 0.2s",
    marginTop: 4,
  },
  ghStats: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 4,
  },
  ttPreview: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "20px 0",
  },
  ttIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: "rgba(0, 242, 234, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#00f2ea",
  },
};

// ─── Main Styles ────────────────────────────────────────────────────
const styles = {
  root: {
    minHeight: "100vh",
    background: "linear-gradient(145deg, #06060c 0%, #0d0b18 40%, #0a0812 100%)",
    fontFamily: "'Outfit', sans-serif",
  },
  dashboardWrap: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "20px 20px 40px",
  },

  // Top bar
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0 24px",
  },
  logoRow: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: { width: 36, height: 36, borderRadius: 10, background: "rgba(255, 45, 120, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 20, color: "#fff", letterSpacing: -0.5 },
  liveBadge: { display: "flex", alignItems: "center", gap: 6, marginLeft: 12, padding: "4px 10px", background: "rgba(255, 45, 120, 0.08)", borderRadius: 20, color: "#ff2d78" },
  liveDot: { width: 6, height: 6, borderRadius: "50%", background: "#ff2d78" },
  modeToggle: { display: "flex", alignItems: "center", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 14px", color: "rgba(255,255,255,0.6)", fontSize: 13, fontFamily: "'Outfit', sans-serif", cursor: "pointer", transition: "all 0.2s" },

  // Layout
  layout: { display: "flex", gap: 24, alignItems: "flex-start" },
  feedSidebar: { flex: 1, minWidth: 320, maxWidth: 480, maxHeight: "calc(100vh - 120px)", overflowY: "auto", paddingRight: 8 },
  feedHeader: { marginBottom: 12, paddingLeft: 4 },
  cardSection: { flex: "0 0 420px", position: "sticky", top: 20 },

  // Card container
  container: {
    background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: "28px 24px",
    overflow: "hidden",
  },

  // Profile
  profileSection: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ff2d78, #ff6b35, #a78bfa, #ff2d78)",
    backgroundSize: "300% 300%",
    animation: "shimmer 4s ease-in-out infinite",
    padding: 3,
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    transition: "opacity 0.4s ease",
  },
  avatarFallback: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "#14121f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 34,
    fontWeight: 800,
    color: "#ff2d78",
    fontFamily: "'Space Mono', monospace",
  },
  name: { fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: -0.5, margin: 0 },
  handle: { fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'Space Mono', monospace", marginTop: 4 },
  bio: { fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 8, textAlign: "center", lineHeight: 1.5 },
  editFields: { width: "100%", display: "flex", flexDirection: "column", alignItems: "center" },

  // Edit mode
  editSocials: { display: "flex", flexDirection: "column", gap: 10 },
  editSocialRow: { display: "flex", alignItems: "center", gap: 10 },
  sectionLabel: { fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 2, textAlign: "center", marginBottom: 12 },

  // Action modes
  modeSelectorRow: { display: "flex", justifyContent: "center", gap: 6, marginBottom: 16, flexWrap: "wrap" },
  modePill: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "8px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", transition: "all 0.25s ease", fontFamily: "'Outfit', sans-serif", minWidth: 52, background: "none" },

  // Follow
  followAllBtn: { width: "100%", padding: "14px 20px", background: "linear-gradient(135deg, #ff2d78 0%, #ff6b35 100%)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "'Outfit', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease", marginBottom: 4 },
  followAllDone: { background: "linear-gradient(135deg, #1DB954 0%, #1ed760 100%)", animation: "none" },
  dividerRow: { display: "flex", alignItems: "center", gap: 12, margin: "10px 0" },
  dividerLine: { flex: 1, height: 1, background: "rgba(255,255,255,0.06)" },
  dividerText: { fontSize: 10, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, whiteSpace: "nowrap" },
  socialRow: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.025)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s", marginBottom: 4 },
  platformIcon: { width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  socialInfo: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
  platformName: { fontSize: 13, fontWeight: 600, color: "#fff" },
  socialHandle: { fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'Space Mono', monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  followBtn: { padding: "7px 16px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 600, fontFamily: "'Outfit', sans-serif", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" },
  followedBtn: { background: "rgba(29, 185, 84, 0.15)", borderColor: "rgba(29, 185, 84, 0.3)", color: "#1DB954" },

  // Action buttons
  actionBtn: { padding: "14px 28px", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, fontFamily: "'Outfit', sans-serif", cursor: "pointer", transition: "all 0.3s ease" },
  dmBtn: { display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, cursor: "pointer", transition: "all 0.2s", fontFamily: "'Outfit', sans-serif" },

  // QR / Share
  qrContainer: { padding: 10, background: "rgba(255,255,255,0.03)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 12 },
  copyBtn: { padding: "9px 24px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, fontFamily: "'Outfit', sans-serif", cursor: "pointer", transition: "all 0.2s" },

  // Footer
  footer: { marginTop: 24, textAlign: "center", lineHeight: 2.2 },
  demoBadge: { textAlign: "center", marginTop: 24, color: "rgba(255,255,255,0.3)", fontFamily: "'Outfit', sans-serif" },
};
