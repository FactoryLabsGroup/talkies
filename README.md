# Talkies

Meet a stranger. Earn your words. Live at **https://factorylabs.app/talkies/**

Two random strangers start with emoji only, then unlock title cards, GIFs, a 3-word whisper, and finally free text by taking turns. See [DESIGN.md](DESIGN.md) for the full concept.

## How it works

- Static site, no build step and no backend. GitHub Pages serves it as is.
- Players connect browser to browser over WebRTC ([Trystero](https://github.com/dmotz/trystero), bundled in `vendor/`). Public Nostr relays are used only to find each other.
- English and Georgian, picked from the browser language, with a toggle on the landing page.

## Files

| File | What it does |
|---|---|
| `index.html` | All four screens |
| `style.css` | Look and feel, light and dark |
| `app.js` | Game: stages, volleys, fuse, jinx, composer, postcard |
| `net.js` | Lobby and matchmaking handshake |
| `i18n.js` | English and Georgian text, phrasebook |
| `config.js` | Name, URL, GIPHY key, TURN servers |

## Settings (`config.js`)

- **GIPHY_API_KEY:** create a free key at developers.giphy.com and paste it in. Without a key, stage 3 uses Google's animated emoji.
- **TURN:** add a TURN server if some players can't connect (strict networks).

## Run locally

```bash
python3 -m http.server 8765
```

Open two tabs at `http://localhost:8765/?fast` and press *Find a stranger* in both. `?fast` lowers the unlock thresholds for testing, and `?lang=en` / `?lang=ka` forces a language.
