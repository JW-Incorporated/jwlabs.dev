# Where the transcripts are, and where they are not

You cannot choose where to cut audio you cannot read. [4a](/4a/) needs the
verbatim words at each edge of a segment — that is [the whole
answer](/engineering/segment-anchoring/) to podcast advertising being stitched per
request — so before anything could be extracted, somebody had to find out how many
episodes come with a usable transcript.

The answer inverted the plan.

## The structural finding

**Measured, 2026-08-11**, across the curated catalogue:

| pool | shows | episodes | with a publisher transcript | coverage |
|---|---|---|---|---|
| dynamic ad insertion | 144 | 59,768 | 7,966 | **13.3%** |
| stable timeline | 68 | 22,275 | **46** | **0.2%** |

An independent episode-level cut over 81,553 episodes gives the same shape: 13.4%
against 0.7%.

Stated plainly: **publisher transcripts exist almost exclusively where we cannot
use their timestamps, and stable timelines exist almost exclusively where no
transcript exists.** A 19x gap, pointing the wrong way.

The correlation is measured. The explanation is an inference, and is labelled as
one: transcripts are published by professionalised operations investing in
accessibility and search visibility — the same operations monetising through
dynamic ad insertion. Independently hosted shows do neither.

The consequence for the roadmap is direct. For the well-resourced half of the
catalogue we have text and no trustworthy clock, so we need [content
anchors](/engineering/segment-anchoring/) and eventually a locate step. For the
other half we have a trustworthy clock and no text, so we need to produce the text
ourselves. Neither half can be skipped, and they need different machinery.

## Taking the free transcripts first

The transcripts that already exist cost nothing but politeness to collect, so they
were collected first.

**Measured, on disk as of 2026-08-23: 1,643 usable transcripts across 15 shows,
about 759 hours of anchored speech.** Two passes: a depth pass of 587 transcripts
across 10 shows (181,225 cues, 428.3 hours), then a breadth tranche of 1,126
successes from 1,131 attempts (460,178 cues, 331.1 hours, five network failures).
None of it cost a dollar or a second of speech recognition.

On manners, which matter when you are fetching from a thousand hosts that owe you
nothing: **1,000 feeds, three failures (a 404, a 410, one empty feed), zero
retries, zero rate-limit responses, and no host asked us to slow down**, at a
concurrency of four. Zero retries is the strong form of that claim — the sweep logs
a line for every rate-limit and every server error it backs off from, and there
were none to log.

## Three ways a transcript corpus lies about its own size

Running this on the real catalogue produced three data-quality findings that no
amount of unit testing would have produced, and each one changed a number somebody
had already written down.

**One transcript claimed 100 hours on a 70-minute episode.** A single cue ending at
`99:59:59.999` — which is what a writer emits when it means "no end time". Summed
naively, that one file put the corpus total at 527 hours instead of 428. A headline
number **24% wrong because of one degenerate file.**

**Four of 587 files normalise to zero cues.** Three are nine-byte stubs one show
publishes for episodes it has not transcribed. The fourth was a real gap in our
normaliser: a subtitle format that prefixes the speaker's name onto the timing line,
which one hosting platform emits, so all 2,305 cues in that file were silently
dropped.

**Sixty-six of the 1,126 are "Transcription in progress." stubs.** A structurally
valid subtitle file with one five-second cue and fifty-eight bytes of nothing. They
pass every guard the pipeline has. This is the third distinct shape of bad
transcript, and the only one that looks completely healthy in the summary.

## The join that returned a plausible zero

This is the one worth reading twice.

Asking "how many of our 1,672 curated episodes have a publisher transcript?"
answered **zero**. Not because the index was empty, but because the catalogue keys
episodes on Apple identifiers while the transcript index keys them on the feed's
`<guid>` — and neither file carries the other's key.

> That is the worst shape a measurement can take. An empty index announces itself;
> a broken join returns a real number that happens to be zero, and zero was what
> everyone already feared, so nobody re-checked it.

The fix was to join on `enclosure_url`, the only value both files take verbatim
from the same feed. **All 158 matches land on that exact key.** Corrected: of 1,672
curated episodes, **158 (9.4%) have a publisher transcript and 137 (8.2%) have a
timed one**, across 24 of 221 shows.

And then the near-miss, which is the reason the exact key matters:

The first working version of the join tried a normalised-title match and a duration
match *independently*, and reported 165. Auditing the seven non-exact matches by
hand, **every one was a different episode.** A miss costs one transcript. A
mismatch produces a segment whose anchors point into different audio, and nothing
downstream can detect it. **No unit test found this — only running the real
catalogue and reading the seven by hand did.**

## Where the free transcripts run out

Across the whole curated catalogue, **measured over 82,043 episodes on 213 shows**
(212 feeds fetched; one had an expired certificate): 8,012 episodes carry a
transcript of any kind (9.8%), and only **7,515 (9.2%) carry a timestamped one.**
Chapters, for comparison: 732 episodes, 0.9%.

Thirty of 213 shows publish any transcript at all, twenty-five publish a timed
one, and two shows — Stuff You Should Know at 2,850 episodes and Odd Lots at 1,251
— are half of the total.

Format distribution across 23,219 transcript tags: WebVTT 7,063, SubRip 6,848,
plain text 6,632, HTML 1,268, JSON 787, and 621 more under an alternate SubRip MIME
type — about 2.9 tags per transcribed episode. **Roughly two thirds are usable.**
Plain text and HTML carry no timestamps and therefore cannot anchor a boundary,
however good the prose is.

## Was blind breadth the answer? No, and we measured it

The obvious move at that point is to stop curating and start sweeping: fetch
everything, keep whatever has a timed transcript. It was tried properly, with the
sweep split into a ranked "exploit" arm and a uniformly random "explore" arm —
because a greedy tranche measures the shows you predicted would win, and only the
random arm estimates the population.

The raw yield looks like a triumph. Tranche one, 500 feeds: **178,191 timed
transcripts**, which is 23.5 times the entire curated catalogue's 7,571, from 2.3
times the requests. The exploit arm beat the random arm 41x per feed. Tranche two,
1,000 feeds: 161,099 more.

The useful number cuts the other way. On *net anchorable* transcripts — timed, on a
show whose timeline we can trust, actually usable for a segment — the random arm
returns **0.7 per feed against the curated set's 3.1. Four and a half times
worse.** The curated 220 really were the good part, and blind breadth is a bad use
of a request budget.

One caveat we are careful to keep attached to that whole result: **all 46 anchorable
shows across both tranches are classified `dai_reason: unknown`.** Not one is
positively verified as having a stable timeline; each is "no host anywhere in this
chain is on the list", filed as a pass. Ten thousand nine hundred and thirty-three
net-anchorable transcripts rest on that inference, against 1,145 before, and 5,461
of them come from one hosting platform.

**Projected, and labelled as a projection:** the remaining 18,936 unswept feeds
hold on the order of 269,000 timed transcripts, and at the explore arm's rate,
roughly 13,000 net-anchorable ones. That is an extrapolation from a sample to a
population that has not been sampled. It is not a forecast and it is not a promise.

## Making our own transcripts: what it actually costs

For the half of the catalogue with a stable timeline and no text, the transcript
has to be produced locally. That was benchmarked properly rather than estimated,
because the project's previous estimate of speech-recognition throughput had been
wrong by a factor of two — in both directions.

The stack: `faster-whisper` 1.2.1 on `ctranslate2` 4.8.1, Python 3.14.5, audio
decoded through PyAV, which ships the FFmpeg libraries inside its wheel so there is
no system dependency to install. `base.en`, int8, on CPU: an Intel i7-13620H, ten
cores, sixteen threads, 15.7 GB of memory, no usable GPU. Word-level timestamps
come out exact.

**Measured**, one full episode (Radiolab, "Neither Confirm Nor Deny", real decoded
duration 1,989.4 seconds — the feed said 1,745, four minutes short, which is why
the harness measures duration from the file rather than trusting metadata):

| model | machine state | wall clock | realtime factor | effective threads | words with sane timestamps |
|---|---|---|---|---|---|
| `base.en` | quiet | 1,498.7 s | **1.33x** | 2.36 of 16 | 5,376 / 5,376 |
| `small.en` | quiet | 3,722.2 s | 0.53x | 2.48 of 16 | 5,380 / 5,380 |
| `base.en` | ~12 agents sharing the CPU | 708.9 s | 2.81x | not recorded | 5,411 / 5,411 |
| `medium.en` | — | never completed a pass | — | — | — |

**We publish 1.33x, not 2.81x.** The fast row is the anomaly, not the target, and
the honest position is that it is unexplained. Treat run-to-run variance of about
2x on identical input as a property of this setup rather than as something to tune
away. We also do not publish the short-sample numbers taken earlier, which are kept
only as a record of how badly short samples mislead: the same clip measured 0.657x
under load and 1.42x idle, **a 2.2x swing from load alone.**

At 1.33x, and against a non-DAI pool whose episodes average 61 minutes (median 55,
n=403):

| batch | audio | compute on this laptop | continuous wall time |
|---|---|---|---|
| 100 episodes | 102 h | 76 h | 3.2 days |
| 1,000 episodes | 1,017 h | 765 h | 32 days |
| 5,000 episodes | 5,083 h | 3,822 h | 159 days |
| all 22,275 non-DAI episodes | 22,646 h | 17,027 h | **1.9 years** |

A measured side effect that has to be planned around: the machine cannot be used
for development while a run is in flight — command-line tools start failing with
TLS timeouts from CPU starvation — and two concurrent runs starve each other down
to 0.23 effective threads with neither finishing.

**Estimated, and not to be quoted as fact.** The alternatives were costed, and the
document costing them says outright that nothing in it is trustworthy until
measured on the actual hardware:

| option | throughput | 1,000 episodes | cost |
|---|---|---|---|
| this laptop | 1.33x (measured) | 32 days | zero |
| a local GPU host | 10–20x (est.) | 2–4 days (est.) | electricity |
| rented cloud GPU | 10–20x (est.) | 50–100 GPU-hours (est.) | ~$30–75 (est.) |
| managed speech API | n/a | 1,017 h of audio | ~$150–400 (est., unverified) |

And for scale, one arithmetic exercise rather than a budget: the full 73,719-episode
archive, at an assumed mean length and an assumed per-minute API price, comes to
roughly **$20,000**. The project's own note on that figure is the right one — *that
is not a budget question, it is a different company.*

## Status

Transcript acquisition from publisher tags is built and has been run at scale.
Local speech recognition has been benchmarked on one episode and **has not been run
at scale**; no episode in the catalogue has been transcribed by us for production
use beyond the first nine self-transcribed segments. The GPU path is written down
and unverified, on a machine with no discrete GPU. The four-rung acquisition ladder
is an accepted design in which rung one is implemented and rungs two through four
are not.

---

*Written from the project's own measurement logs and scale plans in the public
[foray repository](https://github.com/JW-Incorporated/foray). Dates are given for
every measured figure because several of these numbers have moved, and one of them
moved because it was wrong.*
