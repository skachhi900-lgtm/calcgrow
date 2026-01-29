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
function calculateEMI() {
    const p = document.getElementById('loanAmount').value;
    const r = document.getElementById('interestRate').value / 1200;
    const n = document.getElementById('loanTenure').value * 12;
    if(p && n) {
        const emi = p * r * (Math.pow(1+r, n) / (Math.pow(1+r, n)-1));
        document.getElementById('emiResult').innerText = "₹" + emi.toFixed(0);
    }
}

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

/* --- YOUTUBE ADVANCED LOGIC --- */

// Global Variables
let currentCurrency = "$";
let exchangeRate = 1; // 1 USD

// 1. Tab Switcher
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// 2. Search & Simulate Channel Data
function searchChannel() {
    const input = document.getElementById('ytInput').value;
    if(!input) return alert("Please enter a Link or Handle!");

    // Show Loading
    document.getElementById('channelName').innerText = "Searching...";
    
    setTimeout(() => {
        // Fake Data Simulation
        document.getElementById('channelName').innerText = input.includes('@') ? input : "YouTube Creator";
        document.getElementById('subCount').innerText = "Subscribers: " + Math.floor(Math.random() * 500) + "K (Estimated)";
        document.getElementById('channelLogo').src = "https://cdn-icons-png.flaticon.com/512/1384/1384060.png"; // Generic YT Logo
        
        // Show the Dashboard
        document.getElementById('dashboardResults').style.display = 'block';
        calculateEarnings(); // Auto calculate based on default views
    }, 1000);
}

// 3. Currency Changer
function changeCurrency() {
    const curr = document.getElementById('currencySelector').value;
    if(curr === "USD") { currentCurrency = "$"; exchangeRate = 1; }
    else if(curr === "INR") { currentCurrency = "₹"; exchangeRate = 83; } // Approx rate
    else if(curr === "EUR") { currentCurrency = "€"; exchangeRate = 0.92; }
    
    calculateEarnings(); // Recalculate with new currency
}

// 4. MAIN EARNINGS CALCULATOR
function calculateEarnings() {
    let views = parseFloat(document.getElementById('ytViews').value);
    let rpm = parseFloat(document.getElementById('ytRpm').value);

    if(!views) views = 10000; // Default fallback

    // Math: (Views / 1000) * RPM * ExchangeRate
    const daily = (views / 1000) * rpm * exchangeRate;
    const weekly = daily * 7;
    const monthly = daily * 30;
    const yearly = daily * 365;

    // Update Text
    document.getElementById('valDaily').innerText = currentCurrency + daily.toFixed(0);
    document.getElementById('valWeekly').innerText = currentCurrency + weekly.toFixed(0);
    document.getElementById('valMonthly').innerText = currentCurrency + monthly.toFixed(0);
    document.getElementById('valYearly').innerText = currentCurrency + yearly.toLocaleString();

    // Update Bars (Visuals)
    document.getElementById('barDaily').style.height = "20%";
    document.getElementById('barWeekly').style.height = "40%";
    document.getElementById('barMonthly').style.height = "70%";
    document.getElementById('barYearly').style.height = "100%";
}

// 5. TRANSCRIPT GENERATOR (Simulation)
function generateTranscript() {
    const url = document.getElementById('videoUrl').value;
    const box = document.getElementById('transcriptText');
    
    if(!url) return alert("Paste a video link!");

    box.innerText = "Fetching transcript...";
    
    setTimeout(() => {
        box.innerHTML = `<strong>[00:00]</strong> Hello everyone, welcome back to the channel.\n\n<strong>[00:05]</strong> Today we are discussing how to grow on YouTube.\n\n<strong>[00:15]</strong> Make sure to like and subscribe for more tools.\n\n(Note: Real-time full transcript generation requires a backend server. This is a demo of how the text would appear.)`;
    }, 1500);
}


