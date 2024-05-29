import axios from 'axios';
import { useState, useCallback } from 'react';
import { MapBoxFeatureSuggestions } from '../types';

const axiosInstance = axios.create({
	baseURL: 'https://api.mapbox.com',
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosInstance.interceptors.request.use((config) => {
	config.params = {
		...config.params,
		access_token: import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN,
	};
	return config;
});

const useAutocomplete = () => {
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchSuggestions = useCallback(async (query: string) => {
		setLoading(true);
		setError(null);
		try {
			const response = await axiosInstance
				.get<MapBoxFeatureSuggestions>('/search/geocode/v6/forward', {
					params: {
						q: query,
					},
				})
				.then((res) => res.data);

			setSuggestions(
				response.features.map(
					(feature) => feature.properties.full_address
				)
			);
			setError(null);
			setLoading(false);
		} catch (err) {
			if (err instanceof Error) setError(err);
			else setError(new Error('An unknown error has occurred'));
			setSuggestions([]);
			setLoading(false);
		} finally {
			setLoading(false);
		}
	}, []);

	return { fetchSuggestions, suggestions, loading, error };
};

export default useAutocomplete;
