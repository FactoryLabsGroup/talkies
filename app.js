import { CONFIG } from './config.js?v=14'
import { STR, LANGS } from './i18n.js?v=14'
import { Net } from './net.js?v=14'

// Talkies: two strangers climb four steps: GIFs only, then words, then voice messages, then
// swapping contacts. A step opens once enough time has passed and both have sent enough of the
// current kind of message, and only if both agree.

// ---------------------------------------------------------------- content

const FAST = new URLSearchParams(location.search).has('fast')
// kind: which messages count toward opening the next step ('g' GIF, 'w' text, 'v' voice).
// need: how many of them each side sends. time: how long the step lasts at least.
const STAGES = [null,
  { kind: 'g', need: FAST ? 1 : 3, time: FAST ? 10000 : 60000 },
  { kind: 'w', need: FAST ? 1 : 5, time: FAST ? 10000 : 90000 },
  { kind: 'v', need: 1, time: FAST ? 10000 : 45000 },
  { last: true },
]
const LAST = STAGES.length - 1
const TEXT_MAX = 300
const VOICE_MAX = 30000          // longest voice message, ms
const VOICE_BYTES = 800 * 1024   // and the largest file accepted
const CONTACT_MAX = 40
const AVATARS_HUE = () => Math.floor(Math.random() * 360)
const REACTIONS = ['❤️', '😂', '😮', '👀']
// Quick GIF searches. The label is shown in the player's language; the search runs in English,
// where GIPHY has the best results.
const GIF_CHIPS = [['Hi', 'გამარჯობა', 'hello'], ['Haha', 'ჰაჰა', 'laugh'], ['Wow', 'ვაა', 'wow'], ['Yes', 'კი', 'yes'],
  ['No', 'არა', 'no'], ['What?', 'რა?', 'confused'], ['Love it', 'მომწონს', 'love it'], ['Bye', 'ნახვამდის', 'bye']]
// Animated Noto emoji (Google): the GIF fallback when there's no GIPHY key.
const NOTO = ['1f602', '1f60d', '1f62d', '1f631', '1f92f', '1f973', '1f60e', '1f914', '1f644', '1f634', '1f480', '1f525',
  '2764_fe0f', '1f44b', '1f44f', '1f64f', '1f483', '1f389', '1f680', '1f648']
const notoUrl = code => `https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/512.webp`
const GIF_OK = /^https:\/\/(media\d?\.giphy\.com|i\.giphy\.com|fonts\.gstatic\.com\/s\/e\/notoemoji)\//

const TZ_CC = Object.fromEntries(('Asia/Tbilisi GE,Europe/London GB,Europe/Dublin IE,Europe/Paris FR,Europe/Berlin DE,' +
  'Europe/Madrid ES,Europe/Rome IT,Europe/Amsterdam NL,Europe/Brussels BE,Europe/Zurich CH,Europe/Vienna AT,' +
  'Europe/Stockholm SE,Europe/Oslo NO,Europe/Copenhagen DK,Europe/Helsinki FI,Europe/Warsaw PL,Europe/Prague CZ,' +
  'Europe/Budapest HU,Europe/Bucharest RO,Europe/Sofia BG,Europe/Athens GR,Europe/Istanbul TR,Europe/Kiev UA,' +
  'Europe/Kyiv UA,Europe/Moscow RU,Europe/Minsk BY,Europe/Lisbon PT,Europe/Riga LV,Europe/Vilnius LT,' +
  'Europe/Tallinn EE,Europe/Belgrade RS,Europe/Zagreb HR,Asia/Yerevan AM,Asia/Baku AZ,Asia/Dubai AE,' +
  'Asia/Riyadh SA,Asia/Jerusalem IL,Asia/Tehran IR,Asia/Kolkata IN,Asia/Calcutta IN,Asia/Shanghai CN,' +
  'Asia/Hong_Kong HK,Asia/Tokyo JP,Asia/Seoul KR,Asia/Singapore SG,Asia/Bangkok TH,Asia/Jakarta ID,' +
  'Asia/Manila PH,Asia/Kuala_Lumpur MY,Asia/Ho_Chi_Minh VN,Asia/Almaty KZ,Asia/Tashkent UZ,Asia/Karachi PK,' +
  'Australia/Sydney AU,Australia/Melbourne AU,Australia/Perth AU,Pacific/Auckland NZ,America/New_York US,' +
  'America/Chicago US,America/Denver US,America/Los_Angeles US,America/Phoenix US,America/Anchorage US,' +
  'Pacific/Honolulu US,America/Toronto CA,America/Vancouver CA,America/Mexico_City MX,America/Sao_Paulo BR,' +
  'America/Argentina/Buenos_Aires AR,America/Bogota CO,America/Lima PE,America/Santiago CL,Africa/Cairo EG,' +
  'Africa/Lagos NG,Africa/Johannesburg ZA,Africa/Nairobi KE,Africa/Casablanca MA').split(',').map(s => s.split(' ')))

// ---------------------------------------------------------------- icons (line icons, 24px grid)

const SVG = (p, w = 2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`
const ICONS = {
  arrow: SVG('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'),
  send: SVG('<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>', 2.2),
  skip: SVG('<path d="m6 5 9 7-9 7z"/><path d="M18 5v14"/>'),
  lock: SVG('<rect x="4.5" y="11" width="15" height="10" rx="2"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>'),
  check: SVG('<path d="M20 6 9 17l-5-5"/>', 2.5),
  link: SVG('<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>'),
  share: SVG('<path d="M12 3v12"/><path d="m7 8 5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>'),
  search: SVG('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  s1: SVG('<rect x="2.5" y="5" width="19" height="14" rx="3.5"/><text x="12" y="15.2" text-anchor="middle" font-size="7.2" font-weight="800" fill="currentColor" stroke="none" font-family="Inter, system-ui, sans-serif">GIF</text>', 1.6),
  s2: SVG('<path d="M20 15.5a2 2 0 0 1-2 2H8l-4 3.5V5.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>'),
  s3: SVG('<rect x="9" y="2.5" width="6" height="11.5" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21"/>'),
  s4: SVG('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/>'),
  play: SVG('<path d="M7.5 4.8v14.4L19 12z" fill="currentColor"/>'),
  pause: SVG('<path d="M8.5 5v14M15.5 5v14"/>', 3),
  x: SVG('<path d="M18 6 6 18M6 6l12 12"/>'),
}
function icon(name, cls = 'ico') {
  const s = document.createElement('span')
  s.className = cls
  s.innerHTML = ICONS[name] || ''
  return s
}
function hydrateIcons() {
  document.querySelectorAll('[data-icon]').forEach(el => { if (!el.firstElementChild) el.innerHTML = ICONS[el.dataset.icon] || '' })
}

// ---------------------------------------------------------------- helpers

const $ = s => document.querySelector(s)
const pick = a => a[Math.floor(Math.random() * a.length)]
const rid = () => Math.random().toString(36).slice(2, 9)
const now = () => Date.now()
function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue
    if (k === 'class') el.className = v
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v)
    else el.setAttribute(k, v === true ? '' : v)
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid)
  return el
}
const flagOf = cc => (/^[A-Z]{2}$/.test(cc || '') ? String.fromCodePoint(...[...cc].map(c => 0x1f1e6 + c.charCodeAt(0) - 65)) : '')
const myTz = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || '' } catch { return '' } })()
const myRegion = TZ_CC[myTz] || ((navigator.language || '').split('-')[1] || '').toUpperCase()
const mmss = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` }
const clock = ms => mmss(Math.floor(Math.max(0, ms) / 1000) * 1000)   // elapsed time, rounded down
const dim = n => (Number.isFinite(+n) && +n > 0 ? Math.min(2000, Math.round(+n)) : 0)
function hideLinks(s) {
  return s.replace(/(https?:\/\/|www\.)\S+|\b[\w-]+\.(com|net|org|io|me|app|ge|ru|co|gg|ly|tv|xyz|link|site)\b\S*/gi, '🔗 ' + t('link_hidden'))
}
const vibrate = ms => { try { if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(ms) } catch {} }
function localTime(tz) {
  try {
    return new Intl.DateTimeFormat(lang === 'ka' ? 'ka-GE' : 'en-US', { hour: 'numeric', minute: '2-digit', hourCycle: lang === 'ka' ? 'h23' : 'h12', timeZone: tz || undefined }).format(new Date())
  } catch { return '' }
}

// ---------------------------------------------------------------- language

let lang = (() => {
  const q = new URLSearchParams(location.search).get('lang')
  if (LANGS.includes(q)) return q
  try { const s = localStorage.getItem('lang'); if (LANGS.includes(s)) return s } catch {}
  return (navigator.languages || [navigator.language]).some(l => /^ka/i.test(l)) ? 'ka' : 'en'
})()
function t(key, vars) {
  let s = STR[lang][key] ?? STR.en[key] ?? key
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v)
  return s
}
// With a count: uses the `_one` version of the text for 1 when the language has one.
const tn = (key, n) => t(n === 1 && STR[lang][key + '_one'] != null ? key + '_one' : key, { n })
function applyLang() {
  document.documentElement.lang = lang
  document.querySelectorAll('[data-i]').forEach(el => (el.textContent = t(el.dataset.i)))
  document.querySelectorAll('[data-ph]').forEach(el => (el.placeholder = t(el.dataset.ph)))
  document.querySelectorAll('[data-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.aria)))
  $('#langBtn').textContent = lang === 'ka' ? 'English' : 'ქართული'
  renderChips()
  renderCount()
  startDemo()
  if (G && !G.ended) { renderAll(); renderThem() }
}
$('#langBtn').addEventListener('click', () => {
  lang = lang === 'ka' ? 'en' : 'ka'
  try { localStorage.setItem('lang', lang) } catch {}
  applyLang()
})

// ---------------------------------------------------------------- screens

function show(name) {
  document.body.dataset.screen = name
  document.querySelectorAll('.screen').forEach(s => (s.hidden = s.id !== name))
  if (name === 'landing') startDemo()
}

// ---------------------------------------------------------------- landing demo
// A looping make-believe match: a few GIFs back and forth, text opens, words, then voice opens.

const giphy = (id, w, h) => ({ gif: `https://media.giphy.com/media/${id}/200.webp`, w, h })
const W = (en, ka) => ({ text: { en, ka } })
const DEMO = [
  { who: 'them', ...giphy('xT9IgG50Fb7Mi0prBC', 200, 100) },
  { who: 'me', ...giphy('3lurIRCIRl8Hyl56TQ', 102, 100) },
  { who: 'them', ...giphy('XHeLeuirRbwptHhSWd', 134, 100) },
  { who: 'me', ...giphy('OK27wINdQS5YQ', 140, 100) },
  { unlock: 2 },
  { typing: true },
  { who: 'them', ...W('Okay, words now. Hi!', 'კარგი, ახლა სიტყვებით. გამარჯობა!') },
  { who: 'me', ...W('Hi! Great taste in GIFs', 'გამარჯობა! GIF‑ებში კარგი გემოვნება გაქვს') },
  { unlock: 3 },
  { who: 'them', voice: 7 },
]
const DEMO_WAVE = [30, 55, 80, 45, 70, 100, 60, 35, 75, 50, 90, 40, 65, 30, 55, 85, 45, 25, 50, 70]
let demoRun = 0
function startDemo() {
  const run = ++demoRun
  const feed = $('#demoFeed'), bars = [...document.querySelectorAll('#demoBar i')]
  const wait = ms => new Promise(r => setTimeout(r, ms))
  const alive = () => run === demoRun && document.body.dataset.screen === 'landing'
  ;(async () => {
    await wait(50)
    while (alive()) {
      feed.classList.remove('fade')
      feed.replaceChildren()
      bars.forEach((b, i) => b.classList.toggle('on', i === 0))
      for (const step of DEMO) {
        await wait(step.unlock ? 900 : step.typing ? 700 : 1300)
        if (!alive()) return
        feed.querySelector('.demo-typing')?.closest('.row')?.remove()
        if (step.unlock) {
          bars.forEach((b, i) => b.classList.toggle('on', i < step.unlock))
          feed.append(h('div', { class: 'demo-unlock' }, icon('s' + step.unlock), `${t('unlocked')} · ${t('s' + step.unlock)}`))
        } else if (step.typing) {
          feed.append(h('div', { class: 'row them' }, h('span', { class: 'ava', style: '--hue: 300' }),
            h('div', { class: 'bubble demo-typing' }, h('i'), h('i'), h('i'))))
        } else feed.append(demoRow(step))
        while (feed.children.length > 8) feed.firstElementChild.remove()
      }
      await wait(2800)
      if (!alive()) return
      feed.classList.add('fade')
      await wait(600)
    }
  })()
}
function demoRow({ who, gif, w, h: gh, text, voice }) {
  const height = 76
  const bubble = gif
    ? h('div', { class: 'bubble has-gif' }, h('img', { class: 'gif-msg', src: gif, width: Math.round(w * height / gh), height, alt: '', referrerpolicy: 'no-referrer' }))
    : voice ? h('div', { class: 'bubble voice' }, h('span', { class: 'vplay' }, icon('play')), wave(DEMO_WAVE), h('span', { class: 'vtime' }, clock(voice * 1000)))
    : h('div', { class: 'bubble' }, h('span', {}, text[lang]))
  return h('div', { class: `row ${who}` }, who === 'them' && h('span', { class: 'ava', style: '--hue: 300' }), bubble)
}

let online = 1
function renderCount() {
  const text = online <= 1 ? t('alone') : t('online_other', { n: online })
  document.querySelectorAll('.online').forEach(el => (el.textContent = text))
}

// ---------------------------------------------------------------- network

// ?debug shows a small panel with this tab's id, its partner, role, stage and the last messages.
const DEBUG = new URLSearchParams(location.search).has('debug')
const dbgLog = []
const short = id => (id ? String(id).slice(0, 5) : '—')
function onDebug(dir, m, ok, peer) {
  if (!DEBUG || !m || m.t === 's' && dir === '→' && dbgLog.at(-1)?.startsWith('→s')) return
  const what = m.t === 'm' ? `m[${(m.tk || []).map(x => x.k).join('')}]` : m.t
  dbgLog.push(`${dir}${what}${ok ? '' : ' ✗' + short(peer)}`)
  if (dbgLog.length > 14) dbgLog.shift()
  console.debug('[talkies]', dir, m, ok ? '' : `(not partner: ${peer})`)
  renderDebug()
}
function renderDebug() {
  if (!DEBUG) return
  let el = $('#debug')
  if (!el) { el = h('pre', { id: 'debug', class: 'debug' }); document.body.append(el) }
  const peers = [...net.peers].map(([id, s]) => `${short(id)}:${s}`).join(' ')
  el.textContent = `me ${short(net.id)} · ${G && !G.ended ? (G.host ? 'host' : 'guest') + ' · stage ' + G.view.stage : net.status}\n` +
    `partner ${short(net.partner)}\nlobby ${peers || '—'}\n` + dbgLog.join('\n')
}

const net = new Net({
  onDebug,
  onCount: n => { online = n; renderCount(); renderDebug() },
  onMatch: (partner, isHost) => startMatch(partner, isHost),
  onGame: msg => onGame(msg),
  onVoice: (data, meta) => onVoice(data, meta),
  onPartnerGone: () => endMatch('left'),
})
net.start()

// ---------------------------------------------------------------- search

let searchTimers = []
function startSearch() {
  show('search')
  $('#quiet').hidden = true
  net.search()
  stopSearchUi()
  searchTimers = [setTimeout(() => ($('#quiet').hidden = false), 20000)]
}
function stopSearchUi() { searchTimers.forEach(clearTimeout) }

$('#findBtn').addEventListener('click', startSearch)
$('#againBtn').addEventListener('click', startSearch)
$('#cancelBtn').addEventListener('click', () => { stopSearchUi(); net.stopSearch(); show('landing') })
$('#inviteBtn').addEventListener('click', () => { stopSearchUi(); startInvite() })

// ---------------------------------------------------------------- private invites
// "Invite a friend" makes a secret code, shows a link with it, and waits in a private room.
// Whoever opens the link joins the same room and the two of you are matched directly.

const CODE_ABC = 'abcdefghijkmnpqrstuvwxyz23456789'
const newCode = () => [...crypto.getRandomValues(new Uint8Array(10))].map(b => CODE_ABC[b % CODE_ABC.length]).join('')
const inviteUrl = code => `${location.origin}${location.pathname}?invite=${code}`
let joinTimer = null

function startInvite() {
  const code = newCode()
  $('#inviteLink').value = inviteUrl(code)
  $('#shareLinkBtn').hidden = !navigator.share
  show('invite')
  net.openPrivate(code)
}
$('#inviteFriendBtn').addEventListener('click', startInvite)
$('#inviteCancel').addEventListener('click', () => { net.stopSearch(); show('landing') })
$('#inviteLink').addEventListener('focus', e => e.target.select())
$('#copyBtn').addEventListener('click', async () => {
  const btn = $('#copyBtn'), input = $('#inviteLink')
  try { await navigator.clipboard.writeText(input.value) } catch { input.select(); document.execCommand?.('copy') }
  btn.textContent = t('copied')
  setTimeout(() => (btn.textContent = t('copy')), 1600)
})
$('#shareLinkBtn').addEventListener('click', async () => {
  try { await navigator.share({ title: CONFIG.BRAND, text: t('invite_share_text'), url: $('#inviteLink').value }) } catch {}
})

// Opened someone's invite link: go straight to their private room.
function joinInvite(code) {
  history.replaceState(null, '', location.pathname)
  $('#joinGone').hidden = $('#joinFind').hidden = true
  show('join')
  net.openPrivate(code)
  clearTimeout(joinTimer)
  joinTimer = setTimeout(() => {
    if (document.body.dataset.screen !== 'join') return
    $('#joinGone').hidden = $('#joinFind').hidden = false
  }, 20000)
}
$('#joinFind').addEventListener('click', () => { net.stopSearch(); startSearch() })
$('#joinCancel').addEventListener('click', () => { clearTimeout(joinTimer); net.stopSearch(); show('landing') })

async function share(text, btn) {
  const data = { title: CONFIG.BRAND, text, url: CONFIG.URL }
  try {
    if (navigator.share) return await navigator.share(data)
  } catch (e) { if (e?.name === 'AbortError') return }
  try {
    await navigator.clipboard.writeText(`${text} ${CONFIG.URL}`)
    const old = btn.textContent
    btn.textContent = t('copied')
    setTimeout(() => (btn.textContent = old), 1500)
  } catch {}
}

// ---------------------------------------------------------------- match state

let G = null   // the current match (view state, both roles)
let H = null   // host-only authoritative state: the step, its countdown, the counts and the consent

function startMatch(partner, isHost) {
  stopSearchUi()
  clearTimeout(joinTimer)
  G = {
    partner, host: isHost, them: null, theyGotMine: false, ended: false, hue: AVATARS_HUE(),
    view: { stage: 1, left: STAGES[1].time, ac: false, cons: [false, false], cnt: [0, 0] },
    leftEnd: now() + STAGES[1].time, startedAt: now(), connectedAt: 0, maxStage: 1,
    gifs: [], gifCount: 0, textCount: 0, voiceCount: 0, stageCnt: STAGES.map(() => 0),
    lastSend: 0, timers: [], gifOpen: true, urls: [],
    swap: { mine: '', theyReady: false, sentMine: false, theirs: '', done: false },
  }
  H = isHost ? { stage: 1, left: STAGES[1].time, ac: false, cons: [false, false], cnt: [0, 0], last: now(), lastPush: 0 } : null

  $('#feed').replaceChildren()
  $('#swap').replaceChildren()
  $('#textIn').value = ''
  document.querySelectorAll('#match .ava').forEach(el => el.style.setProperty('--hue', G.hue))
  document.querySelectorAll('#match .them-info').forEach(el => (el.textContent = ''))
  $('#connecting').hidden = false
  show('match')
  renderAll()

  const hello = () => {
    if (G.them && G.theyGotMine) return
    net.send({ t: 'hi', lang, tz: myTz, cc: myRegion, got: !!G.them })
  }
  hello()
  G.timers.push(setInterval(hello, 800))
  G.timers.push(setTimeout(() => { if (G && !G.them && !G.ended) abortMatch() }, 9000))
  G.timers.push(setInterval(renderThem, 15000))
  if (isHost) G.timers.push(setInterval(hostTick, 250))
  G.raf = requestAnimationFrame(drawProgress)
}

function clearMatchTimers() {
  if (!G) return
  G.timers.forEach(x => { clearInterval(x); clearTimeout(x) })
  cancelAnimationFrame(G.raf)
  stopRec(false)
  playing?.stop()
  G.urls.forEach(u => URL.revokeObjectURL(u))
}

// Connection never came up: quietly go back to searching.
function abortMatch() {
  clearMatchTimers()
  G.ended = true
  net.send({ t: 'bye' })
  net.endMatch()
  startSearch()
}

function endMatch(why) {
  if (!G || G.ended) return
  clearMatchTimers()
  G.ended = true
  net.endMatch()
  if (!G.them) return startSearch()
  renderPostcard(why)
  show('end')
  vibrate(30)
}

document.querySelectorAll('.next-btn').forEach(b => b.addEventListener('click', () => {
  if (!G || G.ended) return
  net.send({ t: 'bye' })
  clearMatchTimers()
  G.ended = true
  net.endMatch()
  startSearch()
}))
addEventListener('pagehide', () => { if (G && !G.ended) net.send({ t: 'bye' }) })

// ---------------------------------------------------------------- incoming

function onGame(m) {
  if (!G || G.ended) return
  switch (m.t) {
    case 'hi': {
      const first = !G.them
      G.them = { lang: LANGS.includes(m.lang) ? m.lang : 'en', tz: String(m.tz || '').slice(0, 40), cc: String(m.cc || '').slice(0, 2) }
      if (m.got) G.theyGotMine = true
      if (first) {
        net.send({ t: 'hi', lang, tz: myTz, cc: myRegion, got: true })
        $('#connecting').hidden = true
        G.connectedAt = now()
        G.leftEnd = now() + STAGES[1].time
        if (H) H.last = now()
        renderThem()
        addIntro()
      }
      break
    }
    case 'm': {
      // The sender already enforced its stage. Here we only check the message is safe, so a
      // brief stage mismatch between the two screens can never make a message disappear.
      if (typeof m.id !== 'string') return
      const id = m.id.slice(0, 12)
      const tk = cleanTokens(m.tk)
      if (!tk) return
      net.send({ t: 'ack', id })
      if ($('#feed').querySelector(`.row.them .bubble[data-id="${CSS.escape(id)}"]`)) return
      addBubble('them', id, tk)
      if (H) hostCount(1, tk[0].k)
      break
    }
    case 'ack': $('#feed').querySelector(`.row.me .bubble[data-id="${CSS.escape(String(m.id))}"]`)?.classList.add('sent'); break
    case 'r': if (REACTIONS.includes(m.e)) addReaction(String(m.id), m.e, 'mine'); break
    case 's': if (!H) applyState(m); break
    case 'ok': if (H && m.s === H.stage) hostConsent(1); break
    case 'cx': swapReady(); break
    case 'ch': swapContact(m.v); break
    case 'bye': endMatch('left'); break
  }
}

// ---------------------------------------------------------------- host logic

function hostTick() {
  if (!G || G.ended || !G.them) return
  const tNow = now()
  if (!STAGES[H.stage].last && H.left > 0) {
    H.left -= tNow - H.last
    if (H.left <= 0) { H.left = 0; checkReady(); push() }
  }
  H.last = tNow
  if (tNow - H.lastPush > 2000) push()
}

function push() {
  H.lastPush = now()
  const s = { t: 's', stage: H.stage, left: Math.max(0, H.left), ac: H.ac, cons: H.cons, cnt: H.cnt }
  net.send(s)
  applyState(s)
}

// The next step can be offered once the time is up and both sides have sent enough.
function checkReady() {
  const st = STAGES[H.stage]
  if (!st.last && !H.ac && H.left <= 0 && H.cnt[0] >= st.need && H.cnt[1] >= st.need) H.ac = true
}
// idx 0 = the host sent it, 1 = the guest did. Only the current step's kind of message counts.
function hostCount(idx, kind) {
  if (STAGES[H.stage].kind !== kind) return
  H.cnt = [...H.cnt]
  H.cnt[idx]++
  checkReady()
  push()
}

function hostConsent(idx) {
  if (!H.ac) return
  H.cons = [...H.cons]
  H.cons[idx] = true
  if (H.cons[0] && H.cons[1]) {
    H.stage++
    H.ac = false
    H.cons = [false, false]
    H.cnt = [0, 0]
    H.left = STAGES[H.stage].time || 0
  }
  push()
}

// ---------------------------------------------------------------- view state

// The host re-sends state every 2 s. Only redraw what changed, so a tap that lands during a
// sync is never swallowed by buttons being rebuilt under the finger.
function applyState(s) {
  const prev = G.view
  const n = i => Math.max(0, Math.min(99, Math.floor(+s.cnt?.[i] || 0)))
  const stage = Math.max(1, Math.min(LAST, Math.floor(+s.stage || 1)))
  G.view = { stage, left: Math.max(0, +s.left || 0), ac: !!s.ac && stage < LAST, cons: [!!s.cons?.[0], !!s.cons?.[1]], cnt: [n(0), n(1)] }
  G.leftEnd = now() + G.view.left
  if (stage !== prev.stage) {
    if (stage > prev.stage) {
      G.maxStage = Math.max(G.maxStage, stage)
      if (stage === 2) G.gifOpen = false
      levelUpFx(stage)
    }
    return renderAll()
  }
  if (G.view.ac !== prev.ac || String(G.view.cons) !== String(prev.cons)) renderConsent()
  if (G.view.ac !== prev.ac || String(G.view.cnt) !== String(prev.cnt)) { renderNeed(); renderLadder() }
}

function renderAll() {
  renderLadder()
  renderNeed()
  renderConsent()
  renderComposer()
}

function renderThem() {
  if (!G?.them) return
  const { tz, cc } = G.them
  const time = localTime(tz)
  let sky = ''
  try {
    const hr = +new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: tz || undefined }).format(new Date())
    sky = hr >= 5 && hr < 8 ? '🌅' : hr >= 8 && hr < 17 ? '☀️' : hr >= 17 && hr < 20 ? '🌇' : '🌙'
  } catch {}
  document.querySelectorAll('#match .them-info').forEach(el => el.replaceChildren(...[
    h('span', { class: 'flag' }, flagOf(cc) || '🌍'),
    time && h('span', { class: 'sep' }, '·'),
    time && h('span', { class: 'time' }, `${sky} ${time}`),
  ].filter(Boolean)))
}

const mineCnt = () => G.view.cnt[G.host ? 0 : 1]
const theirCnt = () => G.view.cnt[G.host ? 1 : 0]
const dots = (n, need) => h('span', { class: 'need-dots' }, Array.from({ length: need }, (_, i) => h('i', { class: i < n ? 'on' : '' })))

// The ladder in the sidebar: what's done, where you are and what it takes to go on, what's next.
function renderLadder() {
  const v = G.view
  $('#ladder').replaceChildren(...STAGES.slice(1).map((st, j) => {
    const i = j + 1
    const state = i < v.stage ? 'done' : i === v.stage ? 'now' : 'locked'
    const desc = state === 'done' ? tn('done_' + i, G.stageCnt[i]) : state === 'locked' ? t('u' + i)
      : st.last && G.swap.done ? t('swapped') : t('d' + i)
    return h('li', { class: `step-row ${state}` },
      h('span', { class: 'dot' }, icon(state === 'done' ? 'check' : state === 'locked' ? 'lock' : 's' + i)),
      h('div', { class: 'step-body' }, h('p', { class: 'name' }, t('s' + i)), h('p', { class: 'desc' }, desc),
        state === 'now' && !st.last && needCard()))
  }))
  $('#stageTitle').replaceChildren(icon('s' + v.stage), h('span', {}, t('s' + v.stage)))
  document.body.classList.toggle('text-open', v.stage >= 2)
}

// What it takes to open the next step: a count for each side and the time left.
function needCard() {
  const v = G.view, st = STAGES[v.stage]
  if (v.ac) return h('div', { class: 'need-card ready' }, h('p', { class: 'need-title' }, t('ready_' + v.stage)))
  const row = (who, n) => h('div', { class: `need-row${n >= st.need ? ' done' : ''}` }, h('span', {}, who), dots(n, st.need))
  return h('div', { class: 'need-card' },
    h('p', { class: 'need-title' }, tn('need_' + v.stage, st.need)),
    row(t('you'), mineCnt()), row(t('stranger'), theirCnt()),
    h('div', { class: 'need-bar' }, h('i', { id: 'needFill' })),
    h('div', { class: 'need-row' }, h('span', {}, t('time')), h('span', { id: 'needTime', class: 'need-time' })))
}

// Countdown to the next step, drawn every frame from the last synced value.
function drawProgress() {
  if (!G || G.ended) return
  const v = G.view, st = STAGES[v.stage]
  const left = st.last || v.ac ? 0 : G.them ? Math.max(0, G.leftEnd - now()) : st.time
  const frac = st.last ? 1 : 1 - left / st.time
  document.querySelectorAll('#match .fuse-fill, #needFill').forEach(f => (f.style.transform = `scaleX(${frac})`))
  const nt = $('#needTime')
  if (nt) {
    const s = left > 0 ? mmss(left) : '✓'
    if (nt.textContent !== s) { nt.textContent = s; nt.classList.toggle('done', left <= 0) }
  }
  const mine = mineCnt()
  const hint = st.last ? (G.swap.done ? t('swapped') : t('d' + v.stage)) : v.ac ? t('ready_' + v.stage)
    : left > 0 ? t('in_' + v.stage, { time: mmss(left) })
    : mine < st.need ? tn('more_' + v.stage, st.need - mine) : t('wait_' + v.stage)
  if ($('#meterText').textContent !== hint) $('#meterText').textContent = hint
  $('#match').classList.toggle('ready', v.ac || !!st.last)
  G.raf = requestAnimationFrame(drawProgress)
}

// The same counts as small pills in the header, for phones where the sidebar is hidden.
function renderNeed() {
  const v = G.view, st = STAGES[v.stage], el = $('#gifNeed')
  el.hidden = !!st.last || v.ac
  if (el.hidden) return
  const group = (who, n) => h('span', { class: `need${n >= st.need ? ' done' : ''}` }, h('span', { class: 'need-who' }, who), dots(n, st.need))
  el.replaceChildren(group(t('you'), mineCnt()), group(t('stranger'), theirCnt()))
}

// Welcome card at the top of a fresh match.
function addIntro() {
  const { tz, cc } = G.them
  const time = localTime(tz)
  pushFeed(h('div', { class: 'intro' },
    h('div', { class: 'intro-orbs' }, h('span', { class: 'ava you' }), h('span', { class: 'intro-link' }), h('span', { class: 'ava', style: `--hue:${G.hue}` })),
    h('p', { class: 'intro-title' }, t('intro_title')),
    h('p', { class: 'intro-sub' }, `${flagOf(cc) || '🌍'}${time ? ' · ' + time : ''}`),
    h('p', { class: 'intro-hint' }, icon('s1'), t('intro_hint', { n: Math.round(STAGES[1].time / 1000), g: STAGES[1].need }))))
}

function renderConsent() {
  const box = $('#consent')
  const v = G.view
  box.hidden = !v.ac
  if (!v.ac) return
  const mine = v.cons[G.host ? 0 : 1], theirs = v.cons[G.host ? 1 : 0]
  box.replaceChildren(...[
    h('span', { class: 'consent-ico' }, icon('s' + (v.stage + 1))),
    h('div', {}, h('p', {}, mine ? t('consent_wait') : t('ask_' + v.stage)), theirs && !mine && h('p', { class: 'them-in' }, t('them_' + v.stage))),
    !mine && h('button', { class: 'btn small', type: 'button', onclick: () => {
      if (H) hostConsent(0)
      else { net.send({ t: 'ok', s: v.stage }); G.view.cons = [...G.view.cons]; G.view.cons[1] = true; renderConsent() }
    } }, t('consent_btn'))].filter(Boolean))
}

// ---------------------------------------------------------------- messages

function cleanTokens(tk) {
  if (!Array.isArray(tk) || tk.length !== 1) return null
  const x = tk[0]
  if (!x || typeof x.v !== 'string') return null
  if (x.k === 'g' && GIF_OK.test(x.v) && x.v.length < 300) return [{ k: 'g', v: x.v, w: dim(x.w), h: dim(x.h) }]
  if (x.k === 'w') { const v = x.v.trim().slice(0, TEXT_MAX); return v ? [{ k: 'w', v }] : null }
  return null
}

function sendTokens(tk) {
  if (!G || G.ended || !G.them || now() - G.lastSend < 600) return false
  G.lastSend = now()
  const id = rid()
  net.send({ t: 'm', id, tk })
  addBubble('me', id, tk)
  if (H) hostCount(0, tk[0].k)
  vibrate(12)
  return true
}

function sendGif(g) {
  if (!sendTokens([{ k: 'g', v: g.url, w: g.w, h: g.h }])) return
  if (G.view.stage >= 2) { G.gifOpen = false; renderComposer() }
}

function sendText() {
  if (!G || G.view.stage < 2) return
  const input = $('#textIn')
  const v = input.value.trim().slice(0, TEXT_MAX)
  if (!v || !sendTokens([{ k: 'w', v }])) return
  input.value = ''
  updateSend()
}

// Composer: the GIF picker is always open while it's GIFs only. Once text is open, the text
// field takes over and the GIF button opens the picker on demand. The mic joins at step 3.
function renderComposer() {
  const textOpen = G.view.stage >= 2
  $('#tray').hidden = !textOpen || !!rec
  $('#rec').hidden = !rec
  $('#micBtn').hidden = G.view.stage < 3
  $('#gifPanel').hidden = textOpen && !G.gifOpen
  $('#gifBtn').classList.toggle('on', G.gifOpen && textOpen)
  $('#gifBtn').setAttribute('aria-expanded', String(G.gifOpen && textOpen))
  if (!$('#gifPanel').hidden && !gifState.loaded) loadGifs()
  updateSend()
  renderSwap()
}
function updateSend() { $('#sendBtn').disabled = !$('#textIn').value.trim() }

$('#sendBtn').addEventListener('click', sendText)
$('#textIn').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); sendText() } })
$('#textIn').addEventListener('input', updateSend)
$('#gifBtn').addEventListener('click', () => {
  if (!G) return
  G.gifOpen = !G.gifOpen
  renderComposer()
  if (G.gifOpen) $('#gifSearch').focus({ preventScroll: true })
})

// ---------------------------------------------------------------- voice messages
// Recorded in the browser and sent straight to the other person over the same peer-to-peer
// connection as everything else. Nothing is uploaded anywhere.

const VOICE_TYPES = ['audio/mp4;codecs=mp4a.40.2', 'audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg;codecs=opus']
let rec = null          // the recording in progress
let recStarting = false
let playing = null      // the voice message playing now: { audio, stop }

async function startRec() {
  if (!G || G.ended || G.view.stage < 3 || rec || recStarting) return
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) return toast(t('mic_none'))
  recStarting = true
  playing?.stop()
  // Made inside the tap so the browser lets it run. It only measures loudness for the waveform.
  let ctx = null
  try { ctx = new (window.AudioContext || window.webkitAudioContext)() } catch {}
  let stream
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }) }
  catch { recStarting = false; ctx?.close(); return toast(t('mic_denied')) }
  recStarting = false
  const quit = () => { stream.getTracks().forEach(x => x.stop()); ctx?.close() }
  if (!G || G.ended || G.view.stage < 3) return quit()
  const mimeType = VOICE_TYPES.find(x => MediaRecorder.isTypeSupported?.(x))
  let mr
  try { mr = new MediaRecorder(stream, { ...(mimeType ? { mimeType } : {}), audioBitsPerSecond: 32000 }) }
  catch { quit(); return toast(t('mic_none')) }

  const r = rec = { mr, stream, ctx, chunks: [], levels: [], start: now(), send: false, tick: 0 }
  mr.ondataavailable = e => { if (e.data?.size) r.chunks.push(e.data) }
  mr.onstop = () => finishRec(r)
  mr.start(250)
  let analyser = null, buf = null
  try {
    analyser = ctx.createAnalyser()
    analyser.fftSize = 512
    ctx.createMediaStreamSource(stream).connect(analyser)
    buf = new Uint8Array(analyser.fftSize)
    ctx.resume?.()
  } catch { analyser = null }
  const waveEl = $('#recWave')
  waveEl.replaceChildren()
  $('#recTime').textContent = clock(0)
  r.tick = setInterval(() => {
    const ms = now() - r.start
    $('#recTime').textContent = clock(ms)
    let level = 0
    if (analyser) {
      analyser.getByteTimeDomainData(buf)
      let sum = 0
      for (const b of buf) sum += ((b - 128) / 128) ** 2
      level = Math.sqrt(sum / buf.length)
    }
    r.levels.push(level)
    const bar = h('i')
    bar.style.height = `${Math.round(4 + Math.min(1, level * 5) * 20)}px`
    waveEl.append(bar)
    while (waveEl.children.length > 60) waveEl.firstElementChild.remove()
    if (ms >= VOICE_MAX) stopRec(true)
  }, 100)
  renderComposer()
  vibrate(15)
}

function stopRec(send) {
  if (!rec) return
  const r = rec
  rec = null
  r.send = send
  r.dur = Math.min(VOICE_MAX, now() - r.start)
  clearInterval(r.tick)
  try { if (r.mr.state !== 'inactive') r.mr.stop() } catch {}
  r.stream.getTracks().forEach(x => x.stop())
  try { r.ctx?.close() } catch {}
  if (G && !G.ended) renderComposer()
}

function finishRec(r) {
  if (!r.send || !G || G.ended || r.dur < 600) return
  const blob = new Blob(r.chunks, { type: r.mr.mimeType || r.chunks[0]?.type || 'audio/webm' })
  if (!blob.size) return
  if (blob.size > VOICE_BYTES) return toast(t('voice_big'))
  sendVoice(blob, r.dur / 1000, peaksOf(r.levels))
}

// Loudness over time, squeezed into a fixed number of bars (0–100). Sent along with the audio so
// both sides draw the same waveform without decoding anything.
function peaksOf(levels, n = 32) {
  const max = Math.max(0, ...levels)
  if (max < 0.004) return Array.from({ length: n }, (_, i) => 30 + Math.round(30 * Math.abs(Math.sin(i * 1.7))))
  return Array.from({ length: n }, (_, i) => {
    const a = Math.floor(i * levels.length / n), b = Math.max(a + 1, Math.floor((i + 1) * levels.length / n))
    return Math.max(8, Math.round(100 * Math.max(...levels.slice(a, b)) / max))
  })
}

async function sendVoice(blob, d, p) {
  if (!G || G.ended || !G.them) return
  const id = rid(), meta = { id, d: Math.round(d * 10) / 10, p, mime: blob.type }
  addVoice('me', id, URL.createObjectURL(blob), meta)
  if (H) hostCount(0, 'v')
  vibrate(12)
  try { await net.sendVoice(new Uint8Array(await blob.arrayBuffer()), meta) } catch {}
}

function onVoice(data, meta) {
  if (!G || G.ended || !meta || typeof meta.id !== 'string') return
  const size = data?.byteLength ?? data?.size ?? 0
  if (!size || size > VOICE_BYTES) return
  const id = meta.id.slice(0, 12)
  net.send({ t: 'ack', id })
  if ($('#feed').querySelector(`.row.them .bubble[data-id="${CSS.escape(id)}"]`)) return
  const mime = /^audio\/(webm|mp4|ogg|mpeg|aac)(;[\w=., -]{0,40})?$/.test(meta.mime || '') ? meta.mime : 'audio/webm'
  const d = Math.max(0.5, Math.min(VOICE_MAX / 1000 + 1, +meta.d || 0))
  const p = (Array.isArray(meta.p) ? meta.p : []).slice(0, 48).map(x => Math.max(0, Math.min(100, Math.round(+x || 0))))
  addVoice('them', id, URL.createObjectURL(new Blob([data], { type: mime.split(';')[0] })), { d, p, mime })
  if (H) hostCount(1, 'v')
}

function wave(peaks) {
  return h('span', { class: 'vwave' }, peaks.map(p => { const i = h('i'); i.style.height = `${Math.round(4 + p * 0.2)}px`; return i }))
}

function addVoice(who, id, url, { d, p, mime }) {
  G.urls.push(url)
  G.voiceCount++
  countStage('v')
  const audio = new Audio()
  audio.preload = 'auto'
  audio.src = url
  const btn = h('button', { class: 'vplay', type: 'button', 'aria-label': t('play') }, icon('play'))
  const bars = wave(p.length ? p : peaksOf([]))
  const time = h('span', { class: 'vtime' }, clock(Math.round(d) * 1000))
  const progress = f => [...bars.children].forEach((b, i, all) => b.classList.toggle('on', i < Math.round(f * all.length)))
  const stop = () => {
    audio.pause()
    try { audio.currentTime = 0 } catch {}
    btn.replaceChildren(icon('play'))
    progress(0)
    time.textContent = clock(Math.round(d) * 1000)
    if (playing?.audio === audio) playing = null
  }
  audio.addEventListener('timeupdate', () => {
    if (playing?.audio !== audio) return
    progress(Math.min(1, audio.currentTime / d))
    time.textContent = clock(audio.currentTime * 1000)
  })
  audio.addEventListener('ended', stop)
  btn.addEventListener('click', e => {
    e.stopPropagation()
    if (playing?.audio === audio) return stop()
    playing?.stop()
    if (mime && !audio.canPlayType(mime.split(';')[0])) return toast(t('voice_cant'))
    playing = { audio, stop }
    btn.replaceChildren(icon('pause'))
    audio.play().catch(() => { stop(); toast(t('voice_cant')) })
  })
  addRow(who, id, h('div', { class: 'bubble voice', 'data-id': id }, btn, bars, time))
}

$('#micBtn').addEventListener('click', startRec)
$('#recCancel').addEventListener('click', () => stopRec(false))
$('#recSend').addEventListener('click', () => stopRec(true))

// ---------------------------------------------------------------- contact swap
// Each side types a contact and at first only says "ready" ('cx'). A contact ('ch') is sent
// only once both have said ready, so nobody gives theirs away without getting one back.

function renderSwap() {
  const box = $('#swap'), s = G.swap
  box.hidden = G.view.stage < LAST || s.done
  if (box.hidden) return
  const stale = !box.firstChild || box.dataset.lang !== lang || (s.mine && box.querySelector('.swap-form'))
  if (stale) {
    const typed = $('#swapIn')?.value || ''
    box.dataset.lang = lang
    box.replaceChildren(...[
      h('div', { class: 'swap-head' }, h('span', { class: 'consent-ico' }, icon('s4')),
        h('div', {}, h('p', {}, t('swap_title')), h('p', { class: 'swap-status' }))),
      !s.mine && h('form', { class: 'swap-form', onsubmit: e => { e.preventDefault(); submitSwap() } },
        h('input', { class: 'swap-in', id: 'swapIn', type: 'text', maxlength: CONTACT_MAX, autocomplete: 'off', enterkeyhint: 'send', placeholder: t('swap_ph'), 'aria-label': t('swap_title') }),
        h('button', { class: 'btn', type: 'submit' }, t('swap_btn'))),
    ].filter(Boolean))
    if ($('#swapIn')) $('#swapIn').value = typed
  }
  const status = box.querySelector('.swap-status')
  status.textContent = s.mine ? t('swap_wait') : s.theyReady ? t('swap_them') : t('swap_sub')
  status.classList.toggle('them-in', !s.mine && s.theyReady)
}

function submitSwap() {
  const input = $('#swapIn')
  const v = (input?.value || '').trim().slice(0, CONTACT_MAX)
  if (!v || !G || G.ended) return input?.focus()
  G.swap.mine = v
  net.send({ t: 'cx' })
  if (G.swap.theyReady) sendContact()
  renderSwap()
}

function swapReady() {
  G.swap.theyReady = true
  if (G.swap.mine) sendContact()
  if (G.view.stage >= LAST) renderSwap()
}

function sendContact() {
  if (G.swap.sentMine) return
  G.swap.sentMine = true
  net.send({ t: 'ch', v: G.swap.mine })
  checkReveal()
}

function swapContact(v) {
  if (typeof v !== 'string' || G.swap.theirs) return
  v = v.trim().slice(0, CONTACT_MAX)
  if (!v) return
  G.swap.theirs = v
  G.swap.theyReady = true
  checkReveal()
}

function checkReveal() {
  const s = G.swap
  if (s.done || !s.mine || !s.theirs || !s.sentMine) return
  s.done = true
  const line = (who, v, copy) => h('div', { class: 'swap-line' }, h('span', { class: 'who' }, who), h('b', {}, v),
    copy && h('button', { class: 'copy', type: 'button', onclick: e => copyText(v, e.currentTarget) }, t('copy')))
  pushFeed(h('div', { class: 'swap-card' },
    h('p', { class: 'swap-card-title' }, icon('s4'), t('swapped')),
    line(t('stranger'), s.theirs, true), line(t('you'), s.mine)))
  renderSwap()
  renderLadder()
  confetti()
  vibrate([30, 50, 30])
}

async function copyText(v, btn) {
  try { await navigator.clipboard.writeText(v) } catch { return }
  btn.textContent = t('copied')
  setTimeout(() => (btn.textContent = t('copy')), 1500)
}

function toast(msg) {
  const el = $('#toast')
  el.textContent = msg
  el.hidden = false
  clearTimeout(toast.t)
  toast.t = setTimeout(() => (el.hidden = true), 3200)
}

// ---------------------------------------------------------------- GIF picker

const gifState = { q: '', chip: null, loaded: false, cache: new Map(), timer: null, seq: 0 }

function renderChips() {
  $('#gifChips').replaceChildren(...GIF_CHIPS.map(([en, ka, q]) =>
    h('button', { class: `gif-chip${gifState.chip === q ? ' on' : ''}`, type: 'button', onclick: () => {
      const again = gifState.chip === q
      gifState.chip = again ? null : q
      gifState.q = again ? '' : q
      $('#gifSearch').value = again ? '' : lang === 'ka' ? ka : en
      renderChips()
      loadGifs()
    } }, lang === 'ka' ? ka : en)))
}

$('#gifSearch').addEventListener('input', e => {
  clearTimeout(gifState.timer)
  gifState.timer = setTimeout(() => {
    gifState.q = e.target.value.trim()
    gifState.chip = null
    renderChips()
    loadGifs()
  }, 350)
})
$('#gifSearch').addEventListener('keydown', e => { if (e.key === 'Enter') e.preventDefault() })

async function loadGifs() {
  gifState.loaded = true
  const grid = $('#gifGrid'), q = gifState.q, seq = ++gifState.seq
  if (!CONFIG.GIPHY_API_KEY) return showGifs(NOTO.map(c => ({ url: notoUrl(c), thumb: notoUrl(c), w: 512, h: 512 })))
  if (gifState.cache.has(q)) return showGifs(gifState.cache.get(q))
  grid.classList.add('loading')
  try {
    const params = new URLSearchParams({ api_key: CONFIG.GIPHY_API_KEY, limit: '30', rating: 'pg-13', ...(q ? { q } : {}) })
    const res = await fetch(`https://api.giphy.com/v1/gifs/${q ? 'search' : 'trending'}?${params}`)
    const { data } = await res.json()
    const list = data.map(g => {
      const sm = g.images.fixed_height_small, big = g.images.fixed_height || sm
      return { url: big.webp || big.url, thumb: sm.webp || sm.url, w: +big.width, h: +big.height, title: g.title || '' }
    })
    gifState.cache.set(q, list)
    if (seq === gifState.seq) showGifs(list)
  } catch {
    if (seq === gifState.seq) grid.replaceChildren(h('p', { class: 'muted gif-empty' }, t('gif_error')))
  }
  grid.classList.remove('loading')
}
function showGifs(list) {
  const grid = $('#gifGrid')
  grid.scrollTop = 0
  if (!list.length) return grid.replaceChildren(h('p', { class: 'muted gif-empty' }, t('gif_none')))
  grid.replaceChildren(...list.map(g => h('button', { class: 'gif', type: 'button', 'aria-label': g.title || 'GIF', onclick: () => sendGif(g) },
    h('img', { src: g.thumb, alt: '', loading: 'lazy', referrerpolicy: 'no-referrer' }))))
}

// ---------------------------------------------------------------- feed

function addBubble(who, id, tk) {
  const x = tk[0]
  const gif = x.k === 'g'
  const bubble = h('div', { class: `bubble${gif ? ' has-gif' : ''}`, 'data-id': id })
  if (gif) {
    const gw = x.w || 160, gh = x.h || 160, k = Math.min(1, 220 / Math.max(gw, gh))
    bubble.append(h('img', { class: 'gif-msg', src: x.v, alt: 'GIF', referrerpolicy: 'no-referrer',
      width: Math.round(gw * k), height: Math.round(gh * k),
      onload: () => { const f = $('#feed'); f.scrollTo({ top: f.scrollHeight, behavior: 'smooth' }) } }))
    G.gifCount++
    if (G.gifs.length < 6) G.gifs.push(x.v)
  } else {
    bubble.append(h('span', { class: 'w' }, hideLinks(x.v)))
    G.textCount++
  }
  countStage(x.k)
  addRow(who, id, bubble)
}

// Messages of the current step's kind, for the "done" line in the ladder.
function countStage(kind) { if (STAGES[G.view.stage].kind === kind) G.stageCnt[G.view.stage]++ }

function addRow(who, id, bubble) {
  const row = h('div', { class: `row ${who}` }, who === 'them' && h('span', { class: 'ava', style: `--hue:${G.hue}` }), bubble)
  if (who === 'them') {
    bubble.tabIndex = 0
    bubble.setAttribute('role', 'button')
    bubble.setAttribute('aria-label', t('react'))
    bubble.addEventListener('click', () => openReactions(bubble, id))
  }
  pushFeed(row)
}

function pushFeed(el) {
  const feed = $('#feed')
  feed.append(el)
  while (feed.children.length > 80) feed.firstElementChild.remove()
  requestAnimationFrame(() => feed.scrollTo({ top: feed.scrollHeight, behavior: 'smooth' }))
}

function openReactions(bubble, id) {
  if (bubble.querySelector('.react.me') || bubble.parentElement.querySelector('.react-pop')) return
  const pop = h('div', { class: 'react-pop' }, REACTIONS.map(e =>
    h('button', { type: 'button', onclick: ev => {
      ev.stopPropagation()
      pop.remove()
      if (!G || G.ended) return
      if (addReaction(id, e, 'theirs', 'me')) net.send({ t: 'r', id, e })
    } }, e)))
  bubble.after(pop)
  setTimeout(() => pop.remove(), 4000)
}

// whose: which side's bubble ('mine' = a bubble I sent). by: who reacted.
function addReaction(id, e, whose, by = 'them') {
  const bubble = $('#feed').querySelector(`.row.${whose === 'mine' ? 'me' : 'them'} .bubble[data-id="${CSS.escape(id)}"]`)
  if (!bubble || bubble.querySelector(`.react.${by}`)) return false
  bubble.append(h('span', { class: `react ${by}` }, e))
  return true
}

// ---------------------------------------------------------------- effects

function levelUpFx(stage) {
  const o = $('#overlay')
  o.replaceChildren(h('div', { class: 'lv-card' },
    h('div', { class: 'lv-ico' }, icon('s' + stage)),
    h('p', { class: 'lv-kicker' }, t('unlocked')),
    h('p', { class: 'lv-name' }, t('s' + stage)),
    h('p', { class: 'lv-desc' }, t('d' + stage))))
  o.hidden = false
  o.classList.remove('play'); void o.offsetWidth; o.classList.add('play')
  confetti()
  vibrate([30, 50, 30])
  clearTimeout(levelUpFx.t)
  levelUpFx.t = setTimeout(() => {
    o.hidden = true
    if (matchMedia('(hover: hover)').matches) (stage === 2 ? $('#textIn') : stage === LAST ? $('#swapIn') : null)?.focus({ preventScroll: true })
  }, 1700)
}

const CONFETTI = ['#7C6CFF', '#FF7AD9', '#4CC9F0', '#3DD68C', '#FFD23F']
function confetti() {
  const layer = $('#confetti')
  for (let i = 0; i < 16; i++) {
    const s = h('span', { class: 'bit' })
    s.style.background = pick(CONFETTI)
    s.style.setProperty('--x', `${(Math.random() - 0.5) * 120}vw`)
    s.style.setProperty('--y', `${-30 - Math.random() * 60}vh`)
    s.style.setProperty('--r', `${(Math.random() - 0.5) * 720}deg`)
    s.style.left = `${40 + Math.random() * 20}%`
    s.style.animationDelay = `${Math.random() * 120}ms`
    layer.append(s)
    setTimeout(() => s.remove(), 1600)
  }
}

// ---------------------------------------------------------------- postcard

function renderPostcard(why) {
  const dur = now() - (G.connectedAt || G.startedAt)
  $('#postcard').replaceChildren(...[
    h('p', { class: 'pc-kicker' }, t('the_end')),
    h('p', { class: 'pc-end' }, t('end_' + why)),
    h('div', { class: 'pc-pair' },
      h('span', { class: 'ava you' }),
      h('span', { class: 'pc-amp' }, '+'),
      h('span', { class: 'ava', style: `--hue:${G.hue}` }),
      h('span', { class: 'pc-flag' }, flagOf(G.them?.cc) || '🌍')),
    h('div', { class: 'pc-stage' },
      h('span', { class: 'lv-ico' }, icon('s' + G.maxStage)),
      h('div', {}, h('p', { class: 'pc-kicker' }, t('reached')), h('p', { class: 'pc-stage-name' }, t('s' + G.maxStage)))),
    h('div', { class: 'pc-stats' },
      stat(mmss(dur), t('stat_time')), stat(G.gifCount, t('stat_gifs')), stat(G.textCount, t('stat_texts')), stat(G.voiceCount, t('stat_voice'))),
    G.gifs.length > 0 && h('div', { class: 'pc-story' }, h('p', { class: 'pc-kicker' }, t('story')),
      h('div', { class: 'pc-gifs' }, G.gifs.map(src => h('img', { src, alt: '', referrerpolicy: 'no-referrer' })))),
  ].filter(Boolean))
  $('#shareBtn').onclick = () => share(t('share_text', { brand: CONFIG.BRAND }), $('#shareBtn'))
}
const stat = (n, label) => h('div', { class: 'stat' }, h('b', {}, String(n)), h('span', {}, label))

// ---------------------------------------------------------------- boot

hydrateIcons()
applyLang()
const inviteCode = new URLSearchParams(location.search).get('invite')
if (/^[a-z0-9]{6,20}$/.test(inviteCode || '')) joinInvite(inviteCode)
else show('landing')
