// Usage:
//   node tools/encrypt-gh-token.mjs --token "<github_pat>" --pass "1234" > notes/gh-token.enc.json
//
// Mirrors the browser-side decrypt logic in notes/index.html (PBKDF2 + AES-GCM).

import { webcrypto } from 'node:crypto';

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--token') out.token = argv[++i];
    else if (a === '--pass') out.pass = argv[++i];
    else if (a === '--iter') out.iter = Number(argv[++i]);
  }
  return out;
}

function b64(bytes) {
  return Buffer.from(bytes).toString('base64');
}

const { token, pass, iter = 150000 } = parseArgs(process.argv.slice(2));
if (!token || !pass) {
  console.error('Missing --token or --pass');
  process.exit(2);
}

const crypto = webcrypto;
const enc = new TextEncoder();

const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));

const baseKey = await crypto.subtle.importKey(
  'raw',
  enc.encode(pass),
  { name: 'PBKDF2' },
  false,
  ['deriveKey']
);

const aesKey = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' },
  baseKey,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt']
);

const pt = enc.encode(token);
const ctBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, pt);
const ct = new Uint8Array(ctBuf);

const tagLen = 16;
const ctPart = ct.slice(0, ct.length - tagLen);
const tagPart = ct.slice(ct.length - tagLen);

const out = {
  salt: b64(salt),
  iv: b64(iv),
  ct: b64(ctPart),
  tag: b64(tagPart),
  iter,
};

process.stdout.write(JSON.stringify(out, null, 2) + '\n');
