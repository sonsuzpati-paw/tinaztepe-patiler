import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Animal } from '../types';
import { MapPin, Crosshair, Map as MapIcon, List as ListIcon } from 'lucide-react';

// Fix for default Leaflet markers in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CampusMapProps {
  animals: Animal[];
  onSelectAnimal: (animal: Animal) => void;
}

const DEU_TINAZTEPE_CENTER: [number, number] = [38.371, 27.202]; // Approximate center

const CAMPUS_REGIONS = [
  { id: 'muhendislik', name: 'Mühendislik Fakültesi', lat: 38.3715, lng: 27.2030 },
  { id: 'kutuphane', name: 'Kütüphane', lat: 38.3700, lng: 27.1990 },
  { id: 'hukuk', name: 'Hukuk Fakültesi', lat: 38.3685, lng: 27.1970 },
  { id: 'isletme', name: 'İşletme Fakültesi', lat: 38.3730, lng: 27.2010 },
  { id: 'yemekhane', name: 'Merkezi Yemekhane', lat: 38.3705, lng: 27.2005 },
  { id: 'fen', name: 'Fen Fakültesi', lat: 38.3745, lng: 27.2060 },
  { id: 'yabancidiller', name: 'Yabancı Diller Y.O.', lat: 38.3720, lng: 27.1985 },
];

function LocationButton() {
  const map = useMap();
  
  const handleGetLocation = () => {
    map.locate().on("locationfound", function (e) {
      map.flyTo(e.latlng, map.getZoom());
      // Optional: Add a marker for user's current location
    });
  };

  return (
    <button 
      onClick={handleGetLocation}
      className="absolute top-4 right-4 z-[400] bg-white p-3 rounded-xl shadow-lg border border-slate-200 text-slate-700 hover:text-primary hover:border-primary transition-colors flex items-center gap-2 font-medium"
    >
      <Crosshair className="w-5 h-5" />
      <span className="hidden sm:inline">Konumumu Bul</span>
    </button>
  );
}

export default function CampusMap({ animals, onSelectAnimal }: CampusMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  const animalsWithLocation = animals.filter(a => a.lat && a.lng);

  return (
    <div className="relative w-full h-[600px] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
      <div className="bg-white p-4 border-b border-slate-100 z-10 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-slate-800 font-semibold">
          <MapIcon className="w-5 h-5 text-primary" />
          <span>Kampüs Haritası</span>
        </div>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        >
          <option value="">Tüm Bölgeler</option>
          {CAMPUS_REGIONS.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>
      
      <div className="flex-1 relative">
        <MapContainer 
          center={DEU_TINAZTEPE_CENTER} 
          zoom={16} 
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          <LocationButton />

          {/* Render markers for animals with exact locations */}
          {animalsWithLocation.map(animal => (
            <Marker key={animal.id} position={[animal.lat!, animal.lng!]}>
              <Popup className="rounded-xl overflow-hidden">
                <div className="flex flex-col gap-2 p-1 min-w-[200px]">
                  {animal.photos && animal.photos[0] && (
                    <img 
                      src={animal.photos[0]} 
                      alt={animal.name} 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  <div className="font-semibold text-lg text-slate-800">{animal.name}</div>
                  <div className="text-sm text-slate-500">{animal.location}</div>
                  <button 
                    onClick={() => onSelectAnimal(animal)}
                    className="mt-2 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors py-2 rounded-lg font-medium text-sm"
                  >
                    Profili Görüntüle
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Also render regions if a region is selected to fly to it */}
          {/* This requires a custom component to consume useMap */}
          <RegionFlyTo regionId={selectedRegion} />
        </MapContainer>
      </div>
    </div>
  );
}

function RegionFlyTo({ regionId }: { regionId: string }) {
  const map = useMap();
  
  useEffect(() => {
    if (regionId) {
      const region = CAMPUS_REGIONS.find(r => r.id === regionId);
      if (region) {
        map.flyTo([region.lat, region.lng], 18);
      }
    } else {
      map.flyTo(DEU_TINAZTEPE_CENTER, 16);
    }
  }, [regionId, map]);

  return null;
}
