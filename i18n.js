// UI text and the shared phrasebook. English is the source; Georgian is written alongside it.
// Phrases travel between players as IDs, so each screen shows them in its own language.

export const LANGS = ['en', 'ka']
export const LANG_NAME = { en: 'English', ka: 'ქართული' }

export const STR = {
  en: {
    tagline: 'Meet a stranger. Earn your words.',          // landing, under the logo
    sub: 'Every chat starts as a silent film.',            // landing, small line
    lead: 'Start with one word. Take turns to earn more.',  // landing, under the headline
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
    invite_share_text: 'Join me on Talkies. We start with one word.', // share sheet text for a private link
    joining: 'Joining your friend…',                       // opened an invite link
    friend_gone: 'Your friend isn’t here right now',       // invite link opened but nobody is waiting
    cancel: 'Cancel',
    connecting: 'Connecting…',                             // match, before the hello arrives
    intro_title: 'You’re connected',                       // match, welcome card title
    intro_hint: 'You have one word. Make it count.',                    // match, welcome card hint
    next: 'Next',                                          // match, skip button
    stranger: 'Stranger',
    jinx_title: 'Same pick?',                              // jinx card title
    jinx_hit: 'Jinx!',                                     // both picked the same
    jinx_miss: 'Different taste',                          // picks differ
    jinx_wait: 'Waiting for them…',                        // I picked, they haven't
    hint: 'Take turns to unlock the next one',             // spark meter caption
    s1: 'One word', s2: 'Two words', s3: 'Three words', s4: 'Five words', s5: 'Free chat',            // stage names
    d1: '1 word per message', d2: '2 words per message', d3: '3 words per message', d4: '5 words per message', d5: 'Say anything', // stage descriptions
    unlocked: 'Unlocked',                                  // level-up overlay
    next_unlock: 'Next:',                                  // progress bar, before the next stage name
    consent_ask: 'Open free chat? You both have to agree', // stage 4 → 5 gate
    consent_btn: 'I’m in',
    consent_wait: 'You’re in. Waiting for them…',
    consent_them: 'They’re in',
    whisper_ph: 'Up to 3 words…',                          // text input, stage 4
    free_ph: 'Say anything…',                              // text input, stage 5
    whisper_err: 'Up to 3 words, no numbers or links',
    words_err: 'Word limit right now: {n}',               // composer, too many words; {n} = limit
    contacts_err: 'No numbers or links before free chat',  // composer, digits or links before stage 5
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
    share_text: 'We reached {stage} on {brand}, one word at a time {emoji}', // {brand} = app name, {stage} = stage name, {emoji} = story
    link_hidden: 'link hidden',
    scale_title: 'Scale',                                  // scale round card title, before the topic
    scale_give: 'Only you can see the dot. Pick a word that belongs there', // scale, the player giving the hint
    scale_own: 'My own word',                              // scale, chip that opens a text field
    scale_own_ph: 'One word…',                             // scale, own word field placeholder
    scale_wait_clue: 'The stranger is picking a word…',    // scale, the guessing player waits
    scale_guess: 'Where is it on the scale? Drag, then tap Here', // scale, the guessing player
    scale_lock: 'Here',                                    // scale, lock-in button
    scale_wait_guess: 'The stranger is guessing…',         // scale, the hint giver waits
    scale_bull: 'Spot on!', scale_close: 'So close!', scale_far: 'You see it differently. Ask why', // scale results
    scale_word_err: 'Just one word, no numbers or links',
  },
  ka: {
    tagline: 'გაიცანით უცნობი. დაიმსახურეთ სიტყვები.',
    sub: 'ყველა საუბარი მუნჯი კინოთი იწყება.',
    lead: 'დაიწყეთ ერთი სიტყვით. მონაცვლეობით დაიმსახურეთ მეტი.',
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
    invite_share_text: 'შემოდი Talkies-ზე, ერთი სიტყვით ვიწყებთ.',
    joining: 'მეგობართან დაკავშირება…',
    friend_gone: 'მეგობარი ახლა აქ არ არის',
    cancel: 'გაუქმება',
    connecting: 'დაკავშირება…',
    intro_title: 'დაკავშირდით',
    intro_hint: 'ერთი სიტყვა გაქვთ. კარგად შეარჩიეთ.',
    next: 'შემდეგი',
    stranger: 'უცნობი',
    jinx_title: 'დაემთხვევა?',
    jinx_hit: 'დაემთხვა!',
    jinx_miss: 'სხვადასხვა გემოვნება',
    jinx_wait: 'უცნობს ველოდებით…',
    hint: 'მონაცვლეობით გაგზავნეთ და შემდეგი გაიხსნება',
    s1: 'ერთი სიტყვა', s2: 'ორი სიტყვა', s3: 'სამი სიტყვა', s4: 'ხუთი სიტყვა', s5: 'თავისუფალი ჩატი',
    d1: 'შეტყობინებაში 1 სიტყვა', d2: 'შეტყობინებაში 2 სიტყვა', d3: 'შეტყობინებაში 3 სიტყვა', d4: 'შეტყობინებაში 5 სიტყვა', d5: 'თქვით, რაც გინდათ',
    unlocked: 'გაიხსნა',
    next_unlock: 'შემდეგი:',
    consent_ask: 'გავხსნათ თავისუფალი ჩატი? საჭიროა ორივეს თანხმობა',
    consent_btn: 'თანახმა ვარ',
    consent_wait: 'თანახმა ხართ. უცნობს ველოდებით…',
    consent_them: 'უცნობი თანახმაა',
    whisper_ph: 'მაქსიმუმ 3 სიტყვა…',
    free_ph: 'დაწერეთ რამე…',
    whisper_err: 'მაქსიმუმ 3 სიტყვა, ციფრებისა და ბმულების გარეშე',
    words_err: 'სიტყვების ლიმიტი ახლა: {n}',
    contacts_err: 'ციფრები და ბმულები თავისუფალ ჩატამდე არ შეიძლება',
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
    share_text: '{brand}-ზე სიტყვა-სიტყვით მივაღწიეთ ეტაპს: {stage} {emoji}',
    link_hidden: 'ბმული დამალულია',
    scale_title: 'სკალა',
    scale_give: 'წერტილს მხოლოდ თქვენ ხედავთ. აირჩიეთ სიტყვა, რომელიც იქ ჯდება',
    scale_own: 'ჩემი სიტყვა',
    scale_own_ph: 'ერთი სიტყვა…',
    scale_wait_clue: 'უცნობი სიტყვას არჩევს…',
    scale_guess: 'სად არის ეს სკალაზე? გადაწიეთ და დააჭირეთ „აქ არის“',
    scale_lock: 'აქ არის',
    scale_wait_guess: 'უცნობი გამოცნობას ცდილობს…',
    scale_bull: 'ზუსტად!', scale_close: 'ძალიან ახლოს!', scale_far: 'სხვანაირად ხედავთ. ჰკითხეთ, რატომ',
    scale_word_err: 'მხოლოდ ერთი სიტყვა, ციფრებისა და ბმულების გარეშე',
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

// "Scale" rounds: a line between two opposites. One player sees a hidden dot on it and picks a
// word that belongs there; the other drags a marker to where they think the dot is.
// Each pair is [English, Georgian]. Words travel as indices, so each screen shows its own language.
export const SCALES = [
  { a: ['Cold', 'ცივი'], b: ['Hot', 'ცხელი'], topic: ['Drinks', 'სასმელი'], words: [
    ['Lemonade', 'ლიმონათი'], ['Coffee', 'ყავა'], ['Tea', 'ჩაი'], ['Hot chocolate', 'ცხელი შოკოლადი'],
    ['Milk', 'რძე'], ['Kompot', 'კომპოტი'], ['Smoothie', 'სმუზი'], ['Mineral water', 'მინერალური წყალი']] },
  { a: ['Boring', 'მოსაწყენი'], b: ['Exciting', 'საინტერესო'], topic: ['Hobbies', 'ჰობი'], words: [
    ['Football', 'ფეხბურთი'], ['Opera', 'ოპერა'], ['Chess', 'ჭადრაკი'], ['Fishing', 'თევზაობა'],
    ['Yoga', 'იოგა'], ['Video games', 'ვიდეოთამაშები'], ['Gardening', 'მებაღეობა'], ['Dancing', 'ცეკვა']] },
  { a: ['Healthy', 'ჯანსაღი'], b: ['Unhealthy', 'მავნე'], topic: ['Food', 'საჭმელი'], words: [
    ['Khinkali', 'ხინკალი'], ['Salad', 'სალათი'], ['Pizza', 'პიცა'], ['Sushi', 'სუში'],
    ['Churchkhela', 'ჩურჩხელა'], ['Burger', 'ბურგერი'], ['Lobio', 'ლობიო'], ['Chips', 'ჩიფსები']] },
  { a: ['Cute', 'საყვარელი'], b: ['Scary', 'საშინელი'], topic: ['Animals', 'ცხოველები'], words: [
    ['Spider', 'ობობა'], ['Cat', 'კატა'], ['Snake', 'გველი'], ['Owl', 'ბუ'],
    ['Shark', 'ზვიგენი'], ['Hamster', 'ზაზუნა'], ['Bat', 'ღამურა'], ['Goose', 'ბატი']] },
  { a: ['Relaxing', 'დამამშვიდებელი'], b: ['Stressful', 'სტრესული'], topic: ['Situations', 'სიტუაციები'], words: [
    ['Exams', 'გამოცდები'], ['Traffic', 'საცობი'], ['Monday', 'ორშაბათი'], ['Rain', 'წვიმა'],
    ['Airport', 'აეროპორტი'], ['Family dinner', 'ოჯახური ვახშამი'], ['Gym', 'სპორტდარბაზი'], ['Shopping', 'შოპინგი']] },
  { a: ['Old-school', 'ძველმოდური'], b: ['Modern', 'თანამედროვე'], topic: ['Music', 'მუსიკა'], words: [
    ['Jazz', 'ჯაზი'], ['Rap', 'რეპი'], ['Polyphony', 'მრავალხმიანობა'], ['Rock', 'როკი'],
    ['Techno', 'ტექნო'], ['Pop', 'პოპი'], ['Classical', 'კლასიკური'], ['Disco', 'დისკო']] },
  { a: ['Easy', 'მარტივი'], b: ['Hard', 'რთული'], topic: ['Skills', 'უნარები'], words: [
    ['Cooking', 'საჭმლის მომზადება'], ['Driving', 'მანქანის ტარება'], ['Swimming', 'ცურვა'], ['Singing', 'სიმღერა'],
    ['Drawing', 'ხატვა'], ['Math', 'მათემატიკა'], ['Waking up early', 'ადრე ადგომა'], ['Saying no', 'უარის თქმა']] },
  { a: ['Quiet', 'წყნარი'], b: ['Loud', 'ხმაურიანი'], topic: ['Places', 'ადგილები'], words: [
    ['Library', 'ბიბლიოთეკა'], ['Stadium', 'სტადიონი'], ['Beach', 'სანაპირო'], ['Café', 'კაფე'],
    ['Feast', 'სუფრა'], ['Metro', 'მეტრო'], ['Forest', 'ტყე'], ['Wedding', 'ქორწილი']] },
  { a: ['Cheap', 'იაფი'], b: ['Expensive', 'ძვირი'], topic: ['Gifts', 'საჩუქრები'], words: [
    ['Flowers', 'ყვავილები'], ['Book', 'წიგნი'], ['Perfume', 'სუნამო'], ['Socks', 'წინდები'],
    ['Phone', 'ტელეფონი'], ['Concert tickets', 'კონცერტის ბილეთები'], ['Chocolate', 'შოკოლადი'], ['Watch', 'საათი']] },
  { a: ['Childish', 'ბავშვური'], b: ['Serious', 'სერიოზული'], topic: ['Entertainment', 'გართობა'], words: [
    ['Cartoons', 'მულტფილმები'], ['News', 'ახალი ამბები'], ['Memes', 'მემები'], ['Poetry', 'პოეზია'],
    ['Comics', 'კომიქსები'], ['Documentaries', 'დოკუმენტური ფილმები'], ['Board games', 'სამაგიდო თამაშები'], ['Reality shows', 'რეალითი შოუები']] },
]
