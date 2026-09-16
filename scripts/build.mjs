import { cp, lstat, mkdir, readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
const pages = ['index', 'about', 'team', 'projects', 'events', 'apply'];
// Explicit public inputs: never copy the repository or shared drive wholesale.
const inputs = [...pages.map(page => `${page}.html`), 'robots.txt', 'sitemap.xml',
  'css', 'js', 'images', 'favicons', 'output/pdf'];
const allowed = new Set();

async function inventory(relative) {
  const stat = await lstat(path.join(root, relative));
  if (stat.isSymbolicLink()) throw new Error(`Symlinks are not public build inputs: ${relative}`);
  allowed.add(relative);
  if (stat.isDirectory()) {
    for (const name of await readdir(path.join(root, relative))) {
      if (!name.startsWith('.')) await inventory(path.join(relative, name));
    }
  }
}
for (const input of inputs) await inventory(input);
allowed.add('output');

// A stale or manually copied file must never silently become public.
async function checkOutput(relative = '') {
  for (const name of await readdir(path.join(output, relative))) {
    const entry = path.join(relative, name);
    if (!allowed.has(entry)) throw new Error(`Unexpected build output; inspect before removing: ${entry}`);
    const stat = await lstat(path.join(output, entry));
    if (stat.isSymbolicLink()) throw new Error(`Unexpected output symlink: ${entry}`);
    if (stat.isDirectory()) await checkOutput(entry);
  }
}

const footer = (await readFile(path.join(root, 'footer.html'), 'utf8')).trim();
for (const page of pages) {
  const html = await readFile(path.join(root, `${page}.html`), 'utf8');
  if (!html.includes(footer)) throw new Error(`Shared footer differs in ${page}.html`);
  if (/NUSA Shared Drive|href="education(?:["#])/.test(html)) {
    throw new Error(`Private source or removed curriculum link in ${page}.html`);
  }
}
await mkdir(output, { recursive: true });
await checkOutput();
for (const input of inputs) {
  await cp(path.join(root, input), path.join(output, input), {
    recursive: true,
    filter: source => !path.basename(source).startsWith('.')
  });
}
await checkOutput();
console.log(`Built ${pages.length} public pages and approved assets into dist/.`);
