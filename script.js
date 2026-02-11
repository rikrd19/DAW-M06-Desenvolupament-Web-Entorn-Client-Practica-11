document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. LÓGICA DE LA PANTALLA DE INICIO (NUEVO)
    // ==========================================
    const startButton = document.getElementById('btn-start-game');
    const landingOverlay = document.getElementById('landing-overlay');
    const mainContainer = document.getElementById('main-app-container');

    // Nos aseguramos de que el juego esté oculto al principio
    if (mainContainer) {
        mainContainer.classList.add('d-none');
    }

    if (startButton) {
        startButton.addEventListener('click', () => {
            console.log('Juego iniciado'); // Debug

            // 1. Desvanecer la pantalla de título
            if (landingOverlay) {
                landingOverlay.style.opacity = '0';
                landingOverlay.style.transition = 'opacity 0.8s ease';

                // 2. Esperar a que termine la animación (800ms) para eliminarla
                setTimeout(() => {
                    landingOverlay.remove();

                    // 3. Mostrar el contenedor principal del juego
                    if (mainContainer) {
                        mainContainer.classList.remove('d-none');
                        // Forzamos una actualización visual
                        void mainContainer.offsetWidth; 
                        mainContainer.classList.add('fade-in');
                    }
                }, 800);
            }
        });
    }

    // ==========================================
    // FASE 1: EVENTOS BÁSICOS (Observer)
    // ==========================================
    const btnMulti = document.getElementById('btn-multi');

    if (btnMulti) {
        // Listener 1
        btnMulti.addEventListener('click', () => {
            alert('¡Primera función ejecutada! Sistema OK.');
            console.log('Listener 1 disparado');
        });

        // Listener 2 (Mismo evento, diferente función)
        btnMulti.addEventListener('click', () => {
            console.log('Listener 2 disparado - Multiple binding works');
        });
    }

    // ==========================================
    // FASE 2: INSPECTOR DE TECLADO
    // ==========================================
    const infoPantalla = document.getElementById('info-pantalla');
    const campoTexto = document.getElementById('campo-texto');

    // Tarea 2: Captura global de teclado
    document.body.addEventListener('keydown', (e) => {
        // Evitamos saturar la consola si estamos escribiendo en el textarea
        if (e.target === campoTexto) return;

        console.log(`Global Key: ${e.key}`);
        
        if (infoPantalla) {
            infoPantalla.innerHTML = `
                <div class="text-info mt-2" style="font-family: monospace;">
                    > EVENT: ${e.type.toUpperCase()}<br>
                    > KEY: ${e.key}<br>
                    > CODE: ${e.code}
                </div>
            `;
        }
    });

    // Tarea 3: Restricción de caracteres (Solo letras y control)
    if (campoTexto) {
        campoTexto.addEventListener('keydown', (e) => {
            const teclasPermitidas = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab', 'Enter'];
            
            // Si es número y no es tecla permitida
            if (!isNaN(e.key) && e.key !== ' ' && !teclasPermitidas.includes(e.key)) {
                e.preventDefault();
                
                // Efecto visual de error
                campoTexto.classList.add('is-invalid'); // Clase de Bootstrap para borde rojo
                setTimeout(() => campoTexto.classList.remove('is-invalid'), 500);
                
                alert('¡ACCESO DENEGADO! No se permiten números.');
            }
        });
    }

    // ==========================================
    // FASE 3: LÓGICA DEL TRES EN RAYA
    // ==========================================
    
    // Estado inicial
    let gameState = Array(9).fill(null);
    let currentPlayer = 'X';
    let gameActive = true;
    let winningCells = [];

    // Patrones de victoria
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6]             // Diagonales
    ];

    // Elementos del DOM
    const gameBoard = document.getElementById('game-board');
    const boardStateDisplay = document.getElementById('board-state');
    const gameStatusDisplay = document.getElementById('game-status');
    const turnIndicator = document.getElementById('turn-indicator');
    const resetButton = document.getElementById('reset-button');

    // Función para crear el tablero
    function initBoard() {
        if (!gameBoard) return;
        gameBoard.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            // Nota: Las clases visuales base están en el CSS (.game-cell)
            cell.className = 'game-cell'; 
            cell.dataset.index = i;
            cell.dataset.value = '';

            // Evento Click
            cell.addEventListener('click', () => handleCellClick(i));
            
            gameBoard.appendChild(cell);
        }
        updateDisplay();
    }

    // Manejar el clic en una celda
    function handleCellClick(index) {
        if (!gameActive || gameState[index] !== null) return;

        // Actualizar lógica
        gameState[index] = currentPlayer;

        // Actualizar visual
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.textContent = currentPlayer;
        cell.dataset.value = currentPlayer;
        
        // Asignar clases de color según jugador (definidas en CSS)
        if (currentPlayer === 'X') {
            cell.classList.add('cell-x');
        } else {
            cell.classList.add('cell-o');
        }

        // Comprobar estado del juego
        if (checkWin()) {
            gameActive = false;
            gameStatusDisplay.textContent = `¡JUGADOR ${currentPlayer} GANA!`;
            // Color del texto de victoria
            gameStatusDisplay.style.color = currentPlayer === 'X' ? 'var(--neon-blue)' : 'var(--neon-red)';
            
            // Resaltar celdas ganadoras
            winningCells.forEach(cellIndex => {
                const winCell = document.querySelector(`[data-index="${cellIndex}"]`);
                winCell.classList.add('winning-cell');
            });

        } else if (checkTie()) {
            gameActive = false;
            gameStatusDisplay.textContent = '¡EMPATE TÉCNICO!';
            gameStatusDisplay.style.color = '#ffcc00'; // Amarillo advertencia
        } else {
            // Cambiar turno
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateDisplay();
        }

        updateBoardStateDisplay();
    }

    // Lógica de victoria
    function checkWin() {
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                winningCells = pattern;
                return true;
            }
        }
        return false;
    }

    // Lógica de empate
    function checkTie() {
        return !gameState.includes(null) && !checkWin();
    }

    // Actualizar indicador de turno
    function updateDisplay() {
        if (!turnIndicator) return;
        turnIndicator.textContent = currentPlayer;
        
        // Estilos dinámicos para el badge
        if (currentPlayer === 'X') {
            turnIndicator.style.backgroundColor = 'var(--neon-blue)';
            turnIndicator.style.color = '#000';
            turnIndicator.style.boxShadow = '0 0 10px var(--neon-blue)';
        } else {
            turnIndicator.style.backgroundColor = 'var(--neon-red)';
            turnIndicator.style.color = '#fff';
            turnIndicator.style.boxShadow = '0 0 10px var(--neon-red)';
        }
    }

    // Actualizar la "consola visual" del array
    function updateBoardStateDisplay() {
        if (!boardStateDisplay) return;
        const formattedState = gameState.map(value => 
            value === null ? 'null' : `"${value}"`
        );
        boardStateDisplay.textContent = `[${formattedState.join(', ')}]`;
    }

    // Reiniciar juego
    function resetGame() {
        gameState = Array(9).fill(null);
        currentPlayer = 'X';
        gameActive = true;
        winningCells = [];

        if (gameStatusDisplay) {
            gameStatusDisplay.textContent = 'JUGANDO...';
            gameStatusDisplay.style.color = '#fff';
        }

        // Reconstruimos el tablero limpio
        initBoard();
        updateBoardStateDisplay();
    }

    // Listeners del botón reiniciar
    if (resetButton) {
        resetButton.addEventListener('click', resetGame);
    }

    // Listener de la tecla 'R' para reiniciar
    document.addEventListener('keydown', (event) => {
        // Solo permitimos reiniciar si el overlay de inicio ya no existe
        const overlay = document.getElementById('landing-overlay');
        if (!overlay && event.key.toLowerCase() === 'r') {
            resetGame();
        }
    });

    // INICIALIZACIÓN
    initBoard();
    updateBoardStateDisplay();

    // NOTA: Se ha eliminado la función 'updateBackgroundColor' que cambiaba 
    // el fondo al redimensionar, para mantener el tema oscuro intacto.
});