# Delete your 4a data

Everything 4a knows about you can be deleted from inside the app, in one action,
without an account and without asking anyone. This page exists because the app
stores are entitled to a public description of that, and because you are entitled
to know exactly what it does and does not reach.

## The control

Open **4a**, open the menu (**☰**), choose **Delete my data**, and confirm by
typing `DELETE`. Confirmation is typed rather than tapped so a stray touch cannot
trigger it.

There is also a **device-only** option, if you want the phone cleared without
touching anything held on the server.

## What it deletes

**On your device.** Every key 4a has written, across both of its storage layers.
The list is read from the storage layers themselves rather than from a list in
the code, and re-read afterwards to confirm the keys are gone — so a key added by
a future version is still deleted by an older description of this control.

**On the server.** Every row belonging to your anonymous identity: first the
events, then the account record. These are authenticated deletions filtered to
your own identity.

**In what order, and what happens if it fails.** The server is cleared first. If
that fails, the run stops, your device is left untouched, and the app tells you
the rows were **not** deleted. It will not report a success it did not achieve.

## What it cannot reach, stated plainly

**An empty account shell.** Removing the underlying authentication record needs
an administrative key that cannot safely ship inside a public app. What remains
holds no name, no email address, no phone number and no password — its data and
its events are gone, and your device discards its token, so the next thing you do
in 4a creates a new anonymous identity with no link to the old one.

**What podcast publishers already saw.** 4a plays audio directly from the
publisher's own servers, exactly as any podcast app does. Those requests reach
the publisher, not us, and we cannot delete records we never held. Deleting your
4a data does not and cannot undo that.

## If the app will not open

Write to [{{MAIL}}](mailto:{{MAIL}}) and say you want your data deleted. There is
no account to verify, so tell us anything you can that identifies the data — when
you used the app, roughly, and on what kind of device.

## What 4a holds in the first place

Less than most apps, and the [privacy policy](/4a/privacy/) is specific about it:
no name, no email address, no phone number, no location, no advertising
identifier, no crash reporting, no analytics product. Most of what 4a knows never
leaves your phone at all.
