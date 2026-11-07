import { CONFIG } from './config.js?v=10'
import { STR, LANGS, LANG_NAME, PHRASES, PHRASE_MAP, SCALES } from './i18n.js?v=10'
import { Net } from './net.js?v=10'

// ---------------------------------------------------------------- content

const EMOJI = ['😀','😂','🥺','😍','😮','😎','🤔','😴','🥳','😭','😡','🤯','🙃','😬','🙈','🤫',
  '👋','👍','👎','🙏','👀','🙋','👉','🤝','❤️','🔥','✨','💀','🎉','❓','🍕','☕',
  '🎵','⚽','🐶','🐱','🌍','🌙','☀️','🎮']
const EMOJI_SET = new Set(EMOJI)
const REACTIONS = ['❤️', '😂', '😮', '👀']
const AVATARS = ['🦊','🐼','🐸','🐙','🦉','🐨','🐯','🦄','🐵','🐧','🦁','🐰','🐻','🐲','🦖','🐳','🦔','🦦']
const JINXW = [[['Sea', 'ზღვა'], ['Mountains', 'მთა']], [['Day', 'დღე'], ['Night', 'ღამე']], [['Cats', 'კატა'], ['Dogs', 'ძაღლი']],
  [['Coffee', 'ყავა'], ['Tea', 'ჩაი']], [['Books', 'წიგნი'], ['Movies', 'ფილმი']], [['Summer', 'ზაფხული'], ['Winter', 'ზამთარი']],
  [['City', 'ქალაქი'], ['Village', 'სოფელი']], [['Sweet', 'ტკბილი'], ['Salty', 'მლაშე']], [['Morning', 'დილა'], ['Evening', 'საღამო']],
  [['Rain', 'წვიმა'], ['Sun', 'მზე']], [['Music', 'მუსიკა'], ['Silence', 'სიჩუმე']], [['Pizza', 'პიცა'], ['Khachapuri', 'ხაჭაპური']],
  [['Travel', 'მოგზაურობა'], ['Home', 'სახლი']], [['Past', 'წარსული'], ['Future', 'მომავალი']]]
const JINX = JINXW.map((p, i) => p.map((_, j) => `${i}-${j}`))
const jw = id => { const [i, j] = String(id).split('-').map(Number); return JINXW[i]?.[j]?.[lang === 'ka' ? 1 : 0] ?? '' }
// Scale rounds (see SCALES in i18n.js). Positions on the line are 0–100.
const SCALE_MS = 40000
const L = pair => pair[lang === 'ka' ? 1 : 0]
const quote = s => (lang === 'ka' ? `„${s}“` : `“${s}”`)
const pct = n => (Number.isFinite(+n) ? Math.max(0, Math.min(100, Math.round(+n))) : null)
const clueText = (sc, c) => (c?.i != null ? L(SCALES[sc].words[c.i]) : c?.v ?? '')
// Animated Noto emoji (Google) — the GIF fallback when there's no GIPHY key.
const NOTO = { '😂':'1f602','🤣':'1f923','😍':'1f60d','🥰':'1f970','😭':'1f62d','😱':'1f631','🤯':'1f92f',
  '🥳':'1f973','😎':'1f60e','🤔':'1f914','🙄':'1f644','😴':'1f634','💀':'1f480','👻':'1f47b','🔥':'1f525',
  '❤️':'2764_fe0f','👋':'1f44b','👏':'1f44f','🙏':'1f64f','💃':'1f483','🎉':'1f389','🚀':'1f680','🙈':'1f648','💩':'1f4a9' }
const notoUrl = code => `https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/512.webp`
const GIF_OK = /^https:\/\/(media\d?\.giphy\.com|i\.giphy\.com|fonts\.gstatic\.com\/s\/e\/notoemoji)\//

const FAST = new URLSearchParams(location.search).has('fast')
const NEED = FAST ? { 1: 2, 2: 2, 3: 2, 4: 2 } : { 1: 4, 2: 5, 3: 5, 4: 6 }
const STAGE_ICON = [null, '1', '2', '3', '5', '💬']
// Word budget per stage: you earn more words by taking turns.
const WORDS = [0, 1, 2, 3, 5, Infinity]
const wordCount = s => s.trim().split(/\s+/).filter(Boolean).length
const FUSE_START = 45000
const fuseCap = stage => (stage >= 4 ? 90000 : 60000)

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
  s1: SVG('<text x="12" y="16.6" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor" stroke="none" font-family="Inter, system-ui, sans-serif">1</text><circle cx="12" cy="12" r="9.5"/>', 1.6),
  s2: SVG('<text x="12" y="16.6" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor" stroke="none" font-family="Inter, system-ui, sans-serif">2</text><circle cx="12" cy="12" r="9.5"/>', 1.6),
  s3: SVG('<text x="12" y="16.6" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor" stroke="none" font-family="Inter, system-ui, sans-serif">3</text><circle cx="12" cy="12" r="9.5"/>', 1.6),
  s4: SVG('<text x="12" y="16.6" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor" stroke="none" font-family="Inter, system-ui, sans-serif">5</text><circle cx="12" cy="12" r="9.5"/>', 1.6),
  s5: SVG('<path d="M20 15.5a2 2 0 0 1-2 2H8l-4 3.5V5.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>'),
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
const mmss = ms => { const s = Math.max(0, Math.round(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` }
function hideLinks(s) {
  return s.replace(/(https?:\/\/|www\.)\S+|\b[\w-]+\.(com|net|org|io|me|app|ge|ru|co|gg|ly|tv|xyz|link|site)\b\S*/gi, '🔗 ' + t('link_hidden'))
}
const vibrate = ms => { try { if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(ms) } catch {} }

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
function applyLang() {
  document.documentElement.lang = lang
  document.querySelectorAll('[data-i]').forEach(el => (el.textContent = t(el.dataset.i)))
  $('#langBtn').textContent = lang === 'ka' ? 'English' : 'ქართული'
  renderCount()
  startDemo()
  if (G && !G.ended) { renderAll(); renderThem(); updateScale() }
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
// A looping make-believe match that shows the idea without explaining it.
const W = (en, ka) => ['t', { en, ka }]
const DEMO = [
  { who: 'them', tk: [W('Sea?', 'ზღვა?')] },
  { who: 'me', tk: [W('Mountains.', 'მთა.')] },
  { stage: 2 },
  { who: 'them', tk: [W('Why mountains?', 'რატომ მთა?')] },
  { who: 'me', tk: [W('Love silence.', 'სიჩუმე მიყვარს.')] },
  { stage: 3 },
  { who: 'them', tk: [W('Me too, honestly.', 'მეც, გულწრფელად.')] },
  { stage: 4 },
  { who: 'me', tk: [W('Where do you go?', 'სად დადიხარ ხოლმე?')] },
  { stage: 5 },
  { typing: true },
  { who: 'them', tk: [['w', 'demo_text']] },
]
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
        await wait(step.stage ? 850 : step.typing ? 700 : 1150)
        if (!alive()) return
        feed.querySelector('.demo-typing')?.closest('.row')?.remove()
        if (step.stage) {
          bars.forEach((b, i) => b.classList.toggle('on', i < step.stage))
          feed.append(h('div', { class: 'demo-unlock' }, icon('s' + step.stage), `${t('unlocked')} · ${t('s' + step.stage)}`))
        } else if (step.typing) {
          feed.append(h('div', { class: 'row them' }, h('span', { class: 'ava', style: '--hue: 300' }),
            h('div', { class: 'bubble demo-typing' }, h('i'), h('i'), h('i'))))
        } else feed.append(demoRow(step))
        while (feed.children.length > 9) feed.firstElementChild.remove()
      }
      await wait(2800)
      if (!alive()) return
      feed.classList.add('fade')
      await wait(600)
    }
  })()
}
function demoRow({ who, tk }) {
  const onlyEmoji = tk.every(([k]) => k === 'e'), gif = tk[0][0] === 'g'
  const bubble = h('div', { class: `bubble${onlyEmoji ? ' big' : ''}${gif ? ' has-gif' : ''}` }, tk.map(([k, v]) =>
    k === 'e' ? h('span', { class: 'e' }, v)
      : k === 'p' ? h('span', { class: 'card' }, PHRASE_MAP[v][lang])
        : k === 'g' ? h('img', { class: 'gif-msg', src: v, width: 88, height: 88, alt: '', referrerpolicy: 'no-referrer' })
          : k === 't' ? h('span', {}, v[lang]) : h('span', {}, t(v))))
  return h('div', { class: `row ${who}` }, who === 'them' && h('span', { class: 'ava', style: '--hue: 300' }), bubble)
}

let online = 1
function renderCount() {
  const text = online <= 1 ? t('alone') : online === 1 ? t('online_one') : t('online_other', { n: online })
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
  onPartnerGone: () => endMatch('left'),
})
net.start()

// ---------------------------------------------------------------- search

let searchTimers = []
function startSearch() {
  show('search')
  $('#quiet').hidden = true
  net.search()
  searchTimers.forEach(clearInterval)
  const faces = ['😶', '🤔', '👀', '🙃', '😮', '🤫', '👋']
  let i = 0
  searchTimers = [
    setInterval(() => ($('#searchEmoji').textContent = faces[++i % faces.length]), 1400),
    setTimeout(() => ($('#quiet').hidden = false), 20000),
  ]
}
function stopSearchUi() { searchTimers.forEach(t => { clearInterval(t); clearTimeout(t) }) }

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
  const link = inviteUrl(code)
  $('#inviteLink').value = link
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
let H = null   // host-only authoritative state

function startMatch(partner, isHost) {
  stopSearchUi()
  clearTimeout(joinTimer)
  G = {
    partner, host: isHost, them: null, theyGotMine: false, ended: false,
    ava: pick(AVATARS), hue: Math.floor(Math.random() * 360),
    view: { stage: 1, spark: 0, need: NEED[1], fuse: FUSE_START, fuseMax: fuseCap(1), ac: false, cons: [false, false], volleys: 0, jinxes: 0 },
    fuseEnd: now() + FUSE_START, startedAt: now(), maxStage: 1, story: [], tokens: [], tab: 'emoji',
    lastSend: 0, timers: [], jinx: null, scale: null,
  }
  H = isHost ? {
    stage: 1, spark: 0, fuse: FUSE_START, fuseMax: fuseCap(1), ac: false, cons: [false, false],
    volleys: 0, jinxes: 0, lastSender: null, lastActivity: now(), lastJinxAt: 0, opened: false,
    jinx: null, scale: null, giver: null, flip: false, last: now(), lastPush: 0,
  } : null

  $('#feed').replaceChildren()
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
  G.raf = requestAnimationFrame(drawFuse)
}

function clearMatchTimers() {
  if (!G) return
  G.timers.forEach(x => { clearInterval(x); clearTimeout(x) })
  cancelAnimationFrame(G.raf)
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
        if (H) { H.last = now(); H.lastActivity = now() }
        G.fuseEnd = now() + FUSE_START
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
      const tk = cleanTokens(m.tk, 5)
      if (!tk) return
      net.send({ t: 'ack', id })
      if ($('#feed').querySelector(`.row.them .bubble[data-id="${CSS.escape(id)}"]`)) return
      addBubble('them', id, tk)
      if (H) score('them')
      break
    }
    case 'ack': {
      const b = $('#feed').querySelector(`.row.me .bubble[data-id="${CSS.escape(String(m.id))}"]`)
      b?.classList.add('sent')
      break
    }
    case 'r': {
      if (!REACTIONS.includes(m.e)) return
      if (addReaction(String(m.id), m.e, 'mine') && H) score('them')
      break
    }
    case 's': if (!H) applyState(m); break
    case 'j': if (!H && Array.isArray(m.opts)) showJinx(String(m.id), m.opts.filter(o => typeof o === 'string').slice(0, 3)); break
    case 'jp': if (H) hostJinxPick('them', String(m.id), String(m.pick)); break
    case 'jr': if (!H) revealJinx(m); break
    case 'jx': removeJinx(String(m.id)); break
    case 'sc': if (!H) { const r = cleanScale(m); if (r) showScale(r) } break
    case 'scc': onClue(m); break
    case 'scm': onGhost(m); break
    case 'scg': onGuess(m); break
    case 'scr': if (!H) revealScale(m); break
    case 'scx': removeScale(String(m.id)); break
    case 'ok': if (H) hostConsent(1); break
    case 'end': endMatch(m.why === 'fizzle' ? 'fizzle' : 'left'); break
    case 'bye': endMatch('left'); break
  }
}

// ---------------------------------------------------------------- host logic

function hostTick() {
  if (!G || G.ended || !G.them) return
  const tNow = now()
  H.fuse -= tNow - H.last
  H.last = tNow
  if (H.fuse <= 0) {
    net.send({ t: 'end', why: 'fizzle' })
    return endMatch('fizzle')
  }
  if (H.jinx && tNow - H.jinx.t > 15000) {
    net.send({ t: 'jx', id: H.jinx.id })
    removeJinx(H.jinx.id)
    H.jinx = null
    H.lastJinxAt = tNow
  }
  if (H.scale && tNow - H.scale.t > SCALE_MS) {
    net.send({ t: 'scx', id: H.scale.id })
    removeScale(H.scale.id)
    H.scale = null
    H.lastJinxAt = tNow
  }
  if (!H.jinx && !H.scale) {
    // Every match opens with a scale round; later, quiet moments alternate jinx and scale.
    if (!H.opened && tNow - G.connectedAt > 1200) { H.opened = true; spawnScale() }
    else if (H.opened && tNow - H.lastActivity > 10000 && tNow - H.lastJinxAt > 12000) (H.flip = !H.flip) ? spawnJinx() : spawnScale()
  }
  if (tNow - H.lastPush > 2000) push()
}

function push() {
  H.lastPush = now()
  const s = { t: 's', stage: H.stage, spark: H.spark, need: NEED[H.stage] || 0, fuse: Math.max(0, H.fuse),
    fuseMax: H.fuseMax, ac: H.ac, cons: H.cons, volleys: H.volleys, jinxes: H.jinxes }
  net.send(s)
  applyState(s)
}

function score(who) {
  H.lastActivity = now()
  if (H.lastSender && H.lastSender !== who) {
    H.volleys++
    addFuse(15000)
    addSpark(1)
  }
  H.lastSender = who
  push()
}
function addFuse(ms) { H.fuse = Math.min(H.fuseMax, H.fuse + ms) }
function addSpark(n) {
  if (H.stage >= 5) return
  H.spark = Math.min(NEED[H.stage], H.spark + n)
  if (H.spark < NEED[H.stage]) return
  if (H.stage === 4) H.ac = true
  else levelUp()
}
function levelUp() {
  H.stage++
  H.spark = 0
  H.ac = false
  H.fuseMax = fuseCap(H.stage)
  H.fuse = H.fuseMax
}
function hostConsent(idx) {
  if (!H.ac) return
  H.cons[idx] = true
  H.lastActivity = now()
  if (H.cons[0] && H.cons[1]) levelUp()
  push()
}

function spawnJinx() {
  const id = rid()
  const opts = Math.random() < 0.5 ? pick(JINX) : [...pick(JINX)].reverse()
  H.jinx = { id, opts, picks: {}, t: now() }
  net.send({ t: 'j', id, opts })
  showJinx(id, opts)
}
function hostJinxPick(who, id, choice) {
  const j = H.jinx
  if (!j || j.id !== id || !j.opts.includes(choice) || j.picks[who]) return
  j.picks[who] = choice
  H.lastActivity = now()
  if (!j.picks.me || !j.picks.them) return
  const hit = j.picks.me === j.picks.them
  if (hit) H.jinxes++
  addFuse(hit ? 10000 : 5000)
  addSpark(hit ? 2 : 1)
  const res = { t: 'jr', id, host: j.picks.me, guest: j.picks.them, hit }
  net.send(res)
  revealJinx(res)
  H.jinx = null
  H.lastJinxAt = now()
  push()
}


// Scale: the host picks the line, the hidden dot and who gives the hint (taking turns), then
// scores the guess once both the hint and the guess are in.
function spawnScale() {
  const id = rid(), sc = Math.floor(Math.random() * SCALES.length)
  const opts = [...SCALES[sc].words.keys()].sort(() => Math.random() - 0.5).slice(0, 4)
  const giver = H.giver = H.giver ? (H.giver === 'h' ? 'g' : 'h') : pick(['h', 'g'])
  const target = 8 + Math.floor(Math.random() * 85)
  H.scale = { id, sc, opts, giver, target, clue: null, pos: null, t: now() }
  const m = { t: 'sc', id, sc, opts, giver, target }
  net.send(m)
  showScale(m)
}
function hostClue(id, clue) {
  const s = H.scale
  if (!s || s.id !== id || s.clue) return
  s.clue = clue
  H.lastActivity = now()
  addFuse(5000)
  push()
}
function hostGuess(id, pos) {
  const s = H.scale
  if (!s || s.id !== id || !s.clue || s.pos != null) return
  s.pos = pos
  const d = Math.abs(pos - s.target)
  const grade = d <= 8 ? 'bull' : d <= 20 ? 'close' : 'far'
  if (grade === 'bull') H.jinxes++
  addFuse(grade === 'bull' ? 10000 : grade === 'close' ? 8000 : 5000)
  addSpark(grade === 'bull' ? 2 : 1)
  const res = { t: 'scr', id, pos, target: s.target, grade }
  net.send(res)
  revealScale(res)
  H.scale = null
  H.lastJinxAt = H.lastActivity = now()
  push()
}

// ---------------------------------------------------------------- view state

// The host re-sends state every 2 s. Only redraw what changed, so a tap that lands during a
// sync is never swallowed by the picker or buttons being rebuilt under the finger.
function applyState(s) {
  const prev = G.view
  G.view = { ...s }
  G.fuseEnd = now() + s.fuse
  if (s.stage !== prev.stage) {
    if (s.stage > prev.stage) {
      G.maxStage = Math.max(G.maxStage, s.stage)
      levelUpFx(s.stage)
      G.tab = s.stage === 2 ? 'phrases' : s.stage === 3 ? 'gif' : G.tab
    }
    return renderAll()
  }
  if (s.spark !== prev.spark || s.need !== prev.need) renderMeter()
  if (s.ac !== prev.ac || String(s.cons) !== String(prev.cons)) renderConsent()
}

function renderAll() {
  renderLadder()
  renderMeter()
  renderConsent()
  renderTabs()
  renderPanel()
  renderTray()
}

function renderThem() {
  if (!G?.them) return
  const { tz, cc, lang: l } = G.them
  let time = '', sky = ''
  try {
    const d = new Date()
    time = new Intl.DateTimeFormat(lang === 'ka' ? 'ka-GE' : 'en-US', { hour: 'numeric', minute: '2-digit', hourCycle: lang === 'ka' ? 'h23' : 'h12', timeZone: tz || undefined }).format(d)
    const hr = +new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: tz || undefined }).format(d)
    sky = hr >= 5 && hr < 8 ? '🌅' : hr >= 8 && hr < 17 ? '☀️' : hr >= 17 && hr < 20 ? '🌇' : '🌙'
  } catch {}
  document.querySelectorAll('#match .them-info').forEach(el => el.replaceChildren(...[
    h('span', { class: 'flag' }, flagOf(cc) || '🌍'),
    h('span', {}, LANG_NAME[l]),
    time && h('span', { class: 'sep' }, '·'),
    time && h('span', { class: 'time' }, `${sky} ${time}`),
  ].filter(Boolean)))
}

// One progress bar for the whole ladder: finished stages are full, the current stage fills
// with spark as you take turns, later stages are empty.
function renderLadder() {
  const v = G.view
  const frac = i => (i < v.stage || v.stage >= 5 ? 1 : i === v.stage ? Math.min(1, v.spark / (v.need || 1)) : 0)
  $('#ladder').replaceChildren(...[1, 2, 3, 4, 5].map(i => {
    const state = i < v.stage ? 'done' : i === v.stage ? 'now' : 'locked'
    return h('li', { class: `step-row ${state}` },
      h('span', { class: 'dot' }, icon(state === 'done' ? 'check' : state === 'locked' ? 'lock' : 's' + i)),
      h('div', {},
        h('p', { class: 'name' }, t('s' + i)),
        h('p', { class: 'desc' }, t('d' + i)),
        state === 'now' && i < 5 && h('div', { class: 'mini-bar' }, h('i', { style: `transform: scaleX(${frac(i)})` }))))
  }))
  $('#ladderMini').replaceChildren(...[1, 2, 3, 4, 5].map(i => h('i', { style: `--f: ${frac(i)}` })))
  $('#stageTitle').replaceChildren(icon('s' + v.stage), h('span', {}, t('s' + v.stage)), h('span', { class: 'of' }, t('stage_of', { n: v.stage })))
}

function renderMeter() {
  renderLadder()
  const v = G.view
  $('#meterText').textContent = v.stage < 5 && !v.ac ? t('hint') : ''
  // Spark toward the next unlock: one dot per volley needed.
  $('#spark').replaceChildren(...(v.stage < 5 ? [
    h('span', { class: 'spark-label' }, `${t('next_unlock')} `, h('b', {}, t('s' + (v.stage + 1)))),
    h('span', { class: 'spark-dots' }, Array.from({ length: v.need || 0 }, (_, i) => h('i', { class: i < v.spark ? 'on' : '' }))),
  ] : [h('span', { class: 'spark-label done' }, icon('check'), t('d5'))]))
}

// Welcome card at the top of a fresh match.
function addIntro() {
  const { tz, cc, lang: l } = G.them
  let time = ''
  try { time = new Intl.DateTimeFormat(lang === 'ka' ? 'ka-GE' : 'en-US', { hour: 'numeric', minute: '2-digit', hourCycle: lang === 'ka' ? 'h23' : 'h12', timeZone: tz || undefined }).format(new Date()) } catch {}
  pushFeed(h('div', { class: 'intro' },
    h('div', { class: 'intro-orbs' }, h('span', { class: 'ava you' }), h('span', { class: 'intro-link' }), h('span', { class: 'ava', style: `--hue:${G.hue}` })),
    h('p', { class: 'intro-title' }, t('intro_title')),
    h('p', { class: 'intro-sub' }, `${flagOf(cc) || '🌍'} ${LANG_NAME[l]}${time ? ' · ' + time : ''}`),
    h('p', { class: 'intro-hint' }, t('intro_hint'))))
}

function renderConsent() {
  const box = $('#consent')
  const v = G.view
  box.hidden = !v.ac
  if (!v.ac) return
  const mine = v.cons[G.host ? 0 : 1], theirs = v.cons[G.host ? 1 : 0]
  box.replaceChildren(...[
    h('p', {}, mine ? t('consent_wait') : t('consent_ask')),
    theirs && !mine && h('p', { class: 'them-in' }, '✅ ' + t('consent_them')),
    !mine && h('button', { class: 'btn small', onclick: () => {
      if (H) hostConsent(0)
      else { net.send({ t: 'ok' }); G.view.cons = [...G.view.cons]; G.view.cons[1] = true; renderConsent() }
    } }, t('consent_btn'))].filter(Boolean))
}

// ---------------------------------------------------------------- fuse

function drawFuse() {
  if (!G || G.ended) return
  const left = G.them ? Math.max(0, G.fuseEnd - now()) : G.view.fuseMax
  const pct = Math.min(1, left / G.view.fuseMax)
  const low = G.them && left < 10000
  document.querySelectorAll('#match .fuse').forEach(f => {
    f.firstElementChild.style.transform = `scaleX(${pct})`
    f.classList.toggle('low', low)
  })
  const secs = $('#fuseSecs')
  secs.textContent = mmss(left)
  secs.classList.toggle('low', low)
  G.raf = requestAnimationFrame(drawFuse)
}

// ---------------------------------------------------------------- tokens

// Validate and normalize tokens from the network (or our own composer) for a stage.
function cleanTokens(tk, stage) {
  if (!Array.isArray(tk) || !tk.length || tk.length > 5) return null
  let gifs = 0, texts = 0
  const out = []
  for (const x of tk) {
    if (!x || typeof x.v !== 'string') return null
    if (x.k === 'e' && EMOJI_SET.has(x.v)) out.push({ k: 'e', v: x.v })
    else if (x.k === 'p' && stage >= 2 && PHRASE_MAP[x.v]) out.push({ k: 'p', v: x.v })
    else if (x.k === 'g' && stage >= 3 && GIF_OK.test(x.v) && x.v.length < 300 && ++gifs <= 1) out.push({ k: 'g', v: x.v, e: typeof x.e === 'string' ? x.e.slice(0, 8) : '', w: dim(x.w), h: dim(x.h) })
    else if (x.k === 'w' && ++texts <= 1) {
      const v = x.v.trim()
      if (!v || (stage < 5 ? !validWords(v, WORDS[stage]) : v.length > 200)) return null
      out.push({ k: 'w', v })
    } else return null
  }
  return out
}
// Whisper: up to 3 words. Anything goes except numbers and links, so nobody can swap
// phone numbers or handles before both players agree to talk freely.
const dim = n => (Number.isFinite(+n) && +n > 0 ? Math.min(2000, Math.round(+n)) : 0)
const noContacts = s => !/[0-9０-９@#/\\]|https?:|www\.|\.(com|net|org|io|me|app|ge|ru|co|gg|ly|tv|xyz)\b/i.test(s)
const validWords = (s, n) => s.length <= n * 24 && wordCount(s) <= n && noContacts(s)
function validWhisper(s) {
  return s.length <= 30 && s.split(/\s+/).filter(Boolean).length <= 3 &&
    !/[0-9０-９@#/\\]|https?:|www\.|\.(com|net|org|io|me|app|ge|ru|co|gg|ly|tv|xyz)\b/i.test(s)
}

function addToken(tok) {
  if (G.tokens.length >= 5) return bump($('#tray'))
  if (tok.k === 'g') G.tokens = G.tokens.filter(x => x.k !== 'g')
  G.tokens.push(tok)
  renderTray()
  vibrate(8)
}

function renderTray() {
  const input = $('#textIn'), st = G.view.stage
  input.hidden = false
  input.placeholder = st >= 5 ? t('free_ph') : `${t('s' + st)}…`
  input.maxLength = st >= 5 ? 200 : WORDS[st] * 24
  updateCount()
}
function updateCount() {
  const input = $('#textIn'), st = G.view.stage, n = wordCount(input.value), lim = WORDS[st]
  const el = $('#wordCount')
  el.hidden = st >= 5
  el.textContent = `${n}/${lim}`
  el.classList.toggle('over', n > lim)
  $('#sendBtn').disabled = !input.value.trim() || n > lim
}

function sendMessage() {
  if (!G || G.ended || !G.them) return
  if (now() - G.lastSend < 600) return
  const input = $('#textIn')
  const text = input.value.trim()
  if (!text) return
  const tk = cleanTokens([{ k: 'w', v: text }], G.view.stage)
  if (!tk) {
    bump(input)
    toast(noContacts(text) ? t('words_err', { n: WORDS[G.view.stage] }) : t('contacts_err'))
    return
  }
  G.lastSend = now()
  const id = rid()
  net.send({ t: 'm', id, tk })
  addBubble('me', id, tk)
  G.tokens = []
  input.value = ''
  renderTray()
  vibrate(12)
  if (H) score('me')
}
$('#sendBtn').addEventListener('click', sendMessage)
addEventListener('keydown', e => {
  if (e.key !== 'Enter' || document.body.dataset.screen !== 'match' || e.target.closest?.('.gif-search, #textIn')) return
  if (G?.tokens.length) { e.preventDefault(); sendMessage() }
})
$('#textIn').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); sendMessage() } })
$('#textIn').addEventListener('input', () => G && updateCount())

// ---------------------------------------------------------------- composer tabs + panels

const TABS = [
  { id: 'emoji', stage: 1, ico: '😀', label: 'tab_emoji' },
  { id: 'phrases', stage: 2, ico: '🔤', label: 'tab_phrases' },
  { id: 'gif', stage: 3, ico: '🎞️', label: 'tab_gif' },
  { id: 'text', stage: 4, ico: '🤫', label: 'tab_text' },
]
function renderTabs() {
  $('#tabs').replaceChildren(...TABS.map(tab => {
    const open = G.view.stage >= tab.stage
    return h('button', {
      class: `tab${G.tab === tab.id ? ' on' : ''}${open ? '' : ' locked'}`,
      'aria-label': open ? t(tab.label) : `${t(tab.label)} · ${t('locked')}`,
      style: `--c: var(--s${tab.stage})`,
      onclick: () => {
        if (!open) return bump($('#ladder'))
        if (tab.id === 'text') { $('#textIn').focus(); return }
        G.tab = tab.id
        renderTabs()
        renderPanel()
      },
    }, icon(open ? 's' + tab.stage : 'lock'), h('span', {}, t(tab.label)))
  }))
}

function renderPanel() {
  const panel = $('#panel')
  if (G.tab === 'emoji') {
    panel.replaceChildren(h('div', { class: 'grid emoji-grid' },
      EMOJI.map(e => h('button', { class: 'key', onclick: () => addToken({ k: 'e', v: e }) }, e))))
  } else if (G.tab === 'phrases') {
    panel.replaceChildren(h('div', { class: 'chips' },
      PHRASES.map(p => h('button', { class: 'chip-btn', onclick: () => addToken({ k: 'p', v: p.id }) }, p[lang]))))
  } else if (G.tab === 'gif') {
    renderGifPanel(panel)
  }
}

let gifQuery = '', gifTimer = null
function renderGifPanel(panel) {
  if (!CONFIG.GIPHY_API_KEY) {
    panel.replaceChildren(h('div', { class: 'grid emoji-grid' },
      Object.entries(NOTO).map(([e, code]) => h('button', { class: 'key gif-key', onclick: () => addToken({ k: 'g', v: notoUrl(code), e, w: 512, h: 512 }) }, e))))
    return
  }
  const grid = h('div', { class: 'gif-grid' })
  const input = h('input', { class: 'gif-search', type: 'search', placeholder: t('gif_search'), value: gifQuery, enterkeyhint: 'search' })
  input.addEventListener('input', () => {
    clearTimeout(gifTimer)
    gifTimer = setTimeout(() => { gifQuery = input.value.trim(); loadGifs(grid) }, 400)
  })
  panel.replaceChildren(input, grid, h('p', { class: 'giphy' }, 'Powered by GIPHY'))
  loadGifs(grid)
}
async function loadGifs(grid) {
  const base = 'https://api.giphy.com/v1/gifs/'
  const q = new URLSearchParams({ api_key: CONFIG.GIPHY_API_KEY, limit: '24', rating: 'pg-13', ...(gifQuery ? { q: gifQuery } : {}) })
  try {
    const res = await fetch(`${base}${gifQuery ? 'search' : 'trending'}?${q}`)
    const { data } = await res.json()
    grid.replaceChildren(...data.map(g => {
      const sm = g.images.fixed_height_small, big = g.images.fixed_height || sm
      const thumb = sm.webp || sm.url, url = big.webp || big.url
      return h('button', { class: 'gif', onclick: () => addToken({ k: 'g', v: url, thumb, w: +big.width, h: +big.height }) },
        h('img', { src: thumb, alt: g.title || '', loading: 'lazy', referrerpolicy: 'no-referrer' }))
    }))
  } catch {
    grid.replaceChildren(h('p', { class: 'muted' }, '🎞️ …'))
  }
}

// ---------------------------------------------------------------- feed

function addBubble(who, id, tk) {
  const onlyEmoji = tk.every(x => x.k === 'e')
  const onlyGif = tk.length === 1 && tk[0].k === 'g'
  const bubble = h('div', { class: `bubble${onlyEmoji ? ' big' : ''}${onlyGif ? ' has-gif' : ''}`, 'data-id': id })
  for (const x of tk) {
    if (x.k === 'e') { bubble.append(h('span', { class: 'e' }, x.v)); G.story.push(x.v) }
    else if (x.k === 'p') {
      const translated = who === 'them' && G.them?.lang !== lang
      bubble.append(h('span', { class: 'card' }, PHRASE_MAP[x.v][lang], translated && h('sup', { title: t('translated') }, '🌐')))
    } else if (x.k === 'g') {
      const gw = x.w || 160, gh = x.h || 160, k = Math.min(1, 220 / Math.max(gw, gh))
      bubble.append(h('img', { class: 'gif-msg', src: x.v, alt: x.e || 'GIF', referrerpolicy: 'no-referrer',
        width: Math.round(gw * k), height: Math.round(gh * k),
        onload: () => { const f = $('#feed'); f.scrollTo({ top: f.scrollHeight, behavior: 'smooth' }) } }))
      G.story.push(x.e || '🎞️')
    } else if (x.k === 'w') { bubble.append(h('span', { class: 'w' }, hideLinks(x.v))); G.story.push(hideLinks(x.v)) }
  }
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
    h('button', { onclick: ev => {
      ev.stopPropagation()
      pop.remove()
      if (!G || G.ended) return
      if (addReaction(id, e, 'theirs', 'me')) {
        net.send({ t: 'r', id, e })
        if (H) score('me')
      }
    } }, e)))
  bubble.after(pop)
  setTimeout(() => pop.remove(), 4000)
}

// whose: which side's bubble ('mine' = a bubble I sent). by: who reacted.
function addReaction(id, e, whose, by = 'them') {
  const sel = `.row.${whose === 'mine' ? 'me' : 'them'} .bubble[data-id="${CSS.escape(id)}"]`
  const bubble = $('#feed').querySelector(sel)
  if (!bubble || bubble.querySelector(`.react.${by}`)) return false
  bubble.append(h('span', { class: `react ${by}` }, e))
  return true
}

// ---------------------------------------------------------------- jinx

function showJinx(id, opts) {
  removeJinx(G.jinx?.id)
  G.jinx = { id, mine: null }
  const card = h('div', { class: 'jinx', 'data-jinx': id },
    h('p', { class: 'jinx-title' }, t('jinx_title')),
    h('div', { class: 'jinx-opts' }, opts.map(o => h('button', { class: 'jinx-opt', 'data-o': o, onclick: () => pickJinx(id, o) }, jw(o)))),
    h('p', { class: 'jinx-status' }),
    h('span', { class: 'jinx-timer' }))
  pushFeed(card)
  vibrate(15)
}
function pickJinx(id, o) {
  if (!G.jinx || G.jinx.id !== id || G.jinx.mine) return
  G.jinx.mine = o
  const card = $(`[data-jinx="${CSS.escape(id)}"]`)
  card.classList.add('picked')
  card.querySelector(`[data-o="${CSS.escape(o)}"]`)?.classList.add('mine')
  card.querySelector('.jinx-status').textContent = t('jinx_wait')
  if (H) hostJinxPick('me', id, o)
  else net.send({ t: 'jp', id, pick: o })
}
function revealJinx(res) {
  const card = $(`[data-jinx="${CSS.escape(String(res.id))}"]`)
  if (!card) return
  const mine = G.host ? res.host : res.guest, theirs = G.host ? res.guest : res.host
  card.classList.add('done', res.hit ? 'hit' : 'miss')
  card.querySelector('.jinx-opts').replaceChildren(
    h('div', { class: 'jinx-side' }, h('span', { class: 'jinx-who' }, t('you')), h('span', { class: 'jinx-pick' }, jw(mine))),
    h('div', { class: 'jinx-vs' }, res.hit ? '=' : '≠'),
    h('div', { class: 'jinx-side' }, h('span', { class: 'jinx-who' }, t('stranger')), h('span', { class: 'jinx-pick' }, jw(theirs))))
  card.querySelector('.jinx-status').textContent = res.hit ? t('jinx_hit') : t('jinx_miss')
  if (res.hit) { confetti(); vibrate([20, 40, 20]) }
  
  G.jinx = null
}
function removeJinx(id) {
  if (!id) return
  const card = $(`[data-jinx="${CSS.escape(id)}"]`)
  if (card && !card.classList.contains('done')) card.remove()
  if (G?.jinx?.id === id) G.jinx = null
}


// ---------------------------------------------------------------- scale

function cleanScale(m) {
  const S = Number.isInteger(m.sc) && SCALES[m.sc]
  if (!S || !Array.isArray(m.opts) || !['h', 'g'].includes(m.giver)) return null
  const opts = m.opts.filter(i => Number.isInteger(i) && S.words[i]).slice(0, 4)
  const target = pct(m.target)
  if (!opts.length || target == null) return null
  return { id: String(m.id).slice(0, 12), sc: m.sc, opts, giver: m.giver, target }
}
function cleanClue(c, opts) {
  if (!c || typeof c !== 'object') return null
  if (Number.isInteger(c.i) && opts.includes(c.i)) return { i: c.i }
  if (typeof c.v === 'string') { const v = c.v.trim(); if (v && validWords(v, 1)) return { v } }
  return null
}
const scaleCard = id => $(`[data-scale="${CSS.escape(String(id))}"]`)

function showScale({ id, sc, opts, giver, target }) {
  removeScale(G.scale?.id)
  const mine = (giver === 'h') === G.host
  G.scale = { id, sc, opts, mine, target, clue: null, pos: 50, ghost: null, locked: false, done: false, own: false, sentAt: 0 }
  const S = SCALES[sc]
  const range = h('input', { class: 'scale-range', type: 'range', min: 0, max: 100, value: 50, 'aria-label': t('scale_title') })
  range.addEventListener('input', () => moveGuess(id, +range.value))
  pushFeed(h('div', { class: 'jinx scale', 'data-scale': id },
    h('p', { class: 'jinx-title' }, `${t('scale_title')} · ${L(S.topic)}`),
    h('div', { class: 'scale-clue' }),
    h('div', { class: 'scale-track' },
      h('div', { class: 'scale-bar' }),
      h('div', { class: 'scale-rail' },
        h('span', { class: 'scale-zone' }), h('span', { class: 'scale-bull' }), h('span', { class: 'scale-target' }), h('span', { class: 'scale-guess' })),
      range),
    h('div', { class: 'scale-poles' }, h('span', {}, L(S.a)), h('span', {}, L(S.b))),
    h('div', { class: 'scale-act' }),
    h('span', { class: 'jinx-timer', style: `animation-duration: ${SCALE_MS}ms` })))
  updateScale()
  vibrate(15)
}

// Redraw the card for the current step. Called on step changes only, never while dragging.
function updateScale() {
  const s = G?.scale
  const card = s && scaleCard(s.id)
  if (!card) return
  const S = SCALES[s.sc], hasClue = s.clue != null
  card.classList.toggle('show-target', s.mine || s.done)
  card.classList.toggle('thumb', !s.mine && hasClue && !s.done)
  band(card.querySelector('.scale-zone'), s.target, 20)
  band(card.querySelector('.scale-bull'), s.target, 8)
  card.querySelector('.scale-target').style.left = `${s.target}%`
  const range = card.querySelector('.scale-range')
  range.disabled = s.mine || !hasClue || s.locked || s.done
  card.querySelector('.scale-clue').replaceChildren(hasClue
    ? h('span', { class: 'scale-word' }, quote(clueText(s.sc, s.clue)))
    : h('span', { class: 'scale-ask' }, s.mine ? t('scale_give') : t('scale_wait_clue')))
  const status = text => h('p', { class: 'jinx-status' }, text)
  const act = card.querySelector('.scale-act')
  if (s.done) act.replaceChildren(h('p', { class: `scale-result ${s.grade}` }, t('scale_' + s.grade)))
  else if (s.mine && !hasClue) act.replaceChildren(h('div', { class: 'scale-opts' },
    s.opts.map(i => h('button', { class: 'scale-opt', type: 'button', onclick: () => giveClue(s.id, { i }) }, L(S.words[i]))),
    s.own ? ownWord(s) : h('button', { class: 'scale-opt own', type: 'button', onclick: () => {
      s.own = true
      updateScale()
      card.querySelector('.scale-own')?.focus()
    } }, t('scale_own'))))
  else if (s.mine) act.replaceChildren(status(t('scale_wait_guess')))
  else if (!hasClue) act.replaceChildren()
  else if (!s.locked) act.replaceChildren(status(t('scale_guess')),
    h('button', { class: 'btn primary sm', type: 'button', onclick: () => lockGuess(s.id) }, t('scale_lock')))
  else act.replaceChildren(status(t('jinx_wait')))
  placeGuess(card, s.done ? s.pos : s.mine ? s.ghost : null)
}
function band(el, c, r) {
  const lo = Math.max(0, c - r), hi = Math.min(100, c + r)
  el.style.left = `${lo}%`
  el.style.width = `${hi - lo}%`
}
function placeGuess(card, p) {
  const g = card.querySelector('.scale-guess')
  g.hidden = p == null
  if (p != null) g.style.left = `${p}%`
}
function ownWord(s) {
  const input = h('input', { class: 'scale-own', type: 'text', maxlength: 24, placeholder: t('scale_own_ph'), enterkeyhint: 'send', autocomplete: 'off' })
  const go = () => {
    const v = input.value.trim()
    if (!v) return
    if (!validWords(v, 1)) { bump(input); return toast(t('scale_word_err')) }
    giveClue(s.id, { v })
  }
  input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); go() } })
  return h('div', { class: 'scale-own-row' }, input, h('button', { class: 'send', type: 'button', 'aria-label': t('send'), onclick: go }, icon('send')))
}

// The hint giver picked a word.
function giveClue(id, clue) {
  const s = G.scale
  if (!s || s.id !== id || !s.mine || s.clue != null) return
  s.clue = cleanClue(clue, s.opts)
  if (!s.clue) return
  net.send({ t: 'scc', id, clue: s.clue })
  updateScale()
  vibrate(10)
  if (H) hostClue(id, s.clue)
}
function onClue(m) {
  const s = G.scale
  if (!s || s.id !== String(m.id) || s.mine || s.clue != null) return
  const clue = cleanClue(m.clue, s.opts)
  if (!clue) return
  s.clue = clue
  updateScale()
  vibrate(10)
  if (H) hostClue(s.id, clue)
}

// The guesser drags: the hint giver watches the marker move live.
function moveGuess(id, pos) {
  const s = G.scale
  if (!s || s.id !== id || s.mine || s.locked || s.clue == null) return
  s.pos = pos
  const sendPos = () => { s.sentAt = now(); if (!s.locked) net.send({ t: 'scm', id, pos: s.pos }) }
  clearTimeout(s.trail)
  if (now() - s.sentAt > 90) sendPos()
  else s.trail = setTimeout(sendPos, 100)
}
function onGhost(m) {
  const s = G.scale, pos = pct(m.pos)
  if (!s || s.id !== String(m.id) || !s.mine || s.done || pos == null) return
  s.ghost = pos
  const card = scaleCard(s.id)
  if (card) placeGuess(card, pos)
  if (H) H.lastActivity = now()
}

function lockGuess(id) {
  const s = G.scale
  if (!s || s.id !== id || s.mine || s.locked || s.clue == null) return
  s.locked = true
  net.send({ t: 'scg', id, pos: s.pos })
  updateScale()
  if (H) hostGuess(id, s.pos)
}
function onGuess(m) {
  const s = G.scale, pos = pct(m.pos)
  if (!s || s.id !== String(m.id) || !s.mine || pos == null) return
  s.ghost = pos
  s.locked = true
  updateScale()
  if (H) hostGuess(s.id, pos)
}

function revealScale(res) {
  const s = G.scale
  const pos = pct(res.pos), target = pct(res.target)
  if (!s || s.id !== String(res.id) || pos == null || target == null || !['bull', 'close', 'far'].includes(res.grade)) return
  Object.assign(s, { pos, target, grade: res.grade, done: true, locked: true })
  scaleCard(s.id)?.classList.add('done', res.grade === 'bull' ? 'hit' : 'miss')
  updateScale()
  G.story.push(clueText(s.sc, s.clue))
  if (res.grade === 'bull') { confetti(); vibrate([20, 40, 20]) }
  G.scale = null
}
function removeScale(id) {
  if (!id) return
  const card = scaleCard(id)
  if (card && !card.classList.contains('done')) card.remove()
  if (G?.scale?.id === id) G.scale = null
}

// ---------------------------------------------------------------- effects

function levelUpFx(stage) {
  const o = $('#overlay')
  o.style.setProperty('--c', `var(--s${stage})`)
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
  levelUpFx.t = setTimeout(() => (o.hidden = true), 1900)
}

// Paper confetti in the stage colors.
const CONFETTI = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)', 'var(--s5)']
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

function bump(el) {
  el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump')
}
function toast(text) {
  const el = $('#toast')
  el.textContent = text
  el.hidden = false
  clearTimeout(toast.t)
  toast.t = setTimeout(() => (el.hidden = true), 1800)
}

// ---------------------------------------------------------------- postcard

function renderPostcard(why) {
  const v = G.view
  const dur = now() - (G.connectedAt || G.startedAt)
  const story = G.story.slice(0, 10)
  const flag = flagOf(G.them?.cc) || '🌍'
  $('#postcard').replaceChildren(...[
    h('p', { class: 'pc-kicker' }, t('the_end')),
    h('p', { class: 'pc-end' }, t('end_' + why)),
    h('div', { class: 'pc-pair' },
      h('span', { class: 'ava you' }),
      h('span', { class: 'pc-amp' }, '+'),
      h('span', { class: 'ava', style: `--hue:${G.hue}` }),
      h('span', { class: 'pc-flag' }, flag)),
    h('div', { class: 'pc-stage' },
      h('span', { class: 'lv-ico' }, icon('s' + G.maxStage)),
      h('div', {}, h('p', { class: 'pc-kicker' }, t('reached')), h('p', { class: 'pc-stage-name' }, t('s' + G.maxStage)))),
    h('div', { class: 'pc-stats' },
      stat(mmss(dur), t('stat_time')), stat(v.volleys, t('stat_volleys')), stat(v.jinxes, t('stat_jinx'))),
    story.length > 0 && h('div', { class: 'pc-story' }, h('p', { class: 'pc-kicker' }, t('story')), h('p', { class: 'pc-strip' }, story.join(' · '))),
  ].filter(Boolean))
  $('#shareBtn').onclick = () =>
    share(t('share_text', { brand: CONFIG.BRAND, stage: t('s' + G.maxStage), emoji: '' }), $('#shareBtn'))
}
const stat = (n, label) => h('div', { class: 'stat' }, h('b', {}, String(n)), h('span', {}, label))

// ---------------------------------------------------------------- boot

hydrateIcons()
applyLang()
const inviteCode = new URLSearchParams(location.search).get('invite')
if (/^[a-z0-9]{6,20}$/.test(inviteCode || '')) joinInvite(inviteCode)
else show('landing')
