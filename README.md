# imgurcakeday

Just because imgur.com's account view only shows month and year, not day.  So I decided to fix it with a little Node.js magic.

Okay, a little bit more explanation: imgur.com is a picture-sharing community that supports uploading individual pictures,
albums, and commenting (including a nested reply system).  The front page of the site is voted by users voting on pictures and
some algorithmic magic that lets popularity decay over time.  On the site, a user's "cake day" is the anniversary of their signing
up for a user account.  imgur.com's account view will show the month and year that a user signed up, but does NOT show the full
date.  Since the operators of imgur.com have been kind enough to expose an API that included information on account creation, I
decided to whip up something in Node.js that would get the full account creation date and display it to users.
