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
	const [start, setStart] = useState([12.9527962, 77.7025624]); // Default start point
	const [end, setEnd] = useState([12.97440549406668, 77.60777701563926]); // Default end point
	const [routes, setRoutes] = useState([]);
	const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
	const [position, setPosition] = useState(start);

	const blueCircleIcon = new L.Icon({
		iconUrl:
			'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
		iconSize: [25, 41], // size of the icon
		iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
		popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
		shadowSize: [41, 41], // size of the shadow
		shadowAnchor: [12, 41] // point of the shadow which will correspond to marker's location
	});

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

	// useEffect(() => {
	//   const movementInterval = setInterval(() => {
	//     const distance = Math.sqrt(
	//       Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2)
	//     );
	//     const speed = 0.00005; // Adjust the speed as needed
	//     const newPosition = [
	//       start[0] + (end[0] - start[0]) * speed / distance,
	//       start[1] + (end[1] - start[1]) * speed / distance
	//     ];
	//     setStart(newPosition);
	//   }, 1000);

	//   return () => clearInterval(movementInterval);
	// }, [start, end]);

	const selectRoute = (index) => {
		setSelectedRouteIndex(index);
	};

	const handleStartChange = (event) => {
		const { value } = event.target;
		const [lat, lng] = value.split(',').map(parseFloat);
		setStart([lat, lng]);
	};

	const handleEndChange = (event) => {
		const { value } = event.target;
		const [lat, lng] = value.split(',').map(parseFloat);
		setEnd([lat, lng]);
	};

	return (
		<div>
			<div>
				<label htmlFor="start">Start Position:</label>
				<input
					type="text"
					id="start"
					name="start"
					value={start.join(',')}
					onChange={handleStartChange}
				/>
			</div>
			<div>
				<label htmlFor="end">End Position:</label>
				<input
					type="text"
					id="end"
					name="end"
					value={end.join(',')}
					onChange={handleEndChange}
				/>
			</div>
			<MapContainer
				center={[12.963, 77.601]} // Default center
				zoom={13}
				style={{ height: '90vh', width: '100vw' }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{routes.map((route, index) => {
					console.log({ index, points: polyline.decode(route.geometry) });
					// <div onClick={console.log('trigger')}>
					return (
						<Polyline
							key={index}
							positions={polyline.decode(route.geometry)}
							color={index === selectedRouteIndex ? 'blue' : 'red'}
							onClick={() => {
								selectRoute(index);
								console.log('trigger' + polyline.decode(route.geometry));
							}}
						/>
						// </div>
					);
				})}
				<Marker position={start} icon={blueCircleIcon}>
					<Popup>Start Point</Popup>
				</Marker>
				<Marker position={end} icon={blueCircleIcon}>
					<Popup>End Point</Popup>
				</Marker>
			</MapContainer>
		</div>
	);
}

export default App;
