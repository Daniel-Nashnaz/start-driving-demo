
import dateAndTime from "date-and-time";
const now = new Date();
let dateDemo;

export function randomData(random,tripId) {
    const directions = random.getDirectionsWarning();
    const allowed = random.getRandomSpeedAllowed();
    const current = random.getRandomCurrentSpeed(allowed);
    dateDemo = {
        "Latitude": random.getLatitude(),
        "Longitude": random.getLongitude(),
        "ForwardWarning": {
            "Directions": directions,
            //in meters
            "Distance": random.getDistanceWarning(directions)
        },
        "LaneDepartureWarning": random.getLaneDepartureWarning(),
        //in meters
        "PedestrianAndCyclistCollisionWarning": random.getCollisionWarning(directions),
        "Speed": {
            "SpeedAllowed": allowed,
            "CurrentSpeed": current,
            "SpeedAboveLimit": random.isSpeedAboveLimit(allowed, current)
        },
        "SuddenBraking": random.isSuddenBraking(),
        //in km
        "DistanceTraveledMile": random.getRandomTraveledMile(),
        "TimeFromBeginning": random.timeFormBeginning,
        "About": {
            //"UserName": request.tokenData.userName,
            // "VehicleID": request.tokenData.vehicleNumber,
            "TripID":tripId,
            "TimeStart": dateAndTime.format(now, 'HH:mm:ss YYYY/MM/DD')
        }
    }
    return dateDemo;
}
