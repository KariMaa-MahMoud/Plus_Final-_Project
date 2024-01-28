// Add this code to your existing JavaScript file

// Function to get weather based on current location
function getCurrentLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const apiKey = "b2a5adcct04b33178913oc335f405433";
      const apiUrl = `https://api.shecodes.io/weather/v1/current?lat=${latitude}&lon=${longitude}&key=${apiKey}&units=metric`;

      axios.get(apiUrl).then(refreshWeather);
    }, handleError);
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

// Function to handle errors in geolocation
function handleError(error) {
  console.error("Error getting geolocation:", error);
  // You can provide a user-friendly message to the user if there's an error
  alert("Error getting your current location. Please try again later.");
}

// Add a click event listener to the current location icon

const currentLocationIcon = document.getElementById("current-location-icon");
currentLocationIcon.addEventListener("click", getCurrentLocationWeather);

function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let date = new Date(response.data.time * 1000);
  let iconElement = document.querySelector("#icon");
  let countryName = response.data.country;
  if (countryName === "United States of America") {
    countryName = "USA";
  } else if (
    countryName === "United Kingdom of Great Britain and Northern Ireland"
  ) {
    countryName = "UK";
  }

  cityElement.innerHTML = `${response.data.city}, ${countryName}`;
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;
  temperatureElement.innerHTML = Math.round(temperature);
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;

  getForecast(response.data.city);
}

function formatDate(date) {
  let currentDate = new Date();
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let dayWord = days[date.getDay()];
  let day = currentDate.getDate();
  if (day < 10) {
    day = `0${day}`;
  }

  let month = currentDate.getMonth() + 1; // Months are zero indexed, so we add 1
  if (month < 10) {
    month = `0${month}`;
  }
  let year = currentDate.getFullYear();

  // Format the date as DD/MM/YYYY
  let formattedDate = day + "/" + month + "/" + year;

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours > 12) {
    return `${dayWord}, ${formattedDate}, ${hours - 12}:${minutes} pm`;
  } else {
    return `${formattedDate}, ${hours}:${minutes} am`;
  }
}

function searchCity(city) {
  let apiKey = "b2a5adcct04b33178913oc335f405433";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(refreshWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");

  searchCity(searchInput.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "b2a5adcct04b33178913oc335f405433";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${formatDay(day.time)}</div>

        <img src="${day.condition.icon_url}" class="weather-forecast-icon" />
        <div class="weather-forecast-temperatures">
          <div class="weather-forecast-temperature">
            <strong>${Math.round(day.temperature.maximum)}&deg;</strong>
          </div>
          <div class="weather-forecast-temperature">${Math.round(
            day.temperature.minimum
          )}&deg;</div>
        </div>
      </div>
    `;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Cairo, Egypt");
