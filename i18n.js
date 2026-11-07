// UI text. English is the source; Georgian is written alongside it.

export const LANGS = ['en', 'ka']
export const LANG_NAME = { en: 'English', ka: 'ქართული' }

export const STR = {
  en: {
    tagline: 'Meet a stranger. Earn your words.',          // landing headline
    lead: 'Start with GIFs only. Switch to words when you both want to.', // landing, under the headline
    find: 'Find a stranger',                               // landing, main button
    online_other: '{n} people here now',                   // landing + search, {n} = count (2 or more)
    alone: 'Just you here right now',                      // landing + search, nobody else online
    searching: 'Looking for a stranger…',                  // search screen title
    quiet: 'It’s quiet right now',                         // search, after 20 s
    invite: 'Invite a friend',                             // search, makes a private link
    invite_btn: 'Invite a friend',                         // landing, secondary button next to Find
    invite_title: 'Invite a friend',                       // invite screen title
    invite_sub: 'Send this private link. You’ll be connected as soon as they open it.', // invite screen
    copy: 'Copy',                                          // invite screen, copy button
    invite_wait: 'Waiting for your friend…',               // invite screen status
    invite_share_text: 'Join me on Talkies. We start with GIFs only.', // share sheet text for a private link
    joining: 'Joining your friend…',                       // opened an invite link
    friend_gone: 'Your friend isn’t here right now',       // invite link opened but nobody is waiting
    cancel: 'Cancel',
    connecting: 'Connecting…',                             // match, before the hello arrives
    intro_title: 'You’re connected',                       // match, welcome card title
    intro_hint: 'GIFs only for now. You can switch to text in {n} seconds', // welcome card, {n} = seconds
    next: 'Next',                                          // match, skip button (phone)
    next_stranger: 'Next stranger',
    stranger: 'Stranger',
    s1: 'GIFs only', s2: 'Free chat',                      // the two stages
    d1: 'Talk in GIFs', d2: 'Say anything',                // stage descriptions
    text_label: 'Text unlocks in',                         // sidebar, above the countdown
    text_word: 'Text',                                     // sidebar, once the countdown is done (next to Ready / Open)
    text_in: 'Text in {time}',                             // match header, {time} = m:ss
    text_ready: 'You can switch to text now',              // match header, countdown done
    ready: 'Ready', open: 'Open',                          // sidebar countdown when done / after switching
    unlocked: 'Unlocked',                                  // level-up overlay
    consent_ask: 'Switch to text? You both have to agree',
    consent_btn: 'I’m in',
    consent_wait: 'You’re in. Waiting for them…',
    consent_them: 'They want to switch to text',
    gif_search: 'Search GIFs',
    gif_none: 'No GIFs found',
    gif_error: 'GIFs didn’t load. Try again',
    free_ph: 'Say anything…',                              // text field
    send: 'Send', react: 'React',
    the_end: 'The end',                                    // end card header
    end_left: 'They left',
    end_lost: 'Connection lost',
    reached: 'Reached',
    stat_time: 'Time', stat_gifs: 'GIFs', stat_texts: 'Messages',
    story: 'Your GIFs',
    share: 'Share',
    copied: 'Copied',
    share_text: 'I met a stranger on {brand}. We started with GIFs only.', // {brand} = app name
    link_hidden: 'link hidden',
  },
  ka: {
    tagline: 'გაიცანით უცნობი. დაიმსახურეთ სიტყვები.',
    lead: 'დაიწყეთ მხოლოდ GIF‑ებით. სიტყვებზე გადადით, როცა ორივეს მოგინდებათ.',
    find: 'უცნობის პოვნა',
    online_other: 'ახლა აქ {n} ადამიანია',
    alone: 'ახლა აქ მარტო ხართ',
    searching: 'უცნობს ვეძებთ…',
    quiet: 'ახლა წყნარა',
    invite: 'მეგობრის მოწვევა',
    invite_btn: 'მეგობრის მოწვევა',
    invite_title: 'მეგობრის მოწვევა',
    invite_sub: 'გაუგზავნეთ ეს პირადი ბმული. გახსნისთანავე დაგაკავშირებთ.',
    copy: 'კოპირება',
    invite_wait: 'მეგობარს ველოდებით…',
    invite_share_text: 'შემოდი Talkies-ზე, მხოლოდ GIF‑ებით ვიწყებთ.',
    joining: 'მეგობართან დაკავშირება…',
    friend_gone: 'მეგობარი ახლა აქ არ არის',
    cancel: 'გაუქმება',
    connecting: 'დაკავშირება…',
    intro_title: 'დაკავშირდით',
    intro_hint: 'ჯერ მხოლოდ GIF‑ები. ტექსტზე გადასვლა {n} წამში შეგეძლებათ',
    next: 'შემდეგი',
    next_stranger: 'შემდეგი უცნობი',
    stranger: 'უცნობი',
    s1: 'მხოლოდ GIF‑ები', s2: 'თავისუფალი ჩატი',
    d1: 'ისაუბრეთ GIF‑ებით', d2: 'თქვით, რაც გინდათ',
    text_label: 'ტექსტამდე დარჩა',
    text_word: 'ტექსტი',
    text_in: 'ტექსტამდე {time}',
    text_ready: 'უკვე შეგიძლიათ ტექსტზე გადასვლა',
    ready: 'მზადაა', open: 'გახსნილია',
    unlocked: 'გაიხსნა',
    consent_ask: 'გადავიდეთ ტექსტზე? საჭიროა ორივეს თანხმობა',
    consent_btn: 'თანახმა ვარ',
    consent_wait: 'თანახმა ხართ. უცნობს ველოდებით…',
    consent_them: 'უცნობს ტექსტზე გადასვლა სურს',
    gif_search: 'GIF‑ების ძიება',
    gif_none: 'GIF‑ები ვერ მოიძებნა',
    gif_error: 'GIF‑ები ვერ ჩაიტვირთა. სცადეთ თავიდან',
    free_ph: 'დაწერეთ რამე…',
    send: 'გაგზავნა', react: 'რეაქცია',
    the_end: 'დასასრული',
    end_left: 'უცნობი წავიდა',
    end_lost: 'კავშირი გაწყდა',
    reached: 'მიღწეული ეტაპი',
    stat_time: 'დრო', stat_gifs: 'GIF', stat_texts: 'შეტყობინება',
    story: 'თქვენი GIF‑ები',
    share: 'გაზიარება',
    copied: 'დაკოპირდა',
    share_text: '{brand}-ზე უცნობი გავიცანი. მხოლოდ GIF‑ებით დავიწყეთ.',
    link_hidden: 'ბმული დამალულია',
  },
}
