const APIKey = "5d6c592be6cd7dca9263abb86e216d9c";
let cityForm = document.querySelector("#city-form");
let cityInputEl = document.querySelector("#city-input");
let cityButtons = document.querySelector("#city-buttons");

// create global array to store searched cities locally
let cities = [];
// create boolean variable to identify when a city has been typed in or the button selected.
let cityInputFlag = false;

function init() {
  // document.getElementById(".custom-content").children[0].text;
  getStoredCities();
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
    $('.first').modal('show'); // changed to modal
  }
};

function getCityApi(city) {
  let requestUrl =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
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
// display modal messages
// function displayError(errorMessage) {
//   alert(errorMessage);
// }

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

// call the initialise function
init();

// Add click event to cityButtons element
cityButtons.addEventListener("click", function (event) {
  event.stopPropagation();
  let element = event.target;
  cityInputFlag = false;
  getCityApi(element.textContent);
});

// When the html element cityForm is available and if submit button clicked then call formSubmitHandler function
$(document).ready(function () {
  cityForm.addEventListener("submit", formSubmitHandler);
});
