// UI text. English is the source; Georgian is written alongside it.
// Keys ending in _1 … _5 belong to that step of the ladder. A key with `_one` is used instead
// of the plain one when the count is 1.

export const LANGS = ['en', 'ka']

export const STR = {
  en: {
    tagline: 'Meet a stranger. Earn your words.',          // landing headline
    lead: 'Start with GIFs. More opens up step by step, if you both want it.', // landing, under the headline
    find: 'Find a stranger',                               // landing, main button
    online_other: '{n} people here now',                   // landing + search, {n} = count (2 or more)
    adults: 'For adults only (18+)',                       // landing, under the buttons
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
    intro_hint: 'GIFs only for now. What opens next is a surprise.', // welcome card
    you: 'You',
    next: 'Next',                                          // match, skip button (phone)
    next_stranger: 'Next stranger',
    stranger: 'Stranger',

    // The five steps: name and what you can send on it. Only steps reached so far are shown.
    s1: 'Wordless', d1: 'GIFs only',
    s2: 'In words', d2: 'Text, GIFs and photos',
    s3: 'By voice', d3: 'Voice call only',
    s4: 'Face to face', d4: 'Video call only',
    s5: 'Introduced', d5: 'Everything’s open, and you can swap contacts',
    // A finished step in the sidebar, {n} = messages of that kind sent in it by both of you
    done_1: '{n} GIFs', done_1_one: '1 GIF',
    done_2: '{n} messages', done_2_one: '1 message',
    done_3: 'You talked', done_3_none: 'Without a call',
    done_4: 'You saw each other', done_4_none: 'Without video',
    // Consent bar above the composer
    ask_1: 'Switch to text?',
    ask_2: 'Turn on voice calls?',
    ask_3: 'Turn on video?',
    ask_4: 'Swap contacts?',
    them_1: 'They want to switch to text', them_2: 'They want to turn on voice calls', them_3: 'They want to turn on video', them_4: 'They want to swap contacts',
    // The "?" step after the current one in the ladder (what it is stays hidden)
    next_step: 'Next step',
    next_locked: 'Still locked', next_soon: 'Opening soon…', next_ready: 'Ready to open',
    consent_both: 'You both have to agree',                // under the question in the consent bar
    consent_btn: 'I’m in',
    consent_wait: 'You’re in. Waiting for them…',
    unlocked: 'Unlocked',                                  // level-up overlay

    gif_search: 'Search GIFs',
    gif_none: 'No GIFs found',
    gif_error: 'GIFs didn’t load. Try again',
    free_ph: 'Say anything…',                              // text field
    send: 'Send', react: 'React',

    // Voice call (step 3). The call goes on into step 4, where the camera can be turned on.
    voice_btn: 'Voice call',                               // phone button in the composer, last step (screen readers)
    voice_note: 'Start a voice call when you’re ready. You only hear each other once you’re both on it.', // feed note when the call opens
    call_start: 'Start a voice call',                      // the one big button on the voice-only step
    call_join: 'Join the call',                            // same button, and in the call area, when they're already on
    call_end: 'End call',                                  // big button while I'm on the call
    call_wait: 'Waiting for them to join…',                // call area, I'm on and they aren't
    call_them: 'They’re on the call',                      // call area, they're on and I'm not
    call_live: 'On the call · {time}',                     // call area, both on, {time} = 0:42
    mic_denied: 'Microphone access is off. Turn it on in your browser settings',
    call_none: 'Calls don’t work in this browser',

    // Video call (step 4)
    video_btn: 'Video call',                               // camera button in the composer (screen readers)
    video_note: 'Turn on your camera when you’re ready. Their video stays blurred until you tap it.', // feed note when video opens
    video_show: 'Show video',                              // button on their blurred video
    cam_off_them: 'Their camera is off',                   // call area, both on the call, their camera off
    cam_on: 'Turn on camera',                              // the big button on the video-only step
    cam_stop: 'Turn off camera',                           // same button while the camera is on
    mute: 'Microphone', cam_toggle: 'Camera', hang_up: 'End call', // call controls (screen readers)
    flip: 'Switch camera',                                 // front / back camera (screen readers)
    cam_denied: 'Camera access is off. Turn it on in your browser settings',
    cam_none: 'Video calls don’t work in this browser',

    // Leaving a chat by the logo or the back button
    leave_title: 'End this chat?',
    leave_sub: 'The stranger will be disconnected, and you can’t come back to this chat.',
    leave_stay: 'Stay',
    leave_go: 'End chat',

    // Photos in the chat
    photo_btn: 'Send a photo',                             // photo button in the composer (screen readers)
    photo_show: 'Show photo',                              // on the stranger's blurred photo
    photo_open: 'Open photo',                              // expand button on a photo (screen readers)
    photo_bad: 'Couldn’t send that image. Try another one',

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
    stat_time: 'Time', stat_gifs: 'GIFs', stat_texts: 'Messages', stat_call: 'Call', // stat_call: time on a call together
    story: 'Your GIFs',
    share: 'Share',
    copied: 'Copied',
    share_text: 'I met a stranger on {brand}. We started with GIFs only.', // {brand} = app name
    link_hidden: 'link hidden',

    // My profile: the button at the top and the window it opens
    profile: 'Profile',                                    // top button when no name is set; window title
    pf_photo_up: 'Upload photo',
    pf_photo_change: 'Change photo',
    pf_photo_rm: 'Remove photo',                           // goes back to the drawn face
    pf_photo_bad: 'Couldn’t open that image. Try another one',
    pf_name: 'Name',
    pf_optional: 'Optional',                               // name field placeholder
    pf_gender: 'Gender',
    g_m: 'Man', g_f: 'Woman', g_o: 'Other',               // also shown next to the stranger's flag
    pf_note: 'Everything here is optional. Strangers see what you fill in, and it’s saved on this device only.',
    pf_done: 'Done',
    close: 'Close',                                        // accessibility label of the cross
  },
  ka: {
    tagline: 'გაიცანით უცნობი. დაიმსახურეთ სიტყვები.',
    lead: 'დაიწყეთ GIF‑ებით. დანარჩენი თანდათან გაიხსნება, თუ ორივეს მოგინდებათ.',
    find: 'უცნობის პოვნა',
    online_other: 'ახლა აქ {n} ადამიანია',
    adults: 'მხოლოდ სრულწლოვნებისთვის (18+)',
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
    intro_hint: 'ჯერ მხოლოდ GIF‑ები. რა გაიხსნება შემდეგ, სიურპრიზია.',
    you: 'თქვენ',
    next: 'შემდეგი',
    next_stranger: 'შემდეგი უცნობი',
    stranger: 'უცნობი',

    s1: 'უხმოდ', d1: 'მხოლოდ GIF‑ები',
    s2: 'სიტყვებით', d2: 'ტექსტი, GIF‑ები და სურათები',
    s3: 'ხმით', d3: 'მხოლოდ ხმოვანი ზარი',
    s4: 'პირისპირ', d4: 'მხოლოდ ვიდეოზარი',
    s5: 'გაცნობა', d5: 'ყველაფერი ღიაა და კონტაქტების გაცვლაც შეგიძლიათ',
    done_1: '{n} GIF',
    done_2: '{n} შეტყობინება',
    done_3: 'ისაუბრეთ', done_3_none: 'ზარის გარეშე',
    done_4: 'ერთმანეთი დაინახეთ', done_4_none: 'ვიდეოს გარეშე',
    ask_1: 'გადავიდეთ ტექსტზე?',
    ask_2: 'ჩავრთოთ ხმოვანი ზარი?',
    ask_3: 'ჩავრთოთ ვიდეო?',
    ask_4: 'გავცვალოთ კონტაქტები?',
    them_1: 'უცნობს ტექსტზე გადასვლა სურს', them_2: 'უცნობს ხმოვანი ზარის ჩართვა სურს', them_3: 'უცნობს ვიდეოს ჩართვა სურს', them_4: 'უცნობს კონტაქტების გაცვლა სურს',
    next_step: 'შემდეგი ეტაპი',
    next_locked: 'ჯერ დახურულია', next_soon: 'მალე გაიხსნება…', next_ready: 'გასახსნელად მზადაა',
    consent_both: 'საჭიროა ორივეს თანხმობა',
    consent_btn: 'თანახმა ვარ',
    consent_wait: 'თანახმა ხართ. უცნობს ველოდებით…',
    unlocked: 'გაიხსნა',

    gif_search: 'GIF‑ების ძიება',
    gif_none: 'GIF‑ები ვერ მოიძებნა',
    gif_error: 'GIF‑ები ვერ ჩაიტვირთა. სცადეთ თავიდან',
    free_ph: 'დაწერეთ რამე…',
    send: 'გაგზავნა', react: 'რეაქცია',

    voice_btn: 'ხმოვანი ზარი',
    voice_note: 'ზარი დაიწყეთ, როცა მზად იქნებით. ერთმანეთს მხოლოდ მაშინ გაიგონებთ, როცა ორივე ზარში იქნებით.',
    call_start: 'ხმოვანი ზარის დაწყება',
    call_join: 'ზარში შესვლა',
    call_end: 'ზარის დასრულება',
    call_wait: 'უცნობის შემოსვლას ველოდებით…',
    call_them: 'უცნობი ზარშია',
    call_live: 'საუბრობთ · {time}',
    mic_denied: 'მიკროფონზე წვდომა გამორთულია. ჩართეთ ბრაუზერის პარამეტრებში',
    call_none: 'ამ ბრაუზერში ზარები არ მუშაობს',

    video_btn: 'ვიდეოზარი',
    video_note: 'კამერა ჩართეთ, როცა მზად იქნებით. უცნობის ვიდეო ბუნდოვანი იქნება, სანამ თავად არ დააჭერთ.',
    video_show: 'ვიდეოს ჩვენება',
    cam_off_them: 'უცნობის კამერა გამორთულია',
    cam_on: 'კამერის ჩართვა',
    cam_stop: 'კამერის გამორთვა',
    mute: 'მიკროფონი', cam_toggle: 'კამერა', hang_up: 'ზარის დასრულება',
    flip: 'კამერის გადართვა',
    cam_denied: 'კამერაზე წვდომა გამორთულია. ჩართეთ ბრაუზერის პარამეტრებში',
    cam_none: 'ამ ბრაუზერში ვიდეოზარი არ მუშაობს',

    leave_title: 'დავასრულოთ ჩატი?',
    leave_sub: 'კავშირი უცნობთან გაწყდება და ამ ჩატში ვეღარ დაბრუნდებით.',
    leave_stay: 'დარჩენა',
    leave_go: 'დასრულება',

    photo_btn: 'სურათის გაგზავნა',
    photo_show: 'სურათის ჩვენება',
    photo_open: 'სურათის გახსნა',
    photo_bad: 'სურათი ვერ გაიგზავნა. სცადეთ სხვა',

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
    stat_time: 'დრო', stat_gifs: 'GIF', stat_texts: 'შეტყობინება', stat_call: 'ზარი',
    story: 'თქვენი GIF‑ები',
    share: 'გაზიარება',
    copied: 'დაკოპირდა',
    share_text: '{brand}-ზე უცნობი გავიცანი. მხოლოდ GIF‑ებით დავიწყეთ.',
    link_hidden: 'ბმული დამალულია',

    profile: 'პროფილი',
    pf_photo_up: 'ფოტოს ატვირთვა',
    pf_photo_change: 'ფოტოს შეცვლა',
    pf_photo_rm: 'ფოტოს წაშლა',
    pf_photo_bad: 'სურათი ვერ გაიხსნა. სცადეთ სხვა',
    pf_name: 'სახელი',
    pf_optional: 'არასავალდებულო',
    pf_gender: 'სქესი',
    g_m: 'კაცი', g_f: 'ქალი', g_o: 'სხვა',
    pf_note: 'ყველა ველი არასავალდებულოა. უცნობები დაინახავენ, რასაც აქ შეავსებთ. მონაცემები მხოლოდ ამ მოწყობილობაზე ინახება.',
    pf_done: 'მზადაა',
    close: 'დახურვა',
  },
}
