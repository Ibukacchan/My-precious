# THE REALMS — Fantasy Name Picker PWA

A GitHub Pages-ready, mobile-friendly fantasy name picker. All files are in the repository root; there are no extra folders.

## Included
- Four distinct realm themes: Elves, Hobbits, Dwarves, and Men
- Original illustrated SVG map embedded directly in `index.html`
- One combined pool or individual realm pools
- Add names individually or paste a list (one name per line)
- Random draw with animated Precious Ring-inspired fiery reveal
- Optional removal of chosen names
- Multi-name draws and a balanced group generator
- Draw history saved locally in the browser
- Background music in `background.wav`, with an on/off control
- Offline caching and installable PWA support

## Publish with GitHub Pages (Android-friendly)
1. Download and extract this ZIP on your device.
2. Open your GitHub repository in Chrome.
3. Choose **Add file → Upload files**.
4. Upload **all six files** from this ZIP directly into the repository's root (the same level as README.md). Do not upload the enclosing ZIP or create a folder.
5. Commit the changes to your `main` branch.
6. Open **Settings → Pages**. Choose **Deploy from a branch**, select `main` and `/ (root)`, then Save. If your repository is already configured for GitHub Actions, keep that workflow and use its existing Pages deployment setup.
7. Wait for the Pages deployment to finish, then open your published site over HTTPS.
8. On Android Chrome, use the browser menu → **Add to Home screen** (or the Install button if Chrome offers it).

## Music
`background.wav` is an original, gentle ambient loop included in the ZIP. Tap **Music off** in the header to start playback; browsers require a user tap before audio can begin. You can replace `background.wav` with your own WAV file, keeping exactly the same filename, or update the audio `src` in `index.html`.

## Saving and privacy
Names and draw history are stored in the current browser's local storage. No account or server database is used. Data does not automatically sync between devices or browsers. Clearing site data may erase saved names/history, so export or keep a separate copy of important lists.

## Notes
- The map and fantasy styling are original, Tolkien-inspired in broad high-fantasy atmosphere; this is not an official Middle-earth product and does not include official Tolkien maps or artwork.
- Google Fonts are used when internet access is available; system serif fallbacks remain available offline.
