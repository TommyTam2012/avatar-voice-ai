let audioContext, analyser, dataArray;
const canvas = document.getElementById("avatarCanvas");
const ctx = canvas.getContext("2d");

// Initial face drawing
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
  ctx.arc(120, 130, 10, 0, Math.PI * 2); // Left eye
  ctx.arc(180, 130, 10, 0, Math.PI * 2); // Right eye
  ctx.fill();

  // Mouth (changes if mouthOpen)
  ctx.beginPath();
  if (mouthOpen) {
    ctx.ellipse(150, 190, 30, 20, 0, 0, Math.PI * 2);
  } else {
    ctx.ellipse(150, 190, 30, 5, 0, 0, Math.PI * 2);
  }
  ctx.fillStyle = "#900";
  ctx.fill();
}

drawFace(false); // Draw face initially

// Play voice and animate mouth
async function speak() {
  const audio = new Audio("sample.mp3"); // Replace this later with ElevenLabs MP3
  audio.crossOrigin = "anonymous";

  if (!audioContext) {
    audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 32;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
  }

  audio.play();

  function animate() {
    requestAnimationFrame(animate);
    analyser.getByteFrequencyData(dataArray);
    const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

    drawFace(volume > 20); // Simple threshold for mouth animation
  }

  animate();
}
