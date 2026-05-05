# UI Agent Guide

## Purpose

This module is the Angular frontend for Prkr. It provides the map, search, marker, and add-location flows for Sydney motorbike parking.

Use this file for agent-specific working notes. Use `README.md` for human-facing setup and overview details.

## Stack And Shape

- Angular 13
- TypeScript
- SCSS
- Bootstrap and ng-bootstrap
- Google Maps and Google Places integrations

Primary areas:

- App shell, map, and info components live under `src/app/app`
- Dashboard search flow lives under `src/app/module/dashboard`
- Location domain, services, marker logic, and add-location flow live under `src/app/module/location`
- Shared base classes and styles live under `src/app/common`
- Environment flags live under `src/environments`
- Static images and favicons live under `src/asset`

## Commands

Run commands from this `ui` directory.

```bash
npm install
npm start
npm run build
npm test
```

The dev server runs on `http://localhost:4200` by default.

## Agent Notes

- Preserve the existing Angular module and folder conventions.
- Keep UI changes consistent with the current component/template/style split.
- Prefer existing services and base classes before adding new shared abstractions.
- Be careful with Google Maps, Places autocomplete, geolocation, reverse geocoding, and directions behavior; these are core user flows.
- The backend URL currently lives in `src/app/module/location/service/LocationService.ts`.
- `proxy.config.json` and `proxy-prod.config.json` exist, but the current absolute backend URL means those proxy configs are not the active path for location API requests.
- The Google Maps API key is read from `GOOGLE_MAPS_API_KEY` in the shell environment or `ui/.env`; `npm start`, `npm run build`, and `npm run watch` generate ignored `src/index.generated.html` from `src/index.html`.
- Keep external service assumptions visible when changing map or search behavior.
