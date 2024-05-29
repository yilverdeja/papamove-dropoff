# Papamove Dropoff App

This is a web application that allows users to submit addresses of 1 pickup point and drop-off point. It displays the waypoints returned from the backend.

## Features

### Submit addresses

Users can submit pickup and drop-off point addresses and submit to see if they're request is valid.

### Displays Waypoint Markers & Route on Map

On a successful route submission, the embedded map will be updated with a waypoint marker labeled by it's sequence (1, 2, 3, etc.), and a route will be drawn between all waypoints

### Autocomplete Locations

Inputting text on the `Starting Location` and `Dropoff Point` input will trigger an autocomplete search of locations with similar names.

## Getting Started

### Application

To start the application, first install the NPM packages

```bash
npm install
```

Start the development site using

```bash
npm run dev
```

To build use

```bash
npm run build
```

### Environment Variables

Create a .env.local file in the root directory

```bash
touch .env.local
```

For the app to work, you will need two environment variables

```.env
VITE_APP_URL=<backend_url>
VITE_APP_MAPBOX_ACCESS_TOKEN=<mapbox_access_token>
```

The `VITE_APP_URL` is for the backend, while `VITE_APP_MAPBOX_ACCESS_TOKEN` is for the MapBox API. This is needed to show the map, and use their `directions` and `search` api's for the route path generation and autocomplete features.

To get a MapBox API Access Token, see the section below.

### Mapbox API

In order to obtain a Mapox API, first [sign-up for an account](https://account.mapbox.com/auth/signup/).

_Note: Although the mapbox API is free (until a certain limit), you need to add your credit card details to continue_.

Once it's created, and all the information has been added, go to your [account page](https://account.mapbox.com/) and copy the `Default Public Token` at the bottom of the page into the `VITE_APP_MAPBOX_ACCESS_TOKEN` environment variable.

## Specifications

### Functionality

On submiting valid addresses, the app will attempt to create a route, and on success it will fetch the path of the route. This is done by using the `useCreateRoute` and `useFetchRoute` hooks.

#### useCreateRoute Hook

Creates a route from the given addresses and returns a token if valid.

Returns

-   **createRoute**: A function that makes a `POST` request to the backend with route data `{origin: string; destination: string}`
-   **token**: the token of a successful route creation, or null
-   **loading**: loading status as a boolean
-   **error**: error fetching suggestions as null or an Error

#### useFetchRoute Hook

Fetches the route coordinates from a valid token returned from the `useCreateRoute` `createRoute` function.

Returns

-   **fetchRoute**: A function that makes a `GET` request to the backend with `token` as a parameter
-   **route**: a `GetRouteResponse` object (see types.ts) or null
-   **loading**: loading status as a boolean
-   **error**: error fetching suggestions as null or an Error

#### useDrivingRoute Hook

Fetches the GeoJSON driving route from a set of coordinates passed

Returns

-   **getDrivingRoute**: A function that makes a `GET` request to the `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesString}` where `coordinatesString` is a string of latitude and longitude pair coordinates
-   **geoJSON**: a `MapBoxDirectionsResponse` object (see types.ts) or null
-   **loading**: loading status as a boolean
-   **error**: error fetching suggestions as null or an Error

#### useAutocomplete Hook

Fetches suggestions from the Mapbox Search API based on a users query input

Returns

-   **fetchSuggestions**:
    -   A function that makes a `GET` request to the `https://api.mapbox.com/search/geocode/v6/forward` endpoint and appends a `q` string query parameter to the URL.
-   **suggestions**: a string array of suggestions that match the query
-   **loading**: loading status as a boolean
-   **error**: error fetching suggestions as null or an Error

### Tech Stack

This app was developed with Typescript, ReactJS, Vite and TailwindCSS

### Dependencies

Main dependencies are:

-   **axios**: fetching data from the backend and MapBox api
-   **axios-retry**: used for retrying a call to the backend if it's busy
-   **react-mapbox-gl**: react wrapper for the mapbox-gl

## Testing
