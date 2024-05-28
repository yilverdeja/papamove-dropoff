import axios from 'axios';
import { MapBoxDirectionsResponse } from '../types';
import { useCallback, useState } from 'react';

const axiosInstance = axios.create({
	baseURL: 'https://api.mapbox.com/directions/v5/mapbox/driving',
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosInstance.interceptors.request.use((config) => {
	config.params = {
		geometries: 'geojson',
		access_token: import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN,
	};
	return config;
});

const useDrivingRoute = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [geoJSON, setGeoJSON] = useState<GeoJSON.Feature | undefined>(
		undefined
	);

	const getDrivingRoute = useCallback(
		async (waypoints: [number, number][]) => {
			setGeoJSON(null);
			setError(null);
			setLoading(true);
			try {
				const coordinatesString = waypoints
					.map((waypoint) => waypoint.join(','))
					.join(';');
				const response = await axiosInstance
					.get<MapBoxDirectionsResponse>(`/${coordinatesString}`)
					.then((res) => res.data);

				setGeoJSON({
					type: 'Feature',
					properties: {},
					geometry: response.routes[0].geometry,
				});
				setError(null);
				setLoading(false);
			} catch (err) {
				if (err instanceof Error) setError(err);
				else setError(new Error('An unknown error has occurred'));
				setGeoJSON(null);
				setLoading(false);
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	return { getDrivingRoute, geoJSON, loading, error };
};

export default useDrivingRoute;
