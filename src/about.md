# The company

{{ORG}} is {{ORG_FORM}}, formed on {{ORG_FORMED}}. It builds software, it owns and
operates this domain, and "{{STUDIO}}" is the short form of its name. There is one
company on this page and it is the same one in every sentence.

## What it does

{{STUDIO}} builds software that takes a large, messy body of real source material
and makes it navigable — while keeping every claim attached to the thing it came
from.

That is not a slogan looking for a product. It is the description that fell out of
building two of them:

**[4a](/4a/)** is a podcast curator. Its raw material is 82,043 episodes across
220 curated shows: hours of unindexed speech, with no reliable table of contents
and, on two shows out of three, no stable timeline either. 4a's job is to turn
that into four things worth a listener's attention today, and — when it assembles
a run of segments cut out of several episodes — to know exactly which words bound
each cut, so that a boundary is a claim about *content* rather than a guess at a
clock reading. It never rehosts, transforms or modifies a publisher's audio. The
[engineering notes](/engineering/) are mostly about how hard that turned out to
be.

**[longlive](/longlive/)** is a scrubbable timeline of Taylor Swift's career
across twelve eras. Its raw material is a career's worth of scattered reporting,
and its discipline is the same one: every moment is sourced and dated, and where a
narrative is a widely-held fan interpretation rather than a confirmed fact, the
site says so on the moment itself rather than in a disclaimer nobody reads.

Same shape, different subject. Both products are about provenance under load: a
lot of source material, a reader who wants a path through it, and a hard rule that
nothing gets asserted more confidently than its source supports. That rule is why
4a will skip a segment rather than play it forty seconds off, and why the
[engineering notes](/engineering/) label every number measured, estimated,
projected or designed.

## How it works

{{ORG}} is **two founders and a fleet of AI agents. There is no other staff.**
Worth stating plainly, because it explains several things about this site that
would otherwise look like omissions: there is no team page, no office photograph,
no press list and no phone tree, and the contact address goes to a person rather
than to a queue.

It also explains what the company organises itself around. Two people cannot
out-staff anybody, so the work goes where being small and being careful beats
being large: reading a problem all the way to the bottom, writing down what was
actually measured, and refusing to ship the version that only looks finished. The
[engineering notes](/engineering/) are the evidence for that claim, and they are
the reason this section is short — a description of a working method is worth much
less than five worked examples of it.

## What we will not do

These are product principles, not aspirations. Several of them are enforced by
tests that fail the build.

**Legally boring.** 4a never rehosts, proxies, transforms or modifies podcast
audio. Playback is a seek and a stop against the publisher's own file, served from
the publisher's own host. There is no derived audio artefact at any point in the
pipeline, and a feature request that would produce one goes to legal review before
it goes to a sprint. We also do not detect, skip or strip advertising — not as a
courtesy, but as an architectural commitment that shapes the entire design. The
[segment anchoring note](/engineering/segment-anchoring/) is fifteen hundred words
on how expensive that commitment is and why we keep it anyway.

**No engagement dark patterns.** No streaks, no infinite scroll, no autoplay
chains, no notification bait. Discovery keeps a hard exploration floor of roughly
thirty per cent, which is the opposite of what an engagement metric would ask
for.

**State observed, never declared.** If the software can watch something, it does
not ask. There is no settings screen where a listener has to describe themselves
before the product works.

**No third-party SDKs.** 4a contains no advertising code, no ad identifier, no
analytics library and no crash reporter. Its Content Security Policy names exactly
two origins it may send data to, which is the structural reason that is a fact
rather than a promise. [Privacy by
construction](/engineering/privacy-by-construction/) shows the policy and then
argues against our own claim, because the same policy is not as tight as it first
looks and a reader deserves to know where.

**Say less than is true, never more.** Every number we publish is labelled
measured, estimated, projected or designed, and the four are not interchangeable.
Nothing on this website describes an unbuilt feature in the present tense. Where
we have measured our own assumption and found it wrong we publish that too — there
are five such cases in the [measurement note](/engineering/measurement/),
including one where a metric read a perfect score because it was silently
computing something else.

## Where things stand

4a's web app is deployed and works, at
[jw-incorporated.github.io/foray/](https://jw-incorporated.github.io/foray/), with
no signup and no password. Native iOS and Android shells are built from the same
code; the iOS build has been launched on the simulator, the Android build has been
compiled but never run, and neither is in a store. Nothing {{ORG}} makes is
currently distributed through the App Store or Google Play. longlive is live on
its own domain.

## Contact

One address, read by a person: [{{MAIL}}](mailto:{{MAIL}}). The
[contact page](/contact/) says what to include and how long to expect to wait.
There is no postal address on this site and no telephone line; email is the
channel, and it reaches the company.
