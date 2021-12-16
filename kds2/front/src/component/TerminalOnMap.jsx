import { YMaps, Map, Placemark } from "react-yandex-maps";
import React from "react";
const mapData = {
    center: [55.751574, 37.573856],
    zoom: 10,
};

const coordinates = [
    [55.684758, 37.738521],
];

const TerminalOnMap = (props) => {
    let la = props.coords.latitude
    let lo = props.coords.longitude
    return <>
        <YMaps>
            <Map defaultState={{
                center: [la, lo],
                zoom: 15,
            }}>
                <Placemark geometry={[la, lo]} />
            </Map>
        </YMaps>
    </>
}

;

export default TerminalOnMap