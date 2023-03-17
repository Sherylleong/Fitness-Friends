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

# source: https://data.gov.sg/dataset/f3005537-b958-479c-9ba9-d2adffeb9c73/resource/7bbfa166-5f6d-4fcb-9535-992d68e2080c/download/parks.kml
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

    for f in features:
        # name of location
        name = f.name

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

        db.collection('locations').document().set(data)
        # break

