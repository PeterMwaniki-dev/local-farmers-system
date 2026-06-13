import { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { geocodeLocation, fetchWeatherForecast } from '../services/weatherService';
import LocationSelector from '../components/LocationSelector';

// Helper function to get weather description from WMO code
const getWeatherDescription = (code) => {
  const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Freezing drizzle',
    57: 'Freezing dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Freezing rain',
    67: 'Freezing heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with heavy hail'
  };
  return descriptions[code] || 'Unknown';
};

// Helper to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const WeatherPage = () => {
  const { darkMode } = useSettings();
  const [location, setLocation] = useState('Nairobi');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load weather when location changes
  useEffect(() => {
    const loadWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Geocode location
        const geoResponse = await geocodeLocation(location + ', Kenya');
        if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
          throw new Error('Location not found');
        }
        const { latitude, longitude } = geoResponse.data.results[0];

        // Step 2: Fetch weather data
        const weatherResponse = await fetchWeatherForecast(latitude, longitude);
        setWeather(weatherResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, [location]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Weather Forecast
          </h1>
          <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Detailed agricultural weather information
          </p>
          <LocationSelector
            selectedLocation={location}
            onSelectLocation={setLocation}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
          </div>
        ) : error ? (
          <div className={`text-center py-20 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={`text-xl ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              {error}
            </p>
          </div>
        ) : weather ? (
          <>
            {/* Current Weather */}
            <div className={`p-8 rounded-xl shadow-lg mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {location}, Kenya
                  </h2>
                  <p className={`text-6xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {Math.round(weather.current.temperature_2m)}°C
                  </p>
                  <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {getWeatherDescription(weather.current.weather_code)}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6 md:mt-0">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className={`text-sm uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Wind Speed</p>
                    <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {weather.current.wind_speed_10m} km/h
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className={`text-sm uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rain Probability</p>
                    <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {weather.daily.precipitation_probability_max?.[0]}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 7-Day Forecast */}
            <div className={`p-8 rounded-xl shadow-lg mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                7-Day Forecast
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {weather.daily.time.map((date, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  >
                    <p className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {formatDate(date)}
                    </p>
                    <p className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {Math.round(weather.daily.temperature_2m_max[index])}°C
                    </p>
                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {Math.round(weather.daily.temperature_2m_min[index])}°C
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {getWeatherDescription(weather.daily.weather_code[index])}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Agricultural Metrics */}
            <div className={`p-8 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Agricultural Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-sm uppercase mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Soil Moisture (0-10cm)
                  </p>
                  <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {weather.hourly.soil_moisture_0_to_10cm?.[0]?.toFixed(1)}%
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-sm uppercase mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Soil Temperature (0-10cm)
                  </p>
                  <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {Math.round(weather.hourly.soil_temperature_0_to_10cm?.[0])}°C
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-sm uppercase mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Wind Direction
                  </p>
                  <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {weather.current.wind_direction_10m}°
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-sm uppercase mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Daily Precipitation
                  </p>
                  <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {weather.daily.precipitation_sum?.[0]?.toFixed(1)} mm
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default WeatherPage;
