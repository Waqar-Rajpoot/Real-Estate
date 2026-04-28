

"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";

export default function PropertyMapPicker({
  onLocationChange,
  defaultLocation,
}) {
  const [markerPosition, setMarkerPosition] = useState(
    defaultLocation || { lat: 24.8607, lng: 67.0011 },
  );
  const [zoom, setZoom] = useState(13);

  // REMOVED: const mapRef = useRef(null); 

  const handleLocationUpdate = useCallback(
    async (data) => {
      const newPos = { lat: Number(data.lat), lng: Number(data.lng) };
      setMarkerPosition(newPos);
      onLocationChange(data);
    },
    [onLocationChange],
  );

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <div className="w-full space-y-3">
        <label className="text-sm font-medium text-gray-700">
          Property Location
        </label>

        <PlaceAutocomplete onPlaceSelect={handleLocationUpdate} />

        <div className="h-112.5 w-full rounded-xl overflow-hidden border shadow-sm">
          <Map
            defaultCenter={markerPosition} 
            zoom={zoom}
            onZoomChanged={(e) => setZoom(e.detail.zoom)}
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID} 
            gestureHandling={"greedy"}
            disableDefaultUI={false}
          >
            <AdvancedMarker
              position={markerPosition}
              draggable={true}
              onDragEnd={(e) => {
                const newLat = e.latLng.lat();
                const newLng = e.latLng.lng();
                handleLocationUpdate({ lat: newLat, lng: newLng });
              }}
            />
          </Map>
        </div>
        <p className="text-xs text-gray-500 italic">
          * Drag the pin or use the search bar to find a specific city like Sahiwal.
        </p>
      </div>
    </APIProvider>
  );
}

function PlaceAutocomplete({ onPlaceSelect }) {
  const map = useMap(); // This is the preferred way to access the map
  const places = useMapsLibrary('places');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'name', 'formatted_address', 'place_id', 'address_components'],
      componentRestrictions: { country: 'pk' }
    };

    const autocomplete = new places.Autocomplete(inputRef.current, options);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      const components = place.address_components;
      const getComponent = (type) => components.find(c => c.types.includes(type))?.long_name || "";

      const addressData = {
        lat,
        lng,
        formattedAddress: place.formatted_address,
        googlePlaceId: place.place_id,
        city: getComponent('locality') || getComponent('administrative_area_level_2'),
        community: getComponent('neighborhood') || getComponent('sublocality_level_1'),
        subCommunity: getComponent('sublocality_level_2'),
      };

      onPlaceSelect(addressData);

      if (map) {
        map.panTo({ lat, lng });
        map.setZoom(16);
      }
    });
  }, [places, map, onPlaceSelect]);

  return (
    <input
      ref={inputRef}
      className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      placeholder="Search Society, Road or Landmark in Pakistan..."
    />
  );
}