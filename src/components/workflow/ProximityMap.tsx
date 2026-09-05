import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { sound } from "@/services/sound";

export type MapTask = {
  id: string;
  title: string;
  category: string;
  paymentOptional?: number | null;
  location?: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
  };
  distanceKm?: number;
  status?: string;
};

interface ProximityMapProps {
  userLocation?: { lat: number; lng: number };
  tasks: MapTask[];
  onSelectTask?: (taskId: string) => void;
  isDark?: boolean;
}

export default function ProximityMap({
  userLocation = { lat: 28.6139, lng: 77.2090 },
  tasks,
  onSelectTask,
  isDark = true,
}: ProximityMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const circlesGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeFilter, setActiveFilter] = useState<number | null>(null); // null = all, 2, 5, 10
  const [selectedTask, setSelectedTask] = useState<MapTask | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Free CartoDB eye-comfort tile layers
      const tileUrl = isDark
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: "abcd",
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      circlesGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    } else {
      // Update tile layer on theme change
      const tileUrl = isDark
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          layer.setUrl(tileUrl);
        }
      });
    }

    return () => {
      // Map cleanup handled on unmount
    };
  }, [isDark, userLocation.lat, userLocation.lng]);

  // Update Center, Radar Circles & Task Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const circlesGroup = circlesGroupRef.current;
    const markersGroup = markersGroupRef.current;

    if (circlesGroup) circlesGroup.clearLayers();
    if (markersGroup) markersGroup.clearLayers();

    // 1. Helper Center Pulse Marker
    const helperIcon = L.divIcon({
      className: "custom-helper-marker",
      html: `
        <div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
          <div style="position:absolute;inset:-6px;border-radius:50%;background:rgba(99,102,241,0.3);animation:radarPing 2.5s ease-in-out infinite;"></div>
          <div style="width:28px;height:28px;border-radius:50%;background:#6366f1;border:3px solid #ffffff;box-shadow:0 4px 12px rgba(99,102,241,0.5);display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold;">
            📍
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const helperMarker = L.marker([userLocation.lat, userLocation.lng], { icon: helperIcon });
    helperMarker.bindTooltip("Your Location (Helper)", { permanent: false, direction: "top" });
    if (markersGroup) helperMarker.addTo(markersGroup);

    // 2. Proximity Radar Rings (2km, 5km, 10km)
    if (circlesGroup) {
      // 2 km ring (Walking radius - emerald)
      L.circle([userLocation.lat, userLocation.lng], {
        radius: 2000,
        color: "#10b981",
        weight: 1.5,
        opacity: 0.7,
        fillColor: "#10b981",
        fillOpacity: activeFilter === 2 ? 0.12 : 0.04,
        dashArray: "4, 6",
      }).addTo(circlesGroup);

      // 5 km ring (Bike / Scooter radius - indigo)
      L.circle([userLocation.lat, userLocation.lng], {
        radius: 5000,
        color: "#6366f1",
        weight: 1.5,
        opacity: 0.6,
        fillColor: "#6366f1",
        fillOpacity: activeFilter === 5 ? 0.1 : 0.03,
        dashArray: "4, 6",
      }).addTo(circlesGroup);

      // 10 km ring (Drive radius - amber)
      L.circle([userLocation.lat, userLocation.lng], {
        radius: 10000,
        color: "#f59e0b",
        weight: 1.2,
        opacity: 0.5,
        fillColor: "#f59e0b",
        fillOpacity: activeFilter === 10 ? 0.08 : 0.02,
        dashArray: "4, 6",
      }).addTo(circlesGroup);
    }

    // 3. Render Task Pins
    tasks.forEach((task, idx) => {
      // Default nearby offset if no exact lat/lng
      const taskLat = task.location?.lat ?? (userLocation.lat + (Math.sin(idx * 1.5) * 0.022));
      const taskLng = task.location?.lng ?? (userLocation.lng + (Math.cos(idx * 1.5) * 0.022));

      const dist = task.distanceKm ?? 1.8;
      if (activeFilter && dist > activeFilter) return;

      const categoryIcons: Record<string, string> = {
        Cleaning: "✨",
        Repair: "🔧",
        Tutoring: "📚",
        Delivery: "⚡",
        Tech: "💻",
        "Pet Care": "🐾",
        Cooking: "🍳",
        Gardening: "🌱",
      };
      const catIcon = categoryIcons[task.category] || "💼";

      const taskPinIcon = L.divIcon({
        className: "custom-task-pin",
        html: `
          <div style="cursor:pointer;background:${isDark ? "rgba(19,27,46,0.92)" : "rgba(255,255,255,0.96)"};border:2px solid #6366f1;border-radius:20px;padding:4px 9px;display:flex;align-items:center;gap:5px;box-shadow:0 6px 16px rgba(0,0,0,0.3);font-family:inherit;font-size:11px;font-weight:700;color:${isDark ? "#f1f5f9" : "#0f172a"};white-space:nowrap;transition:transform .15s ease;">
            <span>${catIcon}</span>
            <span>₹${task.paymentOptional || 400}</span>
            <span style="font-size:9px;color:#10b981;background:rgba(16,185,129,0.15);padding:1px 4px;border-radius:6px;">${dist.toFixed(1)}km</span>
          </div>
        `,
        iconSize: [90, 30],
        iconAnchor: [45, 15],
      });

      const marker = L.marker([taskLat, taskLng], { icon: taskPinIcon });

      marker.on("click", () => {
        sound.playTap();
        setSelectedTask(task);
        if (onSelectTask) {
          onSelectTask(task.id);
        }
      });

      if (markersGroup) marker.addTo(markersGroup);
    });
  }, [tasks, userLocation, activeFilter, isDark, onSelectTask]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border/40 shadow-xl">
      {/* Map Control Bar */}
      <div
        className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl backdrop-blur-md border border-white/10 shadow-lg"
        style={{ background: isDark ? "rgba(11,15,25,0.85)" : "rgba(255,255,255,0.85)" }}
      >
        <div className="text-[11px] font-bold px-2 py-1 uppercase tracking-wider text-muted-foreground flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Proximity Radar:
        </div>
        {[
          { label: "All Near", value: null },
          { label: "🟢 < 2 km", value: 2 },
          { label: "🔵 < 5 km", value: 5 },
          { label: "🟡 < 10 km", value: 10 },
        ].map((btn) => {
          const isSelected = activeFilter === btn.value;
          return (
            <button
              key={btn.label}
              onClick={() => {
                sound.playTap();
                setActiveFilter(btn.value);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-md"
                  : "hover:bg-accent/30 text-foreground/80"
              }`}
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Selected Task Quick View Modal / Overlay */}
      {selectedTask && (
        <div
          className="absolute bottom-3 left-3 right-3 md:right-auto md:w-80 z-[1000] p-4 rounded-xl backdrop-blur-xl border border-indigo-500/30 shadow-2xl animate-in slide-in-from-bottom-2 duration-200"
          style={{ background: isDark ? "rgba(19,27,46,0.92)" : "rgba(255,255,255,0.95)" }}
        >
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
                {selectedTask.category}
              </span>
              <h4 className="text-sm font-bold text-foreground mt-1 line-clamp-1">
                {selectedTask.title}
              </h4>
            </div>
            <button
              onClick={() => setSelectedTask(null)}
              className="text-muted-foreground hover:text-foreground text-xs p-1"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span>📍 {selectedTask.distanceKm ? `${selectedTask.distanceKm.toFixed(1)} km away` : "Nearby"}</span>
            <span className="font-bold text-emerald-500 text-sm">
              ₹{selectedTask.paymentOptional || 400}
            </span>
          </div>
          <button
            onClick={() => {
              sound.playChime();
              if (onSelectTask) onSelectTask(selectedTask.id);
            }}
            className="w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-xs rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            ⚡ View & Place Bid
          </button>
        </div>
      )}

      {/* Leaflet Canvas */}
      <div ref={mapContainerRef} className="w-full h-80 sm:h-96 z-0" />
    </div>
  );
}
