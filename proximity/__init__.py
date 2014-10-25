from flask import Flask
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient()
db = client.proximity

@app.route('/')
def index():
    return "Welcome to Proximity."

import view, user_controller, data