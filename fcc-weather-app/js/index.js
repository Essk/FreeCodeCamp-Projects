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
};

var latitude = '';
var longitude = '';

var localUnits = null;
var conditions = null;

var seunitss = function(units, custom) {
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
    case "custom":
      tmpUnit = custom.temp;
      wsUnit = custom.wind;
      break;
    default:
      tmpUnit = "&deg;C";
      wsUnit = "mph";
  }
  return {
    "tmpUnit": tmpUnit,
    "wsUnit": wsUnit
  };
};

var toC = function(units, temp) {
  var re = /([cCfF])/;
  var shortUnits = units.tmpUnit.match(re)[0];
  if (shortUnits === "F") {
    temp = (temp - 32) / 1.8;
  }
  return temp;
};

var convertTemp = function(units){
  var re = /([CF])/;
  var shortUnits = units.tmpUnit.match(re)[0];
  var newTemp;
  if (shortUnits == "C") {
    newTemp = Math.round((conditions.temp - 32) / 1.8);
  } else if (shortUnits == "F"){
    newTemp = Math.round((conditions.temp*1.8) + 32);
  }
  return newTemp;
};

var convertWindSpeed = function(units){
  var re = /([mk])/;
  var shortUnits = units.wsUnit.match(re)[0];
  var newWS;
  if (shortUnits == "m") {
    newWS = Math.round(conditions.windSpeed/1.60934);
  } else if (shortUnits == "k"){
    newWS = Math.round(conditions.windSpeed*1.60934);
  }
  return newWS;
};

var setContent = function(units, conditions) {
  $("#summary-icon").addClass(iconLookup[conditions.icon]);
  $(".summary").html(conditions.summary);
  if (Math.round(toC(units, conditions.temp)) <= 0) {
 $(".temperature").addClass("freezing");
    var tmpIcon = "thermometer";
  } else if (Math.round(toC(units, conditions.temp)) > 0 &&
    Math.round(toC(units, conditions.temp)) <= 8) {
    $(".temperature").addClass("cold");
    tmpIcon = "thermometer low";
  } else if (Math.round(toC(units, conditions.temp)) > 8 &&
    Math.round(toC(units, conditions.temp)) <= 15) {
    $(".temperature").addClass("cool");
    tmpIcon = "thermometer medium-low";
  } else if (Math.round(toC(units, conditions.temp)) > 15 &&
    Math.round(toC(units, conditions.temp)) <= 21) {
 $(".temperature").addClass("temperate");
    tmpIcon = "thermometer medium-high";
  } else if (Math.round(toC(units, conditions.temp)) > 21 &&
    Math.round(toC(units, conditions.temp)) <= 27) {
    $(".temperature").addClass("warm");
    tmpIcon = "thermometer high";
  } else if (Math.round(toC(units, conditions.temp)) > 27) {
    $(".temperature").addClass("hot");
    tmpIcon = "thermometer full";
  }
    $(".temperature").html(conditions.temp.toString()  + localUnits.tmpUnit + "<span class='climacon " + tmpIcon +"'></span>");
  $(".wind-speed").html(conditions.windSpeed.toString() + localUnits.wsUnit+ "<div class='label'>Wind Speed</div>");
    $(".pressure").html(conditions.pressure + "mB<div class='label'>Pressure</div>");
};

function getLocation(geolocatio) {
  var geo = geolocatio;
  geo.getCurrentPosition(geoSuccess, geoFail);
}

function geoSuccess(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
}

function geoFail(){
    //error
    console.log("Can't get location. Using Glasgow, Scotland as an example");
    latitude = 55.8628;
    longitude = -4.2542;
}



var getDummyWeather = function() {
  console.log("getDummyWeather");
  var units = "uk2";
  var conditions = {
    "temp": 21,
    "summary": "made up summary",
    "icon": "clear-day",
    "windSpeed": 6,
    "pressure": 1000
  };
  return {
    "units" : units,
    "conditions": conditions
  };
};

var getWeather = function() {

  $.ajax({
    url: "https://api.forecast.io/forecast/58e2f98e146014450cb46f9d18b08675/"+ latitude +"," +longitude,

    // The name of the callback parameter, as specified by the service
    jsonp: "callback",

    // Tell jQuery we're expecting JSONP
    dataType: "jsonp",

    // Tell Forecast.io what we want
    data: {
      units: "auto"
    },

    // Work with the response
    success: function(response) {
      var units = geunitss(response.flags.units);
      var conditions = {
        "temp": response.currently.apparentTemperature,
        "summary": response.currently.summary,
        "icon": response.currently.icon,
        "windSpeed": response.currently.windSpeed,
        "pressure": response.currently.pressure
      };
      return {
        "units" : units,
        "conditions": conditions
      };

    }
  });
};

function toggleSwitch(switchContainer){
  var kids = $(switchContainer).children();
  var unitClass = ($(switchContainer).attr('class').split(' ')[1]);
  $(kids).each(function(index){
    if($(this).hasClass("on")){
      $(this).removeClass("on").addClass("off");
    } else {
      $(this).removeClass("off").addClass("on");
      if (unitClass === "temp"){
        localUnits.tmpUnit = $(this).html();
        conditions.temp= convertTemp(localUnits);
      } else if (unitClass === "wind") {
        localUnits.wsUnit = $(this).html();
        conditions.windSpeed= convertWindSpeed(localUnits);
      }
    }
    setContent(localUnits,conditions);
  });



}

$(document).ready(function() {

  $(".switch-inner").click(function(){
    toggleSwitch($(this).parent());
  });


  // check for Geolocation support
  if ( navigator.geolocation) {
    //console.log('Geolocation is supported!');
    getLocation(navigator.geolocation);
  } else {
    console.log('Geolocation is not supported for this Browser/OS version yet.');
    geoFail();

  }



  //getWeather();
  var fetchedWeather = getDummyWeather();
  conditions = fetchedWeather.conditions;
  localUnits = seunitss(fetchedWeather.units);
  setContent(localUnits, conditions);
});