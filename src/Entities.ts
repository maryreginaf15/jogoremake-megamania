import { SPRITES, COLORS, SPRITE_SIZE } from './Sprites';

export abstract class Entity {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number,
        public color: string,
        public spriteName: string
    ) {}

    abstract update(dt: number): void;

    render(ctx: CanvasRenderingContext2D) {
        const sprite = SPRITES[this.spriteName];
        if (!sprite) return;

        const pixelWidth = this.width / SPRITE_SIZE;
        const pixelHeight = this.height / SPRITE_SIZE;

        ctx.fillStyle = this.color;
        
        for (let row = 0; row < sprite.length; row++) {
            for (let col = 0; col < sprite[row].length; col++) {
                const char = sprite[row][col];
                if (char === 'X') {
                    ctx.fillRect(
                        Math.floor(this.x + col * pixelWidth),
                        Math.floor(this.y + row * pixelHeight),
                        Math.ceil(pixelWidth),
                        Math.ceil(pixelHeight)
                    );
                } else if (COLORS[char] && char !== '.') {
                    ctx.fillStyle = COLORS[char];
                    ctx.fillRect(
                        Math.floor(this.x + col * pixelWidth),
                        Math.floor(this.y + row * pixelHeight),
                        Math.ceil(pixelWidth),
                        Math.ceil(pixelHeight)
                    );
                    ctx.fillStyle = this.color; // Reset to default
                }
            }
        }
    }

    getRect() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }
}

export class Player extends Entity {
    public speed = 300;
    
    constructor(x: number, y: number) {
        super(x, y, 24, 24, '#aa00ff', 'player');
    }

    update(_dt: number) {} // Logic moved to Game for input handling

    move(dir: number, dt: number, canvasWidth: number) {
        this.x += dir * this.speed * dt;
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;
    }
}

export class Enemy extends Entity {
    public dir = 1;
    public zigZagSpeed: number;
    public descendSpeed: number;
    public zigZagWidth = 40;
    public startX: number;

    constructor(x: number, y: number, color: string, spriteName: string, speedMult: number) {
        super(x, y, 32, 32, color, spriteName);
        this.startX = x;
        this.zigZagSpeed = 100 * speedMult;
        this.descendSpeed = 5 * speedMult;
    }

    update(dt: number) {
        // Zig Zag
        this.x += this.dir * this.zigZagSpeed * dt;
        
        if (this.x > this.startX + this.zigZagWidth) {
            this.dir = -1;
        } else if (this.x < this.startX - this.zigZagWidth) {
            this.dir = 1;
        }

        // Descend
        this.y += this.descendSpeed * dt;
    }
}

export class Bullet extends Entity {
    constructor(x: number, y: number, public speed: number, color: string) {
        super(x, y, 4, 12, color, '');
    }

    update(dt: number) {
        this.y += this.speed * dt;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
