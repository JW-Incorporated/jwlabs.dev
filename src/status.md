# What is built, and what is not

Every other page here describes something. This page says which of those things you
can use today, which exist and are not finished, and which are plans. It is one page
so that nobody has to assemble the answer from nine others.

**We do not publish dates.** Not because they are secret — because a date is a
promise, and a missed date on a company website is a worse signal than an absent
one. Where something has no date it is because nobody can honestly give it one.

*Reviewed 2026-08-25. If you are reading this much later and it is unchanged, treat
the "not built" column as the reliable half — it only ever gets shorter, and nothing
in the "you can use this" column has ever moved backwards.*

## You can use this right now

**[4a](/4a/)'s web app is deployed and works.**
[Open it](https://jw-incorporated.github.io/foray/). No signup, no password, no
email address. Four topic queues a day, a natural-language playlist builder,
playlists, saving, family mode, hand-off to your own podcast app, and a working
data-deletion control. It runs on a phone, installs to a home screen, and opens with
no connection — though playing audio needs one.

**[longlive](/longlive/) is live** on its own domain at
[longlivets.com](https://longlivets.com/) — the scrubbable timeline, the category
filters, and the threads.

Those two sentences are the whole "available today" list, and the first is the
reason this website leads with a link rather than a screenshot: you can open the
product and form your own opinion in ten seconds.

## Built, and not distributed

**Native iOS and Android shells** are built from the same code as 4a's web app —
the same interface, the same player, copied at build time rather than forked. The
iOS build has been launched on the simulator. The Android build compiles and has
never been run. **Neither is in any app store, and there is no date.**

Nothing {{ORG}} makes is currently distributed through the App Store or Google Play.
Stating that is cheaper than the alternative.

**4a's foray player** — speed control, next and previous segment, resume at an
exact position — is written and works.

## Assembled, and not published

**Four forays are assembled and held as drafts.**
[Three of them are published here in full](/4a/sample/), stretch by stretch: a
22-minute one across six shows, a 51-minute one across seven, and a 40-minute one
built from eleven episodes of a single show.

**None of the four is published in the app**, so a visitor cannot open one today.
The sequences are real, the source episodes are verified, and the player that would
run them is built. What is missing is publication.

The fourth is the one we cut: an earlier 61-minute assembly of the barbecue subject
that wandered off its own topic and was superseded by the 22-minute version.
[Why that is on the site rather than deleted](/4a/sample/#the-one-we-cut).

## Designed, and not built

Each of these is a real gap. They are here rather than absent because a feature
described in the present tense that does not exist is the one thing this site will
not do.

| | |
|---|---|
| **Publishing forays in the app** | The content exists, the player exists, the publication step does not. |
| **Cross-device sync** | 4a's anonymous account is deliberately built so that adding an email later keeps everything you have already taught it. That upgrade is not something you can use today. |
| **The interests screen** | A screen where you can see and drag what 4a believes about you. Everything it would show already exists; the screen does not. |
| **Deleting old event rows on a schedule** | Not built — which is exactly why [the privacy policy](/4a/privacy/) declares no retention period rather than one we do not enforce. |
| **A published foray narration** | Assembled sequences currently cut from stretch to stretch. Spoken bridges between them are designed and not built. |

## Written, and not yet verified

One item, and it is the most important thing on this page, which is why it is not a
row in a table.

**The database access rules that isolate one listener's rows from another's are
written to specification and have not been tested against the live project.** They
must be reviewed and tested before any real listener data lands.

Until then this site does not say that isolation guarantee is in force. It says the
mechanism is chosen and the verification is outstanding.
[The security page](/security/) carries the same statement, because it is the most
likely place for a real finding and hiding it would be the easiest lie here.

## Deliberately not decided

Not gaps — open questions where publishing a position we have not earned would be
the failure.

- **No claim of compliance with any privacy law.** {{ORG}} is a California company,
  so the question is live and conspicuous. Most of the relevant obligations turn on
  revenue and data-volume thresholds that have not been assessed, and "we comply
  with X" is a statement of fact about a review that has not happened.
  [The privacy notice](/privacy/) describes plainly what the site does and does not
  collect, and stops there.
- **No stated position on European data-protection obligations.** A US-only listing
  versus accepting those obligations from day one is unresolved, and it changes what
  a privacy notice must promise.
- **No data-retention period**, for the reason in the table above.
- **No accessibility conformance claim.** No audit has been performed, by us or by
  anyone else. [The accessibility page](/accessibility/) names the specific things
  that are untested.
- **No security audit claim.** None has been performed. Also said plainly, on
  [the security page](/security/).

## What we are working on

Directions do not rot, so here is the direction rather than a roadmap.

**For [4a](/4a/):** making the assembled sequences something you can actually open.
That is the product's real promise — [read one](/4a/sample/) and it is obvious — and
everything between here and there is publication, narration between stretches, and
the library work that gives the next one better raw material.

**For [longlive](/longlive/):** more of the timeline, sourced and dated to the same
standard, with fan interpretation marked as interpretation on the moment itself.

**For the company:** [outside engineering work](/services/), where the problem is
the kind of problem we are good at.

Which is why the honest summary of the roadmap is short, and has been the same since
the first week: **a lot of source material, a reader who wants a path through it, and
nothing asserted more confidently than its source supports.**
