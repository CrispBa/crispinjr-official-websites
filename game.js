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
bgMusic.volume = 1;

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

let audioState = 0; // 0: All On, 1: Music Muted (/), 2: All Muted (⊘)

function toggleAudioState() {
    audioState = (audioState + 1) % 3;
    const overlay = document.getElementById('audio-status-overlay');
    const noteIcon = document.getElementById('main-note-svg');
    const btn = document.getElementById('mute-btn');

    if (audioState === 0) {
        // --- ALL ON (♬) ---
        bgMusic.muted = false;
        overlay.innerHTML = ''; // Remove any overlay
        noteIcon.style.opacity = "1";
        btn.style.boxShadow = "none";
    } 
    else if (audioState === 1) {
        // --- MUSIC MUTE (♬ + /) ---
        bgMusic.muted = true;
        // Simple diagonal slash over the note
        overlay.innerHTML = `
            <svg class="overlay-svg" viewBox="0 0 24 24" fill="none">
                <line x1="3" y1="21" x2="21" y2="3" stroke="currentColor"></line>
            </svg>`;
        noteIcon.style.opacity = "0.6"; // Dim the note slightly
    } 
    else if (audioState === 2) {
        // --- ALL MUTE (♬ + ⊘) ---
        bgMusic.muted = true;
        // The circle-slash "No" symbol over the note
        overlay.innerHTML = `
            <svg class="overlay-svg" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor"></circle>
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="currentColor"></line>
            </svg>`;
        noteIcon.style.opacity = "0.4"; // Dim the note more
    }
}

// Ensure SFX respects State 2
function playClickSound() {
    if (audioState === 2) return; // Silent in state 2

    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
        const soundClone = clickSound.cloneNode();
        soundClone.volume = 0.5;
        soundClone.play().catch(() => {});
    }, 0); 
}

// Loading Screen Progress (1% - 100%)
(function() {
    let progress = 0;
    const progressFill = document.getElementById('progress-fill');
    const percentageText = document.getElementById('percentage-text');
    const loadingScreen = document.getElementById('loading-screen');
    
    if (!progressFill || !percentageText || !loadingScreen) return;
    
    const loadingInterval = setInterval(function() {
        const increment = Math.floor(Math.random() * 3) + 1;
        progress += increment;
        
        if (progress >= 100) {
            progress = 99;
            clearInterval(loadingInterval);
            
            setTimeout(function() {
                loadingScreen.classList.add('hidden');
                setTimeout(function() {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 5000);
        }
        
        progressFill.style.width = progress + '%';
        percentageText.textContent = progress + '%';
        
    }, 40);
})();