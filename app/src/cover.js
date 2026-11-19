// Advanced GTA 6 Cover Art Canvas Renderer
// Multi-panel layout engine, Vice City color grading & stylised comic lettering

export function drawCover(canvas, photo, captionText, subText = "STORIES OF LEONIDA", layout = "multi4", grade = "sunset") {
  const ctx = canvas.getContext('2d');
  const { width: w, height: h } = canvas;

  // 1. Deep Midnight Base
  ctx.fillStyle = '#0a0812';
  ctx.fillRect(0, 0, w, h);

  // Helper to draw image inside a bounding box with object-fit: cover
  function drawCoverPhoto(bx, by, bw, bh, zoom = 1, offsetX = 0.5, offsetY = 0.5) {
    if (!photo) {
      // Stylised placeholder gradient
      const grad = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
      grad.addColorStop(0, '#1c152e');
      grad.addColorStop(1, '#3b1c4a');
      ctx.fillStyle = grad;
      ctx.fillRect(bx, by, bw, bh);
      return;
    }
    ctx.save();
    ctx.beginPath();
    ctx.rect(bx, by, bw, bh);
    ctx.clip();

    const scale = Math.max(bw / photo.naturalWidth, bh / photo.naturalHeight) * zoom;
    const pw = photo.naturalWidth * scale;
    const ph = photo.naturalHeight * scale;
    const dx = bx + (bw - pw) * offsetX;
    const dy = by + (bh - ph) * offsetY;

    ctx.drawImage(photo, dx, dy, pw, ph);
    ctx.restore();
  }

  // Helper to render panel border
  function strokePanel(bx, by, bw, bh, borderW = 8) {
    ctx.save();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = borderW;
    ctx.strokeRect(bx, by, bw, bh);
    ctx.restore();
  }

  // 2. Render Panels according to Layout
  const pad = 12;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;

  if (layout === "single") {
    drawCoverPhoto(pad, pad, innerW, innerH, 1.05);
    strokePanel(pad, pad, innerW, innerH, 10);
  } else if (layout === "hero3") {
    // Top hero 60%, bottom split 40% (2 panels)
    const topH = innerH * 0.6;
    const botH = innerH - topH - pad;
    const botW = (innerW - pad) / 2;

    drawCoverPhoto(pad, pad, innerW, topH, 1.1, 0.5, 0.3);
    strokePanel(pad, pad, innerW, topH, 8);

    drawCoverPhoto(pad, pad + topH + pad, botW, botH, 1.2, 0.2, 0.7);
    strokePanel(pad, pad + topH + pad, botW, botH, 8);

    drawCoverPhoto(pad + botW + pad, pad + topH + pad, botW, botH, 1.3, 0.8, 0.5);
    strokePanel(pad + botW + pad, pad + topH + pad, botW, botH, 8);
  } else {
    // Default: multi4 (Classic GTA Multi-panel Grid)
    // Panel 1: Top-left tall
    // Panel 2: Top-right wide
    // Panel 3: Center-right action
    // Panel 4: Bottom wide landscape
    const midX = w * 0.44;
    const topRowH = h * 0.48;

    // Panel 1 (Top Left)
    drawCoverPhoto(pad, pad, midX - pad, topRowH - pad, 1.25, 0.3, 0.2);
    strokePanel(pad, pad, midX - pad, topRowH - pad, 8);

    // Panel 2 (Top Right)
    drawCoverPhoto(midX + pad, pad, w - midX - pad * 2, topRowH * 0.65, 1.15, 0.7, 0.3);
    strokePanel(midX + pad, pad, w - midX - pad * 2, topRowH * 0.65, 8);

    // Panel 3 (Mid Right)
    const p3Y = pad + topRowH * 0.65 + pad;
    const p3H = topRowH * 0.35 - pad;
    drawCoverPhoto(midX + pad, p3Y, w - midX - pad * 2, p3H, 1.4, 0.5, 0.8);
    strokePanel(midX + pad, p3Y, w - midX - pad * 2, p3H, 8);

    // Panel 4 (Bottom Full Width)
    const botY = pad + topRowH + pad;
    const botH = h - botY - pad;
    drawCoverPhoto(pad, botY, innerW, botH, 1.1, 0.5, 0.6);
    strokePanel(pad, botY, innerW, botH, 8);
  }

  // 3. Apply Cinematic Vice Color Grading
  ctx.save();
  if (grade === "sunset") {
    const sunset = ctx.createLinearGradient(0, 0, 0, h);
    sunset.addColorStop(0, 'rgba(255, 100, 30, 0.2)');
    sunset.addColorStop(0.45, 'rgba(255, 0, 128, 0.15)');
    sunset.addColorStop(1, 'rgba(50, 0, 80, 0.5)');
    ctx.fillStyle = sunset;
    ctx.fillRect(0, 0, w, h);
  } else if (grade === "neon") {
    const neon = ctx.createRadialGradient(w/2, h/2, 100, w/2, h/2, w);
    neon.addColorStop(0, 'rgba(0, 240, 255, 0.1)');
    neon.addColorStop(0.7, 'rgba(255, 0, 150, 0.25)');
    neon.addColorStop(1, 'rgba(20, 0, 40, 0.6)');
    ctx.fillStyle = neon;
    ctx.fillRect(0, 0, w, h);
  } else if (grade === "gritty") {
    const gritty = ctx.createLinearGradient(0, 0, w, h);
    gritty.addColorStop(0, 'rgba(255, 190, 40, 0.25)');
    gritty.addColorStop(1, 'rgba(40, 20, 10, 0.55)');
    ctx.fillStyle = gritty;
    ctx.fillRect(0, 0, w, h);
  } else if (grade === "noir") {
    ctx.fillStyle = 'rgba(10, 15, 30, 0.45)';
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();

  // 4. Outer Poster Border / Framing
  ctx.save();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = pad * 2;
  ctx.strokeRect(0, 0, w, h);
  ctx.restore();

  // 5. Stylised Title & Subtitle Lettering
  const title = (captionText || "VICE HEIST").trim().toUpperCase();
  const sub = (subText || "STORIES OF LEONIDA").trim().toUpperCase();

  const titleY = h * 0.88;
  const subY = titleY + 38;

  // Backing banner plate for contrast
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(0, titleY - 65, w, 130);
  ctx.restore();

  // Draw 3D Extrusion Shadow for Title
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = '900 68px "Impact", "Arial Black", sans-serif';
  ctx.letterSpacing = '2px';

  // Deep black extrusion
  ctx.fillStyle = '#000000';
  for (let o = 6; o >= 1; o--) {
    ctx.fillText(title, w / 2 + o, titleY + o);
  }

  // Vibrant gradient text face
  const textGrad = ctx.createLinearGradient(0, titleY - 50, 0, titleY + 10);
  textGrad.addColorStop(0, '#ffffff');
  textGrad.addColorStop(0.5, '#fff1a8');
  textGrad.addColorStop(1, '#ff8000');
  ctx.fillStyle = textGrad;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.strokeText(title, w / 2, titleY);
  ctx.fillText(title, w / 2, titleY);
  ctx.restore();

  // Draw Subtitle / Tagline
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = '800 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillStyle = '#ff007f';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 4;
  ctx.fillText(sub, w / 2, subY);
  ctx.restore();
}
