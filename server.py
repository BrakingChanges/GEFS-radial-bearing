from flask import Flask, request


data = {
    "lat": 0,
    "lon": 0
}
app = Flask(__name__)

@app.route("/data", methods=['POST'])
def recieve_loc_data():
    global data
    print(data)

    lat = request.get_json(force=True)['lat']
    lon = request.get_json(force=True)['lon']
    data["lat"] = lat
    data["lon"] = lon
    return 'Success'

@app.route("/data-get")
def send_loc_data():
    print(data)
    return data
    
print('GEOFS Com Online')
