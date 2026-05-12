import './style.css';
import { Game } from './Game';

// Initialize Game
const game = new Game('game-canvas');

function loop(time: number) {
    game.update(time);
    game.render();
    requestAnimationFrame(loop);
}

// Start Loop
requestAnimationFrame(loop);

// Prevent default touch behaviors to allow for smooth gaming
document.addEventListener('touchstart', (e) => {
    if (e.target instanceof HTMLElement && e.target.classList.contains('control-btn')) {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });
