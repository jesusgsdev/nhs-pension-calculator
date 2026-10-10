// Turns a vitest json-summary report into a shields.io "endpoint" badge payload.
import { readFileSync, writeFileSync } from 'node:fs';

const [summaryPath, outPath] = process.argv.slice(2);
const pct = JSON.parse(readFileSync(summaryPath, 'utf8')).total.lines.pct;
const color = pct >= 90 ? 'brightgreen' : pct >= 80 ? 'green' : pct >= 70 ? 'yellow' : pct >= 50 ? 'orange' : 'red';

writeFileSync(outPath, JSON.stringify({ schemaVersion: 1, label: 'coverage', message: `${pct}%`, color }) + '\n');
console.log(`Coverage badge: ${pct}% (${color})`);
