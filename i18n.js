// UI text. English is the source; Georgian is written alongside it.
// Keys ending in _1, _2, _3 belong to that step of the ladder. A key with `_one` is used instead
// of the plain one when the count is 1.

export const LANGS = ['en', 'ka']

export const STR = {
  en: {
    tagline: 'Meet a stranger. Earn your words.',          // landing headline
    lead: 'Start with GIFs. Words, voice and contacts open up step by step, if you both want them.', // landing, under the headline
    find: 'Find a stranger',                               // landing, main button
    online_other: '{n} people here now',                   // landing + search, {n} = count (2 or more)
    alone: 'Just you here right now',                      // landing + search, nobody else online
    searching: 'Looking for a stranger…',                  // search screen title
    quiet: 'It’s quiet right now',                         // search, after 20 s
    invite: 'Invite a friend',                             // search, makes a private link
    invite_btn: 'Invite a friend',                         // landing, secondary button next to Find
    invite_title: 'Invite a friend',                       // invite screen title
    invite_sub: 'Send this private link. You’ll be connected as soon as they open it.', // invite screen
    copy: 'Copy',                                          // invite screen + contact card, copy button
    invite_wait: 'Waiting for your friend…',               // invite screen status
    invite_share_text: 'Join me on Talkies. We start with GIFs only.', // share sheet text for a private link
    joining: 'Joining your friend…',                       // opened an invite link
    friend_gone: 'Your friend isn’t here right now',       // invite link opened but nobody is waiting
    cancel: 'Cancel',
    connecting: 'Connecting…',                             // match, before the hello arrives
    intro_title: 'You’re connected',                       // match, welcome card title
    intro_hint: 'GIFs only for now. You can switch to text in {n} seconds if you each send at least {g} GIFs', // welcome card, {n} = seconds, {g} = GIFs per person
    you: 'You',
    next: 'Next',                                          // match, skip button (phone)
    next_stranger: 'Next stranger',
    stranger: 'Stranger',

    // The four steps: name, what it is, and the line shown while it's still locked.
    s1: 'Wordless', d1: 'GIFs only',
    s2: 'In words', d2: 'Text and GIFs', u2: 'Unlocks text',
    s3: 'By voice', d3: 'Voice messages', u3: 'Unlocks voice messages',
    s4: 'Introduced', d4: 'Swap contacts', u4: 'Unlocks contact swap',
    // A finished step in the sidebar, {n} = messages of that kind sent in it by both of you
    done_1: '{n} GIFs', done_1_one: '1 GIF',
    done_2: '{n} messages', done_2_one: '1 message',
    done_3: '{n} voice messages', done_3_one: '1 voice message',
    // Sidebar card on the current step, {n} = how many each person sends
    need_1: 'To text: {n} GIFs each', need_1_one: 'To text: 1 GIF each',
    need_2: 'To voice: {n} messages each', need_2_one: 'To voice: 1 message each',
    need_3: 'To contacts: {n} voice messages each', need_3_one: 'To contacts: 1 voice message each',
    time: 'Time',                                          // sidebar card, next to the countdown
    // Match header hint while the countdown runs, {time} = m:ss
    in_1: 'Text in {time}', in_2: 'Voice in {time}', in_3: 'Contacts in {time}',
    // Match header hint when time is up but I still have to send some, {n} = how many more
    more_1: 'Send {n} more GIFs to unlock text', more_1_one: 'Send 1 more GIF to unlock text',
    more_2: 'Send {n} more messages to unlock voice', more_2_one: 'Send 1 more message to unlock voice',
    more_3: 'Send {n} more voice messages to unlock contacts', more_3_one: 'Send a voice message to unlock contacts',
    // ...when it's the stranger who still has to send some
    wait_1: 'Waiting for the stranger’s GIFs', wait_2: 'Waiting for the stranger’s messages', wait_3: 'Waiting for the stranger’s voice message',
    // ...when the next step can be opened
    ready_1: 'You can switch to text now', ready_2: 'You can turn on voice messages now', ready_3: 'You can swap contacts now',
    // Consent bar above the composer
    ask_1: 'Switch to text? You both have to agree',
    ask_2: 'Turn on voice messages? You both have to agree',
    ask_3: 'Swap contacts? You both have to agree',
    them_1: 'They want to switch to text', them_2: 'They want to turn on voice messages', them_3: 'They want to swap contacts',
    consent_btn: 'I’m in',
    consent_wait: 'You’re in. Waiting for them…',
    unlocked: 'Unlocked',                                  // level-up overlay

    gif_search: 'Search GIFs',
    gif_none: 'No GIFs found',
    gif_error: 'GIFs didn’t load. Try again',
    free_ph: 'Say anything…',                              // text field
    send: 'Send', react: 'React',

    // Voice messages
    voice_btn: 'Record a voice message',                   // mic button (screen readers)
    play: 'Play',
    mic_denied: 'Microphone access is off. Turn it on in your browser settings',
    mic_none: 'Voice messages don’t work in this browser',
    voice_cant: 'This voice message can’t play on this device',
    voice_big: 'That recording is too large',

    // Contact swap (last step)
    swap_title: 'Share your contact',
    swap_sub: 'Both contacts appear at the same time',
    swap_them: 'They’ve added theirs',
    swap_wait: 'Yours is ready. Waiting for theirs…',
    swap_ph: 'Instagram, Telegram…',
    swap_btn: 'Share',
    swapped: 'Contacts swapped',

    the_end: 'The end',                                    // end card header
    end_left: 'They left',
    end_lost: 'Connection lost',
    reached: 'Reached',
    stat_time: 'Time', stat_gifs: 'GIFs', stat_texts: 'Messages', stat_voice: 'Voice',
    story: 'Your GIFs',
    share: 'Share',
    copied: 'Copied',
    share_text: 'I met a stranger on {brand}. We started with GIFs only.', // {brand} = app name
    link_hidden: 'link hidden',
  },
  ka: {
    tagline: 'გაიცანით უცნობი. დაიმსახურეთ სიტყვები.',
    lead: 'დაიწყეთ GIF‑ებით. სიტყვები, ხმა და კონტაქტები თანდათან გაიხსნება, თუ ორივეს მოგინდებათ.',
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
    intro_hint: 'ჯერ მხოლოდ GIF‑ები. ტექსტზე გადასვლა {n} წამში შეგეძლებათ, თუ ორივე მინიმუმ {g} GIF‑ს გაგზავნით',
    you: 'თქვენ',
    next: 'შემდეგი',
    next_stranger: 'შემდეგი უცნობი',
    stranger: 'უცნობი',

    s1: 'უხმოდ', d1: 'მხოლოდ GIF‑ები',
    s2: 'სიტყვებით', d2: 'ტექსტი და GIF‑ები', u2: 'გაიხსნება ტექსტი',
    s3: 'ხმით', d3: 'ხმოვანი შეტყობინებები', u3: 'გაიხსნება ხმოვანი შეტყობინებები',
    s4: 'გაცნობა', d4: 'კონტაქტების გაცვლა', u4: 'გაიხსნება კონტაქტების გაცვლა',
    done_1: '{n} GIF',
    done_2: '{n} შეტყობინება',
    done_3: '{n} ხმოვანი',
    need_1: 'ტექსტამდე: ორივემ {n} GIF',
    need_2: 'ხმამდე: ორივემ {n} შეტყობინება',
    need_3: 'კონტაქტებამდე: ორივემ {n} ხმოვანი',
    time: 'დრო',
    in_1: 'ტექსტამდე {time}', in_2: 'ხმამდე {time}', in_3: 'კონტაქტებამდე {time}',
    more_1: 'ტექსტის გასახსნელად გაგზავნეთ კიდევ {n} GIF',
    more_2: 'ხმის გასახსნელად გაგზავნეთ კიდევ {n} შეტყობინება',
    more_3: 'კონტაქტების გასახსნელად გაგზავნეთ კიდევ {n} ხმოვანი',
    more_3_one: 'კონტაქტების გასახსნელად გაგზავნეთ ხმოვანი შეტყობინება',
    wait_1: 'უცნობის GIF‑ებს ველოდებით', wait_2: 'უცნობის შეტყობინებებს ველოდებით', wait_3: 'უცნობის ხმოვანს ველოდებით',
    ready_1: 'უკვე შეგიძლიათ ტექსტზე გადასვლა', ready_2: 'უკვე შეგიძლიათ ხმოვანი შეტყობინებების ჩართვა', ready_3: 'უკვე შეგიძლიათ კონტაქტების გაცვლა',
    ask_1: 'გადავიდეთ ტექსტზე? საჭიროა ორივეს თანხმობა',
    ask_2: 'ჩავრთოთ ხმოვანი შეტყობინებები? საჭიროა ორივეს თანხმობა',
    ask_3: 'გავცვალოთ კონტაქტები? საჭიროა ორივეს თანხმობა',
    them_1: 'უცნობს ტექსტზე გადასვლა სურს', them_2: 'უცნობს ხმოვანი შეტყობინებების ჩართვა სურს', them_3: 'უცნობს კონტაქტების გაცვლა სურს',
    consent_btn: 'თანახმა ვარ',
    consent_wait: 'თანახმა ხართ. უცნობს ველოდებით…',
    unlocked: 'გაიხსნა',

    gif_search: 'GIF‑ების ძიება',
    gif_none: 'GIF‑ები ვერ მოიძებნა',
    gif_error: 'GIF‑ები ვერ ჩაიტვირთა. სცადეთ თავიდან',
    free_ph: 'დაწერეთ რამე…',
    send: 'გაგზავნა', react: 'რეაქცია',

    voice_btn: 'ხმოვანი შეტყობინების ჩაწერა',
    play: 'მოსმენა',
    mic_denied: 'მიკროფონზე წვდომა გამორთულია. ჩართეთ ბრაუზერის პარამეტრებში',
    mic_none: 'ამ ბრაუზერში ხმოვანი შეტყობინებები არ მუშაობს',
    voice_cant: 'ეს ხმოვანი ამ მოწყობილობაზე ვერ ირთვება',
    voice_big: 'ჩანაწერი ძალიან დიდია',

    swap_title: 'გაუზიარეთ კონტაქტი',
    swap_sub: 'ორივე კონტაქტი ერთდროულად გამოჩნდება',
    swap_them: 'უცნობმა თავისი უკვე შეიყვანა',
    swap_wait: 'თქვენი მზადაა. უცნობს ველოდებით…',
    swap_ph: 'Instagram, Telegram…',
    swap_btn: 'გაზიარება',
    swapped: 'კონტაქტები გაცვალეთ',

    the_end: 'დასასრული',
    end_left: 'უცნობი წავიდა',
    end_lost: 'კავშირი გაწყდა',
    reached: 'მიღწეული ეტაპი',
    stat_time: 'დრო', stat_gifs: 'GIF', stat_texts: 'შეტყობინება', stat_voice: 'ხმოვანი',
    story: 'თქვენი GIF‑ები',
    share: 'გაზიარება',
    copied: 'დაკოპირდა',
    share_text: '{brand}-ზე უცნობი გავიცანი. მხოლოდ GIF‑ებით დავიწყეთ.',
    link_hidden: 'ბმული დამალულია',
  },
}
