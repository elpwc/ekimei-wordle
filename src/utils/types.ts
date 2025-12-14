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

export enum AnswerStatus {
	OutOfPref,
	TheSamePref,
	TheSameLine,
	TheSameCom,
	TheSameMuni,

	Correct,
}

export const AnswerStatusIcons = [];

export interface Answer {
	answerText: string;
	stationId: number;
	distanceKm: number;
	bearingDeg: number;
	status: AnswerStatus[];
	isPrefTheSame: boolean;
	isMuniTheSame: boolean;
	isComTheSame: boolean;
	isLineTheSame: boolean;
	isStationTheSame: boolean;
	prefCharStatus: boolean[];
	muniCharStatus: boolean[];
	comCharStatus: boolean[];
	lineCharStatus: boolean[];
	stationCharStatus: boolean[];
}
