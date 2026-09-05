// Free Open-Meteo Weather API - 0 Cost, Zero Key Required
export type WeatherInfo = {
  temperature: number;
  condition: string;
  icon: string;
  isOutdoorWarning: boolean;
  tip: string;
};

const weatherCache = new Map<string, { data: WeatherInfo; timestamp: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 mins

export async function fetchTaskWeather(lat: number = 28.6139, lng: number = 77.2090): Promise<WeatherInfo> {
  const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error("Weather request failed");
    const json = await res.json();
    const weather = json.current_weather;

    const code = weather.weathercode;
    let condition = "Clear";
    let icon = "☀️";
    let isOutdoorWarning = false;
    let tip = "Great conditions for outdoor gigs";

    // Open-Meteo WMO Weather codes
    if (code >= 51 && code <= 67) {
      condition = "Rainy";
      icon = "🌧️";
      isOutdoorWarning = true;
      tip = "Carry rain gear for delivery or gardening tasks";
    } else if (code >= 71 && code <= 77) {
      condition = "Snow / Cold";
      icon = "❄️";
      isOutdoorWarning = true;
      tip = "Dress warmly for outdoor work";
    } else if (code >= 80 && code <= 82) {
      condition = "Rain Showers";
      icon = "🌦️";
      isOutdoorWarning = true;
      tip = "Intermittent rain showers expected";
    } else if (code >= 95) {
      condition = "Thunderstorm";
      icon = "⛈️";
      isOutdoorWarning = true;
      tip = "Indoor tasks recommended due to storms";
    } else if (code >= 1 && code <= 3) {
      condition = "Partly Cloudy";
      icon = "⛅";
      tip = "Pleasant weather for physical tasks";
    }

    const info: WeatherInfo = {
      temperature: Math.round(weather.temperature),
      condition,
      icon,
      isOutdoorWarning,
      tip,
    };

    weatherCache.set(cacheKey, { data: info, timestamp: Date.now() });
    return info;
  } catch {
    // Fallback safe dummy data if offline
    return {
      temperature: 26,
      condition: "Clear",
      icon: "☀️",
      isOutdoorWarning: false,
      tip: "Fair weather for local tasks",
    };
  }
}
