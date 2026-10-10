import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = (name) => readFileSync(new URL('./' + name, import.meta.url), 'utf8');

test('illustrated alpha includes three upgrade hotspots and a battle stage', () => {
  const html = read('index.html');
  for (const key of ['mine','forge','tavern']) {
    assert.match(html, new RegExp('data-upgrade="' + key + '"'));
  }
  assert.match(html, /id="battleStage"/);
  assert.match(html, /visuals\.js/);
  assert.match(html, /visuals\.css/);
});
test('both custom images are local SVG with descriptive alternative text', () => {
  const html = read('index.html');
  for (const name of ['haven-scene.svg', 'glimmerfen-battle.svg']) {
    const svg = read('assets/' + name);
    assert.match(html, new RegExp('assets/' + name.replace('.', '\\.')));
    assert.match(svg, /<svg [^>]*viewBox=/);
    assert.match(svg, /<title/);
    assert.doesNotMatch(svg, /<(?:script|foreignObject)\b/i);
    assert.doesNotMatch(svg, /(?:href|src)="https?:/i);
  }
  assert.match(html, /alt="An original painted 2D/);
  assert.match(html, /alt="Original painted encounter/);
});
test('alpha remains a test, not a claim of a finished APK', () => {
  const html = read('index.html');
  assert.match(html, /not the finished Unity Android APK/i);
});
