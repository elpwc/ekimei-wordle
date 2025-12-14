'use client';

import { useEffect, useRef } from 'react';
import JapanStations from '../assets/japanStationsDataWithoutUnused.json';
import { renderOSM } from '@/utils/mapRenderer';

export default function HomePage() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const stationAmount = JapanStations.length;
		const randomStation = JapanStations[Math.round(Math.random() * stationAmount)];
		console.log(randomStation);
		const radius = 3000;
		// 新杉田 coastline test
		// const lat = 35.3868;
		// const lon = 139.619435;
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

  way["highway"~"motorway|trunk|primary|secondary|tertiary"](around:${radius},${lat},${lon});

  way["leisure"="park"](around:${radius},${lat},${lon});
  relation["leisure"="park"](around:${radius},${lat},${lon});

  way["landuse"="grass"](around:${radius},${lat},${lon});
  relation["landuse"="grass"](around:${radius},${lat},${lon});
  way["natural"="wood"](around:${radius},${lat},${lon});
  relation["natural"="wood"](around:${radius},${lat},${lon});
  way["landuse"="orchard"](around:${radius},${lat},${lon});
  relation["landuse"="orchard"](around:${radius},${lat},${lon});
  way["landuse"="farmland"](around:${radius},${lat},${lon});
  relation["landuse"="farmland"](around:${radius},${lat},${lon});
  way["building"="yes"](around:${radius},${lat},${lon});
  relation["building"="yes"](around:${radius},${lat},${lon});

  node["natural"="peak"](around:${radius},${lat},${lon});
  way["natural"="peak"](around:${radius},${lat},${lon});
  relation["natural"="peak"](around:${radius},${lat},${lon});

  node["amenity"="place_of_worship"]["religion"="buddhist"](around:${radius},${lat},${lon});
  way["amenity"="place_of_worship"]["religion"="buddhist"](around:${radius},${lat},${lon});
  relation["amenity"="place_of_worship"]["religion"="buddhist"](around:${radius},${lat},${lon});
  node["amenity"="place_of_worship"]["religion"="shinto"](around:${radius},${lat},${lon});
  way["amenity"="place_of_worship"]["religion"="shinto"](around:${radius},${lat},${lon});
  relation["amenity"="place_of_worship"]["religion"="shinto"](around:${radius},${lat},${lon});

  node["amenity"="hospital"](around:${radius},${lat},${lon});
  way["amenity"="hospital"](around:${radius},${lat},${lon});
  relation["amenity"="hospital"](around:${radius},${lat},${lon});

  node["leisure"="sports_centre"](around:${radius},${lat},${lon});
  way["leisure"="sports_centre"](around:${radius},${lat},${lon});
  relation["leisure"="sports_centre"](around:${radius},${lat},${lon});

  way["leisure"="stadium"](around:${radius},${lat},${lon});
  relation["leisure"="stadium"](around:${radius},${lat},${lon});

  way["amenity"="school"](around:${radius},${lat},${lon});
  relation["amenity"="school"](around:${radius},${lat},${lon});
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
				if (canvasRef.current && ctx) {
					renderOSM(canvasRef.current, ctx, data, { center: { lat, lon }, scale: 20000 });
				}
			});
	}, []);

	return (
		<main>
			<canvas ref={canvasRef} width={500} height={500} />
		</main>
	);
}
