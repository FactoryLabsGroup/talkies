# Talkies

Meet a stranger. Earn your words. Live at **https://factorylabs.app/talkies/**

Two random strangers climb four steps, and each step needs both of them to agree:

1. **Wordless:** GIFs only. After a minute, once each has sent 3 GIFs, they can switch to text.
2. **In words:** text and GIFs. After 90 seconds, once each has sent 5 messages, they can turn on voice.
3. **By voice:** voice messages, recorded in the browser and sent peer to peer. After 45 seconds, once each has sent one, they can swap contacts.
4. **Introduced:** each types a contact (Instagram, Telegram…). Nothing is sent until both have entered theirs, then both appear at the same time.

The numbers live in `STAGES` at the top of `app.js`. [DESIGN.md](DESIGN.md) holds the earlier, longer concept.

## How it works

- Static site, no build step and no backend. GitHub Pages serves it as is.
- Players connect browser to browser over WebRTC ([Trystero](https://github.com/dmotz/trystero), bundled in `vendor/`). Public Nostr relays are used only to find each other.
- English and Georgian, picked from the browser language, with a toggle on the landing page.

## Files

| File | What it does |
|---|---|
| `index.html` | All screens: landing, search, invite, match, end |
| `style.css` | Look and feel (dark only) |
| `app.js` | Match: the four steps, GIF picker, chat, voice messages, contact swap, end card |
| `net.js` | Lobby, matchmaking handshake, and the channels messages and voice go through |
| `i18n.js` | English and Georgian text |
| `config.js` | Name, URL, GIPHY key, TURN servers |

## Settings (`config.js`)

- **GIPHY_API_KEY:** create a free key at developers.giphy.com and paste it in. Without a key, the picker shows Google's animated emoji instead.
- **TURN:** add a TURN server if some players can't connect (strict networks).

## Run locally

```bash
python3 -m http.server 8765
```

Open two tabs at `http://localhost:8765/?fast` and press *Find a stranger* in both. `?fast` shortens every step to 10 seconds and one message each for testing, and `?lang=en` / `?lang=ka` forces a language.
