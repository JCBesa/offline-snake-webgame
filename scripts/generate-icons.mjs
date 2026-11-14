import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = 'D:/BESA/Documents/Projects/offline-snake-webgame/public/icons';

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const scale = size / 512;

  // Background
  const bgGradient = ctx.createLinearGradient(0, 0, size, size);
  bgGradient.addColorStop(0, '#1a1a1a');
  bgGradient.addColorStop(1, '#0d0d0d');
  ctx.fillStyle = bgGradient;
  const radius = size * 0.156;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, radius);
  ctx.fill();

  // Snake body
  const snakeGradient = ctx.createLinearGradient(0, 0, size, size);
  snakeGradient.addColorStop(0, '#4ade80');
  snakeGradient.addColorStop(0.5, '#22c55e');
  snakeGradient.addColorStop(1, '#16a34a');
  ctx.fillStyle = snakeGradient;

  const segW = size * 0.25;
  const segH = size * 0.0625;
  const corner = size * 0.03125;
  const offset = size * 0.125;

  // Horizontal segments
  ctx.beginPath();
  ctx.roundRect(offset, offset + size * 0.375, segW, segH, corner);
  ctx.fill();

  ctx.beginPath();
  ctx.roundRect(offset + size * 0.5, offset + size * 0.375, segH, segW * 0.75, corner);
  ctx.fill();

  ctx.beginPath();
  ctx.roundRect(offset + size * 0.5, offset + size * 0.375, segW * 0.75, segH, corner);
  ctx.fill();

  ctx.beginPath();
  ctx.roundRect(offset + size * 0.75, offset + size * 0.25, segH, segW * 0.75, corner);
  ctx.fill();

  ctx.beginPath();
  ctx.roundRect(offset + size * 0.625, offset + size * 0.25, segW * 0.5, segH, corner);
  ctx.fill();

  // Snake head eyes
  ctx.fillStyle = '#0d0d0d';
  const headX = offset + size * 0.195;
  const headY = offset + size * 0.406;
  const eyeR = size * 0.047;
  ctx.beginPath();
  ctx.arc(headX, headY, eyeR, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#000';
  const pupilR = size * 0.023;
  ctx.beginPath();
  ctx.arc(headX, headY, pupilR, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fff';
  const highlightR = size * 0.012;
  ctx.beginPath();
  ctx.arc(headX - eyeR * 0.5, headY - eyeR * 0.5, highlightR, 0, Math.PI * 2);
  ctx.fill();

  // Food
  const foodGradient = ctx.createRadialGradient(
    size * 0.78, size * 0.625, 0,
    size * 0.78, size * 0.625, size * 0.055
  );
  foodGradient.addColorStop(0, '#f87171');
  foodGradient.addColorStop(1, '#ef4444');
  ctx.fillStyle = foodGradient;
  ctx.beginPath();
  ctx.ellipse(size * 0.78, size * 0.625, size * 0.055, size * 0.055, 0, 0, Math.PI * 2);
  ctx.fill();

  // Food highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.ellipse(size * 0.758, size * 0.602, size * 0.016, size * 0.016, 0, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

console.log('Generating PWA icons...');
sizes.forEach(size => {
  const canvas = drawIcon(size);
  const buffer = canvas.toBuffer('image/png');
  const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated ${size}x${size}.png`);
});

console.log('Done!');