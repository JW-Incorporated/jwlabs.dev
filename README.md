# jwlabs.dev

The company website for JW Incorporated, served by GitHub Pages from this
repository's default branch root.

```
/                 JW Labs — the company, and what it makes
/4a/              4a, the podcast curator
/4a/privacy/      4a's privacy policy      (store-required URL)
/4a/support/      contact + FAQ            (Apple-required URL)
/longlive/        longlive, linking out to longlivets.com
```

## Build

```
node build.mjs
```

No dependencies, no `package.json`, no lockfile, no CI step. `build.mjs` writes
the five `index.html` files in place and they are committed, because GitHub Pages
serves the branch and there is no build server in the path.

**No dependencies, no scripts, no remote origins.** Every page is one HTML file
plus the same-origin `style.css`. There is no `<script>` tag anywhere and nothing
is fetched from another host — a remote URL is only ever an `<a href>` the reader
chooses to follow. `build.mjs` asserts this on every page it writes and fails the
build otherwise. The reason is not taste: the app this site fronts ships a strict
CSP that blocks remote fonts and scripts, and the site holds the same line so the
two cannot drift into different rules.

## Files

| File | What it is |
|---|---|
| `build.mjs` | The generator. Holds every page's copy, and the privacy-policy publication transform. |
| `build-md.mjs` | Dependency-free Markdown→HTML for the subset the legal documents use. Escapes anything it does not understand, so an unhandled construct degrades to visible text rather than to injected markup. Relative links deliberately degrade to plain text rather than to a 404. |
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

If that trade stops being acceptable, the fix is to move the five generated pages
plus `style.css`, `favicon.svg`, `CNAME` and `.nojekyll` into `docs/` and switch
Pages to `source.path: "/docs"` — then `build.mjs`, `src/` and this README stop
being served at all. It was not done here because re-pointing the Pages source
while the TLS certificate is provisioning risks delaying the one URL a store
submission depends on.

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

**Every record is DNS-only — grey cloud, `"proxied": false`.** This is the one
Cloudflare-specific trap worth writing down: the orange-cloud proxy sits in front
of the origin and prevents GitHub Pages from completing its ACME challenge, so
the certificate never issues and the site serves a browser warning instead. The
proxy can be switched on later, once Pages holds a certificate, and nothing here
needs it.

**Nothing on this site depends on the custom domain.** Every path is relative
(`./`, `../`, `../../`), computed per page by `up()` in `build.mjs`, so the site
renders identically at `https://jwlabs.dev/` and at
`https://jw-incorporated.github.io/jwlabs.dev/`. That is deliberate: it means the
site can be reviewed the moment it is pushed rather than only after DNS
propagates. Do not "simplify" those to `/`-rooted paths — `build.mjs` asserts
that no `href="/…"` survives, and will fail the build if one does.
