# jwlabs.dev

The company website for **JW Labs LLC**, served by GitHub Pages from the
**`docs/` folder** of this repository's default branch.

**`docs/` is public. The root of this repository is not.** Every file under
`docs/` is a URL on jwlabs.dev; nothing outside it is served at all. That
division is load-bearing — see [What is served, and what is
not](#what-is-served-and-what-is-not) — and the rule for anything you add is the
short version of it: **if you put a file in `docs/`, you have published it.**

The URLs, all of which are `docs/<path>/index.html` on disk:

```
/                                          the company, what it makes, and why
/about/                                    the company, the entity, the principles
/services/                                 engineering and app development
/services/what-we-build/                   four capability areas, and their honest edges
/services/how-we-work/                     the engagement, and what we will not quote for
/4a/                                       4a, the daily podcast picker
/4a/features/                              every feature, in detail
/4a/getting-started/                       opening it, installing it, the first week
/4a/sample/                                what a foray looks like -- sample content index
/4a/sample/barbecue/                       sample foray, 21:56, six shows
/4a/sample/startup-capital/                sample foray, 51:22, seven shows
/4a/sample/plate-tectonics/                sample foray, 40:20, one show, eleven episodes
/4a/library/                               what is in the library, and what is not
/4a/your-data/                             plain-language privacy, and deletion
/4a/faq/                                   the questions people actually ask
/4a/support/                               how to get help          (Apple-required URL)
/4a/for-podcasters/                        publishers: what we do, and removal
/4a/privacy/                               4a's privacy policy      (store-required URL)
/longlive/                                 longlive, linking out to longlivets.com
/status/                                   what is built and what is not
/contact/                                  the one address, and what to include
/glossary/                                 terms a user would meet
/security/                                 responsible disclosure
/accessibility/                            accessibility statement, incl. what is untested
/terms/                                    terms of use, site + 4a
/privacy/                                  this website's privacy notice
```

## The site is feature-led and user-facing. Keep it that way.

**Founder direction, 2026-08-25:**

> "Don't give away the game here, just talk about the features the apps offer and
> maybe add a JW Labs LLC services page describing the company as engineers and app
> developers. Dont share our internal decisions or how the sausage is made"

An earlier version of this site carried six long engineering notes -- segment
anchoring, transcript acquisition, classification methodology, measurement
discipline. **They were removed.** That material is the company's actual advantage
and Apple's enrollment requirement never asked how anything works.

So, for anything you add:

- **Describe the RESULT, never the mechanism.** "It finds the interesting stretch of
  an episode and skips the rest" is a feature. How it locates that stretch is the
  game.
- **No architecture decisions, no methodology, no measurement write-ups, no internal
  process, no incident post-mortems.** Do not mine `docs/adr/`, `docs/research/`,
  `docs/curation/`, `CLAUDE.md` or the `transcript-farm` repo for this site.
- **Publish far fewer numbers than an engineering page would.** Where you do publish
  a quantity, label it measured / estimated / projected / designed and date it.
- **Sample content is the best kind of substance**: it demonstrates the product and
  gives nothing away. `/4a/sample/` is three real assembled forays from
  `data/forays.json`, described in OUR OWN words.

### Copyright rules for sample content -- not optional

1. **Never reproduce song lyrics**, in any form, in any quantity, for any reason.
   This applies to `/longlive/` specifically.
2. **No podcast transcript text.** The `start_anchor` / `end_anchor` fields in
   `data/segments.json` ARE transcript text. Do not publish them. Describe a
   segment in our own words instead -- the `why` field is our editorial line and is
   safe.
3. **Naming shows, episodes, hosts and publishers is fine and correct.** Attribution
   is a courtesy we should extend.
4. **No podcast cover art or album art.** Third-party images, and `build.mjs`
   forbids remote images regardless.
5. **Do not imply endorsement.** Every sample page carries an explicit line saying
   the shows named are independent, are not partners, and have not endorsed us.

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

**The brief for this whole site lives in the foray repo**, at
`docs/apple-enrollment-website.md`: Apple's verbatim requirements, the 15-item checklist
derived from them, what Apple does *not* require (no postal address — and there
must never be one on this site), the facts still wanted from the founder, and the
post-deploy verification commands. Read it before adding, removing or rewriting a
page.

## Build

```
node build.mjs
```

Run it from the repository root; `src/` is read relative to the working
directory. No dependencies, no `package.json`, no lockfile, no CI step.
`build.mjs` writes every `index.html` into **`docs/`** and they are committed,
because GitHub Pages serves committed files and there is no build server in the
path.

`OUT` at the top of `build.mjs` is the only place the output directory is named.
Page paths are handled in *site* space throughout — `4a/privacy/index.html`, not
`docs/4a/privacy/index.html` — because that is the space a browser resolves an
href in, and `docs/` is a serving detail the reader never sees. `OUT` is applied
at the moment of writing and nowhere else, which is why the link checker and the
relative-depth arithmetic in `up()` were unaffected by the move.

The build is also the test suite. It fails, rather than publishing, on: a
`<script>` tag; any element that would fetch a subresource from another origin; a
remote CSS reference; a surviving `href="/…"`; the string `JW Incorporated`; an
unsubstituted `{{PLACEHOLDER}}`; a shape change in the upstream privacy policy;
**a dead internal link; or a fragment link pointing at an id that does not
exist.** The last two matter because Apple's enrollment requirement is that the
site be "functional", and a 404 behind the navigation is the cheapest possible way
to fail that. It also fails on **a missing or wrong `docs/CNAME` or
`docs/.nojekyll`** — Pages reads both from the directory it serves, and losing
the first unsets the custom domain and 404s every URL. The last two lines of
output are the count and that check:

```
26 pages, 739 internal links all resolve, 76 off-site links not fetched.
docs/CNAME and docs/.nojekyll present. Pages source must be set to the docs/ folder.
```

Off-site links are counted, not fetched — this is a build, not a crawler.

**No dependencies, no scripts, no remote origins.** Every page is one HTML file
plus the same-origin `style.css`. There is no `<script>` tag anywhere and nothing
is fetched from another host — a remote URL is only ever an `<a href>` the reader
chooses to follow. `build.mjs` asserts this on every page it writes and fails the
build otherwise. The reason is not taste: the app this site fronts ships a strict
CSP that blocks remote fonts and scripts, and the site holds the same line so the
two cannot drift into different rules.

## How this is served, and the three settings that matter

GitHub Pages is the origin. **Cloudflare sits in front of it, and that is not
optional** — GitHub never issued a certificate for `jwlabs.dev` (five days at
`authorization_created`, and remove/re-add did not shake it loose), so the origin
still presents `CN=*.github.io`. Cloudflare terminates TLS with a real
certificate for the domain instead. `.dev` is HSTS-preloaded, so a certificate
error here is not a click-through warning: the site is simply unreachable.

Three settings are load-bearing — the first on GitHub, the other two consequences
of the arrangement above, on Cloudflare — and **none of them is visible from this
repository.** Nothing you can read here will tell you one is wrong; the site is
just down, or quietly serving something it should not:

1. **GitHub Pages source: branch `main`, folder `/docs`.** Not `/ (root)`. On
   root, every file in the repository answers HTTP 200 — see [What is served,
   and what is not](#what-is-served-and-what-is-not) for the three exposures that
   caused. This setting and `docs/CNAME` are a pair: Pages reads `CNAME` from the
   directory it serves, so pointing the source at root while the file sits in
   `docs/` unsets the custom domain, and every jwlabs.dev URL 404s behind
   Cloudflare with nothing in this repository to explain why. `node build.mjs`
   asserts the file is in the right place; it cannot see the setting.

2. **DNS records proxied (orange cloud), SSL/TLS mode `Full`.** Not `Flexible`
   — Cloudflare would speak HTTP to Pages, Pages redirects to HTTPS, and the
   result is a redirect loop. Not `Full (strict)` — it validates the origin
   certificate, sees `*.github.io` against `jwlabs.dev`, and returns 526. Turning
   the clouds grey brings back `ERR_CERT_COMMON_NAME_INVALID`.

3. **Scrape Shield → Email Address Obfuscation OFF.** On, it rewrites every
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
curl -so /dev/null -w '%{http_code}\n' https://jwlabs.dev/README.md   # must be 404
```

## What is served, and what is not

**`docs/` is public. The root is not.** Pages is pointed at the `docs/` folder,
so the served tree is exactly the 26 pages plus `style.css`, `favicon.svg`,
`CNAME` and `.nojekyll`. `README.md`, `build.mjs`, `build-md.mjs` and `src/*.md`
are not URLs.

The rule, and it is the whole of the rule: **anything you put in `docs/` is a
public URL.** There is no half-served file and no directory Pages politely skips.
If a file should not be readable by a stranger who guesses a path, it goes at the
root — or, if it is not about this site at all, in the foray repo.

**This used to be the other way round, and it cost three exposures.** Pages
served the branch root, which made every file in the repository a public URL:

1. An internal working note about the 2026-08-24 Apple enrollment rejection was
   readable at `/docs/apple-enrollment-website.md`. It named the wrong company
   four times — which `build.mjs`'s `JW Incorporated` guard could not catch,
   because that guard only inspects pages `build.mjs` writes. It now lives in the
   foray repo.
2. This README was readable at `/README.md`, discussing the Apple rejection, the
   wrong-company-name history, and the guard that forbids the string.
3. `src/4a-privacy-policy.md` was readable at `/src/4a-privacy-policy.md`,
   `Status: DRAFT` banner and nine `TODO(founder)` notes intact — five of them
   unresolved internal decisions — which is precisely the text `publishPolicy()`
   strips from `/4a/privacy/`. The transform cleaned the page; nothing cleaned the
   raw file, because it was served as-is.

Patching each instance was losing. Every fix was a new file to remember about,
and the guard that could have caught the first one was structurally unable to see
it. Making the root not a public directory fixes the class: the question stops
being "is this file safe to serve?" and becomes "is this file in `docs/`?", which
`git ls-files docs/` answers.

Two things follow. Non-page files still do not belong in this repository if they
belong somewhere else — the Apple note is better off in foray whatever Pages is
pointed at, since that is where the work it describes lives. And the `docs/`
name is now taken: it is the served root, so it can never hold internal notes.

## Files

Ordered by the only distinction that matters: served or not.

**Not served — the repository root.** These are the source of the site and the
notes about it, and none of them is reachable over HTTP.

| File | What it is |
|---|---|
| `README.md` | This file. |
| `build.mjs` | The generator. Holds structure and metadata only -- titles, descriptions, breadcrumbs, emit order -- pulls every page's prose out of `src/*.md`, runs the privacy-policy publication transform, asserts everything listed above, and link-checks the result. No prose lives in this file. |
| `build-md.mjs` | Dependency-free Markdown→HTML for the subset these documents use. Escapes anything it does not understand, so an unhandled construct degrades to visible text rather than to injected markup. Relative links deliberately degrade to plain text rather than to a 404. Also holds the shared chrome (`page()`) and the four single-source facts: `MAIL`, `ORG`, `ORG_FORM`, `ORG_FORMED`. |
| `src/*.md` (except `4a-privacy-policy.md`) | Every page's prose, one file per page. Rendered by the same `mdToHtml` the privacy policy uses, so there is one renderer and not two. `{{MAIL}}`, `{{ORG}}`, `{{STUDIO}}`, `{{ORG_FORM}}` and `{{ORG_FORMED}}` are substituted at build time and a leftover placeholder fails the build. Links inside them are written root-relative (`/about/`) and rewritten to the page's own depth. |
| `src/4a-privacy-policy.md` | A **snapshot** of `docs/legal/privacy-policy.md` from the [foray repo](https://github.com/JW-Incorporated/foray), carried verbatim — `Status: DRAFT` banner, nine `TODO(founder)` notes and all. See below. |
| `.gitattributes` | `* text=auto eol=lf`. The checkout is on Windows; the committed pages are LF. |

**Served — `docs/`.** Twenty-six generated pages plus four static files. Nothing
else belongs here, and anything added here is a public URL.

| File | What it is |
|---|---|
| `docs/**/index.html` | The 26 pages, generated by `build.mjs` and committed. Do not hand-edit; edit `src/*.md` and rebuild. |
| `docs/style.css` | The whole stylesheet. System font stack; light/dark via `prefers-color-scheme`, with a `[data-theme]` override block kept for the day something can set it. Nothing sets it today — there is no script, by constraint — so in practice the OS decides. |
| `docs/favicon.svg` | Same-origin SVG favicon, so a first visit does not 404 on `/favicon.ico`. Inverts with the OS theme. |
| `docs/CNAME`, `docs/.nojekyll` | Pages configuration, and it has to be **here** rather than at the root: Pages reads both from the directory it serves. `build.mjs` asserts it. |

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

### The snapshot stays faithful, and it is not served

`src/4a-privacy-policy.md` keeps its `Status: DRAFT` banner and all nine
`TODO(founder)` notes, verbatim, and **that is deliberate.** `publishPolicy()`
asserts it removes exactly one banner and exactly nine blocks; deleting them from
the source, or softening them, would make those assertions pass against nothing —
a green build that has stopped checking anything. The snapshot is an input to a
transform, not a page. Do not tidy it.

It used to be served, because Pages served the branch root: the banner and the
nine notes — the exact text `publishPolicy()` exists to keep off the published
page — answered HTTP 200 at `/src/4a-privacy-policy.md`. That is fixed
structurally rather than by editing the file. `src/` is outside `docs/`, so it is
not served, and the faithful snapshot and the clean published page can both be
true at once.

## longlive has no privacy policy on this site, on purpose

`/longlive/` describes the timeline's features from what `longlivets.com` itself
publishes, and links out. longlive has its own
domain, so its legal documents belong there. Nobody here knows its data
practices, and **a privacy policy that is wrong is worse than one that is absent,**
because it is submitted to a store as a factual declaration. Do not add one here.

## DNS

`docs/CNAME` claims the apex `jwlabs.dev`. The zone is on Cloudflare and points at
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
