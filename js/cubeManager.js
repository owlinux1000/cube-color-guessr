/**
 * Manages Rubik's Cube state and game logic
 */

class CubeManager {
    constructor() {
        this.cubeState = null;
        this.visibleFaces = [];
        this.hiddenFaces = [];
        this.guesses = {};
        this.verticalFace = null; // 'up' or 'down'
    }

    /**
     * Generate a new cube configuration
     * Uses standard Rubik's Cube color scheme with random orientation
     */
    generateCube() {
        // Standard Western Rubik's Cube color scheme
        // Opposite pairs: White-Yellow, Blue-Green, Red-Orange
        // Standard orientation: White=Front, Yellow=Back, Blue=Right, Green=Left, Red=Up, Orange=Down

        // All 24 valid orientations (6 faces up × 4 rotations each)
        const orientations = [
            // RED on top (4 rotations)
            {front: 'white', back: 'yellow', right: 'green', left: 'blue', up: 'red', down: 'orange'},
            {front: 'blue', back: 'green', right: 'white', left: 'yellow', up: 'red', down: 'orange'},
            {front: 'yellow', back: 'white', right: 'blue', left: 'green', up: 'red', down: 'orange'},
            {front: 'green', back: 'blue', right: 'yellow', left: 'white', up: 'red', down: 'orange'},

            // ORANGE on top (4 rotations)
            {front: 'white', back: 'yellow', right: 'blue', left: 'green', up: 'orange', down: 'red'},
            {front: 'green', back: 'blue', right: 'white', left: 'yellow', up: 'orange', down: 'red'},
            {front: 'yellow', back: 'white', right: 'green', left: 'blue', up: 'orange', down: 'red'},
            {front: 'blue', back: 'green', right: 'yellow', left: 'white', up: 'orange', down: 'red'},

            // WHITE on top (4 rotations)
            {front: 'red', back: 'orange', right: 'blue', left: 'green', up: 'white', down: 'yellow'},
            {front: 'blue', back: 'green', right: 'orange', left: 'red', up: 'white', down: 'yellow'},
            {front: 'orange', back: 'red', right: 'green', left: 'blue', up: 'white', down: 'yellow'},
            {front: 'green', back: 'blue', right: 'red', left: 'orange', up: 'white', down: 'yellow'},

            // YELLOW on top (4 rotations)
            {front: 'red', back: 'orange', right: 'green', left: 'blue', up: 'yellow', down: 'white'},
            {front: 'green', back: 'blue', right: 'orange', left: 'red', up: 'yellow', down: 'white'},
            {front: 'orange', back: 'red', right: 'blue', left: 'green', up: 'yellow', down: 'white'},
            {front: 'blue', back: 'green', right: 'red', left: 'orange', up: 'yellow', down: 'white'},

            // BLUE on top (4 rotations)
            {front: 'red', back: 'orange', right: 'yellow', left: 'white', up: 'blue', down: 'green'},
            {front: 'yellow', back: 'white', right: 'orange', left: 'red', up: 'blue', down: 'green'},
            {front: 'orange', back: 'red', right: 'white', left: 'yellow', up: 'blue', down: 'green'},
            {front: 'white', back: 'yellow', right: 'red', left: 'orange', up: 'blue', down: 'green'},

            // GREEN on top (4 rotations)
            {front: 'red', back: 'orange', right: 'white', left: 'yellow', up: 'green', down: 'blue'},
            {front: 'white', back: 'yellow', right: 'orange', left: 'red', up: 'green', down: 'blue'},
            {front: 'orange', back: 'red', right: 'yellow', left: 'white', up: 'green', down: 'blue'},
            {front: 'yellow', back: 'white', right: 'red', left: 'orange', up: 'green', down: 'blue'},
        ];

        // Pick a random orientation
        this.cubeState = orientations[Math.floor(Math.random() * orientations.length)];

        // Always show 'up' as the visible vertical face
        this.verticalFace = 'up';

        // Set visible and hidden faces
        this.visibleFaces = ['front', 'up'];

        // Hidden faces are all faces except the visible ones
        this.hiddenFaces = ['left', 'right', 'back', 'down'];

        // Clear previous guesses
        this.guesses = {};
        this.hiddenFaces.forEach(face => {
            this.guesses[face] = null;
        });

        return this.cubeState;
    }

    /**
     * Get the current cube state
     * @returns {Object} Cube state with all face colors
     */
    getCubeState() {
        return this.cubeState;
    }

    /**
     * Get colors of visible faces
     * @returns {Object} Visible face colors
     */
    getVisibleFaces() {
        const visible = {};
        this.visibleFaces.forEach(face => {
            visible[face] = this.cubeState[face];
        });
        return visible;
    }

    /**
     * Get list of faces that need to be guessed
     * @returns {Array} Array of hidden face names
     */
    getHiddenFaces() {
        return this.hiddenFaces;
    }

    /**
     * Get which vertical face is visible
     * @returns {string} 'up' or 'down'
     */
    getVerticalFace() {
        return this.verticalFace;
    }

    /**
     * Submit a guess for a hidden face
     * @param {string} face - Face name (e.g., 'left', 'right')
     * @param {string} color - Guessed color
     */
    submitGuess(face, color) {
        if (this.hiddenFaces.includes(face)) {
            this.guesses[face] = color;
        }
    }

    /**
     * Get current guess for a face
     * @param {string} face - Face name
     * @returns {string|null} Guessed color or null
     */
    getGuess(face) {
        return this.guesses[face] || null;
    }

    /**
     * Get all current guesses
     * @returns {Object} All guesses
     */
    getAllGuesses() {
        return { ...this.guesses };
    }

    /**
     * Check if all hidden faces have been guessed
     * @returns {boolean} True if all faces are guessed
     */
    allFacesGuessed() {
        return this.hiddenFaces.every(face => this.guesses[face] !== null);
    }

    /**
     * Validate a single guess
     * @param {string} face - Face name
     * @returns {boolean} True if guess is correct
     */
    validateGuess(face) {
        return this.guesses[face] === this.cubeState[face];
    }

    /**
     * Validate all guesses
     * @returns {Object} Object with validation results
     */
    validateAllGuesses() {
        const results = {
            correct: [],
            incorrect: [],
            allCorrect: true
        };

        this.hiddenFaces.forEach(face => {
            if (this.guesses[face] === this.cubeState[face]) {
                results.correct.push(face);
            } else {
                results.incorrect.push(face);
                results.allCorrect = false;
            }
        });

        return results;
    }

    /**
     * Get the correct color for a face (for showing solution)
     * @param {string} face - Face name
     * @returns {string} Correct color
     */
    getCorrectColor(face) {
        return this.cubeState[face];
    }

    /**
     * Get available colors for guessing (all colors except visible ones)
     * @returns {Array} Array of available color names
     */
    getAvailableColors() {
        // Get colors that are already visible
        const visibleColors = this.visibleFaces.map(face => this.cubeState[face]);

        // Return all colors except the visible ones
        return CONFIG.COLOR_NAMES.filter(color => !visibleColors.includes(color));
    }
}
