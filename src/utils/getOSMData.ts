import JapanStations from '@/assets/japanStationsDataWithoutUnused.json';
import { renderOSM } from '@/utils/mapRenderer';
import { LatLon } from './types';

export const getOSMData = (center: LatLon, radius: number = 3000, onDone: (data: any) => void) => {
	const { lat, lon } = center;

	const query = `
[out:json][timeout:25];

(
  node["railway"="station"](around:${radius},${lat},${lon});
  way["railway"="station"](around:${radius},${lat},${lon});
  relation["railway"="station"](around:${radius},${lat},${lon});

  way["railway"](around:${radius},${lat},${lon});
  relation["railway"](around:${radius},${lat},${lon});

  way["natural"="coastline"](around:${radius},${lat},${lon});

  way["boundary"="administrative"]["admin_level"="4"](around:${radius},${lat},${lon});
  way["boundary"="administrative"]["admin_level"="7"](around:${radius},${lat},${lon});

  way["natural"="water"](around:${radius},${lat},${lon});
  relation["natural"="water"](around:${radius},${lat},${lon});

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
			onDone(data);
		});
};
