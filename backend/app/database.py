from pymongo import MongoClient

MONGO_URI = "mongodb+srv://signal_scope:Pointbreak*123#@cluster2.vynoqlu.mongodb.net/?appName=Cluster2"

client = MongoClient(MONGO_URI)

db = client["signal_scope"]

reports_collection = db["reports"]