# Talkies

Meet a stranger. Earn your words. Live at **https://factorylabs.app/talkies/**

Two random strangers start with GIFs only. After a minute they can switch to text, but only if both agree. [DESIGN.md](DESIGN.md) holds the earlier, longer concept.

## How it works

- Static site, no build step and no backend. GitHub Pages serves it as is.
- Players connect browser to browser over WebRTC ([Trystero](https://github.com/dmotz/trystero), bundled in `vendor/`). Public Nostr relays are used only to find each other.
- English and Georgian, picked from the browser language, with a toggle on the landing page.

## Files

| File | What it does |
|---|---|
| `index.html` | All screens: landing, search, invite, match, end |
| `style.css` | Look and feel (dark only) |
| `app.js` | Match: GIF picker, countdown to text, consent, chat, end card |
| `net.js` | Lobby and matchmaking handshake |
| `i18n.js` | English and Georgian text |
| `config.js` | Name, URL, GIPHY key, TURN servers |

## Settings (`config.js`)

- **GIPHY_API_KEY:** create a free key at developers.giphy.com and paste it in. Without a key, the picker shows Google's animated emoji instead.
- **TURN:** add a TURN server if some players can't connect (strict networks).

## Run locally

```bash
python3 -m http.server 8765
```

Open two tabs at `http://localhost:8765/?fast` and press *Find a stranger* in both. `?fast` shortens the GIF-only part to 10 seconds for testing, and `?lang=en` / `?lang=ka` forces a language.
