import React, { useState, useEffect } from 'react';
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	Polyline
} from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import 'leaflet/dist/leaflet.css';

function App() {
	const start = [12.9527962, 77.7025624]; // New York City
	const end = [12.97440549406668, 77.60777701563926];
	const [routes, setRoutes] = useState([]);
	const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
	const [position, setPosition] = useState(start);

	useEffect(() => {
		async function fetchRoutes() {
			try {
				const response = await axios.get(
					`http://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?alternatives=true`
				);
				console.log(response);
				setRoutes(response.data.routes);
			} catch (error) {
				console.log(error);
			}
		}

		fetchRoutes();
	}, [start, end]);

	useEffect(() => {
		//Update position in real-time
		const timer = setInterval(() => {
			// Calculate new position based on distance covered
			// For demo purpose, we're just updating position by a random value
			const newPosition = [
				position[0] + (Math.random() - 0.5) * 0.01,
				position[1] + (Math.random() - 0.5) * 0.01
			];
			setPosition(newPosition);
		}, 1000);

		return () => clearInterval(timer);
	}, [position]);

	const selectRoute = (index) => {
		setSelectedRouteIndex(index);
	};

	return (
		<MapContainer
			center={position}
			zoom={100}
			style={{ height: '100vh', width: '100vw' }}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{routes.map((route, index) => {
				return (
					<Polyline
						key={index}
						positions={polyline.decode(route.geometry)}
						color={index === selectedRouteIndex ? 'blue' : 'red'}
						// color="red"
						onClick={() => selectRoute(index)}
					/>
				);
			})}
			<Marker position={start}>
				<Popup>Start Point</Popup>
			</Marker>
			<Marker position={end}>
				<Popup>End Point</Popup>
			</Marker>
			<Marker position={position}>
				<Popup>User Position</Popup>
			</Marker>
		</MapContainer>
	);
}

export default App;
