export interface FareEstimateParams {
  category: string;
  distanceKm: number;
  urgency: "standard" | "express" | "emergency";
  weatherCondition?: "clear" | "rain" | "heatwave";
  isRushHour?: boolean;
}

export interface FareEstimateResult {
  baseFare: number;
  distanceFare: number;
  urgencySurge: number;
  weatherSurge: number;
  suggestedMinFare: number;
  suggestedMaxFare: number;
  recommendedFare: number;
  estimatedArrivalMinutes: number;
  breakdown: string[];
}

const CATEGORY_BASE_RATES: Record<string, { base: number; perKm: number; minDurationMins: number }> = {
  repair: { base: 250, perKm: 18, minDurationMins: 45 },
  tutoring: { base: 350, perKm: 12, minDurationMins: 60 },
  delivery: { base: 80, perKm: 15, minDurationMins: 20 },
  cleaning: { base: 400, perKm: 14, minDurationMins: 90 },
  pets: { base: 180, perKm: 12, minDurationMins: 30 },
  gardening: { base: 220, perKm: 14, minDurationMins: 40 },
  tech: { base: 300, perKm: 16, minDurationMins: 50 },
  default: { base: 200, perKm: 15, minDurationMins: 30 },
};

export function calculateAiFareEstimate(params: FareEstimateParams): FareEstimateResult {
  const categoryConfig = CATEGORY_BASE_RATES[params.category.toLowerCase()] || CATEGORY_BASE_RATES.default;
  
  const baseFare = categoryConfig.base;
  const distanceFare = Math.round(params.distanceKm * categoryConfig.perKm);
  
  // Urgency multiplier
  let urgencyMultiplier = 1.0;
  if (params.urgency === "express") urgencyMultiplier = 1.25;
  if (params.urgency === "emergency") urgencyMultiplier = 1.6;
  const urgencySurge = Math.round((baseFare + distanceFare) * (urgencyMultiplier - 1.0));

  // Weather & traffic factor
  let weatherSurge = 0;
  if (params.weatherCondition === "rain") weatherSurge += 40;
  if (params.weatherCondition === "heatwave") weatherSurge += 25;
  if (params.isRushHour) weatherSurge += 30;

  const totalExact = baseFare + distanceFare + urgencySurge + weatherSurge;
  
  const recommendedFare = Math.round(totalExact / 10) * 10;
  const suggestedMinFare = Math.max(80, Math.round((recommendedFare * 0.88) / 10) * 10);
  const suggestedMaxFare = Math.round((recommendedFare * 1.2) / 10) * 10;

  // ETA calculation based on distance and average Gujarat city traffic (25 km/h)
  const travelMins = Math.round((params.distanceKm / 25) * 60);
  const estimatedArrivalMinutes = Math.max(10, travelMins + (params.urgency === "emergency" ? 5 : 12));

  const breakdown: string[] = [
    `Base Service Charge: ₹${baseFare}`,
    `Distance (${params.distanceKm.toFixed(1)} km @ ₹${categoryConfig.perKm}/km): ₹${distanceFare}`,
  ];
  if (urgencySurge > 0) breakdown.push(`Urgency Priority (${params.urgency.toUpperCase()}): +₹${urgencySurge}`);
  if (weatherSurge > 0) breakdown.push(`Weather & Traffic Adjustment: +₹${weatherSurge}`);

  return {
    baseFare,
    distanceFare,
    urgencySurge,
    weatherSurge,
    suggestedMinFare,
    suggestedMaxFare,
    recommendedFare,
    estimatedArrivalMinutes,
    breakdown,
  };
}
