document.addEventListener('DOMContentLoaded', function() {
    function updateTime() {
        const now = new Date();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const month = months[now.getMonth()];
        const day = now.getDate();
        const year = now.getFullYear();
        
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : ' AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12;
        
        const formattedTime = `${month} ${day}, ${year} at ${hours}:${minutes}${ampm}`;
        
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = formattedTime;
        }
        
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = daysOfWeek[now.getDay()];
        const dayElement = document.getElementById('location-day');
        if (dayElement) {
            dayElement.textContent = dayOfWeek;
        }
    }
    
    updateTime();
    
    setInterval(updateTime, 1000);
    
    const tempUnitToggle = document.getElementById('temp-unit-toggle');
    const tempUnitDropdown = document.getElementById('temp-unit-dropdown');
    let currentUnit = 'celsius'; 
    
    if (tempUnitToggle) {
        tempUnitToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            tempUnitDropdown.classList.toggle('show');
        });
    }
    
    if (tempUnitDropdown) {
        const unitOptions = tempUnitDropdown.querySelectorAll('a');
        unitOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                const selectedUnit = this.getAttribute('data-unit');
                currentUnit = selectedUnit;
                tempUnitDropdown.classList.remove('show');
                
                updateTemperatureDisplay(currentUnit);
                updateHourlyForecast(currentUnit); 
                updateWeeklyForecast(currentUnit);
            });
        });
    }
    
    document.addEventListener('click', function(e) {
        if (tempUnitDropdown && tempUnitDropdown.classList.contains('show')) {
            if (!tempUnitToggle.contains(e.target) && !tempUnitDropdown.contains(e.target)) {
                tempUnitDropdown.classList.remove('show');
            }
        }
    });
    
    function updateTemperatureDisplay(unit) {
        const temperatureElement = document.querySelector('main h3');
        const feelsLikeElement = document.querySelector('main h4');
        
        if (temperatureElement && feelsLikeElement && weatherData) {
            let tempValue, feelsLikeValue, unitSymbol;
            
            if (unit === 'celsius') {
                tempValue = Math.round(weatherData.current.temp_c);
                feelsLikeValue = Math.round(weatherData.current.feelslike_c);
                unitSymbol = '°C';
            } else {
                tempValue = Math.round(weatherData.current.temp_f);
                feelsLikeValue = Math.round(weatherData.current.feelslike_f);
                unitSymbol = '°F';
            }
            
            temperatureElement.textContent = `${tempValue}${unitSymbol}`;
            feelsLikeElement.textContent = `Feels like ${feelsLikeValue}${unitSymbol}`;
        }
    }
    
    function getWeatherIcon(condition) {
        const conditionLower = condition.toLowerCase();
        
        if (conditionLower.includes("sunny") || conditionLower.includes("clear")) {
            return "sun.png";
        } else if (conditionLower.includes("cloud")) {
            return "cloudy.png";
        } else if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
            return "rain.png";
        } else if (conditionLower.includes("snow")) {
            return "snowy.png";
        } else if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
            return "thunder.png";
        } else if (conditionLower.includes("fog") || conditionLower.includes("mist")) {
            return "foggy.png";
        }
        
        return "sun.png";
    }
    
    function updateHourlyForecast(unit) {
        if (!forecastData || !forecastData.forecast || !forecastData.forecast.forecastday) return;
        
        const hourlyContainer = document.querySelector('.dashboard-container');
        if (!hourlyContainer) return;
        
        const hourlyCards = hourlyContainer.querySelectorAll('.dashboard-card');
        if (!hourlyCards.length) return;
        
        const currentHour = new Date().getHours();
        const today = forecastData.forecast.forecastday[0];
        
        const nowCard = hourlyCards[0];
        if (nowCard) {
            const nowTemp = unit === 'celsius' ? 
                Math.round(forecastData.current.temp_c) : 
                Math.round(forecastData.current.temp_f);
            const unitSymbol = unit === 'celsius' ? '°C' : '°F';
            
            const nowImg = nowCard.querySelector('img');
            if (nowImg) {
                nowImg.src = `IMG/${getWeatherIcon(forecastData.current.condition.text)}`;
                nowImg.alt = forecastData.current.condition.text;
            }
            
            const nowTempElement = nowCard.querySelector('p');
            if (nowTempElement) {
                nowTempElement.textContent = `${nowTemp}${unitSymbol}`;
            }
        }
        
        for (let i = 1; i < hourlyCards.length; i++) {
            const futureHour = (currentHour + i) % 24;
            const hourData = today.hour[futureHour];
            
            if (!hourData) continue;
            
            const card = hourlyCards[i];
            const hourTitle = card.querySelector('h3');
            const hourImg = card.querySelector('img');
            const hourTemp = card.querySelector('p');
            
            if (hourTitle) {
                const displayHour = futureHour % 12 || 12;
                const ampm = futureHour >= 12 ? 'PM' : 'AM';
                hourTitle.textContent = `${displayHour} ${ampm}`;
            }
            
            if (hourImg) {
                hourImg.src = `IMG/${getWeatherIcon(hourData.condition.text)}`;
                hourImg.alt = hourData.condition.text;
            }
            
            if (hourTemp) {
                const temp = unit === 'celsius' ? Math.round(hourData.temp_c) : Math.round(hourData.temp_f);
                const unitSymbol = unit === 'celsius' ? '°C' : '°F';
                hourTemp.textContent = `${temp}${unitSymbol}`;
            }
        }
    }
    
    function updateWeeklyForecast(unit) {
        if (!forecastData || !forecastData.forecast || !forecastData.forecast.forecastday) return;
        
        const weeklyContainer = document.querySelector('.Next-week');
        if (!weeklyContainer) return;
        
        const weeklyCards = weeklyContainer.querySelectorAll('.dashboard-cardweek');
        if (!weeklyCards.length) return;
        
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        for (let i = 0; i < Math.min(weeklyCards.length, forecastData.forecast.forecastday.length); i++) {
            const dayData = forecastData.forecast.forecastday[i];
            const card = weeklyCards[i];
            
            if (!dayData) continue;
            
            const date = new Date(dayData.date);
            const dayName = daysOfWeek[date.getDay()];
            
            const dayTitle = card.querySelector('h3');
            const dayImg = card.querySelector('img');
            const minTemp = card.querySelector('h4');
            const maxTemp = card.querySelector('p');
            const tempSlider = card.querySelector('.tempslider');
            
            if (dayTitle) {
                dayTitle.textContent = dayName;
            }
            
            if (dayImg) {
                dayImg.src = `IMG/${getWeatherIcon(dayData.day.condition.text)}`;
                dayImg.alt = dayData.day.condition.text;
            }
            
            if (minTemp) {
                const temp = unit === 'celsius' ? Math.round(dayData.day.mintemp_c) : Math.round(dayData.day.mintemp_f);
                const unitSymbol = unit === 'celsius' ? '°C' : '°F';
                minTemp.textContent = `${temp}${unitSymbol}`;
            }
            
            if (maxTemp) {
                const temp = unit === 'celsius' ? Math.round(dayData.day.maxtemp_c) : Math.round(dayData.day.maxtemp_f);
                const unitSymbol = unit === 'celsius' ? '°C' : '°F';
                maxTemp.textContent = `${temp}${unitSymbol}`;
            }
            
            if (tempSlider) {
                const minTempValue = unit === 'celsius' ? dayData.day.mintemp_c : dayData.day.mintemp_f;
                const maxTempValue = unit === 'celsius' ? dayData.day.maxtemp_c : dayData.day.maxtemp_f;
                const rangeFactor = (maxTempValue - minTempValue) / 40; 
                const width = Math.max(30, Math.min(200, 75 + (rangeFactor * 100)));
                tempSlider.style.width = `${width}px`;
            }
        }
    }
    
    // Function to update wind speed, direction, humidity, rainfall, and UV index
    function updateAdditionalMetrics(data) {
        if (!data || !data.current) return;
        
        // Update Wind Speed
        const windSpeedElement = document.querySelector('.dashboardcard-WindSpeed h2');
        if (windSpeedElement) {
            windSpeedElement.textContent = `${data.current.wind_kph} KM/H`;
        }
        
        // Update Wind Direction
        const windDirectionElement = document.querySelector('.dashboardcard-WindSpeed p');
        if (windDirectionElement) {
            windDirectionElement.textContent = `${data.current.wind_degree}° ${data.current.wind_dir}`;
        }
        
        // Update Humidity
        const humidityElement = document.querySelector('.dashboardcard-Humidity h2');
        const humidityStatusElement = document.querySelector('.dashboardcard-Humidity p');
        if (humidityElement) {
            humidityElement.textContent = `${data.current.humidity}%`;
            
            // Add humidity status description
            if (humidityStatusElement) {
                if (data.current.humidity < 30) {
                    humidityStatusElement.textContent = 'Very dry';
                } else if (data.current.humidity < 50) {
                    humidityStatusElement.textContent = 'Comfortable';
                } else if (data.current.humidity < 70) {
                    humidityStatusElement.textContent = 'Moderate humidity';
                } else {
                    humidityStatusElement.textContent = 'High humidity';
                }
            }
        }
        
        // Update UV Index
        const uvIndexElement = document.querySelector('.dashboardcard-UV-Index h2');
        const uvStatusElement = document.querySelector('.dashboardcard-UV-Index p');
        if (uvIndexElement && uvStatusElement) {
            uvIndexElement.textContent = data.current.uv;
            
            // Set UV index description
            if (data.current.uv <= 2) {
                uvStatusElement.textContent = 'Low UV';
            } else if (data.current.uv <= 5) {
                uvStatusElement.textContent = 'Moderate UV';
            } else if (data.current.uv <= 7) {
                uvStatusElement.textContent = 'High UV';
            } else if (data.current.uv <= 10) {
                uvStatusElement.textContent = 'Very High UV';
            } else {
                uvStatusElement.textContent = 'Extreme UV';
            }
        }
        
        // Update Rainfall
        const rainfallElement = document.querySelector('.dashboardcard-Rainfall h2');
        if (rainfallElement) {
            rainfallElement.textContent = `${data.current.precip_mm} mm`;
        }
    }
    
    // Function to update sunrise and sunset times
    function updateSunriseSunset(data) {
        if (!data || !data.forecast || !data.forecast.forecastday || !data.forecast.forecastday.length === 0) return;
        
        const today = data.forecast.forecastday[0];
        if (!today || !today.astro) return;
        
        // Update Sunrise
        const sunriseElement = document.querySelector('.dashboardcard-Sunrise h2');
        if (sunriseElement && today.astro.sunrise) {
            sunriseElement.textContent = today.astro.sunrise;
        }
        
        // Update Sunset
        const sunsetElement = document.querySelector('.dashboardcard-Sunset h2');
        if (sunsetElement && today.astro.sunset) {
            sunsetElement.textContent = today.astro.sunset;
        }
    }
    
    const apiKey = '601eeb12fe614d3ca94162605250503';
    const city = 'Amsterdam';
    const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no&alerts=no`;
    
    let weatherData = null;
    let forecastData = null;
    
    // Fetch current weather data
    fetch(weatherUrl)
    .then(response => response.json())
    .then(data => {
        console.log('Current Weather Data:', data);
        weatherData = data;
        
        const temperatureElement = document.querySelector('main h3');
        const feelsLikeElement = document.querySelector('main h4');
        const conditionElement = document.getElementById('weather-condition');
        const weatherIconElement = document.querySelector('main img[alt="Weather Icon"]');
        
        if (temperatureElement && feelsLikeElement) {
            const temperature = Math.round(data.current.temp_c);
            const feelsLike = Math.round(data.current.feelslike_c);
            const condition = data.current.condition.text;
            temperatureElement.textContent = `${temperature}°C`;
            feelsLikeElement.textContent = `Feels like ${feelsLike}°C`;
            
            if (conditionElement) {
                conditionElement.textContent = condition;
            }
            
            if (weatherIconElement) {
                weatherIconElement.src = `IMG/${getWeatherIcon(condition)}`;
                weatherIconElement.alt = condition;
            }
        }
        
        updateAdditionalMetrics(data);
    })
    .catch(error => {
        console.error('Error fetching current weather data:', error);
    });

    // Fetch forecast data
    fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
        console.log('Forecast Data:', data);
        forecastData = data;
        
        // Update location information
        const locationElement = document.getElementById('location-name');
        if (locationElement && data.location) {
            locationElement.textContent = `${data.location.name}, ${data.location.country}`;
        }
        
        // Update sunrise and sunset information
        updateSunriseSunset(data);
        
        // Update hourly forecast
        updateHourlyForecast(currentUnit);
        
        // Update weekly forecast
        updateWeeklyForecast(currentUnit);
    })
    .catch(error => {
        console.error('Error fetching forecast data:', error);
    });
    
    // Search functionality
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchCity = searchInput.value.trim();
            
            if (searchCity) {
                // Update URLs with new city
                const newWeatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${searchCity}&aqi=no`;
                const newForecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${searchCity}&days=7&aqi=no&alerts=no`;
                
                // Fetch new weather data
                fetch(newWeatherUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('City not found');
                    }
                    return response.json();
                })
                .then(data => {
                    weatherData = data;
                    updateTemperatureDisplay(currentUnit);
                    updateAdditionalMetrics(data);
                    
                    const conditionElement = document.getElementById('weather-condition');
                    const weatherIconElement = document.querySelector('main img[alt="Weather Icon"]');
                    
                    if (conditionElement) {
                        conditionElement.textContent = data.current.condition.text;
                    }
                    
                    if (weatherIconElement) {
                        weatherIconElement.src = `IMG/${getWeatherIcon(data.current.condition.text)}`;
                        weatherIconElement.alt = data.current.condition.text;
                    }
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    alert('City not found. Please try again.');
                });
                
                // Fetch new forecast data
                fetch(newForecastUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('City not found');
                    }
                    return response.json();
                })
                .then(data => {
                    forecastData = data;
                    
                    // Update location information
                    const locationElement = document.getElementById('location-name');
                    if (locationElement && data.location) {
                        locationElement.textContent = `${data.location.name}, ${data.location.country}`;
                    }
                    
                    // Update sunrise and sunset information
                    updateSunriseSunset(data);
                    
                    // Update hourly forecast
                    updateHourlyForecast(currentUnit);
                    
                    // Update weekly forecast
                    updateWeeklyForecast(currentUnit);
                })
                .catch(error => {
                    console.error('Error fetching forecast data:', error);
                });
                
                // Clear input field
                searchInput.value = '';
            }
        });
    }
    
    // Function to handle geolocation
    const locationButton = document.getElementById('location-button');
    
    if (locationButton) {
        locationButton.addEventListener('click', function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    // Success callback
                    function(position) {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;
                        const geoUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`;
                        const geoForecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7&aqi=no&alerts=no`;
                        
                        // Fetch weather data for current location
                        fetch(geoUrl)
                        .then(response => response.json())
                        .then(data => {
                            weatherData = data;
                            updateTemperatureDisplay(currentUnit);
                            updateAdditionalMetrics(data);
                            
                            const conditionElement = document.getElementById('weather-condition');
                            const weatherIconElement = document.querySelector('main img[alt="Weather Icon"]');
                            
                            if (conditionElement) {
                                conditionElement.textContent = data.current.condition.text;
                            }
                            
                            if (weatherIconElement) {
                                weatherIconElement.src = `IMG/${getWeatherIcon(data.current.condition.text)}`;
                                weatherIconElement.alt = data.current.condition.text;
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching geolocation weather data:', error);
                        });
                        
                        // Fetch forecast data for current location
                        fetch(geoForecastUrl)
                        .then(response => response.json())
                        .then(data => {
                            forecastData = data;
                            
                            // Update location information
                            const locationElement = document.getElementById('location-name');
                            if (locationElement && data.location) {
                                locationElement.textContent = `${data.location.name}, ${data.location.country}`;
                            }
                            
                            // Update sunrise and sunset information
                            updateSunriseSunset(data);
                            
                            // Update hourly forecast
                            updateHourlyForecast(currentUnit);
                            
                            // Update weekly forecast
                            updateWeeklyForecast(currentUnit);
                        })
                        .catch(error => {
                            console.error('Error fetching geolocation forecast data:', error);
                        });
                    },
                    // Error callback
                    function(error) {
                        console.error('Geolocation error:', error);
                        alert('Unable to get your location. Please check your browser settings.');
                    }
                );
            } else {
                alert('Geolocation is not supported by your browser.');
            }
        });
    }
    
    // Initialize the app with default settings
    updateTemperatureDisplay('celsius');
});