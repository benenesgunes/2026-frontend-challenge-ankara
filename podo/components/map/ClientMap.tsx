'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import type { AnyRecord } from '@/store/types';
import { useInvestigationStore } from '@/store/useInvestigationStore';

export default function ClientMap({ records }: { records: AnyRecord[] }) {
  const { setLocationFilter, activeLocationFilter } = useInvestigationStore();
  
  // Extract unique locations and parse their coordinates
  const locationMap = new Map<string, { lat: number, lng: number }>();
  
  records.forEach(r => {
    if (r.location && r.coordinates) {
      if (!locationMap.has(r.location)) {
        const parts = r.coordinates.split(',').map(s => parseFloat(s.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          locationMap.set(r.location, { lat: parts[0], lng: parts[1] });
        }
      }
    }
  });

  const locations = Array.from(locationMap.entries()).map(([name, coords]) => ({ name, ...coords }));
  
  const defaultCenter = [39.92077, 32.85411] as [number, number];
  
  return (
    <MapContainer 
      center={locations.length > 0 ? [locations[0].lat, locations[0].lng] : defaultCenter} 
      zoom={locations.length > 0 ? 12 : 12} 
      className="w-full h-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {locations.map(loc => {
        const isSelected = activeLocationFilter === loc.name;
        
        return (
          <Marker 
            key={loc.name} 
            position={[loc.lat, loc.lng]}
            eventHandlers={{
              click: () => {
                setLocationFilter(isSelected ? null : loc.name);
              }
            }}
          >
            <Popup>
              <span className="font-bold tracking-widest text-[#1a1a1a] uppercase text-[10px]">
                {loc.name}
              </span>
              <br/>
              <span className="text-[9px] opacity-70">
                {isSelected ? 'Click to deselect' : 'Click to filter records'}
              </span>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
