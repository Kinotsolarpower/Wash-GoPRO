// services/mapsService.ts

type TravelInfo = {
  travelTime: number; // in minutes
  fuelCost: number; // in euros
  optimizedRoute: string;
};

/**
 * Simulates calling a mapping API to get travel time and logistics.
 * In a real-world application, this would use an API like Google Maps Distance Matrix.
 */
const getTravelTime = async (origin: string, destination: string): Promise<TravelInfo> => {
  console.log(`Simulating logistics calculation from ${origin} to ${destination}`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // If destination is empty, return 0
  if (!destination.trim()) {
    return { travelTime: 0, fuelCost: 0, optimizedRoute: 'N/A' };
  }

  // Simple pseudo-random calculation based on address length to simulate variability
  const baseTime = 10;
  const variability = (origin.length + destination.length) % 30;
  const travelTime = Math.round(baseTime + variability);
  
  // Simulate fuel cost (e.g., €0.25 per minute of travel)
  const fuelCost = parseFloat((travelTime * 0.25).toFixed(2));

  const optimizedRoute = `Via E40, exit 9. Estimated ${travelTime} min drive.`;
  
  console.log(`Estimated travel time: ${travelTime} minutes, Fuel: €${fuelCost}`);
  return { travelTime, fuelCost, optimizedRoute };
};

export const mapsService = {
  getTravelTime,
};