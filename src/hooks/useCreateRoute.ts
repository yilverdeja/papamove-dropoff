import axios from 'axios';
import { CreateRoute, CreateRouteResponse } from '../types';
import { useState } from 'react';

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_APP_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

const useCreateRoute = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [data, setData] = useState<CreateRouteResponse | null>(null);

	const createRoute = (createRouteData: CreateRoute) => {
		setLoading(true);
		setError(null);
		axiosInstance
			.post<CreateRouteResponse>('/route', createRouteData)
			.then((res) => {
				setData(res.data);
				setError(null);
				setLoading(false);
			})
			.catch((err) => {
				if (err instanceof Error) setError(err);
				else setError(new Error(String(err)));
				setLoading(false);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return { createRoute, data, loading, error };
};

export default useCreateRoute;
