import { Player, Enemy, Bullet } from './Entities';
import { LEVEL_SPRITES, LEVEL_COLORS } from './Sprites';
import { audio } from './Audio';

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    
    private player: Player;
    private enemies: Enemy[] = [];
    private playerBullets: Bullet[] = [];
    private enemyBullets: Bullet[] = [];
    
    private score = 0;
    private lives = 3;
    private energy = 100;
    private level = 1;
    
    private energyDepletionRate = 1.5; // % per second
    private isGameOver = false;
    private isGameStarted = false;
    private isPaused = false;
    
    private keys: Record<string, boolean> = {};
    private lastTime = 0;
    private currentTime = 0;
    
    private stars: {x: number, y: number, size: number, speed: number}[] = [];
    private retroColors = ['#ff0000', '#ffaa00', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#aa00ff', '#ff00ff'];
    
    private canvasWidth = 400;
    private canvasHeight = 600;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        
        this.setupCanvas();
        this.player = new Player(this.canvasWidth / 2 - 12, this.canvasHeight - 50);
        
        this.bindEvents();
        this.initStars();
        this.startLevel();
    }

    private initStars() {
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvasWidth,
                y: Math.random() * this.canvasHeight,
                size: Math.random() * 2,
                speed: 20 + Math.random() * 50
            });
        }
    }

    private setupCanvas() {
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        this.ctx.imageSmoothingEnabled = false;
    }

    private bindEvents() {
        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);
        
        // Mobile Controls
        const btnLeft = document.getElementById('btn-left');
        const btnRight = document.getElementById('btn-right');
        const btnFire = document.getElementById('btn-fire');

        if (btnLeft) {
            btnLeft.addEventListener('pointerdown', (e) => { e.preventDefault(); this.keys['ArrowLeft'] = true; });
            btnLeft.addEventListener('pointerup', (e) => { e.preventDefault(); this.keys['ArrowLeft'] = false; });
            btnLeft.addEventListener('pointerleave', (e) => { e.preventDefault(); this.keys['ArrowLeft'] = false; });
        }
        if (btnRight) {
            btnRight.addEventListener('pointerdown', (e) => { e.preventDefault(); this.keys['ArrowRight'] = true; });
            btnRight.addEventListener('pointerup', (e) => { e.preventDefault(); this.keys['ArrowRight'] = false; });
            btnRight.addEventListener('pointerleave', (e) => { e.preventDefault(); this.keys['ArrowRight'] = false; });
        }
        if (btnFire) {
            btnFire.addEventListener('pointerdown', (e) => { e.preventDefault(); this.firePlayerBullet(); });
        }

        // Mouse click to restart/start
        this.canvas.addEventListener('click', () => {
            if (this.isGameOver) {
                this.resetGame();
            } else if (!this.isGameStarted) {
                this.isGameStarted = true;
            }
        });
    }

    private startLevel() {
        this.energy = 100;
        this.enemies = [];
        this.playerBullets = [];
        this.enemyBullets = [];
        
        const spriteIdx = (this.level - 1) % LEVEL_SPRITES.length;
        const spriteName = LEVEL_SPRITES[spriteIdx];
        const color = LEVEL_COLORS[spriteIdx];
        
        // Slower mult for Level 1
        const speedMult = this.level === 1 ? 0.7 : 1 + (this.level - 2) * 0.2;

        // Dynamic enemy count
        let rows = 4;
        let cols = 6;
        if (this.level === 1) {
            rows = 2;
            cols = 4;
        } else if (this.level === 2) {
            rows = 3;
            cols = 5;
        }

        const spacingX = 60;
        const spacingY = 40;
        const startX = (this.canvasWidth - (cols - 1) * spacingX) / 2;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                this.enemies.push(new Enemy(
                    startX + c * spacingX,
                    50 + r * spacingY,
                    color,
                    spriteName,
                    speedMult
                ));
            }
        }

        this.updateUI();
    }

    private firePlayerBullet() {
        if (this.isGameOver) {
            this.resetGame();
            return;
        }
        if (this.playerBullets.length < 3) {
            this.playerBullets.push(new Bullet(
                this.player.x + this.player.width / 2 - 2,
                this.player.y,
                -600,
                '#ffffff'
            ));
            audio.playLaser();
        }
    }

    private resetGame() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.isGameOver = false;
        this.startLevel();
    }

    public update(time: number) {
        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;
        this.currentTime = time / 1000;

        // Update stars always
        this.stars.forEach(s => {
            s.y += s.speed * dt;
            if (s.y > this.canvasHeight) {
                s.y = 0;
                s.x = Math.random() * this.canvasWidth;
            }
        });

        if (!this.isGameStarted) {
            if (this.keys['Space']) {
                this.isGameStarted = true;
                this.keys['Space'] = false;
            }
            return;
        }

        if (this.isGameOver) {
            if (this.keys['Space']) {
                this.resetGame();
                this.keys['Space'] = false;
            }
            return;
        }

        if (this.isPaused) return;
        if (dt > 0.1) return;

        // Energy depletion
        this.energy -= this.energyDepletionRate * dt;
        if (this.energy <= 0) {
            this.die();
        }

        // Input
        if (this.keys['ArrowLeft']) this.player.move(-1, dt, this.canvasWidth);
        if (this.keys['ArrowRight']) this.player.move(1, dt, this.canvasWidth);
        if (this.keys['Space']) {
            this.firePlayerBullet();
            this.keys['Space'] = false;
        }

        // Update Entities
        this.playerBullets.forEach(b => b.update(dt));
        this.enemyBullets.forEach(b => b.update(dt));
        this.enemies.forEach(e => {
            e.update(dt);
            // Random shooting
            if (Math.random() < 0.005 * this.level) {
                this.enemyBullets.push(new Bullet(
                    e.x + e.width / 2,
                    e.y + e.height,
                    300,
                    e.color
                ));
            }
        });

        // Cleanup bullets
        this.playerBullets = this.playerBullets.filter(b => b.y > -20);
        this.enemyBullets = this.enemyBullets.filter(b => b.y < this.canvasHeight + 20);

        // Collisions
        this.checkCollisions();

        // Level clear check
        if (this.enemies.length === 0) {
            this.level++;
            this.startLevel();
        }

        this.updateUI();
    }

    private checkCollisions() {
        const playerRect = this.player.getRect();

        // Player vs Enemy Bullets
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            const b = this.enemyBullets[i];
            if (this.rectIntersect(playerRect, b.getRect())) {
                this.die();
                this.enemyBullets.splice(i, 1);
                return;
            }
        }

        // Player vs Enemies
        for (const e of this.enemies) {
            if (this.rectIntersect(playerRect, e.getRect())) {
                this.die();
                return;
            }
        }

        // Player Bullets vs Enemies
        for (let i = this.playerBullets.length - 1; i >= 0; i--) {
            const pb = this.playerBullets[i];
            const pbRect = pb.getRect();

            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const e = this.enemies[j];
                if (this.rectIntersect(pbRect, e.getRect())) {
                    this.enemies.splice(j, 1);
                    this.playerBullets.splice(i, 1);
                    this.score += 100 * this.level;
                    audio.playExplosion();
                    
                    // Recover energy on clear
                    if (this.enemies.length === 0) {
                        this.energy = 100;
                    }
                    break;
                }
            }
        }
    }

    private rectIntersect(r1: any, r2: any) {
        return !(r2.left > r1.right || 
                 r2.right < r1.left || 
                 r2.top > r1.bottom ||
                 r2.bottom < r1.top);
    }

    private die() {
        this.lives--;
        this.energy = 100;
        audio.playExplosion();
        
        if (this.lives < 0) {
            this.isGameOver = true;
        } else {
            // Reset player position
            this.player.x = this.canvasWidth / 2 - this.player.width / 2;
            // Clear bullets
            this.enemyBullets = [];
        }
    }

    private updateUI() {
        const scoreEl = document.getElementById('score');
        const livesEl = document.getElementById('lives');
        const energyEl = document.getElementById('energy-bar-inner');
        const levelEl = document.getElementById('level');

        if (scoreEl) scoreEl.innerText = this.score.toString().padStart(6, '0');
        if (livesEl) livesEl.innerText = this.lives.toString();
        if (energyEl) energyEl.style.width = `${Math.max(0, this.energy)}%`;
        if (levelEl) levelEl.innerText = this.level.toString();
    }

    private drawLives() {
        const iconSize = 16;
        const spacing = 8;
        const startX = 20;
        const startY = this.canvasHeight - 25;

        for (let i = 0; i < this.lives; i++) {
            // Draw a simplified player icon
            this.ctx.fillStyle = '#aa00ff';
            this.ctx.fillRect(startX + i * (iconSize + spacing), startY, iconSize, iconSize / 2);
            this.ctx.fillRect(startX + i * (iconSize + spacing) + iconSize / 4, startY - iconSize / 4, iconSize / 2, iconSize / 4);
        }
    }

    public render() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Draw Stars
        this.ctx.fillStyle = '#ffffff';
        this.stars.forEach(s => {
            this.ctx.fillRect(s.x, s.y, s.size, s.size);
        });

        // Draw Scanlines (Retro CRT effect) - Always visible
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        for (let i = 0; i < this.canvasHeight; i += 4) {
            this.ctx.fillRect(0, i, this.canvasWidth, 1);
        }

        if (!this.isGameStarted) {
            const pulse = Math.abs(Math.sin(this.currentTime * 3));
            const colorIdx = Math.floor(this.currentTime * 5) % this.retroColors.length;
            
            // Draw Scanlines (Retro CRT effect)
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            for (let i = 0; i < this.canvasHeight; i += 4) {
                this.ctx.fillRect(0, i, this.canvasWidth, 1);
            }

            // Rainbow Title (Atari Style)
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = this.retroColors[colorIdx];
            this.ctx.fillStyle = this.retroColors[colorIdx];
            this.ctx.font = '42px "PressStart2P"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('MEGAMANIA', this.canvasWidth / 2, this.canvasHeight / 2 - 80);
            
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '14px "PressStart2P"';
            this.ctx.fillText('ACTIVISION', this.canvasWidth / 2, this.canvasHeight / 2 - 30);
            
            // Decorative Box
            this.ctx.strokeStyle = '#00ffff';
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(40, this.canvasHeight / 2 - 120, this.canvasWidth - 80, 140);

            // Retro Commands
            this.ctx.fillStyle = pulse > 0.5 ? '#00ff00' : '#005500';
            this.ctx.font = '20px "PressStart2P"';
            this.ctx.fillText('INSERT COIN', this.canvasWidth / 2, this.canvasHeight / 2 + 60);
            
            // Retro Button Visual
            const btnW = 200;
            const btnH = 40;
            const btnX = this.canvasWidth / 2 - btnW / 2;
            const btnY = this.canvasHeight / 2 + 100;
            
            this.ctx.fillStyle = '#ff00ff'; // Atari Purple/Pink
            this.ctx.fillRect(btnX, btnY, btnW, btnH);
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(btnX + 4, btnY + 4, btnW - 8, btnH - 8);

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '14px "PressStart2P"';
            this.ctx.fillText('START', this.canvasWidth / 2, btnY + 26);
            
            // Copyright / Info
            this.ctx.fillStyle = '#888';
            this.ctx.font = '10px "PressStart2P"';
            this.ctx.fillText('© 1982 ACTIVISION', this.canvasWidth / 2, this.canvasHeight - 60);
            this.ctx.fillText('2026 ANTIGRAVITY REMAKE', this.canvasWidth / 2, this.canvasHeight - 40);
            
            this.ctx.fillStyle = '#444';
            this.ctx.font = '8px "PressStart2P"';
            this.ctx.fillText('USE ARROWS & SPACE', this.canvasWidth / 2, this.canvasHeight - 15);
            return;
        }

        if (this.isGameOver) {
            const pulse = Math.abs(Math.sin(this.currentTime * 3));
            const shakeX = (Math.random() - 0.5) * 4;
            const shakeY = (Math.random() - 0.5) * 4;
            
            // Dynamic Red Overlay
            const overlayAlpha = 0.1 + pulse * 0.1;
            this.ctx.fillStyle = `rgba(139, 0, 0, ${overlayAlpha})`;
            this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

            // Glitchy GAME OVER text
            this.ctx.fillStyle = '#ff0000';
            this.ctx.font = '40px "PressStart2P"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.canvasWidth / 2 + shakeX, this.canvasHeight / 2 - 100 + shakeY);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '40px "PressStart2P"';
            this.ctx.fillText('GAME OVER', this.canvasWidth / 2, this.canvasHeight / 2 - 100);

            // Score with glow
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#ffff00';
            this.ctx.fillStyle = '#ffff00';
            this.ctx.font = '20px "PressStart2P"';
            this.ctx.fillText(`SCORE: ${this.score}`, this.canvasWidth / 2, this.canvasHeight / 2 - 40);
            this.ctx.shadowBlur = 0;

            // Rank System
            let rank = 'RECRUTA';
            let rankColor = '#aaa';
            if (this.score > 15000) { rank = 'LENDA DA GALÁXIA'; rankColor = '#ff00ff'; }
            else if (this.score > 5000) { rank = 'ÁS DO ESPAÇO'; rankColor = '#00ffff'; }
            else if (this.score > 1000) { rank = 'PILOTO'; rankColor = '#00ff00'; }

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '14px "PressStart2P"';
            this.ctx.fillText(`LEVEL ALCANÇADO: ${this.level}`, this.canvasWidth / 2, this.canvasHeight / 2 - 5);

            this.ctx.fillStyle = '#888';
            this.ctx.font = '10px "PressStart2P"';
            this.ctx.fillText('RANK:', this.canvasWidth / 2, this.canvasHeight / 2 + 25);
            this.ctx.fillStyle = rankColor;
            this.ctx.font = '14px "PressStart2P"';
            this.ctx.fillText(rank, this.canvasWidth / 2, this.canvasHeight / 2 + 45);

            // Pulse Button
            const btnW = 260;
            const btnH = 50;
            const btnX = this.canvasWidth / 2 - btnW / 2;
            const btnY = this.canvasHeight / 2 + 70;
            
            // Button shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(btnX + 4, btnY + 4, btnW, btnH);
            
            this.ctx.fillStyle = pulse > 0.5 ? '#ff0000' : '#aa0000';
            this.ctx.fillRect(btnX, btnY, btnW, btnH);
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.strokeRect(btnX + 2, btnY + 2, btnW - 4, btnH - 4);

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '18px "PressStart2P"';
            this.ctx.fillText('TRY AGAIN', this.canvasWidth / 2, btnY + 34);
            
            this.ctx.fillStyle = '#444';
            this.ctx.font = '10px "PressStart2P"';
            this.ctx.fillText('COINS: 00  (INSERT TO PLAY)', this.canvasWidth / 2, this.canvasHeight - 30);
            return;
        }

        this.player.render(this.ctx);
        this.enemies.forEach(e => e.render(this.ctx));
        this.playerBullets.forEach(b => b.render(this.ctx));
        this.enemyBullets.forEach(b => b.render(this.ctx));
        
        this.drawLives();
    }
}
