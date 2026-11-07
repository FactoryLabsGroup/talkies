import { CONFIG } from './config.js?v=2'
import { STR, LANGS, LANG_NAME, PHRASES, PHRASE_MAP } from './i18n.js?v=2'
import { Net } from './net.js?v=2'

// ---------------------------------------------------------------- content

const EMOJI = ['😀','😂','🥺','😍','😮','😎','🤔','😴','🥳','😭','😡','🤯','🙃','😬','🙈','🤫',
  '👋','👍','👎','🙏','👀','🙋','👉','🤝','❤️','🔥','✨','💀','🎉','❓','🍕','☕',
  '🎵','⚽','🐶','🐱','🌍','🌙','☀️','🎮']
const EMOJI_SET = new Set(EMOJI)
const REACTIONS = ['❤️', '😂', '😮', '👀']
const AVATARS = ['🦊','🐼','🐸','🐙','🦉','🐨','🐯','🦄','🐵','🐧','🦁','🐰','🐻','🐲','🦖','🐳','🦔','🦦']
const JINX = [['🐶','🐱'],['☀️','🌙'],['🍕','🍣'],['🏔️','🏖️'],['☕','🍵'],['🎸','🎧'],['🚀','🐢'],
  ['🍦','🍫'],['📚','🎮'],['🌧️','❄️'],['🦖','🦄'],['🥐','🌮'],['🧛','🧟'],['🏙️','🌲'],['🍎','🍌','🍇'],
  ['😴','🕺'],['✈️','🚂'],['🎂','🍩'],['👽','🤖'],['🐙','🦈'],['🌶️','🍯'],['🎬','📖'],['🌅','🌃'],['🐝','🦋']]
// Animated Noto emoji (Google) — the GIF fallback when there's no GIPHY key.
const NOTO = { '😂':'1f602','🤣':'1f923','😍':'1f60d','🥰':'1f970','😭':'1f62d','😱':'1f631','🤯':'1f92f',
  '🥳':'1f973','😎':'1f60e','🤔':'1f914','🙄':'1f644','😴':'1f634','💀':'1f480','👻':'1f47b','🔥':'1f525',
  '❤️':'2764_fe0f','👋':'1f44b','👏':'1f44f','🙏':'1f64f','💃':'1f483','🎉':'1f389','🚀':'1f680','🙈':'1f648','💩':'1f4a9' }
const notoUrl = code => `https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/512.webp`
const GIF_OK = /^https:\/\/(media\d?\.giphy\.com|i\.giphy\.com|fonts\.gstatic\.com\/s\/e\/notoemoji)\//

const FAST = new URLSearchParams(location.search).has('fast')
const NEED = FAST ? { 1: 2, 2: 2, 3: 2, 4: 2 } : { 1: 4, 2: 5, 3: 5, 4: 6 }
const STAGE_ICON = [null, '😶', '🔤', '🎞️', '🤫', '🗣️']
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
}

let online = 1
function renderCount() {
  const text = online <= 1 ? t('alone') : online === 1 ? t('online_one') : t('online_other', { n: online })
  document.querySelectorAll('.online').forEach(el => (el.textContent = text))
}

// ---------------------------------------------------------------- network

const net = new Net({
  onCount: n => { online = n; renderCount() },
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
    setInterval(() => ($('#searchEmoji').textContent = faces[++i % faces.length]), 700),
    setTimeout(() => ($('#quiet').hidden = false), 20000),
  ]
}
function stopSearchUi() { searchTimers.forEach(t => { clearInterval(t); clearTimeout(t) }) }

$('#findBtn').addEventListener('click', startSearch)
$('#againBtn').addEventListener('click', startSearch)
$('#cancelBtn').addEventListener('click', () => { stopSearchUi(); net.stopSearch(); show('landing') })
$('#inviteBtn').addEventListener('click', () => share(t('invite_text'), $('#inviteBtn')))

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
  G = {
    partner, host: isHost, them: null, theyGotMine: false, ended: false,
    ava: pick(AVATARS), hue: Math.floor(Math.random() * 360),
    view: { stage: 1, spark: 0, need: NEED[1], fuse: FUSE_START, fuseMax: fuseCap(1), ac: false, cons: [false, false], volleys: 0, jinxes: 0 },
    fuseEnd: now() + FUSE_START, startedAt: now(), maxStage: 1, story: [], tokens: [], tab: 'emoji',
    lastSend: 0, timers: [], jinx: null,
  }
  H = isHost ? {
    stage: 1, spark: 0, fuse: FUSE_START, fuseMax: fuseCap(1), ac: false, cons: [false, false],
    volleys: 0, jinxes: 0, lastSender: null, lastActivity: now(), lastJinxAt: 0, opened: false,
    jinx: null, last: now(), lastPush: 0,
  } : null

  $('#feed').replaceChildren()
  $('#ava').textContent = G.ava
  $('#ava').style.setProperty('--hue', G.hue)
  $('#them').textContent = ''
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

$('#nextBtn').addEventListener('click', () => {
  if (!G || G.ended) return
  net.send({ t: 'bye' })
  clearMatchTimers()
  G.ended = true
  net.endMatch()
  startSearch()
})
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
  if (!H.jinx) {
    if (!H.opened && tNow - G.connectedAt > 1200) { H.opened = true; spawnJinx() }
    else if (H.opened && tNow - H.lastActivity > 10000 && tNow - H.lastJinxAt > 12000) spawnJinx()
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
  $('#them').replaceChildren(...[
    h('span', { class: 'flag' }, flagOf(cc) || '🌍'),
    h('span', {}, LANG_NAME[l]),
    time && h('span', { class: 'time' }, `${sky} ${time}`),
  ].filter(Boolean))
}

function renderLadder() {
  const ol = $('#ladder')
  ol.replaceChildren(...[1, 2, 3, 4, 5].map(i =>
    h('li', { class: i < G.view.stage ? 'done' : i === G.view.stage ? 'now' : '', title: t('s' + i), style: `--c: var(--s${i})` },
      h('span', { class: 'ico' }, STAGE_ICON[i]),
      i === G.view.stage && h('span', { class: 'name' }, t('s' + i)))))
}

function renderMeter() {
  const v = G.view
  const dots = $('#dots')
  if (v.stage >= 5) {
    dots.replaceChildren(h('span', { class: 'free' }, '🗣️ ' + t('d5')))
    $('#meterText').textContent = ''
    return
  }
  dots.replaceChildren(...Array.from({ length: v.need }, (_, i) => h('i', { class: i < v.spark ? 'on' : '' })),
    h('span', { class: 'next-ico' }, STAGE_ICON[v.stage + 1]))
  dots.style.setProperty('--c', `var(--s${v.stage + 1})`)
  $('#meterText').textContent = t('hint')
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
    } }, '🗣️ ' + t('consent_btn'))].filter(Boolean))
}

// ---------------------------------------------------------------- fuse

function drawFuse() {
  if (!G || G.ended) return
  const left = G.them ? Math.max(0, G.fuseEnd - now()) : G.view.fuseMax
  const pct = Math.min(1, left / G.view.fuseMax)
  const fill = $('#fuseFill')
  fill.style.transform = `scaleX(${pct})`
  $('#fuseSpark').style.left = `${pct * 100}%`
  $('#fuse').classList.toggle('low', left < 10000)
  $('#fuse').setAttribute('aria-valuenow', Math.round(left / 1000))
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
    else if (x.k === 'g' && stage >= 3 && GIF_OK.test(x.v) && x.v.length < 300 && ++gifs <= 1) out.push({ k: 'g', v: x.v, e: typeof x.e === 'string' ? x.e.slice(0, 8) : '' })
    else if (x.k === 'w' && stage >= 4 && ++texts <= 1) {
      const v = x.v.trim()
      if (!v || (stage === 4 ? !validWhisper(v) : v.length > 200)) return null
      out.push({ k: 'w', v })
    } else return null
  }
  return out
}
function validWhisper(s) {
  return s.length <= 24 && s.split(/\s+/).filter(Boolean).length <= 3 && /^[\p{L}\p{M}\s'’!?.,-]+$/u.test(s)
}

function addToken(tok) {
  if (G.tokens.length >= 5) return bump($('#tray'))
  if (tok.k === 'g') G.tokens = G.tokens.filter(x => x.k !== 'g')
  G.tokens.push(tok)
  renderTray()
  vibrate(8)
}

function renderTray() {
  const box = $('#tokens')
  box.replaceChildren(...G.tokens.map((tok, i) =>
    h('button', { class: `tok tok-${tok.k}`, 'aria-label': t('clear'), onclick: () => { G.tokens.splice(i, 1); renderTray() } },
      tok.k === 'e' ? tok.v : tok.k === 'p' ? PHRASE_MAP[tok.v][lang] : tok.k === 'g' ? h('img', { src: tok.thumb || tok.v, alt: '', referrerpolicy: 'no-referrer' }) : tok.v)))
  box.dataset.hint = t('tray_hint')
  const input = $('#textIn')
  const textOn = G.view.stage >= 4
  input.hidden = !textOn
  input.placeholder = G.view.stage >= 5 ? t('free_ph') : t('whisper_ph')
  input.maxLength = G.view.stage >= 5 ? 200 : 24
  $('#sendBtn').disabled = !G.tokens.length && !(textOn && input.value.trim())
  $('#tray').classList.toggle('has-text', textOn)
}

function sendMessage() {
  if (!G || G.ended || !G.them) return
  if (now() - G.lastSend < 600) return
  const input = $('#textIn')
  const raw = [...G.tokens.map(({ k, v, e }) => (k === 'g' ? { k, v, e } : { k, v }))]
  const text = G.view.stage >= 4 ? input.value.trim() : ''
  if (text) raw.push({ k: 'w', v: text })
  if (!raw.length) return
  const tk = cleanTokens(raw, G.view.stage)
  if (!tk) {
    bump(input)
    toast(t('whisper_err'))
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
$('#textIn').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); sendMessage() } })
$('#textIn').addEventListener('input', () => { $('#sendBtn').disabled = !G.tokens.length && !$('#textIn').value.trim() })

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
        if (!open) return bump($('#dots'))
        if (tab.id === 'text') { $('#textIn').focus(); return }
        G.tab = tab.id
        renderTabs()
        renderPanel()
      },
    }, open ? tab.ico : '🔒', h('span', {}, t(tab.label)))
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
      Object.entries(NOTO).map(([e, code]) => h('button', { class: 'key gif-key', onclick: () => addToken({ k: 'g', v: notoUrl(code), e }) }, e))))
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
      const im = g.images.fixed_height_small
      const url = im.webp || im.url
      return h('button', { class: 'gif', onclick: () => addToken({ k: 'g', v: url, thumb: url }) },
        h('img', { src: url, alt: g.title || '', loading: 'lazy', referrerpolicy: 'no-referrer' }))
    }))
  } catch {
    grid.replaceChildren(h('p', { class: 'muted' }, '🎞️ …'))
  }
}

// ---------------------------------------------------------------- feed

function addBubble(who, id, tk) {
  const onlyEmoji = tk.every(x => x.k === 'e')
  const bubble = h('div', { class: `bubble${onlyEmoji ? ' big' : ''}`, 'data-id': id })
  for (const x of tk) {
    if (x.k === 'e') { bubble.append(h('span', { class: 'e' }, x.v)); G.story.push(x.v) }
    else if (x.k === 'p') {
      const translated = who === 'them' && G.them?.lang !== lang
      bubble.append(h('span', { class: 'card' }, PHRASE_MAP[x.v][lang], translated && h('sup', { title: t('translated') }, '🌐')))
    } else if (x.k === 'g') {
      bubble.append(h('img', { class: 'gif-msg', src: x.v, alt: x.e || 'GIF', referrerpolicy: 'no-referrer',
        onload: () => { const f = $('#feed'); f.scrollTo({ top: f.scrollHeight, behavior: 'smooth' }) } }))
      G.story.push(x.e || '🎞️')
    } else if (x.k === 'w') bubble.append(h('span', { class: 'w' }, hideLinks(x.v)))
  }
  const row = h('div', { class: `row ${who}` }, who === 'them' && h('span', { class: 'mini-ava', style: `--hue:${G.hue}` }, G.ava), bubble)
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
  G.story.push(e)
  return true
}

// ---------------------------------------------------------------- jinx

function showJinx(id, opts) {
  removeJinx(G.jinx?.id)
  G.jinx = { id, mine: null }
  const card = h('div', { class: 'jinx', 'data-jinx': id },
    h('p', { class: 'jinx-title' }, t('jinx_title')),
    h('div', { class: 'jinx-opts' }, opts.map(o => h('button', { class: 'jinx-opt', 'data-o': o, onclick: () => pickJinx(id, o) }, o))),
    h('p', { class: 'jinx-status' }))
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
    h('div', { class: 'jinx-side' }, h('span', { class: 'jinx-who' }, t('you')), h('span', { class: 'jinx-pick' }, mine)),
    h('div', { class: 'jinx-vs' }, res.hit ? '⚡' : '·'),
    h('div', { class: 'jinx-side' }, h('span', { class: 'jinx-who' }, G.ava), h('span', { class: 'jinx-pick' }, theirs)))
  card.querySelector('.jinx-status').textContent = res.hit ? t('jinx_hit') : t('jinx_miss')
  if (res.hit) { confetti([mine, '✨', '⚡', '🎉']); vibrate([20, 40, 20]) }
  if (typeof mine === 'string') G.story.push(mine)
  G.jinx = null
}
function removeJinx(id) {
  if (!id) return
  const card = $(`[data-jinx="${CSS.escape(id)}"]`)
  if (card && !card.classList.contains('done')) card.remove()
  if (G?.jinx?.id === id) G.jinx = null
}

// ---------------------------------------------------------------- effects

function levelUpFx(stage) {
  const o = $('#overlay')
  o.style.setProperty('--c', `var(--s${stage})`)
  o.replaceChildren(
    h('div', { class: 'lv-ico' }, STAGE_ICON[stage]),
    h('p', { class: 'lv-kicker' }, t('unlocked')),
    h('p', { class: 'lv-name' }, t('s' + stage)),
    h('p', { class: 'lv-desc' }, t('d' + stage)))
  o.hidden = false
  o.classList.remove('play'); void o.offsetWidth; o.classList.add('play')
  confetti([STAGE_ICON[stage], '✨', '🎉'])
  vibrate([30, 50, 30])
  clearTimeout(levelUpFx.t)
  levelUpFx.t = setTimeout(() => (o.hidden = true), 1900)
}

function confetti(chars) {
  const layer = $('#confetti')
  for (let i = 0; i < 18; i++) {
    const s = h('span', { class: 'bit' }, pick(chars))
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
  const story = G.story.slice(-48)
  const flag = flagOf(G.them?.cc) || '🌍'
  $('#postcard').replaceChildren(
    h('p', { class: 'pc-end' }, t('the_end')),
    h('p', { class: 'pc-why' }, t('end_' + why), ' ', why === 'fizzle' ? '💨' : '👋'),
    h('div', { class: 'pc-pair' },
      h('span', { class: 'pc-ava you' }, '🙂'),
      h('span', { class: 'pc-amp' }, '+'),
      h('span', { class: 'pc-ava', style: `--hue:${G.hue}` }, G.ava),
      h('span', { class: 'pc-flag' }, flag)),
    h('div', { class: 'pc-stage', style: `--c: var(--s${G.maxStage})` },
      h('span', { class: 'pc-kicker' }, t('reached')),
      h('span', { class: 'pc-stage-name' }, `${STAGE_ICON[G.maxStage]} ${t('s' + G.maxStage)}`)),
    h('div', { class: 'pc-stats' },
      stat(mmss(dur), t('stat_time')), stat(v.volleys, t('stat_volleys')), stat(v.jinxes, t('stat_jinx'))),
    story.length > 0 ? h('div', { class: 'pc-story' }, h('p', { class: 'pc-kicker' }, t('story')), h('p', { class: 'pc-strip' }, story.join(''))) : '')
  $('#shareBtn').onclick = () =>
    share(t('share_text', { brand: CONFIG.BRAND, stage: `${STAGE_ICON[G.maxStage]} ${t('s' + G.maxStage)}`, emoji: story.slice(0, 12).join('') }), $('#shareBtn'))
}
const stat = (n, label) => h('div', { class: 'stat' }, h('b', {}, String(n)), h('span', {}, label))

// ---------------------------------------------------------------- boot

applyLang()
show('landing')
