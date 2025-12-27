/**
 * Configuration and constants for the Cube Color Guesser game
 */

const CONFIG = {
    // Cube colors following standard Rubik's Cube color scheme
    COLORS: {
        WHITE: 0xffffff,
        YELLOW: 0xffeb3b,
        RED: 0xf44336,
        ORANGE: 0xff9800,
        BLUE: 0x2196f3,
        GREEN: 0x4caf50,
        GRAY: 0x808080
    },

    // Color names for UI
    COLOR_NAMES: ['white', 'yellow', 'red', 'orange', 'blue', 'green'],

    // Standard Rubik's Cube color scheme - opposite faces
    COLOR_SCHEME: {
        white: 'yellow',
        yellow: 'white',
        red: 'orange',
        orange: 'red',
        blue: 'green',
        green: 'blue'
    },

    // Standard cube configuration (one possible arrangement)
    STANDARD_CUBE: {
        front: 'white',
        back: 'yellow',
        left: 'orange',
        right: 'red',
        up: 'green',
        down: 'blue'
    },

    // Three.js rendering settings
    RENDERING: {
        CANVAS_WIDTH: 600,
        CANVAS_HEIGHT: 600,
        CAMERA_FOV: 45,
        CAMERA_POSITION: { x: 0, y: 2.5, z: 6 },
        CUBE_SIZE: 2.5,
        AMBIENT_LIGHT: 0.6,
        DIRECTIONAL_LIGHT: 0.5
    },

    // Face indices for Three.js BoxGeometry
    // Order: right, left, top, bottom, front, back
    FACE_INDICES: {
        right: 0,
        left: 1,
        up: 2,
        down: 3,
        front: 4,
        back: 5
    }
};
