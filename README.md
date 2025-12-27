# Cube Color Guesser

A web-based educational game to help learn Rubik's Cube color patterns through spatial reasoning.

## Game Concept

In this game, you see a Rubik's Cube with only 2 faces visible:
- The **front** face
- Either the **up** or **down** face (randomly chosen)

Your goal is to correctly guess the colors of the 4 hidden faces:
- Left
- Right
- Back
- The other vertical face (down if up is shown, or vice versa)

The cube follows the standard Rubik's Cube color scheme where opposite faces are:
- White ↔ Yellow
- Red ↔ Orange
- Blue ↔ Green

## How to Play

1. Open `index.html` in a web browser
2. Observe the two visible faces and their colors
3. Click on any hidden face button to make a guess
4. Select a color from the available options
5. Repeat for all hidden faces
6. Click "Check Solution" to see your results
7. Click "New Game" to try a new configuration

## Running Locally

### Option 1: Direct File Open
Simply open `index.html` in your web browser (Chrome, Firefox, Safari, or Edge).

### Option 2: Local Server (Recommended)
For better performance and to avoid CORS issues:

**Using Python:**
```bash
python3 -m http.server 8000
```

**Using Node.js:**
```bash
npx http-server
```

Then open `http://localhost:8000` in your browser.

## Project Structure

```
cube-color/
├── index.html          # Main HTML file
├── css/
│   └── main.css       # All styles
├── js/
│   ├── main.js        # Entry point and initialization
│   ├── config.js      # Configuration and constants
│   ├── utils.js       # Helper functions
│   ├── cubeManager.js # Cube logic and validation
│   ├── renderer.js    # Three.js 3D rendering
│   ├── uiManager.js   # UI interactions
│   └── gameController.js # Main game orchestration
├── docs/
│   ├── requirements.txt      # Product requirements
│   └── technical-design.txt  # Technical documentation
└── README.md
```

## Technology Stack

- **HTML5** - Structure
- **CSS3** - Styling and layout
- **JavaScript (ES6+)** - Game logic
- **Three.js** - 3D cube rendering

## MVP Features

✅ 3D Rubik's Cube visualization
✅ Show 2 faces (front + up/down)
✅ Guess 4 hidden faces
✅ Color validation
✅ Immediate feedback
✅ New game generation

## Future Enhancements

- Multiple difficulty levels
- Scoring and statistics
- Tutorial and hints
- Timer and challenges
- LocalStorage persistence
- Sound effects
- Animations and transitions
- Accessibility features

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Educational project - free to use and modify.

## Credits

Built with Three.js for 3D rendering.
