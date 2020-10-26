import React, { useState } from "react";
import { Map, Marker, Popup, TileLayer, Rectangle } from "react-leaflet";
import styles from "./LeafletTest.module.scss";

function LeaftletTest() {
  console.log("LeaftletTest");

  const [bounds, setBounds] = useState<Array<[number, number]>>();
  const position = { lat: 51.505, lng: -0.09 };

  const outer: Array<[number, number]> = [
    [50.505, -29.09],
    [52.505, 29.09],
  ];
  const inner: Array<[number, number]> = [
    [49.505, -2.09],
    [53.505, 2.09],
  ];

  return (
    <div className={styles.MapWrapper}>
      <Map center={position} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </Map>
    </div>
  );
}

export default LeaftletTest;
