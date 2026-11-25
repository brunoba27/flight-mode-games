# FLIGHT MODE GAMES

An offline-first PWA prototype for iPhone and Android.

## Files
- `index.html`, `app.js`, `styles` embedded in HTML
- `manifest.webmanifest`, `sw.js`, `icon.svg`
- `qrcode.min.js` (bundled QR generator)

## Hosting and installation
A PWA needs to be served from HTTPS (or localhost) to install and use its service worker. Upload the contents of this folder to an HTTPS static host before the trip. Open the URL once on each phone while online, then:
- iPhone: Safari → Share → Add to Home Screen.
- Android: Chrome → menu → Install app / Add to Home screen.

Open each game once before departure. Then test with Airplane Mode enabled and Wi-Fi/Bluetooth turned off. The app itself makes no network requests during gameplay and does not use radio APIs. It cannot control the phone's radios; follow crew instructions and airline policy.

## Important limitations
- No live multiplayer, shared live scoreboard, hotspot, Wi-Fi, Bluetooth or mobile data.
- Scores are stored only in the browser's local storage on each device.
- QR results are generated locally and can be scanned after landing. QR includes nickname, squad, score and number of games only.
- The sample trivia and colleague archetypes are generic placeholders. Replace them with company-approved questions before use.
- This is a prototype, not a certified airline application. Confirm any organised filming or device-use activity with the airline/crew.

## QR library
The app expects `qrcode.min.js` from the qrcode npm package (browser build). If the file is absent, QR generation will not work; JSON result export remains available.
