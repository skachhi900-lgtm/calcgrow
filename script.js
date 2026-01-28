// Navigation Functions
function openCalc(id) {
  // Hide Menu
  document.getElementById('mainMenu').style.display = 'none';
  // Show Selected Calculator
  document.getElementById(id).style.display = 'block';
}

function goHome() {
  // Hide all sections
  let sections = document.querySelectorAll('.container');
  sections.forEach(sec => sec.style.display = 'none');
  // Show Menu
  document.getElementById('mainMenu').style.display = 'grid';
}

// --- Calculator Logic Starts Below ---

function calculatePercentage() {
  let val = document.getElementById("value").value;
  let per = document.getElementById("percent").value;
  if(val=="" || per=="") { alert("Enter values"); return; }
  document.getElementById("result").innerText = (val * per) / 100;
}

function calculateGST() {
  let p = document.getElementById("gstPrice").value;
  let g = document.getElementById("gstPercent").value;
  if(p=="" || g=="") { alert("Enter values"); return; }
  let amt = (p * g) / 100;
  let tot = parseFloat(p) + parseFloat(amt);
  document.getElementById("gstResult").innerText = "GST: " + amt + " | Total: " + tot;
}

function calculateEMI() {
  let p = document.getElementById("emiPrincipal").value;
  let r = document.getElementById("emiRate").value;
  let n = document.getElementById("emiMonths").value;
  if(p=="" || r=="" || n=="") return;
  let mr = r / 12 / 100;
  let emi = (p * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
  document.getElementById("emiResult").innerText = "EMI: " + emi.toFixed(2);
}

function calculateSIP() {
  let p = document.getElementById("sipAmount").value;
  let r = document.getElementById("sipRate").value;
  let t = document.getElementById("sipYears").value;
  if(p=="" || r=="" || t=="") return;
  let mr = r / 12 / 100;
  let m = t * 12;
  let mat = p * ((Math.pow(1 + mr, m) - 1) / mr) * (1 + mr);
  document.getElementById("sipResult").innerText = "Maturity: " + mat.toFixed(2);
}

function calculateAge() {
  let dob = document.getElementById("dob").value;
  if(!dob) return;
  let b = new Date(dob);
  let n = new Date();
  let age = n.getFullYear() - b.getFullYear();
  if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) age--;
  document.getElementById("ageResult").innerText = "Age: " + age + " Years";
}

// 👇 YAHAN APNI KEY DAALNI HAI 👇
const apiKey = 'AIzaSyB3e5jwd1Y-5fTWH2w4u62eO-_wVqYDJx0'; 
// --- 1. API DATA FETCHING (Fix kiya hua code) ---
// --- 1. API DATA FETCHING (Photo & Title Support) ---
async function fetchYoutubeData() {
    let input = document.getElementById('ytInput').value;
    const profileSection = document.getElementById('profileSection');
    const channelImg = document.getElementById('channelImg');
    const channelName = document.getElementById('channelName');
    const videoTitle = document.getElementById('videoTitle');
    
    // Button Animation
    const btn = document.querySelector('button[onclick="fetchYoutubeData()"]');
    const originalText = btn ? btn.innerText : 'GO';
    if(btn) btn.innerText = "⏳...";

    if (!input) { alert("Please paste a Link or Handle!"); if(btn) btn.innerText = originalText; return; }
    input = input.trim(); 

    try {
        let apiUrl = '';
        let videoId = '';
        let isVideo = false;

        // A. Video Link Check
        if (input.includes('youtu.be/') || input.includes('v=')) {
            if (input.includes('youtu.be/')) videoId = input.split('youtu.be/')[1];
            else videoId = input.split('v=')[1];
            
            // Clean ID
            if (videoId.indexOf('?') !== -1) videoId = videoId.split('?')[0];
            if (videoId.indexOf('&') !== -1) videoId = videoId.split('&')[0];
            
            // API: Snippet (Photo/Title) + Statistics (Views)
            apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`;
            isVideo = true;
        } 
        // B. Handle/Channel Check
        else if (input.includes('@')) {
            const handle = input.split('@')[1].split('/')[0];
            apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=@${handle}&key=${apiKey}`;
        } else {
            // Default fallback to channel search if not clear
             apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=@${input.replace('@','')}&key=${apiKey}`;
        }

        // Fetch Data
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const item = data.items[0];
            const stats = item.statistics;
            const snippet = item.snippet;

            // 1. Update Profile UI (Photo & Name)
            profileSection.style.display = 'flex';
            
            if (isVideo) {
                // Video Logic
                channelImg.src = snippet.thumbnails.medium.url; // Video Thumbnail
                channelName.innerText = snippet.channelTitle;   // Channel Name
                videoTitle.innerText = snippet.title;           // Video Title
                
                // Update Sliders
                document.getElementById('slViews').value = stats.viewCount;
                // Auto Set CPM (Video ke liye standard)
                document.getElementById('slCPM').value = 4.0; 
            } else {
                // Channel Logic
                channelImg.src = snippet.thumbnails.medium.url; // Channel Logo
                channelName.innerText = snippet.title;          // Channel Name
                videoTitle.innerText = "Channel Analysis";
                
                // Note: Channel View Count lifetime hota hai, isliye hum slider ko 
                // thoda adjust karte hain ya user ko set karne dete hain.
                // Abhi ke liye hum Total Views dikha kar slider set karenge.
                let dailyBot = Math.round(stats.viewCount / 365); // Approx 1 year average
              // Rough estimate
                document.getElementById('slViews').value = stats.viewCount > 50000 ? 50000 : stats.viewCount; // Cap for daily slider
                document.getElementById('slCPM').value = 2.0;
            }

            // Recalculate Earnings immediately
            updateMcCalc(); 
            
            if(btn) btn.innerText = "✔ Found";
            setTimeout(() => { if(btn) btn.innerText = originalText; }, 2000);

        } else {
            alert("No Data Found! Check Link or Handle.");
            profileSection.style.display = 'none';
            if(btn) btn.innerText = originalText;
        }

    } catch (error) {
        console.error(error);
        alert("Error: Something went wrong.");
        if(btn) btn.innerText = originalText;
    }
}

// --- 2. ADVANCED CALCULATOR LOGIC (Starts at 0) ---
let timeMultiplier = 1;

function setTimeScale(scale, element) {
    document.querySelectorAll('.mc-tab').forEach(tab => {
        tab.classList.remove('active');
        tab.style.background = 'transparent';
        tab.style.color = '#6b7280';
    });
    element.classList.add('active');
    element.style.background = '#4F46E5';
    element.style.color = 'white';

    if(scale === 'daily') timeMultiplier = 1;
    if(scale === 'weekly') timeMultiplier = 7;
    if(scale === 'monthly') timeMultiplier = 30;
    if(scale === 'annual') timeMultiplier = 365;

    document.getElementById('timeLabel').innerText = `ESTIMATED ${scale.toUpperCase()} EARNINGS`;
    updateMcCalc();
}

function updateMcCalc() {
    // Values uthana (Agar 0 hai to 0 hi rahega)
    const views = parseFloat(document.getElementById('slViews').value) || 0;
    const cpm = parseFloat(document.getElementById('slCPM').value) || 0;
    const playbackRate = parseFloat(document.getElementById('slPlayback').value) / 100;

    // Display Numbers Update
    document.getElementById('valViews').innerText = parseInt(views).toLocaleString();
    document.getElementById('valCPM').innerText = "$" + cpm.toFixed(2);
    document.getElementById('valPlayback').innerText = (playbackRate * 100).toFixed(0) + "%";

    // --- Calculation ---
    // Formula: (Views * Playback% * CPM) / 1000
    let adRevenue = (views * playbackRate * cpm) / 1000;
    
    // Premium Estimate (Simple 10% extra add kar rahe hain complexity kam karne ke liye)
    let premRevenue = adRevenue * 0.10; 

    let totalDaily = adRevenue + premRevenue;

    // Time Multiplier
    let finalTotal = totalDaily * timeMultiplier;
    let finalAds = adRevenue * timeMultiplier;
    let finalPrem = premRevenue * timeMultiplier;

    // Result Update
    document.getElementById('totalMoney').innerText = finalTotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('totalRupee').innerText = (finalTotal * 84).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    
    document.getElementById('adIncome').innerText = finalAds.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    document.getElementById('premIncome').innerText = finalPrem.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
}


// --- 3. INSTAGRAM RESTORED (Jo galti se delete ho gaya tha) ---
function calculateInsta() {
    let f = document.getElementById("instaFollowers").value;
    document.getElementById("instaResult").innerText = "Est. Earnings: $" + (f*0.01).toFixed(2);
}

function calculateAdsense() {
  let i = document.getElementById("adsenseImpressions").value;
  let c = document.getElementById("adsenseCTR").value;
  let p = document.getElementById("adsenseCPC").value;
  let earn = ((i*c)/100) * p;
  document.getElementById("adsenseResult").innerText = "Revenue: $" + earn.toFixed(2);
}

function calculateSalary() {
  let ctc = document.getElementById("ctc").value;
  document.getElementById("salaryResult").innerText = "Monthly: " + (ctc/12).toFixed(2);
}

function calculateTax() {
  let inc = document.getElementById("income").value;
  let tax = 0;
  if(inc > 300000) tax = (inc - 300000) * 0.05; // Simplified
  document.getElementById("taxResult").innerText = "Est. Tax: " + tax.toFixed(2);
}

