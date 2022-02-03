from re import M
from typing import BinaryIO
import uuid
from dns.rdatatype import NULL
from flask import render_template, jsonify, request
from flask.json import dump
from pymongo import mongo_client
import qrcode
from PIL import Image
from flask_pymongo import PyMongo
from flask_restful import Resource, Api
from uuid import uuid4
from bson.json_util import dumps,loads
from bson import BSON
from datetime import datetime
import logging
import sys
import json
import base64
from io import BytesIO
from qrcode import base
from app import app


mongo = PyMongo(app, uri='mongodb+srv://mityo:9GJYYrN46bgxOTVT@testcluster.wcqu4.mongodb.net/mityo')
# '10.113.196.175:5000'
api = Api(app)

@app.route("/")
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/qr')
@app.route('/qr/')
def qr():
    return render_template('qr.html')

@app.route('/monitor')
def monitor():
    return render_template('monitor.html')

class QRGen(Resource):
    def get(self,n):
        app_url = request.url_root
        db = mongo.db
        tavoli = db.tavoli
        if tavoli.count_documents({'n_tavolo': n}) == 0:
            tavoli.insert_one({
                'n_tavolo': n
            })
        url = app_url + 'menu/'+ str(n)
        img = qrcode.make(url)
        buffer = BytesIO()
        img.save(buffer, format="JPEG")
        b64 = base64.b64encode(buffer.getvalue())
        return b64.decode("utf-8")

api.add_resource(QRGen, '/genera_qr/<int:n>')


@app.route("/menu/<int:n>")
def menu(n):
    db = mongo.db
    collMenu = db.menu
    listBibite = list(collMenu.find({'$text': {'$search': 'bibite'} }))
    jBibite = loads(dumps(listBibite, indent = 2))
    listBirre = list(collMenu.find({'$text': {'$search': 'birre'} }))
    jBirre = loads(dumps(listBirre, indent = 2))
    listCocktailAn = list(collMenu.find({'$text': {'$search': 'analcolici'} }))
    jCocktailAn= loads(dumps(listCocktailAn, indent = 2))
    listCocktail = list(collMenu.find({'$text': {'$search': 'alcolici'} }))
    jCocktail = loads(dumps(listCocktail, indent = 2))
    listVinoR = list(collMenu.find({'$text': {'$search': 'rosso'} }))
    jVinoR = loads(dumps(listVinoR, indent = 2))
    listVinoB = list(collMenu.find({'$text': {'$search': 'bianco'} }))
    jVinoB = loads(dumps(listVinoB, indent = 2))
    listCaffe = list(collMenu.find({'$text': {'$search': 'caffetteria'} }))
    jCaffe = loads(dumps(listCaffe, indent = 2))
    listApe = list(collMenu.find({'$text': {'$search': 'aperitivi'} }))
    jApe = loads(dumps(listApe, indent = 2))
    return render_template('menu.html', Caffetteria=jCaffe, bibite=jBibite, Aperitivi=jApe, Cocktail=jCocktail, CocktailAn=jCocktailAn, VinoR=jVinoR, VinoB=jVinoB, Birre=jBirre, numeroTavolo=n)
    
class Ordine(Resource):
    def post(data):
        if(request.is_json):
            ordine = request.get_json()
            db = mongo.db
            collOrdini = db.ordini
            collOrdini.insert_one(ordine)
            print(ordine, file=sys.stdout)
            return "1", 200
        else:
            return "0", 400
        
api.add_resource(Ordine, '/ordine')

class MonitorAPI(Resource):
    def get(self):
        # json.dumps(json.JSONDecoder().decode(str_w_quotes))
        db = mongo.db
        collOrdini = db.ordini
        ordiniL = list(collOrdini.find({'isDone' : False}))
        jOrdini = dumps(ordiniL)
        print(ordiniL, file=sys.stdout)
        return ordiniL

api.add_resource(MonitorAPI, '/monitor_get')
