// API Key
var APIKey = "166a433c57516f51dfab1f7edaed8413";

$("#five-day").hide();

// When page reloads
function loadPage() {
    var inputCity = localStorage.getItem("Last City");

    // Run searchWeather
    searchWeather(inputCity);

    // Run fiveDay
    fiveDay(inputCity);
}

loadPage()

// Search and display weather details
function searchWeather(inputCity) {

    // Build queryURL
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputCity + "," + inputCity + "&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var iconCode = response.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";

        // capturing lat and lon
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var uvQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +
            "&exclude=minutelyt,hourly&appid=" + APIKey;

        $.ajax({
            url: uvQueryURL,
            method: "GET"
        })
            .then(function (nextResponse) {
                // adding UV index to HTML
                var $uvIndex = ("UV Index: " + nextResponse.current.uvi);
                $(".UVindex").text($uvIndex);

                if ($uvIndex < 3)
                    $(".UVindex").addClass("low");
                if ($uvIndex >= 3)
                    $(".UVindex").addClass("moderate");
                if ($uvIndex >= 8)
                    $(".UVindex").addClass("severe");
            });

        // Add content to HTML
        $(".city").html("<h1>" + response.name + " Weather Details</h1>");
        $(".date").text(moment.unix(response.dt).format("L"));
        $(".weather-icon").attr("src", iconURL);
        $(".humidity").text("Humidity: " + response.main.humidity + "%");

        var windMPH = (response.wind.speed * 2.2369362921);

        $(".wind").text("Wind Speed: " + windMPH.toFixed(2) + " MPH");

        // Convert temp to F
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;

        // Add temp to HTML
        $(".tempF").text("Temperature: " + tempF.toFixed(2) + "°F");

        // Saves city name to local storage
        var lastCity = "Last City";
        localStorage.clear();
        localStorage.setItem(lastCity, inputCity);
    });
}


// Search for and display Five Day
function fiveDay(inputCity) {
    var fivedayqueryURL = "https://api.openweathermap.org/data/2.5/forecast/daily?q=" + inputCity + "&appid=" + APIKey;

    $("#five-day").show();

    $.ajax({
        url: fivedayqueryURL,
        method: "GET"
    }).then(function (response) {
        var fiveDayBlocks = $(".five-day-block").empty();

        response.list.map(function (listItem, index) {
            listItem
            var $fiveDayDate = $("<p>").text(moment.unix(listItem.dt).format("L"));

            var fiveDayIconCode = listItem.weather[0].icon;
            var fiveDayIconURL = "https://openweathermap.org/img/wn/" + fiveDayIconCode + "@2x.png";
            var $fiveDayIcon = $("<img>").attr("src", fiveDayIconURL);

            var fiveDayTempF = (listItem.temp.max - 273.15) * 1.80 + 32;
            var $fiveDayTemp = $("<p>").text("Temperature: " + fiveDayTempF.toFixed(0) + "°F");

            var fiveDayHumidity = (listItem.humidity);
            var $fiveDayHumidity = $("<p>").text("Humidity: " + fiveDayHumidity + "%");

            fiveDayBlocks.eq(index).append($fiveDayDate, $fiveDayIcon, $fiveDayTemp, $fiveDayHumidity);
        })
    });
}

// Event handler for user clicking the search button
$("#submit-city").on("click", function (event) {
    event.preventDefault();

    // Capturing the city name
    var inputCity = $("#city-input").val().trim();

    var cityButton = $("<button>");
    cityButton.addClass("city-btn");
    cityButton.text(inputCity);

    $("#buttons-div").append(cityButton);

    // Run searchWeather
    searchWeather(inputCity);

    // Run fiveDay
    fiveDay(inputCity);

    $("#city-input").empty();
});

// Generating buttons on click
$("body").on("click", ".city-btn", function (event) {
    console.log(event.target.textContent)
    searchWeather(event.target.textContent);
    fiveDay(event.target.textContent);
})


