from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.debug = True
app.config['MONGO_URI'] = 'mongodb+srv://mityo:9GJYYrN46bgxOTVT@testcluster.wcqu4.mongodb.net/mityo'
app.static_folder = 'static'
mongo = PyMongo(app)

from app import routes