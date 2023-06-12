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

function setHistory(){
    localStorage.setItem("weather", JSON.stringify(prevCity));
}
function clearHistory(){
    localStorage.removeItem("weather");
}
function displayHistory(){
    let historyEl = document.getElementById("history");
    historyEl.innerHTML = '';
    if(prevCity.length <= 0){
        return;
    }
    for(let index = 0; index < prevCity.length; index++){
        let cityEl = document.createElement('button');
        cityEl.textContent = prevCity[index];
        cityEl.addEventListener('click', function(event){
            getWeather(prevCity[index]);
        });
        let cancelEl = document.createElement('i');
        cancelEl.className = "fas fa-window-close";
        cancelEl.addEventListener('click', function(event){
            deleteHistory(index);
        });
        cityEl.appendChild(cancelEl);
        historyEl.appendChild(cityEl);
    }
}
function getHistory(){
    prevCity = JSON.parse(localStorage.getItem("weather"));
    if(prevCity == null){
        prevCity = new Array();
    }
    displayHistory();
}
function addHistory(city){
    prevCity.push(city);
    if(prevCity.length > 10){
        deleteHistory(0);
    }
    setHistory();
    displayHistory();
}
function deleteHistory(key){
    prevCity.splice(key, 1);
    if(prevCity.length > 0){
        setHistory();
    }
    else{
        clearHistory();
    }
    displayHistory();
}

function citySearch(event) {
    event.preventDefault();
    let cityInput = document.getElementById("cityInput");
    getWeather(cityInput.value);
    addHistory(cityInput.value);
    cityInput.value = '';
}
searchEl.addEventListener("submit", citySearch);

function getWeather(city){

}

getHistory();