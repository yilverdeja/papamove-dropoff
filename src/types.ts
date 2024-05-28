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
