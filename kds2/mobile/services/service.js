import * as Location from 'expo-location';
import {paramsResp} from "../mocked/answers";
let getLocation = async (params)=>{
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
    }

    let location = await Location.getCurrentPositionAsync({});
    let locationString =  JSON.stringify(location);
    let params_ = params+""
    params_ = params_.replace("mockedGeolocationInformation", locationString)
    return params_;

}
export {getLocation}