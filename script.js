let scene, camera, renderer, avatar, jaw;
let intervalId;

init();

async function init() {
  // Setup renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("three-canvas"), alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Setup scene and camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.6, 2.2);

  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 3, 2);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0x404040, 1.5);
  scene.add(ambient);

  // Controls (optional)
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.5, 0);
  controls.update();

  // Load your avatar
  const loader = new THREE.GLTFLoader();
  loader.load("avatar.glb", (gltf) => {
    avatar = gltf.scene;
    avatar.scale.set(1.5, 1.5, 1.5);
    scene.add(avatar);

    // Try to find jaw or use fallback
    jaw = avatar.getObjectByName("Head") || avatar; // fallback if no jaw

    animate(); // Start render loop
  });
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// MOUTH SIMULATION (timed like in 2D)
function startMouthLoop() {
  function animateJaw() {
    if (!jaw) return;
    const scale = 1 + Math.random() * 0.3;
    jaw.scale.y = scale;

    const nextDelay = Math.random() * 400 + 250;
    intervalId = setTimeout(animateJaw, nextDelay);
  }
  animateJaw();
}

function stopMouthLoop() {
  clearTimeout(intervalId);
  if (jaw) jaw.scale.y = 1;
}

// GPT Voice + Trigger
async function speak() {
  const text = "大家好，我是Tommy老師。這是我第一次用我的克隆聲音製作的2D教學影片，希望未來我能開發出3D模型，或使用我的照片來進行即時授課。";

  try {
    const response = await fetch("/api/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      alert("❌ Voice fetch failed.");
      return;
    }

    const blob = await response.blob();
    const audioURL = URL.createObjectURL(blob);
    const audio = new Audio(audioURL);
    audio.crossOrigin = "anonymous";
    audio.playbackRate = 0.85;

    audio.addEventListener("play", () => startMouthLoop());
    audio.addEventListener("ended", () => stopMouthLoop());

    await audio.play();
  } catch (err) {
    console.error("💥 Error:", err);
    stopMouthLoop();
  }
}
