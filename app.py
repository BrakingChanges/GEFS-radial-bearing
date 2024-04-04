from flask import Flask, request
from flask_cors import CORS
from json import load
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


with open('route.json','r') as f:
    data = load(f)



route_data = data["navlog"]



route = []
app = Flask(__name__)
CORS(app)

@app.route("/data", methods=['POST'])
def recieve_loc_data():
    global data
    
    data = request.get_json(force=True)

    return {
        'message': 'Success'
    }

@app.route("/data-get")
def send_loc_data():
    print(data)
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
    app.run(debug=True, host='0.0.0.0')