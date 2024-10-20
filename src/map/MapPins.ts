import Geolocation from '@react-native-community/geolocation';
export class MapPin {
    public latitude: number;
    public longitude: number;
    public timestamp: number;
    constructor(latitude: number, longitude: number, timestamp: number) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = timestamp;
    }
}

let currentLocation: MapPin;
function GetCurrentLocation(): MapPin {
    GetGeolocation();
    return currentLocation;
}
function SetLocation(info: MapPin) {
    currentLocation = info;
}
function GetGeolocation() {
    Geolocation.getCurrentPosition(info => SetLocation(
        new MapPin(
            info.coords.latitude,
            info.coords.longitude,
            info.timestamp)),
        error => console.log(error));
}

let startLocation: MapPin;
function GetStartLocation() {
    return startLocation;
}
function UpdateStartLocation() {
    startLocation = GetCurrentLocation();
}

let endLocation: MapPin;
function GetEndLocation() {
    return endLocation;
}
function UpdateEndLocation() {
    endLocation = GetCurrentLocation();
}


export { GetCurrentLocation, GetStartLocation, UpdateStartLocation, GetEndLocation, UpdateEndLocation };
