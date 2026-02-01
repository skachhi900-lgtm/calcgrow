// =============================
// YOUTUBE INTELLIGENCE ENGINE (SMART SEARCH)
// =============================

// ⚠️ IMPORTANT: Yahan apni API KEY paste karein
const YT_API_KEY = "AIzaSyB3e5jwd1Y-5fTWH2w4u62eO-_wVqYDJx0"; 

// Helper: Format Numbers (1,200,000 -> 1.2M)
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
}

// Helper: Money Formatter
function formatMoney(amount, symbol) {
    return symbol + amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

// 1. MAIN FUNCTION: Analyze Channel
async function analyzeChannel() {
    let input = document.getElementById('channelInput').value.trim();
    const btn = document.querySelector('.analyze-btn');
    
    if (!input) { alert("Please enter a channel name!"); return; }

    // Loading State
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Scanning...';
    
    try {
        // STEP 1: Search for the channel (Smart Search)
        // Ye spelling mistakes aur bina '@' handle ko bhi dhoond lega
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(input)}&key=${YT_API_KEY}&maxResults=1`;
        
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        if (searchData.items && searchData.items.length > 0) {
            const channelId = searchData.items[0].snippet.channelId;
            
            // STEP 2: Fetch Full Statistics using Channel ID
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
        // Agar API Key galat hai ya Quota khatam ho gaya hai
        alert("System Error: Check your API Key or Quota limit.");
    }

    // Reset Button
    btn.innerText = 'Fetch Data';
}

// 2. UPDATE UI (Photo, Name, Subs)
function updateUI(channel) {
    // Show the hidden Channel Card
    document.getElementById('channelData').style.display = 'flex';
    
    // Set Data
    document.getElementById('chName').innerText = channel.snippet.title;
    document.getElementById('chSubs').innerText = formatNumber(channel.statistics.subscriberCount) + " Subscribers";
    document.getElementById('chLogo').src = channel.snippet.thumbnails.high.url;

    // Smart Estimation Logic
    // Active channels get approx 1% - 5% of their sub count as daily views
    let subs = parseInt(channel.statistics.subscriberCount);
    let totalViews = parseInt(channel.statistics.viewCount);
    
    // Algorithm: Agar views hidden hain toh Subs ka 2% maano
    let estimatedDailyViews = subs * 0.02; 
    
    if (estimatedDailyViews < 1000) estimatedDailyViews = 1000;
    if (estimatedDailyViews > 5000000) estimatedDailyViews = 5000000; // Max cap for slider

    // Update Slider
    document.getElementById('viewSlider').value = estimatedDailyViews;
    
    // Trigger Calculation
    manualUpdate(estimatedDailyViews);
}

// 3. SLIDER UPDATE (Visuals)
function manualUpdate(val) {
    document.getElementById('viewsVal').innerText = parseInt(val).toLocaleString();
    reCalculate();
}

// 4. MONEY CALCULATION ENGINE (Currency Support Added)
function reCalculate() {
    let dailyViews = document.getElementById('viewSlider').value;
    let rpm = parseFloat(document.getElementById('nicheSelect').value);
    
    // Get Currency Selection (Agar dropdown HTML mein nahi hai to default USD lega)
    let currencyElem = document.getElementById('currencySelect');
    let currency = currencyElem ? currencyElem.value : "USD";

    // Step 1: Calculate in USD
    let dailyEarnUSD = (dailyViews / 1000) * rpm;
    let monthlyEarnUSD = dailyEarnUSD * 30;
    let yearlyEarnUSD = dailyEarnUSD * 365;

    // Step 2: Convert Currency
    let rate = 1;
    let symbol = "$";

    if (currency === "INR") { rate = 85; symbol = "₹"; }
    if (currency === "EUR") { rate = 0.92; symbol = "€"; }
    if (currency === "GBP") { rate = 0.79; symbol = "£"; }

    // Step 3: Update Screen
    document.getElementById('dailyRes').innerText = formatMoney(dailyEarnUSD * rate, symbol);
    document.getElementById('monthlyRes').innerText = formatMoney(monthlyEarnUSD * rate, symbol);
    document.getElementById('yearlyRes').innerText = formatMoney(yearlyEarnUSD * rate, symbol);
}

// Initialize on Lo
ad
reCalculate();
