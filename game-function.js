// ==================== BLOCK PUZZLE GAME - RESPONSIVE ====================
class BlockPuzzleGame {
    constructor(container) {
        this.container = container;
        this.gridSize = 10;
        this.grid = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(0));
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('blockPuzzleHighScore') || '0');
        this.currentShapes = [];
        this.selectedShape = null;
        this.gameOver = false;
        this.cellSize = 30; // Will be calculated dynamically

        this.shapeDefinitions = [
            [[1]], [[1, 1]], [[1], [1]], [[1, 1, 1]], [[1], [1], [1]],
            [[1, 1], [1, 1]], [[1, 1, 1], [1, 0, 0]], [[1, 0, 0], [1, 1, 1]],
            [[0, 0, 1], [1, 1, 1]], [[1, 1, 1], [0, 0, 1]], [[1, 1, 1, 1]], [[1], [1], [1], [1]],
            [[0, 1, 0], [1, 1, 1]], [[1, 1, 0], [0, 1, 1]], [[0, 1, 1], [1, 1, 0]],
            [[1, 1, 1], [1, 1, 1]], [[1, 1], [1, 1], [1, 1]],
        ];

        this.init();
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
    }

    init() {
        this.render();
        this.calculateCellSize();
        this.generateShapes();
        this.updateScore();
    }

    // Calculate optimal cell size based on available space
    calculateCellSize() {
        const container = this.container.querySelector('.block-puzzle-game');
        if (!container) return;

        const gameInfo = container.querySelector('.game-info');
        const shapesContainer = container.querySelector('.shapes-container');
        const controls = container.querySelector('.game-controls');

        const headerHeight = gameInfo ? gameInfo.offsetHeight + 20 : 80;
        const shapesHeight = shapesContainer ? shapesContainer.offsetHeight + 20 : 120;
        const controlsHeight = controls ? controls.offsetHeight + 20 : 70;

        const availableHeight = container.offsetHeight - headerHeight - shapesHeight - controlsHeight - 40;
        const availableWidth = container.offsetWidth - 40;

        // Calculate max cell size that fits both dimensions
        const maxCellHeight = Math.floor(availableHeight / this.gridSize);
        const maxCellWidth = Math.floor(availableWidth / this.gridSize);

        this.cellSize = Math.min(maxCellHeight, maxCellWidth, 35);
        this.cellSize = Math.max(this.cellSize, 22); // Minimum cell size

        this.renderGrid();
    }

    handleResize() {
        // Debounce resize
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.calculateCellSize();
        }, 100);
    }

    render() {
        this.container.innerHTML = `
            <div class="block-puzzle-game">
                <div class="game-info">
                    <div class="score-display">
                        <div class="score-label">Score</div>
                        <div class="score-value" id="bp-score">0</div>
                    </div>
                    <div class="high-score-display">
                        <div class="score-label">Best</div>
                        <div class="score-value" id="bp-high-score">${this.highScore}</div>
                    </div>
                </div>
                <div class="grid-container" id="bp-grid"></div>
                <div class="shapes-container" id="bp-shapes"></div>
                <div class="game-controls">
                    <button class="game-btn" id="bp-new-game">New Game</button>
                    <button class="game-btn secondary" id="bp-restart">Restart</button>
                </div>
            </div>
        `;
        this.renderGrid();
        this.attachEventListeners();
    }

    renderGrid() {
        const gridContainer = document.getElementById('bp-grid');
        if (!gridContainer) return;

        gridContainer.innerHTML = '';
        gridContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(${this.gridSize}, ${this.cellSize}px);
            grid-template-rows: repeat(${this.gridSize}, ${this.cellSize}px);
            gap: 2px;
            background: rgba(0, 0, 0, 0.3);
            padding: 4px;
            border-radius: 8px;
            margin: 0 auto;
            width: fit-content;
        `;

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.style.cssText = `
                    width: ${this.cellSize}px;
                    height: ${this.cellSize}px;
                    background: ${this.grid[row][col] ? this.grid[row][col] : 'rgba(255, 255, 255, 0.05)'};
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                    transition: all 0.2s ease;
                `;

                // Touch and mouse events
                cell.addEventListener('mouseenter', (e) => this.handleCellHover(e));
                cell.addEventListener('click', (e) => this.handleCellClick(e));
                cell.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.handleCellClick(e);
                }, {passive: false});

                gridContainer.appendChild(cell);
            }
        }
    }

    generateShapes() {
        this.currentShapes = [];
        for (let i = 0; i < 3; i++) {
            const randomShape = this.shapeDefinitions[Math.floor(Math.random() * this.shapeDefinitions.length)];
            const color = this.getRandomColor();
            this.currentShapes.push({ shape: randomShape, color, used: false });
        }
        this.renderShapes();
    }

    getRandomColor() {
        const colors = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    renderShapes() {
        const shapesContainer = document.getElementById('bp-shapes');
        if (!shapesContainer) return;

        shapesContainer.innerHTML = '';

        this.currentShapes.forEach((shapeData, index) => {
            if (shapeData.used) return;

            const shapeWrapper = document.createElement('div');
            shapeWrapper.className = 'shape-wrapper';
            shapeWrapper.dataset.shapeIndex = index;

            const canPlace = this.canPlaceAnyShape(shapeData.shape);
            shapeWrapper.style.cssText = `
                cursor: ${canPlace ? 'grab' : 'not-allowed'};
                opacity: ${canPlace ? '1' : '0.4'};
                padding: 8px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                transition: transform 0.2s ease;
                transform: scale(${canPlace ? 1 : 0.9});
            `;

            const shape = this.createShapeElement(shapeData.shape, shapeData.color);
            shapeWrapper.appendChild(shape);

            if (canPlace) {
                shapeWrapper.addEventListener('mousedown', (e) => this.handleShapeSelect(e, index));
                shapeWrapper.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.handleShapeSelect(e, index);
                }, {passive: false});
            }

            shapesContainer.appendChild(shapeWrapper);
        });
    }

    createShapeElement(shape, color) {
        const shapeElement = document.createElement('div');
        const cellSize = Math.min(22, Math.floor(this.cellSize * 0.7));

        shapeElement.style.cssText = `
            display: grid;
            grid-template-columns: repeat(${shape[0].length}, ${cellSize}px);
            grid-template-rows: repeat(${shape.length}, ${cellSize}px);
            gap: 1px;
            pointer-events: none;
        `;

        shape.forEach(row => {
            row.forEach(cell => {
                const cellDiv = document.createElement('div');
                cellDiv.style.cssText = `
                    width: ${cellSize}px;
                    height: ${cellSize}px;
                    background: ${cell ? color : 'transparent'};
                    border-radius: 2px;
                    border: ${cell ? '1px solid rgba(255,255,255,0.3)' : 'none'};
                `;
                shapeElement.appendChild(cellDiv);
            });
        });
        return shapeElement;
    }

    handleShapeSelect(e, shapeIndex) {
        e.preventDefault();
        this.selectedShape = shapeIndex;

        // Visual feedback
        document.querySelectorAll('.shape-wrapper').forEach((wrapper, idx) => {
            if (idx === shapeIndex) {
                wrapper.style.transform = 'scale(1.1)';
                wrapper.style.background = 'rgba(255,255,255,0.15)';
            } else {
                wrapper.style.transform = 'scale(1)';
                wrapper.style.background = 'rgba(255,255,255,0.05)';
            }
        });
    }

    handleCellHover(e) {
        if (this.selectedShape === null) return;

        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        const shapeData = this.currentShapes[this.selectedShape];

        // Clear previous preview
        document.querySelectorAll('.grid-cell').forEach(cell => {
            const r = parseInt(cell.dataset.row);
            const c = parseInt(cell.dataset.col);
            if (!this.grid[r][c]) {
                cell.style.background = 'rgba(255, 255, 255, 0.05)';
                cell.style.opacity = '1';
            }
        });

        // Show preview
        if (this.canPlaceShape(shapeData.shape, row, col)) {
            this.previewShape(shapeData.shape, row, col, shapeData.color);
        }
    }

    previewShape(shape, startRow, startCol, color) {
        shape.forEach((row, rIdx) => {
            row.forEach((cell, cIdx) => {
                if (cell) {
                    const gridRow = startRow + rIdx;
                    const gridCol = startCol + cIdx;
                    if (gridRow < this.gridSize && gridCol < this.gridSize) {
                        const cellElement = document.querySelector(`[data-row="${gridRow}"][data-col="${gridCol}"]`);
                        if (cellElement && !this.grid[gridRow][gridCol]) {
                            cellElement.style.background = color;
                            cellElement.style.opacity = '0.5';
                        }
                    }
                }
            });
        });
    }

    handleCellClick(e) {
        if (this.selectedShape === null || this.gameOver) return;

        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        const shapeData = this.currentShapes[this.selectedShape];

        if (this.canPlaceShape(shapeData.shape, row, col)) {
            this.placeShape(shapeData.shape, row, col, shapeData.color);
            shapeData.used = true;
            this.selectedShape = null;

            // Reset shape visuals
            document.querySelectorAll('.shape-wrapper').forEach(wrapper => {
                wrapper.style.transform = 'scale(1)';
                wrapper.style.background = 'rgba(255,255,255,0.05)';
            });

            this.clearCompleteLines();
            this.renderGrid();
            this.renderShapes();

            if (this.currentShapes.every(s => s.used)) {
                this.generateShapes();
            }

            if (this.isGameOver()) {
                this.endGame();
            }
        }
    }

    canPlaceShape(shape, startRow, startCol) {
        for (let rIdx = 0; rIdx < shape.length; rIdx++) {
            for (let cIdx = 0; cIdx < shape[rIdx].length; cIdx++) {
                if (shape[rIdx][cIdx]) {
                    const gridRow = startRow + rIdx;
                    const gridCol = startCol + cIdx;
                    if (gridRow >= this.gridSize || gridCol >= this.gridSize) return false;
                    if (gridRow < 0 || gridCol < 0) return false;
                    if (this.grid[gridRow][gridCol]) return false;
                }
            }
        }
        return true;
    }

    canPlaceAnyShape(shape) {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.canPlaceShape(shape, row, col)) return true;
            }
        }
        return false;
    }

    placeShape(shape, startRow, startCol, color) {
        let blocksPlaced = 0;
        shape.forEach((row, rIdx) => {
            row.forEach((cell, cIdx) => {
                if (cell) {
                    const gridRow = startRow + rIdx;
                    const gridCol = startCol + cIdx;
                    this.grid[gridRow][gridCol] = color;
                    blocksPlaced++;
                }
            });
        });
        this.score += blocksPlaced * 10;
        this.updateScore();
    }

    clearCompleteLines() {
        let linesCleared = 0;

        // Check rows
        for (let row = 0; row < this.gridSize; row++) {
            if (this.grid[row].every(cell => cell !== 0)) {
                this.grid[row] = Array(this.gridSize).fill(0);
                linesCleared++;
                this.animateClear('row', row);
            }
        }

        // Check columns
        for (let col = 0; col < this.gridSize; col++) {
            let columnFull = true;
            for (let row = 0; row < this.gridSize; row++) {
                if (this.grid[row][col] === 0) {
                    columnFull = false;
                    break;
                }
            }
            if (columnFull) {
                for (let row = 0; row < this.gridSize; row++) {
                    this.grid[row][col] = 0;
                }
                linesCleared++;
                this.animateClear('col', col);
            }
        }

        if (linesCleared > 0) {
            this.score += linesCleared * 100;
            if (linesCleared > 1) this.score += (linesCleared - 1) * 50;
            this.updateScore();
        }
    }

    animateClear(type, index) {
        // Simple flash animation
        const cells = type === 'row' 
            ? document.querySelectorAll(`[data-row="${index}"]`)
            : document.querySelectorAll(`[data-col="${index}"]`);

        cells.forEach(cell => {
            cell.style.background = '#fff';
            cell.style.transform = 'scale(1.1)';
        });

        setTimeout(() => {
            cells.forEach(cell => {
                cell.style.transform = 'scale(1)';
            });
        }, 150);
    }

    isGameOver() {
        const remainingShapes = this.currentShapes.filter(s => !s.used);
        if (remainingShapes.length === 0) return false;
        return remainingShapes.every(s => !this.canPlaceAnyShape(s.shape));
    }

    updateScore() {
        const scoreEl = document.getElementById('bp-score');
        const highScoreEl = document.getElementById('bp-high-score');

        if (scoreEl) scoreEl.textContent = this.score;

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('blockPuzzleHighScore', this.highScore);
            if (highScoreEl) highScoreEl.textContent = this.highScore;
        }

        const gameScoreEl = document.getElementById('game-score');
        if (gameScoreEl) {
            gameScoreEl.textContent = `Score: ${this.score}`;
        }
    }

    endGame() {
        this.gameOver = true;

        // Show game over overlay instead of alert
        const gameOverDiv = document.createElement('div');
        gameOverDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            color: white;
            z-index: 1000;
            border: 3px solid rgba(255,255,255,0.3);
            box-shadow: 0 15px 50px rgba(0,0,0,0.5);
        `;
        gameOverDiv.innerHTML = `
            <h2 style="margin-bottom: 15px; font-size: 24px;">🎮 Game Over!</h2>
            <p style="font-size: 18px; margin-bottom: 10px;">Score: ${this.score}</p>
            <p style="font-size: 14px; opacity: 0.8; margin-bottom: 20px;">Best: ${this.highScore}</p>
            <button onclick="this.parentElement.remove(); currentGame.restart();" 
                    style="background: #00d084; border: none; padding: 12px 30px; border-radius: 25px; 
                           color: white; font-weight: 700; cursor: pointer; font-size: 14px;">
                Play Again
            </button>
        `;

        this.container.querySelector('.block-puzzle-game').appendChild(gameOverDiv);
    }

    restart() {
        this.grid = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.selectedShape = null;

        // Remove any game over overlay
        const overlay = this.container.querySelector('.block-puzzle-game > div[style*="z-index: 1000"]');
        if (overlay) overlay.remove();

        this.init();
    }

    attachEventListeners() {
        document.getElementById('bp-new-game')?.addEventListener('click', () => this.restart());
        document.getElementById('bp-restart')?.addEventListener('click', () => this.restart());

        // Deselect shape when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.shape-wrapper') && !e.target.closest('.grid-cell')) {
                this.selectedShape = null;
                document.querySelectorAll('.shape-wrapper').forEach(wrapper => {
                    wrapper.style.transform = 'scale(1)';
                    wrapper.style.background = 'rgba(255,255,255,0.05)';
                });
            }
        });
    }

    destroy() {
        window.removeEventListener('resize', this.handleResize);
    }
}

// ==================== KENKEN GAME ====================
class KenKenGame {
    constructor(container) {
        this.container = container;
        this.gridSize = 4;
        this.grid = [];
        this.solution = [];
        this.cages = [];
        this.selectedCell = null;
        this.mistakes = 0;
        this.hintsUsed = 0;
        this.maxHints = 3;
        this.timer = 0;
        this.timerInterval = null;
        this.difficulty = 'easy';
        this.init();
    }
    
    init() {
        this.render();
        this.generatePuzzle();
        this.startTimer();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="kenken-game">
                <div class="kenken-header">
                    <div class="kenken-info">
                        <div class="info-item">
                            <div class="info-label">Time</div>
                            <div class="info-value" id="kk-timer">0:00</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Mistakes</div>
                            <div class="info-value" id="kk-mistakes">0</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Hints</div>
                            <div class="info-value" id="kk-hints">${this.maxHints - this.hintsUsed}</div>
                        </div>
                    </div>
                    <div class="difficulty-selector">
                        <button class="diff-btn ${this.difficulty === 'easy' ? 'active' : ''}" data-diff="easy">Easy (4x4)</button>
                        <button class="diff-btn ${this.difficulty === 'medium' ? 'active' : ''}" data-diff="medium">Medium (6x6)</button>
                    </div>
                </div>
                <div class="kenken-grid-container" id="kk-grid"></div>
                <div class="number-pad" id="kk-number-pad"></div>
                <div class="game-controls">
                    <button class="game-btn" id="kk-hint">💡 Hint</button>
                    <button class="game-btn" id="kk-check">✓ Check</button>
                    <button class="game-btn secondary" id="kk-clear">Clear</button>
                    <button class="game-btn secondary" id="kk-new">New Puzzle</button>
                </div>
            </div>
        `;
        this.attachEventListeners();
    }
    
    generatePuzzle() {
        this.solution = this.generateValidGrid();
        this.grid = Array(this.gridSize).fill(null).map(() => 
            Array(this.gridSize).fill(null).map(() => ({ value: 0, fixed: false }))
        );
        this.generateCages();
        this.renderGrid();
        this.renderNumberPad();
    }
    
    generateValidGrid() {
        const grid = [];
        for (let i = 0; i < this.gridSize; i++) {
            grid[i] = [];
            for (let j = 0; j < this.gridSize; j++) {
                grid[i][j] = ((i + j) % this.gridSize) + 1;
            }
        }
        this.shuffleGrid(grid);
        return grid;
    }
    
    shuffleGrid(grid) {
        for (let i = grid.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [grid[i], grid[j]] = [grid[j], grid[i]];
        }
        for (let i = grid.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            for (let row = 0; row < grid.length; row++) {
                [grid[row][i], grid[row][j]] = [grid[row][j], grid[row][i]];
            }
        }
    }
    
    generateCages() {
        this.cages = [];
        const used = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(false));
        const colors = [
            'rgba(255, 107, 107, 0.2)', 'rgba(78, 205, 196, 0.2)',
            'rgba(255, 195, 113, 0.2)', 'rgba(162, 155, 254, 0.2)',
            'rgba(255, 159, 243, 0.2)', 'rgba(181, 234, 215, 0.2)',
        ];
        let colorIndex = 0;
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (!used[row][col]) {
                    const cage = this.createCage(row, col, used);
                    cage.color = colors[colorIndex % colors.length];
                    this.cages.push(cage);
                    colorIndex++;
                }
            }
        }
    }
    
    createCage(startRow, startCol, used) {
        const maxSize = this.difficulty === 'easy' ? 3 : 4;
        const cageSize = Math.floor(Math.random() * (maxSize - 1)) + 1;
        const cells = [[startRow, startCol]];
        used[startRow][startCol] = true;
        for (let i = 1; i < cageSize; i++) {
            const lastCell = cells[cells.length - 1];
            const neighbors = this.getUnusedNeighbors(lastCell[0], lastCell[1], used);
            if (neighbors.length > 0) {
                const newCell = neighbors[Math.floor(Math.random() * neighbors.length)];
                cells.push(newCell);
                used[newCell[0]][newCell[1]] = true;
            } else {
                break;
            }
        }
        const values = cells.map(([r, c]) => this.solution[r][c]);
        const operation = this.chooseOperation(values);
        const target = this.calculateTarget(values, operation);
        return { cells, operation, target };
    }
    
    getUnusedNeighbors(row, col, used) {
        const neighbors = [];
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < this.gridSize && 
                newCol >= 0 && newCol < this.gridSize && 
                !used[newRow][newCol]) {
                neighbors.push([newRow, newCol]);
            }
        }
        return neighbors;
    }
    
    chooseOperation(values) {
        if (values.length === 1) return 'none';
        const operations = ['+', '-', '×', '÷'];
        const validOps = operations.filter(op => {
            if (op === '÷') return values.length === 2 && values[0] % values[1] === 0;
            return true;
        });
        return validOps[Math.floor(Math.random() * validOps.length)];
    }
    
    calculateTarget(values, operation) {
        if (operation === 'none') return values[0];
        switch (operation) {
            case '+': return values.reduce((a, b) => a + b, 0);
            case '-': return Math.abs(values[0] - values[1]);
            case '×': return values.reduce((a, b) => a * b, 1);
            case '÷': return Math.max(values[0] / values[1], values[1] / values[0]);
            default: return 0;
        }
    }
    
    renderGrid() {
        const gridContainer = document.getElementById('kk-grid');
        const cellSize = this.gridSize === 4 ? 70 : 50;
        gridContainer.innerHTML = '';
        gridContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(${this.gridSize}, ${cellSize}px);
            grid-template-rows: repeat(${this.gridSize}, ${cellSize}px);
            gap: 0;
            margin: 20px auto;
            width: fit-content;
            border: 2px solid rgba(255, 255, 255, 0.3);
        `;
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'kenken-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                const cage = this.getCageForCell(row, col);
                const isFirstInCage = cage && cage.cells[0][0] === row && cage.cells[0][1] === col;
                cell.style.cssText = `
                    width: ${cellSize}px;
                    height: ${cellSize}px;
                    background: ${cage ? cage.color : 'rgba(255, 255, 255, 0.05)'};
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: ${this.gridSize === 4 ? '24px' : '18px'};
                    font-weight: 700;
                    color: white;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.2s ease;
                `;
                if (isFirstInCage) {
                    const label = document.createElement('div');
                    label.className = 'cage-label';
                    label.textContent = `${cage.target}${cage.operation !== 'none' ? cage.operation : ''}`;
                    label.style.cssText = `
                        position: absolute;
                        top: 2px;
                        left: 2px;
                        font-size: 10px;
                        color: rgba(255, 255, 255, 0.7);
                        font-weight: 600;
                    `;
                    cell.appendChild(label);
                }
                const value = this.grid[row][col].value;
                if (value > 0) {
                    cell.textContent = value;
                }
                cell.addEventListener('click', () => this.handleCellClick(row, col));
                gridContainer.appendChild(cell);
            }
        }
    }
    
    getCageForCell(row, col) {
        return this.cages.find(cage => cage.cells.some(([r, c]) => r === row && c === col));
    }
    
    renderNumberPad() {
        const padContainer = document.getElementById('kk-number-pad');
        padContainer.innerHTML = '';
        padContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 10px;
            margin: 20px 0;
            flex-wrap: wrap;
        `;
        for (let i = 1; i <= this.gridSize; i++) {
            const btn = document.createElement('button');
            btn.className = 'number-btn';
            btn.textContent = i;
            btn.style.cssText = `
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                border-radius: 8px;
                color: white;
                font-size: 20px;
                font-weight: 700;
                cursor: pointer;
                transition: transform 0.2s ease;
            `;
            btn.addEventListener('click', () => this.handleNumberInput(i));
            padContainer.appendChild(btn);
        }
        const clearBtn = document.createElement('button');
        clearBtn.className = 'number-btn';
        clearBtn.textContent = '×';
        clearBtn.style.cssText = `
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 24px;
            font-weight: 700;
            cursor: pointer;
            transition: transform 0.2s ease;
        `;
        clearBtn.addEventListener('click', () => this.handleNumberInput(0));
        padContainer.appendChild(clearBtn);
    }
    
    handleCellClick(row, col) {
        document.querySelectorAll('.kenken-cell').forEach(cell => {
            cell.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        });
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.style.border = '2px solid #00d084';
        this.selectedCell = { row, col };
    }
    
    handleNumberInput(num) {
        if (!this.selectedCell) return;
        const { row, col } = this.selectedCell;
        this.grid[row][col].value = num;
        this.renderGrid();
        setTimeout(() => {
            this.handleCellClick(row, col);
        }, 10);
    }
    
    checkSolution() {
        let correct = true;
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const userValue = this.grid[row][col].value;
                const correctValue = this.solution[row][col];
                if (userValue !== correctValue && userValue !== 0) {
                    correct = false;
                    this.mistakes++;
                    document.getElementById('kk-mistakes').textContent = this.mistakes;
                    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    cell.style.background = 'rgba(255, 107, 107, 0.3)';
                    setTimeout(() => {
                        const cage = this.getCageForCell(row, col);
                        cell.style.background = cage ? cage.color : 'rgba(255, 255, 255, 0.05)';
                    }, 1000);
                }
            }
        }
        if (this.isComplete() && correct) {
            this.winGame();
        } else if (correct) {
            this.showMessage('Looking good! Keep going!', 'success');
        } else {
            this.showMessage('Some numbers are incorrect. Try again!', 'error');
        }
    }
    
    isComplete() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col].value === 0) return false;
            }
        }
        return true;
    }
    
    showHint() {
        if (this.hintsUsed >= this.maxHints) {
            this.showMessage('No hints left!', 'error');
            return;
        }
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col].value === 0) {
                    this.grid[row][col].value = this.solution[row][col];
                    this.grid[row][col].fixed = true;
                    this.hintsUsed++;
                    document.getElementById('kk-hints').textContent = this.maxHints - this.hintsUsed;
                    this.renderGrid();
                    return;
                }
            }
        }
    }
    
    clearGrid() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (!this.grid[row][col].fixed) {
                    this.grid[row][col].value = 0;
                }
            }
        }
        this.renderGrid();
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            const minutes = Math.floor(this.timer / 60);
            const seconds = this.timer % 60;
            const timerEl = document.getElementById('kk-timer');
            if (timerEl) {
                timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }
    
    winGame() {
        this.stopTimer();
        setTimeout(() => {
            alert(`🎉 Congratulations! You solved the puzzle!\n\nTime: ${document.getElementById('kk-timer').textContent}\nMistakes: ${this.mistakes}`);
        }, 300);
    }
    
    showMessage(text, type) {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = text;
            toast.style.background = type === 'success' 
                ? 'linear-gradient(135deg, #00d084 0%, #00b894 100%)'
                : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)';
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
    }
    
    changeDifficulty(diff) {
        this.difficulty = diff;
        this.gridSize = diff === 'easy' ? 4 : 6;
        this.stopTimer();
        this.timer = 0;
        this.mistakes = 0;
        this.hintsUsed = 0;
        this.init();
    }
    
    attachEventListeners() {
        document.getElementById('kk-hint')?.addEventListener('click', () => this.showHint());
        document.getElementById('kk-check')?.addEventListener('click', () => this.checkSolution());
        document.getElementById('kk-clear')?.addEventListener('click', () => this.clearGrid());
        document.getElementById('kk-new')?.addEventListener('click', () => {
            this.stopTimer();
            this.timer = 0;
            this.mistakes = 0;
            this.hintsUsed = 0;
            this.init();
        });
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const diff = e.target.dataset.diff;
                this.changeDifficulty(diff);
            });
        });
    }
}