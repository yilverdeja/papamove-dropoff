import { GetRouteResponse } from '../types';

interface Props {
	createError: Error | null;
	fetchError: Error | null;
	route: GetRouteResponse | null;
	createLoading: boolean;
	fetchLoading: boolean;
}

const ResultDisplay = ({
	createError,
	fetchError,
	route,
	createLoading,
	fetchLoading,
}: Props) => {
	// Handle loading state
	if (createLoading || fetchLoading) {
		return <p>Fetching Route...</p>;
	}

	// Handle errors
	const handleError = (error: Error) => {
		if (error && error.message === 'Request failed with status code 500') {
			return "(500 Internal Server Error) Something's wrong. Please retry again in a moment.";
		}
		return error.message;
	};

	if (createError) {
		return <p className="text-red-500">{handleError(createError)}</p>;
	}

	if (fetchError) {
		return <p className="text-red-500">{handleError(fetchError)}</p>;
	}

	// Handle route status
	if (route) {
		return (
			<div>
				{route.status === 'failure' && (
					<p className="text-red-500">Route failed: {route.error}</p>
				)}
				{route.status === 'success' && (
					<div>
						<p>Distance: {route.total_distance}</p>
						<p>Time: {route.total_time}</p>
					</div>
				)}
			</div>
		);
	}
};

export default ResultDisplay;
