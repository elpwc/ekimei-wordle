import os, json

geojsonfile = "./src/assets/japanStationswithAdmin.geojson"
savefile = "./src/assets/japanStationsDataWithoutUnused.json"

if os.path.exists(geojsonfile):
    with open(geojsonfile, "r", encoding="utf-8") as f:
        stations = json.load(f)
        print(stations)

        res = []
        for station in stations:
            print(station["properties"]["N03_003"])
            if station["properties"]["N03_003"] != None and station["properties"]["N03_003"][-1] == "市":
                muni = station["properties"]["N03_003"]
            else:
                muni = station["properties"]["N03_004"]
            if(station["properties"]["N05_005e"] == "9999"):
                res.append(
                    {
                        "name": station["properties"]["N05_011"],
                        "com": station["properties"]["N05_003"],
                        "line": station["properties"]["N05_002"],
                        "exist": station["properties"]["N05_005e"] == "9999",
                        "coord": station["geometry"]["coordinates"],
                        "pref": station["properties"]["N03_001"],
                        "muni": muni,
                    }
                )

        with open(savefile, "w", encoding="utf-8") as fsave:
            json.dump(res, fsave, ensure_ascii=False)
            print("done")
