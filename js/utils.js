/**
 * Utility functions for the Cube Color Guesser game
 */

const Utils = {
    /**
     * Convert color name to hex value
     * @param {string} colorName - Color name (e.g., 'white', 'red')
     * @returns {number} Hex color value
     */
    getColorHex(colorName) {
        const colorMap = {
            white: CONFIG.COLORS.WHITE,
            yellow: CONFIG.COLORS.YELLOW,
            red: CONFIG.COLORS.RED,
            orange: CONFIG.COLORS.ORANGE,
            blue: CONFIG.COLORS.BLUE,
            green: CONFIG.COLORS.GREEN,
            gray: CONFIG.COLORS.GRAY
        };
        return colorMap[colorName] || CONFIG.COLORS.GRAY;
    },

    /**
     * Convert color name to CSS color string
     * @param {string} colorName - Color name
     * @returns {string} CSS color string
     */
    getColorCSS(colorName) {
        const colorMap = {
            white: '#ffffff',
            yellow: '#ffeb3b',
            red: '#f44336',
            orange: '#ff9800',
            blue: '#2196f3',
            green: '#4caf50',
            gray: '#808080'
        };
        return colorMap[colorName] || '#808080';
    },

    /**
     * Get opposite color based on Rubik's Cube color scheme
     * @param {string} color - Color name
     * @returns {string} Opposite color name
     */
    getOppositeColor(color) {
        return CONFIG.COLOR_SCHEME[color] || null;
    },

    /**
     * Capitalize first letter of a string
     * @param {string} str - Input string
     * @returns {string} Capitalized string
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Shuffle an array (Fisher-Yates algorithm)
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * Get random element from array
     * @param {Array} array - Input array
     * @returns {*} Random element
     */
    randomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Check if device is mobile (based on screen width)
     * @returns {boolean} True if device is mobile
     */
    isMobile() {
        return window.innerWidth <= 768;
    }
};
