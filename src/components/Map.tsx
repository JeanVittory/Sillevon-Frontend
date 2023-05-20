'use client';

import { icon } from 'leaflet';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import styles from '../styles/Map.module.scss';
import 'leaflet/dist/leaflet.css';

interface MapProps {
	zoom: number;
	center: {
		lat: number;
		lng: number;
	};
	className: string;
	position: {
		lat: number;
		lng: number;
	};
}

export default function Map({ zoom, center, position }: MapProps) {
	const ICON = icon({
		iconUrl: '/location-pin.svg',
		iconSize: [20, 20],
	});

	return (
		<div className={styles.mapContainer}>
			<MapContainer className={styles.map} center={center} zoom={zoom} scrollWheelZoom={true}>
				<TileLayer
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>
				<Marker position={position} draggable icon={ICON} />
			</MapContainer>
		</div>
	);
}
