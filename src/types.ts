export interface GetRouteResponse {
	status: 'in progress' | 'failure' | 'success';
	error?: string;
	path?: [string, string][];
	total_distance?: number;
	total_time?: number;
}

export interface CreateRoute {
	origin: string;
	destination: string;
}

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

export interface MapBoxDirectionsResponse {
	routes: Route[];
	code: string;
}
