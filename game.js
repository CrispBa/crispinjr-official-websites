const games = [
            {
                id: 1,
                title: 'Block Puzzle',
                earnings: '$100+',
                image: 'block-puzzle.jpg',
                premium: true,
            },
            {
                id: 2,
                title: 'Call of Dragons',
                earnings: '$149+',
                image: 'call-of-dragons.jpg',
                premium: true,
            },
            {
                id: 3,
                title: 'Word Tiles',
                earnings: '$85+',
                image: 'word-tiles.jpg',
                premium: true,
            },
            {
                id: 4,
                title: 'Ken Ken Puzzle Math Edition',
                earnings: '$120+',
                image: 'kenken.jpg',
                premium: true,
            },
            {
                id: 5,
                title: 'Typer Code',
                earnings: '$95+',
                image: 'typer-code.jpg',
                premium: true,
            },
            {
                id: 6,
                title: 'Tik Tak Toe',
                earnings: '$75+',
                image: 'tictactoe.jpg',
                premium: true,
            },
        ];

        // Render game cards
        function renderGames() {
            const container = document.getElementById('offersList');
            container.innerHTML = games.map(game => `
                <div class="offer-card">
                    <div class="offer-image">
                        <img src="${game.image}" alt="${game.title}" loading="lazy">
                        <div class="game-label">Game</div>
                        ${game.premium ? '<div class="premium-badge">Premium</div>' : ''}
                    </div>
                    <div class="offer-details">
                        <div class="offer-header-row">
                            <div class="offer-earnings">${game.earnings}</div>
                            <div class="offer-title">${game.title}</div>
                            <button class="info-icon" onclick="showModal('${game.title}', 'Play ${game.title} to earn ${game.earnings}!')">
                                <svg class="info-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                                    <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                    <path d="M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </button>
                        </div>
                        <button class="play-btn" onclick="playGame('${game.title}', '${game.earnings}')">
                            Play and Earn ${game.earnings}
                        </button>
                    </div>
                </div>
            `).join('');
        }
function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

// Handle overlay click (clicking outside the box) separately
document.getElementById('modal').addEventListener('click', function(e) {
    // If clicked element is the overlay itself (not the box inside)
    if (e.target === this) {
        closeModal();
    }
});
        function showBonusModal() {
            showModal('💎 Bonus Rewards', 'Collect bonus points by playing games!\n\nCurrent Bonus: P50+\n\nPlay featured games to unlock exclusive bonus rewards and power-ups.');
        }

        function showThemeModal() {
            showModal('🎨 Theme Settings', 'Customize your app experience!\n\nAvailable Themes:\n• Dark Mode (Current)\n• Light Mode\n• Neon Glow\n• Classic Retro\n• Nature Bliss\n\nUnlock premium themes with your earnings.');
        }

        function showSkinModal() {
            showModal('👕 Skin Shop', 'Customize your avatar!\n\nAvailable Skins:\n• Default (Current)\n• Golden Frame\n• Diamond Crown\n• Cyber Punk\n• Royal Elite\n\nStand out from other players with unique skins!');
        }

        // Play game
        function playGame(title, earnings) {
            showModal('Starting Game', `Loading ${title}...\nPrepare to earn ${earnings}!`);
        }
// Initialize background music
const bgMusic = new Audio('playa.mp3'); 
bgMusic.loop = true;
bgMusic.volume = 0.2;

// Function to start music
function startMusic() {
    if (bgMusic.paused) {
        bgMusic.play().then(() => {
            console.log("Playback started successfully");
            // Remove listeners once music is playing
            document.removeEventListener('click', startMusic);
            document.removeEventListener('touchstart', startMusic);
        }).catch(error => {
            console.log("Playback failed:", error);
        });
    }
}

// Listen for any interaction anywhere on the screen
document.addEventListener('click', startMusic);
document.addEventListener('touchstart', startMusic);

function switchTab(tab) {
    // 1. Update active tab visual state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Safety check for the clicked element
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    // 2. Keep floating buttons visible on ALL tabs (removed the hiding logic)
    const floatingFeatures = document.getElementById('floatingFeatures');
    floatingFeatures.classList.add('active');

    // 3. Show "Coming Soon" for other tabs
    if (tab !== 'earn') {
        const tabNames = {
            'progress': 'Progress',
            'missions': 'Missions',
            'invite': 'Invite'
        };
        showModal(tabNames[tab], 'Coming soon!');
    }
}
        // Prevent scroll bounce on mobile
        document.addEventListener('touchmove', (e) => {
            if (!e.target.closest('.earn-view')) {
                e.preventDefault();
            }
        }, { passive: false });

        // Initialize
        renderGames();

// Replace your click sound code with this:
const clickSound = new Audio('sound-effects.mp3');
clickSound.volume = 0.5;
let clickTimeout;



function addClickSoundsToButtons() {
    // Added .balance-overlap-icon and .balance-overlap-icon-right to the list
    const selectors = 'button, .nav-item, .header-icon, .info-icon, .float-btn, .avatar, .play-btn, .balance-box, .balance-overlap-icon, .balance-overlap-icon-right';
    
    document.querySelectorAll(selectors).forEach(btn => {
        btn.addEventListener('click', playClickSound);
    });
}



// At bottom of file, replace addClickSoundsToButtons() with:
addClickSoundsToButtons();

// 1. Keep track of the mute state globally
let isMuted = false;

function toggleMute() {
    const slash = document.getElementById('mute-slash');
    const btn = document.getElementById('mute-btn');
    
    // Toggle the state
    isMuted = !isMuted;

    if (isMuted) {
        slash.style.display = 'block';
        btn.classList.add('muted');
        
        // Mute the background music
        bgMusic.muted = true;
        
        // Cancel any pending sounds
        clearTimeout(clickTimeout); 
        console.log("Audio Muted");
    } else {
        slash.style.display = 'none';
        btn.classList.remove('muted');
        
        // Unmute the background music
        bgMusic.muted = false;
        console.log("Audio Playing");
    }
}

function playClickSound() {
    // If the app is muted, stop immediately and don't play anything
    if (isMuted) return;

    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
        const soundClone = clickSound.cloneNode();
        soundClone.volume = 0.5;
        // Double check mute status before playing the clone
        soundClone.muted = isMuted; 
        soundClone.play().catch(() => {});
    }, 0); 
}