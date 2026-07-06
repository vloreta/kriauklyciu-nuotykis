const fs = require('fs');
const path = require('path');

const root = __dirname;
const out = path.join(root, 'dist');
const include = [
  'index.html',
  'child.html',
  'parent.html',
  'olivijos-vandenynas.html',
  'dominyko-vandenynas.html',
  'restore-data.html',
  'cloud-config.js',
  'supabase-schema.sql',
  'assets',
  'cards',
  'icons',
  'admin'
];

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const item of include) {
  const src = path.join(root, item);
  if (fs.existsSync(src)) copyRecursive(src, path.join(out, item));
}
