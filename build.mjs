/* Builds jwlabs.ai. Run: node build.mjs
   No dependencies, no package.json, no build step beyond this file. Every page
   is a single self-contained HTML file with one same-origin stylesheet and no
   script tag at all -- the app this site fronts ships a strict CSP that blocks
   remote fonts and scripts, and the site holds the same line so the two cannot
   drift into different rules. */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { mdToHtml, page, MAIL, ORG, STUDIO, ORG_FORM, ORG_FORMED } from "./build-md.mjs";

/* Everything published lives under docs/, and GitHub Pages is pointed at that
   directory rather than at the branch root. The root of this repository is
   therefore NOT a public directory: README.md, build*.mjs and src/*.md are not
   URLs. That is the whole reason for the subdirectory -- Pages serves a tree, so
   the only reliable way to keep a file unserved is for it to be outside the tree.
   Run from the repository root: src/ is read relative to the working directory.

   Anything written into docs/ is a public URL. Add nothing here that is not
   meant to be read by a stranger. */
const OUT = "docs";

const APP_URL = "https://jw-incorporated.github.io/foray/";
const FORAY_REPO = "https://github.com/JW-Incorporated/foray";
/* The commit of docs/legal/privacy-policy.md that src/4a-privacy-policy.md is a
   snapshot of. Bump both together, or the header on the published page lies. */
const POLICY_COMMIT = "21ff5c5";
const POLICY_SNAPSHOT = "2026-08-24";

const crumb = (...parts) => parts.map((p) => `<span class="crumb">· ${p}</span>`).join("");
const link = (href, text) => `<a href="${href}">${text}</a>`;
/* Pages are addressed relatively so the built HTML is valid under any prefix:
   jwlabs.ai, and jw-incorporated.github.io/jwlabs.dev/ -- the repository is still
   named jwlabs.dev, so the Pages URL keeps that spelling. Note that Pages URL is
   no longer a preview surface: measured 2026-08-25 it 301s to the custom domain.
   The relative paths are what keep the output portable and reviewable locally. */
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
> differ, that one is right and this one is stale. Internal editorial notes were
> removed at publication and §9 was completed with the publication facts. No other
> wording was changed.
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
[https://jwlabs.ai/4a/privacy/](https://jwlabs.ai/4a/privacy/) and takes
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

/* ------------------------------------------------------------------ pages ---
   Every long-form page is Markdown in src/. build.mjs holds structure and
   metadata only -- titles, descriptions, breadcrumbs and the emit order -- so
   that prose is reviewed as prose and this file stays readable.

   The site is FEATURE-LED and USER-FACING by founder decision (2026-08-25):
   what the products do for the person using them, plus the company's services.
   It deliberately does NOT publish architecture, methodology or "how it works
   under the hood" -- that is the company's own advantage and it is not what
   Apple's enrollment requirement asks for. If you are adding a page, describe
   the RESULT, never the mechanism. */
const pages = [];
const emit = (path, opts) => pages.push([path, opts]);

emit("index.html", {
  title: `${STUDIO} - ${ORG}`,
  nav: "",
  desc: `${ORG} is ${ORG_FORM}. It builds 4a, a daily podcast picker, and longlive, a sourced timeline of Taylor Swift's twelve eras, and takes on engineering and app development work.`,
  body: doc("home"),
});

emit("about/index.html", {
  title: `The company · ${STUDIO}`,
  nav: "about",
  crumb: crumb("Company"),
  desc: `${ORG} is ${ORG_FORM}. What it builds, how it works, and what it will not do.`,
  body: doc("about"),
});

/* --------------------------------------------------------------- services --- */
emit("services/index.html", {
  title: `Engineering and app development · ${STUDIO}`,
  nav: "services",
  crumb: crumb("Services"),
  desc: `${ORG} builds software: apps people use on a phone, products with a lot of real data underneath them, and software that has to be careful with people's data.`,
  body: doc("services"),
});

emit("services/what-we-build/index.html", {
  title: `What we build · ${STUDIO}`,
  nav: "services",
  crumb: crumb(link("/services/", "Services"), "What we build"),
  desc: "Four kinds of software we build, what each one involves, and where the honest edge of the capability is.",
  body: doc("services-what-we-build"),
});

emit("services/how-we-work/index.html", {
  title: `How working with us goes · ${STUDIO}`,
  nav: "services",
  crumb: crumb(link("/services/", "Services"), "How working with us goes"),
  desc: "The first email, what done means, what we will not quote for, and what you hear from us while it is happening.",
  body: doc("services-how-we-work"),
});

/* --------------------------------------------------------------------- 4a --- */
emit("4a/index.html", {
  title: `4a - a daily podcast picker · ${STUDIO}`,
  nav: "4a",
  crumb: crumb("4a"),
  desc: "4a is a daily podcast picker. Four topic queues a day, one of them deliberately unlike the others, with no signup.",
  body: doc("4a"),
});

emit("4a/features/index.html", {
  title: `4a - every feature · ${STUDIO}`,
  nav: "4a",
  crumb: crumb(link("/4a/", "4a"), "Features"),
  desc: "The full tour of what 4a does: the four daily queues, the Stretch queue, playlists in your own words, feedback with reasons, family mode, diagnostics and deletion.",
  body: doc("4a-features"),
});

emit("4a/getting-started/index.html", {
  title: `4a - getting started · ${STUDIO}`,
  nav: "4a",
  crumb: crumb(link("/4a/", "4a"), "Getting started"),
  desc: "Opening 4a, putting it on a home screen, the two settings worth knowing about, and what the first week actually looks like.",
  body: doc("4a-getting-started"),
});

/* Sample content. Founder direction 2026-08-25: showing real assembled forays
   demonstrates the product without describing how anything is built.
   COPYRIGHT RULES, non-negotiable: no transcript text, no lyrics, no third-party
   artwork. Every description of a stretch is OUR OWN editorial writing. Shows and
   episodes are NAMED, because attribution is correct and because naming a source
   is not a claim of affiliation -- each page says so explicitly. */
emit("4a/sample/index.html", {
  title: `What a foray looks like · ${STUDIO}`,
  nav: "4a",
  crumb: crumb(link("/4a/", "4a"), "Sample content"),
  desc: "Three real assembled forays, in full: a named sequence on one subject, cut from stretches of real podcast episodes and played as a single run.",
  body: doc("4a-sample"),
});

emit("4a/sample/barbecue/index.html", {
  title: `Barbecue: eight beats of a forty-beat history · ${STUDIO}`,
  nav: "4a",
  crumb: crumb(link("/4a/", "4a"), link("/4a/sample/", "Sample content"), "Barbecue"),
  desc: "A sample foray: 21 minutes 56 seconds, ten stretches, drawn from six episodes of six different shows on three continents.",
  body: doc("4a-sample-barbecue"),
});

emit("4a/sample/startup-capital/index.html", {
  title: `The types of capital a startup can raise · ${STUDIO}`,
  nav: "4a",
  crumb: crumb(link("/4a/", "4a"), link("/4a/sample/", "Sample content"), "Startup capital"),
  desc: "A sample foray: 51 minutes 22 seconds, twenty-two stretches across eight funding routes, drawn from eight episodes of seven different shows.",
  body: doc("4a-sample-capital"),
});

emit("4a/sample/plate-tectonics/index.html", {
  title: `How Earth got plate tectonics and Venus never did · ${STUDIO}`,
  nav: "4a",
  crumb: crumb(link("/4a/", "4a"), link("/4a/sample/", "Sample content"), "Plate tectonics"),
  desc: "A sample foray: 40 minutes 20 seconds, nineteen stretches built from eleven episodes of one podcast - the explanation none of those episodes could give alone.",
  body: doc("4a-sample-geology"),
});

emit("4a/library/index.html", {
  title: `What is in 4a's library · ${STUDIO}`,
  nav: "4a",
  crumb: crumb(link("/4a/", "4a"), "Library"),
  desc: "Why a show is in 4a and why another is not, what is deliberately excluded, and the honest reason subject labels are hints rather than promises.",
  body: doc("4a-library"),
});

emit("4a/your-data/index.html", {
  title: `What 4a knows about you · ${STUDIO}`,
  nav: "4a",
  crumb: crumb(link("/4a/", "4a"), "Your data"),
  desc: "Plain language: what stays on your device, the five kinds of event that reach us, what a publisher sees that we do not, and how to delete all of it.",
  body: doc("4a-your-data"),
});

emit("4a/faq/index.html", {
  title: `4a - questions · ${STUDIO}`,
  nav: "4a",
  crumb: crumb(link("/4a/", "4a"), "Questions"),
  desc: "The questions people actually ask about 4a: accounts, cost, why only four, the name, privacy, deletion, and when the store apps are out.",
  body: doc("4a-faq"),
});

emit("4a/support/index.html", {
  title: `4a - Support · ${STUDIO}`,
  nav: "4a",
  crumb: crumb(link("/4a/", "4a"), "Support"),
  desc: "How to get help with 4a, what to include so a report can be acted on, and how to delete your data.",
  body: doc("4a-support"),
});

emit("4a/delete-my-data/index.html", {
  title: `4a - delete your data · ${STUDIO}`,
  nav: "4a",
  crumb: crumb(link("/4a/", "4a"), "Delete your data"),
  desc: "How to delete everything 4a holds about you, what the control reaches, and what it cannot.",
  body: doc("4a-delete-my-data"),
});

/* The store-form answer to "where is your content/age suitability description?".
   It deliberately claims NO store rating: as of 2026-09-01 neither store has
   assigned one, and the foray repo's privacy policy still carries a
   TODO(founder) for which rating to declare. Same discipline as the policy
   conversion above -- silent beats wrong. When the ratings are filed, add them
   here rather than letting this page and the listings disagree. */
emit("4a/age-rating/index.html", {
  title: `4a - content and age suitability · ${STUDIO}`,
  nav: "4a",
  crumb: crumb(link("/4a/", "4a"), "Age suitability"),
  desc: "What is actually in 4a, who it suits, why there is no content filter, and what the app deliberately does not contain.",
  body: doc("4a-age-rating"),
});

emit("4a/for-podcasters/index.html", {
  title: `4a - for podcasters · ${STUDIO}`,
  nav: "4a",
  crumb: crumb(link("/4a/", "4a"), "For podcasters"),
  desc: "What 4a does with your feed and your audio, what it never does, how we poll politely, and how to have your show added, corrected or removed.",
  body: doc("4a-for-podcasters"),
});

/* --------------------------------------------------------------- longlive ---
   Described from what longlivets.com itself publishes, and no further. Nothing
   here knows its data practices or its internals, and a claim about another
   product's behaviour that turns out to be wrong is worse than a short page. Its
   own site is authoritative; do not "improve" this page with detail that is not
   on it. NO LYRICS, ever, in any quantity. */
emit("longlive/index.html", {
  title: `longlive · ${STUDIO}`,
  nav: "longlive",
  crumb: crumb("longlive"),
  desc: "longlive is a time machine through Taylor Swift's twelve eras: a scrubbable, filterable timeline where every moment is sourced and dated. It lives at longlivets.com.",
  body: doc("longlive"),
});

/* Sourced from longlive's OWN store filings, not inferred here -- the absences
   (no ads, no purchases, no UGC, no free-text entry in the app) are its
   documented declarations. That is the bar the note above sets: this page states
   what longlive itself asserts about its app, and stops. It claims no store
   rating, for the same reason 4a's does not. Its privacy policy and terms stay
   on longlivets.com; only the suitability description lives here. */
emit("longlive/age-rating/index.html", {
  title: `longlive - content and age suitability · ${STUDIO}`,
  nav: "longlive",
  crumb: crumb(link("/longlive/", "longlive"), "Age suitability"),
  desc: "What is in the longlive timeline, who it suits, and what the app deliberately does not contain.",
  body: doc("longlive-age-rating"),
});

/* --------------------------------------------------- company-wide pages --- */
emit("status/index.html", {
  title: `What is built, and what is not · ${STUDIO}`,
  nav: "status",
  crumb: crumb("What is built"),
  desc: `What you can use today, what is built and not distributed, what is designed and not built, and what ${ORG} has deliberately not decided.`,
  body: doc("status"),
});

emit("contact/index.html", {
  title: `Contact · ${STUDIO}`,
  nav: "contact",
  crumb: crumb("Contact"),
  desc: `How to reach ${ORG}: one address for everything, and what to include so a report can be acted on.`,
  body: doc("contact"),
});

emit("glossary/index.html", {
  title: `Glossary · ${STUDIO}`,
  crumb: crumb("Glossary"),
  desc: "Words used on this site and inside our products, and what we mean by each - including how we label a measured number against an estimated one.",
  body: doc("glossary"),
});

emit("security/index.html", {
  title: `Security and responsible disclosure · ${STUDIO}`,
  crumb: crumb("Security"),
  desc: `How to report a security problem to ${ORG}, what is in and out of scope, what is structural rather than promised, and what we do not have.`,
  body: doc("security"),
});

emit("accessibility/index.html", {
  title: `Accessibility · ${STUDIO}`,
  crumb: crumb("Accessibility"),
  desc: "What we have done about accessibility, the measured contrast ratios, and - the reason the page is worth reading - what has not been tested.",
  body: doc("accessibility"),
});

emit("terms/index.html", {
  title: `Terms of use · ${STUDIO}`,
  crumb: crumb("Terms of use"),
  desc: `Terms of use for jwlabs.ai and for 4a, between you and ${ORG}.`,
  body: doc("terms"),
});

emit("privacy/index.html", {
  title: `Website privacy notice · ${STUDIO}`,
  crumb: crumb("Website privacy"),
  desc: "This website sets no cookies, runs no JavaScript and has no analytics. What our hosting providers see, and what we can and cannot claim about it.",
  body: doc("site-privacy"),
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

/* Keyed by SITE path -- "4a/privacy/index.html", not "docs/4a/privacy/index.html".
   The site path is what a browser resolves an href against, and it is unchanged by
   which directory Pages is pointed at. Keeping the map in site space is what makes
   the docs/ move a no-op for every relative link on the site, and it keeps the
   depth arithmetic in up() honest: docs/ is a serving detail, not a path segment
   the reader ever sees. OUT is applied at the moment of writing, and nowhere else. */
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

  const file = `${OUT}/${path}`;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  written.set(path, html);
  console.log(`${file}  ${html.length.toLocaleString()} bytes`);
}

/* ------------------------------------------------------------- link check ---
   Apple's requirement is that the site be "functional", and a 404 behind the
   navigation is the cheapest possible way to fail that. Eyeballing does not
   count, so every internal href is resolved against what was actually written
   to disk, and every fragment is resolved against the ids in its target page.
   Off-site hrefs are not fetched -- this is a build, not a crawler.

   Resolution happens in site space, which is the space the reader's browser
   resolves in: docs/ is the served root, so "docs/" is not part of any path a
   browser ever computes and must not be part of any path checked here. */
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

/* ----------------------------------------------------------- served root ---
   Pages reads CNAME and .nojekyll from the directory it serves, not from the
   branch root. Both are committed static files rather than build output, so the
   build does not create them -- but it does refuse to finish without them,
   because the failure they cause is silent and total: a missing or misplaced
   CNAME unsets the custom domain, and every jwlabs.ai URL 404s behind
   Cloudflare with nothing in this repository to show why. */
for (const [name, want] of [["CNAME", "jwlabs.ai"], [".nojekyll", ""]]) {
  let got;
  try { got = readFileSync(`${OUT}/${name}`, "utf8"); }
  catch { throw new Error(`${OUT}/${name} is missing. Pages reads it from the served root, which is ${OUT}/.`); }
  if (got.trim() !== want) throw new Error(`${OUT}/${name}: expected ${JSON.stringify(want)}, found ${JSON.stringify(got.trim())}`);
}
console.log(`${OUT}/CNAME and ${OUT}/.nojekyll present. Pages source must be set to the ${OUT}/ folder.`);
