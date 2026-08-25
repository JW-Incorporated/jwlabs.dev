# What 4a knows about you

Plain language. [The privacy policy](/4a/privacy/) is the exact document — it lists
every key stored on your device, every field transmitted and every host your device
contacts, and it is published word for word from the same source that builds the
app. This page is the version you can read in three minutes.

Nothing here contradicts that document. If you find something that does, the policy
is right and this page is wrong, and we would like to know.

## The short version

**You have no account with us in any ordinary sense.** No signup, no password, no
email address, no phone number, no profile, no name.

**Most of what 4a knows never leaves your device.** Your subjects and interests,
your play positions, your history, your playlists and your settings are stored
locally and are not transmitted.

**A small number of events do reach our database**, attached to an anonymous
identifier that holds no personal details.

**When you play something, the publisher sees you and we do not.** That is a
consequence of playing audio directly from a publisher's own servers rather than
through us, and it is the one part of this page that surprises people.

## The anonymous account

On first run 4a creates an account for itself. It is real — it is what lets your
events be your events rather than everybody's — and it holds **no name, no email
address and no phone number.** It is an opaque identifier and nothing else.

You never see a signup screen because there is not one. If you ever want the same
picks on a second device, the design allows adding an email or another sign-in
method to that *same* account later **without losing anything you have already
taught it** — no "start again as a new user". That upgrade path is not something you
can use today; it is the reason the account exists in the shape it does.

## What stays on your device

- The subjects you are interested in, and how strongly.
- Where you are in things you have started.
- What you have played and what you have skipped.
- Your playlists and saved items.
- Your settings — family mode, which app things open in.
- The playback diagnostics record. **This one is worth naming twice: it is stored
  on your device only and is never sent anywhere**, unless you copy it into an email
  yourself.

4a keeps these in two places on your device, which matters only when you come to
delete them — and the delete control covers both.

## What is sent to us

Five kinds of event, against the anonymous identifier. In ordinary words: **what you
picked, what you finished, what you saved, how you voted on something, and what you
asked a playlist for.**

And one thing that is not an event: **if you type a note into a thumbs-down, that
note is sent and stored.** It is free text you wrote. Do not type anything into it
you would not want kept — and it is worth keeping, because it is the only signal
that tells us *why* something was wrong rather than just that it was.

## What we do not have

- **No advertising code, no ad identifier, no advertising SDK.**
- **No analytics library. No crash reporter. No third-party SDK of any kind.**
- **No cookies used for tracking**, and no cross-site tracking of any sort.
- **No contact list, no calendar, no location, no microphone, no camera.**
- **No name, email address or phone number**, because there is nowhere to enter
  one.
- **Nothing is sold.** There is no advertising business here to sell it to.

## The part people do not expect

4a plays audio **straight from each publisher's own servers.** There is no 4a
server in the path.

The upside is large: we never see your listening, because the request never comes
to us. The consequence is the honest counterpart of that, and we would rather say it
on the way in than have you discover it: **the publisher's host sees your IP
address and your browser, and so does any measurement or ad-attribution service the
publisher has put in front of their own audio file.** That is the ordinary
arrangement of the podcast industry and it is what happens in every podcast app,
including the one you already use.

We could hide it by proxying every download through our servers. We do not, for two
reasons that both point the same way: it would mean *we* saw every episode you
played, and it would mean we were re-serving somebody else's audio, which is
exactly the thing we have committed never to do.
[§4 of the privacy policy](/4a/privacy/) names who those third parties actually are.

## Deleting everything

**In the app: menu (☰) → Delete my data.** You confirm by typing `DELETE`, so one
stray tap cannot do it. There is also a **clear this device only** option if you
would rather leave the server rows in place.

**It deletes** everything 4a stored on your device — in both places it keeps things —
and your rows on our server, including any note you typed into feedback.

**It deletes the server rows first**, because the token on your device is the only
thing that can reach them. If the server cannot be reached it **tells you the rows
were not deleted** and leaves your device alone so you can try again. It will not
report success for something it did not do.

**You do not need to email anyone, and emailing will not be faster.** The button
reaches more than we can.

### Three things no deletion can reach

Stated here rather than in a footnote, because a deletion control that overpromises
is worse than one that explains itself.

**1. The empty anonymous account row itself.** Removing that requires an
administrative key, and an administrative key cannot ship inside a public web page.
So what the button does instead is **cut the link**: your token is destroyed and the
app starts a new anonymous account rather than re-attaching you to the old one. What
is left behind holds no name, email or phone number and nothing pointing at you.

**2. What a publisher and their ad hosts already saw** when you played audio. We
never received it, we have no relationship with those services, and we cannot reach
it. Their privacy policies govern it.

**3. Rows sent from a device whose storage you had already cleared by hand.**
Without the token, those rows cannot be identified — by you or by us. **That is the
reason to use the button rather than your browser's site-data screen.**

## What is not decided yet

An honest page has to include this, and we would rather record the silence than
fill it in with something we have not done.

**No retention period is stated for the event rows.** Not an oversight, and not a
loophole: no deletion job exists yet, and a stated period we do not actually enforce
would be a false declaration in a document a store reviewer reads. When there is a
job, there will be a period. [What is built and what is not](/status/) tracks it.

**We do not claim compliance with any particular privacy law.** {{ORG}} is a
California company, so the question is live and conspicuous — and most of the
relevant obligations turn on thresholds that have not been assessed. "We comply with
X" is a statement of fact about a review that has not happened. So the policy describes exactly what the app does and stops there.

## Asking us instead

For anything about privacy: [{{MAIL}}](mailto:{{MAIL}}). That address is read
directly; there is no support queue in front of it. **But for deletion, use the
app** — the control reaches things an email cannot, and it is faster.
