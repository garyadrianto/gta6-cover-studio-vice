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

  const dossierBytes = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
    app_path_max_bytes: 1000,
  });

  const dossierFile = join(outDir, 'dossier.json');
  writeFileSync(dossierFile, dossierBytes);
  console.log(`[makefun] Vice Studio dossier packaged cleanly at ${dossierFile}`);
}

deliverViceStudio();
