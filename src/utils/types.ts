export interface LatLon {
	lat: number;
	lon: number;
}

// Overpass element
export interface OverpassElement {
	type: 'node' | 'way' | 'relation';
	id: number;
	lat?: number;
	lon?: number;
	geometry?: LatLon[];
	tags?: Record<string, string>;
}

// Overpass response
export interface OverpassResponse {
	elements: OverpassElement[];
}

export interface Projector {
	center: LatLon;
	scale: number; // px per degree
}
