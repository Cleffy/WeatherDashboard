class weather{
    city;
    day;
    condition;
    temp;
    wind;
    humidity;
    constructor(){

    }
}
var prevCity = new Array();                              //An array of up to 10 previous cities.
var today = new weather();                              //Weather for today
var dayPlus1 = new weather();                           //Weather for today + 1
var dayPlus2 = new weather();                           //Weather for today + 2
var dayPlus3 = new weather();                           //Weather for today + 3
var dayPlus4 = new weather();                           //Weather for today + 4
var dayPlus5 = new weather();                           //Weather for today + 5
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
    console.log(city);
    let rawLocation = await fetch("http://dev.virtualearth.net/REST/v1/Locations?query=" + city + "&include=queryParse&key=" + bingMapsAPIKey + "&output=json");
    let geoLocation = await rawLocation.json();
    let lat = geoLocation.resourceSets[0].resources[0].geocodePoints[0].coordinates[0];
    let lon = geoLocation.resourceSets[0].resources[0].geocodePoints[0].coordinates[1];
    console.log(lat);
    console.log(lon);
    let rawForecast = await fetch("http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + weatherAPIKey);
    let forecast = await rawForecast.json();
    console.log(forecast);
    today.city = city;
    today.day = "";
    today.condition = forecast.list[0].weather[0].description;
    today.temp = kelvinToFahrenheit(forecast.list[0].main.temp);
    today.wind = forecast.list[0].wind.speed;
    today.humidity = forecast.list[0].main.humidity;
    console.log(today.temp);

}
function kelvinToFahrenheit(kelvin){
    return Math.floor(kelvin * 1.8 -459.67);
}
displayHistory();