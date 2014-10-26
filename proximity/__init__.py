from flask import Flask
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient()
db = client.proximity

import view, user_controller, data