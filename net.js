// Peer-to-peer lobby + matchmaking on top of Trystero (WebRTC, Nostr relays for discovery only).
// Everyone on the site sits in one lobby room. People who are searching pair up with a
// three-step handshake: propose → accept → confirm. Game messages then go only to the partner.
// Private invites skip the lobby: both people join a room named after a secret code from the
// link, and whoever shows up there first becomes the partner. Voice messages go through their
// own action, as binary data with a small metadata object.

import { joinRoom, selfId } from './vendor/trystero.js'
import { CONFIG } from './config.js?v=15'

const APP_ID = 'factorylabs-talkies'
const HANDSHAKE_MS = 3000
const REMATCH_AFTER_MS = 6000
const STATUSES = ['idle', 'search', 'busy']

const nonce = () => Math.random().toString(36).slice(2, 10)

export class Net {
  constructor(handlers) {
    this.h = handlers          // { onCount(n), onMatch(partnerId, isHost), onGame(msg), onVoice(data, meta), onPartnerGone() }
    this.id = selfId
    this.status = 'idle'
    this.peers = new Map()     // peerId → status
    this.recent = new Set()    // partners already met this session
    this.searchSince = 0
    this.pending = null        // my outgoing proposal { to, n, t }
    this.reserved = null       // incoming proposal I accepted { by, n, t }
    this.partner = null
    this.timer = null
    this.priv = null           // private invite room { room, g }
    this.game = null           // the action game messages go through (lobby or private)
    this.voice = null          // and the one voice messages go through
  }

  start() {
    const cfg = this.cfg = { appId: APP_ID }
    if (CONFIG.TURN?.length) cfg.turnConfig = CONFIG.TURN
    // Local copies (localhost) use their own lobby so testing never pairs with real visitors.
    const local = /^(localhost|127\.|\[::1\])/.test(location.hostname)
    this.room = joinRoom(cfg, CONFIG.LOBBY + (local ? '-dev' : ''))
    this.st = this.room.makeAction('st')
    this.mm = this.room.makeAction('mm')
    this.g = this.game = this.room.makeAction('g')
    this.v = this.voice = this.room.makeAction('v')

    this.room.onPeerJoin = id => {
      this.peers.set(id, 'idle')
      this.st.send(this.status, { target: id })
      this.count()
    }
    this.room.onPeerLeave = id => {
      this.peers.delete(id)
      if (this.pending?.to === id) this.pending = null
      if (this.reserved?.by === id) this.reserved = null
      this.count()
      if (id === this.partner) {
        this.partner = null
        this.h.onPartnerGone()
      }
    }
    this.st.onMessage = (s, { peerId }) => {
      if (STATUSES.includes(s)) { this.peers.set(peerId, s); this.count() }
    }
    this.mm.onMessage = (m, { peerId }) => this.onHandshake(m, peerId)
    this.g.onMessage = (m, { peerId }) => this.receive(m, peerId, this.g)
    this.v.onMessage = (d, { peerId, metadata }) => this.receiveVoice(d, metadata, peerId, this.v)
  }

  receiveVoice(data, meta, peerId, via) {
    if (peerId === this.partner && via === this.voice) this.h.onVoice?.(data, meta)
  }

  receive(m, peerId, via) {
    const mine = peerId === this.partner && via === this.game
    this.h.onDebug?.('←', m, mine, peerId)
    if (mine && m && typeof m === 'object') this.h.onGame(m)
  }

  // Join (or create) the private room for an invite code and wait for the other person.
  openPrivate(code) {
    this.stopSearch()
    this.setStatus('busy')
    const room = joinRoom(this.cfg, 'invite-' + code)
    const g = room.makeAction('g'), v = room.makeAction('v')
    g.onMessage = (m, { peerId }) => this.receive(m, peerId, g)
    v.onMessage = (d, { peerId, metadata }) => this.receiveVoice(d, metadata, peerId, v)
    room.onPeerJoin = id => { if (!this.partner && this.priv?.room === room) this.begin(id, g, v) }
    room.onPeerLeave = id => {
      if (id === this.partner && this.game === g) { this.partner = null; this.h.onPartnerGone() }
    }
    this.priv = { room, g }
  }

  closePrivate() {
    if (!this.priv) return
    try { this.priv.room.leave() } catch {}
    this.priv = null
  }

  count() { this.h.onCount(this.peers.size + 1) }

  setStatus(s) {
    this.status = s
    this.st.send(s)
  }

  search() {
    this.setStatus('search')
    this.searchSince = Date.now()
    clearInterval(this.timer)
    this.timer = setInterval(() => this.tick(), 600)
  }

  stopSearch() {
    clearInterval(this.timer)
    this.pending = this.reserved = null
    this.closePrivate()
    this.setStatus('idle')
  }

  tick() {
    if (this.status !== 'search') return
    const now = Date.now()
    if (this.pending && now - this.pending.t > HANDSHAKE_MS) this.pending = null
    if (this.reserved && now - this.reserved.t > HANDSHAKE_MS) this.reserved = null
    if (this.pending || this.reserved) return
    if (Math.random() < 0.3) return // jitter so two searchers don't always collide
    const searching = [...this.peers].filter(([, s]) => s === 'search').map(([id]) => id)
    const fresh = searching.filter(id => !this.recent.has(id))
    // Prefer someone new. If nobody new turns up for a few seconds, meet an old partner again.
    const candidates = fresh.length ? fresh : now - this.searchSince > REMATCH_AFTER_MS ? searching : []
    if (!candidates.length) return
    const to = candidates[Math.floor(Math.random() * candidates.length)]
    this.pending = { to, n: nonce(), t: now }
    this.mm.send({ k: 'p', n: this.pending.n }, { target: to })
  }

  onHandshake(m, from) {
    if (!m || typeof m.n !== 'string') return
    const reply = k => this.mm.send({ k, n: m.n }, { target: from })

    if (m.k === 'p') {
      const free = this.status === 'search' && !this.reserved
      // Two people proposing to each other at once: the higher id gives way and accepts.
      const crossed = this.pending?.to === from && this.id > from
      if (free && (!this.pending || crossed)) {
        this.pending = null
        this.reserved = { by: from, n: m.n, t: Date.now() }
        reply('a')
      } else reply('n')
    } else if (m.k === 'a') {
      if (this.pending?.n === m.n && this.pending.to === from && this.status === 'search') {
        reply('c')
        this.begin(from)
      } else reply('n')
    } else if (m.k === 'c') {
      if (this.reserved?.n === m.n && this.reserved.by === from) this.begin(from)
      else this.g.send({ t: 'bye' }, { target: from })
    } else if (m.k === 'n') {
      if (this.pending?.n === m.n) this.pending = null
      if (this.reserved?.n === m.n) this.reserved = null
    }
  }

  begin(partner, via = this.g, voice = this.v) {
    clearInterval(this.timer)
    this.pending = this.reserved = null
    this.partner = partner
    this.game = via
    this.voice = voice
    this.recent.add(partner)
    this.setStatus('busy')
    this.h.onMatch(partner, this.id < partner)
  }

  send(msg) {
    this.h.onDebug?.('→', msg, !!this.partner, this.partner)
    if (this.partner) this.game.send(msg, { target: this.partner })
  }

  sendVoice(data, meta) {
    if (this.partner) return this.voice.send(data, { target: this.partner, metadata: meta })
  }

  endMatch() {
    this.partner = null
    this.game = this.g
    this.voice = this.v
    this.closePrivate()
    this.setStatus('idle')
  }
}
