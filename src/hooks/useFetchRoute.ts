import axios from 'axios';
import { GetRouteResponse } from '../types';
import { useCallback, useState } from 'react';

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
		try {
			const response = await axiosInstance
				.get<GetRouteResponse>(`/route/${token}`)
				.then((res) => res.data);
			setRoute(response);
			setLoading(false);
		} catch (err) {
			if (err instanceof Error) setError(err);
			else setError(new Error(String(err)));
			setRoute(null);
			setLoading(false);
		} finally {
			setLoading(false);
		}
	}, []);

	return { fetchRoute, route, loading, error };
};

export default useFetchRoute;
