const KEY = "32976100515e39c6464b732c2b90fd75";
const inputCity =  document.querySelector(".city-input");
const searchButton = document.querySelector(".search-button");

function clickButton() {
    const input = document.querySelector(".city-input").value;
    citySearch(input);
}

async function citySearch(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY}&lang=pt_br&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            updateWeatherInfo(data);
        } else {
            alert(`Não foi possível encontrar informações sobre a cidade: ${city}`);
        }

    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        alert("Ocorreu um erro ao buscar a previsão do tempo.");
    }
}

function updateWeatherInfo(data) {
    document.querySelector(".city").innerText = "Tempo em " + data.name;
    document.querySelector(".temp").innerText = Math.floor(data.main.temp) + "° C";
    document.querySelector(".weather-text").innerText = data.weather[0].description;
    document.querySelector(".humidity").innerText = "Umidade " + data.main.humidity + "%";
    document.querySelector(".img-weather").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}

inputCity.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        clickButton();
        console.log("Enter key pressed");
    }
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        alert("Geolocalização não é suportada pelo seu navegador.");
    }
}

function successCallback(position) {
    const { latitude, longitude } = position.coords;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${KEY}&lang=pt_br&units=metric`;
    citySearchByCoords(apiUrl);
}

function errorCallback(error) {
    console.error("Erro ao obter localização:", error);
    alert("Não foi possível obter sua localização.");
}

async function citySearchByCoords(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            updateWeatherInfo(data);
        } else {
            alert("Não foi possível encontrar informações sobre sua localização.");
        }
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        alert("Ocorreu um erro ao buscar a previsão do tempo.");
    }
}

// Chame a função getLocation() para pedir a localização ao carregar a página
getLocation();