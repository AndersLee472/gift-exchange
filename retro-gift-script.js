// ============================================
// RETRO ARCADE GIFT EXCHANGE - GAME SCRIPT
// ============================================

// Game State
let players = [];
let currentPlayer = 'PLAYER 1';
let assignments = {};
let clickCount = 0;
let secretCode = 'KONAMI';
let konamiCode = [];
let audioContext = null;

// DOM Elements
const playerNameInput = document.getElementById('player-name');
const addPlayerBtn = document.getElementById('add-player-btn');
const playersGrid = document.getElementById('players-grid');
const startGameBtn = document.getElementById('start-game-btn');
const assignmentText = document.getElementById('assignment-text');
const playerCountDisplay = document.getElementById('player-count');
const scoreDisplay = document.getElementById('score');
const easterEggModal = document.getElementById('easter-egg-modal');

// ============================================
// AUDIO SYSTEM - 8-BIT SOUND EFFECTS
// ============================================

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(frequency, duration, type = 'square') {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Sound Effects
function playCoinInsertSound() {
    initAudio();
    playSound(800, 0.1);
    setTimeout(() => playSound(1000, 0.1), 100);
}

function playButtonClickSound() {
    initAudio();
    playSound(400, 0.05);
}

function playStartGameSound() {
    initAudio();
    // Play a sequence of notes
    const notes = [523, 659, 784, 1047];
    notes.forEach((note, index) => {
        setTimeout(() => playSound(note, 0.15), index * 100);
    });
}

function playMatchSuccessSound() {
    initAudio();
    // Victory fanfare
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((note, index) => {
        setTimeout(() => playSound(note, 0.2), index * 80);
    });
}

function playEasterEggSound() {
    initAudio();
    // Special jingle
    const notes = [523, 659, 784, 1047, 1319, 1568];
    notes.forEach((note, index) => {
        setTimeout(() => playSound(note, 0.25), index * 120);
    });
}

// ============================================
// LOCAL STORAGE - DATA PERSISTENCE
// ============================================

const STORAGE_KEY = 'retro-gift-exchange-players';

function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
}

function loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        players = JSON.parse(saved);
        renderPlayers();
        updatePlayerCount();
    }
}

function clearStorage() {
    localStorage.removeItem(STORAGE_KEY);
}

// ============================================
// EASTER EGGS
// ============================================

const EASTER_NAMES = {
    'KONAMI': () => triggerEasterEgg(),
    'UPDOWNUPDOWNLEFTRIGHTLEFTRIGHTBA': () => triggerEasterEgg(),
    'EASTER': () => triggerEasterEgg(),
    'SECRET': () => triggerEasterEgg(),
    'CODE': () => triggerEasterEgg()
};

const SPECIAL_CLICK_TARGET = '.pixel-art-gift';

function checkEasterEgg(name) {
    const upperName = name.toUpperCase();

    // Check for special names
    if (EASTER_NAMES[upperName]) {
        EASTER_NAMES[upperName]();
        return true;
    }

    // Check for partial matches
    if (upperName.includes('EASTER') ||
        upperName.includes('SECRET') ||
        upperName.includes('KONAMI')) {
        triggerEasterEgg();
        return true;
    }

    return false;
}

function triggerEasterEgg() {
    playEasterEggSound();

    // Add bonus points
    const currentScore = parseInt(scoreDisplay.textContent) || 0;
    const newScore = currentScore + 10000;
    scoreDisplay.textContent = newScore.toString().padStart(6, '0');

    // Show modal
    easterEggModal.style.display = 'flex';

    // Hide modal after 3 seconds
    setTimeout(() => {
        easterEggModal.style.display = 'none';
    }, 3000);

    // Visual feedback
    document.querySelector('.crt-screen').style.animation = 'egg-pulse 0.5s ease-out';
    setTimeout(() => {
        document.querySelector('.crt-screen').style.animation = '';
    }, 500);
}

function handleSecretClick() {
    clickCount++;

    if (clickCount === 5) {
        triggerEasterEgg();
        clickCount = 0;
    } else {
        setTimeout(() => {
            clickCount = Math.max(0, clickCount - 1);
        }, 2000);
    }
}

// ============================================
// GAME LOGIC
// ============================================

function addPlayer(name) {
    if (!name) return;

    const upperName = name.toUpperCase();

    if (players.includes(upperName)) {
        playButtonClickSound();
        assignmentText.textContent = 'PLAYER EXISTS!';
        assignmentText.style.color = 'var(--warning-red)';
        setTimeout(() => {
            assignmentText.style.color = 'var(--accent-cyan)';
            assignmentText.textContent = 'PRESS START';
        }, 1500);
        return;
    }

    // Check easter egg
    checkEasterEgg(name);

    players.push(upperName);
    saveToStorage();
    renderPlayers();
    updatePlayerCount();

    playerNameInput.value = '';
    playCoinInsertSound();
    assignmentText.textContent = 'PLAYER ADDED!';
    setTimeout(() => {
        assignmentText.textContent = 'PRESS START';
    }, 1000);
}

function removePlayer(index) {
    players.splice(index, 1);
    saveToStorage();
    renderPlayers();
    updatePlayerCount();
    playButtonClickSound();
}

function renderPlayers() {
    playersGrid.innerHTML = '';

    players.forEach((player, index) => {
        const card = document.createElement('div');
        card.className = 'player-card';
        if (player === currentPlayer) {
            card.classList.add('active-player');
        }

        card.innerHTML = `
            <button class="player-remove" data-index="${index}">×</button>
            <div class="player-name">${player}</div>
            <div class="player-status">${player === currentPlayer ? 'YOU' : 'READY'}</div>
        `;

        card.querySelector('.player-remove').addEventListener('click', (e) => {
            e.stopPropagation();
            removePlayer(index);
        });

        playersGrid.appendChild(card);
    });
}

function updatePlayerCount() {
    const count = players.length.toString().padStart(2, '0');
    playerCountDisplay.textContent = count;
}

function startGame() {
    if (players.length < 2) {
        assignmentText.textContent = 'NEED 2+ PLAYERS!';
        assignmentText.style.color = 'var(--warning-red)';
        setTimeout(() => {
            assignmentText.style.color = 'var(--accent-cyan)';
            assignmentText.textContent = 'PRESS START';
        }, 1500);
        return;
    }

    playStartGameSound();

    // Shuffle players for random assignment
    const shuffled = [...players].sort(() => Math.random() - 0.5);

    // Create circular assignment
    assignments = {};
    for (let i = 0; i < shuffled.length; i++) {
        const giver = shuffled[i];
        const receiver = shuffled[(i + 1) % shuffled.length];
        assignments[giver] = receiver;
    }

    // Display assignment
    startGameBtn.disabled = true;
    startGameBtn.textContent = 'LOADING...';

    assignmentText.textContent = 'SHUFFLING...';
    assignmentText.style.color = 'var(--crt-green)';

    setTimeout(() => {
        const target = assignments[currentPlayer];
        if (target) {
            assignmentText.textContent = target;
            assignmentText.style.color = 'var(--accent-cyan)';
            playMatchSuccessSound();

            // Add points
            const currentScore = parseInt(scoreDisplay.textContent) || 0;
            const newScore = currentScore + 5000;
            scoreDisplay.textContent = newScore.toString().padStart(6, '0');
        }

        startGameBtn.disabled = false;
        startGameBtn.textContent = 'PLAY AGAIN';
    }, 2000);
}

// ============================================
// EVENT LISTENERS
// ============================================

addPlayerBtn.addEventListener('click', () => {
    initAudio();
    addPlayer(playerNameInput.value.trim());
});

playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        initAudio();
        addPlayer(playerNameInput.value.trim());
    }
});

startGameBtn.addEventListener('click', () => {
    initAudio();
    startGame();
});

// Gift box click easter egg
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('pixel-art-gift') ||
        e.target.closest('.assignment-box')) {
        handleSecretClick();
    }
});

// Konami code detection
document.addEventListener('keydown', (e) => {
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
                           'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
                           'KeyB', 'KeyA'];

    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        triggerEasterEgg();
        konamiCode = [];
    }
});

// Easter egg modal click to close
easterEggModal.addEventListener('click', () => {
    easterEggModal.style.display = 'none';
});

// ============================================
// INITIALIZATION
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();

    // Add default player if none exist
    if (players.length === 0) {
        players.push(currentPlayer);
        saveToStorage();
        renderPlayers();
        updatePlayerCount();
    }

    // Visual feedback on load
    assignmentText.textContent = 'PRESS START';
    assignmentText.style.color = 'var(--accent-cyan)';

    // Add some initial points for flair
    scoreDisplay.textContent = '000100';
});

// Prevent text selection for authentic arcade feel
document.addEventListener('selectstart', (e) => {
    e.preventDefault();
});
