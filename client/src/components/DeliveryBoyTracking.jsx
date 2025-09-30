import React from "react";
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";

const deliveryBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const DeliveryBoyTracking = ({ data }) => {
  const deliveryBoyLat = data.deliveryBoyLocation.lat;
  const deliveryBoyLng = data.deliveryBoyLocation.lng;
  const customerLat = data.customerLocation.lat;
  const customerLng = data.customerLocation.lng;

  const path = [
    [deliveryBoyLat, deliveryBoyLng],
    [customerLat, customerLng],
  ];

  const center = [deliveryBoyLat, deliveryBoyLng];

  return (
    <div className="w-full h-[400px] mt-3 shadow-md rounded-xl overflow-hidden">
      <MapContainer
        className="w-full h-full"
        center={center}
        zoom={16}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[deliveryBoyLat,deliveryBoyLng]} icon={deliveryBoyIcon}>
            <Popup>Delivery Boy</Popup>
        </Marker>
        <Marker position={[customerLat,customerLng]} icon={customerIcon}>
            <Popup>Customer</Popup>
        </Marker>
        <Polyline positions={path} color="blue" weight={4}/>
      </MapContainer>
    </div>
  );
};

export default DeliveryBoyTracking;
