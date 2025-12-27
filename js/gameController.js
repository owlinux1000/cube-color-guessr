/**
 * Main game controller - rapid-fire single question format
 */

class GameController {
    constructor() {
        this.cubeManager = new CubeManager();
        this.renderer = new Renderer('cube-canvas');
        this.uiManager = new UIManager();

        this.currentStreak = 0;
        this.bestStreak = 0;
        this.currentFace = null;
        this.previousFace = null;
    }

    /**
     * Initialize the game
     */
    init() {
        // Initialize Three.js renderer
        this.renderer.init();

        // Set up UI event listeners
        this.uiManager.setupEventListeners(
            (color) => this.handleColorSelect(color),
            () => this.resetScore()
        );

        // Start first round
        this.startNewRound();
    }

    /**
     * Reset streak and start fresh
     */
    resetScore() {
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.uiManager.updateStreak(this.currentStreak, this.bestStreak);
        this.startNewRound();
    }

    /**
     * Start a new round (new cube, one random question)
     */
    startNewRound() {
        // Generate new cube configuration
        const cubeState = this.cubeManager.generateCube();

        // Create the 3D cube
        this.renderer.createCube(cubeState);

        // Get hidden faces and pick one randomly (avoid repeating the same face)
        const hiddenFaces = this.cubeManager.getHiddenFaces();

        // If we have a previous face, try to pick a different one
        if (this.previousFace && hiddenFaces.length > 1) {
            const availableFaces = hiddenFaces.filter(face => face !== this.previousFace);
            this.currentFace = Utils.randomElement(availableFaces);
        } else {
            this.currentFace = Utils.randomElement(hiddenFaces);
        }

        this.previousFace = this.currentFace;

        // Hide all hidden faces
        this.renderer.hideFaces(hiddenFaces);

        // Update UI with visible faces
        const visibleFaces = this.cubeManager.getVisibleFaces();
        const verticalFace = this.cubeManager.getVerticalFace();
        this.uiManager.updateVisibleFaces(visibleFaces, verticalFace);

        // Get available colors
        const availableColors = this.cubeManager.getAvailableColors();
        this.uiManager.setupColorButtons(availableColors);

        // Show the question for the randomly selected face
        this.uiManager.showQuestion(this.currentFace);
        this.uiManager.enableColorButtons();
        this.uiManager.hideFeedback();
    }

    /**
     * Handle color selection
     * @param {string} color - Selected color
     */
    handleColorSelect(color) {
        const correctColor = this.cubeManager.getCorrectColor(this.currentFace);
        const isCorrect = color === correctColor;

        // Update streak
        if (isCorrect) {
            this.currentStreak++;
            // Update best streak if current is higher
            if (this.currentStreak > this.bestStreak) {
                this.bestStreak = this.currentStreak;
            }
        } else {
            this.currentStreak = 0; // Reset streak on wrong answer
        }
        this.uiManager.updateStreak(this.currentStreak, this.bestStreak);

        // Show the guessed color on the cube
        this.renderer.updateFaceColor(this.currentFace, color);

        // Show immediate feedback
        this.uiManager.showFeedback(isCorrect, correctColor);
        this.uiManager.disableColorButtons();

        // If incorrect, show correct color
        if (!isCorrect) {
            this.renderer.updateFaceColor(this.currentFace, correctColor);
        }

        // Quick delay to see feedback, then start new round
        setTimeout(() => {
            this.startNewRound();
        }, 600);
    }
}
