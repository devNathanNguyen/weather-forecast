// Get DOM elements by ID
document.getElementById("search-btn").addEventListener("click", () => {
  const cityName = document.getElementById("search-input").value.trim();
  if (cityName) getCityWeather(cityName);
});

// Fetch city coordinates and weather data using OpenWeatherMap API
async function getCityWeather(cityName) {
  const apiKey = "e83bedc83cafb261398bfae9214ff173";
  const coordUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

  try {
    const response = await fetch(coordUrl);
    const data = await response.json();

    // If the city is found, fetch weather data using city coordinates
    if (data.cod === 200) {
      const { lat, lon } = data.coord;
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      // Display current weather and forecast, and add city to search history
      displayCurrentWeather(weatherData);
      displayForecast(weatherData);
      addToSearchHistory(cityName);
    } else {
      alert("City not found. Please enter a valid city name.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Display current weather information for the city
function displayCurrentWeather(weatherData) {
  const { city, list } = weatherData;
  const current = list[0];
  const { main, weather, wind } = current;
  const { temp, humidity } = main;
  const { description, icon } = weather[0];
  const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

  document.getElementById("current-weather-details").innerHTML = `
      <h3>${city.name} (${new Date().toLocaleDateString()})</h3>
      <img src="${iconUrl}" alt="${description}">
      <p>Temperature: ${temp}°C</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${wind.speed} m/s</p>
    `;
}

// Display 5-day forecast for the city
function displayForecast(weatherData) {
  const { list } = weatherData;
  const forecastContainer = document.getElementById("forecast-details");
  forecastContainer.innerHTML = "";

  for (let i = 0; i < list.length; i += 8) {
    const forecast = list[i];
    const { main, weather, wind, dt_txt } = forecast;
    const { temp, humidity } = main;
    const { description, icon } = weather[0];
    const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

    const forecastDiv = document.createElement("div");
    forecastDiv.innerHTML = `
        <h4>${new Date(dt_txt).toLocaleDateString()}</h4>
        <img src="${iconUrl}" alt="${description}">
        <p>Temperature: ${temp}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
      `;
    forecastContainer.appendChild(forecastDiv);
  }
}

// Add city to search history and update localStorage
function addToSearchHistory(cityName) {
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (!searchHistory.includes(cityName)) {
    searchHistory.unshift(cityName);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    updateSearchHistoryList();
  }
}

// Update the search history list on the page
function updateSearchHistoryList() {
  const searchHistoryList = document.getElementById("search-history-list");
  searchHistoryList.innerHTML = "";
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // Iterate through search history and create list items with click event listeners
  searchHistory.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = city;
    li.addEventListener("click", () => getCityWeather(city));
    searchHistoryList.appendChild(li);
  });
}

// Load search history when the page is loaded
updateSearchHistoryList();
