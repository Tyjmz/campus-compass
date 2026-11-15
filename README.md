# Campus Compass

Find your way through hills and stairs.

## Setup

Install Node.js 20.19.4 or newer and npm. Then run:

```sh
npm install
npm start
```

Open the project in Expo Go on a device using the QR code, or use `npm run android`, `npm run ios` (macOS with Xcode), or `npm run web` for a local emulator or browser. The device and development machine should be on the same network.

## Prototype limitations and privacy

- The building names in `App.tsx` are illustrative samples, not verified campus data. The destination and route option arrays are placeholders intended to be replaced when data access and permissions are confirmed.
- The map is a placeholder. No map provider, CPH map data, route calculation, or verified directions are included. Do not rely on this prototype for navigation or accessibility decisions.
- No account is needed. The app requests foreground location permission only after a destination is selected and **Start Route** is tapped. It does not retrieve or save your location or location history.
- The app makes no network requests and contains no API keys. Expo's development tools may use the network to serve the app.
