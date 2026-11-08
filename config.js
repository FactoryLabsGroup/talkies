export const CONFIG = {
  // Name and public address. Change both here to rename the app.
  BRAND: 'Talkies',
  URL: 'https://factorylabs.app/talkies/',

  // Free key from https://developers.giphy.com/dashboard/ (Create an App → API).
  // Left empty, stage 3 uses Google's animated emoji GIFs instead.
  GIPHY_API_KEY: 'jjXHceyxyVgAsEeqoxpw1gyssOsWEEDz',

  // Optional TURN servers for networks that block direct peer-to-peer, e.g.
  // [{ urls: 'turn:turn.example.com:3478', username: 'u', credential: 'p' }]
  TURN: [],

  // Bump to start a fresh lobby when the protocol changes, so old tabs don't mix in.
  LOBBY: 'lobby-v4',
}
