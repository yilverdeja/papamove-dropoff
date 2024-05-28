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
	if (createLoading || fetchLoading) return <p>Loading...</p>;
	if (createError) return <p>{createError.message}</p>;
	if (fetchError) return <p>{fetchError.message}</p>;

	if (route)
		return (
			<div>
				{route.status === 'failure' && (
					<p>Route failed: ${route.error}</p>
				)}
				{route.status === 'in progress' && (
					<p>
						The route is still in progress. Please wait a moment...
					</p>
				)}
				{route.status === 'success' && (
					<div>
						<p>Path: {route.path?.join(', ').toString()}</p>
						<p>Distance: {route.total_distance}</p>
						<p>Time: {route.total_time}</p>
					</div>
				)}
			</div>
		);
};

export default ResultDisplay;
