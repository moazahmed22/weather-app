"use strict";

import { adviceQuotes } from './adviceQuotes.js';
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const myRow = document.querySelector("#myRow");
const myLocation = document.querySelector("#locationSelector");
const dateOfTheDay = document.querySelector("header .date-of-day");
let weatherApiKey = "d0638afb4e634362a9c221051252406";
let date = new Date();
dateOfTheDay.innerHTML = `${daysOfWeek[date.getDay()]}, ${
  months[date.getMonth()]
} ${date.getDate()}`;

// set the static html elements
myRow.innerHTML = ` <!-- first section where we view the weather forecast of the current day -->
                    <div id="weatherOfTheDay" class="col-md-3 d-flex flex-column gap-5">
                    </div>

                    <!-- second section to view an image illustrating the weather forecast -->
                    <div class="col-md-6 d-flex justify-content-center align-items-center">
                      <p id="adviceQuote" class="h1">
                      </p>
                    </div>

                    <!-- third section viewing the forecast for the next 3 days -->
                    <div class="position-relative col-md-3 d-flex justify-content-center align-items-start mt-5 mt-md-0">
                      <div class="forecast d-flex flex-column gap-4">
                      </div>
                    </div>`;

// quering the static html elements inside the row
const currentForecast = myRow.querySelector("#weatherOfTheDay");
const quotesContainer = myRow.querySelector("#adviceQuote");
const forecastContainer = myRow.querySelector(".forecast");

// function to display the weather forecast
let displayWeather = ({ location, current, forecastApiData }) => {
  // displaying the current forecast
  currentForecast.innerHTML = ` <div class="container">
                                  <p class="city-name h1 text-capitalize">${location.name}, 
                                    <span class="country text-capitalize">${location.country}</span>
                                  </p>
                                  <p id="degree" class="fw-light digit m-0">
                                    ${current.temp_c}<span class="fs-5 position-relative fw-medium">°c</span>
                                  </p>
                                  <p id="title" class="fs-2 m-0">${current.condition.text}</p>
                                </div>

                              <!-- details of the day's forecast -->
                                <div class="container details d-flex flex-row justify-content-start align-items-center gap-4">
                                  <div class="wind secondary-color">
                                    <div class="">
                                      <p class="m-0">
                                        <i class="fa-solid fa-wind"></i> 
                                        <span>wind</span>
                                      </p>
                                    </div>
                                    <p class="digit fs-4"><span>${current.wind_kph}</span><span>km/h</span></p>
                                  </div>
                                <div class="humidity secondary-color">
                                  <div class="">
                                    <p class="m-0">
                                      <i class="fa-solid fa-droplet"></i> 
                                      <span>humidity</span>
                                    </p>
                                  </div>
                                  <p class="digit fs-4"><span>${current.humidity}</span><span>%</span></p>
                                </div>
                              </div>`;

  // third section showing the forecast for the next 3 days
  forecastContainer.innerHTML = "";
  forecastApiData.forEach((day) => {
    forecastContainer.innerHTML += `<div class="day">
                                      <div class="d-flex justify-content-between align-items-start">
                                        <div class="d-flex gap-4">
                                          <div class="img-container">
                                            <img
                                              src="${day.day.condition.icon}"
                                              alt=""
                                              class="img-fluid"/>
                                          </div>
                                          <div class="details">
                                            <p class="text-capitalize m-0 fw-bold">${
                                              daysOfWeek[
                                                new Date(day.date).getDay()
                                              ]
                                            }
                                            </p>
                                            <p class="secondary-color m-0">${
                                              day.day.condition.text
                                            }</p>
                                          </div>
                                        </div>
                                        <div class="digit secondary-color fw-medium">
                                          ${day.day.maxtemp_c}
                                          <span class="position-relative fs-5">°</span>
                                        </div>
                                      </div>
                                    </div>`;
  });

  forecastContainer.children[0].classList.add("today");
};

//  function to get the weater forecast via API and display it in the DOM
let getForecast = async (location) => {
  try {
    let request = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&days=3&q=${location}`
    );
    let response = await request.json();
    displayWeather({
      location: response.location,
      current: response.current,
      forecastApiData: response.forecast.forecastday,
    });
  } catch (error) {
    console.log(error);
  }
};

// time interval to generate a new quote every 6 seconds
let quotesIndex = 0;
quotesContainer.textContent = adviceQuotes[quotesIndex];
console.log(quotesContainer);
setInterval(() => {
  quotesContainer.textContent = adviceQuotes[quotesIndex];
  quotesIndex = quotesIndex === adviceQuotes.length - 1 ? 0 : quotesIndex + 1;
}, 4000);

// displaying the user's location forecast
let usersForecast = async () => {
  try {
    let req = await fetch(`http://ip-api.com/json/`);
    let res = await req.json();
    let userLocation = res.city;
    await getForecast(userLocation);
  } catch (error) {
    console.error(error);
  }
};

usersForecast();

// event listener to get the forecast of inputed location
myLocation.addEventListener("input", (e) => {
  getForecast(e.target.value);
});
