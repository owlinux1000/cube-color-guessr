/**
 * Main entry point - Initialize the game when DOM is loaded
 */

// Global game controller instance
let gameController;

// Initialize game when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Create and initialize game controller
        gameController = new GameController();
        gameController.init();

        console.log('Cube Color Guesser initialized successfully!');
    } catch (error) {
        console.error('Error initializing game:', error);
        alert('Failed to initialize the game. Please refresh the page and try again.');
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (gameController && gameController.renderer) {
        gameController.renderer.handleResize();
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (gameController && gameController.renderer) {
        gameController.renderer.dispose();
    }
});
