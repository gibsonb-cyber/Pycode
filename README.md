# PyCode - Python Coding App for iPhone

A mobile-friendly Progressive Web App (PWA) that lets you write and run Python code right on your iPhone.

## Features
- Dark mode code editor with Python syntax highlighting
- Run Python code on your device (using Pyodide)
- Save and load multiple files/projects
- Console output
- Built-in examples
- Basic file explorer
- Works offline after first load (once cached)

## How to Use on Your iPhone

### Option 1: Easiest - Host it for free (Recommended)

1. Go to [GitHub](https://github.com) and create a free account if you don't have one.
2. Create a new repository named `pycode`.
3. Upload all these files:
   - `index.html`
   - `style.css`
   - `script.js`
   - `manifest.json`
   - `icon-192.png`
   - `icon-512.png`
4. Go to Settings → Pages → Deploy from branch (main) → Save.
5. Wait 1-2 minutes, then visit `https://yourusername.github.io/pycode/`
6. On your iPhone, open that link in Safari.
7. Tap the Share button → **Add to Home Screen**.
8. Now you have a real app icon that opens full-screen!

### Option 2: Test locally
If you have a computer, you can serve the files with any simple web server and open the address on your phone (same WiFi).

## What's Next?
This is a fully working app. You can:
- Customize the colors and layout in `style.css`
- Add more examples in `script.js`
- Later, wrap this in Capacitor to publish on the App Store (requires a Mac)

## Notes
- First launch downloads Python (~10-20MB). After that it's faster.
- Internet is needed the first time to load Pyodide.
- Your code is saved only on your device (localStorage).

Enjoy coding!
