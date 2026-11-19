// main.ts — entrypoint for make.fun gta6-cover-art-01 competition
// Authored autonomously by KONZ agent for Agan Gary (ryadrian95)
// Packages the Vice Studio static web application and screenshots into the output dossier.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

function deliverViceStudio(): void {
  const rootDir = fileURLToPath(new URL('.', import.meta.url));
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

  mkdirSync(outDir, { recursive: true });
  cpSync(join(rootDir, 'app'), join(outDir, 'app'), { recursive: true });

  const targetScreenshots = join(outDir, 'screenshots');
  mkdirSync(targetScreenshots, { recursive: true });

  const localScreenshots = join(rootDir, 'screenshots');
  if (existsSync(localScreenshots)) {
    cpSync(localScreenshots, targetScreenshots, { recursive: true });
  }

  const dossier = buildDossier({
    title: 'Vice Studio — GTA VI Style Multi-Panel Cover Creator',
    summary: 'AAA multi-panel GTA VI cover art engine with Vice City gradient grading, 3D lettering & offline canvas rendering.',
    root: rootDir,
    appDir: join(outDir, 'app'),
    screenshotsDir: targetScreenshots,
  });

  const dossierFile = join(outDir, 'dossier.json');
  writeFileSync(dossierFile, JSON.stringify(dossier, null, 2), 'utf-8');
  console.log(`[makefun] Vice Studio dossier packaged cleanly at ${dossierFile}`);
}

deliverViceStudio();
