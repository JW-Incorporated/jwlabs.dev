# Privacy by construction

Most privacy claims are promises: a company says it does not send your data
anywhere, and you have no way to check. [4a](/4a/)'s claims are mostly structural
instead — the browser blocks the request whether we meant it to or not — and this
note is about where that holds, and where it does not.

The second half matters more than the first. A privacy page that only lists the
good parts has taught you nothing about how careful its authors are.

## The policy

4a ships this Content Security Policy:

```
default-src 'none';
script-src 'self';
style-src 'self';
img-src 'self' https: data:;
media-src https:;
connect-src 'self' https://<our-database-host>;
manifest-src 'self';
base-uri 'none';
form-action 'none'
```

The load-bearing line is `connect-src`. **It names exactly two origins: the app's
own, and our database.** Any data-sending request of the kind an analytics beacon,
a crash reporter or a third-party API call requires is blocked by the browser
unless somebody changes the policy in code, in a public repository, in a commit
somebody has to review.

That is why the privacy claims are not merely promises. There is no advertising
code, no ad identifier, no analytics library, no crash reporter and no third-party
SDK of any kind in the app — and the policy is the reason that stays true after the
next feature lands, rather than for as long as everyone remembers.

## Where it leaks, precisely

To be exact rather than flattering: the same policy also allows `img-src https:`
and `media-src https:`, which is *any* HTTPS host.

That is not an oversight. It is exactly how episode audio and show artwork work,
and it means **the policy is not a total network seal. It is a tight bound on the
channel that would carry data out.** An image request can encode a small amount of
information in a URL. We do not do that, and unlike the `connect-src` claim, that
one you do have to take on trust.

`media-src` is scoped to `https:` rather than to a list because episode audio comes
from roughly forty-one different podcast content delivery networks that we neither
control nor can enumerate. Cleartext is rejected earlier, at feed ingest, where
`http` URLs are upgraded.

## The trade we made, stated as a trade

4a never rehosts, proxies or transforms podcast audio. Your device fetches each
episode straight from the publisher's own host.

The consequence is worth putting near the top rather than in a footnote. Because
that request goes directly to the publisher, **the publisher's host — and any
measurement or ad-attribution service the publisher has placed in front of their own
audio — sees your IP address and your user agent. We never do.** On a typical
episode that can be several intermediaries before the bytes arrive, and the app's
privacy policy names them.

The alternative would be to proxy audio through our own servers, which would hide
you from the publisher and expose your entire listening history to **us** instead.
We deliberately do not do that. From the policy itself:

> We think the trade is the right one, and you should know it is a trade.

## What the app keeps, and where

Most of what 4a knows about a listener never leaves the device. Topic interests,
play positions, listening history, playlists and settings are stored locally and are
not transmitted.

**Five kinds of event** are sent to our database, against an anonymous account
holding no name, no email address and no phone number, protected by row-level
security. There is no signup, no password and no profile.

Local storage is deliberately duplicated across two layers — the simple
key-value store and an IndexedDB database — for a reason that is a browser quirk
rather than an architectural preference: **Safari clears script-writable storage
after about seven days without a visit.** A listener who opens the app fortnightly
would otherwise lose their history to a cache policy.

There is also a playback diagnostics buffer, capped at 200 entries, which records
load times, stop points and failed control presses. It holds no audio, no URLs and
no account identifier, and **it is never transmitted.** It exists only so that a
listener can copy it into an email, because two playback faults were once reported
from a car with no measurements attached and there was nothing to diagnose them
with.

## Deletion that reports honestly

The in-app **Delete my data** control is the part of this we would most want
scrutinised, because deletion is where software most often lies by omission.

What it does, in order: it deletes the **server rows first**, because the token on
the device is the only thing that can reach them — delete the device first and the
rows become permanently unreachable orphans. Then it clears both local storage
layers and re-reads them to verify. If the server cannot be reached it says the rows
were not deleted and leaves the device alone so the listener can try again. **It will
not report success for something it did not do.**

It is equally exact about the three things it cannot reach:

- **The empty anonymous account row itself.** Removing that requires an
  administrative key, and an administrative key cannot ship inside a public web
  page. So what the button does instead is cut the link: the token is destroyed and
  the app starts a fresh anonymous account rather than re-attaching to the old one.
- **Anything a publisher and their measurement services already saw** when audio
  played. We never received it and cannot reach it.
- **Rows sent from a device whose storage was already cleared by hand.** Without
  that token those rows cannot be identified by the listener or by us. This is the
  reason to use the button rather than the browser's site-data screen.

## The policy document is pinned to the code

4a's [privacy policy](/4a/privacy/) is not written for marketing. It is written by
reading the shipped source, it lists every stored key, every transmitted field and
every host a device contacts, and **a test in the app's repository pins its claims
against that source** so the document cannot drift away from the software while
still passing continuous integration.

The version published here is converted from a snapshot of that file, word for word,
with the commit it came from printed on the page. Two things are removed at
publication and the page says which: a draft banner that is false once published,
and nine editorial notes addressed to the founder. Four of those notes asked for
facts that only exist *at* publication and are answered in the published section.
The other five are unresolved internal decisions — including a data-retention
period — and dropping them leaves the policy **silent** on those points rather than
wrong about them. The published section says outright that no retention period is
stated, and why: no retention job has been built, and a stated period we do not
enforce would be a false declaration in a store submission.

Silence is an omission. An invented number is a false statement. They are not the
same size of mistake.

## The same rule, applied to this website

The site you are reading holds the same line, and it is the reason there is no
cookie banner here.

**There is no `<script>` tag on any page of jwlabs.dev**, and nothing on any page is
fetched from another host — no web fonts, no hosted icons, no analytics, no
embedded anything. The build script that generates these pages asserts both on every
page it writes and **fails rather than publish** a page that breaks either rule. The
only subresources are one stylesheet and one favicon, from this domain.

That constraint has visible consequences we accepted rather than worked around.
There is no `font-src` in the app's policy, so web fonts are blocked outright, and
both the app and this site are set in system fonts. And the site is generated to
static HTML and committed, because there is no build server in the path — GitHub
Pages serves the branch.

[This site's own privacy notice](/privacy/) is short, and it is careful about the
one thing we cannot claim: our hosting providers do see request metadata, as every
web server does, and the content delivery network's dashboard shows aggregate
traffic counts for the domain whether we look at them or not. There is no
per-visitor record and no way for us to build one, and that is a different sentence
from "we collect nothing" — which would have been a slightly better sentence and a
slightly less true one.

## One thing the policy nearly broke, and one open risk

**A latent bug that only existed on iOS.** The native shell loads the app from a
custom scheme, `capacitor://localhost`, which WKWebView requires. Under
`img-src 'self' https: data:`, the app's own bundled icons matched neither `https:`
nor `data:` on that origin, and would have been blocked. Android's default origin
would never have shown it. This is the argument for launching a build rather than
only compiling it — a compiler cannot observe a policy violation.

**An open risk, unproven, recorded rather than assumed.** The Android shell injects
its native bridge as an *inline* script, and our `script-src` is `'self'` with no
`unsafe-inline` — which a policy delivered in a `<meta>` tag cannot fix with a
nonce. If it is blocked, the bridge object never exists and all four native plugins
are dead. iOS injects through a different mechanism and is probably exempt, so this
would be Android-only. It is filed as an open item, and the Android build has been
compiled but **never launched**, so nobody has observed the outcome either way.

That is the honest state of it: the policy is doing real work, we can prove the part
that matters most, and there is one place where it may be about to cost us a
platform.

---

*The policy, the deletion control and the storage layers are all in the public
[foray repository](https://github.com/JW-Incorporated/foray). The database host is
elided above only because it is a bare project identifier, not a secret; it appears
in the app's own source in full.*
