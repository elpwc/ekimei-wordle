import JapanStations from '@/assets/japanStationsDataWithoutUnused.json';
import { renderOSM } from '@/utils/mapRenderer';
import { LatLon } from './types';

export const getOSMData = async (center: LatLon, radius: number = 3000, onDone: (data: any) => void, onError: (errorText: string) => void) => {
	const { lat, lon } = center;

	const query = `
[out:json][timeout:25];

(
  node["railway"="station"](around:${radius},${lat},${lon});
  node["railway"="tram_stop"](around:${radius},${lat},${lon});

  way["railway"](around:${radius},${lat},${lon});
  relation["railway"](around:${radius},${lat},${lon});

  way["aerialway"](around:${radius},${lat},${lon});
  relation["aerialway"](around:${radius},${lat},${lon});

  way["natural"="coastline"](around:${radius},${lat},${lon});

  way["boundary"="administrative"]["admin_level"="4"](around:${radius},${lat},${lon});
  way["boundary"="administrative"]["admin_level"="7"](around:${radius},${lat},${lon});

  way["natural"="water"](around:${radius},${lat},${lon});
  relation["natural"="water"](around:${radius},${lat},${lon});

  way["highway"~"motorway|trunk|primary|secondary|tertiary"](around:${radius},${lat},${lon});

  way["leisure"="park"](around:${radius},${lat},${lon});
  relation["leisure"="park"](around:${radius},${lat},${lon});

  way["landuse"="industrial"](around:${radius},${lat},${lon});
  relation["landuse"="industrial"](around:${radius},${lat},${lon});

  way["landuse"="grass"](around:${radius},${lat},${lon});
  relation["landuse"="grass"](around:${radius},${lat},${lon});
  way["natural"="wood"](around:${radius},${lat},${lon});
  relation["natural"="wood"](around:${radius},${lat},${lon});
  way["landuse"="orchard"](around:${radius},${lat},${lon});
  relation["landuse"="orchard"](around:${radius},${lat},${lon});
  way["landuse"="farmland"](around:${radius},${lat},${lon});
  relation["landuse"="farmland"](around:${radius},${lat},${lon});
  /*
  way["building"="yes"](around:${radius},${lat},${lon});
  relation["building"="yes"](around:${radius},${lat},${lon});
  */
 
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

	try {
		const res = await fetch('https://overpass-api.de/api/interpreter', {
			method: 'POST',
			body: query,
		});

		if (!res.ok) {
			const text = await res.text();
			console.error('Fetch HTTP error:', res.status, text);
			switch (res.status) {
				case 429:
					onError(res.status + ' Overpass API rate limit exceeded. Please try again later.');
					break;
				case 504:
					onError(res.status + ' Overpass API timeout.');
					break;
				default:
					onError(res.status + ' Overpass API error: ' + res.status);
			}
			return;
		}

		const data = await res.json();
		onDone(data);
	} catch (err) {
		console.error('Fetch network error:', err);
	}
};
