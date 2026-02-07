document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // FASE 1: EVENTOS BÁSICOS (Patrón Observador)
    // ==========================================
    const btnMulti = document.getElementById('btn-multi');

    if (btnMulti) {
        // Listener 1
        btnMulti.addEventListener('click', () => {
            alert('¡Primera función ejecutada!');
            console.log('Listener 1 disparado');
        });

        // Listener 2
        btnMulti.addEventListener('click', () => {
            alert('¡Segunda función ejecutada! (Ambas funcionan gracias a addEventListener)');
            console.log('Listener 2 disparado');
        });
    }

    // ==========================================
    // FASE 2: INSPECTOR DE TECLADO
    // ==========================================
    const infoPantalla = document.getElementById('info-pantalla');
    const campoTexto = document.getElementById('campo-texto');

    // Tarea 2: captura global de teclado
    document.body.addEventListener('keydown', (e) => {
        // se muestra info en consola/pantalla
        console.log(`Tipo de evento: ${e.type}, Tecla: ${e.key}`);
        
        if (infoPantalla) {
            infoPantalla.innerHTML = `
                <div class="alert alert-info mt-2">
                    <strong>Evento:</strong> ${e.type} <br>
                    <strong>Tecla:</strong> ${e.key} <br>
                    <strong>Código:</strong> ${e.code}
                </div>
            `;
        }
    });

    // Tarea 3: restricción de caracteres (Solo letras)
    if (campoTexto) {
        campoTexto.addEventListener('keydown', (e) => {
            // se permiten teclas de control (borrar, flechas, tab, etc.)
            const teclasPermitidas = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab', 'Enter'];
            
            // Si es un número (0-9) y no es una tecla permitida
            if (!isNaN(e.key) && e.key !== ' ' && !teclasPermitidas.includes(e.key)) {
                e.preventDefault(); // Evita que se escriba
                alert('¡Error! No se permiten números en este campo.');
            }
        });
    }

    // ==========================================
    // FASE 3: TRES EN RAYA
    // ==========================================
    
    // estado del juego
    let gameState = Array(9).fill(null);
    let currentPlayer = 'X';
    let gameActive = true;
    let winningCells = [];

    // combinaciones ganadoras
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6]             // Diagonales
    ];

    // elementos del DOM
    const gameBoard = document.getElementById('game-board');
    const boardStateDisplay = document.getElementById('board-state');
    const gameStatusDisplay = document.getElementById('game-status');
    const turnIndicator = document.getElementById('turn-indicator');
    const resetButton = document.getElementById('reset-button');

    // inicializar tablero
    function initBoard() {
        if (!gameBoard) return;
        gameBoard.innerHTML = '';
        
        // se usa CSS Grid en el contenedor, aquí creamos los hijos
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            // Clases de Bootstrap y personalizadas
            cell.className = 'game-cell d-flex justify-content-center align-items-center border bg-light';
            cell.dataset.index = i;
            cell.dataset.value = '';

            // Evento click
            cell.addEventListener('click', () => handleCellClick(i));
            
            // Añadir al DOM
            gameBoard.appendChild(cell);
        }
        updateDisplay();
    }

    // manejar clic en celda
    function handleCellClick(index) {
        if (!gameActive || gameState[index] !== null) return;

        // actualizar estado (Array)
        gameState[index] = currentPlayer;

        // actualizar visual (DOM)
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.textContent = currentPlayer;
        cell.dataset.value = currentPlayer;
        
        // estilos diferenciados (Clases definidas en CSS)
        cell.classList.remove('bg-light');
        if (currentPlayer === 'X') {
            cell.classList.add('cell-x');
        } else {
            cell.classList.add('cell-o');
        }

        // animacion de entrada
        cell.classList.add('fade-in');

        // logica de victoria/empate
        if (checkWin()) {
            gameActive = false;
            gameStatusDisplay.textContent = `¡Jugador ${currentPlayer} gana!`;
            gameStatusDisplay.className = 'fw-bold text-success';
            
            // resaltar celdas ganadoras
            winningCells.forEach(cellIndex => {
                const winCell = document.querySelector(`[data-index="${cellIndex}"]`);
                winCell.classList.add('winning-cell');
            });
        } else if (checkTie()) {
            gameActive = false;
            gameStatusDisplay.textContent = '¡Empate!';
            gameStatusDisplay.className = 'fw-bold text-warning';
        } else {
            // cambio de turno
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateDisplay();
        }

        updateBoardStateDisplay();
    }

    // verificar victoria
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

    // verificar empate
    function checkTie() {
        return !gameState.includes(null) && !checkWin();
    }

    // actualizar interfaz
    function updateDisplay() {
        if (!turnIndicator) return;
        turnIndicator.textContent = currentPlayer;
        
        turnIndicator.className = 'badge fs-4';
        if (currentPlayer === 'X') {
            turnIndicator.classList.remove('bg-danger');
            turnIndicator.classList.add('bg-primary');
        } else {
            turnIndicator.classList.remove('bg-primary');
            turnIndicator.classList.add('bg-danger');
        }
    }

    // mostrar estado del array (Requisito)
    function updateBoardStateDisplay() {
        if (!boardStateDisplay) return;
        const formattedState = gameState.map(value => 
            value === null ? 'null' : `"${value}"`
        );
        boardStateDisplay.textContent = `[${formattedState.join(', ')}]`;
    }

    // reiniciar
    function resetGame() {
        gameState = Array(9).fill(null);
        currentPlayer = 'X';
        gameActive = true;
        winningCells = [];

        if (gameStatusDisplay) {
            gameStatusDisplay.textContent = 'Jugando';
            gameStatusDisplay.className = 'fw-bold text-success';
        }

        initBoard();
        updateBoardStateDisplay();
    }

    // estilo dinámico (Resize)
    function updateBackgroundColor() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // color basado en dimensiones (Lógica similar a la original)
        const red = Math.min(255, Math.floor((width % 256) * 0.7));
        const green = Math.min(255, Math.floor((height % 256) * 0.7));
        const blue = Math.min(255, Math.floor(((width + height) % 256) * 0.7));

        // aplicamos un gradiente suave
        document.body.style.background = `linear-gradient(135deg, rgba(${red}, ${green}, ${blue}, 0.2), rgba(${blue}, ${red}, ${green}, 0.2))`;
    }

    // listeners del juego
    if (resetButton) {
        resetButton.addEventListener('click', resetGame);
    }

    // tecla 'R' para reiniciar
    document.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() === 'r') {
            resetGame();
        }
    });

    // resize evento
    window.addEventListener('resize', updateBackgroundColor);

    // inicialización
    initBoard();
    updateBackgroundColor();
    updateBoardStateDisplay();
});
