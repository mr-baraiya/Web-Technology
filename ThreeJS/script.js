// Three.js Wireframe Cube, Cuboid, and Sphere Application
let scene, camera, renderer, cube, cuboid, sphere;
let mouseX = 0, mouseY = 0;

// Initialize the Three.js scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 10;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add renderer to DOM
    document.getElementById('three-container').appendChild(renderer.domElement);

    // Create cube geometry (wireframe)
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeEdges = new THREE.EdgesGeometry(cubeGeometry);
    const cubeWireframe = new THREE.LineSegments(
        cubeEdges,
        new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 })
    );
    cube = cubeWireframe;
    cube.position.x = -4; // Position cube on the left
    scene.add(cube);

    // Create cuboid geometry (wireframe)
    const cuboidGeometry = new THREE.BoxGeometry(3, 1.5, 2.5);
    const cuboidEdges = new THREE.EdgesGeometry(cuboidGeometry);
    const cuboidWireframe = new THREE.LineSegments(
        cuboidEdges,
        new THREE.LineBasicMaterial({ color: 0xff6b6b, linewidth: 2 })
    );
    cuboid = cuboidWireframe;
    cuboid.position.x = 0; // Position cuboid in the center
    scene.add(cuboid);

    // Create sphere geometry (wireframe)
    const sphereGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    const sphereEdges = new THREE.EdgesGeometry(sphereGeometry);
    const sphereWireframe = new THREE.LineSegments(
        sphereEdges,
        new THREE.LineBasicMaterial({ color: 0x4ecdc4, linewidth: 2 })
    );
    sphere = sphereWireframe;
    sphere.position.x = 4; // Position sphere on the right
    scene.add(sphere);

    // Add lighting
    addLighting();

    // Add event listeners
    addEventListeners();

    // Start animation loop
    animate();
}

// Add lighting to the scene
function addLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    // Directional light (main light source)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Point light for additional glow
    const pointLight = new THREE.PointLight(0x4ecdc4, 0.5, 100);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);
}

// Add event listeners for mouse interaction
function addEventListeners() {
    // Mouse move event for object rotation
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Window resize event
    window.addEventListener('resize', onWindowResize);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate cube based on mouse position
    cube.rotation.x += 0.01 + mouseY * 0.005;
    cube.rotation.y += 0.01 + mouseX * 0.005;

    // Rotate cuboid based on mouse position (opposite direction for variety)
    cuboid.rotation.x += 0.008 - mouseY * 0.005;
    cuboid.rotation.y += 0.008 - mouseX * 0.005;

    // Rotate sphere based on mouse position (different pattern)
    sphere.rotation.x += 0.006 + mouseY * 0.003;
    sphere.rotation.y += 0.006 + mouseX * 0.003;

    // Add some automatic rotation
    cube.rotation.x += 0.003;
    cube.rotation.y += 0.003;
    
    cuboid.rotation.x += 0.002;
    cuboid.rotation.y += 0.002;

    sphere.rotation.x += 0.004;
    sphere.rotation.y += 0.004;

    renderer.render(scene, camera);
}

// Initialize the application when the page loads
window.addEventListener('load', init);
