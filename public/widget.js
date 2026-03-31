/**
 * LockedIn — Embeddable "Follow All" Widget
 * Usage: <script src="https://tapin-bay.vercel.app/widget.js" data-profile="BASE64_HASH"></script>
 * Options: data-mode="inline" | data-mode="button" (default)
 * Size: vanilla JS, zero dependencies
 */
(function () {
  'use strict';

  var LKIN_BASE = 'https://tapin-bay.vercel.app';

  // ── Platform registry (mirrors main app) ─────────────────────────
  var PLATFORMS = {
    twitter: { name: 'X', url: function (h) { return 'https://twitter.com/' + h; }, follow: function (h) { return 'https://twitter.com/intent/follow?screen_name=' + h; }, color: '#fff', svg: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>' },
    instagram: { name: 'Instagram', url: function (h) { return 'https://www.instagram.com/' + h + '/'; }, follow: function (h) { return 'https://www.instagram.com/' + h + '/'; }, color: '#E4405F', svg: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>' },
    tiktok: { name: 'TikTok', url: function (h) { return 'https://www.tiktok.com/@' + h; }, follow: function (h) { return 'https://www.tiktok.com/@' + h; }, color: '#00f2ea', svg: '<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>' },
    threads: { name: 'Threads', url: function (h) { return 'https://www.threads.net/@' + h; }, follow: function (h) { return 'https://www.threads.net/@' + h; }, color: '#fff', svg: '<path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.706-.165 1.416-.58 2.546-1.238 3.373-.896 1.122-2.16 1.717-3.757 1.768-1.2-.036-2.241-.449-3.01-1.193-.82-.795-1.265-1.883-1.248-3.063.03-2.053 1.426-3.559 3.635-3.923 1.168-.192 2.227-.06 3.15.394.18.09.348.19.507.298.036-.335.054-.68.047-1.032-.026-1.322-.375-2.355-1.036-3.07-.7-.755-1.74-1.148-3.091-1.168l-.055-.002c-1.078 0-2.007.324-2.68.937l-1.367-1.518c.97-.876 2.276-1.354 3.775-1.39.057-.002.113-.002.17-.002 1.837 0 3.326.583 4.325 1.661.913.984 1.412 2.352 1.449 3.96.013.66-.038 1.296-.152 1.896.507.36.928.795 1.257 1.305.776 1.206.852 2.98.17 4.483-.648 1.433-1.883 2.552-3.669 3.322-1.47.632-3.206.964-5.165.982zm-.067-7.39c-1.263.21-1.968.868-1.983 1.848-.008.618.232 1.15.674 1.498.424.334.991.51 1.591.496 1.57-.049 2.597-1.066 2.882-2.858-.58-.345-1.32-.557-2.098-.557-.356 0-.716.043-1.066.127z"/>' },
    facebook: { name: 'Facebook', url: function (h) { return 'https://www.facebook.com/' + h; }, follow: function (h) { return 'https://www.facebook.com/' + h; }, color: '#1877F2', svg: '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>' },
    linkedin: { name: 'LinkedIn', url: function (h) { return 'https://www.linkedin.com/in/' + h; }, follow: function (h) { return 'https://www.linkedin.com/in/' + h; }, color: '#0A66C2', svg: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>' },
    youtube: { name: 'YouTube', url: function (h) { return 'https://www.youtube.com/' + h; }, follow: function (h) { return 'https://www.youtube.com/' + h + '?sub_confirmation=1'; }, color: '#FF0033', svg: '<path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>' },
    twitch: { name: 'Twitch', url: function (h) { return 'https://www.twitch.tv/' + h; }, follow: function (h) { return 'https://www.twitch.tv/' + h; }, color: '#9146FF', svg: '<path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>' },
    snapchat: { name: 'Snapchat', url: function (h) { return 'https://www.snapchat.com/add/' + h; }, follow: function (h) { return 'https://www.snapchat.com/add/' + h; }, color: '#FFFC00', svg: '<path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.959-.289.067-.04.152-.06.237-.06.156 0 .347.075.472.2.18.18.242.405.18.615-.12.39-.607.69-1.143.842-.18.045-.39.105-.63.18-.345.105-.51.225-.51.39 0 .06.015.12.045.195.15.33.39.66.615.975.5.675 1.125 1.515 1.095 2.49-.03.54-.27 1.005-.72 1.38-.39.33-.885.51-1.335.585-.21.03-.435.06-.66.06-.18 0-.36-.015-.54-.045-.36-.06-.645-.225-1.02-.435-.24-.135-.51-.285-.84-.405-.24-.09-.51-.135-.78-.135-.15 0-.3.015-.45.06-.27.06-.51.18-.765.3-.36.195-.735.39-1.215.465-.075.015-.165.015-.255.015-.135 0-.27-.015-.405-.045-.675-.12-1.11-.42-1.425-.675-.39-.33-.855-.78-1.77-1.005-.3-.075-.675-.165-1.005-.285-.54-.18-1.02-.465-1.17-.84-.06-.195-.015-.405.165-.585.12-.12.3-.195.465-.195.09 0 .18.015.255.06.3.165.66.27.96.285.21 0 .345-.045.42-.09-.015-.18-.03-.36-.045-.555l-.003-.06c-.105-1.62-.225-3.654.3-4.845C6.84 1.07 10.2.793 11.19.793h.51z"/>' },
    discord: { name: 'Discord', url: function (h) { return h.indexOf('http') === 0 ? h : 'https://discord.gg/' + h; }, follow: function (h) { return h.indexOf('http') === 0 ? h : 'https://discord.gg/' + h; }, color: '#5865F2', svg: '<path d="M20.317 4.37a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.618-1.25.077.077 0 00-.079-.037A19.74 19.74 0 003.677 4.37a.07.07 0 00-.032.028C.533 9.046-.319 13.58.099 18.058a.082.082 0 00.031.056 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.11 13.11 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.078-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.009c.12.099.246.198.373.292a.077.077 0 01-.006.127 12.3 12.3 0 01-1.873.892.076.076 0 00-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 00.084.028 19.84 19.84 0 006.002-3.03.077.077 0 00.031-.055c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 00-.031-.029zM8.02 15.33c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.332-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.332-.946 2.418-2.157 2.418z"/>' },
    telegram: { name: 'Telegram', url: function (h) { return 'https://t.me/' + h; }, follow: function (h) { return 'https://t.me/' + h; }, color: '#26A5E4', svg: '<path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>' },
    bluesky: { name: 'Bluesky', url: function (h) { return 'https://bsky.app/profile/' + h; }, follow: function (h) { return 'https://bsky.app/profile/' + h; }, color: '#0085FF', svg: '<path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.785 2.627 3.584 3.493 6.212 3.063-3.716.572-6.97 1.97-2.748 6.757C7.67 24.048 10.3 19.287 12 16.407c1.7 2.88 4.015 7.375 7.749 3.806 4.348-4.93.93-6.266-2.749-6.757 2.628.43 5.427-.436 6.212-3.063C23.622 9.418 24 4.458 24 3.768c0-.69-.139-1.86-.902-2.203-.659-.3-1.664-.621-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/>' },
    reddit: { name: 'Reddit', url: function (h) { return 'https://www.reddit.com/user/' + h; }, follow: function (h) { return 'https://www.reddit.com/user/' + h; }, color: '#FF4500', svg: '<path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm6.066 9.645c.183.049.365.088.544.167.648.288 1.07.893 1.07 1.583 0 .494-.2.964-.558 1.317-.06.06-.127.115-.196.167.034.246.051.494.051.746 0 2.614-3.044 4.735-6.796 4.735-3.752 0-6.796-2.121-6.796-4.735 0-.242.016-.484.048-.724-.082-.058-.16-.122-.228-.194-.354-.353-.554-.82-.554-1.312 0-.69.422-1.295 1.07-1.583.206-.09.421-.14.643-.164.22-.025.432.007.634.082.803-.586 1.82-.96 2.927-1.064l.584-2.755c.015-.072.06-.133.125-.17.065-.036.14-.044.212-.024l1.95.413c.203-.405.62-.672 1.084-.672.673 0 1.22.548 1.22 1.22s-.547 1.22-1.22 1.22-1.22-.548-1.22-1.22l-.002-.06-1.744-.37-.522 2.46c1.137.097 2.18.48 2.998 1.078.186-.07.383-.1.58-.078z"/>' },
    pinterest: { name: 'Pinterest', url: function (h) { return 'https://www.pinterest.com/' + h; }, follow: function (h) { return 'https://www.pinterest.com/' + h; }, color: '#E60023', svg: '<path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24 18.635 24 24.001 18.633 24.001 12.017 24.001 5.396 18.635 0 12.017 0z"/>' },
    mastodon: { name: 'Mastodon', url: function (h) { return h.indexOf('http') === 0 ? h : 'https://mastodon.social/@' + h; }, follow: function (h) { return h.indexOf('http') === 0 ? h : 'https://mastodon.social/@' + h; }, color: '#6364FF', svg: '<path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 00.023-.043v-1.809a.052.052 0 00-.02-.041.053.053 0 00-.046-.01 20.282 20.282 0 01-4.709.547c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 01-.319-1.433.053.053 0 01.066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545z"/>' },
    github: { name: 'GitHub', url: function (h) { return 'https://github.com/' + h; }, follow: function (h) { return 'https://github.com/' + h; }, color: '#f0f6fc', svg: '<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>' },
    spotify: { name: 'Spotify', url: function (h) { return 'https://open.spotify.com/artist/' + h; }, follow: function (h) { return 'https://open.spotify.com/artist/' + h; }, color: '#1DB954', svg: '<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>' },
    soundcloud: { name: 'SoundCloud', url: function (h) { return 'https://soundcloud.com/' + h; }, follow: function (h) { return 'https://soundcloud.com/' + h; }, color: '#FF5500', svg: '<path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.057-.049-.1-.084-.1zm-.899.828c-.06 0-.091.037-.104.094L0 14.479l.172 1.308c.013.06.045.094.09.094.052 0 .082-.034.095-.094l.201-1.308-.186-1.332c-.012-.057-.043-.094-.096-.094zm1.79-1.065c-.067 0-.112.063-.112.12l-.209 2.363.209 2.282c0 .06.045.112.112.112.06 0 .112-.052.112-.112l.24-2.282-.24-2.363c0-.057-.052-.12-.112-.12zm.899-.39c-.077 0-.135.06-.135.135l-.186 2.517.186 2.43c0 .075.06.135.135.135s.135-.06.135-.135l.21-2.43-.225-2.517c0-.075-.06-.135-.12-.135zm.9-.195c-.09 0-.15.075-.15.15l-.172 2.577.172 2.46c0 .082.06.15.15.15.082 0 .15-.068.15-.15l.195-2.46-.21-2.577c0-.075-.06-.15-.135-.15zm.89-.12c-.098 0-.165.075-.165.165l-.158 2.562.158 2.43c0 .09.068.165.165.165.09 0 .158-.075.158-.165l.18-2.43-.195-2.562c0-.09-.06-.165-.143-.165zm.9-.09c-.105 0-.18.082-.18.18l-.142 2.527.142 2.4c0 .098.075.18.18.18.098 0 .18-.082.18-.18l.158-2.4-.173-2.527c0-.098-.075-.18-.165-.18zm.9-.06c-.112 0-.195.09-.195.195l-.127 2.46.127 2.37c0 .105.082.195.195.195.105 0 .195-.09.195-.195l.142-2.37-.157-2.46c0-.105-.083-.195-.18-.195zm.9-.03c-.12 0-.21.098-.21.21l-.112 2.355.112 2.34c0 .112.09.21.21.21.112 0 .21-.098.21-.21l.127-2.34-.142-2.355c0-.112-.09-.21-.195-.21zm.9-.015c-.135 0-.225.105-.225.225l-.098 2.235.098 2.31c0 .12.09.225.225.225.127 0 .225-.105.225-.225l.112-2.31-.127-2.235c0-.12-.09-.225-.21-.225zm.899.015c-.142 0-.24.112-.24.24l-.082 2.085.082 2.28c0 .135.098.24.24.24.135 0 .24-.105.24-.24l.09-2.28-.105-2.085c0-.128-.098-.24-.225-.24zm.96-.225c-.15 0-.255.12-.255.255l-.082 2.175.082 2.205c0 .15.105.255.255.255.142 0 .255-.105.255-.255l.097-2.205-.112-2.175c0-.135-.105-.255-.24-.255zm.96-.195c-.157 0-.27.127-.27.27l-.075 2.235.075 2.13c0 .15.113.27.27.27.15 0 .27-.12.27-.27l.082-2.13-.097-2.235c0-.143-.113-.27-.255-.27zm.96-.15c-.165 0-.285.135-.285.285l-.06 2.25.06 2.058c0 .165.12.285.285.285.158 0 .285-.12.285-.285l.068-2.058-.083-2.25c0-.15-.12-.285-.27-.285zm2.56-1.26c-.21 0-.39.165-.39.39v4.875c0 .225.18.39.39.39h5.317c1.86 0 3.37-1.508 3.37-3.375 0-1.86-1.508-3.375-3.375-3.375-.63 0-1.222.18-1.724.487-.36-2.13-2.205-3.757-4.445-3.757-.63 0-1.23.127-1.785.36-.21.082-.27.172-.27.345v6.435c0 .225.165.39.39.405l.022.001z"/>' },
    patreon: { name: 'Patreon', url: function (h) { return 'https://www.patreon.com/' + h; }, follow: function (h) { return 'https://www.patreon.com/' + h; }, color: '#FF424D', svg: '<path d="M0 .48v23.04h4.22V.48zm15.385 0c-4.764 0-8.641 3.88-8.641 8.65 0 4.755 3.877 8.623 8.641 8.623 4.75 0 8.615-3.868 8.615-8.623C24 4.36 20.136.48 15.385.48z"/>' },
    kofi: { name: 'Ko-fi', url: function (h) { return 'https://ko-fi.com/' + h; }, follow: function (h) { return 'https://ko-fi.com/' + h; }, color: '#FF5E5B', svg: '<path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/>' },
    cashapp: { name: 'Cash App', url: function (h) { return 'https://cash.app/$' + h; }, follow: function (h) { return 'https://cash.app/$' + h; }, color: '#00D632', svg: '<path d="M23.59 3.47A5.1 5.1 0 0020.54.42C19.07 0 18.37 0 12 0S4.93 0 3.46.42A5.1 5.1 0 00.41 3.47C0 4.93 0 12 0 12s0 7.07.41 8.53a5.1 5.1 0 003.05 3.05c1.47.41 2.17.42 8.54.42s7.07 0 8.54-.42a5.1 5.1 0 003.05-3.05C24 19.07 24 12 24 12s0-7.07-.41-8.53zM17.3 16.05a3.48 3.48 0 01-2.47 1.05 3.97 3.97 0 01-.77-.08l-.31 1.26a.46.46 0 01-.45.35h-1.8a.46.46 0 01-.44-.6l.31-1.22a6.89 6.89 0 01-2.25-1.05.46.46 0 01-.06-.65l1-1.17a.46.46 0 01.6-.08 4.42 4.42 0 002.33.82 1.5 1.5 0 001.57-.93c.21-.51-.14-.85-1.46-1.27-1.65-.52-3.47-1.29-2.9-3.61a3.85 3.85 0 012.64-2.64 4.5 4.5 0 01.77-.18l.28-1.11a.46.46 0 01.44-.35h1.81a.46.46 0 01.44.6l-.28 1.1a5.84 5.84 0 011.73.76.46.46 0 01.08.65l-.9 1.14a.46.46 0 01-.58.11 4.07 4.07 0 00-2-.65 1.3 1.3 0 00-1.38.8c-.18.46.11.74 1.46 1.19 1.84.62 3.3 1.46 2.76 3.57z"/>' },
    venmo: { name: 'Venmo', url: function (h) { return 'https://venmo.com/' + h; }, follow: function (h) { return 'https://venmo.com/' + h; }, color: '#008CFF', svg: '<path d="M20.396 3.113c.75 1.275 1.087 2.587 1.087 4.238 0 5.287-4.5 12.15-8.175 16.987H5.22L2.017 1.85l7.088-.675 1.762 14.25c1.65-2.7 3.675-6.937 3.675-9.862 0-1.575-.263-2.65-.675-3.525L20.396 3.113z"/>' },
    paypal: { name: 'PayPal', url: function (h) { return 'https://paypal.me/' + h; }, follow: function (h) { return 'https://paypal.me/' + h; }, color: '#00457C', svg: '<path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 00-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 00-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 00.554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 01.923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>' },
    website: { name: 'Website', url: function (h) { return h.indexOf('http') === 0 ? h : 'https://' + h; }, follow: function (h) { return h.indexOf('http') === 0 ? h : 'https://' + h; }, color: '#64ffda', svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>' },
    calendly: { name: 'Calendly', url: function (h) { return h.indexOf('http') === 0 ? h : 'https://calendly.com/' + h; }, follow: function (h) { return h.indexOf('http') === 0 ? h : 'https://calendly.com/' + h; }, color: '#006BFF', svg: '<path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/>' },
    substack: { name: 'Substack', url: function (h) { return 'https://' + h + '.substack.com'; }, follow: function (h) { return 'https://' + h + '.substack.com'; }, color: '#FF6719', svg: '<path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>' },
    medium: { name: 'Medium', url: function (h) { return 'https://medium.com/@' + h; }, follow: function (h) { return 'https://medium.com/@' + h; }, color: '#fff', svg: '<path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>' },
  };

  // ── Decode profile (same format as main app) ────────────────────
  function decodeProfile(hash) {
    try {
      var data = JSON.parse(decodeURIComponent(atob(hash)));
      return {
        name: data.n || '',
        handle: data.h || '',
        bio: data.b || '',
        theme: data.t || 'midnight',
        email: data.e || '',
        phone: data.p || '',
        socials: data.s || {},
        customLinks: data.cl || [],
      };
    } catch (e) {
      return null;
    }
  }

  // ── Generate vCard ──────────────────────────────────────────────
  function generateVCard(profile) {
    var lines = ['BEGIN:VCARD', 'VERSION:3.0', 'FN:' + (profile.name || 'LockedIn User')];
    if (profile.bio) lines.push('NOTE:' + profile.bio);
    if (profile.email) lines.push('EMAIL:' + profile.email);
    if (profile.phone) lines.push('TEL:' + profile.phone);
    Object.keys(profile.socials).forEach(function (key) {
      var handle = profile.socials[key];
      if (!handle || !handle.trim()) return;
      var p = PLATFORMS[key];
      if (p) lines.push('URL;type=' + p.name + ':' + p.url(handle));
    });
    (profile.customLinks || []).forEach(function (cl) {
      if (cl.url && cl.url.trim()) lines.push('URL;type=' + (cl.label || 'Link') + ':' + cl.url);
    });
    lines.push('END:VCARD');
    return lines.join('\r\n');
  }

  function downloadVCard(profile) {
    var blob = new Blob([generateVCard(profile)], { type: 'text/vcard;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (profile.name || 'contact').replace(/\s+/g, '_') + '.vcf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ── SVG helper ──────────────────────────────────────────────────
  function svgIcon(pathData, size) {
    return '<svg viewBox="0 0 24 24" fill="currentColor" width="' + (size || 16) + '" height="' + (size || 16) + '">' + pathData + '</svg>';
  }

  // ── Follow All logic ────────────────────────────────────────────
  function followAll(profile) {
    var keys = Object.keys(profile.socials).filter(function (k) {
      return profile.socials[k] && profile.socials[k].trim() && PLATFORMS[k];
    });
    keys.forEach(function (key, i) {
      setTimeout(function () {
        window.open(PLATFORMS[key].follow(profile.socials[key]), '_blank', 'noopener');
      }, i * 600);
    });
  }

  // ── Inject CSS ──────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('lkin-widget-styles')) return;
    var style = document.createElement('style');
    style.id = 'lkin-widget-styles';
    style.textContent = [
      '.lkin-reset,.lkin-reset *{all:revert;box-sizing:border-box;font-family:"Outfit","Segoe UI",system-ui,-apple-system,sans-serif;}',
      '@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap");',
      '.lkin-fab{position:fixed;bottom:20px;right:20px;z-index:999999;cursor:pointer;background:linear-gradient(135deg,#ff2d78,#ff6b35);color:#fff;border:none;border-radius:50px;padding:10px 20px;font-size:14px;font-weight:600;font-family:"Outfit",sans-serif;display:flex;align-items:center;gap:8px;box-shadow:0 4px 24px rgba(255,45,120,0.4);transition:all 0.3s cubic-bezier(0.4,0,0.2,1);letter-spacing:0.5px;}',
      '.lkin-fab:hover{transform:translateY(-2px);box-shadow:0 6px 32px rgba(255,45,120,0.5);}',
      '.lkin-fab svg{width:18px;height:18px;fill:currentColor;}',
      '.lkin-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999998;opacity:0;transition:opacity 0.3s;pointer-events:none;}',
      '.lkin-overlay.lkin-open{opacity:1;pointer-events:auto;}',
      '.lkin-card-wrap{position:fixed;bottom:80px;right:20px;z-index:999999;opacity:0;transform:translateY(16px) scale(0.95);transition:all 0.35s cubic-bezier(0.4,0,0.2,1);pointer-events:none;}',
      '.lkin-card-wrap.lkin-open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}',
      '.lkin-card-wrap.lkin-inline{position:relative;bottom:auto;right:auto;opacity:1;transform:none;pointer-events:auto;}',
      '.lkin-card{width:340px;max-width:90vw;background:rgba(10,10,18,0.92);backdrop-filter:blur(24px) saturate(1.4);-webkit-backdrop-filter:blur(24px) saturate(1.4);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:28px 24px 20px;color:#fff;box-shadow:0 8px 48px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.05);}',
      '.lkin-avatar{width:64px;height:64px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,0.1);display:block;margin:0 auto 12px;}',
      '.lkin-avatar-placeholder{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#ff2d78,#ff6b35);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:28px;font-weight:700;color:#fff;font-family:"Space Mono",monospace;}',
      '.lkin-name{text-align:center;font-size:20px;font-weight:700;margin:0 0 2px;letter-spacing:-0.3px;}',
      '.lkin-handle{text-align:center;font-size:13px;color:rgba(255,255,255,0.45);margin:0 0 6px;font-family:"Space Mono",monospace;}',
      '.lkin-bio{text-align:center;font-size:12px;color:rgba(255,255,255,0.5);margin:0 0 16px;line-height:1.4;}',
      '.lkin-follow-btn{display:block;width:100%;padding:12px;border:none;border-radius:12px;background:linear-gradient(135deg,#ff2d78,#ff6b35);color:#fff;font-size:15px;font-weight:600;font-family:"Outfit",sans-serif;cursor:pointer;transition:all 0.2s;letter-spacing:0.3px;}',
      '.lkin-follow-btn:hover{filter:brightness(1.1);transform:translateY(-1px);}',
      '.lkin-follow-btn:active{transform:translateY(0);}',
      '.lkin-platforms{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:16px 0 12px;}',
      '.lkin-plat-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.06);cursor:pointer;transition:all 0.2s;color:rgba(255,255,255,0.7);text-decoration:none;}',
      '.lkin-plat-icon:hover{background:rgba(255,255,255,0.12);color:#fff;transform:translateY(-2px);border-color:rgba(255,255,255,0.15);}',
      '.lkin-actions{display:flex;gap:8px;margin-top:12px;}',
      '.lkin-action-btn{flex:1;padding:9px 0;border:1px solid rgba(255,255,255,0.1);border-radius:10px;background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.7);font-size:12px;font-weight:500;font-family:"Outfit",sans-serif;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:5px;text-decoration:none;}',
      '.lkin-action-btn:hover{background:rgba(255,255,255,0.1);color:#fff;border-color:rgba(255,255,255,0.2);}',
      '.lkin-powered{text-align:center;margin-top:14px;font-size:11px;}',
      '.lkin-powered a{color:rgba(255,255,255,0.3);text-decoration:none;font-family:"Space Mono",monospace;transition:color 0.2s;}',
      '.lkin-powered a:hover{color:rgba(255,255,255,0.6);}',
      '.lkin-close{position:absolute;top:12px;right:14px;background:none;border:none;color:rgba(255,255,255,0.3);cursor:pointer;font-size:18px;line-height:1;padding:4px;transition:color 0.2s;}',
      '.lkin-close:hover{color:#fff;}',
    ].join('\n');
    document.head.appendChild(style);
  }

  // ── Build the card HTML ─────────────────────────────────────────
  function buildCard(profile, isInline) {
    var socials = profile.socials || {};
    var keys = Object.keys(socials).filter(function (k) { return socials[k] && socials[k].trim() && PLATFORMS[k]; });
    var githubHandle = socials.github ? socials.github.trim() : null;
    var avatarHtml;
    if (githubHandle) {
      avatarHtml = '<img class="lkin-avatar" src="https://github.com/' + githubHandle + '.png?size=128" alt="" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"/>' +
        '<div class="lkin-avatar-placeholder" style="display:none">' + (profile.name ? profile.name.charAt(0).toUpperCase() : '?') + '</div>';
    } else {
      avatarHtml = '<div class="lkin-avatar-placeholder">' + (profile.name ? profile.name.charAt(0).toUpperCase() : '?') + '</div>';
    }

    var platformsHtml = keys.map(function (key) {
      var p = PLATFORMS[key];
      return '<a class="lkin-plat-icon" href="' + p.url(socials[key]) + '" target="_blank" rel="noopener" title="' + p.name + '" style="color:' + p.color + '">' + svgIcon(p.svg, 18) + '</a>';
    }).join('');

    var customLinksHtml = (profile.customLinks || []).filter(function (cl) { return cl.url && cl.url.trim(); }).map(function (cl) {
      return '<a class="lkin-plat-icon" href="' + cl.url + '" target="_blank" rel="noopener" title="' + (cl.label || 'Link') + '" style="color:#64ffda">' + svgIcon('<path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>', 18) + '</a>';
    }).join('');

    var contactSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/></svg>';
    var linkSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>';

    var profileHash = '';
    try {
      var currentScript = document.querySelector('script[data-profile]');
      if (currentScript) profileHash = currentScript.getAttribute('data-profile');
    } catch (e) {}

    var html = '<div class="lkin-card" style="position:relative;">' +
      (isInline ? '' : '<button class="lkin-close" data-lkin-close title="Close">&times;</button>') +
      avatarHtml +
      '<p class="lkin-name">' + (profile.name || 'Anonymous') + '</p>' +
      (profile.handle ? '<p class="lkin-handle">@' + profile.handle + '</p>' : '') +
      (profile.bio ? '<p class="lkin-bio">' + profile.bio + '</p>' : '') +
      (keys.length > 0 ? '<button class="lkin-follow-btn" data-lkin-follow>Follow on ' + keys.length + ' Platform' + (keys.length > 1 ? 's' : '') + '</button>' : '') +
      '<div class="lkin-platforms">' + platformsHtml + customLinksHtml + '</div>' +
      '<div class="lkin-actions">' +
        '<button class="lkin-action-btn" data-lkin-vcard>' + contactSvg + ' Save Contact</button>' +
        '<a class="lkin-action-btn" href="' + LKIN_BASE + '#' + profileHash + '" target="_blank" rel="noopener">' + linkSvg + ' Full Profile</a>' +
      '</div>' +
      '<div class="lkin-powered"><a href="' + LKIN_BASE + '" target="_blank" rel="noopener">Powered by LockedIn</a></div>' +
    '</div>';

    return html;
  }

  // ── Initialize ──────────────────────────────────────────────────
  function init() {
    var scripts = document.querySelectorAll('script[data-profile]');
    var script = scripts[scripts.length - 1]; // last one is ours
    if (!script) return;

    var profileHash = script.getAttribute('data-profile');
    var mode = script.getAttribute('data-mode') || 'button';

    if (!profileHash) return;

    var profile = decodeProfile(profileHash);
    if (!profile) return;

    injectStyles();

    if (mode === 'inline') {
      renderInline(script, profile);
    } else {
      renderButton(profile);
    }
  }

  function renderInline(script, profile) {
    var container = document.createElement('div');
    container.className = 'lkin-reset';
    var wrap = document.createElement('div');
    wrap.className = 'lkin-card-wrap lkin-inline';
    wrap.innerHTML = buildCard(profile, true);
    container.appendChild(wrap);
    script.parentNode.insertBefore(container, script.nextSibling);
    bindCardEvents(wrap, profile);
  }

  function renderButton(profile) {
    // FAB button
    var fab = document.createElement('button');
    fab.className = 'lkin-reset lkin-fab';
    fab.innerHTML = '<svg viewBox="0 0 24 24"><path d="M13.73 21a2 2 0 01-3.46 0M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> LockedIn';
    document.body.appendChild(fab);

    // Overlay
    var overlay = document.createElement('div');
    overlay.className = 'lkin-overlay';
    document.body.appendChild(overlay);

    // Card
    var cardWrap = document.createElement('div');
    cardWrap.className = 'lkin-reset lkin-card-wrap';
    cardWrap.innerHTML = buildCard(profile, false);
    document.body.appendChild(cardWrap);

    var isOpen = false;

    function toggle() {
      isOpen = !isOpen;
      cardWrap.classList.toggle('lkin-open', isOpen);
      overlay.classList.toggle('lkin-open', isOpen);
    }

    fab.addEventListener('click', toggle);
    overlay.addEventListener('click', toggle);

    // Close button inside card
    var closeBtn = cardWrap.querySelector('[data-lkin-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (isOpen) toggle();
      });
    }

    bindCardEvents(cardWrap, profile);
  }

  function bindCardEvents(container, profile) {
    var followBtn = container.querySelector('[data-lkin-follow]');
    if (followBtn) {
      followBtn.addEventListener('click', function () {
        followAll(profile);
        this.textContent = 'Opening...';
        var btn = this;
        setTimeout(function () { btn.textContent = 'Done!'; }, 2000);
        setTimeout(function () {
          var keys = Object.keys(profile.socials).filter(function (k) { return profile.socials[k] && profile.socials[k].trim() && PLATFORMS[k]; });
          btn.textContent = 'Follow on ' + keys.length + ' Platform' + (keys.length > 1 ? 's' : '');
        }, 4000);
      });
    }

    var vcardBtn = container.querySelector('[data-lkin-vcard]');
    if (vcardBtn) {
      vcardBtn.addEventListener('click', function () {
        downloadVCard(profile);
      });
    }
  }

  // ── Boot ────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
