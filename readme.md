# Práctica 11: Programación de Eventos y Juego Tres en Raya

Este repositorio contiene la solución completa a la Práctica 11 del módulo **DAW M06 - Desarrollo Web en Entorno Cliente**. El proyecto integra ejercicios de manejo avanzado de eventos (`Event Listeners`, `KeyboardEvents`) y la implementación lógica de un juego completo de "Tres en Raya" (Tic-Tac-Toe) manipulando el DOM de forma dinámica.

---

## Tecnologías Utilizadas

*   **HTML5 Semántico**: Estructura de la página dividida en secciones claras.
*   **CSS3 & Bootstrap 5**: Diseño moderno y responsivo. Se utiliza Bootstrap para la maquetación (Grid, Cards, Botones) y CSS nativo para estilos específicos del juego (animaciones, tablero).
*   **JavaScript (ES6+)**: Lógica completa del juego y gestión de eventos sin frameworks JS externos.

---

## Tabla de Cumplimiento de Requisitos

A continuación se detalla cómo se ha cubierto cada punto de la rúbrica de evaluación:

### Fase 1: Eventos Básicos (Patrón Observador)
| Requisito | Estado | Implementación |
| :--- | :---: | :--- |
| Botón con ID `btn-multi` | Si | `index.html` (Línea 40) |
| Uso de `addEventListener` | Si | Se registran 2 listeners distintos al mismo evento `click` en `script.js`. |
| No usar `onclick` inline | Si | HTML limpio, toda la lógica está separada en el JS. |

### Fase 2: Eventos de Teclado
| Requisito | Estado | Implementación |
| :--- | :---: | :--- |
| Captura de `keydown` en Body | Si | Se muestra `e.type` y `e.key` en consola y en el panel visual. |
| Restricción de caracteres | Si | Bloqueo de números en el `textarea` usando `e.preventDefault()`. |
| Feedback al usuario | Si | Alerta visual si intenta escribir un número prohibido. |

### Fase 3: Tres en Raya (Lógica y DOM)
| Requisito | Estado | Implementación |
| :--- | :---: | :--- |
| **Generación DOM** | Si | Tablero creado con `document.createElement` y bucles en JS. |
| **Atributos `dataset`** | Si | Uso de `data-index` para vincular celdas visuales con la lógica. |
| **Array de Estado** | Si | Variable `gameState` (Array de 9 posiciones) para lógica interna. |
| **Gestión Turnos X/O** | Si | Alternancia automática y visualización del turno actual. |
| **Estilos Diferenciados** | Si | Clases CSS `.cell-x` (Azul/Primary) y `.cell-o` (Rojo/Danger). |
| **Lógica Victoria/Empate** | Si | Detección automática de filas, columnas, diagonales o empate. |
| **Reinicio con Tecla 'R'** | Si | Listener de teclado `keydown` global para reiniciar partida. |
| **Estilo Dinámico** | Si | El fondo (`body`) cambia de color gradualmente al hacer `resize` en la ventana. |

---

## Estructura del Proyecto

```bash
├── index.html      # Estructura única que integra las 3 fases con Bootstrap
├── script.js       # Lógica separada en funciones claras (initBoard, handleClick, checkWin...)
├── css/
│   └── style.css   # Estilos personalizados (Grid del tablero, animaciones, colores)
└── README.md       # Documentación del proyecto
```

## Instrucciones de Uso

1.  **Fase 1**: Haz clic en el botón **"¡Haz clic aquí!"** de la tarjeta superior izquierda. Verás saltar dos alertas consecutivas (demostrando múltiples listeners).
2.  **Fase 2**: Escribe en el área de texto de la tarjeta superior derecha. Intenta escribir números para ver cómo se bloquean. Observa el panel de información abajo.
3.  **Fase 3 (Juego)**:
    *   Juega al Tres en Raya haciendo clic en las celdas.
    *   Observa cómo se actualiza el array de estado en tiempo real en el panel lateral.
    *   Al terminar (victoria o empate), pulsa el botón **Reiniciar** o la tecla **'R'** de tu teclado.
    *   Redimensiona la ventana del navegador para ver cambiar el color de fondo suavemente.

---

**Autor:** Ricardo Avila
**Módulo:** DAW M06
