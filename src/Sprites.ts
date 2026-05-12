export const SPRITE_SIZE = 16;

export type PixelData = string[];

export const SPRITES: Record<string, PixelData> = {
    player: [
        ".......XX.......",
        ".......XX.......",
        "......XXXX......",
        "......XXXX......",
        ".....XXXXXX.....",
        ".....XXXXXX.....",
        "....XXXXXXXX....",
        "....XXXXXXXX....",
        "...XXXXXXXXXX...",
        "...XXXXXXXXXX...",
        "..XXXXXXXXXXXX..",
        "XXXXXXXXXXXXXXXX",
        "XXXXXXXXXXXXXXXX",
        "XXXXXXXXXXXXXXXX",
        "XXXXXXXXXXXXXXXX",
        "XXXXXXXXXXXXXXXX"
    ],
    hamburger: [
        "....XXXXXXXX....",
        "...XXXXXXXXXX...",
        "..XXXXXXXXXXXX..",
        ".XXXXXXXXXXXXXX.",
        "XXXXXXXXXXXXXXXX",
        "WWWWWWWWWWWWWWWW",
        "GGGGGGGGGGGGGGGG",
        "RRRRRRRRRRRRRRRR",
        "YYYYYYYYYYYYYYYY",
        "XXXXXXXXXXXXXXXX",
        "XXXXXXXXXXXXXXXX",
        ".XXXXXXXXXXXXXX.",
        "..XXXXXXXXXXXX..",
        "...XXXXXXXXXX...",
        "....XXXXXXXX....",
        "................"
    ],
    cookie: [
        "....XXXXXX....",
        "..XXXXXXXXXX..",
        ".XXXXXXXXXXXX.",
        "XXXXXXXXXXXXXX",
        "XXXX.XXXX.XXXX",
        "XXXXXXXXXXXXXX",
        "XXXX.XXXX.XXXX",
        "XXXXXXXXXXXXXX",
        "XXXX.XXXX.XXXX",
        "XXXXXXXXXXXXXX",
        ".XXXXXXXXXXXX.",
        "..XXXXXXXXXX..",
        "....XXXXXX....",
        "..............",
        "..............",
        ".............."
    ],
    iron: [
        ".......XX.......",
        "......XXXX......",
        ".....XXXXXX.....",
        "....XXXXXXXX....",
        "...XXXXXXXXXX...",
        "..XXXXXXXXXXXX..",
        ".XXXXXXXXXXXXXX.",
        "XXXXXXXXXXXXXXXX",
        "XXXXXXXXXXXXXXXX",
        "XXXXXXXXXXXXXXXX",
        "XXXXXXXXXXXXXXXX",
        "XXXXXXXXXXXXXXXX",
        "XXXXXXXXXXXXXXXX",
        "XXXXXXXXXXXXXXXX",
        "XXXXXXXXXXXXXXXX",
        "XXXXXXXXXXXXXXXX"
    ],
    bowtie: [
        "XX..........XX",
        "XXXX........XXXX",
        "XXXXXX......XXXXXX",
        "XXXXXXXX....XXXXXXXX",
        "XXXXXXXXXX..XXXXXXXXXX",
        "XXXXXXXXXXXXXXXXXXXXXX",
        "XXXXXXXXXX..XXXXXXXXXX",
        "XXXXXXXX....XXXXXXXX",
        "XXXXXX......XXXXXX",
        "XXXX........XXXX",
        "XX..........XX",
        "..............",
        "..............",
        "..............",
        "..............",
        ".............."
    ],
    diamond: [
        ".......XX.......",
        "......XXXX......",
        ".....XXXXXX.....",
        "....XXXXXXXX....",
        "...XXXXXXXXXX...",
        "..XXXXXXXXXXXX..",
        ".XXXXXXXXXXXXXX.",
        "XXXXXXXXXXXXXXXX",
        ".XXXXXXXXXXXXXX.",
        "..XXXXXXXXXXXX..",
        "...XXXXXXXXXX...",
        "....XXXXXXXX....",
        ".....XXXXXX.....",
        "......XXXX......",
        ".......XX.......",
        "................"
    ],
    meteor: [
        "....XXXXXX....",
        "...XXXXXXXX...",
        "..XXXXXXXXXX..",
        ".XXXXXXXXXXXX.",
        "XXXXXXXXXXXXXX",
        "XXXXXXXXXXXXXX",
        "XXXXXXXXXXXXXX",
        "XXXXXXXXXXXXXX",
        "XXXXXXXXXXXXXX",
        "XXXXXXXXXXXXXX",
        ".XXXXXXXXXXXX.",
        "..XXXXXXXXXX..",
        "...XXXXXXXX...",
        "....XXXXXX....",
        "..............",
        ".............."
    ]
};

export const COLORS: Record<string, string> = {
    'X': '#ffffff', // Default
    'W': '#ffffff', // White (cheese/top bun)
    'G': '#00ff00', // Green (lettuce)
    'R': '#ff0000', // Red (meat/tomato)
    'Y': '#ffff00', // Yellow (cheese)
    '.': 'transparent'
};

export const LEVEL_SPRITES = [
    'hamburger',
    'cookie',
    'iron',
    'bowtie',
    'diamond',
    'meteor'
];

export const LEVEL_COLORS = [
    '#ffaa00', // Burgers
    '#8b4513', // Cookies
    '#cccccc', // Irons
    '#ff00ff', // Bowties
    '#00ffff', // Diamonds
    '#888888'  // Meteors
];
