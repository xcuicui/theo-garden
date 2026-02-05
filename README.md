# theo-garden

Aggregator site for Theo (GitHub Pages).

## Pages

- `/` entry
- `/simple/` Theo 的小花园
- `/greeting/` 小问候
- `/notes/` Theo 的碎碎念收纳处

## Storage repo

`/notes/` reads/writes to a separate private repo:
- `xcuicui/theo-notes` (branch `main`)

Data layout:
- `notes/index.json`
- `notes/YYYY-MM-DD/entries.json`
- `notes/YYYY-MM-DD/images/...`

## Token gate

`/notes/` uses a 4-digit passcode to decrypt an encrypted token file (`notes/gh-token.enc.json`).
This is obfuscation, not strong security.
