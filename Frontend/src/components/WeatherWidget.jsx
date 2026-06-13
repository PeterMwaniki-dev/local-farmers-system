import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { geocodeLocation, fetchWeatherForecast } from '../services/weatherService';
import LocationSelector from './LocationSelector';

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

// Helper to check for severe alerts
const checkSevereAlerts = (weatherData) => {
  const code = weatherData.current?.weather_code;
  const windSpeed = weatherData.current?.wind_speed_10m;
  const rainProb = weatherData.daily?.precipitation_probability_max?.[0];

  const alerts = [];

  if (code >= 65 && code <= 67) alerts.push('Heavy rain');
  if (code >= 95) alerts.push('Thunderstorm');
  if (windSpeed > 50) alerts.push('Strong wind');
  if (rainProb > 80) alerts.push('High rain probability');

  return alerts;
};

const WeatherWidget = ({ location: initialLocation }) => {
  const navigate = useNavigate();
  const { darkMode } = useSettings();
  const [location, setLocation] = useState(initialLocation || 'Nairobi');
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

  const severeAlerts = weather ? checkSevereAlerts(weather) : [];

  return (
    <div
      onClick={() => navigate('/weather')}
      className={`p-6 rounded-xl shadow-lg transition hover:shadow-xl cursor-pointer ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Weather in {location}
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            At a Glance
          </p>
        </div>
        <svg className="w-10 h-10 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.834a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM6.166 17.834a.75.75 0 001.06 1.06l1.59-1.59a.75.75 0 10-1.06-1.06l-1.59 1.59zM5.25 12a.75.75 0 01-.75.75H2.25a.75.75 0 010-1.5H4.5a.75.75 0 01.75.75zM6.166 6.166a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591z" />
        </svg>
      </div>

      {loading ? (
        <div className="py-4">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-2">
              <div className={`h-8 w-20 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-4 w-32 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className={`text-center py-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
          {error}
        </div>
      ) : weather ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {Math.round(weather.current.temperature_2m)}°C
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {getWeatherDescription(weather.current.weather_code)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`text-xs uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Rain Probability
              </p>
              <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {weather.daily.precipitation_probability_max?.[0]}%
              </p>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`text-xs uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Wind Speed
              </p>
              <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {weather.current.wind_speed_10m} km/h
              </p>
            </div>
          </div>

          {severeAlerts.length > 0 && (
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-900/30 border border-red-700' : 'bg-red-100 border border-red-200'}`}>
              <p className={`text-sm font-semibold ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                ⚠️ {severeAlerts.join(', ')}
              </p>
            </div>
          )}
        </>
      ) : null}

      {/* Location selector at bottom */}
      <div className="mt-4">
        <LocationSelector
          selectedLocation={location}
          onSelectLocation={setLocation}
        />
      </div>
    </div>
  );
};

export default WeatherWidget;
