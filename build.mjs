/* Builds jwlabs.dev. Run: node build.mjs
   No dependencies, no package.json, no build step beyond this file. Every page
   is a single self-contained HTML file with one same-origin stylesheet and no
   script tag at all -- the app this site fronts ships a strict CSP that blocks
   remote fonts and scripts, and the site holds the same line so the two cannot
   drift into different rules. */
import { readFileSync, writeFileSync } from "node:fs";
import { mdToHtml, page, MAIL } from "./build-md.mjs";

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

4a is made and published by **JW Incorporated**, which is responsible for the
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

/* ------------------------------------------------------------------ pages --- */
const pages = [];
const emit = (path, opts) => pages.push([path, opts]);

emit("index.html", {
  title: "JW Labs",
  desc: "JW Labs is the software studio of JW Incorporated. It builds 4a, a podcast curator, and longlive, a Taylor Swift fan app.",
  body: `
<h1>JW Labs</h1>
<p class="lede">JW Labs is the software studio of JW Incorporated. It builds two
apps.</p>

<ul class="cards">
  <li class="card">
    <h2>${link("/4a/", "4a")}</h2>
    <p>A podcast curator. It picks four topic queues for you every day, one of
    them deliberately unlike the others.</p>
    <p>${link("/4a/", "About 4a")} · ${link("/4a/privacy/", "Privacy")} ·
    ${link("/4a/support/", "Support")}</p>
  </li>
  <li class="card">
    <h2>${link("/longlive/", "longlive")}</h2>
    <p>A Taylor Swift fan app.</p>
    <p>${link("/longlive/", "About longlive")} ·
    ${link("https://longlivets.com/", "longlivets.com")}</p>
  </li>
</ul>

<h2>Contact</h2>
<p>Email <a href="mailto:${MAIL}">${MAIL}</a>. It goes to one person, so it may
take a few days, but it is read.</p>
`,
});

emit("4a/index.html", {
  title: "4a — a podcast curator · JW Labs",
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
signup and no password, and it can be added to a phone's home screen. iOS and
Android shells built from the same code exist and are in progress; neither is in
a store.</p>
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

<h2>Pages a store needs</h2>
<ul>
  <li>${link("/4a/privacy/", "Privacy policy")}</li>
  <li>${link("/4a/support/", "Support")} — contact and FAQ</li>
</ul>
`,
});

emit("4a/support/index.html", {
  title: "4a — Support · JW Labs",
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

emit("longlive/index.html", {
  title: "longlive · JW Labs",
  crumb: crumb("longlive"),
  desc: "longlive is a Taylor Swift fan app, at longlivets.com.",
  body: `
<h1>longlive</h1>
<p class="lede">longlive is a Taylor Swift fan app. It lives at
<a href="https://longlivets.com/">longlivets.com</a>.</p>
<p>It was previously called swift2.</p>
<p>longlive has its own domain, so its privacy policy and every other legal
document for it are published there — not on this site.</p>
`,
});

/* ------------------------------------------------------------------ build --- */
const policy = publishPolicy(readFileSync("src/4a-privacy-policy.md", "utf8"));
emit("4a/privacy/index.html", {
  title: "4a — Privacy Policy · JW Labs",
  crumb: crumb(link("/4a/", "4a"), "Privacy policy"),
  desc: "4a's privacy policy: every key stored on your device, every field transmitted, and every host your device contacts.",
  body: mdToHtml(policy),
});

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

  writeFileSync(path, html);
  console.log(`${path}  ${html.length.toLocaleString()} bytes`);
}
