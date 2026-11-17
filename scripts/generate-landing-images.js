#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/*
Generate WebP and @2x variants for selected landing images.

Usage:
  node scripts/generate-landing-images.js [--update]

--update : if provided, the script will attempt to update src/data/landingAssets.ts
           replacing original filenames with @2x filenames when generated.

Note: This script requires 'sharp'. Install with `npm install --save-dev sharp`.
*/

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public', 'images', 'Landing');
const dataFile = path.join(root, 'src', 'data', 'landingAssets.ts');

const targets = [
  { name: 'Frame1.png', desiredWidth: 630 },
  { name: 'Frame4.png', desiredWidth: 630 },
  { name: 'Frame5.png', desiredWidth: 1440 },
  { name: 'Frame6.png', desiredWidth: 630 },
  { name: 'LinkCardLarge.png', desiredWidth: 630 },
  { name: 'LinkCardLarge2.png', desiredWidth: 630 },
  { name: 'Container1.png', desiredWidth: 413 },
  { name: 'Container2.png', desiredWidth: 413 },
  { name: 'Container3.png', desiredWidth: 413 },
  { name: 'Container4.png', desiredWidth: 413 },
];

async function processFile(fileEntry) {
  const srcPath = path.join(publicDir, fileEntry.name);
  if (!fs.existsSync(srcPath)) {
    console.warn('Missing', srcPath);
    return null;
  }

  try {
    const img = sharp(srcPath);
    const meta = await img.metadata();

    // create webp
    const webpName = fileEntry.name.replace(/\.[^.]+$/, '.webp');
    const webpPath = path.join(publicDir, webpName);
    await img.webp({ quality: 80 }).toFile(webpPath);
    console.log('Created', webpName);

    // create @2x if possible (resize up only if source larger than target 2x)
    const target2xWidth = fileEntry.desiredWidth * 2;
    const at2xName = fileEntry.name.replace(/\.[^.]+$/, '@2x$&');
    const at2xPath = path.join(publicDir, at2xName);

    if (meta.width && meta.width >= Math.min(target2xWidth, meta.width)) {
      // resize to target2xWidth but do not upscale beyond original width
      const resizeWidth = Math.min(target2xWidth, meta.width);
      await img.resize(resizeWidth).toFile(at2xPath);
      console.log('Created', at2xName, '(resized)');
    } else {
      // copy original as @2x (no upscale)
      fs.copyFileSync(srcPath, at2xPath);
      console.log('Copied', at2xName, '(no upscale)');
    }

    // also create webp @2x
    const at2xWebpName = at2xName.replace(/\.[^.]+$/, '.webp');
    const at2xWebpPath = path.join(publicDir, at2xWebpName);
    await sharp(at2xPath).webp({ quality: 80 }).toFile(at2xWebpPath);
    console.log('Created', at2xWebpName);

    return {
      src: `/images/Landing/${fileEntry.name}`,
      webp: `/images/Landing/${webpName}`,
      at2x: `/images/Landing/${at2xName}`,
      at2xWebp: `/images/Landing/${at2xWebpName}`,
    };
  } catch (err) {
    console.error('Error processing', srcPath, err);
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const doUpdate = args.includes('--update');

  const results = [];
  for (const t of targets) {
    const found = fs.existsSync(path.join(publicDir, t.name));
    if (!found) {
      console.warn('Target not found:', t.name);
      continue;
    }

    const res = await processFile(t);
    if (res) results.push({ original: res.src, ...res });
  }

  if (doUpdate && results.length) {
    if (!fs.existsSync(dataFile)) {
      console.error('Data file not found:', dataFile);
      return;
    }

    let content = fs.readFileSync(dataFile, 'utf8');
    for (const r of results) {
      const orig = r.original.replace(/\//g, '\\/');
      const at2x = r.at2x.replace(/\//g, '\\/');
      // replace occurrences of original with @2x (prefer @2x png)
      const re = new RegExp(orig, 'g');
      content = content.replace(re, at2x);
      console.log('Replaced', r.original, '->', r.at2x, 'in', dataFile);
    }

    fs.writeFileSync(dataFile, content, 'utf8');
    console.log('Updated', dataFile);
  }

  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
