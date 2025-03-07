const API_KEY = '4f81cc1d15de45d785082423252302';
let tempChartInstance = null;
let humidityChartInstance = null;

// Set default city to Delhi
const defaultCity = 'Delhi';

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled-nav');
    } else {
        navbar.classList.remove('scrolled-nav');
    }
});

async function getWeatherData(city) {
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=yes&alerts=yes`
        );
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data;
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching weather data: ' + error.message);
        throw error;
    }
}

function updateUI(data) {
    updateCurrentWeather(data);
    updateWeatherDetails(data);
    updateForecast(data.forecast.forecastday);
    updateCharts(data.forecast.forecastday);
}

function updateCurrentWeather(data) {
    const current = data.current;
    const location = data.location;

    // Determine the weather icon based on the condition
    let weatherIcon;
    switch (current.condition.text.toLowerCase()) {
        case 'sunny':
            weatherIcon = 'https://img.icons8.com/ios/452/sun.png';
            break;
        case 'partly cloudy':
            weatherIcon = 'https://img.icons8.com/ios/452/partly-cloudy.png';
            break;
        case 'cloudy':
            weatherIcon = 'https://img.icons8.com/ios/452/cloud.png';
            break;
        case 'rain':
            weatherIcon = 'https://img.icons8.com/ios/452/rain.png';
            break;
        case 'snow':
            weatherIcon = 'https://img.icons8.com/ios/452/snow.png';
            break;
        case 'thunderstorm':
            weatherIcon = 'https://img.icons8.com/ios/452/thunderstorm.png';
            break;
        case 'fog':
            weatherIcon = 'https://img.icons8.com/ios/452/fog.png';
            break;
        case 'wind':
            weatherIcon = 'https://img.icons8.com/ios/452/wind.png';
            break;
        default:
            weatherIcon = 'https://img.icons8.com/ios/452/cloud.png'; // Default icon
    }

    document.getElementById('currentWeather').innerHTML = `
        <div class="current-header">
            <h2>${location.name}, ${location.country}</h2>
            <p>${new Date(current.last_updated_epoch * 1000).toLocaleString()}</p>
        </div>
        <div class="current-body">
            <img src="${weatherIcon}" class="weather-icon" alt="${current.condition.text}">
            <div class="current-temp">${current.temp_c}°C</div>
            <div class="current-condition">${current.condition.text}</div>
        </div>
    `;
}

function updateWeatherDetails(data) {
    const current = data.current;
    document.getElementById('weatherDetails').innerHTML = `
        <p>🌡️ Feels Like: ${current.feelslike_c}°C</p>
        <p>💧 Humidity: ${current.humidity}%</p>
        <p>🌬️ Wind: ${current.wind_kph} km/h</p>
        <p>☀️ UV Index: ${current.uv}</p>
        <p>🌫️ Visibility: ${current.vis_km} km</p>
        <p>🌡️ Pressure: ${current.pressure_mb} hPa</p>
    `;
}

function updateForecast(forecastDays) {
    const forecastContainer = document.getElementById('dailyForecast');
    forecastContainer.innerHTML = forecastDays.map((day, index) => `
        <div class="day-card" style="--i: ${index};">
            <h4>${new Date(day.date_epoch * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</h4>
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
            <div class="temp-range">
                <span>↑ ${day.day.maxtemp_c}°C</span>
                <span>↓ ${day.day.mintemp_c}°C</span>
            </div>
            <p>${day.day.condition.text}</p>
            <div class="forecast-details">
                <span>💧 ${day.day.avghumidity}%</span>
                <span>🌬️ ${day.day.maxwind_kph} km/h</span>
            </div>
        </div>
    `).join('');
}

function updateCharts(forecastDays) {
    const labels = forecastDays.map(day =>
        new Date(day.date_epoch * 1000).toLocaleDateString('en-US', { weekday: 'short' })
    );

    // Temperature Chart (Mixed Chart)
    if (tempChartInstance) tempChartInstance.destroy();
    tempChartInstance = new Chart(document.getElementById('tempChart'), {
        type: 'mixed',
        data: {
            labels: labels,
            datasets: [{
                label: 'Max Temperature (°C)',
                data: forecastDays.map(day => day.day.maxtemp_c),
                type: 'line',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
            }, {
                label: 'Min Temperature (°C)',
                data: forecastDays.map(day => day.day.mintemp_c),
                type: 'bar',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: '7-Day Temperature Forecast' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            }
        }
    });

    // Humidity Chart (Line Chart)
    if (humidityChartInstance) humidityChartInstance.destroy();
    humidityChartInstance = new Chart(document.getElementById('humidityChart'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Humidity (%)',
                data: forecastDays.map(day => day.day.avghumidity),
                fill: true,
                backgroundColor: 'rgba(78, 205, 196, 0.5)',
                borderColor: 'rgba(78, 205, 196, 1)',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: '7-Day Humidity Forecast' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Humidity (%)'
                    }
                }
            }
        }
    });
}

// Initial load
window.onload = function () {
    document.getElementById('loading').style.display = 'flex';
    getWeatherByCity(defaultCity); // Fetch weather data for Delhi by default
};

async function getWeatherByCity(city) {
    try {
        const data = await getWeatherData(city);
        updateUI(data);
        document.getElementById('loading').style.display = 'none';
        localStorage.setItem('lastSearchedCity', city); // Store last searched city
    } catch (error) {
        console.error(error);
        alert('Error fetching weather data');
        document.getElementById('loading').style.display = 'none';
    }
}

function searchWeather() {
    const city = document.getElementById('cityInput').value;
    if (city.trim() === '') return;

    document.getElementById('loading').style.display = 'flex';
    getWeatherByCity(city);
}

document.getElementById('cityInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') searchWeather();
}
);
