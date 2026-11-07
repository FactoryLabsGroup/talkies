# Talkies — design

**factorylabs.app/talkies**

> Meet a stranger. Earn your words.
> Every chat starts as a silent film.

In the 1920s, films were silent. Actors talked with faces and gestures, and a few words appeared on title cards. Then came the *talkies*. Talkies replays that history in three minutes, between two strangers.

---

## 1. The concept, sharpened

It isn't chat with restrictions. It's a **two-player co-op game where the prize is the ability to talk.**

- You never pick who you meet. You never see a face. You never type a name.
- You start silent, with emoji only. Every real back-and-forth fills a shared meter.
- Fill it, and you both unlock a richer way to talk at the same moment.
- A burning **fuse** keeps every match short and alive. Go quiet and the spark dies.
- When it ends you get **The end** card: the emoji story of your minutes together.

| # | Stage | You can use | Unlock rule |
|---|---|---|---|
| 1 | 😶 **Silent** | 40 emoji, reactions | start |
| 2 | 🔤 **Title cards** | + 26 phrases, auto-translated | 4 volleys |
| 3 | 🎞️ **Reels** | + GIFs | 5 volleys |
| 4 | 🤫 **Whisper** | + 3 words of text (letters only) | 5 volleys |
| 5 | 🗣️ **Talkie** | free text | 6 volleys **and both tap "I'm in"** |

Earlier tools stay unlocked, so one late message can mix everything: `🙋 + "I'm hungry" + 🍕 + GIF + "pizza tonight"`.

## 2. Unlock mechanics

- **Volley.** The only currency: *my message, then your reply*. Five messages in a row from one person count as nothing. Turn-taking is the core loop, and that's what a conversation is.
- **Jinx.** A prompt drops in (`🐶 or 🐱?`). Both of you pick in secret, then the picks are shown together. Same pick? **Jinx!** Confetti, +2 spark, +10 s on the fuse. A different pick still earns +1, because you both played. Every match opens with a jinx, so nobody stares at an empty screen.
- **Sentence builder.** Messages are built from tiles, up to 5: emoji, title cards, a GIF, and later a few words. It plays like fridge-magnet poetry.
- **Consent gate.** Free text opens only when *both* players tap "I'm in".
- **Unlock moment.** A full-screen color flash, the new tool slides in, and the fuse refills. That's the dopamine hit.

## 3. Fair, mutual progression

- One **shared** meter, one shared stage. There's no "my level".
- Only *alternating* turns score. Spamming does nothing. A silent partner can't be carried.
- One side (the lower peer ID) keeps the score and syncs it, so both screens always agree.
- Sends are rate-limited (1 per 0.6 s). Jinx bonuses need both picks. Free text needs both consents.

## 4. Killing boring matches

- **The fuse:** 45 s to start. Each volley adds 15 s (cap 60 s, or 90 s once text unlocks). A jinx adds 10 s. At zero the match ends for both: "The spark fizzled 💨". Dead matches end on their own, so nobody has to feel rude.
- **Auto-icebreaker:** after 10 s without activity, a jinx appears.
- **Next** is always one tap, and you won't meet that person again this session.
- **Short by design:** the whole ladder takes about 3 minutes, so you leave wanting one more round.

## 5. Fun without a shared language

- **Title cards translate themselves.** Phrases travel as IDs, not text, so each screen shows its own language. A Georgian player taps „გამარჯობა“ and the English player sees "Hi 🌐".
- Emoji, GIFs, and jinx prompts need no language at all. Typed text only shows up at stages 4–5, once rapport exists.
- **Curiosity chip:** the stranger's flag (from their time zone), their language, and *their* local time with a sky icon: `🇬🇪 ქართული · 🌙 02:14`. "It's 2 a.m. for them" starts conversations by itself.
- Languages: **English** and **Georgian**. Adding more only means adding data to `i18n.js`.

## 6. Unexpected, memorable bits

**In the MVP**
- **Jinx** rounds: two players, one secret pick, one reveal.
- **The end** card: a cinema end card with the stage reached, time, volleys, jinxes, and the emoji story strip. One tap to share.
- **Title cards** styled like silent-film intertitles: black, a thin cream frame.
- **Their local time** with a day/night sky.
- **Tap a bubble to react** (❤️ 😂 😮 👀). A reaction counts as a reply.
- A **fuse** that burns visibly and shakes in the last 10 s.

**Later, only if the MVP sticks**
- **Daily cast:** each day everyone gets the same odd emoji set (only 🦆🥒🎺🌋…).
- **Message in a bottle:** when a fuse dies, leave one tile for the next stranger who matches.
- **Premiere night:** a weekly hour when everyone online gets matched at once, with a live counter.
- **Charades stage:** one player gets a secret word and acts it out with emoji until the other guesses.
- **Your filmography:** a local-only strip of past end cards, stored in the browser.

## 7. The simplest MVP (this repo)

- A static site on GitHub Pages: plain HTML, CSS, and JS. No build step, no backend, no accounts, no cookies.
- **Peer-to-peer** over WebRTC with [Trystero](https://github.com/dmotz/trystero). Public Nostr relays are used only for discovery. Messages go browser to browser, encrypted, and are never stored.
- **Matchmaking:** everyone joins one lobby room. Searchers pair up with a 3-step handshake (propose → accept → confirm).
- **GIFs:** GIPHY search when `config.js` has a key. Without one, Google's animated Noto emoji, so stage 3 works on day one.
- **Safety:** GIFs are rendered only from GIPHY or Google URLs, links in text are hidden, Whisper blocks digits and symbols, free text needs both consents, and the landing page says "18+ · be kind".

**Known limits, and how to grow past them**
- One mesh lobby works up to roughly 50 people online at once. Past that, move matchmaking to a tiny server (a Cloudflare Durable Object or Supabase Realtime) and keep the game code as is.
- About 10–15% of networks block direct P2P. Fix: add a TURN server (Cloudflare has a free tier) in `config.js`.
- There's no report queue without a backend. "Next" blocks that person for the session.

## 8. User flow and interface

```
Landing ──tap──▶ Searching ──match──▶ Match ──fuse out / they leave──▶ The end ──tap──▶ Searching
                    ▲                    │
                    └──── Next (skip) ───┘
```

- **Landing:** speech-bubble logo with film sprockets, the `talkies` wordmark, one line, one fat button (*Find a stranger*), `● 7 people here now`, and `18+ · be kind · nothing is saved`. That's all.
- **Searching:** a wobbling speech bubble cycling through faces. After 20 s: "It's quiet right now" plus *Invite someone*.
- **Match:** one screen, mobile first. From top to bottom: the stranger chip and *Next*, the fuse, the 5-stage ladder, the feed (bubbles, jinx cards), the spark meter, the sentence tray with Send, the tool tabs (locked ones visible), and the picker.
- **Unlock:** a full-screen flash in the stage color, a big icon, and "Unlocked · Reels · GIFs".
- **The end:** a black intertitle card with "The end", the reason, both avatars, the stage reached, stats, the story strip, then *Next stranger* and *Share*.

## 9. Brand

- **Name:** **Talkies**. Short, warm, and the story is built in (silent film → sound).
- **Tagline:** "Meet a stranger. Earn your words." Secondary line: "Every chat starts as a silent film."
- **Logo:** a coral speech bubble with film sprocket holes and three blinking dots.
- **Palette:** warm paper `#FFF4E2`, ink `#16130F`, coral `#FF5A36`. Stage colors: lemon `#FFD23F` · mint `#3DDC97` · sky `#4CC9F0` · violet `#9B5DE5` · coral. Dark mode flips paper and ink.
- **Type:** Bricolage Grotesque (Latin) and Noto Sans Georgian.
- **Feel:** chunky rounded shapes with hard offset shadows, springy motion, and silent-film details (intertitle cards, "The end").
- **Voice:** curious, cheeky, short. Never flirty, never "find your match".
