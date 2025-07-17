import { useState } from "react";
import "./styles/weatherStyles.css";

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "a9955960399fed5fb62d0cdc266c657d";

const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(1);

export const WeatherApp = () => {
  const [inputValue, setInputValue] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    if (!inputValue.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${BASE_URL}?q=${encodeURIComponent(inputValue)}&appid=${API_KEY}`
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Ciudad no encontrada");
      }
      
      setWeatherData(data);
    } catch (err) {
      setWeatherData(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchWeatherData();
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Aplicación de Clima</h1>

      <div className="row justify-content-center mb-4">
        <div className="col-md-8 col-lg-6">
          <form onSubmit={handleSubmit} className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ej: Madrid, ES"
              aria-label="Ciudad para buscar clima"
            />
            <button 
              type="submit" 
              className="btn btn-primary px-4"
              disabled={!inputValue.trim() || loading}
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </form>
        </div>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      {/* Mensajes de error */}
      {error && (
        <div className="alert alert-danger text-center">
          {error}
        </div>
      )}

      {/* Tarjeta de resultados */}
      {weatherData && (
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card">
              <div className="card-body text-center">
                <h2 className="card-title h5">
                  {weatherData.name}, {weatherData.sys?.country}
                </h2>
                
                {weatherData.weather?.[0] && (
                  <div className="my-3">
                    <img
                      src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                      alt={weatherData.weather[0].description}
                      className="img-fluid"
                      style={{ width: "80px" }}
                    />
                    <p className="text-capitalize mb-0">
                      {weatherData.weather[0].description}
                    </p>
                  </div>
                )}

                <div className="row mt-3">
                  <div className="col-6">
                    <p className="mb-2">
                      <strong>Temperatura:</strong>
                      <br />
                      {kelvinToCelsius(weatherData.main.temp)}°C
                    </p>
                    <p className="mb-2">
                      <strong>Mínima:</strong>
                      <br />
                      {kelvinToCelsius(weatherData.main.temp_min)}°C
                    </p>
                  </div>
                  <div className="col-6">
                    <p className="mb-2">
                      <strong>Sensación:</strong>
                      <br />
                      {kelvinToCelsius(weatherData.main.feels_like)}°C
                    </p>
                    <p className="mb-2">
                      <strong>Máxima:</strong>
                      <br />
                      {kelvinToCelsius(weatherData.main.temp_max)}°C
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="mb-1">
                    <strong>Humedad:</strong> {weatherData.main.humidity}%
                  </p>
                  <p className="mb-1">
                    <strong>Presión:</strong> {weatherData.main.pressure} hPa
                  </p>
                  <p className="mb-0">
                    <strong>Viento:</strong> {weatherData.wind?.speed} m/s
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};