import { CONFIG } from './config.js?v=17'
import { STR, LANGS } from './i18n.js?v=17'
import { Net } from './net.js?v=17'

// Talkies: two strangers climb five steps: GIFs only, then words, voice messages, a video call,
// and finally swapping contacts. A step opens once enough time has passed and both have sent
// enough of the current kind of message, and only if both agree.

// ---------------------------------------------------------------- content

const FAST = new URLSearchParams(location.search).has('fast')
// kind: which messages count toward opening the next step ('g' GIF, 'w' text, 'v' voice).
// need: how many of them each side sends. time: how long the step lasts at least.
const STAGES = [null,
  { kind: 'g', need: FAST ? 1 : 3, time: FAST ? 10000 : 60000 },
  { kind: 'w', need: FAST ? 1 : 5, time: FAST ? 10000 : 90000 },
  { kind: 'v', need: 1, time: FAST ? 10000 : 45000 },
  { kind: '', need: 0, time: FAST ? 10000 : 60000 },   // video: the camera is optional, only time counts
  { last: true },
]
const VIDEO = 4
const LAST = STAGES.length - 1
const TEXT_MAX = 300
const VOICE_MAX = 30000          // longest voice message, ms
const VOICE_BYTES = 800 * 1024   // and the largest file accepted
const CONTACT_MAX = 40
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
  s4: SVG('<rect x="2.5" y="6" width="13" height="12" rx="3"/><path d="m15.5 10.5 6-3.5v10l-6-3.5z"/>'),
  camOff: SVG('<rect x="2.5" y="6" width="13" height="12" rx="3"/><path d="m15.5 10.5 6-3.5v10l-6-3.5z"/><path d="M2 3l20 18"/>'),
  micOff: SVG('<rect x="9" y="2.5" width="6" height="11.5" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21"/><path d="M3 3l18 18"/>'),
  hang: SVG('<path d="M3 15.5c4.9-4.7 13.1-4.7 18 0l-2.3 2.5-3.4-1.5.1-2.6a11 11 0 0 0-6.8 0l.1 2.6-3.4 1.5z"/>'),
  eye: SVG('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  s5: SVG('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/>'),
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

// ---------------------------------------------------------------- avatars
// A small face drawn from a seed: a background, a tilted rounded shape, eyes that blink and a
// mouth. Each person sends their seed in the hello, so both screens draw the same two faces.

const AVA_PALETTES = [
  ['#FF7A59', '#FFC145', '#2EC4B6', '#8B7CFF', '#F25F5C'],
  ['#8B7CFF', '#FF8FAB', '#FFD166', '#06D6A0', '#4CC9F0'],
  ['#F94144', '#F9C74F', '#90BE6D', '#43AA8B', '#577590'],
  ['#FF9F1C', '#FFBF69', '#CBF3F0', '#2EC4B6', '#E76F51'],
  ['#B8F2E6', '#FFA69E', '#FAF3DD', '#AED9E0', '#9381FF'],
  ['#F72585', '#B5179E', '#4CC9F0', '#FFD60A', '#7209B7'],
]
const DEMO_SEEDS = ['k1', 'q8']         // the two faces in the landing demo

// My profile: a name, a gender and a photo, all optional and kept on this device only. Without a
// photo my face is drawn from a seed, which is kept too so the face stays the same next time.
const NAME_MAX = 20
const PHOTO_PX = 160               // photos are cropped square and scaled to this size
const PHOTO_MAX = 48000            // largest photo accepted, as a data URL
const GENDERS = ['m', 'f', 'o']
const cleanName = s => [...String(s || '')
  .replace(/[\p{Cc}​‌‎‏‪-‮⁠-⁤⁦-⁩﻿]/gu, '')
  .replace(/(https?:\/\/|www\.)\S*/gi, '').replace(/\s+/g, ' ').trim()].slice(0, NAME_MAX).join('').trim()
const cleanGender = g => (GENDERS.includes(g) ? g : '')
const cleanPhoto = s => (typeof s === 'string' && s.length <= PHOTO_MAX && /^data:image\/(jpeg|png|webp);base64,[a-z0-9+/]+=*$/i.test(s) ? s : '')
const profile = (() => {
  let p = {}
  try { p = JSON.parse(localStorage.getItem('profile') || '{}') || {} } catch {}
  return { name: cleanName(p.name), g: cleanGender(p.g), ph: cleanPhoto(p.ph), seed: /^[a-z0-9]{8,24}$/.test(p.seed || '') ? p.seed : rid() + rid() }
})()
const saveProfile = () => { try { localStorage.setItem('profile', JSON.stringify(profile)) } catch {} }
const mySeed = profile.seed

// Same seed, same numbers: a tiny seeded random generator.
function seeded(seed) {
  let a = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) { a = Math.imul(a ^ seed.charCodeAt(i), 3432918353); a = a << 13 | a >>> 19 }
  return () => {
    a = a + 0x6D2B79F5 | 0
    let x = Math.imul(a ^ a >>> 15, 1 | a)
    x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x
    return ((x ^ x >>> 14) >>> 0) / 4294967296
  }
}

function faceSvg(seed) {
  const r = seeded(seed)
  const pal = AVA_PALETTES[Math.floor(r() * AVA_PALETTES.length)].slice()
  for (let i = pal.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pal[i], pal[j]] = [pal[j], pal[i]] }
  const [bg, skin] = pal
  const n = parseInt(skin.slice(1), 16)
  const ink = (0.299 * (n >> 16) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) / 255 > 0.55 ? '#141418' : '#fff'
  const f = x => +x.toFixed(1)
  // The face sits in the middle and stays whole inside the circle, just a little tilted.
  const rot = f((r() - 0.5) * 20), rx = f(16 + r() * 14)
  const fx = f((r() - 0.5) * 4), fy = f(2 + (r() - 0.5) * 3), frot = f((r() - 0.5) * 10)
  const gap = f(9 + r() * 4), round = r() > 0.4, open = r() > 0.5, delay = f(r() * 5)
  const eyes = round
    ? `<circle cx="${f(40 - gap)}" cy="35" r="4"/><circle cx="${f(40 + gap)}" cy="35" r="4"/>`
    : `<rect x="${f(38 - gap)}" y="30" width="4" height="10" rx="2"/><rect x="${f(38 + gap)}" y="30" width="4" height="10" rx="2"/>`
  const mouth = open
    ? `<path d="M31 47Q40 ${f(58 + r() * 3)} 49 47Z"/>`
    : `<path d="M32 48Q40 ${f(53 + r() * 4)} 48 48" fill="none" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/>`
  return {
    color: skin,
    svg: `<svg viewBox="0 0 80 80" aria-hidden="true"><rect width="80" height="80" fill="${bg}"/>` +
      `<rect x="11" y="11" width="58" height="58" rx="${rx}" fill="${skin}" transform="rotate(${rot} 40 40)"/>` +
      `<g fill="${ink}" transform="translate(${fx} ${fy}) rotate(${frot} 40 40)"><g class="eyes" style="animation-delay:-${delay}s">${eyes}</g>${mouth}</g></svg>`,
  }
}

// face: a seed to draw a face from, or a photo (a data URL); '' leaves the circle empty.
const faces = new Map()
function paintAva(el, face) {
  if (!face) { el.replaceChildren(); el.style.removeProperty('--glow'); return el }
  if (face.startsWith('data:')) {
    el.replaceChildren(h('img', { src: face, alt: '' }))
    el.style.removeProperty('--glow')
    return el
  }
  if (!faces.has(face)) faces.set(face, faceSvg(face))
  const f = faces.get(face)
  el.innerHTML = f.svg
  el.style.setProperty('--glow', f.color)
  return el
}
const ava = (face, cls) => paintAva(h('span', { class: cls ? `ava ${cls}` : 'ava' }), face)
const myFace = () => profile.ph || mySeed
const themFace = () => G?.pf?.ph || G?.them?.av || ''
// Every circle showing me has the class me-face, every one showing the stranger them-face.
function repaintFaces() {
  document.querySelectorAll('.me-face').forEach(el => paintAva(el, myFace()))
  document.querySelectorAll('.them-face').forEach(el => paintAva(el, themFace()))
}

// The stranger's face gives a little hop when something from them arrives.
function hopThem() {
  document.querySelectorAll('#match .stranger .ava, #match .chip .ava').forEach(el => {
    el.classList.remove('hop')
    void el.offsetWidth
    el.classList.add('hop')
    clearTimeout(el.hopT)
    el.hopT = setTimeout(() => el.classList.remove('hop'), 600)
  })
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
  renderMe()
  renderPf()
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
          feed.append(h('div', { class: 'row them' }, ava(DEMO_SEEDS[1]),
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
  return h('div', { class: `row ${who}` }, who === 'them' && ava(DEMO_SEEDS[1]), bubble)
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
  onStream: stream => onStream(stream),
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
    partner, host: isHost, them: null, theyGotMine: false, ended: false,
    view: { stage: 1, left: STAGES[1].time, ac: false, cons: [false, false], cnt: [0, 0] },
    leftEnd: now() + STAGES[1].time, startedAt: now(), connectedAt: 0, maxStage: 1,
    gifs: [], gifCount: 0, textCount: 0, voiceCount: 0, stageCnt: STAGES.map(() => 0),
    lastSend: 0, timers: [], gifOpen: true, urls: [],
    swap: { mine: '', theyReady: false, sentMine: false, theirs: '', done: false },
    video: newVideo(),
  }
  H = isHost ? { stage: 1, left: STAGES[1].time, ac: false, cons: [false, false], cnt: [0, 0], last: now(), lastPush: 0 } : null

  $('#feed').replaceChildren()
  $('#swap').replaceChildren()
  $('#textIn').value = ''
  repaintFaces()
  document.querySelectorAll('#match .them-info').forEach(el => (el.textContent = ''))
  $('#themName').textContent = t('stranger')
  $('#themName').classList.remove('named')
  $('#connecting').hidden = false
  show('match')
  renderAll()

  const hello = () => {
    if (G.them && G.theyGotMine) return
    net.send({ t: 'hi', lang, tz: myTz, cc: myRegion, av: mySeed, got: !!G.them })
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
  stopVideo(G.partner)
  G.urls.forEach(u => URL.revokeObjectURL(u))
  $('#remoteVid').srcObject = $('#remoteBg').srcObject = $('#localVid').srcObject = null
  $('#video').hidden = true
  document.body.classList.remove('in-call')
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
      const av = String(m.av || '').replace(/[^a-z0-9]/gi, '').slice(0, 24) || G.partner
      G.them = { lang: LANGS.includes(m.lang) ? m.lang : 'en', tz: String(m.tz || '').slice(0, 40), cc: String(m.cc || '').slice(0, 2), av: G.them?.av || av }
      if (m.got) G.theyGotMine = true
      if (first) {
        net.send({ t: 'hi', lang, tz: myTz, cc: myRegion, av: mySeed, got: true })
        sendProfile()
        repaintFaces()
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
      hopThem()
      if (H) hostCount(1, tk[0].k)
      break
    }
    case 'ack': $('#feed').querySelector(`.row.me .bubble[data-id="${CSS.escape(String(m.id))}"]`)?.classList.add('sent'); break
    case 'r': if (REACTIONS.includes(m.e)) addReaction(String(m.id), m.e, 'mine'); break
    case 's': if (!H) applyState(m); break
    case 'ok': if (H && m.s === H.stage) hostConsent(1); break
    case 'cx': swapReady(); break
    case 'ch': swapContact(m.v); break
    case 'cam': onCam(m); break
    case 'pf': onProfile(m); break
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
      if (stage === VIDEO) pushFeed(h('div', { class: 'feed-note' }, icon('s4'), h('span', {}, t('video_note'))))
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
  renderVideo()
}

function renderThem() {
  if (!G?.them) return
  const { tz, cc } = G.them
  const nm = G.pf?.nm || '', g = G.pf?.g ? t('g_' + G.pf.g) : ''
  const time = localTime(tz)
  let sky = ''
  try {
    const hr = +new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: tz || undefined }).format(new Date())
    sky = hr >= 5 && hr < 8 ? '🌅' : hr >= 8 && hr < 17 ? '☀️' : hr >= 17 && hr < 20 ? '🌇' : '🌙'
  } catch {}
  const sep = () => h('span', { class: 'sep' }, '·')
  // The phone header has no room for the name above, so it goes first in the line.
  document.querySelectorAll('#match .them-info').forEach(el => el.replaceChildren(...[
    nm && el.closest('.chip') && h('span', { class: 'nm' }, nm),
    nm && el.closest('.chip') && sep(),
    h('span', { class: 'flag' }, flagOf(cc) || '🌍'),
    g && sep(),
    g && h('span', { class: 'g' }, g),
    time && sep(),
    time && h('span', { class: 'time' }, `${sky} ${time}`),
  ].filter(Boolean)))
  $('#themName').textContent = nm || t('stranger')
  $('#themName').classList.toggle('named', !!nm)
  const sub = $('#feed .intro-sub')
  if (sub) sub.textContent = introLine()
}
const introLine = () => [G.pf?.nm, flagOf(G.them.cc) || '🌍', G.pf?.g && t('g_' + G.pf.g), localTime(G.them.tz)].filter(Boolean).join(' · ')

// The stranger's name, gender and photo: sent once we're connected and again whenever they change.
const sendProfile = () => net.send({ t: 'pf', nm: profile.name, g: profile.g, ph: profile.ph })
function onProfile(m) {
  G.pf = { nm: cleanName(m.nm), g: cleanGender(m.g), ph: cleanPhoto(m.ph) }
  repaintFaces()
  renderThem()
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
    const desc = state === 'done' ? (i === VIDEO ? t(G.video.saw ? 'done_4' : 'done_4_none') : tn('done_' + i, G.stageCnt[i]))
      : state === 'locked' ? t('u' + i)
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
    st.need > 0 && row(t('you'), mineCnt()), st.need > 0 && row(t('stranger'), theirCnt()),
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
    : mine < st.need ? tn('more_' + v.stage, st.need - mine) : st.need ? t('wait_' + v.stage) : t('ready_' + v.stage)
  if ($('#meterText').textContent !== hint) $('#meterText').textContent = hint
  $('#match').classList.toggle('ready', v.ac || !!st.last)
  G.raf = requestAnimationFrame(drawProgress)
}

// The same counts as small pills in the header, for phones where the sidebar is hidden.
function renderNeed() {
  const v = G.view, st = STAGES[v.stage], el = $('#gifNeed')
  el.hidden = !!st.last || v.ac || !st.need
  if (el.hidden) return
  const group = (who, n) => h('span', { class: `need${n >= st.need ? ' done' : ''}` }, h('span', { class: 'need-who' }, who), dots(n, st.need))
  el.replaceChildren(group(t('you'), mineCnt()), group(t('stranger'), theirCnt()))
}

// Welcome card at the top of a fresh match.
function addIntro() {
  pushFeed(h('div', { class: 'intro' },
    h('div', { class: 'intro-orbs' }, ava(myFace(), 'you me-face'), h('span', { class: 'intro-link' }), ava(themFace(), 'them-face')),
    h('p', { class: 'intro-title' }, t('intro_title')),
    h('p', { class: 'intro-sub' }, introLine()),
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
  $('#camBtn').hidden = G.view.stage < VIDEO
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
  if (!blob.size) return toast(t('rec_failed'))
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
  hopThem()
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

// ---------------------------------------------------------------- video call (step 4)
// Camera and microphone go straight to the other person. Nobody's camera turns on by itself,
// and the stranger's video stays blurred until you tap it, again every time their camera comes on.

const newVideo = () => ({ local: null, remote: null, mic: true, cam: true, them: { on: false, mic: true, cam: true }, revealed: false, saw: false, starting: false })

async function startVideo() {
  const v = G?.video
  if (!v || G.ended || G.view.stage < VIDEO || v.local || v.starting) return
  if (!navigator.mediaDevices?.getUserMedia) return toast(t('cam_none'))
  v.starting = true
  stopRec(false)
  playing?.stop()
  let stream
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 24 } },
      audio: { echoCancellation: true, noiseSuppression: true },
    })
  } catch (e) {
    v.starting = false
    return toast(t(e?.name === 'NotAllowedError' || e?.name === 'SecurityError' ? 'cam_denied' : 'cam_none'))
  }
  v.starting = false
  if (!G || G.ended || G.video !== v) return stream.getTracks().forEach(x => x.stop())
  Object.assign(v, { local: stream, mic: true, cam: true })
  net.addStream(stream)
  sendCam()
  renderVideo()
}

// Turn my camera and microphone off. peer: who to take the stream back from (the match may
// already be over).
function stopVideo(peer) {
  const v = G?.video
  if (!v?.local) return
  net.removeStream(v.local, peer)
  v.local.getTracks().forEach(x => x.stop())
  v.local = null
  if (!G.ended) { sendCam(); renderVideo() }
}

function toggleTrack(which) {
  const v = G?.video
  if (!v?.local) return
  v[which] = !v[which]
  v.local.getTracks().filter(x => x.kind === (which === 'mic' ? 'audio' : 'video')).forEach(x => (x.enabled = v[which]))
  sendCam()
  renderVideo()
}

const sendCam = () => net.send({ t: 'cam', on: !!G.video.local, mic: G.video.mic, cam: G.video.cam })

function onCam(m) {
  const v = G.video, was = v.them
  v.them = { on: !!m.on, mic: m.mic !== false, cam: m.cam !== false }
  if (!v.them.on) v.remote = null
  // Blurred again whenever their picture comes back, after a pause too.
  if (v.them.on && v.them.cam && !(was.on && was.cam)) v.revealed = false
  renderVideo()
}

function onStream(stream) {
  if (!G || G.ended) return
  const v = G.video
  if (!v.them.on) { v.them = { ...v.them, on: true }; v.revealed = false }
  v.remote = stream
  renderVideo()
}

function renderVideo() {
  const v = G.video, box = $('#video')
  const show = G.view.stage >= VIDEO && !!(v.local || v.them.on)
  box.hidden = !show
  $('#camBtn').hidden = G.view.stage < VIDEO
  $('#camBtn').classList.toggle('on', !!v.local)
  document.body.classList.toggle('in-call', show)
  const rv = $('#remoteVid'), bg = $('#remoteBg'), lv = $('#localVid')
  if (!show) { rv.srcObject = bg.srcObject = lv.srcObject = null; return }

  // Their whole picture is shown; a blurred, muted copy of it fills the space around it.
  const remote = v.them.on ? v.remote : null
  for (const el of [rv, bg]) if (el.srcObject !== remote) { el.srcObject = remote; if (remote) el.play().catch(() => {}) }
  const seeing = !!(remote && v.them.cam)
  box.classList.toggle('blurred', seeing && !v.revealed)
  $('#revealBtn').hidden = !seeing || v.revealed
  $('#remoteOff').hidden = seeing
  if (!seeing) {
    paintAva($('#remoteOff .ava'), themFace())
    $('#remoteOffText').textContent = v.them.on ? t('cam_off_them') : t('video_wait')
  }
  $('#themMuted').hidden = !(v.them.on && !v.them.mic)

  $('#localTile').hidden = !v.local
  if (v.local && lv.srcObject !== v.local) lv.srcObject = v.local
  $('#localTile').classList.toggle('off', !v.cam)
  $('#vStart').hidden = !!v.local
  for (const id of ['vMic', 'vCam', 'vEnd']) $('#' + id).hidden = !v.local
  $('#vMic').classList.toggle('off', !v.mic)
  $('#vMic').replaceChildren(icon(v.mic ? 's3' : 'micOff'))
  $('#vCam').classList.toggle('off', !v.cam)
  $('#vCam').replaceChildren(icon(v.cam ? 's4' : 'camOff'))
}

$('#camBtn').addEventListener('click', () => (G?.video?.local ? stopVideo() : startVideo()))
$('#vStart').addEventListener('click', startVideo)
$('#vEnd').addEventListener('click', () => stopVideo())
$('#vMic').addEventListener('click', () => toggleTrack('mic'))
$('#vCam').addEventListener('click', () => toggleTrack('cam'))
$('#revealBtn').addEventListener('click', () => {
  if (!G) return
  G.video.revealed = G.video.saw = true
  playRemote()
  renderVideo()
  renderLadder()
})
// Some browsers only play sound after a tap on the page.
function playRemote() { for (const el of [$('#remoteVid'), $('#remoteBg')]) if (el.srcObject && el.paused) el.play().catch(() => {}) }
$('#video').addEventListener('click', playRemote)
// My own picture keeps the camera's shape, so I see all of what the stranger sees.
function fitLocal() {
  const lv = $('#localVid'), w = lv.videoWidth, hh = lv.videoHeight
  if (!w || !hh) return
  $('#localTile').style.aspectRatio = `${w} / ${hh}`
  $('#localTile').classList.toggle('tall', hh > w)
}
$('#localVid').addEventListener('loadedmetadata', fitLocal)
$('#localVid').addEventListener('resize', fitLocal)

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
      h('div', { class: 'swap-head' }, h('span', { class: 'consent-ico' }, icon('s' + LAST)),
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
  const line = (face, cls, who, v, copy) => h('div', { class: 'swap-line' }, ava(face, cls), h('span', { class: 'who' }, who), h('b', {}, v),
    copy && h('button', { class: 'copy', type: 'button', onclick: e => copyText(v, e.currentTarget) }, t('copy')))
  pushFeed(h('div', { class: 'swap-card' },
    h('p', { class: 'swap-card-title' }, icon('s' + LAST), t('swapped')),
    line(themFace(), 'them-face', G.pf?.nm || t('stranger'), s.theirs, true), line(myFace(), 'me-face', t('you'), s.mine)))
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
  const row = h('div', { class: `row ${who}` }, who === 'them' && ava(themFace(), 'them-face'), bubble)
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
      ava(myFace(), 'you me-face'),
      h('span', { class: 'pc-amp' }, '+'),
      ava(themFace(), 'them-face'),
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

// ---------------------------------------------------------------- my profile
// Opened from the button at the top, any time. Changes are saved on this device straight away
// and sent to the stranger when the window closes.

let pfDirty = false

function renderMe() {
  $('#meName').textContent = profile.name || t('profile')
  repaintFaces()
}

function renderPf() {
  $('#pfUpText').textContent = t(profile.ph ? 'pf_photo_change' : 'pf_photo_up')
  $('#pfRm').hidden = !profile.ph
  document.querySelectorAll('#pfGender button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.g === profile.g)))
}

function pfChanged() {
  pfDirty = true
  saveProfile()
  renderMe()
  renderPf()
}

// Crop to a square from the middle and shrink, so the photo is small enough to send.
async function squarePhoto(file) {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url })
    const w = img.naturalWidth, hh = img.naturalHeight, side = Math.min(w, hh)
    if (!side) throw new Error('empty image')
    const c = h('canvas', { width: PHOTO_PX, height: PHOTO_PX }), x = c.getContext('2d')
    x.fillStyle = '#222229'
    x.fillRect(0, 0, PHOTO_PX, PHOTO_PX)
    x.drawImage(img, (w - side) / 2, (hh - side) / 2, side, side, 0, 0, PHOTO_PX, PHOTO_PX)
    for (const q of [0.85, 0.7, 0.55, 0.4]) { const out = cleanPhoto(c.toDataURL('image/jpeg', q)); if (out) return out }
    throw new Error('photo too large')
  } finally { URL.revokeObjectURL(url) }
}

$('#meBtn').addEventListener('click', () => {
  $('#pfName').value = profile.name
  $('#pfErr').hidden = true
  renderPf()
  $('#profile').showModal()
})
$('#profile').addEventListener('click', e => {
  // A tap on the dimmed background, the cross or Done closes it.
  if (e.target === e.currentTarget || e.target.closest('[data-close]')) e.currentTarget.close()
})
$('#profile').addEventListener('close', () => {
  if (pfDirty && G?.them && !G.ended) sendProfile()
  pfDirty = false
})
$('#pfName').addEventListener('input', e => { profile.name = cleanName(e.target.value); pfChanged() })
$('#pfName').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('#profile').close() } })
$('#pfGender').addEventListener('click', e => {
  const b = e.target.closest('button[data-g]')
  if (!b) return
  profile.g = profile.g === b.dataset.g ? '' : b.dataset.g   // tap the chosen one again to clear it
  pfChanged()
})
$('#pfUp').addEventListener('click', () => $('#pfFile').click())
$('#pfFile').addEventListener('change', async e => {
  const file = e.target.files?.[0]
  e.target.value = ''
  if (!file) return
  $('#pfErr').hidden = true
  try { profile.ph = await squarePhoto(file) } catch { $('#pfErr').hidden = false; return }
  pfChanged()
})
$('#pfRm').addEventListener('click', () => { profile.ph = ''; pfChanged() })

// ---------------------------------------------------------------- boot

hydrateIcons()
document.querySelectorAll('.demo-avas .ava').forEach((el, i) => paintAva(el, DEMO_SEEDS[i]))
saveProfile()   // keeps my face's seed for next time
applyLang()
const inviteCode = new URLSearchParams(location.search).get('invite')
if (/^[a-z0-9]{6,20}$/.test(inviteCode || '')) joinInvite(inviteCode)
else show('landing')
