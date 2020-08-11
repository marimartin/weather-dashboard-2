// API Key
var APIKey = "166a433c57516f51dfab1f7edaed8413";

$("#five-day").hide();

// When page reloads
function fiveDay(inputCity) {
    var inputCity = localStorage.getItem(lastCity);

    // Run searchWeather
    searchWeather(inputCity);

    // Run fiveDay
    fiveDay(inputCity);
}

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

        console.log(response);

        // Add content to HTML
        $(".city").html("<h1>" + response.name + " Weather Details</h1>");
        $(".date").text(moment.unix(response.dt).format("L"));
        $(".weather-icon").attr("src", iconURL);
        $(".humidity").text("Humidity: " + response.main.humidity + "%");
        $(".wind").text("Wind Speed: " + response.wind.speed);

        // Convert temp to F
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;

        // Add temp to HTML
        $(".tempF").text("Temperature: " + tempF.toFixed(2) + "°F");

        var lastCity = "Last City";
        localStorage.clear();
        localStorage.setItem(lastCity, inputCity);
        console.log(localStorage)
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
        console.log(fivedayqueryURL);

        var fiveDayBlocks = $(".five-day-block").empty();

        response.list.map(function (listItem, index) {
            listItem
            var $fiveDayDate = $("<p>").text(moment.unix(listItem.dt).format("L"));

            var fiveDayIconCode = listItem.weather[0].icon;
            var fiveDayIconURL = "http://openweathermap.org/img/wn/" + fiveDayIconCode + "@2x.png";
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
    // Storing the city name
    var inputCity = $("#city-input").val().trim();

    var cityButton = $("<button>");
    cityButton.addClass("city-btn");
    cityButton.text(inputCity);

    $("#buttons-div").append(cityButton);

    // Run searchWeather
    searchWeather(inputCity);

    // Run fiveDay
    fiveDay(inputCity);
});

// Generating buttons on click
$("body").on("click", ".city-btn", function (event) {
    console.log(event.target.textContent)
    searchWeather(event.target.textContent);
    fiveDay(event.target.textContent);
})


