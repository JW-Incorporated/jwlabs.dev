# jwlabs.dev

The company website for **JW Labs LLC**, served by GitHub Pages from this
repository's default branch root.

```
/                                          the company, what it makes, and why
/about/                                    the company, the entity, the principles
/contact/                                  the one address, and what to include
/engineering/                              index of the notes, and the number labels
/engineering/segment-anchoring/            per-request ad stitching, and content anchors
/engineering/transcripts/                  transcript availability, corpus, ASR cost
/engineering/curation/                     four queues, classification, narration coverage
/engineering/measurement/                  five ways a number lied to us
/engineering/privacy-by-construction/      the CSP, and where it does not hold
/terms/                                    terms of use, site + 4a
/privacy/                                  this website's privacy notice
/4a/                                       4a, the podcast curator
/4a/privacy/                               4a's privacy policy      (store-required URL)
/4a/support/                               contact + FAQ            (Apple-required URL)
/longlive/                                 longlive, linking out to longlivets.com
```

## Read this before editing any page

The legal entity is **JW Labs LLC**, a California limited liability company
formed 2026-07-26. It has ONE definition, `ORG` in `build-md.mjs`, and
`build.mjs` **fails the build** if the string `JW Incorporated` appears in any
generated page — that name is not a company, and a site that used it got this
company's Apple Developer Program organization enrollment rejected on
2026-08-24. Do not reintroduce it, and do not write copy that puts a
relationship between "JW Labs" and anything else: the short form and the legal
name are the same company.

The GitHub **organisation** is separately named `JW-Incorporated`, so repository
and Pages URLs legitimately contain that spelling. The build's check is for the
spaced form only.

**[`docs/apple-enrollment-website.md`](docs/apple-enrollment-website.md) is the
brief for this whole site**: Apple's verbatim requirements, the 15-item checklist
derived from them, what Apple does *not* require (no postal address — and there
must never be one on this site), the facts still wanted from the founder, and the
post-deploy verification commands. Read it before adding, removing or rewriting a
page.

## Build

```
node build.mjs
```

No dependencies, no `package.json`, no lockfile, no CI step. `build.mjs` writes
the fifteen `index.html` files in place and they are committed, because GitHub
Pages serves the branch and there is no build server in the path.

The build is also the test suite. It fails, rather than publishing, on: a
`<script>` tag; any element that would fetch a subresource from another origin; a
remote CSS reference; a surviving `href="/…"`; the string `JW Incorporated`; an
unsubstituted `{{PLACEHOLDER}}`; a shape change in the upstream privacy policy;
**a dead internal link; or a fragment link pointing at an id that does not
exist.** The last two matter because Apple's enrollment requirement is that the
site be "functional", and a 404 behind the navigation is the cheapest possible way
to fail that. The final line of output is the count:

```
15 pages, 270 internal links all resolve, 41 off-site links not fetched.
```

Off-site links are counted, not fetched — this is a build, not a crawler.

**No dependencies, no scripts, no remote origins.** Every page is one HTML file
plus the same-origin `style.css`. There is no `<script>` tag anywhere and nothing
is fetched from another host — a remote URL is only ever an `<a href>` the reader
chooses to follow. `build.mjs` asserts this on every page it writes and fails the
build otherwise. The reason is not taste: the app this site fronts ships a strict
CSP that blocks remote fonts and scripts, and the site holds the same line so the
two cannot drift into different rules.

## How this is served, and the two settings that matter

GitHub Pages is the origin. **Cloudflare sits in front of it, and that is not
optional** — GitHub never issued a certificate for `jwlabs.dev` (five days at
`authorization_created`, and remove/re-add did not shake it loose), so the origin
still presents `CN=*.github.io`. Cloudflare terminates TLS with a real
certificate for the domain instead. `.dev` is HSTS-preloaded, so a certificate
error here is not a click-through warning: the site is simply unreachable.

Two zone settings are therefore load-bearing, and neither is visible from this
repository:

1. **DNS records proxied (orange cloud), SSL/TLS mode `Full`.** Not `Flexible`
   — Cloudflare would speak HTTP to Pages, Pages redirects to HTTPS, and the
   result is a redirect loop. Not `Full (strict)` — it validates the origin
   certificate, sees `*.github.io` against `jwlabs.dev`, and returns 526. Turning
   the clouds grey brings back `ERR_CERT_COMMON_NAME_INVALID`.

2. **Scrape Shield → Email Address Obfuscation OFF.** On, it rewrites every
   `mailto:` into a `/cdn-cgi/l/email-protection#<hex>` link, replaces the visible
   address with the literal text `[email protected]`, **and injects a `<script>`
   tag** to decode it at runtime. That defeats the no-script rule above from
   outside the repo, where `build.mjs`'s assertion cannot see it — the build stays
   green while the served page has a script in it. Worse, the contact address
   disappears without JavaScript, and `/4a/privacy/` and `/4a/support/` exist
   precisely so an App Store reviewer can find that address.

   **Rocket Loader** must stay off for the same reason.

To check the served page rather than the built one:

```
curl -sS https://jwlabs.dev/ | grep -c '<script'          # must be 0
curl -sS https://jwlabs.dev/ | grep -o 'mailto:[^"]*'     # must be the real address
```

## Files

| File | What it is |
|---|---|
| `build.mjs` | The generator. Holds the copy for the short structural pages (home, `/4a/`, `/longlive/`), pulls the long-form pages out of `src/*.md`, runs the privacy-policy publication transform, asserts everything listed above, and link-checks the result. |
| `build-md.mjs` | Dependency-free Markdown→HTML for the subset these documents use. Escapes anything it does not understand, so an unhandled construct degrades to visible text rather than to injected markup. Relative links deliberately degrade to plain text rather than to a 404. Also holds the shared chrome (`page()`) and the four single-source facts: `MAIL`, `ORG`, `ORG_FORM`, `ORG_FORMED`. |
| `src/about.md`, `src/contact.md`, `src/engineering.md`, `src/eng-*.md`, `src/terms.md`, `src/site-privacy.md` | The long-form pages, as prose. Rendered by the same `mdToHtml` the privacy policy uses, so there is one renderer and not two. `{{MAIL}}`, `{{ORG}}`, `{{STUDIO}}`, `{{ORG_FORM}}` and `{{ORG_FORMED}}` are substituted at build time and a leftover placeholder fails the build. Links inside them are written root-relative (`/about/`) and rewritten to the page's own depth. |
| `style.css` | The whole stylesheet. System font stack; light/dark via `prefers-color-scheme`, with a `[data-theme]` override block kept for the day something can set it. Nothing sets it today — there is no script, by constraint — so in practice the OS decides. |
| `src/4a-privacy-policy.md` | A **snapshot** of `docs/legal/privacy-policy.md` from the [foray repo](https://github.com/JW-Incorporated/foray). See below. |
| `favicon.svg` | Same-origin SVG favicon, so a first visit does not 404 on `/favicon.ico`. Inverts with the OS theme. |
| `CNAME`, `.nojekyll` | Pages configuration. |

## The privacy policy is converted, not written here

`src/4a-privacy-policy.md` is a snapshot of `docs/legal/privacy-policy.md` in the
foray repository — the same repository that builds 4a. That document is accurate
about the `cp_` keys, IndexedDB, the anonymous session token and the hosts a
device actually contacts, and foray's `test/legal-citations.test.js` pins its
claims against the shipped source. **Its precision is the point, so its wording
is passed through untouched.**

When the policy changes upstream:

1. Copy the file over `src/4a-privacy-policy.md`.
2. Update `POLICY_COMMIT` and `POLICY_SNAPSHOT` in `build.mjs`, which are printed
   on the published page. If you skip this the page states a provenance it does
   not have.
3. `node build.mjs` and commit the regenerated HTML.

`publishPolicy()` in `build.mjs` makes exactly two changes, both asserted so that
a change to the source's shape fails the build rather than silently passing the
wrong document through:

- It removes the **`Status: DRAFT — not yet published`** banner, which is false
  once the document is published and which tells a store reviewer that what he is
  reading was not meant to be read.
- It removes the nine **`TODO(founder)`** blockquotes, which are editorial notes
  to the founder rather than statements to a reader. Four of them ask for facts
  that only exist *at* publication — who publishes, how to reach them, where the
  policy is hosted, its effective date — and those are answered in a new §9 body.
  The remaining five are unresolved internal decisions: **Supabase region and
  hosting jurisdiction, event-row retention period, store age rating,
  US-only-versus-GDPR geo-availability, and legal review.** Dropping them leaves
  the policy *silent* on those points rather than wrong about them. Silence is
  omission; an invented retention period would be a false declaration in a store
  submission. §9 says outright that no retention period is stated and why.

`docs/legal/data-safety.md` in the foray repo is internal working material for
Google Play's declaration form and is **deliberately not published here.** The
policy links to it; `build-md.mjs` renders that relative link as plain text.

### One known wart: the snapshot is served

Pages serves the branch root, so `src/4a-privacy-policy.md` is fetchable at
`https://jwlabs.dev/src/4a-privacy-policy.md` — **including its `Status: DRAFT`
banner and its nine `TODO(founder)` notes**, which is exactly the text
`publishPolicy()` exists to keep off the published page. Accepted rather than
fixed, on three grounds: the repository is public, so that text is readable at a
`github.com` URL either way; nothing links to the path; and the published page's
provenance blockquote already states which notes were removed, so finding the
source confirms the disclosure rather than contradicting it.

Every other `src/*.md` is now served the same way, and that part is harmless —
they are the same prose as the rendered pages, minus the chrome. The `docs/`
directory is served too, which means
`docs/apple-enrollment-website.md` — an internal working document about an Apple
rejection — is fetchable. Nothing links to it, and its content is candid rather
than embarrassing, but be aware of it before writing anything in there you would
not want a reviewer to read.

If that trade stops being acceptable, the fix is to move the fifteen generated
pages plus `style.css`, `favicon.svg`, `CNAME` and `.nojekyll` into a served
subdirectory and re-point Pages at it — then `build.mjs`, `src/`, `docs/` and this
README stop being served at all. It was not done here because re-pointing the
Pages source while an enrollment re-review is pending risks breaking the one URL
that review depends on. Note the name collision if you do: Pages'
`source.path: "/docs"` option cannot be used while `docs/` holds internal notes.

## longlive has no privacy policy on this site, on purpose

`/longlive/` is one sentence and a link to `longlivets.com`. longlive has its own
domain, so its legal documents belong there. Nobody here knows its data
practices, and **a privacy policy that is wrong is worse than one that is absent,**
because it is submitted to a store as a factual declaration. Do not add one here.

## DNS

`CNAME` claims the apex `jwlabs.dev`. The zone is on Cloudflare and points at
GitHub Pages' four apex addresses, plus a `www` alias:

```
A      @    185.199.108.153
A      @    185.199.109.153
A      @    185.199.110.153
A      @    185.199.111.153
CNAME  www  jw-incorporated.github.io
```

**The apex records are proxied — orange cloud — and must stay that way.** This
paragraph used to say the opposite, and it was stale: it described the state
during certificate provisioning, when the orange-cloud proxy was what prevented
GitHub Pages from completing its ACME challenge. That challenge never completed
anyway, which is why the section above exists — Cloudflare is now the only thing
presenting a valid certificate for this domain, so turning the clouds grey brings
back `ERR_CERT_COMMON_NAME_INVALID` on an HSTS-preloaded TLD, i.e. an unreachable
site. Verified served through the proxy on 2026-08-25 (`server: cloudflare`,
`CF-RAY` present, GitHub's `x-github-request-id` still on the response behind
it).

**Nothing on this site depends on the custom domain.** Every path is relative
(`./`, `../`, `../../`), computed per page by `up()` in `build.mjs`, so the site
renders identically at `https://jwlabs.dev/` and at
`https://jw-incorporated.github.io/jwlabs.dev/`. That is deliberate: it means the
site can be reviewed the moment it is pushed rather than only after DNS
propagates. Do not "simplify" those to `/`-rooted paths — `build.mjs` asserts
that no `href="/…"` survives, and will fail the build if one does.
