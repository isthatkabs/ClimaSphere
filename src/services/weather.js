const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE = "https://api.openweathermap.org/data/2.5";

export async function getCurrentWeather(city) {
  const res = await fetch(
    `${BASE}/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error("City not found");
  return res.json();
}

export async function getForecast(city) {
  const res = await fetch(
    `${BASE}/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error("Forecast unavailable");
  return res.json();
}

export async function getWeatherByCoords(lat, lon) {
  const res = await fetch(
    `${BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  return res.json();

  navigator.geolocation.getCurrentPosition(
  ({ coords }) => getWeatherByCoords(coords.latitude, coords.longitude),
  () => getCurrentWeather("London") // fallback
);

}