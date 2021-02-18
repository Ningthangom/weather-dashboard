
// getting city names from localstorage and appending to class list-group
for (var i = 0; i < localStorage.length; i++) {

    var city = localStorage.getItem(i);
  
    var cityName = $(".list-group").addClass("list-group-item");

    cityName.append("<li>" + city + "</li>");
}

// initailize key index localstorage
var keyIndexCount = 0;

var searchBtn = $(".searchBtn");

searchBtn.click(function () {

    let cityInput = $(".cityInput").val();
    // set up apis
    var apikey = "cdd773b10a39d769b915fa18d4f6c084";
    let currentWeatherapi = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&Appid=" + apikey + "&units=imperial";
    let fivedayapi = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&Appid=" + apikey + "&units=imperial";

    if (cityInput == "") {
        alert("please enter a city name")
    } else {
        $.ajax({
            url: currentWeatherapi,
            method: "GET"
        }).then(function (res) {
            
            // append city names to list 
            var cityName = $(".list-group").addClass("list-group-item");
            cityName.append("<li>" + res.name + "</li>");

            // save name and increase index by one 
             localStorage.setItem(keyIndexCount, res.name);
            keyIndexCount = keyIndexCount + 1;

            var currentWeatherCard = $(".currentCard").append("<div>").addClass("card-body");
            currentWeatherCard.empty();
            var currentCityName = currentWeatherCard.append("<p>");
            currentWeatherCard.append(currentCityName);

            var UTC = new Date(res.dt * 1000);
            currentCityName.append(res.name + " " + UTC.toLocaleDateString("en-AU"));
            currentCityName.append(`<img src="https://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png">`);
            var currentWeather = currentCityName.append("<p>");

    
            currentCityName.append(currentWeather);
            const tempInC =(Math.round((res.main.temp-32)*5/9 ).toFixed(2)) 
            console.log(tempInC)
            currentWeather.append("<p>" + "Temperature: " + tempInC + "◦C " + "</p>");
            currentWeather.append("<p>" + "Humidity: " + res.main.humidity + "%" + "</p>");
            currentWeather.append("<p>" + "Wind Speed: " + res.wind.speed + "</p>");

                // getting UV level and appending 
            var urlUV = `https://api.openweathermap.org/data/2.5/uvi?appid=b8ecb570e32c2e5042581abd004b71bb&lat=${res.coord.lat}&lon=${res.coord.lon}`
            $.ajax({
                url: urlUV,
                method: "GET"
            }).then(function (res) {   
                var currentUV = currentWeather.append("<p>" + "UV Index: " + res.value + "</p>").addClass("card-text");
                  console.log(res.value)
                currentUV.addClass("UV");
                currentWeather.append(currentUV);
                if(res.value>3) {
                    currentWeather.append("<p>"+"please put on sun screen if you are going outside" 
                    + "</p>").addId("warning").addClass("card-text").addClass("UV")
                }
            });

        });

// getting five day forecast
        $.ajax({
            url: fivedayapi,
            method: "GET"
        }).then(function (res) {
         
            var dayArray = [0, 8, 16, 24, 32];
            var fiveDayDiv = $(".fiveDays").addClass("card-text");
            fiveDayDiv.empty();
            // For each for 5 days
            dayArray.forEach(function (i) {
                var FiveDayUTC1 = new Date(res.list[i].dt * 1000);
                FiveDayUTC1 = FiveDayUTC1.toLocaleDateString("en-AU");
                fiveDayDiv.append("<div class=fiveDayColor>" + "<p>" + FiveDayUTC1 + "</p>" 
                + `<img src="https://openweathermap.org/img/wn/${res.list[i].weather[0].icon}@2x.png">` 
                + "<p>" + "Temperature: " + res.list[i].main.temp+ "◦C " + "</p>" + "<p>" + "Humidity: " 
                + res.list[i].main.humidity + "%" + "</p>" + "<p>" + "Humidity: " + res.list[i].main.humidity + "%" + "</p>" 
                + "</div>");


            })

        });
    }
});
