/**
 * Handles Three.js rendering of the Rubik's Cube
 */

class Renderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cube = null;
        this.materials = [];
        this.animationId = null;
    }

    /**
     * Initialize Three.js scene
     */
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x2d2d2d);

        // Create camera
        const aspect = CONFIG.RENDERING.CANVAS_WIDTH / CONFIG.RENDERING.CANVAS_HEIGHT;
        this.camera = new THREE.PerspectiveCamera(
            CONFIG.RENDERING.CAMERA_FOV,
            aspect,
            0.1,
            1000
        );

        const pos = CONFIG.RENDERING.CAMERA_POSITION;
        this.camera.position.set(pos.x, pos.y, pos.z);
        this.camera.lookAt(0, 0, 0);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(
            CONFIG.RENDERING.CANVAS_WIDTH,
            CONFIG.RENDERING.CANVAS_HEIGHT
        );

        // Add lighting
        const ambientLight = new THREE.AmbientLight(
            0xffffff,
            CONFIG.RENDERING.AMBIENT_LIGHT
        );
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(
            0xffffff,
            CONFIG.RENDERING.DIRECTIONAL_LIGHT
        );
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        // Start animation loop
        this.animate();
    }

    /**
     * Create a 3x3 grid texture for a Rubik's Cube face
     * @param {string} color - Color name for the face
     * @returns {THREE.CanvasTexture} Texture with 3x3 grid
     */
    create3x3Texture(color) {
        const canvas = document.createElement('canvas');
        const size = 512;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Background (black borders)
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, size, size);

        // Draw 3x3 grid of colored squares
        const cubeSize = size / 3;
        const gap = size * 0.02; // 2% gap between cubelets

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const x = col * cubeSize + gap;
                const y = row * cubeSize + gap;
                const w = cubeSize - gap * 2;
                const h = cubeSize - gap * 2;

                // Fill cubelet with color
                ctx.fillStyle = Utils.getColorCSS(color);
                ctx.fillRect(x, y, w, h);

                // Add slight gradient for depth
                const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
                ctx.fillStyle = gradient;
                ctx.fillRect(x, y, w, h);

                // Add border for each cubelet
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, w, h);
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    /**
     * Create the 3D cube with given colors
     * @param {Object} cubeState - Object with face colors
     */
    createCube(cubeState) {
        // Remove existing cube if any
        if (this.cube) {
            this.scene.remove(this.cube);
            this.materials.forEach(mat => {
                if (mat.map) mat.map.dispose();
                mat.dispose();
            });
        }

        // Create materials with 3x3 textures for each face
        // Order: right, left, top, bottom, front, back
        this.materials = [
            new THREE.MeshLambertMaterial({ map: this.create3x3Texture(cubeState.right) }),  // Right
            new THREE.MeshLambertMaterial({ map: this.create3x3Texture(cubeState.left) }),   // Left
            new THREE.MeshLambertMaterial({ map: this.create3x3Texture(cubeState.up) }),     // Top
            new THREE.MeshLambertMaterial({ map: this.create3x3Texture(cubeState.down) }),   // Bottom
            new THREE.MeshLambertMaterial({ map: this.create3x3Texture(cubeState.front) }), // Front
            new THREE.MeshLambertMaterial({ map: this.create3x3Texture(cubeState.back) })    // Back
        ];

        // Create cube geometry
        const geometry = new THREE.BoxGeometry(
            CONFIG.RENDERING.CUBE_SIZE,
            CONFIG.RENDERING.CUBE_SIZE,
            CONFIG.RENDERING.CUBE_SIZE
        );

        // Create mesh with materials
        this.cube = new THREE.Mesh(geometry, this.materials);

        this.scene.add(this.cube);
    }

    /**
     * Update a specific face color
     * @param {string} face - Face name
     * @param {string} color - New color
     */
    updateFaceColor(face, color) {
        const index = CONFIG.FACE_INDICES[face];
        if (index !== undefined && this.materials[index]) {
            // Dispose old texture
            if (this.materials[index].map) {
                this.materials[index].map.dispose();
            }
            // Create and apply new texture
            this.materials[index].map = this.create3x3Texture(color);
            this.materials[index].needsUpdate = true;
        }
    }

    /**
     * Hide specific faces (show as gray with pattern)
     * @param {Array} faces - Array of face names to hide
     */
    hideFaces(faces) {
        faces.forEach(face => {
            const index = CONFIG.FACE_INDICES[face];
            if (index !== undefined && this.materials[index]) {
                // Dispose old texture
                if (this.materials[index].map) {
                    this.materials[index].map.dispose();
                }
                // Create gray texture
                this.materials[index].map = this.create3x3Texture('gray');
                this.materials[index].needsUpdate = true;
            }
        });
    }

    /**
     * Show faces with their actual colors
     * @param {Array} faces - Array of face names to show
     * @param {Object} cubeState - Cube state with colors
     */
    showFaces(faces, cubeState) {
        faces.forEach(face => {
            const index = CONFIG.FACE_INDICES[face];
            if (index !== undefined && this.materials[index] && cubeState[face]) {
                // Dispose old texture
                if (this.materials[index].map) {
                    this.materials[index].map.dispose();
                }
                // Create and apply new texture with correct color
                this.materials[index].map = this.create3x3Texture(cubeState[face]);
                this.materials[index].needsUpdate = true;
            }
        });
    }

    /**
     * Rotate the cube slowly for visual effect
     */
    rotateCube() {
        if (this.cube) {
            this.cube.rotation.y += 0.005;
        }
    }

    /**
     * Animation loop
     */
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Render the scene (rotation disabled for fixed view)
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Stop animation
     */
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const width = CONFIG.RENDERING.CANVAS_WIDTH;
        const height = CONFIG.RENDERING.CANVAS_HEIGHT;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    /**
     * Cleanup resources
     */
    dispose() {
        this.stopAnimation();
        if (this.cube) {
            this.scene.remove(this.cube);
        }
        this.materials.forEach(mat => {
            if (mat.map) mat.map.dispose();
            mat.dispose();
        });
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}
