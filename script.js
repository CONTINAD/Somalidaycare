/**
 * SOMALI DAYCARE - BABY RACING GAME
 * Watch babies race across the classroom!
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Replace with your actual contract address
    contractAddress: 'YOUR_CA_HERE',
    pumpFunUrl: 'https://pump.fun/',
    chartUrl: 'https://dexscreener.com/solana/',
    twitterUrl: 'https://twitter.com/',
    telegramUrl: 'https://t.me/',
};

// Baby racers
const BABIES = [
    { id: 1, name: 'Lil Cawo', image: 'baby1.png', wins: 0, races: 0 },
    { id: 2, name: 'Baby Hussein', image: 'baby2.png', wins: 0, races: 0 },
    { id: 3, name: 'Tiny Abdi', image: 'baby3.png', wins: 0, races: 0 },
    { id: 4, name: 'Mini Farah', image: 'baby4.png', wins: 0, races: 0 },
];

const WIN_MESSAGES = [
    "Mashallah! Generational wealth secured! 🚀",
    "Alhamdulillah! This baby is going to the moon! 🌙",
    "Wallahi this baby can't stop winning! 💰",
    "The prophecy is fulfilled! Diamond hands! 💎",
    "Inshallah! The fastest baby in the daycare! 🏆",
];

// ============================================
// STATE
// ============================================

let isRacing = false;
let totalRaces = 0;
let racers = [];

// ============================================
// DOM ELEMENTS
// ============================================

const lanesContainer = document.getElementById('lanes');
const raceBtn = document.getElementById('raceBtn');
const raceStatus = document.getElementById('raceStatus');
const winnerPopup = document.getElementById('winnerPopup');
const leaderboard = document.getElementById('leaderboard');
const totalRacesEl = document.getElementById('totalRaces');

// ============================================
// INITIALIZATION
// ============================================

function init() {
    setupCA();
    createLanes();
    updateLeaderboard();

    raceBtn.addEventListener('click', startRace);
}

function setupCA() {
    const ca = CONFIG.contractAddress;
    const caEl = document.getElementById('caAddress');
    const buyBtn = document.getElementById('buyBtn');
    const chartBtn = document.getElementById('chartBtn');
    const twitterBtn = document.getElementById('twitterBtn');
    const telegramBtn = document.getElementById('telegramBtn');

    if (ca && ca !== 'YOUR_CA_HERE') {
        caEl.textContent = ca;
        buyBtn.href = `https://pump.fun/${ca}`;
        chartBtn.href = `https://dexscreener.com/solana/${ca}`;
    } else {
        caEl.textContent = 'Coming Soon...';
    }

    twitterBtn.href = CONFIG.twitterUrl;
    telegramBtn.href = CONFIG.telegramUrl;
}

function createLanes() {
    lanesContainer.innerHTML = '';
    racers = [];

    BABIES.forEach((baby, index) => {
        const lane = document.createElement('div');
        lane.className = 'lane';
        lane.innerHTML = `<span class="lane-number">${index + 1}</span>`;

        const racer = document.createElement('div');
        racer.className = 'racer';
        racer.id = `racer-${baby.id}`;
        racer.innerHTML = `
            <img src="${baby.image}" alt="${baby.name}">
            <span class="racer-name">${baby.name}</span>
        `;
        racer.onclick = () => showCharacterPopup(baby);

        lane.appendChild(racer);
        lanesContainer.appendChild(lane);

        racers.push({
            element: racer,
            baby: baby,
            position: 20,
            speed: 0,
            finished: false
        });
    });
}

// ============================================
// RACING LOGIC
// ============================================

function startRace() {
    if (isRacing) return;

    isRacing = true;
    raceBtn.disabled = true;
    raceStatus.textContent = '🏁 RACING! GO GO GO! 🏁';

    // Reset positions
    racers.forEach(racer => {
        racer.position = 20;
        racer.speed = 0;
        racer.finished = false;
        racer.element.style.left = '20px';
        racer.element.classList.add('racing');
    });

    // Increment race count
    totalRaces++;
    BABIES.forEach(b => b.races++);
    totalRacesEl.textContent = totalRaces;

    // Start animation
    requestAnimationFrame(raceLoop);
}

function raceLoop() {
    if (!isRacing) return;

    const trackWidth = document.querySelector('.race-track').offsetWidth;
    const finishLine = trackWidth - 130; // Finish line position

    let allFinished = true;
    let winner = null;

    racers.forEach(racer => {
        if (racer.finished) return;

        allFinished = false;

        // Random speed variation (creates exciting races)
        racer.speed = 2 + Math.random() * 6;
        racer.position += racer.speed;

        racer.element.style.left = racer.position + 'px';

        // Check if crossed finish line
        if (racer.position >= finishLine && !racer.finished) {
            racer.finished = true;
            if (!winner) {
                winner = racer;
            }
        }
    });

    if (winner && !allFinished) {
        // We have a winner!
        endRace(winner);
    } else if (!allFinished) {
        requestAnimationFrame(raceLoop);
    }
}

function endRace(winner) {
    isRacing = false;

    // Stop racing animation
    racers.forEach(r => r.element.classList.remove('racing'));

    // Update winner stats
    winner.baby.wins++;

    // Show winner popup
    showWinnerPopup(winner.baby);

    // Update leaderboard
    updateLeaderboard();

    // Re-enable button
    raceBtn.disabled = false;
    raceStatus.textContent = `🏆 ${winner.baby.name} WINS! Click to race again!`;
}

// ============================================
// POPUPS
// ============================================

function showWinnerPopup(baby) {
    document.getElementById('winnerImage').src = baby.image;
    document.getElementById('winnerName').textContent = baby.name;
    document.getElementById('winnerMessage').textContent = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
    document.getElementById('winnerWins').textContent = baby.wins;
    document.getElementById('winnerRaces').textContent = baby.races;

    winnerPopup.classList.add('show');
}

function closePopup() {
    winnerPopup.classList.remove('show');
}

function showCharacterPopup(baby) {
    if (isRacing) return;

    document.getElementById('charImage').src = baby.image;
    document.getElementById('charName').textContent = baby.name;
    document.getElementById('charWins').textContent = baby.wins;
    document.getElementById('charRaces').textContent = baby.races;
    document.getElementById('charWinRate').textContent = baby.races > 0
        ? Math.round((baby.wins / baby.races) * 100) + '%'
        : '0%';

    document.getElementById('characterPopup').classList.add('show');
}

function closeCharPopup() {
    document.getElementById('characterPopup').classList.remove('show');
}

// ============================================
// LEADERBOARD
// ============================================

function updateLeaderboard() {
    const sorted = [...BABIES].sort((a, b) => b.wins - a.wins);

    leaderboard.innerHTML = sorted.map((baby, index) => {
        let rankClass = '';
        if (index === 0 && baby.wins > 0) rankClass = 'top-1';
        else if (index === 1 && baby.wins > 0) rankClass = 'top-2';
        else if (index === 2 && baby.wins > 0) rankClass = 'top-3';

        return `
            <div class="lb-item ${rankClass}" onclick="showCharacterPopup(BABIES.find(b => b.id === ${baby.id}))">
                <span class="lb-rank">#${index + 1}</span>
                <img src="${baby.image}" alt="${baby.name}" class="lb-avatar">
                <div class="lb-info">
                    <div class="lb-name">${baby.name}</div>
                    <div class="lb-wins">${baby.wins} wins</div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// COPY CA
// ============================================

function copyCA() {
    const ca = CONFIG.contractAddress;
    if (ca && ca !== 'YOUR_CA_HERE') {
        navigator.clipboard.writeText(ca);
        const feedback = document.getElementById('copyFeedback');
        feedback.classList.add('show');
        setTimeout(() => feedback.classList.remove('show'), 1500);
    }
}

// Make functions globally accessible
window.closePopup = closePopup;
window.closeCharPopup = closeCharPopup;
window.showCharacterPopup = showCharacterPopup;
window.copyCA = copyCA;

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
