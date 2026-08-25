# Choosing four things a day

[4a](/4a/) shows a listener four topic queues each day. Three come from topics they
have demonstrated an interest in. **One is deliberately something else.** The name
of the app is the shape of its home screen.

This note is about why that shape rather than a ranked list, how a show gets
classified after a classifier confidently filed a general-audience science show
under medicine, and what happened when we measured whether a narrated version of a
subject was even possible on the tape we have.

## Why not a top-four list

The temptation is to score every episode once and show the best four. The design
spec rejects that in a sentence worth keeping: taking the top four of one ranked
list produces **"your three usual shows plus one random thing — a subscription
list with extra steps."**

So variety is built into the structure instead of hoped for as an outcome. Four
slots are filled from four separate candidate pools, and **one slot is
structurally reserved** for a pick drawn from adjacent embedding space — near, but
not inside, the listener's demonstrated clusters — or from a cold taxonomy branch
with high global quality. In the interface it carries a visible badge, **Stretch**,
titled *outside your usual topics, on purpose*.

Two properties of that slot are deliberate and unusual:

- **It ignores the listener's historical skip rate for the region it explores.**
  Exploration is the point. A slot that backs off when skipped is not an
  exploration slot, it is a slower path to the same three shows.
- **It has to say why.** A Stretch pick must state the bridge — the reason *this*
  is next to *that* — in eighteen words or fewer. A recommendation that cannot
  articulate its own bridge is a random pick with better graphics.

Discovery surfaces keep a hard exploration floor of roughly thirty per cent
overall. **Measured on the live client:** across eight rebuilds in one session the
Stretch count was `1` every time, never `0` and never `2`. That is a small
verification and it is the first real one — the guarantee was in a document for
weeks before anything checked it on the shipped page.

There is no infinite scroll, no streak, no autoplay chain and no notification
bait, because each of those is a way of increasing time-in-app at the cost of the
thing the product is for.

## The copy rules are code

Every user-facing string in 4a passes a machine check before it can ship. Why-lines
are capped at eighteen words, hooks at sixteen. A list of banned words and
constructions is enforced: no "fascinating", no "delve", no clickbait that withholds
the subject, no framing built on how long somebody's commute is.

The rules live in exactly one file, and a test in continuous integration reads every
user-facing string in the published data and **fails the build** if one breaks
them. Marketing-flavoured filler is not discouraged in 4a; it is a broken build.

This is the sort of rule that sounds precious until you watch what happens without
it. A curator that generates its own explanations will, left alone, produce four
cards a day that all say a version of the same thing.

## Classifying a catalogue after your classifier fails

The catalogue has two tiers: a curated tier (**220 shows**, 1,705 episode-level
items, against a taxonomy of 194 nodes in 41 top-level branches) and a breadth tier
of **19,787 US shows** harvested across all 110 Apple podcast genres, 99.7% of them
with a resolvable feed URL. An international breadth file of 121,786 shows exists
and is explicitly out of scope.

The first classifier was not trusted, and it earned that. Two documented failures:

**It classified from title and Apple genre only** — no show description, no episode
content. *Science Friday*, a general-audience science show, `chart_rank` 1 in its
genre, came out tagged `medicine/biology` at low confidence. A plausible-sounding
wrong node, produced by a classifier that had nothing to work with but a genre
string and a title that does not describe itself.

**Forty-six episodes were filed under `engineering/energy-fusion`** while actually
being about FFmpeg, the LHC beam dump, fission reactors and electric vehicle
chargers. General engineering and physics content, dumped into an adjacent, more
specific node.

That second one is the sharper evidence, because the failure is not random noise.
It is **systematic node pollution from a coarse signal** — and a taxonomy that
looks populated while being wrong is worse than one that looks empty.

### The cheap-first cascade

The replacement is four tiers, each escalating only when the one below is not good
enough.

**Tier 0 — free, deterministic.** A genre-to-node map covering all 110 Apple
genres, plus title-keyword matching. Explicitly demoted from "the classification"
to "a prior fed into Tier 1". It is never written as a final answer on its own,
which is precisely the mistake the old classifier made.

**Tier 0.5 — free, but with a real wall-clock cost.** Fetch each show's feed and
pull out the channel description and the five to ten most recent episode
title-and-description pairs. The engineering cost here is not money, it is manners
and robustness: rate limiting, jitter, per-host politeness, and the requirement
that a dead feed, a timeout or malformed XML degrades to Tier-0-only plus a
`needs_review` flag rather than crashing the batch.

**Tier 1 — the default final answer.** A classification agent reasons over the
title, the Tier-0 prior, the fetched description and the episode sample. It emits
**multiple labels**, not one: an array of node-and-confidence pairs, because a show
can legitimately be science *and* medicine *and* education. Plus a `needs_review`
boolean and a short rationale.

**Tier 2 — escalation, gated.** It runs when Tier 1's confidence on every candidate
is below threshold, **or** when Tier 1's top node conflicts with a high-confidence
Tier-0 prior — which is the exact signature of the fusion-versus-fission confusion
above — **or** when the show is top-ranked in its genre, because more listeners are
exposed to a wrong tag there. Tier 2 may add a truncated transcript excerpt, but
only where the publisher already provides one.

Full transcripts at every tier were considered and rejected on cost: transcript
text runs five to fifteen thousand tokens per episode against fifty to two hundred
for a truncated description — one to two orders of magnitude more, to improve a
label that a description usually gets right.

### The output rule

**The classifier is not allowed to guess.** A show with no confident node above
threshold is tagged with an empty topic list and `needs_review: true` — visible and
auditable, rather than hidden behind a plausible-looking wrong label. Given what
the first classifier did, this is the single most important line in the design.

The same pass also writes the short display title and blurb a listener sees. Both
are required to be grounded strictly in the fetched description and episode
content, never invented and never exaggerated — the "legally boring" principle
extends naturally to "do not invent what a show is about" — and both are validated
against the copy rules, where a failure is flagged rather than silently emitted.

### Status, stated plainly

The methodology is approved and the tooling is built and verified end to end on its
deterministic parts. **No scaled classification batch has run.** About 44 shows
have been classified. The legacy classification is still visibly wrong in the
production data — it files Odd Lots under `sports/soccer` and one legal-affairs
show under `engineering/ai-robotics` — so any topic-weighted ranking today is a
ranking on a classifier's mistakes, and we know it.

The one verification that has happened is a good one: the very first show the new
pipeline fetched was *Science Friday* itself, and its real fetched signal directly
contradicted the genre map's `medicine/biology` guess. A live confirmation that the
methodology fixes the documented bug, rather than a hope that it would.

## Segments, and the discipline of returning nothing

Segment extraction runs the same three-stage shape: a deterministic, keyless,
resumable `prepare` step; an agent step; and a `merge` step that validates hard,
rejects silently-wrong output and is idempotent.

The most important line in the agent's contract is about permission to fail:

> **Returning zero segments must be a first-class, unpenalised answer.** Most
> episodes contain no segment worth a foray. A prompt that implies a quota
> manufactures filler, and filler is what kills the format.

One gate added late is worth describing, because it catches the failure nothing
downstream can catch. A transcript whose last cue overruns the feed's declared
duration by more than five seconds is excluded outright. The reason: the [anchor
tolerance](/engineering/segment-anchoring/) is 120 seconds and the span-plausibility
check allows a ratio of 1.5, so a transcript offset by thirty to a hundred seconds
**resolves, passes every check, and plays the wrong words.** Measured over the 1,718
transcripts held on 2026-08-23: 58 overrun, 55 of them from a single show.

## Where the tape runs out

The last piece is the one we are proudest of not having built.

Some subjects are simply not in podcast form. Searching the crawled corpus for
South African braai — braai, braaivleis, shisa nyama, potjie — returns **zero
episode-level hits across all 7,237 crawled feeds.** A feed-level sweep of the full
index surfaced a handful of braai-named feeds: a five-episode show, an Afrikaans
religion station, a business podcast and a society chat show. None of them is a
source. Filipino lechon has no source at all.

Neither is an advertising problem, so none of the anchoring work touches them. They
are the argument for a narrator — scripted by us, voiced by a synthesis vendor —
and nothing else will reach them.

So we measured whether the tape we do have could carry a subject on its own. A
sixty-three-beat outline on one subject scored **1 beat strong, 15 thin, 47 empty**
against the catalogue, with the first act — the sixteen chained beats that are the
actual education — at **0 strong, 3 thin, 13 empty.** The document's own verdict:
*"On this catalogue Act I is not holed, it is absent."* A forty-beat barbecue
outline did better at 11 strong, 9 thin, 20 empty.

Then the ratio that settled it. Narration is capped at a target of 25% of a foray's
runtime and a ceiling of 35%, on the grounds that past about 40% you have made an
essay with clips in it rather than a foray. Written honestly against today's
coverage:

- the complete forty-beat barbecue foray comes out **about 44% narrator** — so it
  is not shippable as a foray, and **the number says so before anyone writes a
  word**;
- the sixty-three-beat outline comes out **72.9% narrator**, and exceeds the
  target by 179 seconds before a single empty beat is carried.

**Nothing about the narrator is built.** Zero narration items exist in the data.
No speech-synthesis call has ever been made — the tooling is dry by construction,
and a test greps every file in it for a network call, a defaulted transport, an API
key literal and a key read from the environment. The player already handles
narration items correctly, with resets and fallbacks, and every one of those paths
is exercised only by fixtures.

What exists instead is a costing, a craft specification with six narration modes and
a hard rejection test — *if a script would fit another beat of the same outline with
only the proper nouns changed, it is filler, and it is rejected rather than
trimmed* — and one audited vertical slice: four beats, 4,437 characters, 261 seconds
of narration against zero seconds of tape, carried all the way from outline to
sourced quotations. The other fourteen threads are named and empty, on the principle
that **an outline nobody can audit is worth less than one thread that has been.**

---

*Written from the project's own curation specification, classification ADR and
coverage measurements in the public [foray
repository](https://github.com/JW-Incorporated/foray). Everything above that is
built is described in the present tense; everything designed and unbuilt says so.*
