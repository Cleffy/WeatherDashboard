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
var history = [];               //An array of up to 10 previous cities.
var today = new weather();      //Weather for today
var dayPlus1 = new weather();   //Weather for today + 1
var dayPlus2 = new weather();   //Weather for today + 2
var dayPlus3 = new weather();   //Weather for today + 3
var dayPlus4 = new weather();   //Weather for today + 4
var dayPlus5 = new weather();   //Weather for today + 5

function setHistory(){
    localStorage.setItem("weather", JSON.stringify(history));
}
function clearHistory(){
    localStorage.removeItem("weather");
}
function displayHistory(){
    let historyEl = document.getElementById("history");
    historyEl.innerHTML = '';
    for(let index = 0; index < history.length; index++){
        let cityEl = document.createElement('button');
        cityEl.text = history[index];
        cityEl.onclick = "getWeather(" + history[index] + ")";
        let cancelEl = document.createElement('i');
        cancelEl.className = "fas fa-window-close";
        cancelEl.onclick = "deleteHistory(" + index + ")";
        cityEl.appendChild(cancelEl);
        historyEl.appendChild(cityEl);
    }
}
function getHistory(){
    var tempHistory = localStorage.getItem("weather");
    if(tempHistory != null){
        history = JSON.parse(tempHistory);
    }
    else{
        history = [];
    }
    displayHistory();
}
function addHistory(city){
    history.push(city);
    setHistory();
    displayHistory();
}
function deleteHistory(key){
    history.splice(key, 1);
    if(history.length > 0){
        setHistory();
    }
    else{
        clearHistory();
    }
    displayHistory();
}


function getWeather(city){

}