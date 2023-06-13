/*
    Data Object for information I need on weather.
*/
class weather{
    day;                //String day formatted by dayjs
    condition;          //String OpenWeatherMap API Condition
    conditionIcon;      //String OpenWeatherMap API Link to image icon
    temp;               //String OpenWeatherMap API Formatted temp
    wind;               //String OpenWeatherMap API Formatted wind speed
    humidity;           //String OpenWeatherMap API Formatted humidity
    constructor(){

    }
}
/*
prevCity = Array of strings of previous city searches
weekForecase = Array of weather objects [Today], ... [5 days ahead]
searchEl = Dom element to search form
*/
var prevCity = new Array();
var weekForecast = [new weather(), new weather(), new weather(), new weather(), new weather(), new weather()];
var searchEl = document.getElementById("citySearch");

//Keys displayed for functionality test. Will be deleted after.
const weatherAPIKey = "1baaf4b6d9aa798b3b8d3da12f59ef1f";
const bingMapsAPIKey = "AqBjs9NHGIEZvYOeZEnKxKECXHpOHtdfQFrvkMwLm4iGlk5-il_6PI1U6c5Bwu9s";

/*
Initialization
Initialize form submit event
Build history tab
*/
searchEl.addEventListener("submit", citySearch);
displayHistory();

/*
Functions working with local storage
setHistory() - puts prevCity into local storage
clearHistory() - removes prevCity data from local storage
getHistory() - adds local storage data to prevCity
addHistory(city) - adds a city to prevCity and updates local storage
deleteHistory(key) - removes a city from prevCity and updates local storage
displayHistory() - populates prevCity, clears the site area, adds prevCity data to site
*/
function setHistory(){
    localStorage.setItem("weather", JSON.stringify(prevCity));
    displayHistory();
}
function clearHistory(){
    localStorage.removeItem("weather");
    displayHistory();
}
function getHistory(){
    prevCity = JSON.parse(localStorage.getItem("weather"));
    if(prevCity == null){
        prevCity = new Array();
    }
}
function addHistory(city){
    prevCity.push(city);
    if(prevCity.length > 10){
        deleteHistory(0);
        return;
    }
    setHistory();
}
function deleteHistory(key){
    prevCity.splice(key, 1);
    if(prevCity.length > 0){
        setHistory();
    }
    else{
        clearHistory();
    }
}
function displayHistory(){
    getHistory();
    let historyEl = document.getElementById("history");
    historyEl.innerHTML = '';
    if(prevCity.length <= 0){
        return;
    }
    for(let index = 0; index < prevCity.length; index++){
        let cityEl = document.createElement('div');
        cityEl.className = "city";
        let cityBtn = document.createElement('button');
        cityBtn.textContent = prevCity[index];
        cityBtn.addEventListener('click', function(event){
            getWeather(prevCity[index]);
        });
        let cancelEl = document.createElement('i');
        cancelEl.className = "fas fa-window-close";
        cancelEl.addEventListener('click', function(event){
            deleteHistory(index);
        });
        cityEl.appendChild(cityBtn);
        cityEl.appendChild(cancelEl);
        historyEl.appendChild(cityEl);
    }
    let clearEl = document.createElement('button');
    clearEl.textContent = "Clear";
    clearEl.addEventListener('click', clearHistory);
    historyEl.appendChild(clearEl);
}


/*
    citySearch event
    Check to see if it's a valid city
    Get Weather data
    Add the city to history
    Clear the text element
*/
async function citySearch(event) {
    event.preventDefault();
    let cityInput = document.getElementById("cityInput");
    if(await getWeather(cityInput.value)){
        addHistory(cityInput.value);    
        cityInput.value = '';
    }
}
/*
    getWeather(city)
    returns true if it successfully completes, otherwise it returns false
    Get's geocoordinates from Bing Maps API.
    Get's weather information from OpenWeatherMap API.

    ToDo: Fetch API call from backend rather than frontend
*/
async function getWeather(city){
    let geoLocation = await fetchData("http://dev.virtualearth.net/REST/v1/Locations?query=" + city + "&include=queryParse&key=" + bingMapsAPIKey + "&output=json");
    if(geoLocation.statusCode == 401){
        return false;
    }
    let lat = geoLocation.resourceSets[0].resources[0].geocodePoints[0].coordinates[0];
    let lon = geoLocation.resourceSets[0].resources[0].geocodePoints[0].coordinates[1];

    let forecast = await fetchData("http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + weatherAPIKey);
    if(forecast.statusCode == 401){
        return false;
    }
    for(let index in weekForecast){
        weekForecast[index].day = dayjs().add(index, 'day');
        weekForecast[index].condition = forecast.list[index].weather[0].description;
        weekForecast[index].conditionIcon = forecast.list[0].weather[0].icon;
        weekForecast[index].temp = kelvinToFahrenheit(forecast.list[index].main.temp).toFixed(2) + "°F";
        weekForecast[index].wind = forecast.list[index].wind.speed.toFixed(2) + " MPH";
        weekForecast[index].humidity = forecast.list[index].main.humidity + " %";
    }
    document.getElementById("mainContainer").style.display = "block";
    displayToday(city);
    displayForecast();
    return true;
}

//Adds today's weather information to site
function displayToday(city){
    let currentWeather = document.getElementById("currentConditions");
    currentWeather.innerHTML = '';
    let currentHeader = document.createElement('div');
    let currentCity = document.createElement('h2');
    let currentConditionIcon = document.createElement('img');
    let currentCondition = document.createElement('p');
    let currentTemp = document.createElement('p');
    let currentWind = document.createElement('p');
    let currentHumidity = document.createElement('p');
    currentHeader.className = 'weatherHeading';
    currentCity.textContent = city + " (" + weekForecast[0].day.format('MMM D,YYYY') + ")";
    currentConditionIcon.src = "https://openweathermap.org/img/wn/" + weekForecast[0].conditionIcon + ".png";
    currentCondition.textContent = "Condition: " + weekForecast[0].condition;
    currentTemp.textContent = "Temp: " + weekForecast[0].temp;
    currentWind.textContent = "Wind: " + weekForecast[0].wind;
    currentHumidity.textContent = "Humidity: " + weekForecast[0].humidity;
    currentHeader.appendChild(currentCity);
    currentHeader.appendChild(currentConditionIcon);
    currentWeather.appendChild(currentHeader);
    currentWeather.appendChild(currentCondition);
    currentWeather.appendChild(currentTemp);
    currentWeather.appendChild(currentWind);
    currentWeather.appendChild(currentHumidity);
}
//Adds five day weather forecast to the site
function displayForecast(){
    for(let index = 1; index < weekForecast.length; index++){
        let thisWeather = document.getElementById("day+" + index);
        thisWeather.innerHTML = '';
        let thisDay = document.createElement('h3');
        let thisConditionIcon = document.createElement('img');
        let thisCondition = document.createElement('p');
        let thisTemp = document.createElement('p');
        let thisWind = document.createElement('p');
        let thisHumidity = document.createElement('p');
        thisDay.textContent = weekForecast[index].day.format('MMM D,YYYY');
        thisConditionIcon.src = "https://openweathermap.org/img/wn/" + weekForecast[index].conditionIcon + ".png";
        thisCondition.textContent = "Condition: " + weekForecast[index].condition;
        thisTemp.textContent = "Temp: " + weekForecast[index].temp;
        thisWind.textContent = "Wind: " + weekForecast[index].wind;
        thisHumidity.textContent = "Humidity: " + weekForecast[index].humidity;
        thisWeather.appendChild(thisDay);
        thisWeather.appendChild(thisConditionIcon);
        thisWeather.appendChild(thisCondition);
        thisWeather.appendChild(thisTemp);
        thisWeather.appendChild(thisWind);
        thisWeather.appendChild(thisHumidity);
    }
}

//Helper Function to fetch data
async function fetchData(target){
    let response = await fetch(target);
    return await response.json();
}
//Helper Function convert kelvin to Fahrenheit
function kelvinToFahrenheit(kelvin){
    return (kelvin * 1.8 -459.67);
}