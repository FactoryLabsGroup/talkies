# Talkies

Meet a stranger. Earn your words. Live at **https://factorylabs.app/talkies/**

Two random strangers climb five steps, and each step needs both of them to agree:

1. **Wordless:** GIFs only. After a minute, once each has sent 3 GIFs, they can switch to text.
2. **In words:** text, GIFs and photos. Photos go peer to peer and arrive blurred until tapped. After 90 seconds, once each has sent 5 messages, they can turn on voice.
3. **By voice:** voice messages only, no typing. After 45 seconds, once each has sent one, they can turn on video.
4. **Face to face:** video call only. Nobody's camera turns on by itself, and the other person's video stays blurred until you tap it, again every time their camera comes back. After a minute they can swap contacts, with or without video.
5. **Introduced:** everything is open again, and each can type a contact (Instagram, Telegram…). Nothing is sent until both have entered theirs, then both appear at the same time.

Players don't see the timers or the steps ahead: the sidebar (a row of circles on phones) lists only the steps reached so far plus a "?" that starts moving when the next one is close, and the consent bar names the next step once it can be opened.

Photos can be sent with the button, pasted, or dropped onto the chat. Leaving a chat by the logo, the back button or closing the tab asks first; "Next stranger" doesn't.

The numbers live in `STAGES` at the top of `app.js`.

Everyone can set a name, a gender and a photo from the profile button at the top. All three are optional, saved in the browser only, and shown to the stranger from the start. Without a photo, a face is drawn from a seed that both screens share. [DESIGN.md](DESIGN.md) holds the earlier, longer concept.

## How it works

- Static site, no build step and no backend. GitHub Pages serves it as is.
- Players connect browser to browser over WebRTC ([Trystero](https://github.com/dmotz/trystero), bundled in `vendor/`). Public Nostr relays are used only to find each other.
- English and Georgian, picked from the browser language, with a toggle on the landing page.

## Files

| File | What it does |
|---|---|
| `index.html` | All screens: landing, search, invite, match, end |
| `style.css` | Look and feel (dark only) |
| `app.js` | Match: the five steps, GIF picker, chat, voice messages, video call, contact swap, avatars, end card |
| `net.js` | Lobby, matchmaking handshake, and the channels messages, voice and video go through |
| `i18n.js` | English and Georgian text |
| `config.js` | Name, URL, GIPHY key, TURN servers |

## Settings (`config.js`)

- **GIPHY_API_KEY:** create a free key at developers.giphy.com and paste it in. Without a key, the picker shows Google's animated emoji instead.
- **TURN:** add a TURN server if some players can't connect (strict networks). Video needs it more often than text, since it carries much more data.

## Run locally

```bash
python3 -m http.server 8765
```

Open two tabs at `http://localhost:8765/?fast` and press *Find a stranger* in both. To give each tab its own profile, open the second one at `http://127.0.0.1:8765/?fast` instead (a different address keeps its own saved data). `?fast` shortens every step to 10 seconds and one message each for testing, and `?lang=en` / `?lang=ka` forces a language.
