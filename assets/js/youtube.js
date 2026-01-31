// ================================
// REAL YouTube Channel Fetch Logic
// ================================

const YT_API_KEY = "PASTE_YOUR_API_KEY_HERE";

// Extract channel identifier
async function getChannelId(input) {
  input = input.trim();

  // Handle (@username)
  if (input.startsWith("@")) {
    const searchURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${input.substring(1)}&key=${YT_API_KEY}`;
    const res = await fetch(searchURL).then(r => r.json());
    return res.items?.[0]?.snippet?.channelId || null;
  }

  // Channel URL
  const match = input.match(/channel\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  return null;
}

// Fetch channel details
async function fetchChannelData(channelId) {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YT_API_KEY}`;
  const res = await fetch(url).then(r => r.json());
  return res.items?.[0] || null;
}

// Smart RPM estimate
function estimateRPM(country) {
  if (country === "US") return 6;
  if (country === "IN") return 1;
  return 3;
}

// MAIN ANALYZER
async function analyzeChannel() {
  const input = document.getElementById("channelInput").value;
  if (!input) return alert("Enter Channel URL or @handle");

  const channelId = await getChannelId(input);
  if (!channelId) return alert("Channel not found");

  const data = await fetchChannelData(channelId);
  if (!data) return alert("Failed to fetch channel data");

  const subs = Number(data.statistics.subscriberCount);
  const totalViews = Number(data.statistics.viewCount);
  const videos = Number(data.statistics.videoCount);
  const country = data.snippet.country || "Global";
  const logo = data.snippet.thumbnails.high.url;

  // Earnings estimate
  const rpm = estimateRPM(country);
  const dailyViews = totalViews / 365;
  const daily = (dailyViews / 1000) * rpm;

  // Render UI
  document.getElementById("chLogo").src = logo;
  document.getElementById("chName").innerText = data.snippet.title;
  document.getElementById("chSubs").innerText = subs.toLocaleString();
  document.getElementById("chViews").innerText = totalViews.toLocaleString();
  document.getElementById("chVideos").innerText = videos;
  document.getElementById("chCountry").innerText = country;

  document.getElementById("daily").innerText = `$${daily.toFixed(2)}`;
  document.getElementById("monthly").innerText = `$${(daily * 30).toFixed(2)}`;
  document.getElementById("yearly").innerText = `$${(daily * 365).toFixed(2)}`;
}
