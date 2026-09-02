# jwlabs.ai

The company website for **JW Labs LLC**, served by GitHub Pages from the
**`docs/` folder** of this repository's default branch.

**The primary domain is `jwlabs.ai`.** `jwlabs.dev` was primary until the cutover
below, and its only remaining job is to redirect to `jwlabs.ai` — a Cloudflare
rule on the old zone, not anything in this repository. See [the cutover
runbook](#the-cutover-runbook) for the order of operations and what to verify.
The **repository** is still named `jwlabs.dev`, so repository and Pages URLs
legitimately keep that spelling, the same way the GitHub organisation is
legitimately spelled `JW-Incorporated`.

**The contact address is `help@jwlabs.ai`, and that is what the site publishes.**
Cloudflare Email Routing is provisioned on the **`jwlabs.ai`** zone — MX
(`route1/2/3.mx.cloudflare.net`) and SPF (`v=spf1 include:_spf.mx.cloudflare.net
~all`) both resolve, and the zone reports `status: ready`. `MAIL` in
`build-md.mjs` is `help@jwlabs.ai`, and every built page carries it, so the
published address is on the same domain the site is served from.

**Do not "restore" a `.dev` address here.** An earlier revision of this file said
Email Routing existed on the `jwlabs.dev` zone only, that `help@jwlabs.ai` would
therefore drop mail silently, and that publishing a `.dev` address on a `.ai` site
was a deliberate mismatch to leave alone. That was true before routing was
provisioned on the new zone; **it is false now**, and acting on it would undo a
finished fix. `help@jwlabs.dev` does still accept mail, and should keep doing so
while documents already in the wild name it — but that is a property of the old
zone, not a reason to publish the old address.

**What is still unticked is delivery, and it is not a formality.** DNS proves the
zone is *configured*; it does not prove a routing rule exists with a *verified*
destination, and Cloudflare publishes MX and reports a zone ready before that is
true. In that state mail to `help@jwlabs.ai` is rejected or dropped. **Step 13 of
the runbook — send a real message to `help@jwlabs.ai` from outside and confirm it
arrives — is the check that settles it, and it has not been done.** Do it. If it
fails, fix the routing rule; the answer is still not to republish a `.dev`
address.

**`docs/` is public. The root of this repository is not.** Every file under
`docs/` is a URL on jwlabs.ai; nothing outside it is served at all. That
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
/4a/age-rating/                            content and age suitability  (store-required URL)
/4a/for-podcasters/                        publishers: what we do, and removal
/4a/privacy/                               4a's privacy policy      (store-required URL)
/longlive/                                 longlive, linking out to longlivets.com
/longlive/age-rating/                      content and age suitability  (store-required URL)
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
the first unsets the custom domain and 404s every URL. The `CNAME` guard checks
its *content*, not just its presence, and the expected value is spelled out in
`build.mjs`: changing the domain means changing the file and the guard together,
in one commit, or the build fails. The last two lines of
output are the count and that check:

```
26 pages, 737 internal links all resolve, 76 off-site links not fetched.
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

## How this is served, and the four settings that matter

GitHub Pages is the origin and **Cloudflare sits in front of it.** Four settings
decide whether that works, and not one of them is in this repository.

**Why the proxy was load-bearing on `jwlabs.dev`, and what to check on
`jwlabs.ai`.** GitHub never issued a certificate for `jwlabs.dev` — five days at
`authorization_created`, and remove/re-add did not shake it loose — so the origin
still presents `CN=*.github.io`, and Cloudflare's edge certificate is the only
valid certificate that domain has. **Whether that repeats on `jwlabs.ai` is not
known, and has to be verified at cutover rather than assumed in either
direction.** GitHub may issue for the new domain, in which case the proxy stops
being the only thing holding TLS up and becomes a preference; or it may stall the
same way, in which case the proxy is load-bearing again and turning the clouds
grey takes the site down. Do not write down which of those is true here until
somebody has looked: check whether Pages reports a certificate and offers
*Enforce HTTPS*, and what a request actually gets with the record grey-clouded.

**`.ai` is not HSTS-preloaded. `.dev` is.** That is a real reduction in cutover
risk, and it is the reason this move is safer than the original launch was. On
`.dev`, a certificate error was an unreachable site: the browser refused the
connection before rendering anything, with no way for a visitor to proceed and no
way to tell anyone "click through the warning". On `.ai` the same error is an
interstitial a visitor can click past, and one that can be diagnosed in a browser
rather than only with `curl`. It is not licence to ship a broken certificate — it
is the difference between a bad hour and a total outage.

Four settings are load-bearing — the first on GitHub, the rest on Cloudflare —
and **none of them is visible from this repository.** Nothing you can read here
will tell you one is wrong; the site is just down, or quietly serving something it
should not:

1. **GitHub Pages source: branch `main`, folder `/docs`.** Not `/ (root)`. On
   root, every file in the repository answers HTTP 200 — see [What is served,
   and what is not](#what-is-served-and-what-is-not) for the three exposures that
   caused. This setting and `docs/CNAME` are a pair: Pages reads `CNAME` from the
   directory it serves, so pointing the source at root while the file sits in
   `docs/` unsets the custom domain, and every jwlabs.ai URL 404s behind
   Cloudflare with nothing in this repository to explain why. `node build.mjs`
   asserts the file is in the right place; it cannot see the setting.

2. **DNS records proxied (orange cloud), SSL/TLS mode `Full`.** Not `Flexible`
   — Cloudflare would speak HTTP to Pages, Pages redirects to HTTPS, and the
   result is a redirect loop. Not `Full (strict)` — it validates the origin
   certificate, sees `*.github.io` against the custom domain, and returns 526.
   On `jwlabs.dev`, turning the clouds grey brought back
   `ERR_CERT_COMMON_NAME_INVALID`; whether that is still true of `jwlabs.ai`
   depends on the open certificate question above, so keep them orange until
   somebody has checked. This is a **per-zone** setting, and a new zone starts at
   Cloudflare's default, which is not `Full`.

3. **Scrape Shield → Email Address Obfuscation OFF.** On, it rewrites every
   `mailto:` into a `/cdn-cgi/l/email-protection#<hex>` link, replaces the visible
   address with the literal text `[email protected]`, **and injects a `<script>`
   tag** to decode it at runtime. That defeats the no-script rule above from
   outside the repo, where `build.mjs`'s assertion cannot see it — the build stays
   green while the served page has a script in it. Worse, the contact address
   disappears without JavaScript, and `/4a/privacy/` and `/4a/support/` exist
   precisely so an App Store reviewer can find that address.

   **Rocket Loader** must stay off for the same reason. Both are **per-zone**:
   they were turned off on `jwlabs.dev`, and that does nothing whatsoever for
   `jwlabs.ai`. Turn them off again on the new zone.

4. **The `jwlabs.dev` → `jwlabs.ai` redirect is a Cloudflare rule on the OLD
   zone, and there is no trace of it in this repository.** GitHub Pages supports
   exactly one custom domain per repository, and `docs/CNAME` spends it on
   `jwlabs.ai`, so Pages cannot serve `jwlabs.dev` as well — it answers requests
   for the old hostname with a 404 from GitHub's edge. The forward therefore lives
   entirely in Cloudflare, on the `jwlabs.dev` zone: a **301 that preserves path
   and query** — either a Page Rule matching `jwlabs.dev/*` and forwarding to
   `https://jwlabs.ai/$1`, or the equivalent Redirect Rule built on
   `http.request.uri`. Which mechanism is used does not matter; preserving the
   path does.

   **Nothing here creates that rule, asserts it, or notices when it goes away.**
   `node build.mjs` prints a clean 26 pages with the old domain completely dark.
   If the rule is deleted or misconfigured, every link anybody has ever shared to
   `jwlabs.dev` — including whatever is currently filed in App Store Connect and
   the Play Console — starts 404ing, and the first symptom is a complaint from
   outside.

   The rule also needs the old zone's **DNS records left in place.** Cloudflare
   can only answer for a hostname that resolves to it, so a proxied record has to
   exist for `jwlabs.dev` even though nothing is behind it any more. Deleting the
   A records because "the site moved" breaks the redirect exactly as thoroughly as
   deleting the rule.

To check the served page rather than the built one:

```
curl -sS https://jwlabs.ai/ | grep -c '<script'          # must be 0
curl -sS https://jwlabs.ai/ | grep -o 'mailto:[^"]*'     # must be help@jwlabs.ai
curl -so /dev/null -w '%{http_code}\n' https://jwlabs.ai/README.md   # must be 404
curl -so /dev/null -w '%{http_code} %{redirect_url}\n' https://jwlabs.dev/4a/support/
                                            # must be 301 -> https://jwlabs.ai/4a/support/
```

## The cutover runbook

`jwlabs.ai` was purchased on 2026-08-25 and, at the time this was written, **has
no nameservers.** It is a name and nothing else. The steps below are ordered, and
the order is the only thing keeping the site up.

**Do not merge the cutover branch until steps 1–4 are done.** That is the whole
risk in this change. The moment `docs/CNAME` says `jwlabs.ai` on the default
branch, Pages drops `jwlabs.dev` as its custom domain and starts answering for
`jwlabs.ai` instead — and if `jwlabs.ai` does not resolve yet, the site is at no
working domain at all: the old URLs 404 from GitHub and the new ones do not
resolve, for as long as DNS takes. Nothing in this repository can detect that
state; `node build.mjs` will be green throughout.

**Before merging.**

1. **Point `jwlabs.ai` at Cloudflare.** Add the zone, take the two assigned
   nameservers, set them at the registrar, and wait for the zone to read Active.
   Registrar propagation is the long pole and is not under anyone here's control:
   allow hours, not minutes.
2. **Create the DNS records on the new zone**, matching what the old one has:
   four A records at the apex for GitHub Pages — `185.199.108.153`,
   `185.199.109.153`, `185.199.110.153`, `185.199.111.153` — and a `www` CNAME to
   `jw-incorporated.github.io`. **Proxied: orange cloud.**
3. **Set the new zone's per-zone settings**, none of which carry over from
   `jwlabs.dev`: SSL/TLS mode `Full` (not `Flexible`, not `Full (strict)` — see
   the section above for why each of those breaks), Scrape Shield → **Email
   Address Obfuscation OFF**, and **Rocket Loader OFF**.
4. **Confirm resolution.** `dig +short jwlabs.ai` must answer, and must answer
   with Cloudflare addresses rather than the four GitHub ones — proxied records
   return Cloudflare's, and that is how you know the proxy is on.

**Merge, then immediately.**

5. **Check Settings → Pages.** GitHub normally picks the custom domain up from
   `docs/CNAME`; if it has not, set it to `jwlabs.ai` by hand. **Leave the Pages
   *source* alone** — branch `main`, folder `/docs`. Nothing about this cutover
   requires touching it, and moving it to root re-creates three exposures
   documented under [What is served, and what is
   not](#what-is-served-and-what-is-not).
6. **Create the redirect on the `jwlabs.dev` zone.** A 301 that preserves path
   and query: a Page Rule on `jwlabs.dev/*` forwarding to `https://jwlabs.ai/$1`
   is the shortest route, and a Redirect Rule on `http.request.uri` does the same
   job. Leave the old zone's proxied DNS records in place, or the rule has no
   hostname to fire on.
   This is the step that closes the outage window on the old domain, so do it now
   rather than after the verification below.
7. **Settle the certificate question.** Watch whether Pages provisions a
   certificate for `jwlabs.ai`, and record the answer in the section above,
   replacing the "not known" wording with what actually happened. Until then
   assume Cloudflare's edge certificate is the only valid one and keep the clouds
   orange.

**Then verify — all of it, not a sample.**

8. **Every page must return 200 on the new domain.** The last two are
   store-required URLs that a reviewer can fetch at any time without warning:

   ```
   curl -so /dev/null -w '%{http_code}  %{url_effective}\n' \
     https://jwlabs.ai/ \
     https://jwlabs.ai/about/ \
     https://jwlabs.ai/services/ \
     https://jwlabs.ai/services/what-we-build/ \
     https://jwlabs.ai/services/how-we-work/ \
     https://jwlabs.ai/4a/ \
     https://jwlabs.ai/4a/features/ \
     https://jwlabs.ai/4a/getting-started/ \
     https://jwlabs.ai/4a/sample/ \
     https://jwlabs.ai/4a/library/ \
     https://jwlabs.ai/4a/your-data/ \
     https://jwlabs.ai/4a/faq/ \
     https://jwlabs.ai/4a/for-podcasters/ \
     https://jwlabs.ai/longlive/ \
     https://jwlabs.ai/status/ \
     https://jwlabs.ai/contact/ \
     https://jwlabs.ai/glossary/ \
     https://jwlabs.ai/security/ \
     https://jwlabs.ai/accessibility/ \
     https://jwlabs.ai/terms/ \
     https://jwlabs.ai/privacy/ \
     https://jwlabs.ai/style.css \
     https://jwlabs.ai/favicon.svg \
     https://jwlabs.ai/4a/privacy/ \
     https://jwlabs.ai/4a/support/
   ```

9. **The repository root must still be unserved.** All of these must be 404:

   ```
   curl -so /dev/null -w '%{http_code}\n' https://jwlabs.ai/README.md
   curl -so /dev/null -w '%{http_code}\n' https://jwlabs.ai/build.mjs
   curl -so /dev/null -w '%{http_code}\n' https://jwlabs.ai/build-md.mjs
   curl -so /dev/null -w '%{http_code}\n' https://jwlabs.ai/src/4a-privacy-policy.md
   ```

   The last one is the one that matters most: it is the faithful snapshot, with
   its `Status: DRAFT` banner and nine `TODO(founder)` notes intact, and it
   answered 200 once already. A cutover is exactly the kind of change during which
   somebody "fixes" the Pages source.

10. **No script, and the real address, on the served page** — the two things
    Cloudflare can break from outside the repository:

    ```
    curl -sS https://jwlabs.ai/ | grep -c '<script'                    # must be 0
    curl -sS https://jwlabs.ai/ | grep -o 'mailto:[^"]*' | sort -u     # help@jwlabs.ai only
    ```

    `[email protected]` in that output means Email Address Obfuscation is on
    for the new zone.

11. **The old domain forwards, with the path kept.** A bare-apex redirect that
    drops the path would turn every deep link into a home-page visit, which is
    worse than a 404 because nothing reports it:

    ```
    curl -sI https://jwlabs.dev/4a/privacy/ | head -n 3   # 301 -> https://jwlabs.ai/4a/privacy/
    curl -sI https://jwlabs.dev/4a/support/ | head -n 3   # 301 -> https://jwlabs.ai/4a/support/
    curl -sI https://jwlabs.dev/           | head -n 3    # 301 -> https://jwlabs.ai/
    ```

12. **Still served through the proxy, still reaching Pages behind it.** The
    response should carry `server: cloudflare` and a `CF-RAY`, with GitHub's
    `x-github-request-id` still present behind them. If the GitHub header is gone,
    Cloudflare is answering from somewhere that is not the origin.

13. **Send a test message to `help@jwlabs.ai` and confirm it arrives.** The
    published address **did** change at the cutover — `help@jwlabs.dev` →
    `help@jwlabs.ai` — onto Email Routing newly provisioned on a newly created
    zone. So this is the mailbox's first real delivery, not a re-check of a
    long-lived one, and DNS cannot stand in for it: Cloudflare publishes MX and
    reports a zone ready before a routing rule with a verified destination exists,
    and in that window mail is rejected or dropped. A silently dead contact address
    on a site whose purpose is to be contactable is the worst outcome available
    here. **Do not treat this step as a formality, and do not tick it from DNS.**

14. **Update the places that store the old URL.** App Store Connect and the Play
    Console each hold a privacy-policy URL and a support URL, and both are
    `jwlabs.dev/4a/...` today. The redirect keeps them working, but a store listing
    that resolves through a redirect is a listing that breaks the day somebody
    tidies up Cloudflare — change them to `jwlabs.ai` once step 8 is clean. Also
    re-check anything else that names the old domain outside this repository.

**What breaks at the moment of cutover, and for how long.**

- **`https://jwlabs.dev/…` stops being served the instant `main` carries the new
  `CNAME`.** GitHub 404s the old hostname because Pages has one custom domain and
  it is now the other one. That stays broken until the Cloudflare redirect rule in
  step 6 exists. The window is entirely under our control and should be minutes —
  it is the reason step 6 comes before all the verification.
- **`https://jwlabs.ai/…` works only after steps 1–4**, which is why they are
  before the merge and not after. Merging first turns a minutes-long window into a
  DNS-propagation-long one, on both domains at once.
- **The certificate for `jwlabs.ai` may lag** behind the DNS. Cloudflare's edge
  certificate should cover the domain from the moment the zone is active, so this
  should be invisible; if it is not, `.ai` gives a click-through warning rather
  than the unreachable site `.dev` would have given.
- **`help@jwlabs.ai` is newly provisioned, so it is the thing most worth testing.**
  Email Routing, MX and SPF exist on the `jwlabs.ai` zone and the published address
  now matches the site's domain — but this mailbox is new, not carried over, and
  DNS does not prove delivery. Step 13's test message is its first real exercise.
- **Do not delete the `jwlabs.dev` zone even so.** It carries the redirect rule,
  which is the only thing keeping stale `.dev` URLs alive — including the one on
  the Apple enrollment record — and it carries the `help@jwlabs.dev` alias, which
  documents already sent elsewhere still name. Deleting the zone takes out both in
  a single move.
- **The site publishes `help@jwlabs.ai`, on the same domain it is served from.**
  An earlier revision of this file called publishing a `.dev` address on a `.ai`
  site a deliberate mismatch, gated on Email Routing reaching the new zone. That
  gate has been met. Do not reintroduce the mismatch.

## The DNS both zones actually carry

**Read this before recreating either zone.** An earlier version of this section
listed only the `A` records and `www`, which is the website half. Rebuilding a zone
from that list would have silently destroyed `help@jwlabs.ai` — the address every
store listing and legal page points at — because nothing in the website's build or
tests can see a missing MX record.

Captured from the Cloudflare API, both zones, at the cutover:

```
jwlabs.ai                                        jwlabs.dev
  A      -> 185.199.108-111.153  proxied           A      -> 185.199.108-111.153  proxied
  CNAME  www -> jw-incorporated.github.io          CNAME  www -> jw-incorporated.github.io
  MX     route1/2/3.mx.cloudflare.net              MX     route1/2/3.mx.cloudflare.net
  TXT    v=spf1 include:_spf.mx.cloudflare.net     TXT    v=spf1 include:_spf.mx.cloudflare.net
  TXT    cf2024-1._domainkey (DKIM)                TXT    cf2024-1._domainkey (DKIM)
                                                   TXT    google-site-verification=...
```

Three things that are easy to get wrong:

1. **The MX and TXT records must NOT be proxied.** Cloudflare will not offer to, and
   a proxied MX does not deliver mail. Only the website records are orange.
2. **`jwlabs.dev`'s records must keep resolving.** Cloudflare can only redirect a
   hostname that resolves to it, so deleting the old zone's `A` records breaks the
   301 as thoroughly as deleting the redirect rule would. The old zone also still
   holds working mail for `help@jwlabs.dev`.
3. **The `google-site-verification` TXT exists only on `jwlabs.dev`.** Verification
   tokens are domain-specific, so it cannot be copied — `jwlabs.ai` needs its own
   from Search Console. This fails silently the day the old zone goes.

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

`docs/CNAME` claims the apex `jwlabs.ai`, and Pages allows exactly one custom
domain per repository, so that claim is exclusive: `jwlabs.dev` cannot be served
from here as well, which is why its forward is a Cloudflare rule and not a second
`CNAME` file.

The `jwlabs.ai` zone is on Cloudflare and points at GitHub Pages' four apex
addresses, plus a `www` alias:

```
A      @    185.199.108.153
A      @    185.199.109.153
A      @    185.199.110.153
A      @    185.199.111.153
CNAME  www  jw-incorporated.github.io
```

**The apex records are proxied — orange cloud — and must stay that way until
somebody has checked whether they still have to be.** This paragraph once said
the opposite and was stale: it described the state during certificate
provisioning, when the orange-cloud proxy was what prevented GitHub Pages from
completing its ACME challenge. That challenge never completed on `jwlabs.dev`
anyway, which is why the section above exists — Cloudflare became the only thing
presenting a valid certificate for that domain, so turning the clouds grey brought
back `ERR_CERT_COMMON_NAME_INVALID` on an HSTS-preloaded TLD, i.e. an unreachable
site. Verified served through the proxy on 2026-08-25 (`server: cloudflare`,
`CF-RAY` present, GitHub's `x-github-request-id` still on the response behind it)
— on the old domain. Whether GitHub issues for `jwlabs.ai` is a separate question
with a separate answer, and nobody has looked yet.

**The `jwlabs.dev` zone stays.** It keeps its DNS records, because a Cloudflare
redirect rule can only fire for a hostname that resolves to Cloudflare — so the
zone is what keeps every stale `.dev` URL in the wild working, including the one
on the Apple enrollment record. It keeps its MX records too, but **no longer
because the only mailbox is there**: Email Routing for `help@jwlabs.ai` is now
provisioned on the `jwlabs.ai` zone, and `help@jwlabs.ai` is the published
address. What the old zone's MX still serves is the `help@jwlabs.dev` alias,
which documents already sent elsewhere name.

**The conclusion does not depend on that reason, and has not changed: do not
delete the old zone.** Deleting it would take out the forward and the legacy
alias together.

**Nothing on this site depends on the custom domain.** Every path is relative
(`./`, `../`, `../../`), computed per page by `up()` in `build.mjs`, so the built
HTML is valid under any prefix — `https://jwlabs.ai/` or the Pages URL
`https://jw-incorporated.github.io/jwlabs.dev/`, whose `jwlabs.dev` is the
**repository** name and is correct. That portability is what made this cutover a
DNS-and-`CNAME` change rather than a content change.

One caveat, because this passage used to promise more than it can now deliver:
**the Pages URL is no longer a preview surface.** Measured 2026-08-25,
`https://jw-incorporated.github.io/jwlabs.dev/` returns **301 to
`http://jwlabs.ai/`** — Pages redirects to the configured custom domain. (To
`http://`, not `https://`: this repository has `https_enforced: false`.) So the
old claim that the site can be reviewed there the moment it is pushed, before DNS
propagates, is no longer testable as written. Review the built output locally
instead. The relative paths keep doing their real job regardless. Do not
"simplify" them to `/`-rooted paths — `build.mjs` asserts that no `href="/…"`
survives, and will fail the build if one does.
