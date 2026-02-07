import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { useTelemetryStore } from "../../context/TelemetryStore";

// Fix Leaflet Icons
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Auto-Center Helper
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function DroneMap() {
  const gps = useTelemetryStore((state) => state.gps);
  const path = useTelemetryStore((state) => state.gpsPath); // Get the path array

  const hasFix = gps.lat !== 0 && gps.lon !== 0;
  const position = hasFix ? [gps.lat, gps.lon] : [51.505, -0.09]; 

  // Path styling
  const pathOptions = { color: 'red', weight: 4 };

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>
        Live Location {hasFix ? <span style={{color:"green"}}>(3D Fix)</span> : <span style={{color:"red"}}>(No Fix)</span>}
      </h3>
      
      <MapContainer 
        center={position} 
        zoom={18} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%", borderRadius: "0 0 10px 10px" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Draw the Red Line Path */}
        {path.length > 1 && <Polyline positions={path} pathOptions={pathOptions} />}

        {/* Draw the Drone Marker */}
        {hasFix && (
          <Marker position={position}>
            <Popup>
              Drone Location <br /> 
              Alt: {gps.alt}m <br />
              Sats: {gps.sats}
            </Popup>
          </Marker>
        )}

        {/* Auto-Follow Logic */}
        {hasFix && <MapUpdater center={position} />}
      </MapContainer>
    </div>
  );
}

const styles = {
  container: {
    height: "400px",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "10px",
    margin: 0,
    borderBottom: "1px solid #ddd",
    textAlign: "center",
    fontSize: "1rem",
    color: "#444"
  }
};