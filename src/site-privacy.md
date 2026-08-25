# Website privacy notice

**Effective August 25, 2026.** This notice covers **this website**, `jwlabs.dev`,
operated by {{ORG}}, {{ORG_FORM}}.

It does not cover the 4a app, which has its own, much longer and much more exact
policy: **[4a's privacy policy](/4a/privacy/)**. That document lists every key the
app stores on a device, every field it transmits and every host a device contacts,
and it is published from the same repository that builds the app so the two cannot
drift. If your question is about the app, that is the page you want.

longlive is not covered either. It has its own privacy policy at
[longlivets.com](https://longlivets.com/).

## The short version

This website is a set of static HTML files. **It sets no cookies, runs no
JavaScript, and has no analytics.** There is nothing here to log you in to,
nothing to fill in, and no third party embedded in any page.

## Why that is checkable rather than just claimed

You do not have to take our word for it, and neither does a browser extension.

- **There is no `<script>` tag on any page of this site.** Not a deferred one, not
  an inline one, not one from a content delivery network. The build script that
  generates these pages *fails* if a script tag appears in its output, and it
  fails again if any element on a page would fetch anything from another host.
- **Nothing on a page is loaded from another origin.** No web fonts, no hosted
  icons, no tracking pixel, no embedded video. The only things a page pulls are
  one stylesheet and one favicon, both from this domain. Every external URL on
  this site is an ordinary link you have to choose to follow.
- **Therefore there is no consent banner**, because there is nothing to consent
  to. A cookie notice on this site would be theatre.

The reason for that discipline is not privacy marketing: 4a ships a strict Content
Security Policy that blocks remote scripts and fonts, and this site holds the same
line so the two cannot drift into different rules. Privacy is the side effect, and
we will take it.

## What our hosting providers see

We do not have a server. This site is served as static files by **GitHub Pages**,
with **Cloudflare** in front of it terminating TLS. Cloudflare is not optional
here — GitHub never issued a certificate for this domain, so Cloudflare is what
makes `https://jwlabs.dev` reachable at all.

Like every web server on the internet, those two receive what your browser sends
in order to answer the request: your IP address, your user agent, the page you
asked for, the time, and a referrer if your browser sent one. They are our
service providers, they process that data to deliver and secure the site, and
their own privacy terms apply to their handling of it.

To be precise about our own access rather than flattering:

- **We have no per-visitor record and no way to build one.** There is no analytics
  script, no cookie, no identifier and no log we retain or query.
- **Cloudflare's dashboard does show the account aggregate traffic counts for this
  domain** — requests, bandwidth, cached-versus-uncached, rough geography — the
  way it does for any zone. That is a count, not a profile, and it exists whether
  we look at it or not. We are telling you because "we collect nothing" would be
  a slightly better sentence and a slightly less true one.

## If you email us

If you write to [{{MAIL}}](mailto:{{MAIL}}), we hold your message and your email
address, because that is what having a mailbox means. We use it to answer you and
to keep a record of the correspondence. We do not add you to a mailing list —
there is no mailing list — and we do not sell, rent or share it. Ask us to delete
a thread and we will.

## What we do not do

- No advertising, and no advertising network, on this site.
- No selling or sharing of personal information. There is nothing to sell.
- No behavioural profiling, no cross-site tracking, no fingerprinting.
- No forms. There is nowhere on this site to type anything.
- No accounts, and no passwords.

## Children

This website is a company and product site, not a service aimed at children, and
it collects nothing from anybody. We do not knowingly collect personal
information from children.

## Where the company is, and how to reach us about privacy

{{ORG}} is {{ORG_FORM}}. Any question, request or complaint about privacy —
including anything about the 4a app that its own policy does not answer — goes to
[{{MAIL}}](mailto:{{MAIL}}) and is read by a person. To delete data 4a holds, use
the control **inside the app**; §7 of [its policy](/4a/privacy/) explains why that
reaches more than an email can.

## Changes

If this notice changes, the effective date at the top changes with it, and this
website's public source repository records what changed and when.

## What this document is, and is not

It was written in-house rather than by a lawyer, and it is accurate about what
this website does — the claims in "why that is checkable" are enforced by the
build, not by good intentions. **It has not had legal review**, and it does not
state a position on any particular privacy regime, because doing so would be
asserting the outcome of a review nobody has done. Where we have nothing
supportable to say, this page says nothing rather than reaching for boilerplate;
that is the same standard [4a's policy](/4a/privacy/) holds itself to, and it is
why that document declines to state a data-retention period it does not enforce.
