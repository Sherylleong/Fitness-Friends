# Author: Ivan
# Created On: 16/3/2023
# Updated On: 16/3/2023

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from fastkml import kml

cred = credentials.Certificate("./cert.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# source: https://data.gov.sg/dataset/eb4ff7e0-765b-4681-bc38-25e5892ce045/resource/18fa1d09-3eeb-4c2e-a682-85adac9df80a/download/nparks-parks-and-nature-reserves-kml.kml
kml_file = "./nparks-parks-and-nature-reserves-kml.kml"
data = open(kml_file)
doc = data.read()
doc = doc.encode()

k = kml.KML()
k.from_string(doc)

# Parsing KML
document = list(k.features())
folders = list(document[0].features())
for folder in folders:
    features = list(folder.features())

    i = 0
    for f in features:
        # name of location
        name = f.name
        if "PG" in name or "Playground" in name:
            continue

        polygons = list(f.geometry.geoms)
        # x
        x = polygons[0].exterior.coords[0][1]
        # y
        y = polygons[0].exterior.coords[0][0]

        # maybe dont include Playgrounds?? Playground have PG in their name

        data = {
            'name': name,
            'x': x,
            'y': y
        }

        print(data)
        db.collection('locations').document().set(data)
        i = i + 1
        if (i >= 5):
            break
        # break

