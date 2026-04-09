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

        // Modal functions
        function showModal(title, message) {
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalText').textContent = message;
            document.getElementById('modal').classList.add('active');
        }

        function closeModal(event) {
            if (!event || event.target.id === 'modal') {
                document.getElementById('modal').classList.remove('active');
            }
        }

        // Floating button modal functions
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

        // Tab switching
function toggleMute() {
    const slash = document.getElementById('mute-slash');
    const btn = document.getElementById('mute-btn');
    
    if (slash.style.display === 'none') {
        // Switch to MUTED state
        slash.style.display = 'block';
        btn.classList.add('muted');
        console.log("Audio Muted");
        // Add your audio.mute = true logic here
    } else {
        // Switch to ACTIVE state
        slash.style.display = 'none';
        btn.classList.remove('muted');
        console.log("Audio Playing");
        // Add your audio.mute = false logic here
    }
}
        function switchTab(tab) {
            // Update active state
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            event.currentTarget.classList.add('active');

            // Show/hide floating features based on tab
            const floatingFeatures = document.getElementById('floatingFeatures');
            if (tab === 'earn') {
                floatingFeatures.classList.add('active');
            } else {
                floatingFeatures.classList.remove('active');
            }

            // Show modal for non-earn tabs
            if (tab !== 'earn') {
                const tabNames = {
                    'offers': 'My Offers',
                    'cashout': 'Cashout',
                    'rewards': 'Rewards'
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