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

function App() {
	const start = [40.7128, -74.006]; // New York City
	const end = [34.0522, -118.2437];
	const [routes, setRoutes] = useState([]);
	const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
	const [position, setPosition] = useState(start);

	useEffect(() => {
		async function fetchRoutes() {
			try {
				const response = await axios.get(
					`http://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}`
				);
				setRoutes(response.data.routes);
			} catch (error) {
				console.error('Error fetching routes:', error);
			}
		}

		fetchRoutes();
	}, [start, end]);

	useEffect(() => {
		// Update position in real-time
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
		<MapContainer center={position} zoom={13} style={{ height: '400px' }}>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			{routes.map((route, index) => {
				console.log(route);
				return (
					<Polyline
						key={index}
						positions={route.geometry.coordinates.map((coord) => [
							coord[1],
							coord[0]
						])}
						color={index === selectedRouteIndex ? 'blue' : 'gray'}
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
