
// Generate random data within realistic ranges
export const generateMockTelemetryData = () => {
  const now = new Date();
  
  // Generate random values with small variations from previous ones
  const battery = Math.floor(70 + Math.random() * 25); // 70-95%
  const altitude = Math.floor(50 + Math.random() * 20); // 50-70m
  const speed = Math.floor(5 + Math.random() * 10); // 5-15m/s
  
  // Generate coordinates near central park, NYC
  const baseLatitude = 40.785091;
  const baseLongitude = -73.968285;
  const latitude = baseLatitude + (Math.random() - 0.5) * 0.01;
  const longitude = baseLongitude + (Math.random() - 0.5) * 0.01;
  
  return {
    timestamp: now.toISOString(),
    battery,
    altitude,
    speed,
    latitude,
    longitude
  };
};

// Helper function to create simulated data with small variations
// from the previous values for a more realistic appearance
export const createDynamicMockData = (previousData = null) => {
  const now = new Date();
  
  // If no previous data, create base values
  if (!previousData) {
    return generateMockTelemetryData();
  }
  
  // Create small variations from previous values
  const battery = Math.max(0, Math.min(100, previousData.battery + (Math.random() - 0.5) * 2));
  const altitude = Math.max(30, Math.min(100, previousData.altitude + (Math.random() - 0.5) * 3));
  const speed = Math.max(0, Math.min(30, previousData.speed + (Math.random() - 0.5) * 2));
  
  // Slight movement in location
  const latitude = previousData.latitude + (Math.random() - 0.5) * 0.0005;
  const longitude = previousData.longitude + (Math.random() - 0.5) * 0.0005;
  
  return {
    timestamp: now.toISOString(),
    battery: Math.round(battery * 10) / 10,
    altitude: Math.round(altitude * 10) / 10,
    speed: Math.round(speed * 10) / 10,
    latitude,
    longitude
  };
};
