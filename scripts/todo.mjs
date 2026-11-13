// Lists everything on the site that still needs your input: `npm run todo`
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
let count = 0;
const say = (where, what) => {
  count++;
  console.log(`  - ${where}: ${what}`);
};
const marker = /placeholder: true|data-placeholder|20XX|00\+|Caption for photo|fill in/i;
const scan = (file) =>
  readFileSync(join(root, file), 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (/^\s*(\*|\/\*\*|\/\/)/.test(line)) return; // skip comments
      if (marker.test(line)) say(`line ${i + 1}`, line.trim().slice(0, 120));
    });

console.log('\nProfile, experience, certificates, volunteering (src/data/profile.ts):');
scan('src/data/profile.ts');

console.log('\nThe Stage (src/data/stage.ts):');
scan('src/data/stage.ts');

console.log('\nProject case studies (src/content/projects):');
const dir = join(root, 'src/content/projects');
for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const text = readFileSync(join(dir, file), 'utf8');
  const block = text.match(/^todo:\r?\n((?:\s+-.*\r?\n?)+)/m);
  if (block)
    block[1]
      .split('\n')
      .filter((l) => l.trim().startsWith('-'))
      .forEach((l) => say(file, l.trim().slice(2)));
}

console.log('\nImages to replace (same file name, the site picks them up automatically):');
console.log('  - src/assets/projects/<project>/desktop.jpg and mobile.jpg   screenshots for the 3D laptop and phone');
console.log('  - src/assets/photos/stage/stage-01.jpg ... stage-06.jpg       stage photos');

console.log(`\n${count} text items left.\n`);
