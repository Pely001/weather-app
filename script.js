const BACKEND_URL = "https://weather-app-server.fly.dev/";
const inputCity = document.querySelector(".city-input");
const suggestionsBox = document.querySelector(".suggestions-box"); // Crie um elemento no HTML para exibir as sugestões

async function citySearch(city) {
    const geoApiUrl = `${BACKEND_URL}/geo?city=${encodeURIComponent(city)}`;
    try {
        const geoResponse = await fetch(geoApiUrl);
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
            alert(`Não foi possível encontrar informações sobre a cidade: ${city}`);
            return;
        }

        const { name, state, lat, lon } = geoData[0];
        const weatherApiUrl = `${BACKEND_URL}/weather?lat=${lat}&lon=${lon}`;

        const weatherResponse = await fetch(weatherApiUrl);
        const weatherData = await weatherResponse.json();

        if (weatherResponse.ok) {
            updateWeatherInfo(weatherData, name, state);
            getForecast(lat, lon); // Adicione esta linha
        } else {
            alert(`Não foi possível encontrar informações sobre a cidade: ${city}`);
        }
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        alert("Ocorreu um erro ao buscar a previsão do tempo.");
    }
}

function updateWeatherInfo(data, cityName, state) {
    const location = state ? `${cityName} - ${state}` : cityName;
    document.querySelector(".city").innerText = "Tempo em " + location;
    document.querySelector(".temp").innerText = Math.floor(data.main.temp) + "° C";
    document.querySelector(".weather-text").innerText = data.weather[0].description;
    document.querySelector(".humidity").innerText = "Umidade " + data.main.humidity + "%";
    document.querySelector(".img-weather").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}

let currentSuggestionIndex = -1; // Índice da sugestão atualmente selecionada

inputCity.addEventListener("keydown", function (event) {
    const suggestions = document.querySelectorAll(".suggestion-item");

    if (event.key === "ArrowDown") {
        event.preventDefault(); // Impede o comportamento padrão de rolagem no campo de texto
        if (suggestions.length > 0) {
            // Incrementa o índice, mas não ultrapassa o número de sugestões
            currentSuggestionIndex = (currentSuggestionIndex + 1) % suggestions.length;
            updateSuggestionHighlight(suggestions);
        }
    } else if (event.key === "ArrowUp") {
        event.preventDefault(); // Impede o comportamento padrão de rolagem no campo de texto
        if (suggestions.length > 0) {
            // Decrementa o índice, mas não ultrapassa o limite inferior
            currentSuggestionIndex =
                (currentSuggestionIndex - 1 + suggestions.length) % suggestions.length;
            updateSuggestionHighlight(suggestions);
        }
    } else if (event.key === "Enter") {
        if (currentSuggestionIndex >= 0 && suggestions.length > 0) {
            event.preventDefault(); // Impede o envio do formulário (se houver)
            suggestions[currentSuggestionIndex].click(); // Simula o clique na sugestão selecionada
        } else {
            const input = inputCity.value;
            citySearch(input);
        }
    }
});

// Função para destacar a sugestão selecionada
function updateSuggestionHighlight(suggestions) {
    suggestions.forEach((item, index) => {
        if (index === currentSuggestionIndex) {
            item.classList.add("highlight"); // Adiciona a classe de destaque
            item.scrollIntoView({ block: "nearest" }); // Garante que a sugestão esteja visível
        } else {
            item.classList.remove("highlight"); // Remove o destaque das outras sugestões
        }
    });
}

inputCity.addEventListener("input", async function () {
    const query = inputCity.value.trim();
    console.log("Texto digitado:", query); // Verifica o texto digitado

    if (query.length < 3) {
        suggestionsBox.innerHTML = ""; // Limpa as sugestões se o texto for muito curto
        return;
    }

    const geoApiUrl = `${BACKEND_URL}/geo?city=${encodeURIComponent(query)}`;
    console.log("URL da API:", geoApiUrl); // Verifica a URL gerada
    try {
        const response = await fetch(geoApiUrl);
        const cities = await response.json();
        console.log("Resposta da API:", cities); // Verifica a resposta da API

        if (cities.length === 0) {
            suggestionsBox.innerHTML = "<p>Nenhuma cidade encontrada.</p>";
            return;
        }

        // Renderiza as sugestões
        suggestionsBox.innerHTML = cities
            .map(
                (city) =>
                    `<div class="suggestion-item" data-city="${city.name}" data-lat="${city.lat}" data-lon="${city.lon}" data-state="${city.state || ""}">
                        ${city.name} - ${city.state || ""} (${city.country})
                    </div>`
            )
            .join("");

        // Adiciona evento de clique nas sugestões
        document.querySelectorAll(".suggestion-item").forEach((item) => {
            item.addEventListener("click", function () {
                const cityName = this.getAttribute("data-city");
                const state = this.getAttribute("data-state");
                const lat = this.getAttribute("data-lat");
                const lon = this.getAttribute("data-lon");

                // Atualiza o campo de entrada e busca o clima
                inputCity.value = `${cityName} - ${state || ""}`;
                suggestionsBox.innerHTML = ""; // Limpa as sugestões
                citySearchByCoords(
                    `${BACKEND_URL}/weather?lat=${lat}&lon=${lon}`,
                    cityName,
                    state
                );
            });
        });
    } catch (error) {
        console.error("Erro ao buscar sugestões de cidades:", error);
    }
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        alert("Geolocalização não é suportada pelo seu navegador.");
    }
}

async function successCallback(position) {
    const { latitude, longitude } = position.coords;

    // Chamada à API de geocodificação para obter o nome da cidade e o estado
    const geoApiUrl = `${BACKEND_URL}/reverse-geo?lat=${latitude}&lon=${longitude}`;
    try {
        const geoResponse = await fetch(geoApiUrl);
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
            alert("Não foi possível obter informações sobre sua localização.");
            return;
        }

        const { name, state } = geoData[0]; // Obtém o nome da cidade e o estado

        // Chamada à API de clima para obter os dados do tempo
        const weatherApiUrl = `${BACKEND_URL}/weather?lat=${latitude}&lon=${longitude}`;
        const weatherResponse = await fetch(weatherApiUrl);
        const weatherData = await weatherResponse.json();

        if (weatherResponse.ok) {
            updateWeatherInfo(weatherData, name, state); // Passa o nome da cidade e o estado
            getForecast(latitude, longitude); // Adicione esta linha
        } else {
            alert("Não foi possível obter informações sobre o clima da sua localização.");
        }
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        alert("Ocorreu um erro ao buscar informações sobre sua localização.");
    }
}

function errorCallback(error) {
    console.error("Erro ao obter localização:", error);
    alert("Não foi possível obter sua localização.");
}

async function citySearchByCoords(apiUrl, cityName, state) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            updateWeatherInfo(data, cityName, state);
            // Extrai lat/lon da URL
            const urlParams = new URLSearchParams(apiUrl.split('?')[1]);
            getForecast(urlParams.get('lat'), urlParams.get('lon')); // Adicione esta linha
        } else {
            alert("Não foi possível encontrar informações sobre sua localização.");
        }
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        alert("Ocorreu um erro ao buscar a previsão do tempo.");
    }
}

async function getForecast(lat, lon) {
    const url = `${BACKEND_URL}/forecast?lat=${lat}&lon=${lon}`;
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) {
        renderForecast(data);
    }
}

function renderForecast(data) {
    const forecastContainer = document.querySelector('.forecast-container');
    // Agrupa por dia
    const days = {};
    data.list.forEach(item => {
        const date = new Date(item.dt_txt);
        const day = date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
        if (!days[day] && date.getHours() === 12) { // Pega previsão do meio-dia
            days[day] = item;
        }
    });
    // Pega os próximos 4 dias
    const daysArr = Object.entries(days).slice(0, 7);

    forecastContainer.innerHTML = daysArr.map(([day, item]) => `
        <div class="forecast-day" title="${item.weather[0].description}">
            <div>${day.replace('.', '')}</div>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}" />
            <div>${Math.round(item.main.temp)}°C</div>
        </div>
    `).join('');
}

getLocation();
