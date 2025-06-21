const canvas = document.getElementById("avatarCanvas");
const ctx = canvas.getContext("2d");

function drawFace(mouthOpen) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Head shape (oval face)
  ctx.beginPath();
  ctx.ellipse(150, 150, 85, 100, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#f9d1a1";
  ctx.fill();

  // Hair (silver arc on top)
  ctx.beginPath();
  ctx.arc(150, 120, 85, Math.PI, 2 * Math.PI);
  ctx.fillStyle = "#c0c0c0";
  ctx.fill();

  // Left ear earring
  ctx.beginPath();
  ctx.arc(65, 155, 4, 0, Math.PI * 2);
  ctx.fillStyle = "gold";
  ctx.fill();

  // Eyes
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(120, 140, 9, 0, Math.PI * 2); // Left eye
  ctx.arc(180, 140, 9, 0, Math.PI * 2); // Right eye
  ctx.fill();

  // Mouth
  ctx.beginPath();
  if (mouthOpen) {
    ctx.ellipse(150, 200, 30, 20, 0, 0, Math.PI * 2);
  } else {
    ctx.ellipse(150, 200, 30, 5, 0, 0, Math.PI * 2);
  }
  ctx.fillStyle = "#900";
  ctx.fill();

    // Suit collar
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.moveTo(85, 250);          // left bottom corner
  ctx.lineTo(150, 180);         // top center V
  ctx.lineTo(215, 250);         // right bottom corner
  ctx.closePath();
  ctx.fill();

  // Red pocket square (shift it up and left)
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo(172, 220);         // top left
  ctx.lineTo(180, 220);         // top right
  ctx.lineTo(180, 228);         // bottom right
  ctx.lineTo(172, 228);         // bottom left
  ctx.closePath();
  ctx.fill();
}

drawFace(false);

async function speak() {
  const text = "Hello, I am Tommy Sir's AI voice assistant. Let's begin your English lesson.";

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

    let mouthState = false;
    let intervalId = null;

    // 🎯 Human-style mouth movement: randomized open/close
    function startMouthLoop() {
      function randomMouthMotion() {
        mouthState = !mouthState;
        drawFace(mouthState);
        const nextDelay = Math.random() * 400 + 250; // 250–650ms
        intervalId = setTimeout(randomMouthMotion, nextDelay);
      }
      randomMouthMotion();
    }

    function stopMouthLoop() {
      clearTimeout(intervalId);
      drawFace(false);
    }

    audio.addEventListener("play", () => startMouthLoop());
    audio.addEventListener("ended", () => stopMouthLoop());

    await audio.play();
  } catch (err) {
    console.error("💥 Error:", err);
    drawFace(false);
  }
}
