var searchHistoryEl = document.querySelector(".searchHist");
var savedData = JSON.parse(localStorage.getItem("searches")) || [];

function getSearchQuery() {
  //get search parameters out of the URL
  var searchParams = document.location.search;
  //removes last element from array and returns that element
  var city = searchParams.split('=').pop();
  console.log(city);
  searchCountryApi(city);
  getCoordinates(city);
}

function searchCountryApi(city) {
  //INSERT COUNTRY API HERE
}

// Weather API search

function getCoordinates(city) {
  var coordinates = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=8d2766b941018d7a3ac5440bf33f1fc2';

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
  var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly,daily&units=metric&appid=8d2766b941018d7a3ac5440bf33f1fc2';

  fetch(requestUrl)
  .then(function (response) {
      return response.json();
  })
  .then(function (data) {
      var dateEl = document.querySelector(".date");
      var iconEl = document.querySelector(".icon");
      //display city name, date and icon
      var unix_timestamp = data.current.dt;
      console.log(unix_timestamp);
      var date = new Date(unix_timestamp * 1000);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date. getDate();

      var icon = data.current.weather[0].icon;
      console.log(icon);
      dateEl.textContent = "Current Weather (" + day + "/" + month + "/" + year + ")"; 
      iconEl.innerHTML = '<img src="https://openweathermap.org/img/wn/' + icon + '@2x.png">';

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
          span.style.backgroundColor = '#9cde57';
      } else if (uvi => 3 || uvi <= 5) {
          span.style.backgroundColor = '#f0d351';
      } else if (uvi => 6 || uvi <= 7) {
          span.style.backgroundColor = '#f29f4b';
      } else if (uvi => 8 || uvi <= 10) {
          span.style.backgroundColor = '#ed3e1f';
          span.style.color = 'white';
      } else {
          span.style.backgroundColor = '#cc06b8';
          span.style.color = 'white';
      }

  })
}

// saving current weather
function saveWeatherSearch(lat, lon, name) {
  var latestSearch = {
      city: name,
      latitude: lat,
      longitude: lon,
  };

  // DYNAMIC BUTTONS AND SAVING SEARCH BELOW TO BE AMENDED

/*   var insertNew = true;

  for (var i = 0; i < savedData.length; i++) {
      console.log(savedData);
      if (savedData[i].city === name) {
          insertNew = false;
          return;
      } else {
          continue;
      }
  }

  if (insertNew === true) {
      console.log(latestSearch.city);
      savedData.push(latestSearch);
      localStorage.setItem("searches", JSON.stringify(savedData));
      //create new button for search
      var newBtn = document.createElement("button");
      newBtn.classList.add('ui', 'grey', 'button');
      newBtn.textContent = name;
      searchHistoryEl.appendChild(newBtn);
  } */
}

//------------------- NAV BAR BUTTONS -----------------------

//if user clicks back to home button, go to homepage
$("#btn-2").click(function() {
  var homePage = './index.html'
  location.assign(homePage);
})

// if user clicks clear searches button, show modal
$("#btn").click(function() {
  $('.ui.basic.modal')
  .modal('show');
})
// if user clicks cancel button, do nothing
$(".ui.red.basic.cancel.inverted.button").click(function(){
  console.log("Pressed Cancel");
})

// if user clicks OK button, delete recent searches from local storage
function clearSearches(){
  localStorage.removeItem("(insert name of item)");
  window.location.reload();
}

$(".ui.green.ok.inverted.button").click(function(){
  clearSearches();
})


getSearchQuery();

$('.ui.dropdown')
  .dropdown();



