import { LatLon, Projector, OverpassElement } from './types';

export function drawLine(ctx: CanvasRenderingContext2D, points: LatLon[], projector: Projector) {
	if (points.length < 2) return;

	ctx.beginPath();

	points.forEach((p, i) => {
		const { x, y } = project(p, projector);
		i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
	});

	ctx.stroke();
}

export function drawPolygon(ctx: CanvasRenderingContext2D, points: LatLon[], projector: Projector) {
	if (points.length < 3) return;

	ctx.beginPath();

	points.forEach((p, i) => {
		const { x, y } = project(p, projector);
		i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
	});

	ctx.closePath();
	ctx.fill();
}

export function drawPoint(ctx: CanvasRenderingContext2D, p: LatLon, projector: Projector, radius = 4) {
	const { x, y } = project(p, projector);

	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2);
	ctx.fill();
}

export function drawText(ctx: CanvasRenderingContext2D, p: LatLon, projector: Projector, text: string) {
	const { x, y } = project(p, projector);

	ctx.beginPath();
	ctx.fillText(text, x, y);
	ctx.fill();
}

export function project(p: LatLon, projector: Projector): { x: number; y: number } {
	const { center, scale } = projector;

	const x = (p.lon - center.lon) * Math.cos((center.lat * Math.PI) / 180) * scale;

	const y = (p.lat - center.lat) * scale;

	return { x, y: -y };
}
export function isPolygon(el: OverpassElement): boolean {
	if (!el.geometry || el.geometry.length < 3) return false;

	const first = el.geometry[0];
	const last = el.geometry[el.geometry.length - 1];

	return first.lat === last.lat && first.lon === last.lon;
}

export function polygonCentroid(points: LatLon[]): { lat: number; lon: number } {
	let area = 0;
	let cx = 0;
	let cy = 0;

	const n = points.length;
	if (n < 3) return { lat: 0, lon: 0 };

	for (let i = 0; i < n; i++) {
		const p1 = points[i];
		const p2 = points[(i + 1) % n];
		const cross = p1.lat * p2.lon - p2.lat * p1.lon;
		area += cross;
		cx += (p1.lat + p2.lat) * cross;
		cy += (p1.lon + p2.lon) * cross;
	}

	area *= 0.5;
	if (area === 0) return { lat: 0, lon: 0 };

	cx /= 6 * area;
	cy /= 6 * area;

	return { lat: cx, lon: cy };
}
