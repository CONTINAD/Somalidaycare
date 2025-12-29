/**
 * SOMALI DAYCARE - VIRAL MEME GAME
 * Where chaos meets custody 🇸🇴👶
 * Connected to pump.fun
 */

// ============================================
// PUMP.FUN CONFIGURATION
// ============================================

const PUMP_CONFIG = {
    // Replace with your actual pump.fun token contract address
    contractAddress: 'YOUR_PUMP_FUN_CA_HERE',
    pumpFunUrl: 'https://pump.fun/',
    twitterUrl: 'https://twitter.com/',
    telegramUrl: 'https://t.me/',
    chartUrl: 'https://dexscreener.com/solana/',
};

// ============================================
// BABY CONFIGURATION - ALL THE NEW BABIES!
// ============================================

// New South Park style Somali babies!
const BABY_IMAGES = [
    'baby_suit.png', 'baby_rocket.png', 'baby_crying.png', 'baby_hijab.png',
    'baby_bitcoin.png', 'baby_king.png', 'baby_diamond2.png', 'baby_moon2.png',
    'baby_hodl.png', 'baby_pirate2.png'
];

const BABY_NAMES = [
    'Lil Cawo', 'Baby Hussein', 'Tiny Absane', 'Mini Farah',
    'Smol Ayub', 'Wee Abdi', 'Lil Guled', 'Baby Sahra',
    'Tiny Hawa', 'Mini Yusuf', 'Smol Khadija', 'Wee Omar',
    'Lil Amina', 'Baby Jabril', 'Tiny Halima', 'Mini Ismail',
    'Captain Rugbeard', 'Diamond Danny', 'Moonshot Musa',
    'Whale Warsame', 'Paper Hands Pete', 'Dev Dahir',
    'Chef Cabdi', 'Rich Roble', 'Crying Cumar'
];

const RARITIES = ['common', 'common', 'common', 'rare', 'rare', 'epic', 'legendary'];

// ============================================
// WHEEL OUTCOMES
// ============================================

const WHEEL_OUTCOMES = [
    {
        name: 'BUYBACK',
        icon: '💰',
        message: 'BUYBACK TIME! Dev using creator fees to buy $SOMALI off the market! Price go up inshallah!',
        type: 'win',
        action: 'buyback',
        color: '#00D26A'
    },
    {
        name: 'PIRATES',
        icon: '🏴‍☠️',
        message: 'SOMALI PIRATES TOOK YOUR SHIPMENT! They ran off with the fees... nothing happens this round.',
        type: 'neutral',
        action: 'none',
        color: '#607D8B'
    },
    {
        name: 'AIRDROP',
        icon: '🎁',
        message: 'AIRDROP! Random holder getting blessed with free tokens! Check your wallet!',
        type: 'win',
        action: 'airdrop',
        color: '#9C27B0'
    },
    {
        name: 'BURN',
        icon: '🔥',
        message: 'BURN BABY BURN! Fees being used to buy and BURN tokens! Supply going down!',
        type: 'win',
        action: 'burn',
        color: '#FF6B35'
    },
    {
        name: 'WHALE',
        icon: '🐋',
        message: 'A WHALE IS ENTERING! Big buyer spotted! The daycare is about to pump!',
        type: 'win',
        action: 'whale_alert',
        color: '#2196F3'
    },
    {
        name: 'HODL',
        icon: '💎',
        message: 'DIAMOND HANDS! Fees being saved for a BIGGER buyback later. Patience pays!',
        type: 'neutral',
        action: 'hodl',
        color: '#00BCD4'
    },
    {
        name: 'LP ADD',
        icon: '💧',
        message: 'LIQUIDITY BOOST! Adding more LP to make trading smoother. Wallahi!',
        type: 'win',
        action: 'lp_add',
        color: '#3498DB'
    },
    {
        name: 'SABAR',
        icon: '🙏',
        message: 'SABAR (patience)! The elders are deciding... fees held for next spin.',
        type: 'neutral',
        action: 'pending',
        color: '#455A64'
    }
];

// ============================================
// STATE
// ============================================

let gameState = {
    babies: [],
    holders: [],
    totalWins: 0,
    totalLosses: 0,
    totalSpins: 0,
    currentRotation: 0,
    isSpinning: false,
    timerSeconds: 60,
    timerInterval: null,
    history: []
};

// ============================================
// DOM ELEMENTS
// ============================================

let wheelCanvas, ctx, timer, resultDisplay, resultTitle, resultMessage, resultIcon;
let babiesGrid, addBabyBtn, historyLog, leaderboard, lastResultEl;
let totalBabiesEl, totalWinsEl, totalLossesEl, totalSpinsEl;
let tokenCA, buyBtn, chartBtn, tickerBabies, tickerBabies2, tickerSpins;

function initElements() {
    wheelCanvas = document.getElementById('wheelCanvas');
    ctx = wheelCanvas.getContext('2d');
    spinBtn = document.getElementById('spinBtn');
    timer = document.getElementById('timer');
    resultDisplay = document.getElementById('resultDisplay');
    resultTitle = document.getElementById('resultTitle');
    resultMessage = document.getElementById('resultMessage');
    resultIcon = document.getElementById('resultIcon');
    babiesGrid = document.getElementById('babiesGrid');
    addBabyBtn = document.getElementById('addBabyBtn');
    historyLog = document.getElementById('historyLog');
    leaderboard = document.getElementById('leaderboard');
    lastResultEl = document.getElementById('lastResult');

    totalBabiesEl = document.getElementById('totalBabies');
    totalWinsEl = document.getElementById('totalWins');
    totalLossesEl = document.getElementById('totalLosses');
    totalSpinsEl = document.getElementById('totalSpins');

    tokenCA = document.getElementById('tokenCA');
    buyBtn = document.getElementById('buyBtn');
    chartBtn = document.getElementById('chartBtn');
    tickerBabies = document.getElementById('tickerBabies');
    tickerBabies2 = document.getElementById('tickerBabies2');
    tickerSpins = document.getElementById('tickerSpins');
}

// ============================================
// WHEEL DRAWING
// ============================================

function drawWheel(rotation = 0) {
    const centerX = wheelCanvas.width / 2;
    const centerY = wheelCanvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation * Math.PI / 180);

    const numSegments = WHEEL_OUTCOMES.length;
    const arc = (2 * Math.PI) / numSegments;

    WHEEL_OUTCOMES.forEach((outcome, i) => {
        const angle = i * arc;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, angle, angle + arc);
        ctx.closePath();

        // Gradient fill
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
        gradient.addColorStop(0, lightenColor(outcome.color, 50));
        gradient.addColorStop(0.6, outcome.color);
        gradient.addColorStop(1, darkenColor(outcome.color, 30));
        ctx.fillStyle = gradient;
        ctx.fill();

        // Segment border
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const label = outcome.name;
        const textRadius = radius * 0.65;

        // Black outline for readability
        ctx.font = 'bold 18px Bangers, Impact, sans-serif';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 5;
        ctx.lineJoin = 'round';
        ctx.strokeText(label, textRadius, 0);

        // White fill
        ctx.fillStyle = '#fff';
        ctx.fillText(label, textRadius, 0);

        ctx.restore();
    });

    ctx.restore();
}

function lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1);
}

function darkenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R > 0 ? R : 0) * 0x10000 +
        (G > 0 ? G : 0) * 0x100 +
        (B > 0 ? B : 0)).toString(16).slice(1);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateHolderAddress() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
    let addr = '';
    for (let i = 0; i < 4; i++) {
        addr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return addr + '...' + chars.substring(0, 4);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

// ============================================
// PUMP.FUN INTEGRATION
// ============================================

function initPumpFun() {
    const ca = PUMP_CONFIG.contractAddress;

    if (ca && ca !== 'YOUR_PUMP_FUN_CA_HERE') {
        tokenCA.textContent = ca.slice(0, 6) + '...' + ca.slice(-4);
        tokenCA.title = ca;

        buyBtn.href = `https://pump.fun/${ca}`;
        chartBtn.href = `https://dexscreener.com/solana/${ca}`;

        document.getElementById('footerPump').href = `https://pump.fun/${ca}`;
        document.getElementById('footerChart').href = `https://dexscreener.com/solana/${ca}`;
    } else {
        tokenCA.textContent = 'Coming Soon...';
        buyBtn.href = 'https://pump.fun';
        chartBtn.href = '#';
    }

    // Set social links (update these with your actual links)
    document.getElementById('twitterBtn').href = PUMP_CONFIG.twitterUrl;
    document.getElementById('telegramBtn').href = PUMP_CONFIG.telegramUrl;
    document.getElementById('footerTwitter').href = PUMP_CONFIG.twitterUrl;
    document.getElementById('footerTelegram').href = PUMP_CONFIG.telegramUrl;

    loadLeaderboard();
}

function copyCA() {
    const ca = PUMP_CONFIG.contractAddress;
    if (ca && ca !== 'YOUR_PUMP_FUN_CA_HERE') {
        navigator.clipboard.writeText(ca);
        tokenCA.textContent = 'Copied! ✅';
        setTimeout(() => {
            tokenCA.textContent = ca.slice(0, 6) + '...' + ca.slice(-4);
        }, 1500);
    } else {
        tokenCA.textContent = 'No CA yet!';
        setTimeout(() => {
            tokenCA.textContent = 'Coming Soon...';
        }, 1500);
    }
}

window.copyCA = copyCA;

// ============================================
// LEADERBOARD
// ============================================

function loadLeaderboard() {
    const mockHolders = [
        { address: generateHolderAddress(), amount: '420.69M', rank: 1, image: 'baby_king.png' },
        { address: generateHolderAddress(), amount: '69.42M', rank: 2, image: 'baby_suit.png' },
        { address: generateHolderAddress(), amount: '33.33M', rank: 3, image: 'baby_diamond2.png' },
        { address: generateHolderAddress(), amount: '21.00M', rank: 4, image: 'baby_moon2.png' },
        { address: generateHolderAddress(), amount: '10.50M', rank: 5, image: 'baby_hodl.png' },
    ];

    gameState.holders = mockHolders;
    renderLeaderboard();
}

function renderLeaderboard() {
    leaderboard.innerHTML = gameState.holders.map(holder => {
        let rankClass = '';
        if (holder.rank === 1) rankClass = 'top-1';
        else if (holder.rank === 2) rankClass = 'top-2';
        else if (holder.rank === 3) rankClass = 'top-3';

        return `
            <div class="leaderboard-item ${rankClass}">
                <div class="lb-rank">#${holder.rank}</div>
                <img src="${holder.image}" alt="Holder" class="lb-avatar">
                <div class="lb-info">
                    <div class="lb-address">${holder.address}</div>
                    <div class="lb-amount">💰 ${holder.amount} $SOMALI</div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// BABY MANAGEMENT
// ============================================

function createBaby() {
    const rarity = getRandomItem(RARITIES);

    // Use the new South Park style images based on rarity
    let imagePool;
    if (rarity === 'legendary') {
        imagePool = ['baby_king.png', 'baby_diamond2.png', 'baby_moon2.png'];
    } else if (rarity === 'epic') {
        imagePool = ['baby_suit.png', 'baby_bitcoin.png', 'baby_rocket.png'];
    } else if (rarity === 'rare') {
        imagePool = ['baby_hodl.png', 'baby_pirate2.png'];
    } else {
        imagePool = ['baby_crying.png', 'baby_hijab.png'];
    }

    const baby = {
        id: Date.now() + Math.random(),
        name: getRandomItem(BABY_NAMES),
        image: getRandomItem(imagePool),
        holder: generateHolderAddress(),
        wins: 0,
        losses: 0,
        status: 'neutral',
        rarity: rarity
    };

    gameState.babies.push(baby);
    renderBabies();
    updateStats();

    const rarityEmoji = rarity === 'legendary' ? '🌟' : rarity === 'epic' ? '💎' : rarity === 'rare' ? '✨' : '👶';
    addToHistory(`${rarityEmoji} New ${rarity.toUpperCase()} baby "${baby.name}" adopted!`, 'neutral');

    return baby;
}

function renderBabies() {
    babiesGrid.innerHTML = '';

    gameState.babies.forEach(baby => {
        const card = document.createElement('div');
        card.className = `baby-card ${baby.status}`;
        card.innerHTML = `
            <span class="baby-rarity ${baby.rarity}">${baby.rarity.toUpperCase()}</span>
            <div class="baby-image-container">
                <img src="${baby.image}" alt="${baby.name}" class="baby-image">
            </div>
            <div class="baby-name">${baby.name}</div>
            <div class="baby-holder">${baby.holder}</div>
            <div class="baby-stats">
                <div class="baby-stat">
                    <div class="baby-stat-value">${baby.wins}</div>
                    <div class="baby-stat-label">Wins</div>
                </div>
                <div class="baby-stat">
                    <div class="baby-stat-value">${baby.losses}</div>
                    <div class="baby-stat-label">Rugs</div>
                </div>
            </div>
        `;
        babiesGrid.appendChild(card);
    });
}

// ============================================
// WHEEL SPIN LOGIC
// ============================================

function spinWheel() {
    if (gameState.isSpinning || gameState.babies.length === 0) {
        if (gameState.babies.length === 0) {
            resultIcon.textContent = '⚠️';
            resultTitle.textContent = 'NO BABIES!';
            resultMessage.textContent = 'You need to adopt a baby first! Click the button below.';
        }
        return;
    }

    gameState.isSpinning = true;
    spinBtn.disabled = true;

    // Calculate random spin
    const numSegments = WHEEL_OUTCOMES.length;
    const segmentAngle = 360 / numSegments;
    const randomSpins = 5 + Math.random() * 5;
    const outcomeIndex = Math.floor(Math.random() * numSegments);

    const targetAngle = 360 - (outcomeIndex * segmentAngle) - segmentAngle / 2 + 90;
    const totalRotation = gameState.currentRotation + (randomSpins * 360) + targetAngle;

    // Animate
    animateWheel(gameState.currentRotation, totalRotation, 4000, () => {
        const outcome = WHEEL_OUTCOMES[outcomeIndex];
        handleOutcome(outcome);
        gameState.isSpinning = false;
        spinBtn.disabled = false;
        gameState.totalSpins++;
        gameState.currentRotation = totalRotation % 360;
        updateStats();
        resetTimer();
    });
}

function animateWheel(startRotation, endRotation, duration, callback) {
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const currentRotation = startRotation + (endRotation - startRotation) * easeOut;

        drawWheel(currentRotation);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            callback();
        }
    }

    requestAnimationFrame(animate);
}

function handleOutcome(outcome) {
    resultIcon.textContent = outcome.icon;
    resultTitle.textContent = outcome.name + '!';
    resultMessage.textContent = outcome.message;
    resultDisplay.className = `result-display ${outcome.type}`;

    // Update last result display
    if (lastResultEl) {
        lastResultEl.innerHTML = `
            <div class="last-result-label">Last Result:</div>
            <div class="last-result-value">${outcome.icon} ${outcome.name} - ${outcome.action}</div>
        `;
    }

    // Select random baby
    const luckyBaby = getRandomItem(gameState.babies);

    // Update stats based on outcome type
    if (outcome.type === 'win') {
        luckyBaby.wins++;
        luckyBaby.status = 'winner';
        gameState.totalWins++;
        addToHistory(`${outcome.icon} ${outcome.name}! ${outcome.message}`, 'win');
    } else if (outcome.action === 'none') {
        // Pirates took it - count as loss
        luckyBaby.status = 'loser';
        gameState.totalLosses++;
        addToHistory(`${outcome.icon} ${outcome.name}! ${outcome.message}`, 'lose');
    } else {
        luckyBaby.status = 'neutral';
        addToHistory(`${outcome.icon} ${outcome.name}! ${outcome.message}`, 'neutral');
    }

    renderBabies();

    // Reset status after animation
    setTimeout(() => {
        gameState.babies.forEach(b => b.status = 'neutral');
        renderBabies();
    }, 3000);
}

// ============================================
// TIMER
// ============================================

function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timerSeconds--;
        timer.textContent = formatTime(gameState.timerSeconds);

        if (gameState.timerSeconds <= 0) {
            if (gameState.babies.length > 0 && !gameState.isSpinning) {
                spinWheel();
            } else {
                resetTimer();
            }
        }

        // Flash when low
        if (gameState.timerSeconds <= 10) {
            timer.style.color = gameState.timerSeconds % 2 === 0 ? '#FF4757' : '#FFD700';
        } else {
            timer.style.color = '#FFD700';
        }
    }, 1000);
}

function resetTimer() {
    // 60 minutes = 3600 seconds for hourly spins
    gameState.timerSeconds = 3600;
    timer.textContent = formatTime(gameState.timerSeconds);
}

// ============================================
// HISTORY
// ============================================

function addToHistory(text, type = 'neutral') {
    const entry = {
        time: getCurrentTime(),
        text: text,
        type: type
    };

    gameState.history.unshift(entry);

    if (gameState.history.length > 50) {
        gameState.history.pop();
    }

    renderHistory();
}

function renderHistory() {
    historyLog.innerHTML = gameState.history.map(entry => `
        <div class="log-entry ${entry.type}">
            <span class="log-time">${entry.time}</span>
            <span class="log-text">${entry.text}</span>
        </div>
    `).join('');
}

// ============================================
// STATS
// ============================================

function updateStats() {
    totalBabiesEl.textContent = gameState.babies.length;
    totalWinsEl.textContent = gameState.totalWins;
    totalLossesEl.textContent = gameState.totalLosses;
    totalSpinsEl.textContent = gameState.totalSpins;

    // Update ticker
    if (tickerBabies) tickerBabies.textContent = gameState.babies.length;
    if (tickerBabies2) tickerBabies2.textContent = gameState.babies.length;
    if (tickerSpins) tickerSpins.textContent = gameState.totalSpins;
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    initElements();
    initPumpFun();

    // Draw wheel
    drawWheel(0);

    // Event listeners (no spin button - viewers only watch)
    addBabyBtn.addEventListener('click', createBaby);

    // Start with 3 random babies
    for (let i = 0; i < 3; i++) {
        createBaby();
    }

    // Start hourly timer
    startTimer();

    updateStats();
    addToHistory('🏴‍☠️ Welcome to Somali Daycare! Watch the wheel spin every hour!', 'neutral');
}

document.addEventListener('DOMContentLoaded', init);
