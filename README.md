# KIT website

The website for KIT, your personal keep in touch kit: tell KIT who you spoke to and what happens next, and it updates their record, books the follow-up and emails you when it's time to reach out.

- **Live site:** https://hi-kit.co.uk/
- **Hosting:** IONOS (Apache), files served from the `/Hi-Kit` folder.
- **How it's built:** plain hand-coded HTML, CSS and JavaScript. No build step.

Forms: early access sign-ups go to a Google Sheet through a Google Apps Script web app, and contact messages are sent by Web3Forms (`form.js`). The `.htaccess` file only redirects http to https, and only works on Apache hosting.
