# Accessibility

This page says what we have actually done about accessibility, what we have
measured, and what we have not tested. The last part is the reason the page is
worth reading: an accessibility statement that lists only strengths is marketing,
and a conformance claim nobody has verified is worse than no claim at all.

**If something on this site or in [4a](/4a/) is unusable for you, write to
[{{MAIL}}](mailto:{{MAIL}}).** Tell us what you were trying to do and what
assistive technology you use if you are comfortable saying. That address reaches a
person who can change the code.

## What this website is, structurally

Most of the accessibility of this site is a consequence of decisions taken for
other reasons, which is the best kind.

**There is no JavaScript on any page.** Not deferred, not inline, not bundled: the
build refuses to publish a page that contains a script tag. So nothing on this site
can fail to initialise, nothing depends on a framework
hydrating, no content appears after a delay, and no interactive control is a
`<div>` pretending to be a button. Every page is HTML that is complete the moment
it arrives.

**There is nothing to dismiss.** No cookie banner, because
[no cookie is set](/privacy/). No newsletter interstitial, no chat widget, no
consent modal, no notification prompt. Nothing takes focus away from where you put
it.

**There are no images**, other than a small icon in the browser tab. Every page is
text, headings, lists, tables and links. That is partly an accessibility outcome
and mostly a consequence of the same rule: an image would have to be hosted here,
and a decorative one would be weight for nothing.

**No animation and no motion**, anywhere. There is nothing that moves, nothing
that autoplays, nothing that scrolls on its own. We do not honour a
reduced-motion preference so much as have nothing to reduce.

## The specifics

| | |
|---|---|
| Language | `<html lang="en">` on every page. |
| Landmarks | A real `<header>`, `<nav>`, `<main>` and `<footer>` per page. One `<main>`, one `<h1>`, headings in order without skipped levels. |
| Skip link | First focusable element on every page, jumping to `#main`. It is positioned off-screen rather than `display: none`, deliberately — `display: none` removes it from the tab order and defeats the point. |
| Focus | A visible 2px outline with an offset on every focusable element, via `:focus-visible`. The browser default is not relied on. |
| Current page | The active navigation item carries `aria-current="page"` **and** is distinguished by weight and an underline — never by colour alone. |
| Text sizing | Everything is in relative units. Text scales with the browser's own font-size setting, and `text-size-adjust` is pinned so mobile browsers do not silently re-scale it. |
| Reflow | One column, one measure, no fixed-width layout. Long unbroken strings wrap rather than force a horizontal scrollbar. |
| Wide content | Tables and code blocks scroll **inside their own container**, so a wide table never makes the whole page scroll sideways. |
| Light and dark | The colour scheme follows the operating system, and an explicit theme choice overrides it in both directions. Both themes are defined; neither is an afterthought applied on top of the other. |
| Semantics | Tables use `<thead>`, `<th>` and real header cells. Nothing uses a table for layout. |

## Contrast, measured

Every text-and-background pair used on this site, in both themes, with the
contrast ratio computed from the actual hex values in the stylesheet:

| Pair | Light | Dark |
|---|---|---|
| Body text on page background | 16.82 : 1 | 15.25 : 1 |
| Body text on a card | 15.52 : 1 | 14.19 : 1 |
| Links on page background | 7.98 : 1 | 8.56 : 1 |
| Links on a card | 7.36 : 1 | 7.96 : 1 |
| Secondary text on page background | 6.49 : 1 | 7.12 : 1 |
| Secondary text on a card | 5.98 : 1 | 6.62 : 1 |

**Measured**, by computing relative luminance from the stylesheet's own values.
The lowest pair on the site is **5.98 : 1**, which is above the 4.5 : 1 threshold
normally applied to body text. Four of the twelve pairs fall below 7 : 1, so **we
do not claim the stricter enhanced level** — the secondary-text colour is the one
that would have to change, and we would rather publish the number than adjust the
claim.

## What has not been tested

- **No formal audit against any accessibility standard has been performed**, by us
  or by anyone else. There is no conformance report and no accessibility
  conformance statement, and this page is not one.
- **No screen-reader testing beyond spot checks.** The structure is built to be
  navigable by landmark and heading, and that is a design intent rather than a
  verified result. If you use a screen reader and something here is wrong, you
  will know before we do.
- **No testing with voice control, switch access, or a screen magnifier.**
- **Zoom and reflow are untested at specific thresholds.** The layout is a single
  column in relative units, which is the shape that reflows well; we have not
  verified it at the particular viewport width and zoom level the guidelines
  specify.

## 4a

[4a](/4a/) is a different and harder case, and we are not going to blur the two.

The web app is the shipping version. It is early software, it has an audio player
and interactive controls, and **its accessibility has not been audited or tested
with assistive technology.** We are not going to describe it as accessible on the
strength of the website's properties, because they are different codebases with
different problems — a static document with no script is an easy case and a media
player is one of the hardest.

Two things we can say without testing, because they are structural:

- **Nothing in 4a is gated behind an account**, a signup, a password, an email
  verification or a CAPTCHA. There is no sign-in flow to fail at.
  [What 4a knows about you](/4a/your-data/) explains why.
- **There is no infinite scroll, no autoplay chain, no streak and no notification
  bait**, and that is a product principle rather than a current state. Those
  patterns are hostile to everybody, and disproportionately so to anyone using a
  screen reader or a switch.

If you use 4a with assistive technology, a report to [{{MAIL}}](mailto:{{MAIL}})
is worth more to us than most feature requests, and we will say so honestly if a
fix is going to take a while.

## Why the honest version

We could have written a page claiming conformance with a standard nobody here has
tested against. It would have read better and it would have been a false statement
about a review that has not happened — the same reason
[the privacy notice](/privacy/) records what it cannot claim instead of claiming
it, and the same reason [one page](/status/) lists what is built and what is not.

A person who needs this page to be accurate is not helped by it being flattering.
