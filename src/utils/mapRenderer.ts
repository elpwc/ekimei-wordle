import { drawPoint, drawLine, isPolygon, drawPolygon } from './renderer';
import { OverpassElement, Projector, OverpassResponse } from './types';

export function renderStations(ctx: CanvasRenderingContext2D, elements: OverpassElement[], projector: Projector) {
	ctx.fillStyle = '#c62828';

	elements.forEach((el) => {
		if (el.type === 'node' && el.tags?.railway === 'station') {
			drawPoint(ctx, { lat: el.lat!, lon: el.lon! }, projector, 5);
		}
	});
}
export function renderRailways(ctx: CanvasRenderingContext2D, elements: OverpassElement[], projector: Projector) {
	ctx.strokeStyle = '#424242';
	ctx.lineWidth = 1.5;

	elements.forEach((el) => {
		if (el.type === 'way' && el.tags?.railway && el.geometry) {
			drawLine(ctx, el.geometry, projector);
		}
	});
}
export function renderCoastline(ctx: CanvasRenderingContext2D, elements: OverpassElement[], projector: Projector) {
	ctx.strokeStyle = '#0277bd';
	ctx.lineWidth = 2;

	elements.forEach((el) => {
		if (el.type === 'way' && el.tags?.natural === 'coastline') {
			drawLine(ctx, el.geometry!, projector);
		}
	});
}
export function renderLakes(ctx: CanvasRenderingContext2D, elements: OverpassElement[], projector: Projector) {
	ctx.fillStyle = '#81d4fa';

	elements.forEach((el) => {
		if (el.geometry && el.tags?.natural === 'water' && el.tags?.water === 'lake' && isPolygon(el)) {
			drawPolygon(ctx, el.geometry, projector);
		}
	});
}
const MAIN_ROADS = new Set(['motorway', 'trunk', 'primary', 'secondary']);

export function renderMainRoads(ctx: CanvasRenderingContext2D, elements: OverpassElement[], projector: Projector) {
	ctx.strokeStyle = '#f57c00';
	ctx.lineWidth = 2;

	elements.forEach((el) => {
		if (el.type === 'way' && el.tags?.highway && MAIN_ROADS.has(el.tags.highway)) {
			drawLine(ctx, el.geometry!, projector);
		}
	});
}
export function renderGreenAreas(ctx: CanvasRenderingContext2D, elements: OverpassElement[], projector: Projector) {
	ctx.fillStyle = '#a5d6a7';

	elements.forEach((el) => {
		if (el.geometry && (el.tags?.leisure === 'park' || el.tags?.landuse === 'grass') && isPolygon(el)) {
			drawPolygon(ctx, el.geometry, projector);
		}
	});
}

export function renderUniversities(ctx: CanvasRenderingContext2D, elements: OverpassElement[], projector: Projector) {
	ctx.fillStyle = '#6a1b9a';

	elements.forEach((el) => {
		if (el.type === 'node' && el.tags?.amenity === 'university') {
			drawPoint(ctx, { lat: el.lat!, lon: el.lon! }, projector, 4);
		}
	});
}
export function renderHospitals(ctx: CanvasRenderingContext2D, elements: OverpassElement[], projector: Projector) {
	ctx.fillStyle = '#d32f2f';

	elements.forEach((el) => {
		if (el.type === 'node' && el.tags?.amenity === 'hospital') {
			drawPoint(ctx, { lat: el.lat!, lon: el.lon! }, projector, 4);
		}
	});
}
export function renderSports(ctx: CanvasRenderingContext2D, elements: OverpassElement[], projector: Projector) {
	ctx.fillStyle = '#1976d2';

	elements.forEach((el) => {
		if (el.type === 'node' && (el.tags?.leisure === 'sports_centre' || el.tags?.leisure === 'stadium')) {
			drawPoint(ctx, { lat: el.lat!, lon: el.lon! }, projector, 4);
		}
	});
}
export function renderOSM(ctx: CanvasRenderingContext2D, data: OverpassResponse, projector: Projector) {
	ctx.save();
	ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);

	renderGreenAreas(ctx, data.elements, projector);
	renderLakes(ctx, data.elements, projector);
	renderCoastline(ctx, data.elements, projector);

	renderMainRoads(ctx, data.elements, projector);
	renderRailways(ctx, data.elements, projector);

	renderStations(ctx, data.elements, projector);
	renderUniversities(ctx, data.elements, projector);
	renderHospitals(ctx, data.elements, projector);
	renderSports(ctx, data.elements, projector);

	ctx.restore();
}
