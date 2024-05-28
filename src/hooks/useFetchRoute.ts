import axios from 'axios';
import { GetRouteResponse } from '../types';
import { useCallback, useState } from 'react';

const maxRetries = 5;

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_APP_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

const useFetchRoute = () => {
	const [route, setRoute] = useState<GetRouteResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchRoute = useCallback(async (token: string) => {
		setRoute(null);
		setError(null);
		setLoading(true);

		// fetch data with retry logic
		const fetchData = async (retryCount = 0) => {
			try {
				const response = await axiosInstance
					.get<GetRouteResponse>(`/route/${token}`)
					.then((res) => res.data);
				if (response.status === 'in progress') {
					if (retryCount < maxRetries) {
						setTimeout(() => {
							fetchData(retryCount + 1);
						}, Math.pow(2, retryCount) * 1000); // exponential backoff to reduce server calls
					} else {
						throw new Error('Max retries attempts reached');
					}
				} else if (response.status === 'success') {
					setRoute(response);
					setLoading(false);
				} else {
					throw new Error('Failed to fetch route');
				}
			} catch (err) {
				if (err instanceof Error) setError(err);
				else setError(new Error(String(err)));
				setRoute(null);
				setLoading(false);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	return { fetchRoute, route, loading, error };
};

export default useFetchRoute;
