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

Unfortunately, I couldn't get the testing to work.

I couldn't figure out how to mock the axios response for the different hooks. This is my psuedo implementation for the testing of the main hook functionalities.

I'm using vitest, and the react testing-libray.

### useCreateRoute

```typescript
import axios from 'axios';
import { MockedFunction, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import useCreateRoute from '../../hooks/useCreateRoute';

// Mock axios
vi.mock('axios', () => {
	return {
		default: {
			post: vi.fn(),
			get: vi.fn(),
			delete: vi.fn(),
			put: vi.fn(),
			create: vi.fn().mockReturnThis(),
			interceptors: {
				request: {
					use: vi.fn(),
					eject: vi.fn(),
				},
				response: {
					use: vi.fn(),
					eject: vi.fn(),
				},
			},
		},
	};
});

const mockPost = axios.post as MockedFunction<typeof axios.post>;
describe('useCreateHook', () => {
	it('should return a token on a valid request', async () => {
		mockPost.mockResolvedValue(() => Promise.resolve({ token: 'test' }));
		const { result } = renderHook(() => useCreateHook());
		act(() => result.current.createRoute({ origin: '', destination: '' }));
		await waitFor(() => {
			expect(result.current.token).toEqual('test');
			// test for .error and .loading as null and false
		});
	});

	it('should return an error on an internal server error', async () => {
		mockPost.mockRejectedValue(() => Promise.reject(/** 500 error */));
		const { result } = renderHook(() => useCreateHook());
		act(() => result.current.createRoute({ origin: '', destination: '' }));
		await waitFor(() => {
			expect(result.current.error).not.toBeNull();
			// test for .token and .loading as null and false
		});
	});
});
```

### useFetchRoute

Following the tests in useCreateRoute, this is just a more basic approach for the different tests using comments.

```typescript
/** imports and other variables set before this */
describe('useFetchRoute', () => {
	it('should return route information on a valid request', async () => {
		// mock get returns status of "success" with path, total_distance and total_time parameters
		// tests fetchRoute in the hook
		// expects the hooks "route" obj to have the parameters set above
	});

	it('should return status failure when the backend is unable to complete request', async () => {
		// mock get returns status of "failure"
		// tests fetchRoute in the hook
		// expects the error to be set to "Could not find a suitable route"
	});

	it('should return status failure when the backend is finds location is not accessible', async () => {
		// mock get returns status of "failure" with an error of "Location not accessible"
		// tests fetchRoute in the hook
		// expects the error to be set to "Location not accessible"
	});

	it('should return an error on internal server error', async () => {
		// mock throws an internal 500 server error
		// tests fetchRoute in the hook
		// expects the error to be set to internal server error message
	});

	it('should keep retrying if the backend is in progress until an error occurs', async () => {
		// mock to return status "in progress" around 3-5 times, and then it throws an internal server error
		// tests fetchRoute in the hook
		// expects the error to be set to internal server error message
	});

	it('should keep retrying if the backend is in progress until it is successful', async () => {
		// mock to return status "in progress" around 3-5 times, and then returns status of "success" with path, total_distance and total_time parameters
		// tests fetchRoute in the hook
		// expects the hooks "route" obj to have the parameters set above
	});
});
```

## Improvements

### Add Testing

See above on how I'd implenent it.
