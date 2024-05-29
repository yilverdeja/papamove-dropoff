/* eslint-disable react-hooks/exhaustive-deps */
import { useDebounce } from '@uidotdev/usehooks';
import Map, { Layer, Marker, Source } from 'react-map-gl';
import useCreateRoute from './hooks/useCreateRoute';
import { useEffect, useState } from 'react';
import useFetchRoute from './hooks/useFetchRoute';
import { CreateRoute } from './types';
import ResultDisplay from './components/ResultDisplay';
import MarkerIcon from './components/MarkerIcon';
import useDrivingRoute from './hooks/useDrivingRoute';
function App() {
	const {
		createRoute,
		token,
		loading: createLoading,
		error: createError,
	} = useCreateRoute();
	const {
		fetchRoute,
		route,
		loading: fetchLoading,
		error: fetchError,
	} = useFetchRoute();
	const { getDrivingRoute, geoJSON, loading, error } = useDrivingRoute();
	const [routeData, setRouteData] = useState<CreateRoute>({
		origin: '',
		destination: '',
	});
	const [waypoints, setWaypoints] = useState<[number, number][] | null>(null);
	const debouncedSearchTerm = useDebounce(routeData, 300);

	useEffect(() => {
		if (token) fetchRoute(token);
	}, [token]);

	useEffect(() => {
		if (route && route.status === 'success') {
			const paths = route.path!.map((path) => {
				const [first, second] = path;
				return [parseFloat(second), parseFloat(first)] as [
					number,
					number
				];
			});
			console.log(paths);
			setWaypoints(paths);
		}
	}, [route]);

	useEffect(() => {
		if (waypoints) getDrivingRoute(waypoints);
	}, [waypoints]);

	useEffect(() => {
		if (debouncedSearchTerm)
			fetch(
				`https://api.mapbox.com/search/geocode/v6/forward?q=${
					routeData.origin
				}&access_token=${import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN}`
			)
				.then((res) => res.json())
				.then((data) => console.log(data));
	}, [debouncedSearchTerm]);

	const handleCreateRoute = () => {
		createRoute(routeData);
	};

	return (
		<main className="grid grid-cols-3 h-screen">
			<div className="col-span-1 px-8 py-8">
				<h1 className="text-2xl mb-6">Papamove</h1>
				<form
					className=""
					onSubmit={(event) => {
						event.preventDefault();
						handleCreateRoute();
					}}
				>
					<div className="my-2">
						<label
							className="block mb-2 text-sm font-medium text-gray-900"
							htmlFor="origin"
						>
							Starting Location
						</label>
						<input
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
							type="text"
							name="origin"
							id="origin"
							placeholder="Innocenter"
							value={routeData.origin}
							onChange={(event) =>
								setRouteData({
									...routeData,
									origin: event.target.value,
								})
							}
							required
						/>
					</div>
					<div className="my-2">
						<label
							className="block mb-2 text-sm font-medium text-gray-900"
							htmlFor="dropoff"
						>
							Dropoff Point
						</label>
						<input
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
							type="text"
							name="dropoff"
							id="dropoff"
							placeholder="Science Park"
							value={routeData.destination}
							onChange={(event) =>
								setRouteData({
									...routeData,
									destination: event.target.value,
								})
							}
							required
						/>
					</div>
					<div className="flex gap-4 my-4">
						<button
							className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
							type="submit"
						>
							Submit
						</button>
						<button
							className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
							type="reset"
						>
							Reset
						</button>
					</div>
				</form>
				<div>
					<h2 className="text-xl font-semibold">Results</h2>
					<p className="pb-4">
						Set a starting location and a dropoff point, and click
						Submit to generate a route
					</p>
					<ResultDisplay
						createError={createError}
						fetchError={fetchError}
						createLoading={createLoading}
						fetchLoading={fetchLoading}
						route={route}
					/>
				</div>
			</div>
			<div className="col-span-2">
				<Map
					mapboxAccessToken={
						import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN
					}
					initialViewState={{
						longitude: 114.17,
						latitude: 22.32,
						zoom: 14,
					}}
					mapStyle="mapbox://styles/mapbox/streets-v9"
				>
					{geoJSON && (
						<Source type="geojson" data={geoJSON}>
							<Layer
								id="route"
								type="line"
								source="route"
								layout={{
									'line-join': 'round',
									'line-cap': 'round',
								}}
								paint={{
									'line-color': 'brown',
									'line-width': 5,
								}}
							/>
						</Source>
					)}
					{waypoints &&
						waypoints.map((path, index) => (
							<Marker
								key={index}
								longitude={path[0]}
								latitude={path[1]}
								color="blue"
								anchor="center"
							>
								<MarkerIcon index={index + 1} />
							</Marker>
						))}
				</Map>
			</div>
		</main>
	);
}

export default App;
