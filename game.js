
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
                    
                    <!-- ADD playClickSound() to info button -->
                    <button class="info-icon" onclick="playClickSound(); console.log('Info: ${game.title}')">
                        <svg class="info-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <path d="M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                
                <!-- ADD playClickSound() to play button -->
                <button class="play-btn" onclick="playClickSound(); startGame('${game.title}', '${game.earnings}')">
                    Play and Earn ${game.earnings}
                </button>
            </div>
        </div>
    `).join('');
    
    // Re-attach click sounds to newly created buttons
    addClickSoundsToButtons();
}

// New function to actually start the game (without modal)
function startGame(title, earnings) {
    console.log(`Loading ${title}...`);
    // Add your actual game loading code here
    // window.location.href = `/game/${title}`;
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
clickSound.volume = 0.7;
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

// Check if we're in a screen where music should be muted
function canPlayMusic() {
    const loginScreen = document.getElementById('login-screen');
    const loadingScreen = document.getElementById('loading-screen');
    
    // Check if login screen is visible
    if (loginScreen) {
        const style = window.getComputedStyle(loginScreen);
        if (style.display !== 'none' && style.visibility !== 'hidden' && !loginScreen.classList.contains('hidden')) {
            return false;
        }
    }
    
    // Check if loading/splash screen is visible
    if (loadingScreen) {
        const style = window.getComputedStyle(loadingScreen);
        if (style.display !== 'none' && style.visibility !== 'hidden' && !loadingScreen.classList.contains('hidden')) {
            return false;
        }
    }
    
    return true;
}

// Modify startMusic to respect screen state
function startMusic() {
    // Don't play during splash, login, or loading screens
    if (!canPlayMusic()) {
        console.log("Music muted on splash/login/loading screen");
        return;
    }
    
    // Also respect the mute toggle state (state 2 = all muted)
    if (audioState === 2) return;
    
    if (bgMusic.paused) {
        bgMusic.play().then(() => {
            console.log("Playback started successfully");
        }).catch(error => {
            console.log("Playback failed:", error);
        });
    }
}

// Update the window load handler to pause music when showing login
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const loginScreen = document.getElementById('login-screen');
    const gameContainer = document.querySelector('.game-container');
    const floatingFeatures = document.getElementById('floatingFeatures');
    const progressFill = document.getElementById('progress-fill');
    const percentageText = document.getElementById('percentage-text');
    
    // Ensure loading is visible and others are hidden
    loadingScreen.style.display = 'flex';
    loadingScreen.classList.remove('hidden');
    loginScreen.style.display = 'none';
    loginScreen.classList.add('hidden');
    if (gameContainer) gameContainer.style.opacity = '0';
    if (floatingFeatures) floatingFeatures.classList.remove('active');
    
    // IMPORTANT: Ensure music is paused at start
    bgMusic.pause();
    bgMusic.currentTime = 0;
    
    // Force reflow
    void loadingScreen.offsetHeight;
    
    // Run splash animation (3 seconds)
    let progress = 0;
    const duration = 3000;
    const startTime = Date.now();
    
    function updateSplash() {
        const elapsed = Date.now() - startTime;
        progress = Math.min((elapsed / duration) * 100, 100);
        
        if (progressFill) progressFill.style.width = progress + '%';
        if (percentageText) percentageText.textContent = Math.floor(progress) + '%';
        
        if (progress < 100) {
            requestAnimationFrame(updateSplash);
        } else {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                loadingScreen.style.opacity = '0';
                loadingScreen.style.visibility = 'hidden';
                
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    splashComplete = true;
                    
                    const isLoggedIn = localStorage.getItem('userEmail');
                    
                    if (isLoggedIn) {
                        // Show game - music can play now (will start on next click or you can auto-start)
                        if (gameContainer) {
                            gameContainer.style.opacity = '1';
                            floatingFeatures.classList.add('active');
                            renderGames();
                        }
                        // Optional: Auto-start music if unmuted
                        if (audioState === 0) startMusic();
                    } else {
                        // Show login - ensure music is paused
                        bgMusic.pause();
                        bgMusic.currentTime = 0;
                        loginScreen.style.display = 'flex';
                        setTimeout(() => {
                            loginScreen.classList.remove('hidden');
                        }, 50);
                    }
                }, 500);
            }, 200);
        }
    }
    
    requestAnimationFrame(updateSplash);
});

// Also pause music when showing modal or any login-related overlay
function showModal(title, text) {
    const modal = document.getElementById('modal');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalText').textContent = text;
    modal.classList.add('active');
    
    // Optional: Pause music when modal is open
    // bgMusic.pause();
}
// DISABLE ALL MODALS - Override the showModal function
function showModal(title, text) {
    console.log('Modal blocked:', title); // Optional: for debugging
    return; // Does nothing - modals won't appear
}

// Also disable these specific modal functions
function showBonusModal() { console.log('Bonus modal blocked'); }
function showThemeModal() { console.log('Theme modal blocked'); }
function showSkinModal() { console.log('Skin modal blocked'); }
function closeModal() {
    document.getElementById('modal').classList.remove('active');
    // Optional: Resume music if game is visible and not muted
    // if (canPlayMusic() && audioState === 0) startMusic();
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

function handleGoogleLogin() {
    // For Google Sign-In integration with your existing setup
    // This would typically use Google Identity Services
    const btn = document.querySelector('.google-btn');
    btn.innerHTML = '<span style="display: inline-block; width: 20px; height: 20px; border: 2px solid #ccc; border-top-color: #333; border-radius: 50%; animation: spin 0.8s linear infinite;"></span> Connecting...';
    
    // Simulate Google login (replace with actual Google Sign-In)
    setTimeout(() => {
        localStorage.setItem('userEmail', 'google_user@gmail.com');
        localStorage.setItem('userName', 'Google User');
        showLoadingScreen();
    }, 1500);
}


function showLoadingScreen() {
    const loginScreen = document.getElementById('login-screen');
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide login screen
    loginScreen.classList.add('hidden');
    
    // Show loading screen after transition
    setTimeout(() => {
        loginScreen.style.display = 'none';
        loadingScreen.style.display = 'flex';
        loadingScreen.classList.remove('hidden');
        
        // Start the loading progress
        startLoadingProgress();
    }, 500);
}
// Loading Screen Progress
let loadingProgress = 0;
let loadingInterval;

function startLoadingProgress() {
    const progressFill = document.getElementById('progress-fill');
    const percentageText = document.getElementById('percentage-text');
    const loadingScreen = document.getElementById('loading-screen');
    
    if (!progressFill || !percentageText) return;
    
    let currentProgress = 0;
    const startTime = Date.now();
    const minDuration = 5000; // 5 seconds minimum
    const maxDuration = 8000; // 8 seconds maximum
    
    // Detect connection speed
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const effectiveType = connection ? connection.effectiveType : '4g';
    
    // Set target duration based on connection (slower = longer loading)
    let targetDuration;
    switch(effectiveType) {
        case 'slow-2g':
        case '2g':
            targetDuration = 7500; // ~7.5s for very slow
            break;
        case '3g':
            targetDuration = 6000; // ~6s for 3g
            break;
        case '4g':
        default:
            targetDuration = 5000 + Math.random() * 1500; // 5-6.5s for fast
            break;
    }
    
    // Clamp to max 8 seconds
    targetDuration = Math.min(targetDuration, maxDuration);
    targetDuration = Math.max(targetDuration, minDuration);
    
    function updateProgress() {
        const elapsed = Date.now() - startTime;
        const rawProgress = (elapsed / targetDuration) * 100;
        
        // Smooth easing - starts faster, slows at end
        // Ease-out cubic: 1 - (1 - x)^3
        const easedProgress = 1 - Math.pow(1 - Math.min(rawProgress / 100, 1), 3);
        currentProgress = Math.floor(easedProgress * 100);
        
        // Cap at 99% until actually done
        if (currentProgress > 99) currentProgress = 99;
        
        progressFill.style.width = currentProgress + '%';
        percentageText.textContent = currentProgress + '%';
        
        if (elapsed < targetDuration) {
            requestAnimationFrame(updateProgress);
        } else {
            // Complete
            currentProgress = 100;
            progressFill.style.width = '100%';
            percentageText.textContent = '100%';
            
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    document.querySelector('.game-container').style.opacity = '1';
                }, 500);
            }, 300);
        }
    }
    
    requestAnimationFrame(updateProgress);
}

// Check auth status and show appropriate screen
function initApp() {
    const isLoggedIn = localStorage.getItem('userEmail');
    const loginScreen = document.getElementById('login-screen');
    const loadingScreen = document.getElementById('loading-screen');
    
    // Always start with splash visible (CSS handles splash.png background)
    // After 2 seconds, decide what to show
    setTimeout(() => {
        if (isLoggedIn) {
            // User logged in: show loading -> game
            loginScreen.style.display = 'none';
            loadingScreen.style.display = 'flex';
            loadingScreen.classList.remove('hidden');
            startLoadingProgress();
        } else {
            // User not logged in: show login screen
            loginScreen.style.display = 'flex';
            loadingScreen.style.display = 'none';
        }
    }, 2000); // 2 seconds splash
}

// Handle login success
function showLoadingAfterLogin() {
    const loginScreen = document.getElementById('login-screen');
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide login screen
    loginScreen.classList.add('hidden');
    
    setTimeout(() => {
        loginScreen.style.display = 'none';
        loadingScreen.style.display = 'flex';
        loadingScreen.classList.remove('hidden');
        startLoadingProgress();
    }, 500);
}

// Update handleLogin to use new flow
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email && password) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', email.split('@')[0]);
        
        const loginBtn = document.querySelector('.login-btn');
        loginBtn.textContent = '✓ Success!';
        loginBtn.style.background = 'linear-gradient(135deg, #00b894 0%, #00d084 100%)';
        
        setTimeout(() => {
            showLoadingAfterLogin();
        }, 800);
    }
}


// Remove the old window.onload at bottom of file

function showSignup() {
    showModal('Sign Up', 'Registration form coming soon!\n\nFor now, please use Google login or email login.');
}

// Check if user is already logged in on page load
window.addEventListener('load', function() {
    const isLoggedIn = localStorage.getItem('userEmail');
    const loginScreen = document.getElementById('login-screen');
    const loadingScreen = document.getElementById('loading-screen');
    
    if (isLoggedIn) {
        // Skip login if already logged in (optional - remove if you want login every time)
        loginScreen.style.display = 'none';
        loadingScreen.style.display = 'flex';
        startLoadingProgress();
    } else {
        // Show login screen, hide loading initially
        loadingScreen.style.display = 'none';
        loginScreen.style.display = 'flex';
    }
});

// Add spin animation for Google button loader
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Update avatar with user data if available
function updateUserAvatar() {
    const userName = localStorage.getItem('userName') || 'Felix';
    const avatarImg = document.querySelector('.avatar img');
    if (avatarImg) {
        avatarImg.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`;
    }
}

// Call after game loads
setTimeout(updateUserAvatar, 2000);