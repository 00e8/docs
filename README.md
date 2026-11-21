# vanilla Discord bot site

This static site uses the Kayo reference layout and the 29 PNG icons you supplied.

## Project structure

- `assets/css/`: page stylesheets.
- `assets/js/`: command catalog and page scripts.
- `assets/images/`: favicon and site images.
- HTML pages and `vercel.json` stay in the project root so static hosting routes remain simple.

## Pages

- `index.html`: animated bot introduction, feature cards, and music section.
- `commands.html`: category sidebar, live search, expandable command rows, and copy controls.
- `docs.html`: setup guide, command types, prefix configuration, music help, and troubleshooting.
- `terms.html` and `privacy.html`: bot terms and privacy information.

Open `index.html` in a modern browser to start. Use the top menu to set the bot's text prefix; it is stored only in that browser. Category cards on the home page open the matching section in the command library.

The command catalog is derived from command modules loaded by the bot: 310 top-level command names and their subcommands produce 521 unique usable entries. It excludes internal helper files and expands grouped commands into their full routes (for example, `ignore bypass add`). The command page shows 40 matching entries per page, with one command detail open at a time to keep the page responsive. The site has no Discord connection and does not include bot credentials. Google Fonts load when internet access is available; system fonts are used otherwise. The animated pages respect reduced-motion preferences.

## Security and hosting

This is a static site. `vercel.json` configures a strict Content Security Policy and browser security headers for Vercel. Vercel provides HTTPS for hosted deployments; use the HTTPS URL and verify the custom domain’s certificate before sharing it. HTTPS encrypts traffic between visitors and the host. JavaScript obfuscation would not add that encryption, so never put bot tokens or private keys in these public files.

The configured policy permits only this site’s scripts, local images, and the Google Fonts stylesheet/font hosts used by the pages. If you remove Google Fonts or add another external service, update the policy to match that specific resource.
