import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';

// URL for Indonesia kabupaten/kotamadyas GeoJSON from click_that_hood
const GEOJSON_URL = 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/id-kabupaten.geojson';

// List of 15 kabupaten/kotamadyas in Lampung
const LAMPUNG_KAB_KOTA = [
  'Lampung Barat',
  'Tanggamus',
  'Lampung Selatan',
  'Lampung Timur',
  'Lampung Tengah',
  'Lampung Utara',
  'Way Kanan',
  'Tulang Bawang',
  'Pesawaran',
  'Pringsewu',
  'Mesuji',
  'Tulang Bawang Barat',
  'Pesisir Barat',
  'Kota Bandar Lampung',
  'Kota Metro'
];

export default function LampungMap({ kabKotaStats = [] }) {
  const [indonesiaGeoJSON, setIndonesiaGeoJSON] = useState(null);
  const [lampungGeoJSON, setLampungGeoJSON] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let isMounted = true;
    
    async function fetchGeoJSON() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(GEOJSON_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch GeoJSON: ${response.status}`);
        }
        const geojson = await response.json();
        
        // Filter for Lampung kabupaten/kotamadyas
        const lampungFeatures = geojson.features.filter(
          feature => {
            const name = feature.properties.name;
            return LAMPUNG_KAB_KOTA.includes(name);
          }
        );
        
        if (lampungFeatures.length === 0) {
          throw new Error('No Lampung kabupaten/kotamadyas found in GeoJSON');
        }
        
        // Create a new FeatureCollection with only Lampung features
        const lampungGeoJSON = {
          ...geojson,
          features: lampungFeatures
        };
        
        if (isMounted) {
          setLampungGeoJSON(lampungGeoJSON);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }
    
    fetchGeoJSON();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Create color mapping based on total stats
  const getRegionColor = (regionName) => {
    // Find matching stats - try different matching strategies
    let stats = kabKotaStats.find(s => 
      s.nama && regionName && (
        s.nama.toUpperCase() === regionName ||
        regionName.includes(s.nama.toUpperCase()) ||
        s.nama.toUpperCase().includes(regionName) ||
        // Handle specific name variations
        (s.nama === 'Lampung Barat' && regionName === 'LAMPUNG BARAT') ||
        (s.nama === 'Kota Bandar Lampung' && regionName === 'BANDAR LAMPUNG') ||
        (s.nama === 'Kota Metro' && regionName === 'METRO') ||
        (s.nama === 'Mesuji' && regionName === 'MESUJI') ||
        (s.nama === 'Pesisir Barat' && regionName === 'PESISIR BARAT') ||
        (s.nama === 'Pringsewu' && regionName === 'PRINGSEWU') ||
        (s.nama === 'Tanggamus' && regionName === 'TANGGAMUS') ||
        (s.nama === 'Tulang Bawang' && regionName === 'TULANG BAWANG') ||
        (s.nama === 'Tulang Bawang Barat' && regionName === 'TULANG BAWANG BARAT') ||
        (s.nama === 'Pesawaran' && regionName === 'PESAWARAN') ||
        (s.nama === 'Way Kanan' && regionName === 'WAY KANAN') ||
        (s.nama === 'Lampung Selatan' && regionName === 'LAMPUNG SELATAN') ||
        (s.nama === 'Lampung Timur' && regionName === 'LAMPUNG TIMUR') ||
        (s.nama === 'Lampung Tengah' && regionName === 'LAMPUNG TENGAH') ||
        (s.nama === 'Metro' && regionName === 'METRO') ||
        (s.nama === 'Bandar Lampung' && regionName === 'BANDAR LAMPUNG')
      )
    );
    
    if (!stats || stats.total === 0) {
      return '#e2e8f0'; // gray for no data
    }
    
    // Color based on total count
    const max = Math.max(...kabKotaStats.map(s => s.total), 1);
    const ratio = stats.total / max;
    
    if (ratio > 0.75) return '#dc2626'; // red-600
    if (ratio > 0.5) return '#ef4444';  // red-500
    if (ratio > 0.25) return '#f87171'; // red-400
    return '#fca5a5'; // red-300
  };

  const handleMouseEnter = (geo, event) => {
    const name = geo.properties.name;
    
    // Find matching stats
    const stats = kabKotaStats.find(s => 
      s.nama && name && (
        s.nama.toUpperCase() === name ||
        name.includes(s.nama.toUpperCase()) ||
        s.nama.toUpperCase().includes(name)
      )
    );
    
    setHoveredRegion({
      name: name,
      stats: stats
    });
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredRegion(null);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="w-full h-[450px] bg-slate-100 rounded-lg flex items-center justify-center">
        <p className="text-slate-500">Memuat peta Lampung...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="w-full h-[450px] bg-slate-100 rounded-lg flex items-center justify-center">
        <p className="text-red-500 text-center p-4">
          Gagal memuat peta: {error}
        </p>
      </div>
    );
  }

  // Render the map when we have the data
  return (
    <div className="relative w-full h-[450px] bg-blue-50 rounded-lg overflow-hidden border border-slate-200">
      {/* Title */}
      <div className="absolute top-2 left-2 z-10 bg-white/80 backdrop-blur rounded px-2 py-1">
        <span className="text-xs font-medium text-slate-600">Provinsi Lampung</span>
      </div>
      
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 6000,
          center: [105.3, -4.85] // Approximate center of Lampung
        }}
        width={700}
        height={450}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup center={[105.3, -4.85]} zoom={1}>
          <Geographies geography={lampungGeoJSON}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties.name;
                const isHovered = hoveredRegion?.name === name;
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getRegionColor(name)}
                    stroke={isHovered ? '#1e293b' : '#64748b'}
                    strokeWidth={isHovered ? 2 : 0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { 
                        outline: 'none',
                        stroke: '#1e293b',
                        strokeWidth: 2
                      },
                      pressed: { outline: 'none' }
                    }}
                    onMouseEnter={(e) => handleMouseEnter(geo, e)}
                    onMouseLeave={handleMouseLeave}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      
      {/* Tooltip */}
      {hoveredRegion && (
        <div 
          className="fixed z-50 bg-white rounded-lg shadow-xl border border-slate-200 p-3 min-w-[180px]"
          style={{
            left: tooltipPosition.x + 15,
            top: tooltipPosition.y - 10,
            pointerEvents: 'none'
          }}
        >
          <h3 className="font-bold text-slate-900 mb-2">{hoveredRegion.name}</h3>
          {hoveredRegion.stats ? (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Pendekatan Ruta:</span>
                <span className="font-semibold">{hoveredRegion.stats.dtsen}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pendekatan Usaha:</span>
                <span className="font-semibold">{hoveredRegion.stats.crowdlisting}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Crawling:</span>
                <span className="font-semibold">{hoveredRegion.stats.crawling}</span>
              </div>
              <div className="border-t pt-1 mt-1 flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-red-600">{hoveredRegion.stats.total}</span>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Tidak ada data</p>
          )}
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg">
        <p className="text-xs font-semibold text-slate-600 mb-2">Jumlah Data:</p>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-[#e2e8f0] border border-slate-300"></div>
          <span className="text-xs text-slate-500">0</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-[#fca5a5] border border-slate-300"></div>
          <span className="text-xs text-slate-500">Sedikit</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-[#ef4444] border border-slate-300"></div>
          <span className="text-xs text-slate-500">Sedang</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-[#dc2626] border border-slate-300"></div>
          <span className="text-xs text-slate-500">Banyak</span>
        </div>
      </div>
    </div>
  );
}
