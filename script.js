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
