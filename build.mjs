/* Builds jwlabs.dev. Run: node build.mjs
   No dependencies, no package.json, no build step beyond this file. Every page
   is a single self-contained HTML file with one same-origin stylesheet and no
   script tag at all -- the app this site fronts ships a strict CSP that blocks
   remote fonts and scripts, and the site holds the same line so the two cannot
   drift into different rules. */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { mdToHtml, page, MAIL, ORG, STUDIO, ORG_FORM, ORG_FORMED } from "./build-md.mjs";

const APP_URL = "https://jw-incorporated.github.io/foray/";
const FORAY_REPO = "https://github.com/JW-Incorporated/foray";
/* The commit of docs/legal/privacy-policy.md that src/4a-privacy-policy.md is a
   snapshot of. Bump both together, or the header on the published page lies. */
const POLICY_COMMIT = "21ff5c5";
const POLICY_SNAPSHOT = "2026-08-24";

const crumb = (...parts) => parts.map((p) => `<span class="crumb">· ${p}</span>`).join("");
const link = (href, text) => `<a href="${href}">${text}</a>`;
/* Pages are addressed relatively so the site works both at jwlabs.dev and at
   jw-incorporated.github.io/jwlabs.dev/ before the apex DNS records exist. */
const up = (depth) => (depth === 0 ? "./" : "../".repeat(depth));

/* ---------------------------------------------------------------- privacy ---
   The policy is CONVERTED, not rewritten. Its precision is the point: it is
   accurate about the `cp_` keys, IndexedDB, the anonymous session token and the
   43 hosts a device actually contacts, and foray's test/legal-citations.test.js
   pins its claims against the shipped code. So the substantive wording is
   passed through untouched.

   Two things the source carries are editorial notes to the founder rather than
   statements to a reader, and publishing them verbatim would be worse than
   removing them:

   1. A "Status: DRAFT -- not yet published" banner. Published, it is false, and
      it tells a store reviewer the document he is reading was not meant to be
      read.
   2. Nine `TODO(founder)` blockquotes. Four of them ask for facts that only
      exist AT publication -- who publishes, how to reach them, where the policy
      is hosted, its effective date -- and those are answered below in a new §9
      body. The other five are internal decisions (Supabase region, retention
      period, store age rating, geo-availability, legal review). Those are
      dropped, which leaves the policy SILENT on those points rather than wrong
      about them; silence is omission, an invented retention period would be a
      false declaration.

   Every step asserts, so a change to the source shape fails the build instead
   of silently passing the wrong document through. */
function publishPolicy(md) {
  const drop = (re, label, expect) => {
    const n = (md.match(re) || []).length;
    if (n !== expect) throw new Error(`policy transform: expected ${expect} ${label}, found ${n}`);
    md = md.replace(re, "");
  };

  /* The snapshot comes out of a Windows checkout, so it can arrive CRLF. Every
     assertion below is anchored on \n; normalise first or they all silently
     find nothing. */
  md = md.replace(/\r\n/g, "\n");
  if (!md.endsWith("\n")) md += "\n";
  drop(/\*\*Status: DRAFT[\s\S]*?with any of them unresolved\.\s*\n\n/, "DRAFT banner", 1);
  drop(/^> TODO\(founder\)[^\n]*\n(?:^>[^\n]*\n)*\n?/gm, "TODO(founder) blocks", 9);
  if (md.includes("TODO(founder)")) throw new Error("policy transform: a TODO(founder) survived");

  const h1 = "# 4a — Privacy Policy\n";
  if (!md.startsWith(h1)) throw new Error("policy transform: unexpected first line");
  md = md.replace(h1, `${h1}
> **Published from source.** This page is generated from
> \`docs/legal/privacy-policy.md\` in the [foray repository](${FORAY_REPO}) — the
> same repository that builds 4a — at commit \`${POLICY_COMMIT}\`, snapshotted
> ${POLICY_SNAPSHOT}. The repository copy is authoritative; if the two ever
> differ, that one is right and this one is stale. Editorial notes addressed to
> the founder were removed at publication and §9 was completed with the
> publication facts. No other wording was changed.
`);

  const s9 = "## 9. Who we are, and how to reach us\n";
  if (!md.includes(s9)) throw new Error("policy transform: §9 heading missing");
  if (!/## 9\. Who we are, and how to reach us\s*$/.test(md))
    throw new Error("policy transform: §9 is not empty after removing its TODOs");
  md = md.trimEnd() + `

4a is made and published by **${ORG}**, which is responsible for the
data described above.

**How to reach us about privacy:** [${MAIL}](mailto:${MAIL}). That address is
read directly; there is no support queue in front of it.

**To delete your data, use the app, not this address.** §7 describes the in-app
control, and it reaches everything we can reach — both storage layers on your
device and all of your rows on our server — which an email cannot do faster or
more completely. §7 is equally exact about the three things no deletion can
reach. Write to us if the control reports that it could not finish.

**Where this policy lives.** It is published at
[https://jwlabs.dev/4a/privacy/](https://jwlabs.dev/4a/privacy/) and takes
effect on the "Last updated" date at the top of this page.

**What this document is, and is not.** It was written by reading the shipped
code, and it is accurate about what the app does. It is not a lawyer's opinion
about sufficiency under any particular law, and it does not yet state a
retention period for the event rows in §2, because no retention job has been
built and we would rather say nothing than state a period we do not enforce.
`;
  return md;
}

/* --------------------------------------------------------------- markdown ---
   The long-form pages are Markdown in src/ rather than string literals here,
   because build.mjs was already the longest file in the repository and prose is
   easier to review as prose. They go through the same mdToHtml the privacy
   policy uses, so there is one renderer and not two.

   {{PLACEHOLDERS}} exist so that the contact address and the legal entity name
   keep having exactly ONE definition each. A leftover placeholder is a build
   failure, not a typo shipped to a reader. */
const FIELDS = { MAIL, ORG, STUDIO, ORG_FORM, ORG_FORMED };
function doc(name) {
  let md = readFileSync(`src/${name}.md`, "utf8").replace(/\r\n/g, "\n");
  md = md.replace(/\{\{([A-Z_]+)\}\}/g, (m, key) => {
    if (!(key in FIELDS)) throw new Error(`src/${name}.md: unknown placeholder ${m}`);
    return FIELDS[key];
  });
  if (md.includes("{{")) throw new Error(`src/${name}.md: an unsubstituted placeholder survived`);
  /* The first paragraph after the h1 is the standfirst on every page of this
     site. mdToHtml has no syntax for it and does not need one -- position is
     the rule. */
  return mdToHtml(md).replace(/(<\/h1>\n)<p>/, '$1<p class="lede">');
}

/* ------------------------------------------------------------------ pages --- */
const pages = [];
const emit = (path, opts) => pages.push([path, opts]);

emit("index.html", {
  title: `${STUDIO} — ${ORG}`,
  nav: "",
  desc: `${ORG} is ${ORG_FORM}. It builds 4a, a podcast curator, and longlive, a sourced timeline of Taylor Swift's twelve eras.`,
  body: `
<h1>${STUDIO}</h1>
<p class="lede"><strong>${ORG}</strong> is ${ORG_FORM}. It builds software that
takes a large, messy body of real source material and makes it navigable — while
keeping every claim attached to the thing it came from.</p>

<ul class="cards">
  <li class="card">
    <h2>${link("/4a/", "4a")}</h2>
    <p>A podcast curator. It picks four topic queues for you every day and makes
    one of them deliberately unlike the other three. Running now as a web app,
    no signup.</p>
    <p>${link("/4a/", "About 4a")} · ${link("/4a/support/", "Support")} ·
    ${link("/4a/privacy/", "Privacy policy")}</p>
  </li>
  <li class="card">
    <h2>${link("/longlive/", "longlive")}</h2>
    <p>A time machine through Taylor Swift's twelve eras: a scrubbable timeline
    where every moment is sourced and dated. Live on its own domain.</p>
    <p>${link("/longlive/", "About longlive")} ·
    ${link("https://longlivets.com/", "longlivets.com")}</p>
  </li>
</ul>

<h2>The same problem twice</h2>
<p>4a's raw material is 82,043 podcast episodes across 220 curated shows: hours of
unindexed speech with no reliable table of contents and — on two shows out of
three — no stable timeline either, because podcast advertising is stitched in per
request and every listener receives a different file. Its job is to turn that into
four things worth your attention today, and, where it assembles a run of segments
cut from several episodes, to know exactly which <em>words</em> bound each cut, so
that a boundary is a claim about content rather than a guess at a clock reading. It
never rehosts, transforms or modifies a publisher's audio.</p>
<p>longlive's raw material is a career's worth of scattered reporting, and its
discipline is the same: every moment sourced and dated, and where a narrative is a
widely-held fan interpretation rather than a confirmed fact, the timeline says so
on the moment itself rather than in a disclaimer nobody reads.</p>
<p>Different subjects, one shape — provenance under load. A lot of source
material, a reader who wants a path through it, and a hard rule that nothing is
asserted more confidently than its source supports. That rule is why 4a will skip
a segment rather than play it forty seconds off.</p>

<h2>How the work looks up close</h2>
<p>We publish the engineering, at the level of detail we would want if we were
reading somebody else's. Most of these end with something that does not work yet,
or with a measurement that contradicted what we had assumed a week earlier.</p>
<ul>
  <li>${link("/engineering/segment-anchoring/", "Anchoring a segment in audio nobody else receives")}
  — how a timestamp stops being an address and becomes a cache, and what it cost
  to discover our own measuring instruments were lying to us twice in a row.</li>
  <li>${link("/engineering/transcripts/", "Where the transcripts are, and where they are not")}
  — the availability measurement that inverted the plan: a 19x gap, pointing the
  wrong way.</li>
  <li>${link("/engineering/curation/", "Choosing four things a day")} — why a
  top-four list would have been the wrong shape, and what happened when we
  measured whether a narrated version of a subject was even possible.</li>
  <li>${link("/engineering/measurement/", "Measuring things, including our own claims")}
  — a metric that read a perfect score, a join that returned a plausible zero, and
  an index that lost and therefore did not ship.</li>
  <li>${link("/engineering/privacy-by-construction/", "Privacy by construction")}
  — the policy that makes 4a's privacy claims structural, and the exact place it
  does not hold.</li>
</ul>
<p>${link("/engineering/", "All five notes, with a guide to how the numbers are labelled")}.</p>

<h2>The company</h2>
<p><strong>${ORG}</strong> is ${ORG_FORM}, formed on ${ORG_FORMED}, and it owns
and operates this domain. It is two founders and a fleet of AI agents; there is no
other staff, which is why there is no team page and why the address below reaches
a person rather than a queue.</p>
<p>Nothing we make is in the App Store or Google Play yet. 4a's web app is
deployed and works; native iOS and Android shells are built from the same code and
neither is in a store. ${link("/about/", "More about the company")}.</p>

<h2>Contact</h2>
<p>Email <a href="mailto:${MAIL}">${MAIL}</a>. One address, read by a person, so
it may take a few days — but it is read. ${link("/contact/", "What to include")}.</p>
`,
});

emit("about/index.html", {
  title: `The company · ${STUDIO}`,
  nav: "about",
  crumb: crumb("Company"),
  desc: `${ORG} is ${ORG_FORM}, formed on ${ORG_FORMED}. What it builds, how it works, and what it will not do.`,
  body: doc("about"),
});

emit("contact/index.html", {
  title: `Contact · ${STUDIO}`,
  nav: "contact",
  crumb: crumb("Contact"),
  desc: `How to reach ${ORG}: one address, read by a person, and what to include so a report can be acted on.`,
  body: doc("contact"),
});

emit("engineering/index.html", {
  title: `Engineering notes · ${STUDIO}`,
  nav: "engineering",
  crumb: crumb("Engineering"),
  desc: "Write-ups of real problems in software we are building, with the measured numbers and the failures left in.",
  body: doc("engineering"),
});

emit("engineering/segment-anchoring/index.html", {
  title: `Anchoring a segment in audio nobody else receives · ${STUDIO}`,
  nav: "engineering",
  crumb: crumb(link("/engineering/", "Engineering"), "Segment anchoring"),
  desc: "Podcast advertising is stitched per request, so every listener receives a different file. How a segment boundary stops being a timestamp and becomes a claim about content.",
  body: doc("eng-segment-anchoring"),
});

emit("engineering/transcripts/index.html", {
  title: `Where the transcripts are, and where they are not · ${STUDIO}`,
  nav: "engineering",
  crumb: crumb(link("/engineering/", "Engineering"), "Transcripts"),
  desc: "Measuring transcript availability across 82,043 podcast episodes produced a 19x gap pointing the wrong way, and three ways a corpus lies about its own size.",
  body: doc("eng-transcripts"),
});

emit("engineering/curation/index.html", {
  title: `Choosing four things a day · ${STUDIO}`,
  nav: "engineering",
  crumb: crumb(link("/engineering/", "Engineering"), "Curation"),
  desc: "Why four queues rather than a ranked list, how shows get classified after a classifier failed, and the coverage measurement that ruled a format out.",
  body: doc("eng-curation"),
});

emit("engineering/measurement/index.html", {
  title: `Measuring things, including our own claims · ${STUDIO}`,
  nav: "engineering",
  crumb: crumb(link("/engineering/", "Engineering"), "Measurement"),
  desc: "A metric that read a perfect score, a join that returned a plausible zero, a benchmark 2.2x faster when idle, and an index that lost and therefore did not ship.",
  body: doc("eng-measurement"),
});

emit("engineering/privacy-by-construction/index.html", {
  title: `Privacy by construction · ${STUDIO}`,
  nav: "engineering",
  crumb: crumb(link("/engineering/", "Engineering"), "Privacy by construction"),
  desc: "4a's Content Security Policy names two origins it may send data to, which makes its privacy claims structural rather than promissory — and it is not the total seal it looks like.",
  body: doc("eng-privacy-by-construction"),
});

emit("terms/index.html", {
  title: `Terms of use · ${STUDIO}`,
  crumb: crumb("Terms of use"),
  desc: `Terms of use for jwlabs.dev and for 4a, between you and ${ORG}.`,
  body: doc("terms"),
});

emit("privacy/index.html", {
  title: `Website privacy notice · ${STUDIO}`,
  crumb: crumb("Website privacy"),
  desc: "This website sets no cookies, runs no JavaScript and has no analytics. What our hosting providers see, and what we can and cannot claim about it.",
  body: doc("site-privacy"),
});

emit("4a/index.html", {
  title: `4a — a podcast curator · ${STUDIO}`,
  nav: "4a",
  crumb: crumb("4a"),
  desc: "4a is a podcast curator. It picks four topic queues for you every day, one of them deliberately unlike the others.",
  body: `
<h1>4a</h1>
<p class="lede">4a is a podcast curator. It picks four topic queues for you every
day — and makes one of them deliberately unlike the other three, so the thing you
did not know to ask for still reaches you.</p>

<h2>What you actually get today</h2>
<p>The daily picks are the app. You open it, you get four cards, you play or save
what looks good, and 4a learns from what you take and what you skip. There is no
feed to scroll and nothing to configure first.</p>
<p>4a is also built to assemble episodes into a <em>foray</em> — an ordered
sequence of segments cut from several episodes and played as one run. That player
is written and works, but <strong>no foray is published yet</strong>, so it is not
something a visitor can open today. We would rather say that here than let the
word appear on this page as though it were a feature waiting for you.</p>

<h2>Where it runs</h2>
<p>4a is a deployed web app at <a href="${APP_URL}">${APP_URL}</a>. It needs no
signup and no password, it works on a phone, and it can be added to a home
screen. The app shell and its catalogue are cached, so it opens and renders in a
dead zone; audio is never cached, so playing something needs a connection.</p>
<p>Native shells for iOS and Android are built from the same code — the same
HTML, the same player, copied at build time and never forked. The iOS build has
been launched on the simulator; the Android build compiles and has never been
run. <strong>Neither is in a store, and there is no date.</strong> The web app is
the shipping version today.</p>
<p>It is early software, and the ${link("/4a/support/", "support page")} says so
plainly rather than pretending otherwise.</p>

<h2>Two words, and which is which</h2>
<p><strong>4a</strong> is the app. A <strong>foray</strong> is a thing the app
makes — one assembled run of segments. It is a common noun, lowercase, and there
can be many of them.</p>
<p>The app was previously called Foray, which is why that word still appears in
the web app's URL and in the names of its local database and its cache bucket.
Renaming those would orphan data already sitting on a listener's device, so they
keep the old name on purpose.</p>

<h2>How playback works</h2>
<p>Audio plays straight from each publisher's own servers. 4a never rehosts,
proxies or transforms podcast audio, and there is no 4a server in the path
between a listener and an episode. It can also hand an episode off to whichever
podcast app a listener prefers.</p>
<p>That design has a consequence worth stating on the way in rather than burying:
because the request goes directly to the publisher's host, that host — and any
measurement or ad-attribution service the publisher has put in front of their own
audio — sees the listener's IP address and user-agent, and 4a never does.
<a href="/4a/privacy/">§4 of the privacy policy</a> is exact about this,
including who those third parties actually are and why the alternative would be
worse.</p>

<h2>What 4a keeps</h2>
<p>Most of what 4a knows about a listener never leaves the device: topic
interests, play positions, history, playlists and settings are stored locally
and are not transmitted. Five kinds of event are sent to our database, against
an anonymous account holding no name, email or phone number. There is no
advertising, no ad tracking, no analytics SDK and no crash reporter in the app,
and no third-party SDK of any kind.</p>
<p>The <a href="/4a/privacy/">privacy policy</a> lists every stored key, every
transmitted field and every host a device contacts. It is not written for this
site: it is converted, word for word, from a snapshot of the copy that lives in
the same repository that builds the app.</p>

<h2>How it decides what to show you</h2>
<p>Three of the four queues come from topics you have demonstrated an interest
in. The fourth is drawn from <em>next to</em> your demonstrated interests rather
than inside them, it carries a visible <strong>Stretch</strong> badge, and it
ignores your historical skip rate for the region it explores — because exploration
is the point, and a slot that backs off when skipped is just a slower route to the
same three shows. A Stretch pick also has to state its bridge: the reason this is
next to that, in eighteen words or fewer.</p>
<p>There is no infinite scroll, no streak, no autoplay chain and no notification
bait. Each of those raises time-in-app at the cost of the thing the app is for.
${link("/engineering/curation/", "The curation note")} is the long version,
including the classifier that confidently filed a general-audience science show
under medicine, and how that was fixed.</p>

<h2>The hard part, written up</h2>
<p>Assembling a run of segments out of real episodes turns out to be difficult for
one specific reason: podcast advertising is stitched in per request, so the same
episode is a different file — minutes longer or shorter — for every listener. A
timestamp written down anywhere else is a claim about a copy nobody will ever hear
again.</p>
<ul>
  <li>${link("/engineering/segment-anchoring/", "Anchoring a segment in audio nobody else receives")}</li>
  <li>${link("/engineering/transcripts/", "Where the transcripts are, and where they are not")}</li>
  <li>${link("/engineering/privacy-by-construction/", "Privacy by construction")}</li>
</ul>

<h2>Pages a store needs</h2>
<ul>
  <li>${link("/4a/privacy/", "Privacy policy")}</li>
  <li>${link("/4a/support/", "Support")} — contact and FAQ</li>
</ul>
`,
});

emit("4a/support/index.html", {
  title: `4a — Support · ${STUDIO}`,
  nav: "4a",
  crumb: crumb(link("/4a/", "4a"), "Support"),
  desc: "How to get help with 4a, how to delete your data, and answers to the questions people actually ask.",
  body: `
<h1>4a — Support</h1>
<p class="lede">4a is a podcast curator: it picks four topic queues for you every
day, one of them deliberately unlike the others. This page is how you get help
with it.</p>

<h2 id="help">Getting help</h2>
<p>Email <a href="mailto:${MAIL}">${MAIL}</a>. There is no ticket system and no
support team — one person reads that address and answers it, usually within a
few days.</p>
<p>What makes a report easy to act on:</p>
<ul>
  <li>What you were doing, and what happened instead.</li>
  <li>The episode it happened on, if it was a specific one.</li>
  <li>Which browser and which device. (The web app is the only released build —
  see below.)</li>
  <li>For anything to do with audio: open the drawer, choose <strong>Playback
  diagnostics</strong>, copy it and paste it into the email. It records how each
  long each load took, where playback stopped, and any control press that
  failed. It holds no audio, no URLs and no account id. It exists because
  two playback faults were once reported from a car with no measurements
  attached, and there was nothing to diagnose them with.</li>
</ul>

<h2 id="delete-your-data">Deleting your data</h2>
<p>Open the menu (☰) and choose <strong>Delete my data</strong>. The sheet lists
what the deletion covers, and you confirm by typing <code>DELETE</code>, so one
stray tap cannot trigger it. You do not need to email anyone, and emailing will
not be faster.</p>
<p><strong>It deletes</strong> everything 4a stored on your device — in both
places it keeps things, <code>localStorage</code> and its IndexedDB database —
and your rows on our server, including any note you typed into feedback. It
deletes the server rows <em>first</em>, because the token on your device is the
only thing that can reach them; if the server cannot be reached it tells you the
rows were not deleted and leaves your device alone so you can try again. It will
not report success for something it did not do.</p>
<p><strong>It cannot delete</strong> the empty anonymous account row itself
(removing that needs an administrative key that cannot ship inside a public web
page, so what the button does instead is cut the link: your token is destroyed
and the app starts a new anonymous account rather than re-attaching you to the
old one), anything a publisher and their measurement services already saw when
you played audio (we never received it and cannot reach it), or rows sent from a
device whose storage you had already cleared by hand — without that token those
rows cannot be identified by you or by us. That last one is the reason to use
the button rather than your browser's site-data screen.</p>
<p><a href="/4a/privacy/#7-how-to-delete-your-data">§7 of the privacy policy</a> is the exact version of
all of the above.</p>

<h2 id="faq">Questions people actually ask</h2>

<h3>Do I need an account?</h3>
<p>No. There is no signup, no password, no email address and no profile. The app
creates an anonymous account — an opaque id with no name attached — for the five
kinds of event described in the privacy policy.</p>

<h3>Why does the web app's URL say "foray"?</h3>
<p>The app used to be called Foray. Renaming the URL, the local database and the
cache bucket would break saved links and orphan data already on listeners'
devices, so they keep the old name. Separately, and confusingly, "foray" is also
what the app calls one assembled run of segments. The app is <strong>4a</strong>;
a <strong>foray</strong> is a thing it makes, and none is published yet.</p>

<h3>Does 4a play the audio itself?</h3>
<p>Today it mostly hands an episode off to whichever podcast app you prefer, and
that is the route from the daily cards. 4a also has its own player, used for
forays, which streams straight from each publisher's own servers — but no foray
is published yet, so you will not meet it. Either way <strong>4a never rehosts or
proxies audio</strong>: the bytes come from the publisher, not from us.</p>

<h3>Does it work offline?</h3>
<p>The app shell and its catalogue are cached, so 4a opens and renders in a dead
zone. Audio is never cached, so playing something needs a connection.</p>

<h3>Is there advertising in 4a?</h3>
<p>There is no ad code, no ad identifier and no ad SDK in the app. That is a
statement about our code and not a claim that nobody observes your playback:
publishers commonly put measurement and ad-attribution services in front of
their own audio files, and your device follows those redirects when it plays.
<a href="/4a/privacy/">§4 of the privacy policy</a> names them and explains why
we do not proxy around them.</p>

<h3>When are the iOS and Android apps out?</h3>
<p>No date. Shells for both exist and are in progress; neither is in a store.
The web app is the shipping version today, and it works on a phone.</p>

<h3>A pick was wrong for me. Can I say so?</h3>
<p>Yes, and it is the most useful thing you can do. The thumbs take reason codes
and a short note, and both are sent to us — they are the only signal that tells
the curator it got something wrong. The note is free text you wrote and it is
stored on our server, so do not type anything into it you would not want kept.</p>

<h3>Is any of this final?</h3>
<p>No. 4a is early, the catalogue changes, and features move. If something reads
as broken it may well be, and <a href="mailto:${MAIL}">${MAIL}</a> is the way to
tell us.</p>
`,
});

/* longlive is deliberately described from what longlivets.com itself publishes,
   and no further. Nothing here knows its data practices or its internals, and a
   claim about another product's behaviour that turns out to be wrong is worse
   than a short page. Its own site is authoritative; do not "improve" this page
   with detail that is not on it. */
emit("longlive/index.html", {
  title: `longlive · ${STUDIO}`,
  nav: "longlive",
  crumb: crumb("longlive"),
  desc: "longlive is a time machine through Taylor Swift's twelve eras: a scrubbable timeline where every moment is sourced and dated. It lives at longlivets.com.",
  body: `
<h1>longlive</h1>
<p class="lede">longlive is a time machine through Taylor Swift's eras — a
scrubbable timeline where every moment is sourced and dated, back through all
twelve of them. It lives at
<a href="https://longlivets.com/">longlivets.com</a>.</p>

<h2>What it is</h2>
<p>You drag through an era and the moments come with you: music, fashion, tours,
relationships, the small cameos, the documented details. A ridge above the
timeline shows where the most happened, so a decade of a career has a shape you
can see before you have read a word of it. Entries run from the obvious career
milestones down to the kind of detail a fan account would have to reconstruct
from six sources.</p>
<p>The discipline is the same one behind ${link("/4a/", "4a")}, applied to a
different pile of material: <strong>every moment is sourced and dated</strong>,
and where a story is a widely-discussed fan interpretation rather than a confirmed
fact, the site says so on the moment itself rather than in a footer nobody reads.
That distinction is the whole reason the project is interesting to build — see
${link("/about/", "what the company does")} — because a timeline that quietly
mixes reporting with theory is just a rumour with dates on it.</p>
<p>longlive is an independent, fan-made project. It is not affiliated with,
endorsed by, or connected to Taylor Swift or her representatives. It was
previously called swift2.</p>

<h2>Where to go for it</h2>
<p>Everything about longlive lives on its own domain, including its privacy
policy and its terms of use: <a href="https://longlivets.com/">longlivets.com</a>.
That site is authoritative about the product, and this page deliberately does not
restate its details — <strong>nobody here should be documenting another site's
data practices second-hand.</strong></p>
<p>longlive is built by ${ORG}, the same company that makes 4a. Company-level
correspondence can come to <a href="mailto:${MAIL}">${MAIL}</a>; anything specific
to the timeline itself, including a correction, belongs on longlivets.com.</p>
`,
});

/* ------------------------------------------------------------------ build --- */
const policy = publishPolicy(readFileSync("src/4a-privacy-policy.md", "utf8"));
emit("4a/privacy/index.html", {
  title: `4a — Privacy Policy · ${STUDIO}`,
  nav: "4a",
  crumb: crumb(link("/4a/", "4a"), "Privacy policy"),
  desc: "4a's privacy policy: every key stored on your device, every field transmitted, and every host your device contacts.",
  body: mdToHtml(policy),
});

const written = new Map();
for (const [path, opts] of pages) {
  /* Root-relative hrefs are written in the copy above because they read better,
     and are rewritten to this page's relative depth here. See page()'s note on
     why the site cannot use "/" paths. */
  const base = up(path.split("/").length - 1);
  const rel = (s) => s.replace(/href="\/(?!\/)/g, `href="${base}`);
  const html = page({ ...opts, base, crumb: rel(opts.crumb ?? ""), body: rel(opts.body) });

  if (/<script/i.test(html)) throw new Error(`${path}: contains a <script> tag`);
  /* Remote URLs are fine inside <a href> -- that is a link the reader chooses to
     follow. They are not fine anywhere the browser would FETCH them, so check
     every tag that can pull a subresource. An <a> is the only element on these
     pages allowed to name another origin. */
  for (const m of html.matchAll(/<(?!a[\s>])([a-z]+)[^>]*?(?:src|href|srcset|data|poster|content)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
    const url = m[2] ?? m[3] ?? m[4] ?? "";
    if (/^(?:https?:)?\/\//i.test(url))
      throw new Error(`${path}: <${m[1]}> pulls a remote subresource: ${url}`);
  }
  if (/@import|url\(\s*["']?https?:/i.test(html)) throw new Error(`${path}: remote CSS reference`);
  if (html.includes('href="/')) throw new Error(`${path}: an absolute-path href survived`);
  /* The 2026-08-24 Apple enrollment rejection was caused by this site naming a
     company that does not exist. The legal entity is JW Labs LLC. The GitHub
     ORGANISATION is spelled "JW-Incorporated" and appears legitimately inside
     repository and Pages URLs, so this checks for the SPACED form only -- the
     one that could only be prose about a company. */
  if (/JW\s+Incorporated/.test(html))
    throw new Error(`${path}: names "JW Incorporated", which is not the legal entity. The entity is JW Labs LLC; see the foray repo docs/apple-enrollment-website.md`);
  if (html.includes("{{")) throw new Error(`${path}: an unsubstituted placeholder survived`);

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, html);
  written.set(path, html);
  console.log(`${path}  ${html.length.toLocaleString()} bytes`);
}

/* ------------------------------------------------------------- link check ---
   Apple's requirement is that the site be "functional", and a 404 behind the
   navigation is the cheapest possible way to fail that. Eyeballing does not
   count, so every internal href is resolved against what was actually written
   to disk, and every fragment is resolved against the ids in its target page.
   Off-site hrefs are not fetched -- this is a build, not a crawler. */
const ids = new Map([...written].map(([p, html]) =>
  [p, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]));
const resolve = (from, href) => {
  const dir = from.includes("/") ? from.slice(0, from.lastIndexOf("/") + 1) : "";
  const parts = (dir + href).split("/");
  const out = [];
  for (const part of parts) {
    if (part === "." || part === "") continue;
    if (part === "..") out.pop();
    else out.push(part);
  }
  const path = out.join("/");
  return path.endsWith(".html") ? path : `${path}${path ? "/" : ""}index.html`;
};

let checked = 0, offsite = 0;
for (const [from, html] of written) {
  for (const m of html.matchAll(/<a[^>]+href="([^"]*)"/g)) {
    const href = m[1];
    if (/^(?:https?:|mailto:)/i.test(href)) { offsite++; continue; }
    const [target, frag] = href.split("#");
    /* A bare "#id" is a link into the page it sits on. */
    const path = target === "" ? from : resolve(from, target);
    if (!written.has(path)) throw new Error(`${from}: dead internal link ${href} -> ${path}`);
    if (frag && !ids.get(path).has(frag))
      throw new Error(`${from}: link ${href} points at an id that does not exist in ${path}`);
    checked++;
  }
}
console.log(`\n${written.size} pages, ${checked} internal links all resolve, ${offsite} off-site links not fetched.`);
