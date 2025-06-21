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
    ctx.ellipse(150, 190, 30, 5, 0, 0, Ma
