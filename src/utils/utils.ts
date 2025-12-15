import { Answer, LatLon } from './types';

export const getMaskedStationName = (stationName: string) => {
	if (stationName.length > 2 && stationName[0] === '新') {
		return '新' + '〇'.repeat(stationName.length - 1);
	}
	if (Math.random() > stationName.length ** -0.9) {
		let pickedCount = Math.round(Math.random() * (stationName.length - 1));
		if (pickedCount === 0) {
			pickedCount = 1;
		}
		const picked = randomPickFromTo(0, stationName.length, pickedCount).sort((a, b) => a - b);
		let res = '';
		//console.log(picked);
		picked.forEach((pickedIndex, index) => {
			if (index === 0) {
				res += '〇'.repeat(stationName.substring(0, pickedIndex).length);
			} else {
				res += '〇'.repeat(stationName.substring(picked[index - 1] + 1, pickedIndex).length);
			}
			res += stationName.substring(pickedIndex, pickedIndex + 1);
		});

		res += '〇'.repeat(stationName.substring(picked[picked.length - 1] + 1, stationName.length).length);
		return res;
	}

	return '〇'.repeat(stationName.length);
};

function randomPick<T>(arr: readonly T[], n: number): T[] {
	if (n >= arr.length) return [...arr];
	const copy = [...arr];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy.slice(0, n);
}

function randomPickFromTo(from: number, to: number, n: number): number[] {
	if (!Number.isInteger(from) || !Number.isInteger(to) || from > to) {
		return [];
	}

	const length = to - from + 1;
	if (n >= length) {
		return Array.from({ length }, (_, i) => from + i);
	}

	const arr = Array.from({ length }, (_, i) => from + i);
	// Fisher–Yates
	for (let i = 0; i < n; i++) {
		const j = i + Math.floor(Math.random() * (length - i));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr.slice(0, n);
}

export function distanceAndBearing(from: [number, number], to: [number, number]): { distanceKm: number; bearingDeg: number } {
	if (from[0] === to[0] && from[1] === to[1]) {
		return { distanceKm: 0, bearingDeg: -1 };
	}

	/** R earth */
	const R = 6371;

	const toRad = (deg: number) => (deg * Math.PI) / 180;
	const toDeg = (rad: number) => (rad * 180) / Math.PI;

	const φ1 = toRad(from[0]);
	const φ2 = toRad(to[0]);
	const Δφ = toRad(to[0] - from[0]);
	const Δλ = toRad(to[1] - from[1]);

	const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distanceKm = R * c;

	const y = Math.sin(Δλ) * Math.cos(φ2);
	const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

	let bearingDeg = toDeg(Math.atan2(y, x));
	bearingDeg = (bearingDeg + 360) % 360;

	return { distanceKm, bearingDeg };
}

export const getEmojiFromDegree = (degree: number) => {
	if (degree === -1) {
		return '🎉';
	}
	const k = degree / 22.5;
	//console.log(degree, k);
	if ((k >= 0 && k < 1) || (k >= 15 && k <= 16)) {
		return '⬅️';
	} else if (k >= 1 && k < 3) {
		return '↖️';
	} else if (k >= 3 && k < 5) {
		return '⬆️';
	} else if (k >= 5 && k < 7) {
		return '↗️';
	} else if (k >= 7 && k < 9) {
		return '➡️';
	} else if (k >= 9 && k < 11) {
		return '↘️';
	} else if (k >= 11 && k < 13) {
		return '⬇️';
	} else if (k >= 13 && k < 15) {
		return '↙️';
	} else {
		return '⏺️';
	}
};

export const getDistanceBorderColor = (distance: number) => {
	if (distance === 0) {
		return '#1d9222';
	} else if (distance > 0 && distance <= 5) {
		return '#6cbd28';
	} else if (distance > 5 && distance <= 10) {
		return '#bdba28';
	} else if (distance > 10 && distance <= 25) {
		return '#c6b90e';
	} else if (distance > 25 && distance <= 50) {
		return '#e19c10';
	} else if (distance > 50 && distance <= 100) {
		return '#f26500';
	} else if (distance > 100 && distance <= 300) {
		return '#f20000';
	} else if (distance > 300 && distance <= 500) {
		return '#8e0000';
	} else if (distance > 500) {
		return '#470012';
	}
};

export const getEmojiFromDistance = (distance: number) => {
	const list = ['🅾️', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
	return list[Math.round(distance / 10) > 10 ? 10 : Math.round(distance / 10)];
};

export const wordleCompare = (word1: string, word2: string): boolean[] => {
	const res = [];

	for (let i = 0; i < word1.length; i++) {
		res.push(word2.includes(word1[i]));
	}
	return res;
};

export const getShareText = (answers: Answer[]) => {
	let res = '#駅Wordle\r\n';
	answers.forEach((answer) => {
		if (answer.isPrefTheSame) {
			res += '🟩';
		} else if (answer.prefCharStatus.includes(true)) {
			res += '🟨';
		} else {
			res += '⬜';
		}
		if (answer.isMuniTheSame) {
			res += '🟩';
		} else if (answer.muniCharStatus.includes(true)) {
			res += '🟨';
		} else {
			res += '⬜';
		}
		if (answer.isComTheSame) {
			res += '🟩';
		} else if (answer.comCharStatus.includes(true)) {
			res += '🟨';
		} else {
			res += '⬜';
		}
		if (answer.isLineTheSame) {
			res += '🟩';
		} else if (answer.lineCharStatus.includes(true)) {
			res += '🟨';
		} else {
			res += '⬜';
		}
		if (answer.isStationTheSame) {
			res += '🟩';
		} else if (answer.stationCharStatus.includes(true)) {
			res += '🟨';
		} else {
			res += '⬜';
		}

		res += getEmojiFromDegree(answer.bearingDeg) + getEmojiFromDistance(answer.distanceKm);
		res += '\r\n';
	});
	res += 'https://elpwc.com/ekiwordle';

	return res;
};
