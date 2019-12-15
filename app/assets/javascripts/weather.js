 $(function() {
  const apikey= '8d884d5e308b0e90913fe2a9bb6643ea'
  var countries = null;
  var tag = null;

  function updateWeatherInfo(currentTag,location){
    tag = currentTag;
    updateLocation(location)
    getWeather(location);
  }

  function updateLocation(location){
    $(tag + ' .weather-location').html(location);
  }

  function updateDateInfo(data){
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    // create new Date object for different city
    // using supplied offset
    var date = new Date(utc + data.timezone);
    var day = date.getDate();
    var dayOfWeek = date.toLocaleDateString('en', {weekday:'long'});
    var month = date.toLocaleString('default', { month: 'long' });
    var year = date.getFullYear();
    $(tag + ' .weather-date-location h3').html(dayOfWeek);
    $(tag + ' .weather-date').html(month + ' ' + day + ', ' + year);
  }

  function updateWeatherData(data){
    var iconcode = data.weather[0].icon;
    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    $(tag + ' .card-weather .card-body:first-child').attr('class', 'card-body ' + '_' + iconcode);
    $(tag + ' .weather-data #temperature').html(parseInt(data.main.temp));
    $(tag + ' .weather-data #description').html(data.weather[0].description);
    $(tag + ' #wicon').attr('src', iconurl);
    updateDateInfo(data);
  }

  function updateFiveDayForecast(data){
    var day = 1;
    var dayOfWeek = null;
    for(i = 0; i < data.list.length; i++){
      var item = data.list[i];
      var date = new Date(item.dt_txt);
      if(dayOfWeek != date.toLocaleDateString('en', {weekday:'short'})){
        dayOfWeek = date.toLocaleDateString('en', {weekday:'short'})
        $(tag + ' .weakly-weather .day-' + day).html(dayOfWeek);
        $(tag + ' .weakly-weather .temp-' + day).html(parseInt(item.main.temp) + '°C');
        var iconcode = item.weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        $(tag + ' .weakly-weather #wicon-' + day).attr('src',iconurl);
        day++;
      }
    }
  }

  function getWeather(location){
    var baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'
    var url = baseUrl + 'q=' + location + '&units=metric' + '&appid=' + apikey;
    $.get(url).done(function(data){
      updateWeatherData(data);
      getFiveDayForecast(location);
    })
  }

  function getFiveDayForecast(location){
     var baseUrl = 'https://api.openweathermap.org/data/2.5/forecast?'
    var url = baseUrl + 'q=' + location + '&units=metric' + '&appid=' + apikey;
    $.get(url).done(function(data){
      updateFiveDayForecast(data);
    })
  }

  function getLocationByIP(){
    $.get("https://ipinfo.io?token=0eb6c9e188f59b", function(response) {
          updateLocation(response.city);
    }, "jsonp")
  }

  function getWeatherByPosition(position){
    var baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'
    var url = baseUrl + 'lat=' + position.coords.latitude  + '&lon=' + position.coords.longitude + '&units=metric' + '&appid=' + apikey;
    $.get(url).done(function(data){
      updateWeatherData(data);
      getFiveDayForecastByPosition(position);
    })
  }

  function getFiveDayForecastByPosition(position){
    var baseUrl = 'https://api.openweathermap.org/data/2.5/forecast?'
    var url = baseUrl + 'lat=' + position.coords.latitude  + '&lon=' + position.coords.longitude + '&units=metric' + '&appid=' + apikey;
     $.get(url).done(function(data){
      updateFiveDayForecast(data);
    })
  }

  function init() {
    getLocationByIP();
    if (navigator.geolocation) {
      tag = '#page-content';
       navigator.geolocation.getCurrentPosition(getWeatherByPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
      updateWeatherInfo('#page-content','Toronto');
    }
  }

  init();

  $('#new-form').submit(function(event) {
    event.preventDefault();
    var textbox = $('.city');
    updateWeatherInfo('#page-content',textbox.val());
  });
});