'use client';

import { useEffect, useRef } from 'react';
import JapanStations from '../assets/japanStationsData.json';
import { renderOSM } from '@/utils/mapRenderer';

export default function HomePage() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const stationAmount = JapanStations.length;
		const randomStation = JapanStations[Math.round(Math.random() * stationAmount)];
		console.log(randomStation);
		const radius = 1000;
		const lat = randomStation.coord[1];
		const lon = randomStation.coord[0];

		const query = `
[out:json][timeout:25];

(
  node["railway"="station"](around:${radius},${lat},${lon});
  way["railway"="station"](around:${radius},${lat},${lon});
  relation["railway"="station"](around:${radius},${lat},${lon});

  way["railway"](around:${radius},${lat},${lon});
  relation["railway"](around:${radius},${lat},${lon});

  way["natural"="coastline"](around:${radius},${lat},${lon});

  way["natural"="water"]["water"="lake"](around:${radius},${lat},${lon});
  relation["natural"="water"]["water"="lake"](around:${radius},${lat},${lon});

  way["highway"~"motorway|trunk|primary|secondary"](around:${radius},${lat},${lon});

  way["leisure"="park"](around:${radius},${lat},${lon});
  relation["leisure"="park"](around:${radius},${lat},${lon});

  way["landuse"="grass"](around:${radius},${lat},${lon});
  relation["landuse"="grass"](around:${radius},${lat},${lon});

  node["amenity"="university"](around:${radius},${lat},${lon});
  way["amenity"="university"](around:${radius},${lat},${lon});
  relation["amenity"="university"](around:${radius},${lat},${lon});

  node["amenity"="hospital"](around:${radius},${lat},${lon});
  way["amenity"="hospital"](around:${radius},${lat},${lon});
  relation["amenity"="hospital"](around:${radius},${lat},${lon});

  node["leisure"="sports_centre"](around:${radius},${lat},${lon});
  way["leisure"="sports_centre"](around:${radius},${lat},${lon});
  relation["leisure"="sports_centre"](around:${radius},${lat},${lon});

  way["leisure"="stadium"](around:${radius},${lat},${lon});
  relation["leisure"="stadium"](around:${radius},${lat},${lon});
);

out geom;
`;
		fetch('https://overpass-api.de/api/interpreter', {
			method: 'POST',
			body: query,
		})
			.then((r) => r.json())
			.then((data) => {
				console.log(data);
				const ctx = canvasRef.current?.getContext('2d');
				if (ctx) {
					renderOSM(ctx, data, { center: { lat, lon }, scale: 30000 });
				}
			});
	}, []);

	return (
		<main>
			<canvas ref={canvasRef} width={500} height={500} />
		</main>
	);
}
