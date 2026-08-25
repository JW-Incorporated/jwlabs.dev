# What we build

Four kinds of thing. Each one is described here with what it actually involves,
what we have built of that kind, and where the honest edge of our capability is.

[The services overview](/services/) is the shorter version, and
[{{MAIL}}](mailto:{{MAIL}}) is how to start a conversation.

## Apps people use on a phone

**Installable web apps that behave like native apps.** Not a website with a
mobile breakpoint — an app that installs to the home screen, opens in its own
window with its own icon, starts instantly, works with no connection, and holds
state on the device rather than on a server.

**Native iOS and Android builds from the same code.** One codebase, three
destinations, copied at build time rather than forked — so a change is made once
and a bug is fixed once. Three separate implementations of the same product is the
most expensive mistake available in mobile, and the second most expensive is
discovering that only after the second one ships.

**What we have built of this kind.** [4a](/4a/) is an installable web app: it runs
offline, holds a large catalogue on-device, works on a phone with no signup at all,
and its iOS and Android shells are built from the same code as the web version.
**Neither shell is in a store**, which is a fact about our own product's stage and
not about the capability — the builds exist and run.

**Where the honest edge is.** We have not shepherded an app through App Store or
Play Store review. We know precisely what those reviews ask for — we have written
the privacy policy, the support page, the data-safety declaration and the deletion
control that they require, and got the enrolment paperwork wrong once and fixed it —
but we have not stood at the end of that pipeline and had a listing approved. If
that is the risk you are hiring someone to absorb, ask us about it directly and we
will tell you the same thing there.

## Products with a lot of real data underneath them

The category most of our own work falls into, and the one where being careful pays
for itself fastest.

**Ingesting other people's data at scale, politely.** Feeds and APIs you do not
control, from thousands of sources that owe you nothing, some of which are
misconfigured and a few of which will block you if you are rude. Doing this well
is mostly discipline: identify yourself honestly, back off when asked, and
rate-limit against the *host* rather than against the individual thing you are
fetching.

**Keeping the result correct as it grows.** Data that arrives from thousands of
sources arrives inconsistent. Records duplicate under different identifiers.
Sources rename things. A field that was always present stops being present. The
work is not the import; the work is the part that notices.

**Turning it into something a person can navigate.** A large correct dataset that
nobody can find anything in is a cost centre. Search, filtering, ordering, and — the
part people underestimate — sensible behaviour when a query finds nothing or finds
too little.

**What we have built of this kind.** 4a works over a catalogue of hundreds of
curated shows and tens of thousands more at breadth, ingested from public feeds and
directories, with search that reports a thin result as thin and offers adjacent
subjects when it finds nothing. [longlive](/longlive/) is a decade of scattered
material presented as one scrubbable timeline with every entry dated and
attributed.

**Where the honest edge is.** We work at the scale our own products are at. We
have not run a system with millions of daily users, and if that is your problem
today you want a different shape of company.

## Software that has to be careful with people's data

Not a compliance service. An engineering approach: **make the privacy claim a
property of the design, so that it is true because of how the thing is built rather
than because a document says so.**

In practice that means a handful of decisions taken early, cheaply, that are
expensive to retrofit:

- **Collect less.** Most products collect a great deal they never use, and every
  field is a liability with no offsetting asset.
- **Keep it on the device where the device is the right place.** Data that never
  leaves cannot leak, cannot be subpoenaed and does not need a retention policy.
- **No account until the user wants one.** An account with no name in it cannot be
  breached into a person.
- **Enforce isolation in the data layer**, not in application code, so a future
  query cannot forget.
- **No third-party code in the client** — no analytics library, no crash reporter,
  no advertising SDK — so the list of parties who see your users is short enough to
  print.
- **A deletion control that actually reaches everything**, and reports honestly
  when it cannot finish.

**And the documents, which are part of the job.** A store submission is not
accepted without a privacy policy at a public URL, a support page, and a data-safety
declaration whose answers have to match the software. Writing those so they are
*true* — including recording a silence where a decision has not been made, rather
than filling it in — is work, and it is work that gets done badly under deadline by
people who did not build the thing.

**What we have built of this kind.** 4a contains no third-party SDK of any kind,
holds most of what it knows on the device, has no signup, and ships a deletion
control that deletes server rows first so that it cannot report success for
something it did not do. Its
[privacy policy](/4a/privacy/) is published from the same source that builds the app
and states plainly what it does *not* declare and why.

**Where the honest edge is, and this is important.** We are engineers, not
lawyers. **We do not give legal advice and we will not tell you that a design
complies with a particular law** — we will tell you what the software does, in
enough detail that your counsel can answer that question. On our own products we
deliberately make no compliance claims at all, for exactly that reason, and
[we say so](/4a/your-data/#what-is-not-decided-yet).

## Front ends that still work in five years

A quieter capability and the one clients thank you for later.

**No dependency graph to rot.** A front end with four hundred transitive
dependencies has four hundred ways to stop building, and none of them will happen
on a day you scheduled. Where a project can be built without them, we build it
without them.

**No build server in the path of the thing being served.** The output is committed
and inspectable. What is deployed is what was reviewed.

**Assets from your own origin.** No font CDN, no script from somebody else's
domain, nothing that turns an outage or a policy change at a third party into an
outage at yours — and nothing that quietly contradicts the privacy page.

**Accessible because of how it is built**, not because of a remediation pass:
semantic structure, real landmarks, keyboard order that works, contrast that has
been measured rather than assumed, and light and dark both designed rather than one
inverted.

**What we have built of this kind.** **This website.** It has no script tag on any
page, no dependencies, no external requests, no cookies and no analytics; it builds
from one file in about a second; and
[its contrast ratios are published, measured, including the four that fall short of
the strictest level](/accessibility/#contrast-measured).

**Where the honest edge is.** This approach has a ceiling. Genuinely interactive
applications need a framework, and we will use one rather than hand-rolling a worse
version of it. The rule we apply is about *defaults*: reach for the dependency when
the problem needs it, not when the template came with it.

## The thread through all four

**Say less than is true, never more.** It shows up as a technical practice more
often than as a communication style: label what has been measured against what has
been assumed, publish what is not built, and refuse to ship the version that only
looks finished.

You can check whether we mean it, which is the point of putting it here. Every page
on this site that could have made a flattering claim instead records what has not
been done — [what is built and what is not](/status/),
[what has not been audited for accessibility](/accessibility/), and
[what has never been security-tested](/security/). If we hold our own shop window
to that, you can reasonably expect it in a status report.

## Talk to us

**[{{MAIL}}](mailto:{{MAIL}})** — one address, read by a founder. Tell us what the
software has to do and who it is for.

[How working with us goes](/services/how-we-work/), including what we will not
quote for.
