import os, json

geojsonfile = "./src/assets/japan_stations.geojson"
savefile = "./src/assets/japanStationsData.json"

if os.path.exists(geojsonfile):
    with open(geojsonfile, "r", encoding="utf-8") as f:
        stations = json.load(f)
        print(stations)

        res = []
        for station in stations:
            res.append(
                {
                    "name": station["properties"]["N05_011"],
                    "com": station["properties"]["N05_003"],
                    "line": station["properties"]["N05_002"],
                    "exist": station["properties"]["N05_005e"] == "9999",
                    "coord": station["geometry"]["coordinates"],
                }
            )

        with open(savefile, "w", encoding="utf-8") as fsave:
            json.dump(res, fsave, ensure_ascii=False)
            print("done")
