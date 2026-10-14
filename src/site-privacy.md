# Website privacy notice

**Effective October 14, 2026.** This notice covers **this website**, `jwlabs.ai`,
operated by {{ORG}}, {{ORG_FORM}}.

It does not cover the 4a app, which has its own, much longer and much more exact
policy: **[4a's privacy policy](/4a/privacy/)**. That document lists every key the
app stores on a device, every field it transmits and every host a device contacts,
and it is published from the same repository that builds the app so the two cannot
drift. If your question is about the app, that is the page you want.

longlive is not covered either. It has its own privacy policy at
[longlivets.com](https://longlivets.com/).

## The short version

This website is a set of static HTML files, plus one small application: the
signup and subscription pages for [The Daily Brief](#the-daily-brief), under
`/dailybrief/`. **It sets no cookies, runs no JavaScript, and has no analytics** —
the Daily Brief pages included. There is nothing here to log you in to, and no
third party embedded in any page. The only thing to fill in is the Daily Brief
signup form, and the section about it below says exactly what happens to what you
type.

## Why that is checkable rather than just claimed

You do not have to take our word for it, and neither does a browser extension.

- **There is no `<script>` tag on any page of this site.** Not a deferred one, not
  an inline one, not one from a content delivery network. The build script that
  generates these pages *fails* if a script tag appears in its output, and it
  fails again if any element on a page would fetch anything from another host.
  The Daily Brief pages under `/dailybrief/` are not made by that build — a
  Cloudflare Worker generates them — and they hold the same line: no script, no
  cookie, and nothing from another origin. For those pages that is a statement
  about how the Worker is written, and you can check it in your browser.
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

This site is served as static files by **GitHub Pages**, with **Cloudflare** in
front of it terminating TLS. Cloudflare is not incidental here — it is the edge
that answers `https://jwlabs.ai`, so it sees every request before GitHub does.
The one exception is `/dailybrief/`: those pages are answered by a **Cloudflare
Worker** — a small program running on Cloudflare — and never reach GitHub at all,
so GitHub does not see those requests.

Like every web server on the internet, those two receive what your browser sends
in order to answer the request: your IP address, your user agent, the page you
asked for, the time, and a referrer if your browser sent one. They are our
service providers, they process that data to deliver and secure the site, and
their own privacy terms apply to their handling of it.

To be precise about our own access rather than flattering:

- **We have no per-visitor record and no way to build one.** There is no analytics
  script, no cookie, no identifier and no log we retain or query. The one record
  we do keep is about Daily Brief subscribers, not visitors, and it is described
  in full [below](#the-daily-brief).
- **Cloudflare's dashboard does show the account aggregate traffic counts for this
  domain** — requests, bandwidth, cached-versus-uncached, rough geography — the
  way it does for any zone. That is a count, not a profile, and it exists whether
  we look at it or not. We are telling you because "we collect nothing" would be
  a slightly better sentence and a slightly less true one.

## If you email us

If you write to [{{MAIL}}](mailto:{{MAIL}}), we hold your message and your email
address, because that is what having a mailbox means. We use it to answer you and
to keep a record of the correspondence. We do not add you to a mailing list —
the only list we keep is [The Daily Brief](#the-daily-brief)'s, and you are on it
only if you sign up yourself — and we do not sell, rent or share it. Ask us to
delete a thread and we will.

## The Daily Brief

[The Daily Brief](https://jwlabs.ai/dailybrief/) is a free weekday morning news
email. Signing up for it is the one thing on this website that collects personal
information, so this section says exactly what, where it is kept, and for how long.

**What we keep.** When you sign up we store:

- your **email address**, as you typed it and in a normalised form so the same
  address cannot sign up twice;
- the **city you typed**, and the **place it resolved to** — its name, region,
  country, coordinates and time zone — which decides the local news and weather
  in your copy;
- a **one-way hash of your IP address**, mixed with a value that changes every
  day so it cannot be reversed into the address or matched across days. It is
  used only to limit how many signups can come from one place, which is how we
  keep the form from being abused;
- the **status** of your subscription (waiting for confirmation, or active) and
  when each of those happened;
- a **hash of the private link** in the footer of every issue, so that link can
  find your subscription without the link itself being stored;
- a **send record** for each issue: the date, whether it was sent, and the
  delivery service's message reference or error.

Nothing else. No name, no age, no tracking pixel in the email, no record of
whether or when you open it, and no record of which links you click.

**Where it is kept.** In a **Cloudflare D1** database that we operate, and —
your email address only — in the **destination address list of Cloudflare Email
Routing**, the service that delivers the email. Cloudflare is a US-based provider
acting for us, and its own privacy terms apply to its handling of that data.

**Who sends the confirmation.** Cloudflare only delivers our mail to an address
that has confirmed it wants it, so when you sign up **Cloudflare sends you a
verification email**, not us. Your subscription starts when you click Verify in
it; until then nothing else is sent to you.

**Who else sees what.** To turn the city you typed into a place, that text — not
your email address — is looked up with Open-Meteo's geocoding service; for a place
in the United States its coordinates are also looked up with the National Weather
Service. Each issue's local news and weather are prepared per place, not per
person, from a list of places that contains no email addresses. Your email address
goes only to Cloudflare, to deliver the email.

**How long.**

- A signup that is **never verified is deleted after 7 days**, from our database
  and from Cloudflare's list.
- When you **unsubscribe**, your address is removed from Cloudflare's list and your
  record, including its send records, is deleted.
- Otherwise we keep your record for as long as you are subscribed.

**No sharing.** We do not sell, rent, share or disclose your email address or
your place to anyone, and we use them for nothing except sending you The Daily
Brief and answering mail you send us. The brief carries no advertising.

**How to stop it, or have it deleted.** Every issue has an unsubscribe link and a
link to manage your subscription, where you can also change your city.
Unsubscribing takes one click and deletes your record as described above. Or write
to [{{MAIL}}](mailto:{{MAIL}}) and we will do it for you.

## What we do not do

- No advertising, and no advertising network, on this site.
- No selling or sharing of personal information. There is nothing to sell.
- No behavioural profiling, no cross-site tracking, no fingerprinting.
- No forms, except the Daily Brief signup at `/dailybrief/`, which is a small
  application served by Cloudflare rather than a static page. There is nowhere
  else on this site to type anything.
- No accounts, and no passwords.

## Children

This website is a company and product site, not a service aimed at children, and
apart from a Daily Brief signup it collects nothing from anybody. We do not
knowingly collect personal information from children.

## Where the company is, and how to reach us about privacy

{{ORG}} is {{ORG_FORM}}. Any question, request or complaint about privacy —
including anything about the 4a app that its own policy does not answer — goes to
[{{MAIL}}](mailto:{{MAIL}}). To delete data 4a holds, use
the control **inside the app**; §7 of [its policy](/4a/privacy/) explains why that
reaches more than an email can.

## Changes

If this notice changes, the effective date at the top changes with it, and this
website's public source repository records what changed and when.

## What this document is, and is not

It was written by the people who built this site, and it is accurate about what
this website does — the claims in "why that is checkable" are enforced by the
build, not by good intentions. **It has not had legal review**, and it does not
state a position on any particular privacy regime, because doing so would be
asserting the outcome of a review nobody has done. Where we have nothing
supportable to say, this page says nothing rather than reaching for boilerplate;
that is the same standard [4a's policy](/4a/privacy/) holds itself to, and it is
why that document declines to state a data-retention period it does not enforce.
