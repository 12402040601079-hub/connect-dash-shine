import React, { useEffect, useState, useRef } from "react";
import { sound } from "@/services/sound";

interface LiveTrackingMapProps {
  taskId?: string;
  taskTitle?: string;
  destinationName?: string;
  helperName?: string;
  helperPhone?: string;
  isDark?: boolean;
}

interface CityRoute {
  name: string;
  city: string;
  route: [number, number][];
  landmarks: string[];
}

const GUJARAT_ROUTES: Record<string, CityRoute> = {
  ahmedabad: {
    name: "SG Highway to Satellite",
    city: "Ahmedabad",
    route: [
      [23.0305, 72.5075], // ISKCON Cross Road, SG Highway
      [23.0335, 72.5140], // Pakwan Cross Road
      [23.0360, 72.5210], // Bodakdev / Judges Bungalow Rd
      [23.0350, 72.5290], // Vastrapur Lake Junction
      [23.0315, 72.5345], // IIM Ahmedabad Road
      [23.0280, 72.5390], // Shivranjani Cross Road
      [23.0250, 72.5440], // Satellite / Shyamal (Destination)
    ],
    landmarks: [
      "Departed from SG Highway Hub",
      "Approaching ISKCON Flyover",
      "Passing Bodakdev / Judges Bungalow Rd",
      "Passing Vastrapur Lake Circle",
      "Near IIM Ahmedabad University",
      "Crossing Shivranjani Crossroads",
      "Arrived at Destination in Satellite!",
    ],
  },
  giftcity: {
    name: "Infocity to GIFT City",
    city: "Gandhinagar",
    route: [
      [23.1930, 72.6315], // Infocity Gandhinagar
      [23.1810, 72.6450], // Bhaijipura Cross Road
      [23.1670, 72.6680], // PDPU Junction
      [23.1585, 72.6840], // GIFT City Boulevard
      [23.1550, 72.6910], // GIFT Diamond Tower (Destination)
    ],
    landmarks: [
      "Started at Infocity Hub",
      "Cruising Bhaijipura Highway",
      "Passing PDPU Knowledge Corridor",
      "Entering GIFT City Boulevard",
      "Arrived at GIFT City Fintech Tower!",
    ],
  },
  surat: {
    name: "Adajan to Vesu Tech Hub",
    city: "Surat",
    route: [
      [21.1980, 72.7950], // Adajan Circle
      [21.1780, 72.8020], // Athwa Gate
      [21.1550, 72.7750], // Dumas Road / VR Mall
      [21.1390, 72.7680], // Vesu Hub (Destination)
    ],
    landmarks: [
      "Dispatched from Adajan Hub",
      "Crossing Athwa Gate Bridge",
      "Passing Dumas Road Mall Corridor",
      "Arrived at Vesu Tech Residency!",
    ],
  },
};

export default function LiveTrackingMap({
  taskId = "task_gj_101",
  taskTitle = "Air Conditioner Filter Deep Cleaning",
  destinationName = "Satellite, Ahmedabad, Gujarat",
  helperName = "Kishan Patel (Top Rated)",
  helperPhone = "+91 98250 12345",
  isDark = true,
}: LiveTrackingMapProps) {
  const [selectedCityKey, setSelectedCityKey] = useState<string>("ahmedabad");
  const [mapType, setMapType] = useState<"m" | "k" | "p">("m"); // m = roadmap, k = satellite, p = terrain
  const [zoomLevel, setZoomLevel] = useState<number>(15);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [routeIndex, setRouteIndex] = useState<number>(0);
  const [speedKmh, setSpeedKmh] = useState<number>(34);
  const [sosActive, setSosActive] = useState<boolean>(false);

  // User Real GPS Tracking Mode
  const [isTrackingUserLocation, setIsTrackingUserLocation] = useState<boolean>(false);
  const [userRealCoords, setUserRealCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const activeCity = GUJARAT_ROUTES[selectedCityKey] || GUJARAT_ROUTES.ahmedabad;
  const currentRoute = activeCity.route;
  const currentCoord = currentRoute[routeIndex] || currentRoute[0];
  const destCoord = currentRoute[currentRoute.length - 1];

  const totalSteps = currentRoute.length;
  const remainingSteps = totalSteps - 1 - routeIndex;
  const remainingDistanceKm = Math.max(0.1, remainingSteps * 0.5).toFixed(1);
  const remainingMinutes = Math.max(1, Math.round(remainingSteps * 1.5));
  const currentLandmark = activeCity.landmarks[routeIndex] || "En route in Gujarat";

  // Coordinates displayed in Google Maps
  const displayLat = isTrackingUserLocation && userRealCoords ? userRealCoords.lat : currentCoord[0];
  const displayLng = isTrackingUserLocation && userRealCoords ? userRealCoords.lng : currentCoord[1];

  // Route Simulation Timer
  useEffect(() => {
    if (!isSimulating || isTrackingUserLocation) return;

    const interval = window.setInterval(() => {
      setRouteIndex((prev) => {
        if (prev >= totalSteps - 1) {
          sound.playSuccess();
          return totalSteps - 1;
        }
        setSpeedKmh(Math.floor(28 + Math.random() * 14));
        return prev + 1;
      });
    }, 3200);

    return () => window.clearInterval(interval);
  }, [isSimulating, isTrackingUserLocation, totalSteps]);

  // Handle Real GPS Geolocation Tracking
  const toggleUserGpsTracking = () => {
    if (isTrackingUserLocation) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsTrackingUserLocation(false);
      sound.playTap();
      return;
    }

    if (!("geolocation" in navigator)) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    sound.playTap();
    setGeoError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserRealCoords({
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
          accuracy: Math.round(pos.coords.accuracy),
        });
        setIsTrackingUserLocation(true);
        setIsSimulating(false);
      },
      (err) => {
        setGeoError(err.message || "Failed to retrieve real GPS location.");
        setIsTrackingUserLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
    );
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Google Maps Directions link
  const googleDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${displayLat},${displayLng}&destination=${destCoord[0]},${destCoord[1]}&travelmode=driving`;

  // Dynamic Google Maps iframe embed
  const googleMapEmbedUrl = `https://maps.google.com/maps?q=${displayLat},${displayLng}&t=${mapType}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed&hl=en`;

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-indigo-500/30 shadow-2xl"
      style={{
        background: isDark ? "#0B0F19" : "#FFFFFF",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Top Telemetry Header */}
      <div
        className="p-4 border-b border-border/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-3"
        style={{ background: isDark ? "rgba(17,24,39,0.94)" : "rgba(248,250,252,0.98)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center text-xl shadow-lg">
            🗺️
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                GOOGLE MAP LIVE TRACKER
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                {isTrackingUserLocation ? "📍 Live User GPS" : `${activeCity.city} (${activeCity.name})`}
              </span>
            </div>
            <h3 className="text-sm font-bold text-foreground mt-0.5">{taskTitle}</h3>
          </div>
        </div>

        {/* City & Map Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* City Selector */}
          <select
            value={selectedCityKey}
            onChange={(e) => {
              sound.playTap();
              setSelectedCityKey(e.target.value);
              setRouteIndex(0);
              setIsTrackingUserLocation(false);
            }}
            className="px-3 py-1.5 rounded-xl border border-border text-xs font-semibold bg-input/80 text-foreground cursor-pointer focus:outline-none"
          >
            <option value="ahmedabad">Ahmedabad (SG Highway)</option>
            <option value="giftcity">Gandhinagar (GIFT City)</option>
            <option value="surat">Surat (Vesu Hub)</option>
          </select>

          {/* Map Type: Roadmap / Satellite / Terrain */}
          <div className="bg-input/60 p-1 rounded-xl border border-border/40 flex items-center gap-1">
            <button
              onClick={() => {
                sound.playTap();
                setMapType("m");
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                mapType === "m" ? "bg-indigo-600 text-white shadow-md" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Roadmap
            </button>
            <button
              onClick={() => {
                sound.playTap();
                setMapType("k");
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                mapType === "k" ? "bg-indigo-600 text-white shadow-md" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => {
                sound.playTap();
                setMapType("p");
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                mapType === "p" ? "bg-indigo-600 text-white shadow-md" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Terrain
            </button>
          </div>

          {/* Real GPS Toggle */}
          <button
            onClick={toggleUserGpsTracking}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isTrackingUserLocation
                ? "bg-emerald-600 text-white shadow-lg animate-pulse"
                : "border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
            }`}
          >
            {isTrackingUserLocation ? "📍 Tracking My GPS" : "📡 Track My Device"}
          </button>
        </div>
      </div>

      {geoError && (
        <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 text-xs text-red-400 font-medium">
          ⚠️ {geoError}
        </div>
      )}

      {/* Main Google Maps Embed View */}
      <div className="relative w-full h-[420px] sm:h-[480px]">
        <iframe
          title="Google Maps MicroLink Tracking"
          width="100%"
          height="100%"
          style={{ border: 0, filter: isDark && mapType === "m" ? "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)" : "none" }}
          loading="lazy"
          allowFullScreen
          src={googleMapEmbedUrl}
        />

        {/* Floating Telemetry HUD Over Google Maps */}
        <div
          className="absolute top-3 left-3 right-3 sm:right-auto sm:w-84 z-10 p-4 rounded-2xl backdrop-blur-xl border border-white/15 shadow-2xl"
          style={{
            background: isDark ? "rgba(11,15,25,0.88)" : "rgba(255,255,255,0.92)",
            maxWidth: 360,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-bold text-foreground">
                {isTrackingUserLocation
                  ? "Your Real GPS Coordinates"
                  : routeIndex >= totalSteps - 1
                  ? "Helper Arrived at Job Site! 🎉"
                  : "Helper En Route in Gujarat 🛵"}
              </span>
            </div>
            {!isTrackingUserLocation && (
              <span className="text-xs font-mono font-bold text-indigo-400">{speedKmh} km/h</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2.5 p-2 rounded-xl bg-input/40 text-center border border-border/30">
            <div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground">
                {isTrackingUserLocation ? "Accuracy" : "Est. Arrival"}
              </div>
              <div className="text-base font-extrabold text-foreground">
                {isTrackingUserLocation ? `±${userRealCoords?.accuracy || 12}m` : `${remainingMinutes} mins`}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground">
                {isTrackingUserLocation ? "Latitude / Longitude" : "Distance Left"}
              </div>
              <div className="text-base font-extrabold text-emerald-400">
                {isTrackingUserLocation
                  ? `${userRealCoords?.lat || displayLat}`
                  : `${remainingDistanceKm} km`}
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="text-sm">📍</span>
            <span className="font-semibold text-foreground truncate">
              {isTrackingUserLocation ? `Coords: ${displayLat}, ${displayLng}` : currentLandmark}
            </span>
          </div>
        </div>

        {/* Floating Google Maps Navigation Link */}
        <a
          href={googleDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sound.playTap()}
          className="absolute bottom-4 right-4 z-10 px-3.5 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-2xl flex items-center gap-2 border border-slate-200 hover:scale-105 transition-all text-decoration-none"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg"
            alt="Google Maps"
            style={{ width: 16, height: 16 }}
          />
          Open Turn-by-Turn in Google Maps
        </a>
      </div>

      {/* Helper Details & Quick Controls Bar */}
      <div
        className="p-4 border-t border-border/40 flex flex-wrap items-center justify-between gap-3"
        style={{ background: isDark ? "rgba(17,24,39,0.96)" : "rgba(248,250,252,0.98)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-500 text-white flex items-center justify-center font-bold text-base shadow-md">
            KP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-foreground">{helperName}</h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                ⭐ 4.9 (52 Verified Tasks)
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Vehicle: Honda Activa 6G (GJ-01-XX-9421) · Ahmedabad</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {!isTrackingUserLocation && (
            <button
              onClick={() => {
                sound.playTap();
                setIsSimulating((p) => !p);
              }}
              className="px-3 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-input transition-all"
            >
              {isSimulating ? "⏸️ Pause Drive" : "▶️ Resume Drive"}
            </button>
          )}

          <a
            href={`tel:${helperPhone}`}
            onClick={() => sound.playTap()}
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 text-decoration-none"
          >
            📞 Call {helperPhone}
          </a>

          {/* WhatsApp Guardian SOS Link */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `🚨 MicroLink Guardian Live Beacon: Tracking active gig "${taskTitle}". Current Gujarat Landmark: ${currentLandmark}. Live GPS: https://maps.google.com/?q=${displayLat},${displayLng}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playTap()}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 text-decoration-none"
            title="Share live location with WhatsApp emergency contacts"
          >
            💬 WhatsApp Beacon
          </a>

          <button
            onClick={() => {
              sound.playChime();
              setSosActive((s) => !s);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              sosActive
                ? "bg-red-600 text-white shadow-lg"
                : "border border-red-500/40 text-red-400 hover:bg-red-500/10"
            }`}
          >
            🚨 {sosActive ? "Gujarat Police 112 Dispatched!" : "Gujarat SOS (112)"}
          </button>
        </div>
      </div>
    </div>
  );
}
