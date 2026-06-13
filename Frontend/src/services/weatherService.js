import axios from 'axios';

// Create a separate axios instance for Open-Meteo since it's external
const openMeteoClient = axios.create({
  baseURL: '', // will construct full URLs
});

/**
 * Geocode a location name to get coordinates using Open-Meteo Geocoding API
 */
export const geocodeLocation = async (locationName) => {
  const response = await openMeteoClient.get('https://geocoding-api.open-meteo.com/v1/search', {
    params: {
      name: locationName,
      count: 10,
      language: 'en',
      format: 'json'
    }
  });
  return response;
};

/**
 * Fetch weather forecast data from Open-Meteo
 */
export const fetchWeatherForecast = async (latitude, longitude) => {
  const response = await openMeteoClient.get('https://api.open-meteo.com/v1/forecast', {
    params: {
      latitude,
      longitude,
      current: ['temperature_2m', 'precipitation', 'weather_code', 'wind_speed_10m', 'wind_direction_10m'],
      hourly: ['temperature_2m', 'precipitation_probability', 'precipitation', 'soil_moisture_0_to_10cm', 'soil_temperature_0_to_10cm'],
      daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min', 'precipitation_sum', 'precipitation_probability_max'],
      timezone: 'auto'
    }
  });
  return response;
};
