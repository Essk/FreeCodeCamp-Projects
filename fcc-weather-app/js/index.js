//look up for weather icons
var iconLookup = {
  "clear-day": "sun",
  "clear-night": "moon",
  "rain": "rain",
  "snow": "snow",
  "sleet": "sleet",
  "wind": "wind",
  "fog": "fog",
  "cloudy": "cloud",
  "partly-cloudy-day": "cloud sun",
  "partly-cloudy-night": "cloud moon"
}

var setUnits = function(units) {
  var tmpUnit, wsUnit;
  switch (units) {
    case "us":
      tmpUnit = "&deg;F";
      wsUnit = "mph";
      break;
    case "si":
      tmpUnit = "&deg;C";
      wsUnit = "kph";
      break;
    case "uk2":
      tmpUnit = "&deg;C";
      wsUnit = "mph";
      break;
    case "ca":
      tmpUnit = "&deg;F";
      wsUnit = "kph";
      break;
    default:
      tmpUnit = "&deg;C";
      wsUnit = "mph";
  }
  return {
    "tmpUnit": tmpUnit,
    "wsUnit": wsUnit
  };
}

var toC = function(units, temp) {
  if (units === "F") {
    temp = (temp - 32) / 1.8;
  }
  //console.log(temp);
  return temp;
}

var setContent = function(units, conditions) {
  
  var localUnits = setUnits(units);
  
  $("#summary-icon").addClass(iconLookup[conditions.icon]);
  $(".summary").html(conditions.summary);
 //document.createElement("span");
  //tmpIcon.addClass("climacon");  
  if (toC(units, conditions.temp) <= 0) { 
 $(".temperature").addClass("freezing");
    var tmpIcon = "thermometer";
  } else if (toC(units, conditions.temp) > 0 && 
    toC(units, conditions.temp) <= 8) {
    $(".temperature").addClass("cold");
    tmpIcon = "thermometer low";
  } else if (toC(units, conditions.temp) > 8 &&
    toC(units, conditions.temp) <= 15) {
    $(".temperature").addClass("cool");
    tmpIcon = "thermometer medium-low";
  } else if (toC(units, conditions.temp) > 15 &&
    toC(units, conditions.temp) <= 21) {
 $(".temperature").addClass("temperate");
    tmpIcon = "thermometer medium-high";
  } else if (toC(units, conditions.temp) > 21 &&
    toC(units, conditions.temp) <= 27) {
    $(".temperature").addClass("warm");
    tmpIcon = "thermometer high";
  } else if (toC(units, conditions.temp) > 27) {
    $(".temperature").addClass("hot");
    tmpIcon = "thermometer full";
  }
    $(".temperature").html(conditions.temp  + localUnits.tmpUnit + "<span class='climacon " + tmpIcon +"'></span>");  
  $(".wind-speed").html(conditions.windSpeed + localUnits.wsUnit+ "<div class='label'>Wind Speed</div>");
    $(".pressure").html(conditions.pressure + "mB<div class='label'>Pressure</div>");
}

function getLocation() {
  var geolocation = navigator.geolocation;
  geolocation.getCurrentPosition(showLocation, errorHandler);
}

function showLocation(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
 // console.log(latitude + ' : ' + longitude);
}

function errorHandler() {
  console.log("the world is on fire!");
}

var getDummyWeather = function() {
  console.log("getDummyWeather");
  var units = "uk2";
  var conditions = {
    "temp": 21,
    "summary": "made up summary",
    "icon": "clear-day",
    "windSpeed": 6,
    "pressure": 1000,
  }
  setContent(units, conditions);
}

var getWeather = function() {

  $.ajax({
    url: "https://api.forecast.io/forecast/58e2f98e146014450cb46f9d18b08675/55.8630044,-4.3093905",

    // The name of the callback parameter, as specified by the service
    jsonp: "callback",

    // Tell jQuery we're expecting JSONP
    dataType: "jsonp",

    // Tell Forecast.io what we want
    data: {
      units: "auto",
    },

    // Work with the response
    success: function(response) {
      var units = getUnits(response.flags.units);
      var conditions = {
        "temp": response.currently.apparentTemperature,
        "summary": response.currently.summary,
        "icon": response.currently.icon,
        "windSpeed": response.currently.windSpeed,
        "pressure": response.currently.pressure,
      }
      setContent(units, conditions);

    }
  });
}

$(document).ready(function() {
  getLocation();
  getDummyWeather();
  //getWeather();

  // check for Geolocation support
  if (navigator.geolocation) {
    console.log('Geolocation is supported!');
  } else {
    console.log('Geolocation is not supported for this Browser/OS version yet.');
  }
});