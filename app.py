
""" Module allowing traversal of airport files"""
from os import walk

from json import load, dump
from flask import Flask, request
from flask_cors import CORS
from requests import get

#AABUJUJUJUJJUUUJUJUJUJUJUJAAAABUJUJUJUJUJUJU
master_approach = {}
files = []
filenamees = []

def save_data(data_save: dict) -> None:
    """ Save captured geofs data to the 'database'(currently a json file)"""
    with open('data.json', 'w', encoding='utf-8') as save_file:
        dump(data_save, save_file)

def load_data() -> dict:
    """ Loads data from the json file"""
    with open('data.json', 'r', encoding='utf-8') as load_file:
        return load(load_file)


for dirpath, dirnames, filenamees in walk('data'):
    files.extend(filenamees)
    break

for file_ in filenamees:
    with open(f'./data/{file_}','r', encoding='utf-8') as f:
        approaches = load(f)
        master_approach[file_] = approaches


res  = get('https://www.simbrief.com/api/xml.fetcher.php?userid=519024&json=1', timeout=10)
data = res.json()


origin_data = data["origin"]
main_data = data["navlog"]["fix"]
destination_data = data["destination"]

route_data = []
route_data.append(origin_data)
route_data.extend(main_data)
route_data.append(destination_data)

route = []
app = Flask(__name__)
app.secret_key = 'wow64'
CORS(app)

data = {
    "heading": None,
    "altitude": None,
    "lat": None,
    "lon": None
}

save_data(data)

@app.route("/data", methods=['POST'])
def recieve_loc_data():
    """ Save data from GEOFS Client"""
    data_ = request.get_json(force=True)
    save_data(data_)

    return {
        'message': 'Success'
    }

@app.route("/data-get")
def send_loc_data():
    """ Send all the location data to the viewer interface"""
    return load_data()


@app.route("/route-data")
def recieve_route():
    """ Sends route data to interface """
    return route_data

@app.route("/get-approach")
def recieve_approach():
    """Get an approach for a specific ICAO code"""
    airport_name = request.args.get('icao')
    approach_name = request.args.get('app_name')
    return master_approach[airport_name[approach_name]]

@app.route("/get-all-approaches")
def recieve_approaches():
    """ Get all the approaches of a specific ICAO code"""

    airport_name = request.args.get('icao')

    return master_approach[airport_name]

if __name__ == "__main__":
    app.run(debug=True, port=5000)
