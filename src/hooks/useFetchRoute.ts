import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import { GetRouteResponse } from '../types';
import { useCallback, useState } from 'react';

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_APP_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Setup response interceptor to handle 'in progress' status
axiosInstance.interceptors.response.use(
	(response) => {
		if (response.data.status === 'in progress') {
			// Mimicking an AxiosError more accurately
			const axiosError = new AxiosError(
				'retry', // message
				'ERR_RETRY', // error code
				response.config, // config, should ideally be response.config but can be empty object if not accessible
				axiosInstance, // axios instance
				response // response
			);
			return Promise.reject(axiosError);
		}
		return response;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Setup axios-retry with custom retry conditions
axiosRetry(axiosInstance, {
	retryDelay: axiosRetry.exponentialDelay,
	retryCondition: (error) => {
		return error.code === 'ERR_RETRY';
	},
});

const useFetchRoute = () => {
	const [route, setRoute] = useState<GetRouteResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchRoute = useCallback(async (token: string) => {
		setLoading(true);
		setError(null);
		setRoute(null);

		try {
			const response = await axiosInstance.get(`/route/${token}`);
			const data = response.data;

			// Assuming that axios-retry handles the retries, we only process the final response
			if (data.status === 'success') {
				setRoute(data);
			} else {
				const errMessage = data.error
					? data.error
					: 'Could not find a suitable route';
				throw new Error(errMessage);
			}
		} catch (err) {
			if (err instanceof Error) {
				setError(err);
			} else {
				setError(new Error('An unknown error occurred'));
			}
		} finally {
			setLoading(false);
		}
	}, []);

	return { fetchRoute, route, loading, error };
};

export default useFetchRoute;
