# Glossary

Words used on this site and inside our products, and what we mean by each. Some of
them are ordinary podcasting words that get used loosely; a few are ours.

Nothing here is jargon for its own sake. Every entry is something you might
actually meet.

## Our products

**4a** — our daily podcast picker. Four topic queues a day, one of them
deliberately unlike the others. The digit and the letter, lowercase, no space.
See [4a](/4a/).

**foray** — a **common noun**, lowercase, and not the name of the app. A foray is
one named sequence on a subject, assembled out of stretches taken from several
different episodes and played back to back as a single run.
[Three real ones are published in full](/4a/sample/). **None is published in the
app yet.**

The app used to be called Foray, which is why the word still appears in the web
app's address and in the names of its on-device storage. Renaming those would break
saved links and orphan data already on people's devices.

**longlive** — a scrubbable timeline of Taylor Swift's twelve eras, on its own
domain. Previously called swift2, which is why that name turns up in older
references. See [longlive](/longlive/).

**{{STUDIO}} / {{ORG}}** — the same company. "{{STUDIO}}" is the short form of the
legal name and not a separate entity, a brand of a parent, or a trading name.
[The company page](/about/).

## Inside 4a

**Queue** — one of the four things 4a offers you on a given day. A queue is a group
of episodes on one subject, not a single episode, and the card tells you how many
and how long before you tap.

**Stretch** — the fourth queue, and the badge on it. Drawn from subjects *next to*
your demonstrated interests rather than inside them, labelled so you know that is
what it is, and it deliberately ignores your skip rate for the area it is exploring
— because a slot that gives up when ignored is a slower route back to the same three
shows. [More](/4a/#the-stretch-queue).

**Bridge** — the one-line reason a Stretch pick is next to something you already
like. A Stretch pick has to state one.

**Why-line** — the short explanation attached to a pick. Kept under about eighteen
words, with a list of banned words, because a recommendation that needs a paragraph
has not been made yet.

**Thin** — what 4a calls a result it could not fill properly. A playlist you asked
for that came back thin found less than it wanted and said so, rather than padding
itself out with filler.

**Continue** — the strip at the top for something long you started and did not
finish. The ✓ on it means *done with this*, which also tells 4a you liked it enough
to finish.

**Family mode** — a switch that hides episodes rated explicit, and also hides the
whole comedy category, because older comedy items in the library predate per-episode
ratings. Deliberately blunt, and
[we explain why](/4a/features/#family-mode).

**Playback diagnostics** — a record of what the player measured on your device:
load times, where playback stopped, gaps at the seams of an assembled run, controls
that did not respond. It holds no audio, no episode addresses and no account
identifier, and it **never leaves your device** unless you copy it into an email
yourself. [How to send it](/4a/support/#playback-diagnostics).

**Stretch, as a unit of a foray** — on [the sample pages](/4a/sample/) we call each
piece of an assembled sequence a *stretch*: one continuous run of audio from one
episode, with a description in our own words of what it covers.

## Podcasting words

**Feed** — the RSS document a publisher maintains, listing their episodes. It is
the public interface to a podcast, and almost everything 4a knows about a show it
knows because the feed said so.

**Enclosure** — the audio address inside a feed entry. **4a plays from it
directly.** There is no 4a server between you and an episode.

**Moving window** — most feeds serve a fixed number of recent episodes rather than
a complete archive. A publisher with a 300-item window lists 300 episodes today and
300 next year, whatever their archive holds. Worth knowing because it is the most
common reason a podcast statistic is quietly wrong.

**Dynamic ad insertion** — advertising stitched into an audio file **per request**,
at the host, so that two people downloading the same episode receive different
files of different lengths. Extremely common, entirely legitimate, and the reason a
timestamp in a podcast is a much weaker thing than it looks.

**Transcript tag** — the feed element by which a publisher points at a transcript
for an episode. Where a publisher provides one, 4a prefers it to anything else.
Publishing one is free, helps accessibility and search, and is the single most
useful thing a show can do to be represented accurately.
[More for podcasters](/4a/for-podcasters/#transcripts).

**Prefix / measurement service** — a service a publisher puts in front of their own
audio file to count downloads and attribute advertising. Your device follows it when
you play, in any podcast app. It is the reason
[a publisher sees you and we do not](/4a/your-data/#the-part-people-do-not-expect).

## Privacy words

**Anonymous account** — a real account that holds **no name, no email address and
no phone number**. 4a creates one for itself on first run so that your events are
yours; you never see a signup screen because there is not one.
[Plain language](/4a/your-data/).

**On-device storage** — where most of what 4a knows about you lives: your
interests, your positions, your history, your playlists, your settings. It is not
transmitted. 4a uses two storage layers on your device, which matters only when
deleting — and the deletion control covers both.

**Content Security Policy** — a browser-enforced list of the origins a page is
allowed to talk to at all. Ours is short enough to print, which is what makes
"there is no third-party code in here" a property of the software rather than a
promise in a document.

## How we talk about numbers

Every quantity we publish carries one of these, and they are not interchangeable.
We adopted the labels after two internal write-ups had to be retracted in one week
for mixing them up.

**Measured** — observed on real data or real hardware, with the method stated.
Repeatable.

**Estimated** — arithmetic on an assumption. Useful for a decision, not quotable as
a fact.

**Projected** — an extrapolation from a sample to a population that has not been
sampled. Order of magnitude at best.

**Designed** — written down, agreed, and not built. Present in a document, absent
from the product. [The page that keeps track of that](/status/).

**Label, never exclude** — a standing rule. Something doubtful gets tagged and kept
rather than silently dropped, because a thing quietly excluded is a thing nobody
ever notices is missing. It is why
[4a's subject labels are described as hints rather than promises](/4a/library/#the-subject-labels-are-imperfect-and-here-is-the-honest-reason).

**Counts carry dates.** A count without one is a claim that rots. Where two pages
give different totals for the same thing, both say when they were taken — feeds serve
moving windows and catalogues grow.
