 $(function() {
    const apikey= '8d884d5e308b0e90913fe2a9bb6643ea'
    var countries = null;
    var tag = null;

    function updateWeatherInfo(currentTag,location){
      tag = currentTag;
      updateDateInfo();
      updateLocation(location)
      getWeather(location);
    }

    function updateLocation(location){
      $(tag + ' .weather-location').html(location);
    }

    function updateDateInfo(){
      var date = new Date();
      var day = date.getDate();
      var dayOfWeek = date.toLocaleDateString('en', {weekday:'long'});
      var month = date.toLocaleString('default', { month: 'long' });
      var year = date.getFullYear();
      $(tag + ' .weather-date-location h3').html(dayOfWeek);
      $(tag + ' .weather-date').html(month + ' ' + day + ', ' + year);
    }

    function updateWeatherData(data){
       $(tag + ' .weather-data #temperature').html(parseInt(data.main.temp));
       $(tag + ' .weather-data #description').html(data.weather[0].description);
    }

    function getWeather(location){
      var baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'
      var url = baseUrl + 'q=' + location + '&units=metric' + '&appid=' + apikey;
      $.get(url).done(function(data){
        updateWeatherData(data);
        console.log(data);
      })
    }

    updateWeatherInfo('#page-content','Toronto');

    $('#new-form').submit(function(event) {
      event.preventDefault();
      var textbox = $('.city');
      updateWeatherInfo('#page-content',textbox.val());
    });
 });