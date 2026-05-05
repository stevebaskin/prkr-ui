# UI

## Overview

This module is the Angular frontend for Prkr. It provides a Sydney motorbike parking map with search, location details, and add-location flows, and it relies on Google Maps and Google Places for core functionality.

## Stack

- Angular 13
- TypeScript
- SCSS
- Bootstrap
- `@ng-bootstrap/ng-bootstrap`
- `@angular/google-maps`
- `ngx-google-places-autocomplete`

## Project Layout

- `src/app/app`: app shell, map, and info components
- `src/app/module/dashboard`: landing page and address search flow
- `src/app/module/location`: location domain model, add page, and location service
- `src/app/module/core/service/ApiService.ts`: shared HTTP wrapper
- `src/environments`: Angular environment flags
- `proxy.config.json` and `proxy-prod.config.json`: Angular dev-server proxy configuration

## Local Development Prerequisites

- Node.js and npm
- Installed dependencies via `npm install`
- A browser with geolocation support
- Internet access for Google Maps JavaScript and Places APIs

## Running Locally

```bash
npm install
cp .env.example .env
npm start
```

Set `GOOGLE_MAPS_API_KEY` in `.env` before starting the app.

The development server runs on `http://localhost:4200` by default.

## Backend API Expectations

The frontend currently uses a hardcoded backend base URL in `src/app/module/location/service/LocationService.ts`:

- `http://localhost:8080/api/locations`

`proxy.config.json` and `proxy-prod.config.json` exist for Angular dev-server proxying, but the current service implementation uses an absolute URL, so those proxy settings are not the active path for location API requests.

Local UI development therefore expects the API to be running on `http://localhost:8080`.

## External Services

`src/index.html` currently loads:

- Google Maps JavaScript API with the Places library
- Google Analytics via `gtag`

The Google Maps API key is expected as `GOOGLE_MAPS_API_KEY` in `.env` or the shell environment. `npm start`, `npm run build`, and `npm run watch` generate `src/index.generated.html` from `src/index.html` and inject that value into the `__GOOGLE_MAPS_API_KEY__` placeholder. Do not commit real Google API keys to this repository.

Map rendering, Places autocomplete, reverse geocoding, and Google Maps directions all depend on those external services being available.

## Key User Flows

- Browse parking locations on the map
- Search by address using Places autocomplete
- Show the user’s current location on the map
- Add a new parking location by clicking the map or using geolocation, then submit it to the API
- Open Google Maps directions for a selected parking marker

## Build And Test

```bash
npm run build
npm test
```

## Known Implementation Notes

- Geolocation is used in both the map flow and the add-location flow
- The add-location page falls back to Sydney coordinates before geolocation resolves
- Address search is restricted to Australia through the Places autocomplete options
