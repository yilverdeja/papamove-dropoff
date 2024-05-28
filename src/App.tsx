/* eslint-disable react-hooks/exhaustive-deps */
import Map, { Layer, Marker, Source } from 'react-map-gl';
import useCreateRoute from './hooks/useCreateRoute';
import { useEffect, useState } from 'react';
import useFetchRoute from './hooks/useFetchRoute';
import { CreateRoute } from './types';
import ResultDisplay from './components/ResultDisplay';
import MarkerIcon from './components/MarkerIcon';
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
	const [routeData, setRouteData] = useState<CreateRoute>({
		origin: '',
		destination: '',
	});
	const [paths, setPaths] = useState<[string, string][]>([
		['22.372081', '114.107877'],
		['22.326442', '114.167811'],
		['22.284419', '114.159510'],
	]);
	const [geojson, setGeojson] = useState<GeoJSON.Feature>({
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'LineString',
			coordinates: [
				[114.107848, 22.372035],
				[114.107642, 22.372144],
				[114.106831, 22.371418],
				[114.107895, 22.370431],
				[114.108374, 22.370505],
				[114.108785, 22.370674],
				[114.114838, 22.364856],
				[114.11822, 22.362546],
				[114.120548, 22.358294],
				[114.126053, 22.353036],
				[114.126241, 22.351663],
				[114.12525, 22.348116],
				[114.125129, 22.346235],
				[114.126177, 22.3447],
				[114.128428, 22.343677],
				[114.130626, 22.342578],
				[114.132782, 22.339253],
				[114.133687, 22.338442],
				[114.138467, 22.337438],
				[114.144414, 22.336301],
				[114.146134, 22.335009],
				[114.147323, 22.335254],
				[114.149043, 22.335819],
				[114.149933, 22.335563],
				[114.15122, 22.333314],
				[114.162308, 22.324887],
				[114.164117, 22.323606],
				[114.165202, 22.323505],
				[114.167757, 22.324051],
				[114.167537, 22.325016],
				[114.168125, 22.325125],
				[114.167793, 22.326431],
			],
		},
	});

	useEffect(() => {
		if (token) fetchRoute(token);
	}, [token]);

	useEffect(() => {
		if (route && route.status === 'success') {
			setPaths(route.path!);
		}
	}, [route]);

	useEffect(() => {
		fetch(
			`https://api.mapbox.com/directions/v5/mapbox/driving/114.107877,22.372081;114.167811,22.326442?alternatives=true&geometries=geojson&overview=simplified&steps=false&notifications=none&access_token=${
				import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN
			}`
		)
			.then((res) => res.json())
			.then((data) => console.log(data));
	}, [paths]);

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
					<Source type="geojson" data={geojson}>
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
					{paths.map((path, index) => (
						<Marker
							key={index}
							longitude={parseFloat(path[1])}
							latitude={parseFloat(path[0])}
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
