// @ts-nocheck

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./MapboxGLMap.module.scss";

const mapStyles = {
  width: "100vw",
  height: "calc(100vh - 80px)",
  position: "absolute",
};

// https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/
const MapboxGLMap = () => {
  const [map, setMap] = useState(null);
  const [long, setLong] = useState(null);
  const [lat, setLat] = useState(null);
  const [zoom, setZoom] = useState(null);
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoia2thdHplbiIsImEiOiJja2dxc3VxczgwOTd4MnVzODVkbm5kbXhpIn0.8tqTBUcoG5qcY4aVpnQBxA";
    const initializeMap = ({
      setMap,
      mapContainer,
    }: {
      setMap: any;
      mapContainer: any;
    }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
        center: [0, 0],
        zoom: 5,
      });

      map.on("load", () => {
        setMap(map);
        map.resize();
      });

      map.on("move", () => {
        setLat(map.getCenter().lat.toFixed(4));
        setLong(map.getCenter().lng.toFixed(4));
        setZoom(map.getZoom().toFixed(2));
      });
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  return (
    <React.Fragment>
      <div className={styles.sidebarStyle}>
        <div>
          Longitude: {long} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div className={styles.mapWrapper}>
        <div
          ref={(el) => (mapContainer.current = el)}
          className={styles.mapContainer}
        />
      </div>
    </React.Fragment>
  );
};

export default MapboxGLMap;
