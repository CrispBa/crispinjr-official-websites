
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwNRTMquEqFNZ1aclgIcnrnA4kB3Uz5MYoy4yd6ipplVQ5r5F3wr2Etj-obLScRMNaO/exec";

// Update games array with IDs for game selection
const games = [
    {
        id: 1,
        title: 'Block Puzzle',
        earnings: '$100+',
        image: 'BlockPuzzle.jpg',
        premium: true,
    },
    {
        id: 2,
        title: 'Lucky Hunt',
        earnings: '$149+',
        image: 'Luckyhunt.jpg',
        premium: true,
    },
    {
        id: 3,
        title: 'Word Bloom',
        earnings: '$85+',
        image: 'WordBloom.jpg',
        premium: true,
    },
    {
        id: 4,
        title: 'Ken Ken Puzzle',
        earnings: '$120+',
        image: 'kenken.jpg',
        premium: true,
    },
    {
        id: 5,
        title: 'Type Fury',
        earnings: '$95+',
        image: 'TypeFury.jpg',
        premium: true,
    },
    {
        id: 6,
        title: 'Mind Vault',
        earnings: '$75+',
        image: 'MindVault.jpg',
        premium: true,
    },
];

let currentGame = null;

// Update renderGames to include game ID in onclick
function renderGames() {
    const container = document.getElementById('offersList');
    container.innerHTML = games.map(game => `
        <div class="offer-card" data-game-id="${game.id}">
            <div class="offer-image">
                <img src="${game.image}" alt="${game.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23667eea%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22white%22 text-anchor=%22middle%22 dy=%22.3em%22%3E${game.title}%3C/text%3E%3C/svg%3E'">
                <div class="game-label">Game</div>
                ${game.premium ? '<div class="premium-badge">Premium</div>' : ''}
            </div>
            <div class="offer-details">
                <div class="offer-header-row">
                    <div class="offer-earnings">${game.earnings}</div>
                    <div class="offer-title">${game.title}</div>
                    <button class="info-icon" onclick="playClickSound(); console.log('Info: ${game.title}')">
                        <svg class="info-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <path d="M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                <button class="play-btn" onclick="playClickSound(); startGame('${game.title}', '${game.earnings}', ${game.id})">
                    Play and Earn ${game.earnings}
                </button>
            </div>
        </div>
    `).join('');
    
    addClickSoundsToButtons();
}

function startGame(title, earnings, gameId) {
    console.log(`Loading ${title}...`);
    
    const overlay = document.getElementById('game-overlay');
    const gameTitle = document.getElementById('game-title');
    const gameScore = document.getElementById('game-score');
    const canvasContainer = document.getElementById('game-canvas-container');
    
    // Hide main container
    document.querySelector('.game-container').style.display = 'none';
    
    // Show game overlay
    overlay.classList.remove('hidden');
    overlay.style.display = 'flex';
    gameTitle.textContent = title;
    gameScore.textContent = 'Score: 0';
    
    // Clear previous game
    canvasContainer.innerHTML = '';
    
    // Small delay to ensure DOM is ready for size calculations
    setTimeout(() => {
        if (gameId === 1) {
            currentGame = new BlockPuzzleGame(canvasContainer);
        } else if (gameId === 4) {
            currentGame = new KenKenGame(canvasContainer);
        } else {
            canvasContainer.innerHTML = `
                <div style="text-align: center; padding: 50px 20px; color: white; max-width: 100%;">
                    <h2 style="margin-bottom: 20px;">🎮 ${title}</h2>
                    <p style="margin: 20px 0; opacity: 0.8; line-height: 1.5;">This game is coming soon!</p>
                    <p style="font-size: 24px; margin: 20px 0; color: #00cec9;">Earn ${earnings}</p>
                    <button class="game-btn" onclick="backToMenu()" style="margin-top: 30px;">Back to Games</button>
                </div>
            `;
        }
    }, 100);
}
function backToMenu() {
    playClickSound();
    
    const overlay = document.getElementById('game-overlay');
    overlay.classList.add('hidden');
    overlay.style.display = 'none';
    
    document.querySelector('.game-container').style.display = 'flex';
    
    // Clean up current game
    if (currentGame && currentGame.stopTimer) {
        currentGame.stopTimer();
    }
    currentGame = null;
}

// Attach back button listener when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('back-to-menu')?.addEventListener('click', backToMenu);
});

function showSignup() {
    playClickSound();
    const loginCard = document.querySelector('#login-form').closest('.login-card');
    const signupCard = document.getElementById('signup-card');
    
    loginCard.style.display = 'none';
    signupCard.style.display = 'block';
    signupCard.classList.remove('hidden');
    
    // Clear any previous errors
    hideErrors();
}

// ✅ WORKING SIGNUP FUNCTION
function showSignup() {
    playClickSound();
    const loginCard = document.querySelector('#login-form').closest('.login-card');
    const signupCard = document.getElementById('signup-card');
    
    loginCard.style.display = 'none';
    signupCard.style.display = 'block';
    signupCard.classList.remove('hidden');
    
    // Clear any previous errors
    hideErrors();
}

// ✅ ADD THIS TOO - for "Back to Login" link
function showLogin() {
    playClickSound();
    const loginCard = document.querySelector('#login-form').closest('.login-card');
    const signupCard = document.getElementById('signup-card');
    
    signupCard.style.display = 'none';
    signupCard.classList.add('hidden');
    loginCard.style.display = 'block';
}
function validateSignup(name, email, password, confirm) {
    let isValid = true;
    hideErrors();
    
    // Name validation
    if (name.length < 2) {
        showError('signup-name', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('signup-email', 'Please enter a valid email');
        isValid = false;
    }
    
    // Password validation
    if (password.length < 6) {
        showError('signup-password', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    // Confirm password
    if (password !== confirm) {
        showError('signup-confirm', 'Passwords do not match');
        isValid = false;
    }
    
    return isValid;
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    input.style.border = '2px solid #ff4757';
    input.style.background = 'rgba(255, 71, 87, 0.1)';
    
    // Create or update error message
    let errorDiv = input.parentElement.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        input.parentElement.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    
    // Shake animation
    input.parentElement.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        input.parentElement.style.animation = '';
    }, 500);
}

function hideErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
    });
    document.querySelectorAll('#signup-form input').forEach(input => {
        input.style.border = '';
        input.style.background = '';
    });
}

// Google Sign Up
function handleGoogleSignup() {
    playClickSound();
    const btn = document.querySelector('#signup-card .google-btn');
    btn.innerHTML = '<span style="display: inline-block; width: 20px; height: 20px; border: 2px solid #ccc; border-top-color: #333; border-radius: 50%; animation: spin 0.8s linear infinite;"></span> Connecting...';
    
    setTimeout(() => {
        localStorage.setItem('userEmail', 'google_user_' + Date.now() + '@gmail.com');
        localStorage.setItem('userName', 'Google User');
        showLoadingAfterLogin();
    }, 1500);
}

// Password strength indicator (optional enhancement)
document.addEventListener('input', function(e) {
    if (e.target.id === 'signup-password') {
        const val = e.target.value;
        const strengthBar = document.querySelector('.password-strength-bar');
        
        if (!strengthBar && val.length > 0) {
            // Create strength indicator if it doesn't exist
            const wrapper = document.createElement('div');
            wrapper.className = 'password-strength show';
            wrapper.innerHTML = '<div class="password-strength-bar"></div>';
            e.target.parentElement.after(wrapper);
        }
        
        if (strengthBar) {
            const wrapper = strengthBar.parentElement;
            if (val.length === 0) {
                wrapper.classList.remove('show');
            } else {
                wrapper.classList.add('show');
                strengthBar.className = 'password-strength-bar';
                
                if (val.length < 6) {
                    strengthBar.classList.add('weak');
                } else if (val.length < 10 || !/[A-Z]/.test(val) || !/[0-9]/.test(val)) {
                    strengthBar.classList.add('medium');
                } else {
                    strengthBar.classList.add('strong');
                }
            }
        }
    }
});

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

// Listen for scroll in earn-view and game container to trigger music
const earnView = document.querySelector('.earn-view');
const gameContainer = document.querySelector('.game-container');

function handleScrollMusic() {
    if (canPlayMusic() && bgMusic.paused && audioState !== 2) {
        bgMusic.play().then(() => {
            console.log("Playback started via scroll");
        }).catch(error => {
            console.log("Scroll playback failed:", error);
        });
    }
}

// Add scroll listeners
if (earnView) {
    earnView.addEventListener('scroll', handleScrollMusic, { passive: true });
}

if (gameContainer) {
    gameContainer.addEventListener('scroll', handleScrollMusic, { passive: true });
}

// Also listen for wheel events on the main content area
document.querySelector('.main-content')?.addEventListener('wheel', handleScrollMusic, { passive: true });

// Touch move for mobile scrolling
document.querySelector('.main-content')?.addEventListener('touchmove', handleScrollMusic, { passive: true });
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
// Loading Screen Progress (1% - 100%)

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
        
        // Cap at 100% and show it before transitioning
        if (progress >= 100) {
            progress = 100;
            progressFill.style.width = '100%';
            percentageText.textContent = '100%';
            clearInterval(loadingInterval);
            
            // Small delay to let user see 100%, then fade out
            setTimeout(function() {
                loadingScreen.classList.add('hidden');
                setTimeout(function() {
                    loadingScreen.style.display = 'none';
                }, 1000);
            }, 8000); // 800ms delay so 100% is visible
        } else {
            progressFill.style.width = progress + '%';
            percentageText.textContent = progress + '%';
        }
        
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
    }, 500);
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
let loadingProgress = 0;
let loadingInterval = null;
let isLoadingComplete = false;

function startLoadingProgress() {
    const progressFill = document.getElementById('progress-fill');
    const percentageText = document.getElementById('percentage-text');
    const loadingScreen = document.getElementById('loading-screen');
    const gameContainer = document.querySelector('.game-container');
    const floatingFeatures = document.getElementById('floatingFeatures');
    
    if (!progressFill || !percentageText) return;
    
    // Clear any existing interval
    if (loadingInterval) clearInterval(loadingInterval);
    
    loadingProgress = 0;
    isLoadingComplete = false;
    
    // Use setInterval for consistent timing
    loadingInterval = setInterval(function() {
        // Increment by 1-3% randomly
        const increment = Math.floor(Math.random() * 3) + 1;
        loadingProgress += increment;
        
        // Cap at exactly 100
        if (loadingProgress >= 100) {
            loadingProgress = 100;
        }
        
        // Update display - use Math.ceil to ensure we show 100 when at 100
        const displayPercent = Math.min(loadingProgress, 100);
        progressFill.style.width = displayPercent + '%';
        percentageText.textContent = Math.floor(displayPercent) + '%';
        
        // Check if complete
        if (loadingProgress >= 100 && !isLoadingComplete) {
            isLoadingComplete = true;
            clearInterval(loadingInterval);
            
            // Force display to 100% one more time
            progressFill.style.width = '100%';
            percentageText.textContent = '100%';
            
            // Wait a moment so user sees 100%, then transition
            setTimeout(function() {
                loadingScreen.classList.add('hidden');
                loadingScreen.style.opacity = '0';
                loadingScreen.style.visibility = 'hidden';
                
                setTimeout(function() {
                    loadingScreen.style.display = 'none';
                    if (gameContainer) gameContainer.style.opacity = '1';
                    if (floatingFeatures) floatingFeatures.classList.add('active');
                }, 500);
            }, 800); // 800ms to see 100%
        }
    }, 40); // Update every 40ms
}
 
// Eased version that guarantees 100%
const easedProgress = 1 - Math.pow(1 - Math.min(elapsed / duration, 1), 3);
currentProgress = Math.min(easedProgress * 100, 100);

// Ensure we show exactly 100% at the end
if (elapsed >= duration) {
    currentProgress = 100;
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
        loadingScreen.style.opacity = '1';
        loadingScreen.style.visibility = 'visible';
        
        // Start fresh loading progress
        startLoadingProgress();
    }, 500);
}

async function handleSignup(event) {
    event.preventDefault();
    playClickSound();
    
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    
    if (!validateSignup(name, email, password, confirm)) {
        return;

    }
    
    const btn = event.target.querySelector('.login-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Creating Account...';
    btn.disabled = true;

    
    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                action: 'signup',
                name: name,
                email: email,
                password: password
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // SUCCESS: Account is saved to Google Sheets
            btn.textContent = '✓ Account Created!';
            btn.style.background = '#00b894';
            setTimeout(() => {

                showLogin(); // This switches the UI back to the Login card
                
                // Optional: Pre-fill the email for them
                document.getElementById('email').value = email;
                
                // Reset signup button for next time
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
                event.target.reset(); // Clear signup form
            }, 1500);

        } else {
            btn.textContent = originalText;
            btn.disabled = false;
            showError('signup-email', result.message || 'Signup failed');
        }
        
    } catch (error) {
        console.error('Signup error:', error);
        btn.textContent = originalText;
        btn.disabled = false;
        alert('Connection error. Please check your Apps Script deployment.');
    }
}
async function handleLogin(event) {
    event.preventDefault();
    playClickSound();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
if (!email || !password) {
        showToast("Please fill all fields");
        return;
    }
    
    // Show loading state
    const btn = document.querySelector('.login-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Logging in...';
    btn.disabled = true;
    
    try {
        // Send as JSON with text/plain content-type (exactly like your friend's code!)
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                action: 'login',
                email: email,
                password: password
            })
        });
        
        console.log('Response status:', response.status);
        
        const result = await response.json();
        console.log('Response data:', result);
        
        if (result.success) {
            // Login successful
            localStorage.setItem('userEmail', result.email);
            localStorage.setItem('userName', result.name);
            
            btn.textContent = '✓ Success!';
            btn.style.background = 'linear-gradient(135deg, #00b894 0%, #00d084 100%)';
            
            setTimeout(() => {
                showLoadingAfterLogin();
            }, 800);
        }else {
            showToast(result.message || 'Invalid email or password');
            btn.textContent = originalText;
            btn.disabled = false;
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Connection error'); // Aesthetic replacement for alert
        btn.textContent = originalText;
        btn.disabled = false;
    }
}
// --- FOCUS TRAP LOGIC ---
window.addEventListener('keydown', function(e) {
    if (e.key === 'Tab' || e.keyCode === 9) {
        const loginScreen = document.getElementById('login-screen');
        
        // Only trap focus if the login/signup screen is actually visible
        if (window.getComputedStyle(loginScreen).display !== 'none') {
            
            // 1. Find which card is currently active (Login or Signup)
            const signupCard = document.getElementById('signup-card');
            const isSignupVisible = signupCard.style.display !== 'none';
            const activeCard = isSignupVisible ? signupCard : document.querySelector('.login-card:not(.hidden)');

            // 2. Get all focusable elements inside the active card
            const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
            const focusableElements = activeCard.querySelectorAll(focusableSelectors);
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            // 3. Logic for cycling
            if (e.shiftKey) { 
                // If Shift + Tab and on the FIRST element, wrap to the LAST
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { 
                // If Tab and on the LAST element, wrap to the FIRST
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
            
            // If the focus is somehow outside the card (e.g., clicked background), force it back in
            const isFocusInside = activeCard.contains(document.activeElement);
            if (!isFocusInside) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
});

// Auto-focus the first input when switching screens
function focusFirstInput() {
    const signupCard = document.getElementById('signup-card');
    if (signupCard.style.display !== 'none') {
        document.getElementById('signup-name').focus();
    } else {
        document.getElementById('email').focus();
    }
}

// Update your existing showSignup and showLogin to call focusFirstInput
const originalShowSignup = showSignup;
showSignup = function() {
    originalShowSignup();
    setTimeout(focusFirstInput, 100);
};

const originalShowLogin = showLogin;
showLogin = function() {
    originalShowLogin();
    setTimeout(focusFirstInput, 100);
};

// Also focus first input on app load
window.addEventListener('load', () => {
    if (document.getElementById('login-screen').style.display !== 'none') {
        setTimeout(focusFirstInput, 3500); // Wait for splash to finish
    }
});


// Also run it every 2 seconds just in case new elements appear
setInterval(disableAllTabStops, 2000);
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
function togglePassword(inputId, toggleBtn) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
    toggleBtn.classList.toggle('active');
}
function updateUserAvatar() {
    const userName = localStorage.getItem('userName') || 'Felix';
    const avatarImg = document.querySelector('.avatar img');
    if (avatarImg) {
        avatarImg.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`;
    }
}

// Call after game loads
setTimeout(updateUserAvatar, 2000);


