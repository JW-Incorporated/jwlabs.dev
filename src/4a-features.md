# 4a, feature by feature

The full tour. [The overview](/4a/) is the short version; this is everything the
app actually does, what each thing is for, and where each one has a limit worth
knowing about.

Everything described here is in the shipping web app unless the page says
otherwise, and where something exists but is not reachable yet, it says so in the
same sentence.

## The four daily queues

**What it is.** Four cards, once a day. Each card is a queue of episodes on one
subject rather than a single episode.

**What each card tells you before you tap it:**

- the number of episodes and the **total running time** of the queue;
- the shows it draws from, **by name** — "All from *X*", or "From *X* and *Y*", or
  "From *X*, *Y*, and four more";
- the **first episode's title**, quoted, so no card is a mystery;
- a `Stretch` badge, on exactly one of the four.

**Who it suits.** Anyone who has decided that the problem is not a shortage of
podcasts. If what you want is a search box over everything ever made, the app you
already have is better at that than we will ever be.

**The limit.** Four is not configurable. It is a product decision, not a default,
and the reason is that "how many recommendations would you like" is a question
nobody has a good answer to at nine in the morning.

## New suggestions

A refresh control in the top bar. If none of the four appeal, replace them.

Deliberately a button rather than an infinite scroll: a scroll rewards
indefinite browsing and a button rewards deciding. It is the same set of ideas
either way; only the incentive is different.

## The Stretch queue

**What it is.** The fourth queue, drawn from subjects *adjacent to* your
demonstrated interests rather than inside them. Badged, with a label that says
plainly it is outside your usual topics and that this is on purpose.

**Why it is badged at all.** A recommender that slips something unfamiliar in and
hopes you do not notice is optimising for a click. Telling you means you can
choose to be in the mood for it — and it means a miss reads as *an experiment that
did not land* rather than as *the app getting worse.*

**Two rules that make it real:**

- **It ignores your skip rate for the region it is exploring.** A slot that backs
  off when ignored is a slower route to the same three shows.
- **It must state its bridge** — the reason this is next to that — in a single
  short line.

**The limit, stated honestly.** Today's adjacency is derived from the subject
structure rather than from a learned similarity model, which is a real
simplification: it is good at "next-door subject" and less good at "different
subject, same shape of curiosity". [What is built and what is not](/status/) keeps
that kind of thing in one place.

## Continue where you left off

If you started something long and did not finish it, a **Continue** strip appears
at the top with the episode's artwork and title. There is a **✓** on it to say
*done with this* and clear it — which also counts as a signal that you liked it
enough to finish.

It expires on its own after a while rather than following you around forever, and
it only appears for something long enough that resuming is actually the point.

## Jump back in

Where a run of segments was left part-way through, 4a offers to resume at the
exact position — labelled with the timestamp, so you know where you are going
before you tap.

## Build me a playlist, in your own words

**What it is.** One text field under the four cards. Type what you want and 4a
assembles a queue from the library.

**What it does with a query.** It interprets it into subjects and constraints, and
if the strict reading finds too little it **relaxes** the query rather than
returning nothing. Then it tells you which of three things happened:

| Outcome | What you get |
|---|---|
| It worked | A queue, saved as a playlist |
| **Thin** | The queue, flagged as thin, rather than padded to look full |
| Nothing | **Suggestions for adjacent subjects that do have something in them** |

That last row is the one worth dwelling on. An empty result is a dead end, and a
dead end is the moment people close an app. Being told *"not that, but these three
are close and are not empty"* keeps the session alive without pretending.

**One honest failure message.** If your device has genuinely run out of storage,
the playlist cannot be saved, and 4a says exactly that and what to do about it —
that removing a playlist you have finished with frees enough room. It does not
silently drop the playlist and it does not blame you for a full disk.

## Playlists

Queues you build are kept. The menu lists your five most recent one tap away, and
a full playlists view holds the rest.

## Saving things

A star on any episode. Saved items are yours, kept on your device, and saving
something is also a signal — it tells the picker you were interested even if you
did not press play right then.

## Telling it when it is wrong

The single most useful thing you can do in 4a, and the only signal that carries
*why*.

**Thumbs, with reasons.** A thumbs-up commits immediately — an up-vote has nothing
to explain. A thumbs-down opens a short sheet, because "not for me" on its own is
nearly useless to something trying to learn, and the moment you have just been
annoyed is the one moment you will say why.

The reasons are specific on purpose:

| | |
|---|---|
| Not into this topic | Just not this show |
| Heard this already | Bad audio quality |
| Too surface-level | Too in-the-weeds |
| Leans too far left | Leans too far right |
| Didn't like the voice | |

You can pick more than one, add a short note in your own words, and the button
tells you what it will do — *Tune my picks* once you have chosen something, *Pick
at least one* before that. A second tap on a vote clears it, in either direction,
so undoing does not force the sheet open again.

**Why the list looks like that.** "Too surface-level" and "too in-the-weeds" are
opposite complaints about the same episode from two different people, and a
recommender that cannot tell them apart will average them into mush. So will "not
into this topic" versus "just not this show" — one of those should change what
subject you get tomorrow and the other should not.

**Where you meet it.** Thumbs with reasons live on the segments of an assembled
run, and **no such run is published yet**, so this is a feature of the player
rather than of today's daily cards. For the daily picks, what teaches the app is
what you open, what you skip, what you save, and what you mark done. If a pick was
wrong and you want to say so in words, [email us](/4a/support/) — a person reads
it.

**The note is stored on our server.** It is free text you wrote, so do not type
anything into it you would not want kept. [What 4a knows about you](/4a/your-data/)
is exact about this.

## More like this, less like this

Direct controls to nudge a subject up or down, for when you know what you want and
would rather say it than demonstrate it over three weeks.

## Family mode

**What it is.** A switch in the menu. On, it hides episodes rated explicit — and
also the whole comedy category, because older comedy items in the library predate
per-episode ratings and we would rather over-hide than under-hide.

**Why the second half matters.** That is a deliberately blunt rule and we are
telling you it is blunt. A parent handing a phone to a child is not helped by a
filter that is *mostly* right, and "we hid a category we could not vouch for" is a
better failure than "we let one through".

## Choose which app things open in

Also in the menu: whether an episode hands off to Apple Podcasts or to a show page
in another player. Your subscriptions and your history stay where they are.

## Speed control, and segment navigation

In 4a's own player: playback speed, and **next segment / previous segment** for
moving through an assembled run rather than scrubbing blindly through an hour.

## Playback diagnostics

**What it is.** A menu item that shows what the player measured on this device —
seam gaps, load deadlines, and any control press that did not do what it should.
There is a button to copy it into a bug report and a button to clear the record.

**Two things about it.** It holds no audio, no episode addresses and no account
identifier. And **it is stored on your device only and is never sent anywhere** —
it goes to us only if you copy it into an email yourself.

**Why it exists.** Two playback faults were once reported from a car, with no
measurements attached, and there was nothing to diagnose them with. Now there is,
and it belongs to you rather than to us.

## Delete my data

**What it is.** A menu item that deletes what 4a has, confirmed by typing
`DELETE`, so one stray tap cannot trigger it. There is also a **clear this device
only** option, if you would rather leave the server rows alone.

Before you confirm, the sheet lists exactly what it covers:

- **This device:** every 4a key, in both places it stores things.
- **Our server:** the events this device sent, and its account rows.
- **Your anonymous account row stays.** It holds no name, email or phone number.
- **Publisher and ad hosts saw your IP as audio played. We cannot delete that.**

It deletes the server rows **first**, because the token on your device is the only
thing that can reach them. If the server cannot be reached it tells you the rows
were not deleted and leaves your device alone so you can try again. **It will not
report success for something it did not do.**

You do not need to email anyone, and emailing will not be faster.
[What 4a knows about you](/4a/your-data/) has the whole picture, including the
three things no deletion can reach.

## Works offline, up to a point

The app itself and its library listing are cached, so 4a opens and renders in a
dead zone or on a plane. **Audio is never cached**, so playing something needs a
connection. We would rather be exact about that than let you find out on the
Underground.

## Add it to your home screen

On a phone, 4a can be installed to the home screen from the browser and behaves
like an app after that — its own icon, its own window, no browser furniture.
[Getting started](/4a/getting-started/) has the steps for each platform.

## Light and dark

4a follows your device's appearance setting. There is nothing to configure.

## What there is not

An honest feature page needs this section.

- **No account, no login, no password, no email verification.**
- **No advertising, no ad identifier, no advertising SDK.**
- **No analytics library, no crash reporter, no third-party SDK of any kind.**
- **No push notifications.** 4a never asks for permission to interrupt you. (It
  does put ordinary playback controls on your lock screen while something is
  playing, which is the opposite thing.)
- **No social features.** No following, no sharing feed, no comments, no profile.
- **No paid tier, no subscription, no in-app purchase.** There is nothing to buy
  and no upsell.
- **No published foray yet.** The player is written; the content is not
  published.
- **Not in any app store.** The web app is the shipping version.
