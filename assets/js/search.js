const APIKey = "5d6c592be6cd7dca9263abb86e216d9c";
var currencyApiKey = "2af4ef798a01b92fe52e4860";
var selectedCurrency = document.getElementsByClassName("active");
var calculate = document.getElementById("calBtn");
var convertedAmountEl = document.getElementById("converted");
var fromCurrency = "";
var localAmount = "";
var visitingCurrency = "";
var searchHistoryEl = document.querySelector(".searchHist");
var savedData = JSON.parse(localStorage.getItem("searches")) || [];
let cityButtons = document.querySelector("#city-buttons");
let cityInputEl = document.querySelector("#city-input");
let cityForm = document.querySelector("#city-form");

// create global array to store searched cities locally
let cities = [];
// create boolean variable to identify when a city has been typed in or the button selected.
let cityInputFlag = false;

let countryDetailsEl = document.querySelector("#country-details");
// let cityButtons = document.querySelector("#city-buttons");
let customHomeButt = document.querySelector(".custom-home-butt");
let customSearch = document.querySelector(".custom-search");

customSearch.setAttribute(
  "style",
  "display:flex;align-items:center;justify-content:center;"
);

function init() {
  // document.getElementById(".custom-content").children[0].text;
  getStoredCities();
  getParams(document.location);
}

// called when the submit button is clicked
let formSubmitHandler = function (event) {
  event.preventDefault();
  event.stopPropagation();

  let city = cityInputEl.value.trim();

  if (city) {
    getCityApi(city);
    cityInputEl.value = "";
  } else {
    $(".first").modal("show"); // changed to modal
  }
};

function getCityApi(city) {
  let requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    APIKey;

  // fetch the weather api data for the selected city using the url
  fetch(requestUrl)
    .then(function (response) {
      // display data not found
      if (response.ok) {
        response.json().then(function (data) {
          // cityInputEl.value = "";
          getStoredCities();
          storeCity(city);
          // call display page and pass query
          let queryString =
            "./search.html?q=" + city + "&country=" + data.sys.country;
          // process the city parameters passed from script.js
          getParams(queryString);
          location.assign(queryString);
        });
      } else {
        //   alert("Error: " + response.statusText);
        $(".two").modal("show"); // changed to modal
      }
    })
    .catch(function (error) {
      // alert("Unable to connect to GitHub");
      $(".three").modal("show"); // changed to modal
    });
}

// The following function renders items in a cities list as <button> elements
function renderCities() {
  // Clear cityButtons element
  cityButtons.innerHTML = "";
  // Render a new li for each todo
  for (let i = 0; i < cities.length; i++) {
    let city = cities[i];

    // create button for the city
    let button = document.createElement("button");
    button.setAttribute("class", "ui grey button row");
    button.setAttribute("style", "margin-bottom:2%;");
    button.textContent = city;

    // add new city to the first in the list of buttons already on display
    if (i === cities.length - 1) {
      cityButtons.prepend(button);
    }
    // add previously searched cities to the display
    else cityButtons.appendChild(button);
  }
}

function storeCity(city) {
  let exists = false;
  for (let i = 0; i < cities.length; i++)
    if (cities[i].toLowerCase() === city.toLowerCase()) exists = true;

  // prevent duplication of cities in array
  if (!exists) {
    if (cities.length === 5)
      // only 5 cities can be stored. Replace last city entered.
      cities[4] = city;
    // add new city to local storage
    else cities.push(city);

    // convert city names to title case
    convertToTitleCase();
    // store cities to local storage
    // Stringify and set key in localStorage to cities array
    localStorage.setItem("cities", JSON.stringify(cities));
  }
}

function convertToTitleCase() {
  // change city to title case
  let tempCity = "";
  // loop through cities
  for (let i = 0; i < cities.length; i++) {
    // convert city to lowercase
    tempCity = cities[i].toLowerCase();
    // split each word into a comma seperated array with a space
    tempCity = tempCity.split(" ");
    // loop through the words in the city string
    for (let x = 0; x < tempCity.length; x++) {
      // convert the first letter of each word to uppercase
      tempCity[x] = tempCity[x].charAt(0).toUpperCase() + tempCity[x].slice(1);
    }
    // join each word in the city together seperated by a space
    cities[i] = tempCity.join(" ");
  }
}

// get cities previous searched from local storages
// create buttons for each city stored
function getStoredCities() {
  // Get stored todos from localStorage
  let storedCities = JSON.parse(localStorage.getItem("cities"));
  // If todos were retrieved from localStorage, update the todos array to it
  if (storedCities !== null) {
    cities = storedCities;
  }

  renderCities();
}

function getParams(queryString) {
  let searchParamsArr = "";
  // Get the search params out of the URL (i.e. `?q=london&format=photo`) and convert it to an array (i.e. ['?q=london', 'format=photo'])
  if (queryString) searchParamsArr = document.location.search.split("&");
  else searchParamsArr = queryString;

  // Get the query and format values
  let queryCity = searchParamsArr[0].split("=").pop();
  let queryCountry = searchParamsArr[1].split("=").pop();

  // get country data
  searchCountryApi(queryCity, queryCountry);
  // gety weather data
  getSearchQuery(queryCity);
}

// get city for weather data
function getSearchQuery(city) {
  if (city) {
    // use city from getParams
    getCoordinates(city);
  } else {
    $(".first").modal("show"); // changed to modal
  }
}

function searchCountryApi(city, country) {
  let locQueryUrl = "https://restcountries.com/v3.1/alpha/";

  // check country available
  if (country) {
    locQueryUrl = locQueryUrl + country;
  }

  // fetch country details from API
  fetch(locQueryUrl)
    .then(function (response) {
      if (!response.ok) {
        $(".two").modal("show"); // changed to modal
        // $(".twoBtn").click(function (event) {
        //   event.preventDefault();
        // });
      }

      return response.json();
    })
    .then(function (countryData) {
      // display error message if country data does not exist
      if (!countryData) {
        console.log("No results found!");
        countryDetailsEl.innerHTML = "<h3>No results found, search again!</h3>";
      } else {
        // create dynamic elements for country data
        let countryDetailsHeader = document.createElement("h1");
        let localStoredCities = JSON.parse(localStorage.getItem("cities"));
        // replace %20 with a space
        city = city.replace("%20", " ");
        // loop through locally stored cities
        for (let i = 0; i < localStoredCities.length; i++) {
          //find the current search to be displayed
          if (localStoredCities[i].toLowerCase() === city.toLowerCase()) {
            countryDetailsHeader.textContent =
              localStoredCities[i] + ", " + countryData[0].name.common;
          }
        }
        // align flag on same line as city name
        countryDetailsHeader.setAttribute("style", "display:inline;");
        // display city image
        let flagImgEl = document.createElement("img");
        // get the countrys flag
        let flag = countryData[0].flags.png;
        flagImgEl.setAttribute("src", `${flag}`);
        flagImgEl.setAttribute("id", "flagImg");
        // flagImgEl.setAttribute("style", "height:4.5%; padding-left:10px; padding-top:5px;");
        countryDetailsEl.append(countryDetailsHeader);
        countryDetailsEl.appendChild(flagImgEl);
        displayDetails(countryData);
      }
    })
    .catch(function (error) {
      // alert("Unable to connect to GitHub");
      $(".three").modal("show"); // changed to modal
    });
}

// display country details
function displayDetails(countryData) {
  // set up `<div>` to hold result content
  let countryCard = document.createElement("div");
  countryCard.setAttribute("style", "padding:22px; font-size:23px;");
  // get population
  let populationEl = document.createElement("p");
  var populationNum = countryData[0].population;
  var abbreviations = ["", "k", "m", "b", "t"];
  var abbreviatedNum = Math.floor(("" + populationNum).length / 3);
  var populationValue = parseFloat(
    (abbreviatedNum != 0
      ? populationNum / Math.pow(1000, abbreviatedNum)
      : populationNum
    ).toPrecision(2)
  );
  if (populationValue % 1 != 0) {
    populationValue = populationValue.toFixed(1);
  }
  var abbreviatedPop = populationValue + abbreviations[abbreviatedNum];

  populationEl.innerHTML = "<strong>Population:</strong> " + abbreviatedPop;
  let languageEl = document.createElement("p");
  // get languages objects
  let languages = countryData[0].languages;
  // // get objects for different languages e.g Eng, SPA
  // let languageKeys = Object.keys(languages);
  // get description for langauge key e.g English
  let language = languages[Object.keys(languages)[0]];
  languageEl.innerHTML = "<strong>Language:</strong> " + language;
  let countryCodeEl = document.createElement("p");
  countryCodeEl.innerHTML =
    "<strong>Country code:</strong> " + countryData[0].cca2;
  let currencyEl = document.createElement("p");
  // get currency objects
  let currencies = countryData[0].currencies;
  // get objects for currencies e.g USD, GBP if country has more than one currency
  let currencyKeys = Object.keys(currencies);
  // select first currency
  let currency = currencyKeys[0];
  visitingCurrency = currency;
  // get symbol for currency
  let currencySymbol = currencies[Object.keys(currencies)[0]].symbol;
  currencyEl.innerHTML =
    "<strong>Currency:</strong> " + currency + " (" + currencySymbol + ")";

  let timezoneEl = document.createElement("p");
  timezoneEl.innerHTML =
    "<strong>Timezone:</strong> " + countryData[0].timezones[0];
  let googleMapsEl = document.createElement("a");
  // get objects for currencies e.g USD, GBP if country has more than one currency
  let googleMaps = countryData[0].maps.googleMaps;
  googleMapsEl.setAttribute("href", `${googleMaps}`);
  googleMapsEl.textContent = "Link to Google Maps";
  googleMapsEl.setAttribute("style", "text-decoration:underline;");

  countryCard.append(populationEl);
  countryCard.append(languageEl);
  countryCard.append(countryCodeEl);
  countryCard.append(currencyEl);
  countryCard.append(timezoneEl);
  countryCard.append(googleMapsEl);
  countryDetailsEl.appendChild(countryCard);
}

function getCoordinates(city) {
  var coordinates =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&appid=8d2766b941018d7a3ac5440bf33f1fc2";

  fetch(coordinates)
    .then(function (response) {
      return response.json();
    })
    .then(function (location) {
      if (!location.length) {
        console.log("No results found!");
      }

      var lat = location[0].lat;
      var lon = location[0].lon;
      var name = location[0].name;

      getWeatherApi(lat, lon, name);
      saveWeatherSearch(lat, lon, name);
    });
}

//getting current weather

function getWeatherApi(lat, lon, name) {
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=hourly,daily&units=metric&appid=8d2766b941018d7a3ac5440bf33f1fc2";

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var dateEl = document.querySelector(".date");
      var iconEl = document.querySelector(".icons");
      //display city name, date and icon
      var unix_timestamp = data.current.dt;
      var date = new Date(unix_timestamp * 1000);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();

      var icon = data.current.weather[0].icon;
      dateEl.textContent =
        "Current Weather (" + day + "/" + month + "/" + year + ")";
      iconEl.innerHTML =
        '<img src="https://openweathermap.org/img/w/' + icon + '.png">';

      //display temp
      var temp = data.current.temp;
      var tempEl = document.querySelector(".temp");
      tempEl.textContent = "Temperature: " + temp + " °C";

      //display wind
      var wind = data.current.wind_speed;
      var windEl = document.querySelector(".wind");
      windEl.textContent = "Wind: " + wind + " MPH";

      //display humidity
      var humidity = data.current.humidity;
      var humidityEl = document.querySelector(".humidity");
      humidityEl.textContent = "Humidity: " + humidity + " %";

      //display UVI
      var uvi = data.current.uvi;
      var uviEl = document.querySelector(".uvi");
      uviEl.innerHTML = "UV Index:  <span>" + uvi + "</span>";
      // change UVI background color depending on figure
      var span = document.querySelector("span");
      if (uvi <= 2) {
        span.style.backgroundColor = "#9cde57";
      } else if ((uvi) => 3 || uvi <= 5) {
        span.style.backgroundColor = "#f0d351";
      } else if ((uvi) => 6 || uvi <= 7) {
        span.style.backgroundColor = "#f29f4b";
      } else if ((uvi) => 8 || uvi <= 10) {
        span.style.backgroundColor = "#ed3e1f";
        span.style.color = "white";
      } else {
        span.style.backgroundColor = "#cc06b8";
        span.style.color = "white";
      }
    });
}

// saving current weather
function saveWeatherSearch(lat, lon, name) {
  var latestSearch = {
    city: name,
    latitude: lat,
    longitude: lon,
  };
}
//------------------- NAV BAR BUTTONS -----------------------

//if user clicks back to home button, go to homepage
$(".logo").click(function () {
  var homePage = "./index.html";
  location.assign(homePage);
});

// if user clicks clear searches button, show modal
$("#btn").click(function () {
  $(".zero").modal("show");
});
// if user clicks cancel button, do nothing
$(".ui.red.basic.cancel.inverted.button").click(function () {
  console.log("Pressed Cancel");
});

// if user clicks OK button, delete recent searches from local storage
function clearSearches() {
  // Delete local storage
  localStorage.clear();
  // call home page
  location.assign("./index.html");
}

$(".zerobtn").click(function () {
  clearSearches();
});

$(".ui.dropdown").dropdown();

//currency coverter API

//adding event to the calculate button
calculate.addEventListener("click", function () {
  var localAmountEl = document.getElementById("fromCurrencyInput");
  localAmount = localAmountEl.value;
  console.log(localAmount);

  fromCurrency = document.getElementsByClassName("text")[0].innerHTML;
  console.log(fromCurrency);

  currencyApi();
});

//function to format the numbers to money
function formatMoney(number, decPlaces, decSep, thouSep) {
  (decPlaces = isNaN((decPlaces = Math.abs(decPlaces))) ? 2 : decPlaces),
    (decSep = typeof decSep === "undefined" ? "." : decSep);
  thouSep = typeof thouSep === "undefined" ? "," : thouSep;
  var sign = number < 0 ? "-" : "";
  var i = String(
    parseInt((number = Math.abs(Number(number) || 0).toFixed(decPlaces)))
  );
  var j = (j = i.length) > 3 ? j % 3 : 0;

  return (
    sign +
    (j ? i.substr(0, j) + thouSep : "") +
    i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
    (decPlaces
      ? decSep +
        Math.abs(number - i)
          .toFixed(decPlaces)
          .slice(2)
      : "")
  );
}

function currencyApi() {
  var currencyApiUrl =
    "https://v6.exchangerate-api.com/v6/" +
    currencyApiKey +
    "/pair/" +
    fromCurrency +
    "/" +
    visitingCurrency;

  console.log(currencyApiUrl);
  console.log(visitingCurrency);

  fetch(currencyApiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log("£1 = " + visitingCurrency + data.conversion_rate);

      var currentRate = data.conversion_rate;
      document.getElementById("currentRate").innerText =
        "Current rate is 1 " +
        fromCurrency +
        " = " +
        visitingCurrency +
        " " +
        currentRate;

      var convertedAmount = localAmount * data.conversion_rate;
      console.log(formatMoney(convertedAmount));

      convertedAmountEl.style.display = "inline-block";

      convertedAmountEl.innerText =
        visitingCurrency + " " + formatMoney(convertedAmount);
    });
}

init();

// Add click event to cityButtons element
cityButtons.addEventListener("click", function (event) {
  event.stopPropagation();
  let element = event.target;
  if (element.nodeName === "BUTTON") {
    cityInputFlag = false;
    getCityApi(element.textContent);
  }
});

// When the html element cityForm is available and if submit button clicked then call formSubmitHandler function
cityForm.addEventListener("submit", formSubmitHandler);
