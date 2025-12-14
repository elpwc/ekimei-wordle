import { drawPoint, drawLine, isPolygon, drawPolygon, project, drawText, polygonCentroid } from './renderer';
import { OverpassElement, Projector, OverpassResponse, LatLon } from './types';
export function fillSeaByCoastline(ctx: CanvasRenderingContext2D, coastlines: OverpassElement[], projector: Projector, canvasWidth: number, canvasHeight: number) {
	ctx.save();

	ctx.fillStyle = '#81d4fa';
	ctx.beginPath();

	ctx.rect(-canvasWidth / 2, -canvasHeight / 2, canvasWidth, canvasHeight);

	coastlines.forEach((el) => {
		if (!el.geometry) return;

		ctx.moveTo(0, 0);

		el.geometry.forEach((p, i) => {
			const { x, y } = project(p, projector);
			i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
		});
	});

	ctx.fill('evenodd');

	ctx.restore();
}

export function renderElements(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, elements: OverpassElement[], projector: Projector) {
	// 	const coastlines = elements.filter((el) => el.type === 'way' && el.tags?.natural === 'coastline');
	// 	if (coastlines.length > 0) {
	// 		console.log(coastlines);
	// 		fillSeaByCoastline(ctx, coastlines, projector, canvas.width, canvas.height);

	// }

	elements.forEach((el) => {
		ctx.font = 'bold 100px';
		// lake
		ctx.fillStyle = '#81d4fa';
		if (el.geometry && el.tags?.natural === 'water' && el.tags?.water === 'lake' && isPolygon(el)) {
			drawPolygon(ctx, el.geometry, projector);
		}

		const MAIN_ROADS = new Set(['motorway', 'trunk', 'primary', 'secondary']);
		ctx.strokeStyle = '#f57c00';
		ctx.lineWidth = 2;
		if (el.type === 'way' && el.tags?.highway && MAIN_ROADS.has(el.tags.highway)) {
			drawLine(ctx, el.geometry!, projector);
		}
		if (el.type === 'way' && el.tags?.highway && el.tags.highway === 'tertiary') {
			ctx.strokeStyle = '#686868';
			drawLine(ctx, el.geometry!, projector);
		}
		ctx.fillStyle = '#a5d6a7';
		if (el.geometry && (el.tags?.leisure === 'park' || ['grass', 'wood', 'orchard'].includes(el.tags?.landuse ?? '') || ['wood'].includes(el.tags?.natural ?? '')) && isPolygon(el)) {
			drawPolygon(ctx, el.geometry, projector);
		}
		ctx.fillStyle = '#d1f0c9';
		if (el.geometry && ['farmland'].includes(el.tags?.landuse ?? '') && isPolygon(el)) {
			drawPolygon(ctx, el.geometry, projector);
		}
		ctx.fillStyle = '#929292';
		if (el.geometry && el.tags?.building === 'yes' && isPolygon(el)) {
			drawPolygon(ctx, el.geometry, projector);
		}
		ctx.fillStyle = '#1976d2';
		if (el.type === 'node' && (el.tags?.leisure === 'sports_centre' || el.tags?.leisure === 'stadium')) {
			drawPoint(ctx, { lat: el.lat!, lon: el.lon! }, projector, 4);
		}
		ctx.fillStyle = '#c6c6c6';
		if (el.geometry && el.tags?.amenity === 'school' && isPolygon(el)) {
			drawPolygon(ctx, el.geometry, projector);
			ctx.fillStyle = 'black';
			const { lat, lon } = polygonCentroid(el.geometry);
			drawText(ctx, { lat, lon }, projector, '文');
		}
		ctx.fillStyle = 'black';
		if (el.type === 'node' && el.tags?.amenity === 'place_of_worship' && el.tags?.religion === 'shinto') {
			drawText(ctx, { lat: el.lat!, lon: el.lon! }, projector, '⛩');
		}
		ctx.fillStyle = 'black';
		if (el.type === 'node' && el.tags?.amenity === 'place_of_worship' && el.tags?.religion === 'buddhist') {
			drawText(ctx, { lat: el.lat!, lon: el.lon! }, projector, '卍');
		}
		ctx.fillStyle = 'black';
		if (el.type === 'node' && el.tags?.natural === 'peak') {
			drawText(ctx, { lat: el.lat!, lon: el.lon! }, projector, '▲');
		}
		ctx.fillStyle = '#d32f2f';
		if (el.type === 'node' && el.tags?.amenity === 'hospital') {
			drawText(ctx, { lat: el.lat!, lon: el.lon! }, projector, '㊩');
		}
		//admin border
		ctx.strokeStyle = '#111111';
		if (el.type === 'way' && el.tags?.boundary === 'administrative') {
			// pref
			if (el.tags?.admin_level === '4') {
				ctx.lineWidth = 2.5;
				ctx.setLineDash([20, 4, 3, 3, 3, 4]);
				drawLine(ctx, el.geometry!, projector);
			}
			// muni
			if (el.tags?.admin_level === '7') {
				ctx.lineWidth = 1.5;
				ctx.setLineDash([10, 2, 2, 2]);
				drawLine(ctx, el.geometry!, projector);
			}

			ctx.setLineDash([]);
		}
		ctx.strokeStyle = '#0277bd';
		ctx.lineWidth = 2;
		if (el.type === 'way' && el.tags?.natural === 'coastline') {
			drawLine(ctx, el.geometry!, projector);
		}

		//coastline
		ctx.strokeStyle = '#0277bd';
		ctx.lineWidth = 2;
		if (el.type === 'way' && el.tags?.natural === 'coastline') {
			drawLine(ctx, el.geometry!, projector);
		}
		// railways

		if (el.type === 'way' && el.tags?.railway && el.geometry) {
			if (el.tags?.operator) {
				if (el.tags?.operator.includes('旅客鉄道')) {
					// JR
					ctx.strokeStyle = 'black';
					if (el.tags?.name) {
						if (el.tags?.name.includes('新幹線')) {
							ctx.strokeStyle = '#08afe1';
						}
					}
					ctx.lineWidth = 3.5;
					drawLine(ctx, el.geometry, projector);
					ctx.strokeStyle = 'white';
					ctx.lineWidth = 2;
					ctx.setLineDash([10, 10]);
					drawLine(ctx, el.geometry, projector);
					ctx.setLineDash([]);
				} else {
					// 私铁
					ctx.strokeStyle = 'black';
					ctx.lineWidth = 2.5;
					drawLine(ctx, el.geometry, projector);
				}
			}
		}
	});

	elements.forEach((el) => {
		ctx.fillStyle = '#c62828';
		if (el.type === 'node' && el.tags?.railway === 'station') {
			drawPoint(ctx, { lat: el.lat!, lon: el.lon! }, projector, 5);
			ctx.fillStyle = 'black';
			let text = el.tags?.name;
			if (el.tags?.name.length > 2 && el.tags?.name[0] === '新') {
				text = '新' + '〇'.repeat(el.tags?.name.length - 1);
			} else {
				text = '〇'.repeat(el.tags?.name.length);
			}
			drawText(ctx, { lat: el.lat!, lon: el.lon! }, projector, '　' + text + '駅');
		}
	});

	ctx.strokeStyle = '#cccccc';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.closePath();
	ctx.beginPath();
	ctx.moveTo(0, canvas.height / 2);
	ctx.lineTo(canvas.width, canvas.height / 2);
	ctx.closePath();

	ctx.fillStyle = '#ff2f2f';
	drawPoint(ctx, projector.center, projector, 7);
}

export function renderOSM(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, data: OverpassResponse, projector: Projector) {
	ctx.save();
	ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);

	renderElements(canvas, ctx, data.elements, projector);

	ctx.restore();
}
