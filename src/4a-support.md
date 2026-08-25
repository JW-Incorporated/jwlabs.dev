# 4a — Support

[4a](/4a/) is a daily podcast picker: four topic queues a day, one of them
deliberately unlike the others. This page is how you get help with it.

**[{{MAIL}}](mailto:{{MAIL}})** is the address. There is no ticket system and no
support team — one person reads it and answers, usually within a few days. It is
not a queue with a robot in front of it, which is the trade: slower than a chat
widget, and you are talking to somebody who can change the code.

## Before you write

Two pages answer most of what arrives:

- **[Questions](/4a/faq/)** — the ones people actually ask.
- **[Getting started](/4a/getting-started/)** — including
  [the things that look like bugs and are not](/4a/getting-started/#things-that-will-look-like-bugs-and-are-not),
  which is a genuinely useful list.

## What makes a report easy to act on

- **What you were doing, and what happened instead.** The second half is the one
  people leave out.
- **The episode it happened on**, if it was a specific one.
- **Which browser and which device.** The web app is the only released build — see
  [availability](#availability) below.
- **For anything to do with audio: the playback diagnostics record.** See the next
  section. It is the difference between "we will look into it" and an actual fix.

You do not need to be technical, and you do not need to have narrowed it down. "It
stopped when I plugged in headphones in the car" is a good report.

## Playback diagnostics

Open the menu (**☰**) and choose **Playback diagnostics**. Copy it, and paste it
into your email.

It records what the player measured on your device: how long each load took, where
playback stopped, gaps at the seams of an assembled run, and any control press that
did not do what it should. **It holds no audio, no episode addresses and no account
identifier.**

**It is stored on your device only and is never sent anywhere** — it reaches us
only if you copy it into an email yourself. There is a control to clear it.

It exists because two playback faults were once reported from a car with no
measurements attached, and there was nothing to diagnose them with.

## Deleting your data

Open the menu (**☰**) and choose **Delete my data**. The sheet lists what the
deletion covers, and you confirm by typing `DELETE`, so one stray tap cannot
trigger it. There is also a **clear this device only** option.

**You do not need to email anyone, and emailing will not be faster** — the control
reaches things an email cannot, including both storage layers on your device.

[What 4a knows about you](/4a/your-data/) is the plain-language version, including
the three things no deletion can reach and why.
[§7 of the privacy policy](/4a/privacy/#7-how-to-delete-your-data) is the exact
one.

## Telling us a pick was wrong

The most useful thing you can send us, and the only signal that carries *why*
rather than just *that*.

Where 4a offers thumbs, a thumbs-down opens a short list of specific reasons — *not
into this topic*, *just not this show*, *heard this already*, *too surface-level*,
*too in-the-weeds*, *bad audio quality*, and others — plus a free-text note. A
thumbs-up commits immediately, because an up-vote has nothing to explain.

Those live on the segments of an assembled run, and **none is published yet**, so
for today's daily cards the route is an email. One line is enough: which card, and
what was wrong with it.

If you do type a note in the app, it is sent to us and stored, so do not put
anything in it you would not want kept.

## Reporting something more serious

**A security problem** — [the security page](/security/) says what to include,
what is in scope, and what we can and cannot promise.

**Something unusable with assistive technology** — [the accessibility
page](/accessibility/) is honest about what has and has not been tested, and a
report is worth more to us than most feature requests.

**You are a podcaster** — [there is a page for you](/4a/for-podcasters/), including
how to have your show removed. The answer is yes.

## Availability

**The web app is the shipping version.** It works on a phone, needs no signup, and
can be added to a home screen.

**Native iOS and Android shells are built** from the same code. The iOS build has
run on the simulator; the Android build has been compiled. **Neither is in a store,
and there is no date.** We do not publish dates.

[What is built and what is not](/status/) is the whole inventory, including the
things that are designed and not built.

## Response times, honestly

There is no service-level agreement and we are not going to invent one. One person
reads that address. Expect a few days; expect longer if it lands in a bad week.

What we will do: read it, tell you whether we can reproduce it, and tell you what
we intend to do about it. **If we decide not to fix something, we will say so
rather than going quiet.**

## It is early software

4a is new, the library changes, and features move. If something reads as broken it
may well be, and [{{MAIL}}](mailto:{{MAIL}}) is the way to tell us.
