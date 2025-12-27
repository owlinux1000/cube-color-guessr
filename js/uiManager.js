/**
 * Manages UI interactions for question-based game flow
 */

class UIManager {
    constructor() {
        this.elements = {
            // Progress
            currentStreak: document.getElementById('current-streak'),
            bestStreak: document.getElementById('best-streak'),
            frontColor: document.getElementById('front-color'),
            verticalColor: document.getElementById('vertical-color'),

            // Question
            questionText: document.getElementById('question-text'),
            feedbackIndicator: document.getElementById('feedback-indicator'),
            feedbackIcon: document.getElementById('feedback-icon'),
            feedbackText: document.getElementById('feedback-text'),

            // Color options
            colorOptions: document.getElementById('color-options'),

            // Actions
            newGame: document.getElementById('new-game')
        };

        this.colorButtons = [];
        this.onColorSelect = null;
        this.onNewGame = null;
    }

    /**
     * Set up all event listeners
     * @param {Function} onColorSelect - Callback when color is selected
     * @param {Function} onNewGame - Callback when new game is clicked
     */
    setupEventListeners(onColorSelect, onNewGame) {
        this.onColorSelect = onColorSelect;
        this.onNewGame = onNewGame;

        this.elements.newGame.addEventListener('click', onNewGame);
    }

    /**
     * Update visible faces display
     * @param {Object} visibleFaces - Visible face colors
     * @param {string} verticalFace - 'up' or 'down'
     */
    updateVisibleFaces(visibleFaces, verticalFace) {
        this.elements.frontColor.style.backgroundColor = Utils.getColorCSS(visibleFaces.front);
        this.elements.verticalColor.style.backgroundColor = Utils.getColorCSS(visibleFaces[verticalFace]);
    }

    /**
     * Update streak display
     * @param {number} currentStreak - Current consecutive correct answers
     * @param {number} bestStreak - Best streak achieved
     */
    updateStreak(currentStreak, bestStreak) {
        this.elements.currentStreak.textContent = currentStreak;
        this.elements.bestStreak.textContent = bestStreak;
    }

    /**
     * Show question for current face
     * @param {string} face - Face name (e.g., 'left', 'right')
     */
    showQuestion(face) {
        const faceUpper = Utils.capitalize(face);
        this.elements.questionText.textContent = `What color is the ${faceUpper} face?`;
    }

    /**
     * Create color selection buttons
     * @param {Array} colors - Available colors
     */
    setupColorButtons(colors) {
        this.elements.colorOptions.innerHTML = '';
        this.colorButtons = [];

        colors.forEach(color => {
            const button = document.createElement('button');
            button.className = `color-btn ${color}`;
            button.style.backgroundColor = Utils.getColorCSS(color);
            button.dataset.color = color;

            button.addEventListener('click', () => {
                if (this.onColorSelect) {
                    this.onColorSelect(color);
                }
            });

            this.colorButtons.push(button);
            this.elements.colorOptions.appendChild(button);
        });
    }

    /**
     * Enable all color buttons
     */
    enableColorButtons() {
        this.colorButtons.forEach(btn => btn.disabled = false);
    }

    /**
     * Disable all color buttons
     */
    disableColorButtons() {
        this.colorButtons.forEach(btn => btn.disabled = true);
    }

    /**
     * Show feedback for answer
     * @param {boolean} isCorrect - Whether answer was correct
     * @param {string} correctColor - The correct color
     */
    showFeedback(isCorrect, correctColor) {
        this.elements.feedbackIndicator.classList.remove('hidden', 'correct', 'incorrect');

        if (isCorrect) {
            this.elements.feedbackIndicator.classList.add('correct');
            this.elements.feedbackIcon.textContent = '✓';
            this.elements.feedbackText.textContent = 'Correct!';
        } else {
            this.elements.feedbackIndicator.classList.add('incorrect');
            this.elements.feedbackIcon.textContent = '✗';
            this.elements.feedbackText.textContent = `Wrong! It's ${Utils.capitalize(correctColor)}`;
        }
    }

    /**
     * Hide feedback indicator
     */
    hideFeedback() {
        this.elements.feedbackIndicator.classList.add('hidden');
        this.elements.feedbackIndicator.classList.remove('correct', 'incorrect');
    }

}
