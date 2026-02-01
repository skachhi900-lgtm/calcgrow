// =============================
// YOUTUBE INTELLIGENCE ENGINE (RANGE EDITION)
// =============================

// ⚠️ IMPORTANT: Yahan apni API KEY paste karein
const YT_API_KEY = "AIzaSyB3e5jwd1Y-5fTWH2w4u62eO-_wVqYDJx0"; 

// Helper: Format Numbers (1.2M)
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
}

// Helper: Format Money Range ($1K - $2K)
function formatMoneyRange(min, max, symbol) {
    // Agar number bada hai to 'K' ya 'M' use karenge space bachane ke liye
    const fmt = (n) => {
        if(n >= 1000000) return (n/1000000).toFixed(1) + 'M';
        if(n >= 1000) return (n/1000).toFixed(1) + 'K';
        return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
    };
    return `${symbol}${fmt(min)} - ${symbol}${fmt(max)}`;
}

// 1. MAIN FUNCTION: Analyze Channel
async function analyzeChannel() {
    let input = document.getElementById('channelInput').value.trim();
    const btn = document.querySelector('.analyze-btn');
    
    if (!input) { alert("Please enter a channel name!"); return; }

    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Scanning...';
    
    try {
        // Search Channel
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(input)}&key=${YT_API_KEY}&maxResults=1`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        if (searchData.items && searchData.items.length > 0) {
            const channelId = searchData.items[0].snippet.channelId;
            
            // Get Stats
            const statsUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YT_API_KEY}`;
            const statsRes = await fetch(statsUrl);
            const statsData = await statsRes.json();
            
            if (statsData.items && statsData.items.length > 0) {
                updateUI(statsData.items[0]);
            } else {
                throw new Error("Stats not found");
            }
        } else {
            alert("Channel not found! Please check the name.");
        }
    } catch (error) {
        console.error(error);
        alert("System Error: Check your API Key or Quota limit.");
    }
    btn.innerText = 'Fetch Data';
}

// 2. UPDATE UI
function updateUI(channel) {
    document.getElementById('channelData').style.display = 'flex';
    document.getElementById('chName').innerText = channel.snippet.title;
    document.getElementById('chSubs').innerText = formatNumber(channel.statistics.subscriberCount) + " Subscribers";
    document.getElementById('chLogo').src = channel.snippet.thumbnails.high.url;

    // Smart Estimation Logic
    // Active channels get approx 2-5% of subs as daily views
    let subs = parseInt(channel.statistics.subscriberCount);
    let estimatedDailyViews = subs * 0.03; // 3% Activity
    
    // Limits Update (Ab MrBeast ke liye limit 50M hai)
    if (estimatedDailyViews < 1000) estimatedDailyViews = 1000;
    if (estimatedDailyViews > 50000000) estimatedDailyViews = 50000000; 

    // Update Slider & Slider Max Value dynamically
    let slider = document.getElementById('viewSlider');
    slider.max = 50000000; // Increase slider capacity
    slider.value = estimatedDailyViews;
    
    manualUpdate(estimatedDailyViews);
}

// 3. SLIDER UPDATE
function manualUpdate(val) {
    document.getElementById('viewsVal').innerText = parseInt(val).toLocaleString();
    reCalculate();
}

// 4. RANGE CALCULATION ENGINE
function reCalculate() {
    let dailyViews = document.getElementById('viewSlider').value;
    let baseRPM = parseFloat(document.getElementById('nicheSelect').value);
    
    // Get Currency
    let currencyElem = document.getElementById('currencySelect');
    let currency = currencyElem ? currencyElem.value : "USD";

    // LOGIC: Create a Range (Min = -20%, Max = +30% of base RPM)
    // Youtube earnings fluctuate, so we give a realistic spread
    let minRPM = baseRPM * 0.8; 
    let maxRPM = baseRPM * 1.5; // Good days earn more

    // Calculate in USD
    let minDailyUSD = (dailyViews / 1000) * minRPM;
    let maxDailyUSD = (dailyViews / 1000) * maxRPM;

    // Currency Conversion
    let rate = 1;
    let symbol = "$";

    if (currency === "INR") { rate = 85; symbol = "₹"; }
    if (currency === "EUR") { rate = 0.92; symbol = "€"; }
    if (currency === "GBP") { rate = 0.79; symbol = "£"; }

    // Display Ranges (Daily, Monthly, Yearly)
    document.getElementById('dailyRes').innerText = formatMoneyRange(minDailyUSD * rate, maxDailyUSD * rate, symbol);
    
    document.getElementById('monthlyRes').innerText = formatMoneyRange(
        (minDailyUSD * 30) * rate, 
        (maxDailyUSD * 30) * rate, 
        symbol
    );
    
    document.getElementById('yearlyRes').innerText = formatMoneyRange(
        (minDailyUSD * 365) * rate, 
        (maxDailyUSD * 365) * rate, 
        symbol
    );
}

// Ini
t
reCalculate();
