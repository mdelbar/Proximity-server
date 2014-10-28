from os import environ
from flask import Flask
from pymongo import Connection

MONGOHQ_URL = environ.get('MONGOHQ_URL')

if MONGOHQ_URL:
    """ If we have a MongoHQ URL (available when deployed on Heroku), use that one. """
    connection = Connection(MONGOHQ_URL)
    db = connection[urlparse(MONGOHQ_URL).path[1:]]
else:
    """ If we don't, just connect to localhost with default port """
    connection = Connection('localhost', 27017)
    db = connection['proximity']

app = Flask(__name__)

""" Import view into here so it has access to the app object (for routing) """
import proximity.view