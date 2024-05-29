/**
 * Fetch a route response given a valid token
 */
export interface GetRouteResponse {
	status: 'in progress' | 'failure' | 'success';
	error?: string;
	path?: [string, string][];
	total_distance?: number;
	total_time?: number;
}

/**
 * Create a Route request body
 */

export interface CreateRoute {
	origin: string;
	destination: string;
}

/**
 * Create a Route response
 */

export interface CreateRouteResponse {
	token: string;
}

interface Route {
	duration: number;
	distance: number;
	geometry: {
		coordinates: [number, number][];
		type: 'LineString';
	};
}

/**
 * Get Driving Directions from Coordinates Response
 */
export interface MapBoxDirectionsResponse {
	routes: Route[];
	code: string;
}

interface MapBoxFeatureSuggestion {
	properties: {
		full_address: string;
		name: string;
	};
}

/**
 * Search Query Response
 */
export interface MapBoxFeatureSuggestions {
	features: MapBoxFeatureSuggestion[];
}
