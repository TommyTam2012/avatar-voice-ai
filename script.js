const canvas = document.getElementById("avatarCanvas");
const ctx = canvas.getContext("2d");

function drawFace(mouthOpen) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Head
  ctx.beginPath();
  ctx.arc(150, 150, 100, 0, Math.PI * 2);
  ctx.fillStyle = "#f9d1a1";
  ctx.fill();

  // Eyes
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(120, 130, 10, 0, Math.PI * 2);
  ctx.arc(180, 130, 10, 0, Math.PI * 2);
  ctx.fill();

  // Mouth
  ctx.beginPath();
  if (mouthOpen) {
    ctx.ellipse(150, 190, 30, 20, 0, 0, Math.PI * 2);
  } else {
    ctx.ellipse(150, 190, 30, 5, 0, 0, Math.PI * 2);
  }
  ctx.fillStyle = "#900";
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

    // Simulated mouth movement every 500ms
    function startMouthLoop() {
      intervalId = setInterval(() => {
        mouthState = !mouthState;
        drawFace(mouthState);
      }, 500);
    }

    function stopMouthLoop() {
      clearInterval(intervalId);
      drawFace(false); // Neutral mouth
    }

    audio.addEventListener("play", () => startMouthLoop());
    audio.addEventListener("ended", () => stopMouthLoop());

    await audio.play();
  } catch (err) {
    console.error("💥 Error:", err);
    drawFace(false);
  }
}
