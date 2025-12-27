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
        // Create a randomized cube configuration
        // The color pairs that must be opposite: white-yellow, red-orange, blue-green
        const colorPairs = [
            ['white', 'yellow'],
            ['red', 'orange'],
            ['blue', 'green']
        ];

        // Shuffle the color pairs to randomize which pair goes on which axis
        const shuffledPairs = Utils.shuffle(colorPairs);

        // Randomly assign each pair to opposite faces
        const assignments = [
            ['front', 'back'],
            ['left', 'right'],
            ['up', 'down']
        ];

        this.cubeState = {};

        shuffledPairs.forEach((pair, index) => {
            const [face1, face2] = assignments[index];
            // Randomly choose which color goes on which face of the pair
            if (Math.random() < 0.5) {
                this.cubeState[face1] = pair[0];
                this.cubeState[face2] = pair[1];
            } else {
                this.cubeState[face1] = pair[1];
                this.cubeState[face2] = pair[0];
            }
        });

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
