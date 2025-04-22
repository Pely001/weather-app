# Weather App

Este é um aplicativo simples de previsão do tempo que utiliza a API do OpenWeatherMap para exibir informações meteorológicas de uma cidade específica. O usuário pode digitar o nome da cidade no campo de entrada e pressionar o botão de busca ou a tecla "Enter" para obter os dados.

## Funcionalidades

- Busca de informações meteorológicas de qualquer cidade.
- Exibição de:
  - Nome da cidade.
  - Temperatura atual (em graus Celsius).
  - Descrição do clima.
  - Umidade relativa do ar.
  - Ícone representando as condições climáticas.
- Interface responsiva e estilizada.

## Tecnologias Utilizadas

- **HTML5**: Estrutura do aplicativo.
- **CSS3**: Estilização e design responsivo.
- **JavaScript**: Lógica do aplicativo e integração com a API.
- **OpenWeatherMap API**: Fonte dos dados meteorológicos.

## Como Usar

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/weather-app.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd weather-app
   ```
3. Abra o arquivo `index.html` em seu navegador.

## Configuração da API

Este projeto utiliza a API do OpenWeatherMap. Para que funcione corretamente, você precisa de uma chave de API válida:

1. Crie uma conta no [OpenWeatherMap](https://openweathermap.org/).
2. Gere uma chave de API.
3. Substitua o valor da constante `KEY` no arquivo `script.js` pela sua chave de API.

```javascript
const KEY = "sua-chave-de-api-aqui";
```

## Estrutura do Projeto

```
weather-app/
├── index.html       # Estrutura principal do aplicativo
├── styles.css       # Estilos do aplicativo
├── script.js        # Lógica do aplicativo
└── README.md        # Documentação do projeto
```

## Melhorias Futuras

- Adicionar suporte para previsão de vários dias.
- Implementar detecção automática de localização do usuário.
- Melhorar a acessibilidade da interface.

## Licença

Este projeto é de uso livre e aberto para estudos e melhorias.