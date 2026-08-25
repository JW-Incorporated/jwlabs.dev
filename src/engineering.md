# Engineering notes

These are write-ups of real problems in software {{ORG}} is building, at the level
of detail we would want if we were reading somebody else's. They are not case
studies and there is no client to flatter. Most of them end with something that
does not work yet, or with a measurement that contradicted what we had assumed a
week earlier.

They exist for two reasons. The first is that [4a](/4a/) turned out to have one
genuinely hard problem underneath it, and the solution is interesting enough to
be worth writing down. The second is that a studio of two people has no
letterhead to hide behind: the only useful evidence that we can build something
is a description of something we built, with the numbers attached and the failures
left in.

## The notes

**[Anchoring a segment in audio nobody else receives](/engineering/segment-anchoring/)**
Podcast advertising is stitched per request, so the same episode is a different
file for every listener, minutes longer or shorter than the one you measured. Any
timestamp you write down is a claim about a copy nobody else will ever hear. This
is the note on how a timestamp stops being an address and becomes a cache, what
it cost to find out that our own measuring instruments were lying to us twice in
a row, and why the resulting guarantee is weaker than it looks.

**[Where the transcripts are, and where they are not](/engineering/transcripts/)**
You cannot choose where to cut audio you cannot read. Measuring transcript
availability across 82,043 episodes produced a finding that inverted the plan:
transcripts exist almost exclusively on the shows whose timestamps are useless,
and the shows with stable timelines publish almost none. A 19x gap, pointing the
wrong way.

**[Choosing four things a day](/engineering/curation/)** The product is four
queues, one of them deliberately not for you. This is the note on why a top-four
list would have been the wrong shape, how episodes get classified after a
classifier confidently filed a general-audience science show under medicine, and
what happened when we measured whether a narrated version of a topic was even
possible on the tape we have. It was not.

**[Measuring things, including our own claims](/engineering/measurement/)** A
metric that read a perfect score on its first run. A join that returned a
plausible zero. A benchmark that was 2.2x faster when nothing else was running.
An embedding index that lost to keyword search on every metric and therefore did
not ship. Five ways a number lied to us, and the rules we adopted afterwards.

**[Privacy by construction](/engineering/privacy-by-construction/)** 4a's
Content Security Policy names two origins it may send data to, which is why the
privacy claims are structural rather than promissory. It is also not the total
seal it appears to be, and this note says exactly where it leaks and why we chose
that.

## How to read the numbers

Every quantity on these pages carries one of four labels, and they are not
interchangeable. We adopted them after two internal write-ups had to be retracted
for mixing them up.

| Label | Means |
|---|---|
| **Measured** | Observed on real data or real hardware, with the method stated. Repeatable. |
| **Estimated** | Arithmetic on an assumption. Useful for a decision, not quotable as a fact. |
| **Projected** | An extrapolation from a sample to a population that has not been sampled. Order of magnitude at best. |
| **Designed** | Written down, agreed, and not built. Present in a document, absent from the product. |

Where a page states a number without a label it is measured, and the method is in
the sentence next to it. Where a number would flatter us and we have not earned
it, the page says so — there is a throughput figure in the transcripts note that
is twice as fast as the one we publish, and the reason we publish the slow one is
that we cannot explain the fast one.
