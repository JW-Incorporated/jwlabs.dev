# Anchoring a segment in audio nobody else receives

A timestamp in a podcast episode is not an address. It is a claim about one copy of
one file, and on most popular shows that copy was assembled for a single request
and will never exist again. This is the problem underneath the harder half of
[4a](/4a/), what it cost to measure it properly, and the shape of the answer.

## What the product needs

4a assembles a *foray*: an ordered run of segments cut from several real episodes
and played back to back. A segment is a bounded `start` → `end` region of one
episode.

Two constraints on how it may be played, and neither is negotiable:

**Seek and stop against the publisher's original file.** No concatenated derived
artefact, no re-encoding, no proxying, no rehosting. 4a sets the media element's
source to the publisher's own enclosure URL, seeks to `start`, and stops at `end`.
There is no {{STUDIO}} server in the path between a listener and an episode.

**No ad detection, ever.** Nothing in this system identifies where an
advertisement is. That an advertisement happens to fall outside a chosen segment
is incidental and is never presented as a feature. Copy follows the mechanism: no
user-facing language may imply that we produce a new audio file or remove
anything.

Those two rules make the engineering much harder, and we keep them because the
alternative is a product built on somebody else's copyright.

## Why the timestamp does not survive

Dynamic ad insertion stitches advertisements into an episode **per request**. The
same episode GUID serves different bytes to different listeners, with a total
duration that moves by one to four minutes between copies.

A listener's *own* copy is stable, which is why resume works. But a boundary
authored anywhere else is, by definition, a claim about a *foreign* copy's
timeline. And an authored segment boundary is foreign by construction.

**Measured, 2026-08-11:** of 1,309 playable items in the catalogue, **903 —
sixty-nine per cent — are on shows we suspect of dynamic ad insertion.** When the
work was first scoped it was 64%. It is going the wrong way.

The failure mode is not cosmetic. Cut in the wrong place and you open mid-sentence,
mid-advertisement, or forty seconds into somebody else's answer to a question the
listener never heard.

## Our measuring instruments lied to us. Twice.

Before the design, the size of the displacement had to be measured. Two successive
attempts to measure it were each defeated by the thing being measured, and both
are worth telling, because a bad number here does not announce itself.

### First: `HEAD` requests lie

The obvious way to compare a declared duration against a delivered file is to ask
the host how big the file is. The first version of the scan did exactly that,
reported **18 of 18 shows byte-stable**, and was completely wrong. An ad-inserting
host answers `HEAD` with the *ad-free master's* `Content-Length` while a real `GET`
delivers the assembled file.

> Stuff You Should Know's `HEAD` says 35,549,607 bytes. Its download is
> 44,961,612.

The method was replaced with a two-byte ranged `GET`, reading the true total out
of the `Content-Range` header. Cheap, and it looked correct.

### Then: the ranged `GET` lies too

On one host, a probe grid — ranged versus unranged, crossed with two client
identities — produced four answers, three of which agreed with each other and were
all wrong. Only the unranged request from the ordinary client identity was served
the assembled file.

| what was asked | bytes reported |
|---|---|
| three of the four probe cells | 67,510,022 |
| unranged, ordinary client identity | 68,884,898 |

The difference is 1,374,876 bytes, which at 96 kbps is **114.6 seconds** of audio
that three of four measurement methods could not see. And the smaller figure is
not a rounding artefact — it is the master, to a fraction of a second:

```
67,510,022 bytes x 8 / 96,000 bps = 5,625.8 s
feed declares                       5,626   s
```

The lesson we took from this is not "use unranged GETs". It is that on this
problem, **an instrument that agrees with the metadata is more suspicious than one
that disagrees with it**, because the metadata describes a file nobody receives.

## What the displacement actually is

Eight episodes across four shows were then downloaded in full and decoded, which
is the only method nothing can lie to. **Measured, 2026-08-15:**

| show | feed says | transcript ends | audio really is | delta |
|---|---|---|---|---|
| Stuff You Should Know | 36.98 m | 36.88 m | 46.93 m | +10.0 min |
| Stuff You Should Know | 47.48 m | 47.37 m | 55.72 m | +8.4 min |
| Odd Lots | 66.43 m | 66.00 m | 76.67 m | +10.7 min |
| Odd Lots | 59.67 m | 59.15 m | 67.92 m | +8.8 min |
| This Podcast Will Kill You | 78.78 m | 78.31 m | 86.27 m | +8.0 min |
| This Podcast Will Kill You | 72.63 m | 72.17 m | 80.13 m | +8.0 min |
| Being an Engineer | 50.28 m | 51.68 m | 50.30 m | +0.8 s |
| Being an Engineer | 39.25 m | 39.79 m | 39.26 m | +0.3 s |

Note what the feed and the publisher's own transcript agree on in every row:
**both describe the ad-free program.** The publisher's transcript is a timeline of
a file nobody receives. And note the last two rows — a show with no dynamic
insertion is accurate to under a second, which is what makes the other six
diagnosable rather than merely noisy.

## The arithmetic, stated properly

Let `cum(t)` be the injected advertising time occurring before content-time `t` in
a given copy. It is a non-decreasing step function: flat between breaks, jumping by
a pod's length at each break, bounded above by that copy's total delta.

- **Pre-roll only.** Every break is at `t = 0`, so `cum(t)` is the same constant
  everywhere. One calibration fixes every timestamp in the episode, no matter how
  large the constant is.
- **Mid-rolls.** The error at any point is our cumulative advertising time before
  that point minus the listener's: `err(t) = cum_ours(t) - cum_theirs(t)`. Author
  from a publisher transcript and `cum_ours` is identically zero, so the content we
  want sits **later** in the listener's file — by an amount that **grows through
  the episode**.

Now put the numbers next to the segment length. Our target segment band is
**75–180 seconds, centred around 110**, and the observed median across extracted
segments is 62 seconds. An eight-minute divergence is three to eight segment
lengths wide.

**So the error can exceed the length of the segment itself.** A two-minute segment
displaced by eight minutes is not a slightly-off cut. It is a different story, told
by a different person, possibly inside an advertisement.

### A duration check can detect but cannot locate

The tempting shortcut is to compare the observed duration with the declared one and
correct by the difference. It does not work, and the reason is structural: one
scalar cannot invert a piecewise-constant offset function with `k` unknown break
positions and `k` unknown pod lengths. **Duration match is a detector, not a
locator.** Two shows with an identical total delta — one pre-roll-only, one with six
mid-rolls — are indistinguishable from outside the file, and they need completely
different corrections.

### Why 120 seconds, and why that threshold is distribution-free

There is one regime where ignorance is affordable. Because `cum(t)` is bounded
above by the copy's total delta, **a total delta of 120 seconds or less bounds the
error at every point in the episode at 120 seconds or less — whatever the
advertising distribution is.**

That is the crux. Below the threshold we do not need to know, and do not need to
discover, whether we are looking at one pre-roll or six mid-rolls. Above it, the
distribution decides the outcome, and the distribution is exactly what a byte or
duration measurement cannot see.

### The measurement that weakened our own conclusion

The threshold argument assumed the delta is a property of the episode. It is not.

Gastropod, "Out of the Fire, Into the Frying Pan", declared duration 2,501.0
seconds, probed twice from **the same client, hours apart**:

| probe | decoded duration | bytes | delta vs feed |
|---|---|---|---|
| 1 | 2,567.1 s | 41,146,837 | +66.1 s |
| 2 | 2,533.7 s | 40,612,263 | +32.7 s |

Both probes decode at about 128.2 kbps, and the byte difference over that bitrate
is `534,574 x 8 / 128,200 = 33.4 s` — exactly the duration spread. So the spread is
real delivered audio, not a decoder or metadata artefact.

**The delta is a property of the request, not of the episode.** Nothing in the
project had measured that before — not because measurements had been careless, but
because *no episode had ever been measured twice*. Per-episode probes tell you
about episodes; repeated probes of one episode tell you about the stitch, and only
the second bounds anything.

The rule that came out of it is one line long, and the last clause is the
important one:

```
delta_max = max delta over N probes of the SAME episode, N >= 2
pad        = delta_max + margin,  margin >= the observed spread between probes
admit if   pad <= 120 s
```

**N = 1 bounds nothing.**

## What we rejected, and why

The obvious external source of truth is the Podcasting 2.0 `<podcast:chapters>`
tag. It fails on two independent grounds, and the structural one is fatal on its
own.

**Structural.** A chapters tag points at a *static JSON file at a fixed URL* — the
same bytes for every listener. There is no per-listener mechanism, and the chapters
fetch is an uncorrelated request the ad stitcher cannot associate with any
particular stitch. So a chapters file is authored against the un-stitched master
and drifts exactly like our own timestamps. It is not a second opinion; it is the
same foreign timeline with extra steps.

**Measured**, across the live feeds of all 213 curated shows (209 fetched,
2026-08-11): only **10 shows — 4.8% — publish chapters at all.** Broken out, 5.1%
of ad-inserting shows and 4.1% of the rest, so the coverage is not merely thin, it
is uncorrelated with where it would be needed. Acquired publishes chapters on 1 of
its 216 episodes. The same probe found `<podcast:transcript>` at roughly three
times the chapter coverage on ad-inserting shows.

## The answer: stop storing a time

The decision is to **stop treating a boundary as a time and start treating it as a
place in the content, with time as a cache.**

Every segment stores two things:

- a **timeline cache** — `start_sec`, `end_sec`, and the
  `reference_duration_sec` of the copy those numbers were read from; and
- **content anchors** — `start_anchor` and `end_anchor`, the verbatim eight to
  twelve words of transcript text at each edge. For example, a boundary in a
  fusion-physics segment is anchored on `so the Lawson criterion is really a
  statement about`.

Playback then walks a ladder, and the rung it lands on is reported honestly rather
than assumed:

1. **A locally downloaded file** — exact. The timeline is frozen; there is nothing
   to drift.
2. **Not an ad-inserting show** — exact, straight from `start_sec`.
3. **Ad-inserting, but the observed duration is within tolerance of the reference**
   — exact. The cache is live.
4. **Ad-inserting and the duration has drifted** — resolve the anchor against a
   transcript of the copy actually in hand.
5. **Anchor unresolvable** — the seek is *approximate*, and the segment is
   **skipped rather than played at the wrong place.**

Four reasons this is the right trade, in the order they convinced us:

**The anchor is free at authoring time.** Extraction already reads a transcript in
order to choose a boundary at all. Capturing the words at each edge costs nothing
extra.

**It makes the output durable.** A segment stored as bare timestamps is scoped to
one copy of one file, and it rots the moment the publisher re-uploads, re-encodes
or changes ad load. A segment stored with anchors is a claim about *content*, and
stays true. If an effort spends two days extracting segments, that output should
not have a shelf life measured in ad campaigns.

**It degrades honestly.** Every failure path lands on "skip this segment", never on
"play the wrong forty seconds".

**It reuses the existing seam.** One function is already the single chokepoint
every seek path consults. This adds a branch to it, not an architecture.

## Verbatim means verbatim, and it is enforced

An anchor that has been paraphrased is worse than no anchor, because it produces a
boundary that can never be resolved and **it fails silently at playback**. So the
validator rejects rather than repairs.

Both sides of the comparison are canonicalised — Unicode NFKC, lowercased,
apostrophes elided, every other run of non-alphanumeric characters collapsed to one
space — and compared as a whole-word subsequence. That forgives artefacts of *how
text was written down*: case, doubled spaces, hyphenation, smart quotes,
`that's` matching `thats`. It rejects every artefact of *rewriting*: `that is` for
`that's`, `30` for `thirty`, a synonym, a changed tense.

Two further guards, each earned:

- **An anchor under four words is not a location.** It is a phrase that will occur
  eleven times in the episode.
- **An anchor whose every occurrence sits more than 120 seconds from the timestamp
  it claims** means the timeline cache is junk even though the words are real.

## What this does not solve

Segments fall into two tiers, and only one of them is playable today.

**PADDABLE** — the pad needed is 120 seconds or less. Usable now.

**LOCATE-REQUIRED** — the pad needed exceeds 120 seconds. These shows are
**authored but not played.** Authoring does not wait for playback; playback waits
for a locate step. Stuff You Should Know, Odd Lots and This Podcast Will Kill You
are all in this tier, which is to say some of the best material in the catalogue is
in it.

The locate step is designed and not built. The plan is windowed automatic speech
recognition: since `cum(t)` lies between zero and the total delta, the content
authored at `t` lies somewhere in `[t, t + total]` in the listener's file, so **the
search window is exactly the total delta wide.** Sized honestly for a two-minute
segment on a Stuff You Should Know episode, that is about 13.6 minutes of audio to
transcribe instead of 47 — roughly a 3.5x saving. (An earlier draft of that estimate
said 12 minutes, which was a point estimate where an upper bound was required.)

And one more limit, which is the paragraph we would most want a reader to take
away, because it argues against our own design:

> **The honest cost of the pad correction is that the guarantee weakens from
> deterministic to probabilistic, and nothing we have measured bounds the tail.**
> With the delta fixed per episode, "total under 120 seconds bounds the error
> everywhere" was arithmetic. With the delta varying per request, we bound the
> listener's load only by sampling our own, so the claim becomes: displacement
> stays within the pad for any copy whose load is no worse than the worst we
> sampled, plus the margin. When a copy exceeds that, the payload is truncated by
> however much it exceeds it — and the one spread we have measured is 33.4
> seconds, up to a third of a 110-second segment. Do not read this as "a few
> seconds". It is still a materially better failure than a confident cut at an
> unknown place, but it is a probabilistic argument now and should not be dressed
> as a bound.

## One side finding, because it is too good to leave out

While measuring ad load across a sample of 70 US shows by chart rank (69 yielded a
measurement), the data answered a question nobody had asked:

**Chart ranks 1–25 are 33% ad-free (9 of 27). Ranks 26–200 are 71% ad-free (30 of
42).** Yates-corrected chi-squared 8.22 on 1 degree of freedom, `p < 0.01`, and
the effect survives restriction to the stronger byte-ratio method alone (41%
versus 72%).

Chart rank predicts ad injection. Which means a gate on ad injection is a gate on
fame — and any system that can only handle clean timelines will quietly build a
catalogue of obscure shows and call it curation. That is a product problem
discovered by an engineering measurement, and it is the reason the
LOCATE-REQUIRED tier gets built rather than written off.

## Status

Rungs 1, 2, 3 and 5 of the playback ladder are implemented and tested. Rung 4 —
the locate step — exists as a named, callable, tested *absence*: the function is
there, it is wired in, and it reports that it cannot resolve. The pad rung is
implemented and defaults to off. Four forays exist in the catalogue and **all four
are drafts; no foray is published**, so a visitor to 4a today will not meet this
machinery. It is being built ahead of the thing that needs it, on purpose:
extraction and playback decouple, and cataloguing can produce durable, correct
output for days before a single foray is playable.

---

*Written from the project's own architecture decision records and measurement
logs, which live in the public [foray
repository](https://github.com/JW-Incorporated/foray) alongside the code they
describe. Numbers labelled measured were observed on real feeds and real audio on
the dates given; the windowed-ASR saving is an estimate and is labelled as one.*
