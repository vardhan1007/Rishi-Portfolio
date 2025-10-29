// === THREE.JS GALAXY SETUP ===
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('galaxy'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x030014, 1);

// === STARFIELD ===
const starGeometry = new THREE.BufferGeometry();
const starCount = 2000;
const positions = [];

for (let i = 0; i < starCount; i++) {
  const x = (Math.random() - 0.5) * 1000;
  const y = (Math.random() - 0.5) * 1000;
  const z = (Math.random() - 0.5) * 1000;
  positions.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// === SHOOTING STARS ===
// === SHOOTING STARS (Glowing Meteors Version) ===
const shootingStars = [];
const shootingStarCount = 8; // fewer but bigger, more dramatic

for (let i = 0; i < shootingStarCount; i++) {
  const geom = new THREE.SphereGeometry(0.25, 16, 16); // big bright sphere
  const mat = new THREE.MeshBasicMaterial({
    color: 0xFFD700,
    transparent: true,
    opacity: 1,
  });

  const star = new THREE.Mesh(geom, mat);
  resetShootingStar(star);
  scene.add(star);
  shootingStars.push(star);
}

function resetShootingStar(star) {
  // Random spawn point above and to the right
  star.position.x = Math.random() * 150 + 50;
  star.position.y = Math.random() * 60 + 40;
  star.position.z = (Math.random() - 0.5) * 80;

  // Fall direction toward left-bottom
  star.userData.velocity = new THREE.Vector3(
    -Math.random() * 1.8 - 0.8,
    -Math.random() * 1.2 - 0.6,
    Math.random() * 0.5
  );

  star.scale.setScalar(Math.random() * 1.5 + 1.5); // random size 1.5–3x
  star.material.opacity = 1;
}


// === PLANETS ===
// const textureLoader = new THREE.TextureLoader();
// const planetGeometry = new THREE.SphereGeometry(0.6, 32, 32);
// const planetMaterial = new THREE.MeshStandardMaterial({
//   color: 0x2266ff,
//   emissive: 0x001133,
//   metalness: 0.4,
//   roughness: 0.6
// });
// const planet = new THREE.Mesh(planetGeometry, planetMaterial);
// planet.position.set(2, 0, -2);
// scene.add(planet);

// Light
const light = new THREE.PointLight(0xFFD700, 1);
light.position.set(5, 5, 5);
const ambientGlow = new THREE.PointLight(0xFFD700, 1, 200);
ambientGlow.position.set(0, 0, 100);
scene.add(ambientGlow);
scene.add(light);

// === ANIMATION LOOP ===
function animate() {
  requestAnimationFrame(animate);

  // Rotate the starfield slowly
  stars.rotation.y += 0.0008;
  stars.rotation.x += 0.0003;

  // Animate glowing shooting stars
  shootingStars.forEach(star => {
    // Move position
    star.position.add(star.userData.velocity);

    // Fade out gradually
    star.material.opacity -= 0.008;

    // 🌈 Color shifting glow effect
    // Each star gets a unique hue that shifts over time
    const time = Date.now() * 0.0003;
    const hue = (time + star.userData.hueOffset) % 1; // 0–1 range
    star.material.color.setHSL(hue, 1, 0.6); // vivid shifting hue

    // Pulse glow intensity
    const glowIntensity = (Math.sin(Date.now() * 0.01) + 1) / 2;
    star.scale.setScalar(1.5 + glowIntensity * 0.7);

    // When faded out, respawn
    if (star.material.opacity <= 0) resetShootingStar(star);
  });

  renderer.render(scene, camera);
}
animate();



// === RESPONSIVENESS ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
