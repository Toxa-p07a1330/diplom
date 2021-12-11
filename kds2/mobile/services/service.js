import * as Location from 'expo-location';
let getLocation = async ()=>{
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
    }

    let location = await Location.getCurrentPositionAsync({});
    alert(JSON.stringify(location));

}
export {getLocation}