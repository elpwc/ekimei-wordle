'use client';

import { getOSMData } from '@/utils/getOSMData';
import { renderOSM } from '@/utils/mapRenderer';
import { useEffect, useRef } from 'react';
import JapanStations from '@/assets/japanStationsDataWithoutUnused.json';

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
		getOSMData({ lat, lon }, radius, (data) => {
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
