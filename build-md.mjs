/* Minimal Markdown -> HTML for the legal documents. No dependencies: this repo
   has no package.json and must build from a bare checkout. Handles only the
   subset those documents use -- headings, paragraphs, lists (including wrapped
   continuation lines and one level of nesting), tables, code spans and fences,
   bold/italic, links, blockquotes, hr. Anything it does not understand it
   escapes and passes through, so an unhandled construct degrades to visible
   text rather than to injected markup.

   Relative links are deliberately NOT rendered as links: only http(s):, mailto:,
   root-relative and fragment hrefs survive. A source document that links to a
   sibling file in its own repo (./data-safety.md) therefore degrades to plain
   text here rather than to a 404, which is the behaviour we want, since that
   file is internal and is not published. */
import { readFileSync, writeFileSync } from "node:fs";

/* The one public contact address. It lives here rather than in build.mjs
   because the shared footer below needs it, and a second copy over there is
   how the two drifted apart the first time. build.mjs imports this. */
export const MAIL = "help@jwlabs.dev";

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function inline(s) {
  let t = esc(s);
  t = t.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, txt, href) =>
    /^(https?:|mailto:|\/|#)/.test(href) ? `<a href="${href}">${txt}</a>` : txt);
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  return t;
}

const ITEM = /^(\s*)([-*]|\d+\.)\s+/;
const isItem = (l) => (l === undefined ? null : ITEM.exec(l));
// Lines that end a list rather than continuing an item.
const ENDS_LIST = (l) => /^\s*$/.test(l) || /^```/.test(l) || /^#{1,6}\s/.test(l) ||
  /^---+\s*$/.test(l) || /^\s*\|/.test(l) || /^>\s?/.test(l);

/* A list item's text may wrap onto following indented lines. The original
   version of this file collected only lines that themselves began with a
   bullet, which shattered every wrapped bullet in the privacy policy into a
   one-line <li> plus an orphan <p>. Lazy continuation is why this is a loop
   over items rather than a regex sweep. */
function collectList(lines, i) {
  const first = isItem(lines[i]);
  const base = first[1].length;
  const ordered = /\d/.test(first[2]);
  const items = [];
  while (i < lines.length) {
    const m = isItem(lines[i]);
    if (m && m[1].length >= base + 2 && items.length) {
      const [html, next] = collectList(lines, i);
      items[items.length - 1].children.push(html);
      i = next;
      continue;
    }
    if (m) {
      if (m[1].length > base + 1) break;              // deeper, but no parent item
      if (/\d/.test(m[2]) !== ordered) break;         // a different kind of list
      items.push({ text: [lines[i].replace(ITEM, "")], children: [] });
      i++;
      continue;
    }
    if (ENDS_LIST(lines[i]) || !items.length) break;
    items[items.length - 1].text.push(lines[i].trim());
    i++;
  }
  const tag = ordered ? "ol" : "ul";
  const html = `<${tag}>` + items
    .map((it) => `<li>${inline(it.text.join(" "))}${it.children.join("")}</li>`)
    .join("") + `</${tag}>`;
  return [html, i];
}

/* Headings get slug ids. Google Play's declaration form wants a public URL for
   the data-deletion description, and "the privacy policy" is a worse answer than
   a link that lands on §7. The slug is derived from the raw heading text, so it
   changes only if the heading does. */
const slug = (s) => s
  .replace(/`|\*\*|\*/g, "")
  .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

export function mdToHtml(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let i = 0, para = [], inFence = false, fence = [];
  const flush = () => { if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para = []; } };
  while (i < lines.length) {
    const l = lines[i];
    if (/^```/.test(l)) {
      if (inFence) { out.push(`<pre><code>${esc(fence.join("\n"))}</code></pre>`); fence = []; inFence = false; }
      else { flush(); inFence = true; }
      i++; continue;
    }
    if (inFence) { fence.push(l); i++; continue; }
    if (/^\s*$/.test(l)) { flush(); i++; continue; }
    const h = l.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      flush();
      const n = h[1].length, id = slug(h[2]);
      out.push(`<h${n}${id ? ` id="${id}"` : ""}>${inline(h[2])}</h${n}>`);
      i++; continue;
    }
    if (/^---+\s*$/.test(l)) { flush(); out.push("<hr>"); i++; continue; }
    if (/^\s*\|/.test(l)) {
      flush(); const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(lines[i++]);
      const cells = (r) => r.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const head = cells(rows[0]);
      const body = rows.slice(rows[1] && /^[\s|:-]+$/.test(rows[1]) ? 2 : 1);
      out.push("<div class=scroll><table><thead><tr>" + head.map((c) => `<th>${inline(c)}</th>`).join("") +
        "</tr></thead><tbody>" + body.map((r) => "<tr>" + cells(r).map((c) => `<td>${inline(c)}</td>`).join("") + "</tr>").join("") +
        "</tbody></table></div>");
      continue;
    }
    if (isItem(l)) {
      flush();
      const [html, next] = collectList(lines, i);
      out.push(html); i = next; continue;
    }
    if (/^>\s?/.test(l)) {
      flush(); const q = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ""));
      out.push(`<blockquote>${inline(q.join(" "))}</blockquote>`);
      continue;
    }
    para.push(l); i++;
  }
  flush();
  if (inFence && fence.length) out.push(`<pre><code>${esc(fence.join("\n"))}</code></pre>`);
  return out.join("\n");
}

/* The legal entity, spelled the way it appears on the D-U-N-S record, and the
   short form used as the wordmark. ONE copy of each, for the same reason MAIL
   has one copy.

   These are not decoration. The 2026-08-24 Apple enrollment rejection said in
   terms that the domain must be "associated with your organization", and the
   site had been naming a company -- "JW Incorporated" -- that does not exist.
   STUDIO is the short form of ORG, not a second entity and not a trade name, so
   never write copy that puts a relationship between them. jwlabs.ai is JW Labs
   LLC's domain and that is the whole of the story.
   See the foray repo's docs/apple-enrollment-website.md. */
export const ORG = "JW Labs LLC";
export const STUDIO = "JW Labs";
/* Entity type and jurisdiction, which is the strongest single association
   signal we can publish. NO POSTAL ADDRESS, anywhere, ever: the registered
   address is a founder's home address, and Apple verifies the organization's
   address through the D-U-N-S record, not through this site (see
   the foray repo's docs/apple-enrollment-website.md §2b). Do not add one, and do not add a
   city-and-state-only version either. */
export const ORG_FORM = "a California limited liability company";
export const ORG_FORMED = "July 26, 2026";

/* Primary navigation. Real navigation was one of the things the site did not
   have: five pages, no nav, and a home page that was the only route to any of
   them. Paths are relative to `base`. */
const NAV = [
  ["about/", "Company", "about"],
  ["services/", "Services", "services"],
  ["4a/", "4a", "4a"],
  ["longlive/", "longlive", "longlive"],
  ["status/", "What is built", "status"],
  ["contact/", "Contact", "contact"],
];

/* The shared chrome. `crumb` is trusted markup supplied by the build script;
   everything else is escaped. No <script>, no remote origin: the app this site
   fronts ships a strict CSP, and the site holds the same line.

   `base` is a RELATIVE prefix ("./", "../", "../../"), not "/". Root-relative
   paths would break every link and the stylesheet at
   jw-incorporated.github.io/jwlabs.dev/, which is where the site lives until the
   apex DNS records exist -- so the site would be unverifiable exactly during the
   window when you most want to look at it.

   The Organization microdata in the footer is the one machine-readable
   statement that this domain belongs to this legal entity. It is attributes
   only -- no JSON-LD, because that would need a <script> tag. */
export function page({ title, base = "./", crumb = "", desc = "", body, nav = "" }) {
  const b = esc(base);
  const links = NAV.map(([href, label, key]) =>
    `<a href="${b}${href}"${key === nav ? ' aria-current="page"' : ""}>${label}</a>`).join("\n  ");
  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>${esc(title)}</title>${desc ? `\n<meta name="description" content="${esc(desc)}">` : ""}
<meta name="author" content="${ORG}">
<link rel="stylesheet" href="${b}style.css">
<link rel="icon" href="${b}favicon.svg" type="image/svg+xml">
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="bar">
<div class="wrap">
<p class="brand"><a class="home" href="${b}">${STUDIO}</a> <span class="tag"><strong>${ORG}</strong> · a software studio</span>${crumb}</p>
<nav class="nav" aria-label="Primary">
  ${links}
</nav>
</div>
</header>
<main id="main">
${body}
</main>
<footer>
<div class="wrap" itemscope itemtype="https://schema.org/Organization">
<p class="assoc">This website is operated by <strong itemprop="name">${ORG}</strong>,
${ORG_FORM}. <a itemprop="url" href="${b}">jwlabs.ai</a> is its domain, and
<span itemprop="alternateName">${STUDIO}</span> is the short form of the same
company, not a separate one.</p>
<p>Contact <a itemprop="email" href="mailto:${MAIL}">${MAIL}</a></p>
<p class="fnav"><a href="${b}about/">Company</a> · <a href="${b}services/">Services</a> ·
<a href="${b}status/">What is built</a> · <a href="${b}4a/sample/">Sample content</a> ·
<a href="${b}glossary/">Glossary</a> · <a href="${b}contact/">Contact</a></p>
<p class="fnav"><a href="${b}terms/">Terms of use</a> · <a href="${b}privacy/">Website privacy</a> ·
<a href="${b}4a/privacy/">4a privacy policy</a> · <a href="${b}security/">Security</a> ·
<a href="${b}accessibility/">Accessibility</a></p>
</div>
</footer>
</body>
</html>
`;
}

if (process.argv[1]?.endsWith("build-md.mjs") && process.argv[2]) {
  const [src, dest, title, crumb] = process.argv.slice(2);
  writeFileSync(dest, page({ title, crumb, body: mdToHtml(readFileSync(src, "utf8")) }));
  console.log(`${src} -> ${dest}`);
}
