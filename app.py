from flask import Flask, request
from flask_cors import CORS
from json import load
from requests import get
from os import walk
from os import system


master_approach = {}
files = []

for dirpath, dirnames, filenamees in walk('data'):
    files.extend(filenamees)
    break

for file_ in filenamees:
    with open(f'./data/{file_}','r') as f:
        approaches = load(f)
        master_approach[file_] = approaches


res  = get('https://www.simbrief.com/api/xml.fetcher.php?userid=519024&json=1')
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
CORS(app)

data = {
    "lat": None,
    "lon": None,
    "heading": None,
    "altitude": None
}

@app.route("/data", methods=['POST'])
def recieve_loc_data():
    global data
    
    data = request.get_json(force=True)

    return {
        'message': 'Success'
    }

@app.route("/data-get")
def send_loc_data():
    return data


@app.route("/route-data")
def recieve_route():
    return route_data

@app.route("/get-approach")
def recieve_approach():
    airport_name = request.args.get('icao')
    approach_name = request.args.get('app_name')
    return master_approach[airport_name[approach_name]]

@app.route("/get-all-approaches")
def recieve_approaches():
    airport_name = request.args.get('icao')

    return master_approach[airport_name]

if __name__ == "__main__":
    app.run(debug=True, port=5000)