# For podcasters

If your show is in [4a](/4a/)'s library, this page is what that means, in plain
terms, including the parts that are about your bandwidth and your revenue rather
than about our product.

The short version: **we recommend your show, we send listeners to your file on your
server, we never touch your audio, and we never strip your ads.** If you would
rather not be in the library, one email removes you.

## What 4a actually does with your show

4a is a picker. It puts a small number of episodes in front of a listener each day
with a short line about why, and when the listener chooses one, one of two things
happens:

- it hands off to whichever podcast app the listener uses — Apple Podcasts, or a
  show page in another player — and everything after that is between them and you;
  or
- it plays from **your enclosure URL**, directly, in the listener's browser.

There is no third option. There is no 4a server in the path.

## What we never do

These are commitments, not current behaviour that might change quietly.

**We never rehost your audio.** Nothing is copied to our servers, nothing is
cached by us, nothing is re-served from a domain of ours.

**We never proxy it.** The request goes from the listener's device to your host.
That means your host's logs are complete — you see the listener, we do not.

**We never transform or re-encode it.** No derived audio artefact is produced at
any point.

**We never detect, skip or strip advertising.** Not as a courtesy. It is an
architectural commitment that shapes the whole product, and a feature request that
would produce a stripped or modified file does not get built.

**We do not put our own advertising around your show.** There is no advertising in
4a at all.

**We do not paywall you.** 4a is free and there is nothing to buy, so nobody is
being charged for access to your work.

## What that means for your numbers

Because playback goes directly to your host, **your download counts and your ad
measurement work normally.** Dynamic ad insertion works normally. Any prefix or
measurement service you have put in front of your file is followed by the
listener's device exactly as it would be in any other podcast app.

We are not an intermediary in your revenue and we do not want to be one.

## How we read your feed

We poll your RSS feed to notice new episodes, and the way we do it is meant to be
invisible to you.

- **Conditional requests, always.** If nothing has changed, your server answers
  "not modified" with no body, which costs you almost nothing.
- **Rate-limited per host, not per show.** If your host serves hundreds of shows,
  our requests to that host are serialised — we do not open a connection per show
  and call it separate.
- **We back off when asked**, and a rate-limit response quiets every request to
  that host, not just the one that received it.
- **Our requests identify themselves honestly**, with a contact address, so you can
  write to a human rather than having to block a mystery.

If our traffic is ever a problem for you, tell us and we will fix it. That is a
genuine offer and it is why the address is in the request in the first place.

## Transcripts

If your feed publishes a `<podcast:transcript>` tag, we use it. **We prefer a
publisher's own transcript to anything else, always**, and where you publish one we
do not produce our own.

Publishing one is also the single most useful thing you can do to be represented
well by any system like this, and it is free to do. It helps accessibility, it
helps search, and it means the words associated with your show are the words you
actually said rather than a machine's best guess.

## Getting your show added

[{{MAIL}}](mailto:{{MAIL}}) — a feed URL is enough. We do not promise to add
everything, and we will tell you if we are not going to rather than going quiet.

Being small is not a disqualification. A show with a devoted audience and a deep
back catalogue is exactly what a picker like this is most useful for, and chart
position is used as a hint about quality where we know nothing else — never as a
gate. [More about the library](/4a/library/).

## Getting your show removed

**Email [{{MAIL}}](mailto:{{MAIL}}) and say so. The answer is yes.**

You do not need to give a reason, quote a law, or involve a lawyer. We will
confirm when it is done. If you would rather have a specific episode excluded than
the whole show, say that instead and we will do that.

## Corrections

If your show is described wrongly, filed under the wrong subject, or attributed to
the wrong people, the same address fixes it.

One category of error is worth naming because it is systematic rather than
accidental: a lot of a show's subject signal comes from **the category the show is
listed under in the public directories**, and publishers choose that for their own
reasons. If you are listed somewhere that does not describe your content, that
misfiling propagates, and we would rather be told than guess.
[The honest version of that limitation](/4a/library/#the-subject-labels-are-imperfect-and-here-is-the-honest-reason).

## Legal, briefly

We link to publicly published feeds and play publicly served audio from the
addresses those feeds give, exactly as a podcast app does. We do not copy, host,
modify or redistribute your work, and we do not remove your advertising.

If you believe something we are doing infringes your rights, write to
[{{MAIL}}](mailto:{{MAIL}}) with the specifics.
[Our terms of use](/terms/) are the formal position, and they are short and written
in plain English rather than in a font size designed to discourage reading.

## Who we are

[{{ORG}}](/about/) is {{ORG_FORM}}. Two founders, no advertising business, no data
brokerage, and one email address that reaches a person. That last part is the
reason this page can promise a same-week answer to a removal request: there is no
queue in front of it.
