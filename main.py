from magvar import magnetic_variation
from math import degrees, radians
from math import radians, sin, cos, atan2, asin
from json import load
from geopy.distance import geodesic
from requests import get


type WaypointCoordinateSet = list[Coordinate]    
type WaypointData = dict[str, WaypointCoordinateSet]
type Coordinate = tuple[float,float]


with open('waypoints.json', 'r') as f:
    waypoints: WaypointData = load(f)


def destination_point(start_point: Coordinate, true_bearing: float, distance: float) -> Coordinate:
    """
    Calculate the destination point given a starting point, true bearing, and distance.
    
    Args:
    start_point (tuple): A tuple containing the latitude and longitude of the starting point in decimal degrees.
    true_bearing (float): The true bearing in degrees (clockwise from north).
    distance (float): The distance in kilometers.
    
    Returns:
    tuple: A tuple containing the latitude and longitude of the destination point in decimal degrees.
    """
    lat1: float = radians(start_point[0])
    lon1: float = radians(start_point[1])
    angular_distance: float = distance / 6371.0  # Earth's radius in kilometers

    # Calculate destination point's latitude
    lat2: float = asin(sin(lat1) * cos(angular_distance) + cos(lat1) * sin(angular_distance) * cos(radians(true_bearing)))

    # Calculate destination point's longitude
    lon2: float = lon1 + atan2(sin(radians(true_bearing)) * sin(angular_distance) * cos(lat1),
                        cos(angular_distance) - sin(lat1) * sin(lat2))

    # Convert back to degrees
    lat2: float = degrees(lat2)
    lon2: float = degrees(lon2)

    return (lat2, lon2)


print('''
===WAYPOINT SELECTION===
      IN this menu, you can select  a waypoint in order to find radials/distance coordinates.
      Please select a waypoint to begin:
''')

waypoint_in: str = input('')

coordinate = None
start_point = None
mag_bearing: float = 0
distance:float = 0 
mag = None

if len(waypoint_in) > 5: 
    waypoint_in.replace(' ','')
    waypoint_in.replace('(', '')
    waypoint_in.replace(')', '')
    coordinate_str: list[str] = waypoint_in.split(',')
    coordinate: Coordinate = tuple(map(lambda x: float(x), coordinate_str))
if coordinate == None:
    try:
        if len(waypoints[waypoint_in]) > 1:
            
            coords = get('http://localhost:5000/data-get')
            print(coords.text)
            (lat,lon) = coords.json()["lat"], coords.json()["lon"]
            print(coords.json())
            print(lat, lon)
            waypoint_options = {i:d for i,d in enumerate(waypoints[waypoint_in])}
            
            print(f'''
            WHICH {waypoint_in}?
                {'\n'.join([f'{i}:{d} {geodesic((lat,lon), (d[0], d[1])).nm} NM' for i,d in enumerate(waypoints[waypoint_in])])}
            ''')
            option = input('')
            option_int = int(option)
            coordinate = waypoint_options[option_int]
        else:
            coordinate = waypoints[waypoint_in][0]

        mag_true = input('Are you planning to use magnetic course(y/n)?')
        if mag_true != 'yes' and mag_true != 'y' and mag_true !='No' and mag_true != 'n':
            print('Unusable input. Will default to magnetic course')
            mag = True
        else:
            mag = True if mag_true == 'y' or mag_true == 'yes' else False

        mag_bearing = float(input('Please enter course(in degrees)'))
        distance  = float(input('Enter distance in NM')) * 1.852

    except KeyError:
        print('Waypoint Not In Database, Try Again!')
    except ValueError:
        print('Your input is not a valid number. Try Again')


 # Example distance in kilometers

# Calculate magnetic variation at the start point
mag_variation:float = degrees(magnetic_variation(2024.04,radians(coordinate[0]), radians(coordinate[1]),0))

destination: Coordinate = destination_point(coordinate, mag_bearing + mag_variation if mag else mag_bearing, distance)
print("Destination Point:", destination)
print("Magnetic Variation:", mag_variation)