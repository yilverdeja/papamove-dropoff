import axios, { AxiosError } from 'axios';
import { CreateRoute, CreateRouteResponse } from '../types';
import { useCallback, useState } from 'react';

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_APP_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

const useCreateRoute = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [token, setToken] = useState<string | null>(null);

	const createRoute = useCallback(async (routeData: CreateRoute) => {
		setToken(null);
		setError(null);
		setLoading(true);
		try {
			const response = await axiosInstance
				.post<CreateRouteResponse>('/route', routeData)
				.then((res) => res.data);
			setToken(response.token);
			setError(null);
			setLoading(false);
		} catch (err) {
			if (err instanceof Error) setError(err);
			else setError(new Error('An unknown error has occurred'));
			setToken(null);
			setLoading(false);
		} finally {
			setLoading(false);
		}
	}, []);

	return { createRoute, token, loading, error };
};

export default useCreateRoute;
