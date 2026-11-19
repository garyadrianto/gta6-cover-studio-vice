import { drawCover } from './cover.js';
import { runShot } from './shots.js';

const canvas = document.getElementById('cover');
const caption = document.getElementById('caption');
const subcaption = document.getElementById('subcaption');
const status = document.getElementById('status');

let photo = null;
let currentLayout = 'multi4';
let currentGrade = 'sunset';

function redraw() {
  drawCover(canvas, photo, caption.value, subcaption ? subcaption.value : '', currentLayout, currentGrade);
}

export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

// Preset Handlers
document.querySelectorAll('#layout-presets .preset-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('#layout-presets .preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentLayout = btn.dataset.layout;
    redraw();
  });
});

document.querySelectorAll('#color-grades .preset-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('#color-grades .preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentGrade = btn.dataset.grade;
    redraw();
  });
});

document.getElementById('photo').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  photo = await loadImage(URL.createObjectURL(file));
  redraw();
});

caption.addEventListener('input', redraw);
if (subcaption) subcaption.addEventListener('input', redraw);

function exportImage(width, height, filename) {
  const offscreen = document.createElement('canvas');
  offscreen.width = width;
  offscreen.height = height;
  drawCover(offscreen, photo, caption.value, subcaption ? subcaption.value : '', currentLayout, currentGrade);
  offscreen.toBlob((blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    status.textContent = `Exported ${filename} (${width}x${height})`;
  }, 'image/png');
}

document.getElementById('export-square').addEventListener('click', () => {
  exportImage(1080, 1080, 'vice-cover-1080x1080.png');
});

const btnPortrait = document.getElementById('export-portrait');
if (btnPortrait) {
  btnPortrait.addEventListener('click', () => {
    exportImage(1080, 1350, 'vice-cover-1080x1350.png');
  });
}

// Check URL Params for Automated Screenshot Grader (?shot=...)
const shot = new URLSearchParams(location.search).get('shot');
if (shot) {
  runShot(shot, new URLSearchParams(location.search), async (sample, text) => {
    photo = await loadImage(sample);
    caption.value = text;
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('layout')) currentLayout = urlParams.get('layout');
    if (urlParams.get('grade')) currentGrade = urlParams.get('grade');
    redraw();
  });
} else {
  // Preload default sample for crisp instant view
  loadImage('./samples/pier.jpg').then(img => {
    photo = img;
    redraw();
  }).catch(() => {
    redraw();
  });
}
