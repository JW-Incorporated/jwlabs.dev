# Measuring things, including our own claims

Most of what has gone wrong in building [4a](/4a/) has not been a crash. It has
been a number that was confidently wrong, held for days, and written into other
documents before anybody checked it. This note collects the cases, because the
cases are the argument.

Two people and a fleet of agents can produce written conclusions much faster than
they can produce verified ones. The only defence we have found is to treat a
measurement as a thing that must itself be tested.

## The labels, and why they exist

Every quantity in the project carries one of four labels: **measured**,
**estimated**, **projected**, **designed**. They are not interchangeable, and the
discipline was adopted after two internal write-ups had to be retracted in one week
for mixing them.

The rule that follows from it is the one that costs something: where a flattering
number and an honest number are both available, publish the honest one and say why.
[The transcripts note](/engineering/transcripts/) publishes a speech-recognition
throughput of 1.33x realtime when a measured 2.81x exists in the same table, on the
grounds that the fast figure is unexplained and therefore not a property of the
system. An unexplained good result is not a result.

## A metric that read a perfect score

A retrieval evaluation reported `Recall@5 = 1.000` on its first run. It was not
computing recall. It was computing hit rate — whether *any* relevant result appeared
— which on that query set is trivially satisfied.

Two things followed. The baseline was pinned at a perfect score, which made the
acceptance gate for the proposed improvement **unpassable by construction**: nothing
can beat 1.000. And the resulting verdict was written into five separate documents
before anyone noticed.

The rule adopted afterwards: **a retrieval metric that reads 1.000 on the first try
is a bug until proven otherwise.** More generally, the first job of a new metric is
to be made to fail.

## An index that lost, and therefore did not ship

4a's search is keyword-based. That is a measured choice, not a gap, and it is the
result we like citing most because it went against the fashionable answer and
against our own expectation.

An embedding index was built and run — locally, keyless, at zero cost, on a small
open-weights model on CPU. Vector mode works. Hybrid mode works. **Keyword beat both
on every metric in every configuration tested.** Hybrid came in at −0.122 Recall@5,
−0.028 MRR and −0.104 nDCG against keyword, and dropped one gold query entirely.

There was a second cost that made it worse. Embeddings needed the corpus re-chunked
to 400 real tokens, because otherwise 62% of it exceeds the model's context limit —
and that re-chunk costs *keyword* a further 0.074 MRR. So adopting embeddings would
have degraded the thing that was already winning.

The 373 MB runtime is therefore opt-in, uninstalled by default, and continuous
integration never touches it. The work was not wasted: the outcome is a measured
negative result, which is a permanent answer to a question that would otherwise get
re-asked every quarter.

## A join that returned a plausible zero

Covered in full in [the transcripts note](/engineering/transcripts/), and repeated
here because it is the most transferable lesson in the project.

The question was "how many of our curated episodes have a publisher transcript?"
The answer came back **zero**, and it was wrong — two files keyed episodes on two
different identifiers and neither carried the other's key.

> An empty index announces itself; a broken join returns a real number that happens
> to be zero, and zero was what everyone already feared, so nobody re-checked it.

**A measurement that confirms your fear deserves the same scrutiny as one that
confirms your hope.** The fixed join matches on the one value both files take
verbatim from the same source, and all 158 matches land on that exact key.

The near-miss in the same work is the other half of the lesson. An earlier version
matched on normalised title *or* duration and reported 165. Hand-auditing the seven
non-exact matches found that **all seven were different episodes.** A miss costs one
transcript; a mismatch produces a segment whose anchors point into unrelated audio,
and nothing downstream can detect it. No unit test found this. Reading seven rows by
hand did.

## Instruments that lie about the thing they measure

[The anchoring note](/engineering/segment-anchoring/) has the long version. In
summary: two successive methods for measuring how much audio a podcast host
actually delivers were each defeated by the host.

A `HEAD` request returns the ad-free master's length while a real `GET` delivers the
assembled file — so the first scan reported eighteen of eighteen shows byte-stable
and was completely wrong. Its replacement, a two-byte ranged `GET`, was then caught
doing the same thing on a different host, where three of four probe configurations
reported a figure that matched the feed's declared duration to a fraction of a
second, and only the fourth saw the extra 114.6 seconds that a listener receives.

The heuristic we took away is uncomfortable but has held: on this problem, **an
instrument that agrees with the published metadata is more suspicious than one that
disagrees with it.**

## Benchmarks that lie about the machine

Three ways a throughput number on a laptop can be wrong, all found the hard way:

- **Concurrent load invalidates it.** The same clip measured 0.657x under load and
  1.42x idle — a **2.2x swing from load alone**, which is larger than most of the
  differences anyone would be trying to measure.
- **A sample-limiting flag is not a timing mode.** Using one to make a benchmark
  finish faster produces a number about a workload that does not exist.
- **Piping the harness through a filter changes its behaviour.** Documented in the
  harness's own README as a thing not to do, because it was done.

The standing consequence: run-to-run variance of about 2x on identical input is
treated as a property of this hardware rather than as something to tune away, and
any figure quoted from it comes with the machine state attached.

## A green test is not evidence until you have broken it

The project has five named cases where a passing test pinned nothing at all,
because the fixture was more forgiving than the thing it stood for. A test can be
green because the code is right, or green because the test cannot tell.

So the standing rule is that **every test names, in a comment, the one-line
mutation to the production code that would make it fail — and that mutation must
actually be run.** The narration tooling's suite is 32 tests, each carrying its
killing mutation.

That discipline caught a real one. A caching wrapper around a paid API looked
correct and would have cached a rate-limit error's JSON body as though it were
generated audio, because `fetch` resolves rather than rejects on a 429 or a 500. The
test that found it exists because someone wrote down how to break it. And the
general principle behind it: **absence of contrary evidence is not a positive
assertion.**

The same idea drives the cost-estimation design in that tooling. A dry run is
worthless if it counts a different string than the real call would send, so the
defence is structural rather than a comment asking people to be careful: **the
function that builds the real HTTP request is the one the dry run measures, and the
dry run reports the character count of that request's body.** There is no second
"estimated text" path. To make the estimate wrong you now have to make the request
wrong, in the same direction and by the same amount — a bug that shows up as broken
audio rather than as a surprising invoice.

## Budgets that fail the build

The native app bundle has a hard ceiling of 3.00 MB, enforced by the tool that
assembles it. It is currently 2.10 MB across 36 files.

It reached **2.98 MB** on 2026-08-18 and would have failed on the next nightly
content refresh. Two fixes were rejected before the right one was found:

- **Raising the cap was rejected because it silences the only alarm.**
- Lowering it was rejected too, as arbitrary.

The fix was to change the *shape* of the bundled data rather than its size: the
bundled catalogue slice is capped at three items per show, giving 622 of 1,534 items
in 680 KB. That makes the bundle `O(shows x topics)` instead of `O(episodes)` — and
shows have been flat at 213 since 2026-07-13 while episodes went from 764 to 1,534.
**A year of nightly refreshes now adds zero bundle bytes.**

## Automation that cannot mark its own homework

Content refresh runs nightly in the cloud, keyless, and an agent opens a pull
request that auto-merges on green path-gated checks. The path policy has an allow
list and a deny list, and **the deny list overrides the allow list**, for one
reason:

> A bot that can auto-merge a change to its own checks has no checks.

The default branch is protected by a ruleset requiring a pull request and green
required checks, with zero bypass. The same instinct produces the committed
per-suite test-count floors: a suite that quietly stops running is otherwise
indistinguishable from a suite that passes.

## One measurement that changed the product

Not every measurement is defensive. While measuring advertising load across a
sample of 70 US shows by chart rank, the data answered a question nobody had asked:

**Chart ranks 1–25 are 33% ad-free (9 of 27). Ranks 26–200 are 71% ad-free (30 of
42).** Yates-corrected chi-squared 8.22 on 1 degree of freedom, `p < 0.01`. The
effect survives restriction to the stronger measurement method alone (41% versus
72%).

Chart rank predicts ad injection. So any gate on ad injection is a gate on fame,
and a system that only handles clean timelines will quietly assemble a catalogue of
obscure shows and call it curation. That is a product finding, produced by an
engineering measurement, and it is the reason the harder tier of the anchoring work
is being built rather than written off.

---

*Every case above is recorded in the decision log, ADRs and tooling READMEs of the
public [foray repository](https://github.com/JW-Incorporated/foray), including the
retractions.*
