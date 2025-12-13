[out:json][timeout:25];

(
  node["railway"="station"](around:${radius},${lat},${lng});
  way["railway"="station"](around:${radius},${lat},${lng});
  relation["railway"="station"](around:${radius},${lat},${lng});

  way["railway"](around:${radius},${lat},${lng});
  relation["railway"](around:${radius},${lat},${lng});

  way["natural"="coastline"](around:${radius},${lat},${lng});

  way["natural"="water"]["water"="lake"](around:${radius},${lat},${lng});
  relation["natural"="water"]["water"="lake"](around:${radius},${lat},${lng});

  way["highway"~"motorway|trunk|primary|secondary"](around:${radius},${lat},${lng});

  way["leisure"="park"](around:${radius},${lat},${lng});
  relation["leisure"="park"](around:${radius},${lat},${lng});

  way["landuse"="grass"](around:${radius},${lat},${lng});
  relation["landuse"="grass"](around:${radius},${lat},${lng});

  node["amenity"="university"](around:${radius},${lat},${lng});
  way["amenity"="university"](around:${radius},${lat},${lng});
  relation["amenity"="university"](around:${radius},${lat},${lng});

  node["amenity"="hospital"](around:${radius},${lat},${lng});
  way["amenity"="hospital"](around:${radius},${lat},${lng});
  relation["amenity"="hospital"](around:${radius},${lat},${lng});

  node["leisure"="sports_centre"](around:${radius},${lat},${lng});
  way["leisure"="sports_centre"](around:${radius},${lat},${lng});
  relation["leisure"="sports_centre"](around:${radius},${lat},${lng});

  way["leisure"="stadium"](around:${radius},${lat},${lng});
  relation["leisure"="stadium"](around:${radius},${lat},${lng});
);

out geom;