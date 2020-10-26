// @ts-nocheck

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./MapboxGLMap.module.scss";

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
        map.addSource("maine", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-67.13734351262877, 45.137451890638886],
                  [-66.96466, 44.8097],
                  [-68.03252, 44.3252],
                  [-69.06, 43.98],
                  [-70.11617, 43.68405],
                  [-70.64573401557249, 43.090083319667144],
                  [-70.75102474636725, 43.08003225358635],
                  [-70.79761105007827, 43.21973948828747],
                  [-70.98176001655037, 43.36789581966826],
                  [-70.94416541205806, 43.46633942318431],
                  [-71.08482, 45.3052400000002],
                  [-70.6600225491012, 45.46022288673396],
                  [-70.30495378282376, 45.914794623389355],
                  [-70.00014034695016, 46.69317088478567],
                  [-69.23708614772835, 47.44777598732787],
                  [-68.90478084987546, 47.184794623394396],
                  [-68.23430497910454, 47.35462921812177],
                  [-67.79035274928509, 47.066248887716995],
                  [-67.79141211614706, 45.702585354182816],
                  [-67.13734351262877, 45.137451890638886],
                ],
              ],
            },
          },
        });
        map.addLayer({
          id: "maine",
          type: "fill",
          source: "maine",
          layout: {},
          paint: {
            "fill-color": "#088",
            "fill-opacity": 0.8,
          },
        });
      });
      map.addControl(new mapboxgl.NavigationControl());

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
