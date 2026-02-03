/* --- SOCIAL MEDIA --- */
function calculateYoutube() {
    const views = document.getElementById('ytViews').value;
    const rpm = document.getElementById('ytRpm').value;
    if(views) {
        document.getElementById('ytResult').innerText = "$" + ((views/1000)*rpm*30).toFixed(0);
    } else { alert("Enter views"); }
}

function calculateInsta() {
    const followers = document.getElementById('instaFollowers').value;
    const rate = document.getElementById('instaRate').value;
    if(followers) {
        const earning = (followers * rate / 100) * 10; 
        document.getElementById('instaResult').innerText = "$" + earning.toFixed(0);
    } else { alert("Enter followers"); }
}

/* --- FINANCE --- */


function calculateSIP() {
    const p = document.getElementById('sipAmount').value;
    const r = document.getElementById('sipRate').value / 1200;
    const n = document.getElementById('sipYears').value * 12;
    if(p) {
        const res = p * ((Math.pow(1+r, n)-1)/r) * (1+r);
        document.getElementById('sipResult').innerText = "₹" + res.toFixed(0);
    }
}

function calculateGST() {
    const amt = parseFloat(document.getElementById('gstAmount').value);
    const tax = parseFloat(document.getElementById('gstRate').value);
    if(amt) {
        document.getElementById('gstResult').innerText = "Total: ₹" + (amt + (amt*tax/100)).toFixed(2);
    }
}

function calculateFD() {
    const p = parseFloat(document.getElementById('fdAmount').value);
    const r = parseFloat(document.getElementById('fdRate').value);
    const t = parseFloat(document.getElementById('fdYears').value);
    if(p) {
        const maturity = p + ((p*r*t)/100);
        document.getElementById('fdResult').innerText = "₹" + maturity.toFixed(0);
    }
}

/* --- DAILY LIFE --- */
function calculateAge() {
    const d1 = document.getElementById('birthDate').value;
    if(d1) {
        const birth = new Date(d1);
        const diff = new Date() - birth;
        const years = Math.abs(new Date(diff).getUTCFullYear() - 1970);
        document.getElementById('ageResult').innerText = years + " Years";
    }
}

function calculateBMI() {
    const w = parseFloat(document.getElementById('weight').value);
    const h = parseFloat(document.getElementById('height').value) / 100; 
    if(w && h) {
        const bmi = w / (h * h);
        document.getElementById('bmiResult').innerText = "BMI: " + bmi.toFixed(1);
    }
}

function calculateDiscount() {
    const price = document.getElementById('price').value;
    const disc = document.getElementById('discPercent').value;
    if(price) {
        const final = price - (price * disc / 100);
        document.getElementById('discResult').innerText = "Pay: ₹" + final.toFixed(2);
    }
}

function calculatePercent() {
    const num = document.getElementById('perNum').value;
    const total = document.getElementById('perTotal').value;
    if(num && total) {
        const res = (num / total) * 100;
        document.getElementById('perResult').innerText = res.toFixed(2) + "%";
        
    }
}

/* --- YOUTUBE REAL API LOGIC --- */

// 🔴 APNI API KEY YAHAN PASTE KARO 🔴
const YOUTUBE_API_KEY = 'AIzaSyB3e5jwd1Y-5fTWH2w4u62eO-_wVqYDJx0'; 

let currentCurrency = "$";
let exchangeRate = 1;

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// 1. FETCH REAL DATA
async function fetchRealData() {
    let input = document.getElementById('ytInput').value.trim();
    if (!input) return alert("Please enter a handle (e.g. @MrBeast)");

    // Handle se 'forHandle' use hota hai API me
    // Agar user ne '@' nahi lagaya to hum laga denge
    if (!input.startsWith('@')) input = '@' + input;

    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=${input}&key=${YOUTUBE_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const channel = data.items[0];
            
            // UI Update karo Real Data se
            document.getElementById('channelName').innerText = channel.snippet.title;
            document.getElementById('channelLogo').src = channel.snippet.thumbnails.medium.url;
            
            // Subscriber Count Format (e.g. 1000000 -> 1M)
            let subs = channel.statistics.subscriberCount;
            if(subs > 1000000) subs = (subs/1000000).toFixed(1) + "M";
            else if(subs > 1000) subs = (subs/1000).toFixed(1) + "K";
            
            document.getElementById('subCount').innerText = "Subscribers: " + subs;

            // Show Dashboard
            document.getElementById('dashboardResults').style.display = 'block';
            calculateEarnings(); // Default calculation
        } else {
            alert("Channel not found! Check spelling.");
        }
    } catch (error) {
        console.error(error);
        alert("API Error! Check Key or Quota.");
    }
}

// 2. EARNINGS MATH
function calculateEarnings() {
    let views = document.getElementById('ytViews').value;
    let rpm = document.getElementById('ytRpm').value;
    
    if(!views) views = 0;
    
    let daily = (views / 1000) * rpm * exchangeRate;
    
    document.getElementById('valDaily').innerText = currentCurrency + daily.toFixed(0);
    document.getElementById('valMonthly').innerText = currentCurrency + (daily * 30).toFixed(0);
    document.getElementById('valYearly').innerText = currentCurrency + (daily * 365).toLocaleString();
}

// 3. CURRENCY
function changeCurrency() {
    const curr = document.getElementById('currencySelector').value;
    if(curr === "USD") { currentCurrency = "$"; exchangeRate = 1; }
    else if(curr === "INR") { currentCurrency = "₹"; exchangeRate = 84; }
    calculateEarnings();
}

// 4. TRANSCRIPT (Demo - Real requires Backend)
function generateTranscript() {
    document.getElementById('transcriptText').innerText = "Fetching transcript...\n(Note: Real transcripts require a backend server. This is a demo view.)";
}

/* =========================================
   WORLD CLASS GAMIFICATION SYSTEM (BETA)
   ========================================= */

// 1. STREAK SYSTEM (Daily Visits)
function updateStreak() {
    const today = new Date().toDateString();
    let lastVisit = localStorage.getItem('lastVisit');
    let streakCount = parseInt(localStorage.getItem('streakCount') || '0');

    if (lastVisit === today) {
        // Already visited today, do nothing
    } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastVisit === yesterday.toDateString()) {
            // Consecutive day
            streakCount++;
        } else {
            // Streak broken (but hum pehle din 1 de dete hain encourage karne ke liye)
            streakCount = 1; 
        }
        
        localStorage.setItem('lastVisit', today);
        localStorage.setItem('streakCount', streakCount);
    }
    
    // UI Update karo (Agar element exist karta hai)
    const streakDisplay = document.getElementById('user-streak');
    if(streakDisplay) {
        streakDisplay.innerText = `${streakCount} Day Streak`;
    }
}

// Run immediately
updateStreak();

// 2. FAKE LIVE LEADERBOARD (Premium Feel)
// Kyunki abhi database nahi hai, hum 'simulation' dikhayenge jo real lage
const creators = [
    { name: "TechBurner Fan", revenue: "$4.2K" },
    { name: "Vlog King", revenue: "$3.8K" },
    { name: "Crypto Guide", revenue: "$9.1K" },
    { name: "You", revenue: "Analyzing..." } // User ko list mein dikhana
];

function renderLeaderboard() {
    const board = document.getElementById('leaderboard-list');
    if(!board) return;

    let html = '';
    creators.forEach((creator, index) => {
        let rankClass = index === 0 ? 'color: #FFD700;' : 'color: white;'; // Gold for #1
        html += `
        <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #333;">
            <span style="${rankClass} font-weight: bold;">#${index + 1} ${creator.name}</span>
            <span style="color: #4CAF50;">${creator.revenue}</span>
        </div>`;
    });
    board.innerHTML = h
        tml;
}
