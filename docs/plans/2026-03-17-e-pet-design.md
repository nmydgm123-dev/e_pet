# e_pet Electron Bootstrap Design

## Summary
Create the minimal Electron bootstrap for the e_pet desktop pet app so it can run with `npm start`. The scope includes:
- `main.js` that creates a `BrowserWindow` and loads `index.html`.
- A minimal `index.html` UI.
- `package.json` configured with `"main": "main.js"` and `"scripts": { "start": "electron ." }`.

No preload script, auto-reload, or extra tooling at this stage.

## Architecture
- Single main process entry at `main.js`.
- The main process creates a single `BrowserWindow` and loads the local `index.html`.

## Components / Files
- `main.js`: Electron main process entry.
- `index.html`: simple render UI.
- `package.json`: entry point and start script.

## Data Flow
App start -> main process -> create window -> load `index.html`.

## Error Handling
Minimal handling:
- Quit the app when all windows are closed.
- Re-create window on macOS `activate` when no windows exist.

## Testing / Validation
Manual validation:
- `npm start` launches a window successfully.

## Non-Goals
- No preload script.
- No IPC.
- No auto-reload or dev tooling.
- No advanced window management.
