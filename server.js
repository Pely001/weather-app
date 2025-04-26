const express = require('express');
const fetch = require('node-fetch'); // Certifique-se de instalar: npm install node-fetch
const app = express();
const port = 3000; // Escolha uma porta

// Sua chave da API do OpenWeatherMap (NÃO a coloque diretamente no código do cliente!)
const API_KEY = 'SUA_CHAVE_API';

// Rota para buscar a previsão do tempo
app.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=pt_br&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data); // Envia os dados para o cliente
    } catch (error) {
        console.error('Erro ao buscar dados do OpenWeatherMap:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do clima' });
    }
});

app.listen(port, () => {
    console.log(`Servidor proxy rodando na porta ${port}`);
});
