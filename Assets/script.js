class weather{
    day;
    condition;
    conditionIcon;
    temp;
    wind;
    humidity;
    constructor(){

    }
}
var prevCity = new Array();                              //An array of up to 10 previous cities.
var weekForecast = [new weather(), new weather(), new weather(), new weather(), new weather(), new weather()];
var searchEl = document.getElementById("citySearch");   //form element
const weatherAPIKey = "1baaf4b6d9aa798b3b8d3da12f59ef1f";
const bingMapsAPIKey = "AqBjs9NHGIEZvYOeZEnKxKECXHpOHtdfQFrvkMwLm4iGlk5-il_6PI1U6c5Bwu9s";

function setHistory(){
    localStorage.setItem("weather", JSON.stringify(prevCity));
    displayHistory();
}
function clearHistory(){
    localStorage.removeItem("weather");
    displayHistory();
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

function citySearch(event) {
    event.preventDefault();
    let cityInput = document.getElementById("cityInput");
    getWeather(cityInput.value);
    addHistory(cityInput.value);
    cityInput.value = '';
}
searchEl.addEventListener("submit", citySearch);

async function getWeather(city){
    let rawLocation = await fetch("http://dev.virtualearth.net/REST/v1/Locations?query=" + city + "&include=queryParse&key=" + bingMapsAPIKey + "&output=json");
    let geoLocation = await rawLocation.json();
    let lat = geoLocation.resourceSets[0].resources[0].geocodePoints[0].coordinates[0];
    let lon = geoLocation.resourceSets[0].resources[0].geocodePoints[0].coordinates[1];
    let rawForecast = await fetch("http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + weatherAPIKey);
    let forecast = await rawForecast.json();
    //console.log(forecast);
    for(let index in weekForecast){
        weekForecast[index].day = dayjs().add(index, 'day');
        weekForecast[index].condition = forecast.list[index].weather[0].description;
        weekForecast[index].conditionIcon = forecast.list[0].weather[0].icon;
        weekForecast[index].temp = kelvinToFahrenheit(forecast.list[index].main.temp).toFixed(2) + "°F";
        weekForecast[index].wind = forecast.list[index].wind.speed.toFixed(2) + " MPH";
        weekForecast[index].humidity = forecast.list[index].main.humidity + " %";
    }
    displayToday(city);
    displayForecast();
}

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
function kelvinToFahrenheit(kelvin){
    return (kelvin * 1.8 -459.67);
}
displayHistory();