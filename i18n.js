// UI text and the shared phrasebook. English is the source; Georgian is written alongside it.
// Phrases travel between players as IDs, so each screen shows them in its own language.

export const LANGS = ['en', 'ka']
export const LANG_NAME = { en: 'English', ka: 'ქართული' }

export const STR = {
  en: {
    tagline: 'Meet a stranger. Earn your words.',          // landing, under the logo
    sub: 'Every chat starts as a silent film.',            // landing, small line
    lead: 'Start with emoji. Take turns to unlock words.',  // landing, under the headline
    demo_text: 'Okay, this is fun',                        // landing demo, the free-chat message
    stage_of: 'Stage {n} of 5',                            // match header, {n} = current stage
    find: 'Find a stranger',                               // landing, main button
    online_one: '1 person here now',                       // landing + search, {n} = 1
    online_other: '{n} people here now',                   // landing + search, {n} = count
    alone: 'Just you here right now',                      // landing + search, nobody else online
    searching: 'Looking for a stranger…',                  // search screen title
    quiet: 'It’s quiet right now',                         // search, after 20 s
    invite: 'Invite a friend',                             // search, makes a private link
    invite_text: 'Talk to a stranger without words',       // share sheet text for an invite
    invite_btn: 'Invite a friend',                         // landing, secondary button next to Find
    invite_title: 'Invite a friend',                       // invite screen title
    invite_sub: 'Send this private link. You’ll be connected as soon as they open it.', // invite screen
    copy: 'Copy',                                          // invite screen, copy button
    invite_wait: 'Waiting for your friend…',               // invite screen status
    invite_share_text: 'Join me on Talkies. We start with emoji only.', // share sheet text for a private link
    joining: 'Joining your friend…',                       // opened an invite link
    friend_gone: 'Your friend isn’t here right now',       // invite link opened but nobody is waiting
    cancel: 'Cancel',
    connecting: 'Connecting…',                             // match, before the hello arrives
    intro_title: 'You’re connected',                       // match, welcome card title
    intro_hint: 'Say hi with an emoji',                    // match, welcome card hint
    next: 'Next',                                          // match, skip button
    stranger: 'Stranger',
    jinx_title: 'Same pick?',                              // jinx card title
    jinx_hit: 'Jinx!',                                     // both picked the same
    jinx_miss: 'Different taste',                          // picks differ
    jinx_wait: 'Waiting for them…',                        // I picked, they haven't
    hint: 'Take turns to unlock the next one',             // spark meter caption
    s1: 'Silent', s2: 'Title cards', s3: 'Reels', s4: 'Whisper', s5: 'Free chat',            // stage names
    d1: 'Emoji only', d2: 'Words and phrases', d3: 'GIFs', d4: '3 words of text', d5: 'Say anything', // stage descriptions
    unlocked: 'Unlocked',                                  // level-up overlay
    next_unlock: 'Next:',                                  // progress bar, before the next stage name
    consent_ask: 'Open free chat? You both have to agree', // stage 4 → 5 gate
    consent_btn: 'I’m in',
    consent_wait: 'You’re in. Waiting for them…',
    consent_them: 'They’re in',
    whisper_ph: 'Up to 3 words…',                          // text input, stage 4
    free_ph: 'Say anything…',                              // text input, stage 5
    whisper_err: 'Up to 3 words, no numbers or links',
    gif_search: 'Search GIFs',
    tray_hint: 'Tap below to build a message',            // empty message tray, stages 1–3
    tab_emoji: 'Emoji', tab_phrases: 'Phrases', tab_gif: 'GIFs', tab_text: 'Text', // tab labels (also aria)
    locked: 'Locked',
    send: 'Send', clear: 'Clear', you: 'You', time_left: 'Time left', react: 'React', translated: 'Translated',
    the_end: 'The end',                                    // postcard header, film end card
    end_fizzle: 'The spark fizzled',
    end_left: 'They left',
    end_lost: 'Connection lost',
    reached: 'Reached',
    stat_time: 'Time', stat_volleys: 'Volleys', stat_jinx: 'Jinxes',
    story: 'Your story',
    next_stranger: 'Next stranger',
    share: 'Share',
    copied: 'Copied',
    share_text: 'We reached {stage} on {brand} without a single word {emoji}', // {brand} = app name, {stage} = stage name, {emoji} = story
    link_hidden: 'link hidden',
  },
  ka: {
    tagline: 'გაიცანით უცნობი. დაიმსახურეთ სიტყვები.',
    sub: 'ყველა საუბარი მუნჯი კინოთი იწყება.',
    lead: 'დაიწყეთ ემოჯით. მონაცვლეობით გახსენით სიტყვები.',
    demo_text: 'კარგი, ეს მართლა მაგარია',
    stage_of: 'ეტაპი {n} / 5',
    find: 'უცნობის პოვნა',
    online_one: 'ახლა აქ 1 ადამიანია',
    online_other: 'ახლა აქ {n} ადამიანია',
    alone: 'ახლა აქ მარტო ხართ',
    searching: 'უცნობს ვეძებთ…',
    quiet: 'ახლა წყნარა',
    invite: 'მეგობრის მოწვევა',
    invite_text: 'უცნობთან საუბარი სიტყვების გარეშე',
    invite_btn: 'მეგობრის მოწვევა',
    invite_title: 'მეგობრის მოწვევა',
    invite_sub: 'გაუგზავნეთ ეს პირადი ბმული. გახსნისთანავე დაგაკავშირებთ.',
    copy: 'კოპირება',
    invite_wait: 'მეგობარს ველოდებით…',
    invite_share_text: 'შემოდი Talkies-ზე, მხოლოდ ემოჯით ვიწყებთ.',
    joining: 'მეგობართან დაკავშირება…',
    friend_gone: 'მეგობარი ახლა აქ არ არის',
    cancel: 'გაუქმება',
    connecting: 'დაკავშირება…',
    intro_title: 'დაკავშირდით',
    intro_hint: 'მიესალმეთ ემოჯით',
    next: 'შემდეგი',
    stranger: 'უცნობი',
    jinx_title: 'დაემთხვევა?',
    jinx_hit: 'დაემთხვა!',
    jinx_miss: 'სხვადასხვა გემოვნება',
    jinx_wait: 'უცნობს ველოდებით…',
    hint: 'მონაცვლეობით გაგზავნეთ და შემდეგი გაიხსნება',
    s1: 'მუნჯი', s2: 'ტიტრები', s3: 'კადრები', s4: 'ჩურჩული', s5: 'თავისუფალი ჩატი',
    d1: 'მხოლოდ ემოჯი', d2: 'სიტყვები და ფრაზები', d3: 'GIF‑ები', d4: 'ტექსტი, მაქსიმუმ 3 სიტყვა', d5: 'თქვით, რაც გინდათ',
    unlocked: 'გაიხსნა',
    next_unlock: 'შემდეგი:',
    consent_ask: 'გავხსნათ თავისუფალი ჩატი? საჭიროა ორივეს თანხმობა',
    consent_btn: 'თანახმა ვარ',
    consent_wait: 'თანახმა ხართ. უცნობს ველოდებით…',
    consent_them: 'უცნობი თანახმაა',
    whisper_ph: 'მაქსიმუმ 3 სიტყვა…',
    free_ph: 'დაწერეთ რამე…',
    whisper_err: 'მაქსიმუმ 3 სიტყვა, ციფრებისა და ბმულების გარეშე',
    gif_search: 'GIF‑ების ძიება',
    tray_hint: 'შეტყობინება ქვემოთ ააწყვეთ',
    tab_emoji: 'ემოჯი', tab_phrases: 'ფრაზები', tab_gif: 'GIF‑ები', tab_text: 'ტექსტი',
    locked: 'დაკეტილია',
    send: 'გაგზავნა', clear: 'გასუფთავება', you: 'თქვენ', time_left: 'დარჩენილი დრო', react: 'რეაქცია', translated: 'ნათარგმნია',
    the_end: 'დასასრული',
    end_fizzle: 'ნაპერწკალი ჩაქრა',
    end_left: 'უცნობი წავიდა',
    end_lost: 'კავშირი გაწყდა',
    reached: 'მიღწეული ეტაპი',
    stat_time: 'დრო', stat_volleys: 'მიმოცვლა', stat_jinx: 'დამთხვევა',
    story: 'თქვენი ისტორია',
    next_stranger: 'შემდეგი უცნობი',
    share: 'გაზიარება',
    copied: 'დაკოპირდა',
    share_text: '{brand}-ზე ერთი სიტყვის გარეშე მივაღწიეთ ეტაპს: {stage} {emoji}',
    link_hidden: 'ბმული დამალულია',
  },
}

// Stage 2 phrasebook. Order = order in the picker.
export const PHRASES = [
  ['hi', 'Hi', 'გამარჯობა'],
  ['how', 'How are you?', 'როგორ ხართ?'],
  ['good', 'I’m good', 'კარგად ვარ'],
  ['yes', 'Yes', 'კი'],
  ['no', 'No', 'არა'],
  ['maybe', 'Maybe', 'შეიძლება'],
  ['haha', 'Haha', 'ხა-ხა'],
  ['wow', 'Wow', 'ვაა'],
  ['metoo', 'Me too', 'მეც'],
  ['really', 'Really?', 'მართლა?'],
  ['why', 'Why?', 'რატომ?'],
  ['huh', 'Huh?', 'ჰა?'],
  ['me', 'Me', 'მე'],
  ['you', 'You', 'თქვენ'],
  ['where', 'Where are you from?', 'საიდან ხართ?'],
  ['love', 'Love it', 'ძალიან მომწონს'],
  ['nope', 'Not a fan', 'არ მომწონს'],
  ['cool', 'Cool', 'მაგარია'],
  ['funny', 'You’re funny', 'კარგი იუმორი გაქვთ'],
  ['hungry', 'I’m hungry', 'მშია'],
  ['sleepy', 'I’m sleepy', 'მეძინება'],
  ['guess', 'Guess!', 'გამოიცანით!'],
  ['again', 'Again!', 'კიდევ!'],
  ['thanks', 'Thanks', 'მადლობა'],
  ['sorry', 'Sorry', 'ბოდიში'],
  ['bye', 'Bye', 'ნახვამდის'],
].map(([id, en, ka]) => ({ id, en, ka }))

export const PHRASE_MAP = Object.fromEntries(PHRASES.map(p => [p.id, p]))
