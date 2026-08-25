# Security and responsible disclosure

If you have found a security problem in anything {{ORG}} runs, we would like to
hear about it, and this page is how.

**Report it to [{{MAIL}}](mailto:{{MAIL}}).** Put `security` somewhere in the
subject line. A report goes straight to the people who can change the code, and
[what we can and cannot promise](#what-we-promise-and-what-we-do-not) is set out
below.

There is **no bug bounty and no payment.** We would rather run no programme than one
we could not honour. We will credit you by name or handle if you want that and are
happy to be told not to.

## What to include

The same things that make [any report](/contact/) actionable, plus the specifics:

- **What you found, and what an attacker could do with it.** The impact matters
  more than the mechanism, because it decides the order things get fixed in.
- **How to reproduce it.** A URL, a request, a sequence of steps. If it needs a
  specific browser or device, say which.
- **Whether you have told anyone else**, and whether you intend to publish. We
  will not ask you to stay quiet indefinitely; we would like to know the clock we
  are on.

Please do not send us the output of an automated scanner with no analysis. We will
read it, but a list of missing headers on a static site with no script and no
cookies tells us nothing.

## In scope

- **`jwlabs.dev`** — this website.
- **[4a](/4a/)** — the deployed web app, and the native shells for iOS and
  Android. Neither shell is in a store; both are built from the same code as the
  web app, so a finding in one is usually a finding in all three.
- **[longlive](/longlive/)** — reports can come to the same address and we will
  route them. Anything specific to that timeline's own content or corrections
  belongs on its own site.
- **The public repositories** the products are built from.

## Out of scope, and where those reports should go instead

These are not ours to fix, and reporting them to us wastes your time:

- **Podcast publishers' own servers, CDNs and audio hosts.** 4a plays audio
  straight from a publisher's own host and never proxies it, so those hosts —
  and any measurement service a publisher has put in front of their own files —
  are outside anything we control.
  [The privacy policy](/4a/privacy/) is exact about who they are.
- **Our hosting and DNS providers' own infrastructure.** A vulnerability in a
  static-site host or a CDN should go to that vendor, who runs a disclosure
  programme and can actually fix it. If the *configuration* is ours and it is
  wrong, that is in scope.
- **Missing hardening headers with no demonstrated impact on a site that runs no
  script and sets no cookie.** If you can show impact, that is a finding and we
  want it. If the claim is that the header is absent, we already know.
- **Social engineering, physical access, and anything requiring us to be phished.**

## What is structural rather than promised

This section exists because the useful thing to tell a security researcher is not
what we intend, it is what the design makes impossible. Each of these is checkable
and most of them are enforced by something that fails a build.

**This website has no script at all.** No inline script, no bundled script, no
analytics, no tag manager, no remote font, no remote image, no cookie, and no login
anywhere on it. A link you choose to follow is the only thing on any page that names
another host. That is checked mechanically on every build rather than reviewed by
eye, and a page that broke the rule would not be published.

**4a talks to a very short list of origins, and the browser enforces it.** Its
Content Security Policy is short enough to print, which is what makes "there is no
third-party code in here" a property of the software rather than a promise in a
document.

**No third-party SDKs in 4a.** No advertising code, no ad identifier, no analytics
library, no crash reporter. None, rather than few.

**The public client key is public by design.** 4a's browser code carries the
publishable key for its database, as every client-side application of that shape
does. The control that actually matters is the per-row access rule on the database
side — and those rules are **written to specification and not yet verified against
the live project.** We are telling you that because it is true, because
[the status page says the same thing](/status/#written-and-not-yet-verified), and
because it is the most likely place for a real finding.

**Nothing collected that a listener did not send.** Most of what 4a knows stays on
the device. Five kinds of event reach our database, against an anonymous account
holding no name, email or phone number, so there is no identity store to breach
into a person.

**The build automation is keyless.** The pipeline that refreshes content holds no
credentials. That is a standing constraint rather than a happy accident, and it
means there is no long-lived secret in that path to steal.

## What we do not have

Stated plainly, because a security page that lists only strengths is not
information.

- **No external penetration test or security audit has been performed** on this
  website, on 4a, or on the repositories. Not "we are between audits" — none has
  happened.
- **No formal vulnerability disclosure programme, no service-level agreement, and
  no PGP key.** One email address, and a direct route from a report to a fix.
- **No third-party compliance attestation of any kind**, and we do not claim to
  comply with any particular framework. The same rule applies to privacy: see
  [the website privacy notice](/privacy/) and
  [the 4a privacy policy](/4a/privacy/), both of which record what they cannot claim
  rather than claiming it, and [what is not decided yet](/status/).

## What we promise, and what we do not

**We will:** read your report, tell you whether we can reproduce it, tell you what
we intend to do about it and roughly when, and tell you when it is fixed. If we
decide not to fix something, we will say that instead of going quiet.

**We will not:** dispute a finding to avoid fixing it, or ask you to sign anything
before we will read your email.

**On legal risk to you:** we have no interest in pursuing anyone who reports a
problem to us in good faith, and we will not. That is a statement of intent from
the company, and it is deliberately not dressed up as a legal safe harbour —
we are engineers rather than lawyers, [our terms](/terms/) say as much, and a
paragraph of pseudo-legal comfort language we could not stand behind would be worth
less to you than this sentence.

What "good faith" means here is the ordinary thing: work against your own account
and your own data, do not degrade the service for anyone else, do not access
another person's data — and if you accidentally do, stop and tell us — and give us
a chance to fix it before publishing.
